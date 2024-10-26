const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
const music = document.getElementById('backgroundMusic');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let totalPixels = 160; // Nombre initial de pixels
let pixels = []; // Liste des cellules à remplir
let fillIndex = 0; // Index actuel de remplissage
let isFilling = false;
let fillStartTime = null;
let fillDuration = 1000; // Durée de remplissage en millisecondes
let fillComplete = false;
let greenPhase = false;

function createGrid(pixelsCount) {
    pixels = [];
    const cols = Math.floor(Math.sqrt(pixelsCount * (canvas.width / canvas.height)));
    const rows = Math.floor(pixelsCount / cols);
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;

    // Générer les cellules en partant des bords vers le centre
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            // Calculer la distance au centre pour ordonner les cellules
            const centerX = cols / 2;
            const centerY = rows / 2;
            const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
            pixels.push({
                x: x * cellWidth,
                y: y * cellHeight,
                distance: distance
            });
        }
    }

    // Trier les cellules par distance décroissante (bords vers centre)
    pixels.sort((a, b) => b.distance - a.distance);
}

function startGame() {
    music.play();
    score = 0;
    updateScore();
    startButton.style.display = 'none';
    canvas.style.display = 'block';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    totalPixels = 160;
    createGrid(totalPixels);
    fillIndex = 0;
    isFilling = true;
    fillComplete = false;
    greenPhase = false;
    requestAnimationFrame(fill);
}

function fill(timestamp) {
    if (!fillStartTime) fillStartTime = timestamp;
    const elapsed = timestamp - fillStartTime;

    const progress = Math.min(elapsed / fillDuration, 1);
    const pixelsToFill = Math.floor(progress * totalPixels);

    while (fillIndex < pixelsToFill && fillIndex < totalPixels) {
        const cell = pixels[fillIndex];
        if (!greenPhase) {
            ctx.fillStyle = 'red';
        } else {
            ctx.fillStyle = 'green';
        }
        ctx.fillRect(cell.x, cell.y, canvas.width / Math.floor(Math.sqrt(totalPixels * (canvas.width / canvas.height))), canvas.height / Math.floor(totalPixels / Math.floor(Math.sqrt(totalPixels * (canvas.width / canvas.height)))));
        fillIndex++;
    }

    if (progress < 1) {
        requestAnimationFrame(fill);
    } else {
        isFilling = false;
        fillComplete = true;
        // Passe en phase verte
        greenPhase = true;
        // Remplir les pixels restants en vert
        for (; fillIndex < totalPixels; fillIndex++) {
            const cell = pixels[fillIndex];
            ctx.fillStyle = 'green';
            ctx.fillRect(cell.x, cell.y, canvas.width / Math.floor(Math.sqrt(totalPixels * (canvas.width / canvas.height))), canvas.height / Math.floor(totalPixels / Math.floor(Math.sqrt(totalPixels * (canvas.width / canvas.height)))));
        }
    }
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function handleInput() {
    if (fillComplete && greenPhase) {
        score++;
        updateScore();
        totalPixels = Math.max(1, Math.floor(totalPixels / 2)); // Diviser par deux, minimum 1
        createGrid(totalPixels);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fillIndex = 0;
        isFilling = true;
        fillStartTime = null;
        fillComplete = false;
        greenPhase = false;
        requestAnimationFrame(fill);
    }
}

// Écouteur d'événement pour le clic
canvas.addEventListener('click', handleInput);

// Écouteur d'événement pour la barre d'espace
window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        handleInput();
    }
});

// Écouteur d'événement pour le bouton
startButton.addEventListener('click', startGame);

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (!isFilling && !fillComplete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
        // Redessiner les pixels remplis
        for (let i = 0; i < fillIndex; i++) {
            const cell = pixels[i];
            ctx.fillStyle = greenPhase ? 'green' : 'red';
            ctx.fillRect(cell.x, cell.y, canvas.width / Math.floor(Math.sqrt(totalPixels * (canvas.width / canvas.height))), canvas.height / Math.floor(totalPixels / Math.floor(Math.sqrt(totalPixels * (canvas.width / canvas.height)))));
        }
    }
});
