const theme = localStorage.getItem("selectedTheme");
if(theme === "Чорний"){
    edgeColor = '#b0b0b4';
    SelectedColor = '#ebebec';
    Buthon = '#4e4e56';
}else if (theme === "Зелень"){
    edgeColor = '#6c8c6e';
    SelectedColor = '#364637';
    Buthon = '#578527';
}else if(theme === "Білий"){
    edgeColor = '#409CD1';
    SelectedColor = '#f09609';
    Buthon = '#F09609';
}else if(theme === "Квіочки"){
    edgeColor = '#994D8D';
    SelectedColor = '#6b3562';
    Buthon = '#BD70A2';
}
let futureGraph = {
    name: "",
    nodes: [],
    edges: []
};

const MAX_NODES = 50;

const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const nameInput = document.getElementById('nameInput');
const saveButton = document.getElementById('saveCreat');
const addNodeBtn = document.getElementById('AddNode');
const addEdgeBtn = document.getElementById('AddEdges');
const clearAllBtn = document.getElementById('ClearAll');
const AlertDiv = document.getElementById('alert');

let isAddingNodes = false;
let isAddingEdges = false;
let selectedNodeIndex = null;

function drawGroundLine() {
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 15);
    ctx.lineTo(canvas.width, canvas.height - 15);
    ctx.strokeStyle = edgeColor;
    ctx.setLineDash([10, 5]);
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.setLineDash([]);
}

function setupCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.fillStyle = edgeColor;
    ctx.strokeStyle = edgeColor;
    ctx.lineWidth = 2;
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    drawGroundLine()
}

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGroundLine()
    futureGraph.edges.forEach(edge => {
        const fromNode = futureGraph.nodes[edge.from];
        const toNode = futureGraph.nodes[edge.to];
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.lineWidth = 5;
        ctx.stroke();
});

    futureGraph.nodes.forEach((node, index) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = node.isGround ? Buthon :
            (index === selectedNodeIndex ? SelectedColor : edgeColor);
        ctx.fill();
        ctx.fillStyle = edgeColor;
        ctx.fillText(index, node.x, node.y - 15);
});
}

function findClosestNode(x, y, threshold = 15) {
    for (let i = 0; i < futureGraph.nodes.length; i++) {
        const node = futureGraph.nodes[i];
        const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
        if (distance < threshold) return i;
    }
    return null;
}

function handleCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const groundY = canvas.height - 15;
    const groundThreshold = 10;

    if (isAddingNodes) {
        if (futureGraph.nodes.length < MAX_NODES) {
            const isGround = Math.abs(y - groundY) < groundThreshold;
            futureGraph.nodes.push({
                x: x,
                y: y,
                isGround: isGround
            });
            drawGraph();
        } else {
            AlertDiv.innerText =  `Досягнуто максимум ${MAX_NODES} вузлів!`;
        }
    }
    else if (isAddingEdges) {
        const nodeIndex = findClosestNode(x, y);

        if (nodeIndex !== null) {
            if (selectedNodeIndex === null) {
            selectedNodeIndex = nodeIndex;
            } else {
                const edgeExists = futureGraph.edges.some(edge =>
                    (edge.from === selectedNodeIndex && edge.to === nodeIndex) ||
                    (edge.from === nodeIndex && edge.to === selectedNodeIndex)
                );

                if (!edgeExists && selectedNodeIndex !== nodeIndex) {
                    futureGraph.edges.push({
                        from: selectedNodeIndex,
                        to: nodeIndex
                    });
                }
                selectedNodeIndex = null;
            }
            drawGraph();
        }
    }
}

addNodeBtn.addEventListener('click', function() {
    isAddingNodes = !isAddingNodes;
    isAddingEdges = false;
    selectedNodeIndex = null;

    this.style.backgroundColor = isAddingNodes ? Buthon : '';
    addEdgeBtn.style.backgroundColor = '';
    canvas.style.cursor = isAddingNodes ? 'crosshair' : 'default';
});

addEdgeBtn.addEventListener('click', function() {
    isAddingEdges = !isAddingEdges;
    isAddingNodes = false;

    this.style.backgroundColor = isAddingEdges ? Buthon : '';
    addNodeBtn.style.backgroundColor = '';
    canvas.style.cursor = isAddingEdges ? 'pointer' : 'default';

    if (!isAddingEdges) {
        selectedNodeIndex = null;
        drawGraph();
    }
});

saveButton.addEventListener('click', async function() {
    if (futureGraph.edges.length === 0) {
        AlertDiv.innerText =  "Додайте хоча б одне ребро!";
        return;
    }
    const hasGroundNode = futureGraph.nodes.some(node => node.isGround);
    if (!hasGroundNode) {
        AlertDiv.innerText =  "Додайте хоча б одну точку землі (на лінії внизу)!";
        return;
    }
    if (!nameInput.value.trim()) {
        AlertDiv.innerText =  "Будь ласка, дайте назву вашому графу!";
        nameInput.focus();
        return;
    }
    futureGraph.name = nameInput.value.trim();

    try {
        const response = await fetch('/graphs', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(futureGraph)
        });

        if (response.ok) {
            window.location.href = 'index.html';
            return;
        }

        // Обробка специфічних HTTP статусів
        if (response.status === 409) {
            AlertDiv.innerText =  `Граф з назвою "${futureGraph.name}" вже існує!`;

        }

        throw new Error(`Помилка сервера: ${response.status}`);

    } catch (error) {
        if (error.message.includes('вже існує')) {
            alert(error.message);
        } else {
            alert('Сталася помилка при збереженні графа: ' + error.message);
        }
    }
});

clearAllBtn.addEventListener('click', function() {
    futureGraph = {
        name: "",
        nodes: [],
        edges: []
    };

    nameInput.value = "";
    AlertDiv.innerText =  "";

    isAddingNodes = false;
    isAddingEdges = false;
    selectedNodeIndex = null;

    addNodeBtn.style.backgroundColor = '';
    addEdgeBtn.style.backgroundColor = '';
    canvas.style.cursor = 'default';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGroundLine();
});

document.querySelector('#nameInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Забороняє стандартне оновлення
        this.blur();
    }
});

window.addEventListener('load', function() {
    setupCanvas();
    canvas.addEventListener('click', handleCanvasClick);
});
