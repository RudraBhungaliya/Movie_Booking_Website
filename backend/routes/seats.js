import express from "express";
import connection from "../database.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const [rows] = await connection.query("SELECT * FROM seats");
  res.json(rows);
});

export default router;
