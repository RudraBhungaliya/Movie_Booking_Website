import db from '../database.js';

export const getSeatsByMovie = async (req, res) => {
    const { movieId } = req.params;

    try {
        const [bookings] = await db.query(
            `SELECT bs.id as booked_seat_id, s.seat_number
             FROM booked_seats bs
             JOIN bookings b ON b.id = bs.booking_id
             JOIN seats s ON s.id = bs.seat_id
             WHERE b.movie_id = ?`,
            [movieId]
        );

        const [seats] = await db.query(`SELECT * FROM seats`);
        const bookedSeatNumbers = bookings.map(b => b.seat_number);
        res.json({ seats, bookedSeatNumbers });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
