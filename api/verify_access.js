
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '/home/zigoat/Documents/Project/mbg/api/.env' });

const API_URL = 'http://localhost:5000/api';

async function verify() {
  console.log('--- STARTING VERIFICATION (using fetch) ---');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db_mbg',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
  });

  const uniqueId = Date.now();
  const adminUser = `admin_test_${uniqueId}`;
  const nutriUser = `nutri_test_${uniqueId}`;
  const password = 'password123';

  // Helper for requests
  const post = async (url, data, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const res = await fetch(API_URL + url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    
    const json = await res.json().catch(() => ({}));
    return { status: res.status, data: json, ok: res.ok };
  };

  try {
    console.log('1. Creating test users...');
    
    // Register Admin Candidate
    await post('/register', {
      username: adminUser,
      password: password,
      school_name: 'Test School'
    });

    // Register Nutri Candidate
    await post('/register', {
      username: nutriUser,
      password: password,
      school_name: 'Test School'
    });

    // Update their roles in DB
    await connection.execute('UPDATE users SET role = ? WHERE username = ?', ['admin', adminUser]);
    await connection.execute('UPDATE users SET role = ? WHERE username = ?', ['petugas gizi', nutriUser]);

    console.log('   Users created and roles assigned.');

    // 2. Login to get tokens
    console.log('2. Logging in...');
    const adminLogin = await post('/login', { username: adminUser, password });
    const adminToken = adminLogin.data.token;
    
    const nutriLogin = await post('/login', { username: nutriUser, password });
    const nutriToken = nutriLogin.data.token;
    console.log('   Tokens received.');

    // 3. Test Admin Access (Should FAIL)
    console.log('3. Testing Admin Access to Create Menu (expecting 403)...');
    const adminRes = await post('/menus', {
      nama_menu: 'Test Menu Admin',
      deskripsi: 'Test',
      kalori: 100,
      karbohidrat: 10,
      protein: 10,
      lemak: 10,
      serat: 5,
      porsi: 'besar',
      jumlah_porsi: 10,
      foto_url: 'http://example.com/image.jpg',
      location: 'Test School'
    }, adminToken);

    if (adminRes.status === 403) {
      console.log('✅ PASS: Admin correctly denied (403).');
    } else {
      console.error(`❌ FAILED: Admin got status ${adminRes.status}`, adminRes.data);
    }

    // 4. Test Nutri Access (Should SUCCESS)
    console.log('4. Testing Nutri Access to Create Menu (expecting 201)...');
    const nutriRes = await post('/menus', {
      nama_menu: 'Test Menu Nutri',
      deskripsi: 'Test',
      kalori: 100,
      karbohidrat: 10,
      protein: 10,
      lemak: 10,
      serat: 5,
      porsi: 'besar',
      jumlah_porsi: 10,
      foto_url: 'http://example.com/image.jpg',
      location: 'Test School'
    }, nutriToken);

    let menuId = null;
    if (nutriRes.status === 201) {
      console.log('✅ PASS: Nutri successfully created menu.');
      menuId = nutriRes.data.id;
    } else {
      console.error(`❌ FAILED: Nutri failed to create menu. Status: ${nutriRes.status}`, nutriRes.data);
    }

    // Cleanup
    console.log('5. Cleaning up...');
    if (menuId) await connection.execute('DELETE FROM menus WHERE id = ?', [menuId]);
    await connection.execute('DELETE FROM users WHERE username IN (?, ?)', [adminUser, nutriUser]);
    console.log('   Cleanup done.');

  } catch (error) {
    console.error('CRITICAL ERROR:', error.message);
  } finally {
    await connection.end();
  }
}

verify();
