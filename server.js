require("dotenv").config();

const express = require("express");
const steam = require("./steam");

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Steam Discord Widget работает 🚀");
});

app.get("/stats", async (req, res) => {

    try {

        const stats = await steam.getStats();

        res.json(stats);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Не удалось получить статистику Steam"
        });

    }

});

app.listen(PORT, () => {

    console.log(`Сервер запущен на порту ${PORT}`);

});