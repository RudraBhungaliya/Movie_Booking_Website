import express from "express";
import { initDB } from "../database.js";

const router = express.Router();

// ➕ Add a new showtime
router.post("/add", async (req, res) => {
  const { movie_id, screen_id, show_datetime, price_per_seat } = req.body;

  if (!movie_id || !screen_id || !show_datetime || !price_per_seat) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields" });
  }

  try {
    const conn = await initDB();
    const sql = `
      INSERT INTO showtimes (movie_id, screen_id, show_datetime, price_per_seat)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await conn.execute(sql, [
      movie_id,
      screen_id,
      show_datetime,
      price_per_seat,
    ]);

    res.json({ success: true, insertId: result.insertId });
  } catch (err) {
    console.error("Database Error in /showtimes/add:", err);
    res
      .status(500)
      .json({ success: false, error: "Database error", details: err.message });
  }
});

export default router;
