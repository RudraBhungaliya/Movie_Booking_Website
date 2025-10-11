import express from 'express';
import { initDB } from '../database.js';

const router = express.Router();

router.get('/list', async (req, res) => {
  try {
    const conn = await initDB();
    const sql = `
      SELECT 
        b.booking_id, b.show_datetime, b.number_of_tickets, b.total_amount, b.booking_status,
        m.title AS movie_title,
        s.screen_name,
        (SELECT GROUP_CONCAT(bs.seat_number SEPARATOR ', ') FROM booked_seats bs WHERE bs.booking_id = b.booking_id) AS seats
      FROM bookings AS b
      JOIN movies AS m ON b.movie_id = m.movie_id
      JOIN screens AS s ON b.screen_id = s.screen_id
      ORDER BY b.booked_at DESC
    `;
    const [rows] = await conn.execute(sql);
    res.json({ success: true, bookings: rows });
  } catch (err) {
    console.error("Database Error in /list:", err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

router.post('/add', async (req, res) => {
  const { user_id, movie_id, screen_id, show_datetime, seats, number_of_tickets, total_amount } = req.body;

  if (!user_id || !movie_id || !screen_id || !show_datetime || !seats || seats.length === 0) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const conn = await initDB();
  try {
    await conn.beginTransaction();
    const bookingSql = `
      INSERT INTO bookings (user_id, movie_id, screen_id, show_datetime, number_of_tickets, total_amount, booking_status)
      VALUES (?, ?, ?, ?, ?, ?, 'Confirmed')
    `;
    const [bookingResult] = await conn.execute(bookingSql, [user_id, movie_id, screen_id, show_datetime, number_of_tickets, total_amount]);
    const bookingId = bookingResult.insertId;

    const seatSql = `INSERT INTO booked_seats (booking_id, seat_number) VALUES (?, ?)`;
    for (const seat of seats) {
      await conn.execute(seatSql, [bookingId, seat]);
    }
    await conn.commit();
    res.json({ success: true, booking_id: bookingId });
  } catch (err) {
    await conn.rollback();
    console.error("Database Error in /add:", err);
    res.status(500).json({ success: false, error: 'Database error', details: err.message });
  }
});

export default router;