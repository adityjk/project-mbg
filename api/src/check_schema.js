const mysql = require('mysql2');
require('dotenv').config({ path: './.env' }); // CWD is api root

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
  
  const sql = "SHOW COLUMNS FROM users LIKE 'role'";
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Query failed:', err);
    } else {
      console.log('Role Column Schema:', results);
      if (results.length > 0) {
          console.log('Type:', results[0].Type);
      }
    }
    db.end();
  });
});
