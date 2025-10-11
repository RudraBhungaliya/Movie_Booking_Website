import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let connection;

export async function initDB() {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      namedPlaceholders: true,
    });
    console.log('✅ Database connected');
  }
  return connection;
}

if (process.argv[1].endsWith('database.js')) {
  (async () => {
    try {
      const conn = await initDB();
      console.log('Database connection successful!');
      await conn.end();
    } catch (err) {
      console.error('Connection failed:', err.message);
    }
  })();
}
