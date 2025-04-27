const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'graphs.json');

app.use(bodyParser.json());

// Завантажуємо графи з файлу
function loadGraphs() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        // Якщо файл не існує, повертаємо пустий масив
        return [];
    }
}

// Зберігає графи у файл
function saveGraphs(graphs) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(graphs, null, 2), 'utf8');
}

// Додаємо початкові дані, якщо файл порожній
if (loadGraphs().length === 0) {
    const initialGraphs = [
        {
            id: 1,
            name: "Приклад графу",
            nodes: [
                { x: 200, y: 600, isGround: true },
                { x: 500, y: 600, isGround: true },
                { x: 500, y: 480, isGround: false },
                // ... інші вузли
            ],
            edges: [
                { from: 0, to: 7 },
                { from: 5, to: 7 },
                // ... інші зв'язки
            ]
        }
    ];
    saveGraphs(initialGraphs);
}

// Отримати всі графи
app.get('/graphs', (req, res) => {
    const graphs = loadGraphs();
    res.json(graphs);
});

// Отримати конкретний граф по ID
app.get('/graphs/:id', (req, res) => {
    const graphs = loadGraphs();
    const graph = graphs.find(g => g.id === parseInt(req.params.id));

    if (!graph) {
        return res.status(404).json({ error: 'Graph not found' });
    }

    res.json(graph);
});

// Додати новий граф
app.post('/graphs', (req, res) => {
    const graphs = loadGraphs();
    const newGraph = req.body;

    // Перевірка обов'язкових полів
    if (!newGraph.name || !newGraph.nodes || !newGraph.edges) {
        return res.status(400).json({ error: 'Missing required fields: name, nodes, edges' });
    }

    // Перевірка на унікальність назви (case insensitive)
    const nameExists = graphs.some(
        graph => graph.name.toLowerCase() === newGraph.name.trim().toLowerCase()
    );

    if (nameExists) {
        return res.status(409).json({ error: 'Graph with this name already exists' });
    }

    // Генеруємо новий ID
    newGraph.id = graphs.length > 0 ? Math.max(...graphs.map(g => g.id)) + 1 : 1;

    graphs.push(newGraph);
    saveGraphs(graphs);

    res.status(201).json(newGraph);
});

// Оновити існуючий граф
app.put('/graphs/:id', (req, res) => {
    const graphs = loadGraphs();
    const graphIndex = graphs.findIndex(g => g.id === parseInt(req.params.id));

    if (graphIndex === -1) {
        return res.status(404).json({ error: 'Graph not found' });
    }

    const updatedGraph = req.body;
    updatedGraph.id = parseInt(req.params.id);

    graphs[graphIndex] = updatedGraph;
    saveGraphs(graphs);

    res.json(updatedGraph);
});

// Видалити граф
app.delete('/graphs/:id', (req, res) => {
    const graphs = loadGraphs();
    const filteredGraphs = graphs.filter(g => g.id !== parseInt(req.params.id));

    if (filteredGraphs.length === graphs.length) {
        return res.status(404).json({ error: 'Graph not found' });
    }

    saveGraphs(filteredGraphs);
    res.status(204).send();
});

app.get('/graphs-minimal', (req, res) => {
    const graphs = loadGraphs(); // Ваша функція для завантаження графів
    const minimalData = graphs.map(graph => ({
        id: graph.id,
        name: graph.name || "Без назви"
    }));
    res.json(minimalData);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.use(express.static('public'));