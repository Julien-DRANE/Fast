const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
const music = document.getElementById('backgroundMusic');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let fillAmount = 0; // Proportion de remplissage
let pixelSize = 10; // Taille du pixel (peut être ajustée)
let fillSpeed = 1; // Remplit 1 pixel par intervalle
let interval;

// Fonction pour démarrer le jeu
function startGame() {
    music.play();
    fillAmount = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    canvas.style.display = "block"; // Affiche le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le canvas
    fillLoop();
}

// Boucle de remplissage
function fillLoop() {
    interval = setInterval(() => {
        // Remplit les pixels du bas vers le haut
        for (let i = 0; i < fillSpeed; i++) {
            if (fillAmount < (canvas.width * canvas.height) / (pixelSize * pixelSize)) {
                // Calculer la position du pixel à remplir
                let x = (fillAmount % (canvas.width / pixelSize)) * pixelSize;
                let y = Math.floor(fillAmount / (canvas.width / pixelSize)) * pixelSize;

                ctx.fillStyle = 'red';
                ctx.fillRect(x, canvas.height - (y + pixelSize), pixelSize, pixelSize);
                fillAmount++;
            }
        }

        // Vérifie si on est à 7% avant la fin
        if (fillAmount >= ((canvas.width * canvas.height) * 0.93) / (pixelSize * pixelSize)) {
            ctx.fillStyle = 'green';
            for (let i = fillAmount; i < (canvas.width * canvas.height) / (pixelSize * pixelSize); i++) {
                let x = (i % (canvas.width / pixelSize)) * pixelSize;
                let y = Math.floor(i / (canvas.width / pixelSize)) * pixelSize;
                ctx.fillRect(x, canvas.height - (y + pixelSize), pixelSize, pixelSize);
            }
            clearInterval(interval);
        }

        // Vérifie si on atteint 100%
        if (fillAmount >= (canvas.width * canvas.height) / (pixelSize * pixelSize)) {
            clearInterval(interval);
            setTimeout(startGame, 1000); // Recommence après 1 seconde
            return;
        }

    }, 10); // 10ms pour rendre le remplissage fluide
}

// Fonction pour gérer le clic ou l'appui sur la barre d'espace
function handleInput() {
    if (fillAmount >= ((canvas.width * canvas.height) * 0.93) / (pixelSize * pixelSize) && fillAmount < (canvas.width * canvas.height) / (pixelSize * pixelSize)) {
        score++;
        fillSpeed *= 2; // Double la vitesse
        pixelSize /= 2; // Divise la taille du pixel par 2
        clearInterval(interval);
        fillAmount = 0; // Réinitialise la quantité remplie pour le nouveau niveau
        fillLoop(); // Redémarre la boucle de remplissage
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
