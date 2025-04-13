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

const radioButtons = document.querySelectorAll('input[name="options"]');
const stylesheet = document.getElementById('themeStylesheet');

const themes = {
    "Зелень": "menu_css/menu_green.css",
    "Квіочки": "menu_css/menu_flowers.css",
    "Чорний": "menu_css/menu_black.css",
    "Білий": "menu_css/menu_white.css"
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
}

radioButtons.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.checked) {
            const selectedTheme = this.value;
            localStorage.setItem('selectedTheme', selectedTheme);
            stylesheet.href = themes[selectedTheme];
        }
    });
});
