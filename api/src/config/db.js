const { Pool } = require('pg');
require('dotenv').config();

const USE_URL = process.env.DATABASE_URL || process.env.DB_URL;
const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined;

const pool = USE_URL
  ? new Pool({
      connectionString: USE_URL,
      ssl,
      max: 10,
      idleTimeoutMillis: 30000,
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'db_mbg',
      ssl,
      max: 10,
      idleTimeoutMillis: 30000,
    });

// Translate mysql-style `?` placeholders to postgres `$1, $2, ...`
const translatePlaceholders = (sql) => {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
};

/**
 * mysql2-compatible `execute`.
 * - SELECT                     -> [rows, []]
 * - INSERT (no RETURNING)      -> [{ insertId, affectedRows }, []]  (auto-appends RETURNING id)
 * - UPDATE / DELETE            -> [{ affectedRows }, []]
 */
const execute = async (sql, params = []) => {
  const pgSql = translatePlaceholders(sql);
  const isInsert = /^\s*INSERT/i.test(pgSql) && !/\bRETURNING\b/i.test(pgSql);
  const finalSql = isInsert ? `${pgSql} RETURNING id` : pgSql;

  const result = await pool.query(finalSql, params);

  if (isInsert) {
    const insertId = result.rows[0] ? Number(result.rows[0].id) : null;
    return [{ insertId, affectedRows: result.rowCount }, []];
  }
  if (/^\s*SELECT/i.test(pgSql)) {
    return [result.rows, []];
  }
  return [{ affectedRows: result.rowCount }, []];
};

// Test connection on startup
(async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database Connected via PostgreSQL!');
    client.release();
  } catch (err) {
    console.error('⚠️  Database connection check failed (continuing, queries will error individually):', err.message);
  }
})();

module.exports = {
  pool,
  execute,
  raw: (sql, params = []) => pool.query(sql, params),
};