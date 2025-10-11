import express from 'express';
import { initDB } from '../database.js';

const router = express.Router();

router.get('/list', async (req, res) => {
  try {
    const conn = await initDB();
    const [rows] = await conn.execute('SELECT * FROM seats ORDER BY seat_number ASC');
    res.json({ success: true, seats: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

export default router;
