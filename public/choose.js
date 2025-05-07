const gameMode = localStorage.getItem("gameMode");
let selectedGraphNumber = null;
let selectedGraphId = null;
const graphElements = document.querySelectorAll('.testGraph');
const graphList = document.getElementById('graph-list');
const playButton = document.getElementById("play-button");

document.addEventListener("DOMContentLoaded", function () {
    const singlePlayerSection = document.getElementById("single-player-element");
    const twoPlayerSection = document.getElementById("two-player-element");

    if (gameMode === "singlePlayer") {
        singlePlayerSection.style.display = "block";

        const savedDifficulty = localStorage.getItem("difficulty");
        if (savedDifficulty) {
            const difficultySelect = document.getElementById("difficulty");
            difficultySelect.value = savedDifficulty;
        }

    } else if (gameMode === "TwoPlayer") {
        twoPlayerSection.style.display = "block";

        const player1 = localStorage.getItem("player1");
        const player2 = localStorage.getItem("player2");

        if (player1) document.getElementById("player1").value = player1;
        if (player2) document.getElementById("player2").value = player2;
    }
});

graphElements.forEach((el) => {
    el.addEventListener('click', function () {
        if (el.classList.contains('selected')) {
            el.classList.remove('selected');
            selectedGraphNumber = null;
        } else {
            graphElements.forEach(e => e.classList.remove('selected'));
            el.classList.add('selected');
            selectedGraphNumber = el.dataset.id;
        }
    });
});

playButton.addEventListener("click", function () {
    if (selectedGraphNumber && selectedGraphId) {
        document.getElementById('graph-dumb').innerText = "Вибери щось одне!";
        return;
    }else if (selectedGraphNumber) {
        localStorage.setItem("selectedGraphNumber", selectedGraphNumber);
    } else if (selectedGraphId) {
        localStorage.setItem('selectedGraphId', selectedGraphId);
    } else {
        document.getElementById('graph-dumb').innerText = "Вибери малюнок!";
        return;
    }


    if (gameMode === "singlePlayer") {
        const difficulty = document.getElementById("difficulty").value;
        localStorage.setItem("difficulty", difficulty);
    } else if (gameMode === "TwoPlayer") {
        const player1 = document.getElementById("player1").value.trim();
        const player2 = document.getElementById("player2").value.trim();

        if (!player1 || !player2) {
            document.getElementById('graph-dumb').innerText = "Назвіть себе!";
            return;
        }

        localStorage.setItem("player1", player1);
        localStorage.setItem("player2", player2);
    }
     window.location.href = "play.html";
});

// Отримуємо елементи для пошуку
const searchInput = document.getElementById('graphSearch');

let allGraphs = []; // Тут зберігатимемо всі графи для пошуку

// Функція для фільтрації графів за назвою
function filterGraphsByName(searchText) {
    return allGraphs.filter(graph =>
        graph.name.toLowerCase().startsWith(searchText.toLowerCase())
    );
}

// Оновлена функція завантаження списку з пошуком
async function loadGraphsList(searchText = '') {
    try {
        // Завантажуємо графи тільки якщо ще не завантажені
        if (allGraphs.length === 0) {
            const response = await fetch('/graphs-minimal');
            allGraphs = await response.json();
        }

        // Фільтруємо графи за пошуковим запитом
        const filteredGraphs = searchText
            ? filterGraphsByName(searchText)
            : allGraphs;

        graphList.innerHTML = ''; // Очищаємо список

        if (filteredGraphs.length === 0) {
            graphList.innerHTML = '<li>Графів не знайдено</li>';
            return;
        }

        filteredGraphs.forEach(graph => {
            const listItem = document.createElement('li');
            listItem.textContent = graph.name;
            listItem.dataset.id = graph.id;

            listItem.addEventListener('click', () => {
                if (listItem.classList.contains('selected')) {
                    listItem.classList.remove('selected');
                    selectedGraphId = null;
                } else {
                    document.querySelectorAll('#graph-list li').forEach(item => {
                        item.classList.remove('selected');
                    });
                    listItem.classList.add('selected');
                    selectedGraphId = graph.id;
                }
            });

            graphList.appendChild(listItem);
        });

    } catch (error) {
        console.error('Помилка:', error);
        graphList.innerHTML = '<li>Не вдалося завантажити графи</li>';
    }
}

// Обробник пошуку при введенні тексту (реалізація пошуку "на льоту")
searchInput.addEventListener('input', () => {
    const searchText = searchInput.value.trim();
    loadGraphsList(searchText);
});

// Завантажуємо всі графи при завантаженні сторінки
window.addEventListener('DOMContentLoaded', () => loadGraphsList());

