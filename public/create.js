const theme = localStorage.getItem("selectedTheme");
if(theme === "Чорний"){
    edgeColor = 'DimGrey';
    SelectedColor = '#333333';
    DeletedColor = 'LightSlateGrey';
}else if (theme === "Зелень"){
    edgeColor = 'DarkGreen';
    SelectedColor = 'Chartreuse';
    DeletedColor = 'LightSlateGray';
}else if(theme === "Білий"){
    edgeColor = 'RosyBrown';
    SelectedColor = 'Maroon';
    DeletedColor = 'Wheat';
}else if(theme === "Квіочки"){
    edgeColor = 'MediumSlateBlue';
    SelectedColor = 'Orchid';
    DeletedColor = 'LightBlue';
}
let futureGraph = {
    name: "",
    nodes: [],
    edges: []
};

const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const nameInput = document.getElementById('nameInput');
const saveButton = document.getElementById('saveCreat');
const addNodeBtn = document.getElementById('AddNode');
const addEdgeBtn = document.getElementById('AddEdges');
const clearAllBtn = document.getElementById('ClearAll');

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
        ctx.fillStyle = node.isGround ? '#4CAF50' :
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
        const isGround = Math.abs(y - groundY) < groundThreshold;
        futureGraph.nodes.push({
            x: x,
            y: y,
            isGround: isGround
        });
        drawGraph();
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

    this.style.backgroundColor = isAddingNodes ? '#ff9999' : '';
    addEdgeBtn.style.backgroundColor = '';
    canvas.style.cursor = isAddingNodes ? 'crosshair' : 'default';
});

addEdgeBtn.addEventListener('click', function() {
    isAddingEdges = !isAddingEdges;
    isAddingNodes = false;

    this.style.backgroundColor = isAddingEdges ? '#ff9999' : '';
    addNodeBtn.style.backgroundColor = '';
    canvas.style.cursor = isAddingEdges ? 'pointer' : 'default';

    if (!isAddingEdges) {
        selectedNodeIndex = null;
        drawGraph();
    }
});

saveButton.addEventListener('click', async function() {
    if (futureGraph.edges.length === 0) {
        alert('Додайте хоча б одне ребро!');
        return;
    }
    const hasGroundNode = futureGraph.nodes.some(node => node.isGround);
    if (!hasGroundNode) {
        alert('Додайте хоча б одну точку землі (на лінії внизу)!');
        return;
    }
    if (!nameInput.value.trim()) {
        alert("Будь ласка, дайте назву вашому графу!");
        nameInput.focus();
        return;
    }
    futureGraph.name = nameInput.value.trim();

    try {
        const response = await fetch('http://localhost:3000/graphs', {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify(futureGraph)
        });
        if (response.ok) {
            alert('Граф успішно збережено!');
            window.location.href = 'index.html';
        } else {
            throw new Error('Помилка при збереженні');
        }
    } catch (error) {
        console.error('Помилка:', error);
        alert('Сталася помилка при збереженні графа');
    }
});

clearAllBtn.addEventListener('click', function() {
    futureGraph = {
        name: "",
        nodes: [],
        edges: []
    };

    nameInput.value = "";

    isAddingNodes = false;
    isAddingEdges = false;
    selectedNodeIndex = null;

    addNodeBtn.style.backgroundColor = '';
    addEdgeBtn.style.backgroundColor = '';
    canvas.style.cursor = 'default';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGroundLine();
});

window.addEventListener('load', function() {
    setupCanvas();
    canvas.addEventListener('click', handleCanvasClick);
});