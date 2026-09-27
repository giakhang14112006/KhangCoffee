import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool = null;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'khangcoffee',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
  });

  // Test connection silently
  pool.getConnection()
    .then(conn => {
      console.log('✅ Connected to MySQL Database successfully');
      conn.release();
    })
    .catch(err => {
      console.warn('⚠️ Could not connect to MySQL. Server will use mock fallback data mode until MySQL is configured.', err.message);
      pool = null;
    });
} catch (error) {
  console.warn('⚠️ Error initializing MySQL pool:', error.message);
  pool = null;
}

export default pool;
