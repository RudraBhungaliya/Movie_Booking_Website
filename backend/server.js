import express from "express";
import cors from "cors";
import connection from "./database.js";
import moviesRoutes from "./routes/movies.js";
import seatsRoutes from "./routes/seats.js";
import bookingsRoutes from "./routes/bookings.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/movies", moviesRoutes);
app.use("/seats", seatsRoutes);
app.use("/bookings", bookingsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
