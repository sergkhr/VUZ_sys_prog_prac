import express from "express";
import pool from "./db.js";
import cors from "cors";

const app = express();
app.use(cors({
    origin: "*" //пока что разрешено только с локала кидать запросы
}));

app.use(express.json());

/* ===== Проверка подключения ===== */

app.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT 1");
        res.json({ status: "DB connected", rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ===== Получить все таблицы ===== */

app.get("/tables", async (req, res) => {
    try {
        const [rows] = await pool.query("SHOW TABLES");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ===== Выполнить любой SQL ===== */

app.post("/query", async (req, res) => {
    const { query } = req.body;

    try {
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});