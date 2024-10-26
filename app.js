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
let totalPixels; // Nombre total de pixels à remplir
let fillSpeed; // Pixels à remplir par intervalle
let interval;

// Fonction pour démarrer le jeu
function startGame() {
    music.play();
    fillAmount = 0;
    totalPixels = 160; // Commencer avec 160 pixels
    fillSpeed = (canvas.width * canvas.height) / (totalPixels * 100); // Remplissage sur 1 seconde
    scoreDisplay.textContent = `Score: ${score}`;
    canvas.style.display = "block"; // Affiche le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Efface le canvas
    fillLoop();
}

// Boucle de remplissage
function fillLoop() {
    const startTime = performance.now();

    interval = setInterval(() => {
        const elapsedTime = performance.now() - startTime;

        // Remplissage pour 1 seconde
        if (elapsedTime < 1000) {
            const pixelsToFill = Math.floor(elapsedTime * fillSpeed / 1000);
            for (let i = fillAmount; i < pixelsToFill; i++) {
                if (i < totalPixels) {
                    // Calculer la position du pixel à remplir
                    let x = (i % (canvas.width / pixelSize)) * pixelSize;
                    let y = Math.floor(i / (canvas.width / pixelSize)) * pixelSize;

                    ctx.fillStyle = 'red';
                    ctx.fillRect(x, canvas.height - (y + pixelSize), pixelSize, pixelSize);
                }
            }
            fillAmount = pixelsToFill;
        } else {
            clearInterval(interval);

            // Change la couleur à vert lorsque 93% est rempli
            if (fillAmount >= (totalPixels * 0.93)) {
                ctx.fillStyle = 'green';
                for (let i = fillAmount; i < totalPixels; i++) {
                    let x = (i % (canvas.width / pixelSize)) * pixelSize;
                    let y = Math.floor(i / (canvas.width / pixelSize)) * pixelSize;
                    ctx.fillRect(x, canvas.height - (y + pixelSize), pixelSize, pixelSize);
                }
            }

            setTimeout(startGame, 1000); // Recommence après 1 seconde
        }

    }, 10); // 10ms pour rendre le remplissage fluide
}

// Fonction pour gérer le clic ou l'appui sur la barre d'espace
function handleInput() {
    if (fillAmount >= (totalPixels * 0.93) && fillAmount < totalPixels) {
        score++;
        totalPixels /= 2; // Divise le nombre total de pixels par 2
        fillSpeed = (canvas.width * canvas.height) / (totalPixels * 100); // Recalcule la vitesse de remplissage
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
