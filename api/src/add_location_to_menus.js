const mysql = require('mysql2');
require('dotenv').config({ path: './.env' });

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to database.');

  const sql = "ALTER TABLE menus ADD COLUMN location VARCHAR(255) DEFAULT NULL";
  
  db.query(sql, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('Column "location" already exists.');
      } else {
        console.error('Failed to add column:', err);
      }
    } else {
      console.log('Successfully added "location" column to menus table.');
    }
    db.end();
  });
});
