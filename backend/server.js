import express from 'express';
import cors from 'cors';
import moviesRoutes from './routes/movies.js';
import seatsRoutes from './routes/seats.js';
import bookingsRoutes from './routes/bookings.js';
// import usersRoutes from './routes/users.js';

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use('/movies', moviesRoutes);
app.use('/seats', seatsRoutes);
app.use('/bookings', bookingsRoutes);
// app.use('/api/users', usersRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
