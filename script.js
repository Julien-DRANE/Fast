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

const fillSpeed = 0.5; // Pixels par frame
let currentFill = 0;

const greenThreshold = 0.95; // 95% rempli

// Fonction de dessin
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Déterminer la couleur
    const fillRatio = currentFill / canvas.height;
    let color;
    if (fillRatio >= greenThreshold) {
        color = 'green';
    } else {
        color = 'red';
    }

    // Dessiner la bande
    ctx.fillStyle = color;
    ctx.fillRect(0, canvas.height - currentFill, canvas.width, currentThickness);

    // Mettre à jour la progression
    if (fillRatio < 1) {
        currentFill += fillSpeed;
    }

    // Vérifier si le remplissage est complet sans appui
    if (fillRatio >= 1) {
        // Game Over ou réinitialisation
        resetGame();
    }
}

// Fonction de réinitialisation
function resetGame() {
    currentFill = 0;
    currentThickness = initialThickness;
    score = 0;
    updateScore();
    // Optionnel: Arrêter la musique ou afficher un message de fin
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
    } else {
        // Optionnel: Feedback en cas d'erreur
    }
}

// Boucle de jeu
function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

// Démarrer la boucle de jeu
gameLoop();
