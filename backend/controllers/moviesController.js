import db from '../database.js';

export const getAllMovies = async (req, res) => {
    try {
        const [movies] = await db.query("SELECT * FROM movies");
        res.json(movies);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
