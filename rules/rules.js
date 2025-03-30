const showPopup = document.getElementById('showPopup');
const popupOverlay = document.getElementById('popupOverlay');
const closePopup = document.getElementById('closePopup');

showPopup.addEventListener('click', () => {
    popupOverlay.style.display = 'flex';
});

closePopup.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
});