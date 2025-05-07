document.getElementById("single-player-btn").addEventListener("click", function () {
    localStorage.setItem("gameMode", "singlePlayer");
    window.location.href = "choose.html";
});

document.getElementById("two-player-btn").addEventListener("click", function () {
    localStorage.setItem("gameMode", "TwoPlayer");
    window.location.href = "choose.html";
});

document.getElementById('goToPage').addEventListener('click', function() {
    window.location.href = 'create.html';
});

document.addEventListener("DOMContentLoaded", function () {
    localStorage.removeItem('gameMode');
    localStorage.removeItem('selectedGraphNumber');
    localStorage.removeItem('selectedGraphId');

    const radioButtons = document.querySelectorAll('input[name="options"]');
    const stylesheet = document.getElementById('themeStylesheet');

    const themes = {
        "Зелень": "CSS/green.css",
        "Квіочки": "CSS/flowers.css",
        "Чорний": "CSS/black.css",
        "Білий": "CSS/white.css"
    };

    const savedTheme = localStorage.getItem('selectedTheme');

    if (savedTheme && themes[savedTheme]) {
        stylesheet.href = themes[savedTheme];

        radioButtons.forEach(radio => {
            if (radio.value === savedTheme) {
                radio.checked = true;
            }
        });
    } else {
        document.querySelector('input[value="Зелень"]').checked = true;
        stylesheet.href = themes["Зелень"];
    }

    radioButtons.forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.checked) {
                const selectedTheme = this.value;
                localStorage.setItem('selectedTheme', selectedTheme);
                stylesheet.href = themes[selectedTheme];
            }
        });
    });
});