import express from "express";
import connection from "../database.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { movie_id, customer_name, seat_ids } = req.body;

    if (!movie_id || !customer_name || !seat_ids || !seat_ids.length)
        return res.status(400).json({ error: "Invalid data" });

    try {
        const [bookingResult] = await connection.query(
            "INSERT INTO bookings (movie_id, customer_name) VALUES (?, ?)",
            [movie_id, customer_name]
        );
        const bookingId = bookingResult.insertId;

        const seatValues = seat_ids.map(seatId => `(${bookingId}, ${seatId})`).join(", ");
        await connection.query(`INSERT INTO booked_seats (booking_id, seat_id) VALUES ${seatValues}`);

        res.json({ success: true, bookingId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Booking failed" });
    }
});

router.get("/", async (req, res) => {
    const [rows] = await connection.query(`
    SELECT b.id as booking_id, b.customer_name, b.created_at, m.title,
    GROUP_CONCAT(s.seat_number) AS seats
    FROM bookings b
    JOIN movies m ON b.movie_id = m.id
    JOIN booked_seats bs ON bs.booking_id = b.id
    JOIN seats s ON s.id = bs.seat_id
    GROUP BY b.id
  `);
    res.json(rows);
});

export default router;
