// Імпортуємо необхідні модулі
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Масив для зберігання графів
const graphs = [
    {
        nodes: [
            { x: 100, y: 600, isGround: true },
            { x: 100, y: 420, isGround: false },
            { x: 100, y: 300, isGround: false },
            { x: 200, y: 100, isGround: false },
            { x: 340, y: 300, isGround: false },
            { x: 340, y: 420, isGround: false },
            { x: 600, y: 100, isGround: false },
            { x: 700, y: 300, isGround: false },
            { x: 500, y: 600, isGround: true },
            { x: 500, y: 340, isGround: false },
            { x: 700, y: 340, isGround: false },
            { x: 700, y: 600, isGround: true },
        ],
        edges: [
            { from: 0, to: 1 },
            { from: 1, to: 2 },
            { from: 2, to: 3 },
            { from: 1, to: 5 },
            { from: 4, to: 5 },
            { from: 2, to: 4 },
            { from: 3, to: 6 },
            { from: 4, to: 7 },
            { from: 6, to: 7 },
            { from: 7, to: 10 },
            { from: 8, to: 9 },
            { from: 9, to: 10 },
            { from: 10, to: 11 },
        ],
    },
];

// Вмикаємо парсер для JSON
app.use(bodyParser.json());

// Маршрут для отримання всіх графів
app.get("/graphs", (req, res) => {
    res.json(graphs);
});

// Маршрут для додавання нового графа
app.post("/graphs", (req, res) => {
    const newGraph = req.body;

    if (!newGraph.nodes || !newGraph.edges) {
        return res.status(400).json({ error: "Graph must contain nodes and edges." });
    }

    graphs.push(newGraph);
    res.status(201).json({ message: "Graph added successfully.", graphs });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
