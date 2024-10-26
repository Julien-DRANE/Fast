const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const backgroundMusic = document.getElementById('backgroundMusic');

// Ajuster la taille du canevas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Lecture automatique de la musique (nécessite une interaction utilisateur pour certains navigateurs)
window.addEventListener('touchstart', () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
    }
}, { once: true });

// Variables du jeu
let score = 0;
let lineThickness = 20; // Épaisseur initiale de la bande rouge
const initialThickness = 20;
let currentThickness = lineThickness;

const fillDuration = 800; // Durée de remplissage en millisecondes
let currentFill = 0; // En pixels
let startTime = null;

const greenThreshold = 0.95; // 95% rempli

// Fonction de dessin
function draw(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    // Calculer le remplissage en fonction du temps écoulé
    const fillRatio = elapsed / fillDuration;
    currentFill = fillRatio * canvas.height;

    // Déterminer la couleur
    let color;
    if (fillRatio >= greenThreshold && fillRatio < 1) {
        color = 'green';
    } else {
        color = 'red';
    }

    // Dessiner la bande
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.fillRect(0, canvas.height - currentFill, canvas.width, currentThickness);

    // Vérifier si le remplissage est complet
    if (fillRatio >= 1) {
        // Game Over ou réinitialisation
        resetGame();
        return;
    }

    // Continuer la boucle de jeu
    requestAnimationFrame(draw);
}

// Fonction de réinitialisation
function resetGame() {
    currentFill = 0;
    currentThickness = initialThickness;
    score = 0;
    updateScore();
    startTime = null;
    // Vous pouvez ajouter des animations ou des messages de fin ici
}

// Fonction de mise à jour du score
function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

// Gestion de l'appui
canvas.addEventListener('touchstart', handleTap);
canvas.addEventListener('click', handleTap); // Pour les tests sur ordinateur

function handleTap() {
    const fillRatio = currentFill / canvas.height;
    if (fillRatio >= greenThreshold && fillRatio < 1) {
        // Succès
        score += 1;
        updateScore();
        // Diviser l'épaisseur par deux, minimum 1
        currentThickness = Math.max(currentThickness / 2, 1);
        // Réinitialiser le remplissage
        currentFill = 0;
        startTime = null;
    } else {
        // Optionnel: Feedback en cas d'erreur
    }
}

// Boucle de jeu initiale
requestAnimationFrame(draw);
