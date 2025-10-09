import db from '../database.js';

export const createBooking = async (req, res) => {
    const { userId, movieId, selectedSeats } = req.body;

    if (!userId || !movieId || !selectedSeats?.length) 
        return res.status(400).json({ message: "Invalid data" });

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [existing] = await connection.query(
            `SELECT bs.seat_id FROM booked_seats bs
             JOIN bookings b ON bs.booking_id = b.id
             WHERE b.movie_id = ? AND bs.seat_id IN (?)`,
            [movieId, selectedSeats]
        );

        if (existing.length) {
            await connection.rollback();
            return res.status(400).json({ message: "Some seats already booked" });
        }

        const [bookingResult] = await connection.query(
            "INSERT INTO bookings (movie_id, customer_name) VALUES (?, ?)",
            [movieId, userId]
        );

        const bookingId = bookingResult.insertId;
        const seatValues = selectedSeats.map(seatId => [bookingId, seatId]);
        await connection.query(
            "INSERT INTO booked_seats (booking_id, seat_id) VALUES ?",
            [seatValues]
        );

        await connection.commit();
        res.json({ message: "Booking confirmed" });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ message: err.message });
    } finally {
        connection.release();
    }
};

export const getUserBookings = async (req, res) => {
    const { userId } = req.params;

    try {
        const [bookings] = await db.query(
            `SELECT b.id as booking_id, m.title, s.seat_number
             FROM bookings b
             JOIN movies m ON m.id = b.movie_id
             JOIN booked_seats bs ON bs.booking_id = b.id
             JOIN seats s ON s.id = bs.seat_id
             WHERE b.customer_name = ?`,
            [userId]
        );

        const grouped = bookings.reduce((acc, curr) => {
            if (!acc[curr.booking_id]) {
                acc[curr.booking_id] = { title: curr.title, seats: [] };
            }
            acc[curr.booking_id].seats.push(curr.seat_number);
            return acc;
        }, {});

        res.json(Object.values(grouped));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
