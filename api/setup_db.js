const mysql = require('mysql2');
require('dotenv').config({ path: './src/.env' }); // Adjust path if needed, assuming run from api root

// Connect to MySQL server (not specific database yet to check/create DB if needed, but here we assume DB exists)
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db_mbg',
  multipleStatements: true
});

db.connect(err => {
  if (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }
  console.log("Connected to database.");

  const queries = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
      school_name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    ALTER TABLE reports ADD COLUMN menu_id INT DEFAULT NULL;
    ALTER TABLE reports ADD CONSTRAINT fk_menu FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE SET NULL;
  `;

  // We need to be careful with ALTER TABLE if column exists. 
  // Simple approach: Check if column exists first or use a stored procedure, 
  // but for this environment, we can just try/catch or ignore specific error 1060 (Duplicate column name).
  
  // Let's do it defensively for the column
  const checkColumn = "SHOW COLUMNS FROM reports LIKE 'menu_id'";
  
  db.query(checkColumn, (err, results) => {
    if (err) {
      console.error("Error checking column:", err);
      // Proceed to create users table anyway
      createUsersTable();
      return;
    }

    if (results.length === 0) {
      console.log("Adding menu_id to reports...");
      db.query("ALTER TABLE reports ADD COLUMN menu_id INT DEFAULT NULL", (err) => {
        if (err) console.error("Error adding column:", err.message);
        else {
             console.log("Column menu_id added.");
             addFK();
        }
      });
    } else {
      console.log("Column menu_id already exists.");
      createUsersTable();
    }
  });

  function addFK() {
      db.query("ALTER TABLE reports ADD CONSTRAINT fk_menu FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE SET NULL", (err) => {
          if (err && err.code !== 'ER_DUP_KEY') console.error("Error adding FK:", err.message); // ER_DUP_KEY if constraint exists
          else console.log("Foreign Key added.");
          createUsersTable();
      });
  }

  function createUsersTable() {
    db.query(`
        CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
        school_name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error("Error creating users table:", err.message);
        else console.log("Users table ready.");
        
        // Seed Admin if not exists
        // Password: 'admin' (hashed needs bcrypt, but for now we will update server to hash. 
        // actually we should insert hashed password here to be safe. 
        // equivalent of bcrypt.hashSync('admin', 10) -> $2a$10$X.x... (placeholder)
        // For simplicity let's register via API later, or seed a default one.
        // Let's NOT seed to avoid conflict/complexity. User can register.
        
        console.log("Database setup complete.");
        db.end();
    });
  }
});
