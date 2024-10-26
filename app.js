const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
const message = document.getElementById('message');
const instruction = document.getElementById('instruction');
const music = document.getElementById('backgroundMusic');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let totalPixels = 160; // Nombre initial de pixels
let pixels = []; // Tableau des cellules
let fillIndex = 0; // Index actuel de remplissage
let isFilling = false;
let fillStartTime = null;
const initialFillDuration = 1000; // Durée de remplissage en millisecondes (1 seconde)
let fillDuration = initialFillDuration;
let fillComplete = false;
let greenPhase = false;
let cellWidth = 0;
let cellHeight = 0;

// Fonction pour créer la grille de pixels, triée du centre vers les bords
function createGrid(totalPixels) {
    pixels = [];
    const aspectRatio = canvas.width / canvas.height;
    const cols = Math.ceil(Math.sqrt(totalPixels * aspectRatio));
    const rows = Math.ceil(totalPixels / cols);
    cellWidth = canvas.width / cols;
    cellHeight = canvas.height / rows;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (pixels.length >= totalPixels) break;
            const cellX = x * cellWidth;
            const cellY = y * cellHeight;
            const cellCenterX = cellX + cellWidth / 2;
            const cellCenterY = cellY + cellHeight / 2;
            const distance = Math.sqrt(Math.pow(cellCenterX - centerX, 2) + Math.pow(cellCenterY - centerY, 2));
            pixels.push({x: cellX, y: cellY, distance});
        }
    }

    // Trier les cellules par distance décroissante (du centre vers les bords)
    pixels.sort((a, b) => a.distance - b.distance);
}

// Fonction pour démarrer le jeu
function startGame() {
    music.play();
    score = 0;
    updateScore();
    startButton.style.display = 'none';
    message.style.display = 'none';
    instruction.style.display = 'none';
    canvas.style.display = 'block';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    totalPixels = 160;
    fillDuration = initialFillDuration;
    createGrid(totalPixels);
    fillIndex = 0;
    isFilling = true;
    fillComplete = false;
    greenPhase = false;
    fillStartTime = null;
    requestAnimationFrame(fill);
}

// Fonction pour remplir l'écran
function fill(timestamp) {
    if (!fillStartTime) fillStartTime = timestamp;
    const elapsed = timestamp - fillStartTime;

    if (isFilling) {
        const progress = Math.min(elapsed / fillDuration, 1); // Progression de 0 à 1
        const pixelsToFill = Math.floor(progress * totalPixels);

        // Remplir les pixels jusqu'à la progression actuelle
        while (fillIndex < pixelsToFill && fillIndex < totalPixels) {
            const cell = pixels[fillIndex];
            ctx.fillStyle = 'red';
            ctx.fillRect(cell.x, cell.y, cellWidth, cellHeight);
            fillIndex++;
        }

        // Vérifier si on atteint 90% de remplissage
        if (!greenPhase && fillIndex >= Math.floor(0.9 * totalPixels)) {
            greenPhase = true;
            fillComplete = true;
            // Remplir les pixels restants en vert
            for (; fillIndex < totalPixels; fillIndex++) {
                const cell = pixels[fillIndex];
                ctx.fillStyle = 'green';
                ctx.fillRect(cell.x, cell.y, cellWidth, cellHeight);
            }
            isFilling = false;
            instruction.style.display = 'block'; // Afficher les instructions pour passer au niveau suivant
            return; // Arrêter la boucle d'animation
        }

        if (progress < 1) {
            requestAnimationFrame(fill);
        } else {
            // Si le remplissage est terminé sans que le joueur ait cliqué
            if (!fillComplete) {
                gameOver();
            }
        }
    }
}

// Fonction pour mettre à jour le score affiché
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// Fonction pour gérer l'entrée utilisateur (clic ou barre d'espace)
function handleInput() {
    if (fillComplete && greenPhase) {
        score++;
        updateScore();
        totalPixels = Math.max(1, Math.floor(totalPixels / 2)); // Diviser le nombre de pixels par deux, minimum 1
        fillDuration = Math.max(200, Math.floor(fillDuration * 0.9)); // Accélérer la durée de remplissage, minimum 200ms
        createGrid(totalPixels);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fillIndex = 0;
        isFilling = true;
        fillComplete = false;
        greenPhase = false;
        fillStartTime = null;
        instruction.style.display = 'none';
        requestAnimationFrame(fill);
    }
}

// Fonction pour gérer la fin du jeu
function gameOver() {
    isFilling = false;
    fillComplete = false;
    greenPhase = false;
    message.textContent = `Vous avez perdu! Score final: ${score}`;
    message.style.display = 'block';
    canvas.style.display = 'none';
    startButton.style.display = 'block';
}

// Fonction pour gérer la victoire (si vous voulez ajouter une condition de victoire)
function gameWin() {
    isFilling = false;
    fillComplete = false;
    greenPhase = false;
    message.textContent = `Félicitations! Vous avez gagné! Score final: ${score}`;
    message.style.display = 'block';
    canvas.style.display = 'none';
    startButton.style.display = 'block';
}

// Écouteur d'événement pour le clic
canvas.addEventListener('click', handleInput);

// Écouteur d'événement pour la barre d'espace
window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        handleInput();
    }
});

// Écouteur d'événement pour le bouton de démarrage
startButton.addEventListener('click', startGame);

// Fonction pour gérer le redimensionnement de la fenêtre
function updateCanvasSize() {
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (isFilling || fillComplete) {
        // Recréer la grille avec le nombre actuel de pixels
        createGrid(totalPixels);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < fillIndex; i++) {
            const cell = pixels[i];
            ctx.fillStyle = (i < Math.floor(0.9 * totalPixels)) ? 'red' : 'green';
            ctx.fillRect(cell.x, cell.y, cellWidth, cellHeight);
        }
    }
}

window.addEventListener('resize', updateCanvasSize);
