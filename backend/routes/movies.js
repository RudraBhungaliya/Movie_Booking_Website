import express from 'express';
import { initDB } from '../database.js';

const router = express.Router();

// This route finds a single movie by its ID
// GET /movies/1, GET /movies/2, etc.
router.get('/:id', async (req, res) => {
  try {
    const conn = await initDB();
    const [rows] = await conn.execute('SELECT * FROM movies WHERE movie_id = ?', [req.params.id]);
    
    if (rows.length > 0) {
      res.json({ success: true, movie: rows[0] });
    } else {
      res.status(404).json({ success: false, error: 'Movie not found' });
    }
  } catch (err) {
    console.error("Database error getting movie by ID:", err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

export default router;