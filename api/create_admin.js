require('dotenv').config();
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_mbg',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

const createAdmin = async () => {
  const username = 'admin SPPG';
  const password = 'adminSPPGmbg';
  const school_name = 'Kantor Pusat MBG';
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const sql = "INSERT INTO users (username, password, school_name, role) VALUES (?, ?, ?, 'admin')";
    
    db.connect(err => {
      if (err) {
        console.error('Database connection failed:', err);
        return;
      }
      console.log('Connected to database...');

      console.log('Connected to database...');

      // Delete if exists to update password
      db.query("DELETE FROM users WHERE username = ?", [username], (err) => {
          if (err) console.log('Error deleting (might not exist):', err.message);
          
          db.query(sql, [username, hashedPassword, school_name], (err, result) => {
            if (err) {
              console.error('Error creating admin:', err.message);
            } else {
              console.log('✅ Admin account created successfully!');
              console.log(`Username: ${username}`);
              console.log(`Password: ${password}`);
            }
            db.end();
          });
      });
    });
  } catch (err) {
    console.error('Error:', err);
  }
};

createAdmin();
