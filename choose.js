
document.addEventListener("DOMContentLoaded", function () {
    const gameMode = localStorage.getItem("gameMode");

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

let selectedGraphNumber = null;
const graphElements = document.querySelectorAll('.testGraph');

graphElements.forEach((el) => {
el.addEventListener('click', function () {
graphElements.forEach(e => e.classList.remove('selected'));
el.classList.add('selected');
selectedGraphNumber = el.dataset.id;
});
});

const playButton = document.getElementById("play-button");
playButton.addEventListener("click", function () {
if (selectedGraphNumber === null) {
document.getElementById('graph-dumb').innerText = "Вибери на чому грати, дебіл!";
return;
}
localStorage.setItem("selectedGraphNumber", selectedGraphNumber);

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
});

