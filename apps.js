const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const music = document.getElementById('backgroundMusic');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let fillAmount = 0;
let fillSpeed = 1; // Remplit 1% par milliseconde
let thickness = canvas.height; // Épaisseur initiale
let interval;

// Fonction pour démarrer le jeu
function startGame() {
    music.play();
    fillAmount = 0;
    thickness = canvas.height;
    scoreDisplay.textContent = `Score: ${score}`;
    fillLoop();
}

// Boucle de remplissage
function fillLoop() {
    interval = setInterval(() => {
        fillAmount += fillSpeed;

        // Vérifie si on atteint 100%
        if (fillAmount >= 100) {
            clearInterval(interval);
            setTimeout(startGame, 1000); // Recommence après 1 seconde
            return;
        }

        // Dessine la bande rouge
        ctx.fillStyle = 'red';
        ctx.fillRect(0, canvas.height - (thickness * fillAmount / 100), canvas.width, thickness * fillAmount / 100);

        // Vérifie si on est à 7% avant la fin
        if (fillAmount >= 93) {
            ctx.fillStyle = 'green';
            ctx.fillRect(0, canvas.height - (thickness * 100 / 100), canvas.width, thickness);
        }

    }, 10); // 10ms pour rendre le remplissage fluide
}

// Écouteur d'événement pour le clic
canvas.addEventListener('click', () => {
    if (fillAmount >= 93 && fillAmount < 100) {
        score++;
        fillSpeed *= 2; // Double la vitesse
        thickness /= 2; // Divise l'épaisseur par 2
        clearInterval(interval);
        fillLoop();
    }
});

// Démarre le jeu
startGame();
