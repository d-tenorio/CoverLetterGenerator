const aboutButton = document.getElementById('aboutButton');
const aboutText = document.getElementById('aboutText');

aboutButton.addEventListener('click', () => {
    aboutText.style.display = aboutText.style.display === 'none' ? 'block' : 'none';
});