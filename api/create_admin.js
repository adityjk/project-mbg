require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

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

const createAdmin = async () => {
  const username = 'admin SPPG';
  const password = 'adminSPPGmbg';
  const school_name = 'Kantor Pusat MBG';

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Connected to database...');

    // Delete if exists to update password
    await pool.query('DELETE FROM users WHERE username = $1', [username]);

    await pool.query(
      "INSERT INTO users (username, password, school_name, role) VALUES ($1, $2, $3, 'admin')",
      [username, hashedPassword, school_name]
    );

    console.log('✅ Admin account created successfully!');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
};

createAdmin();