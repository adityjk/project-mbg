const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  const USE_URL = process.env.DATABASE_URL || process.env.DB_URL;
  const ssl = process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined;

  const pool = USE_URL
    ? new Pool({ connectionString: USE_URL, ssl })
    : new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'db_mbg',
        ssl,
      });

  const dbName = process.env.DB_NAME || 'db_mbg';
  console.log(`📦 Using database: ${dbName}`);

  try {
    const schemaFile = path.resolve(__dirname, '../../../db_schema_pg.sql');
    const schemaSql = fs.readFileSync(schemaFile, 'utf8');
    const withoutComments = schemaSql
      .split('\n')
      .filter((line) => !line.trim().startsWith('--'))
      .join('\n');

    const statements = withoutComments
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      await pool.query(statement);
    }

    console.log('✅ All tables ready (users, schools, menus, reports, tim_sppg)');
    console.log('🎉 Database setup complete!');
  } catch (err) {
    console.error('❌ Database setup failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }

  process.exit(0);
}

setupDatabase();