let sounds = [];
const tempo = 80; // BPM
const container = document.getElementById('canvas-container');

// Charger les sons
for (let i = 1; i <= 16; i++) {
    sounds[i - 1] = new Audio(`sounds/s0${i}.mp3`);
}

// Événement tactile
document.addEventListener('touchstart', createPastille);

// Créer une pastille
function createPastille(event) {
    const couleur = `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
    const pastille = document.createElement('div');
    pastille.classList.add('pastille');
    pastille.style.backgroundColor = couleur;

    // Positionner la pastille à l'endroit du touché
    const touch = event.touches[0];
    pastille.style.left = `${touch.clientX - 25}px`;
    pastille.style.top = `${touch.clientY - 25}px`;
    pastille.style.width = '50px';
    pastille.style.height = '50px';
    container.appendChild(pastille);
    
    // Joue un son
    playBeat();

    // Faire battre la pastille
    let scale = 1;
    setInterval(() => {
        scale = scale === 1 ? 1.2 : 1; // Alterne entre 1 et 1.2
        pastille.style.transform = `scale(${scale})`;
    }, 100); // Changer de taille toutes les 100ms
}

// Joue un son à chaque battement
function playBeat() {
    const sound = sounds[Math.floor(Math.random() * 16)];
    sound.currentTime = 0; // Rewind to the start
    sound.play();
}

// Fonction pour générer un nombre aléatoire
function random(max) {
    return Math.floor(Math.random() * max);
}
