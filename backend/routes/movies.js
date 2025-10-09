import express from "express";
import connection from "../database.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const [rows] = await connection.query("SELECT * FROM movies");
  res.json(rows);
});

router.get("/:id", async (req, res) => {
  const [rows] = await connection.query("SELECT * FROM movies WHERE id = ?", [req.params.id]);
  res.json(rows[0]);
});

export default router;
