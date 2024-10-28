let sounds = [];
const container = document.getElementById('canvas-container');

// Charger les sons
for (let i = 1; i <= 16; i++) {
    sounds[i - 1] = new Audio(`sounds/s0${i}.mp3`);
}

// Écoute les événements tactiles et souris
document.addEventListener('touchstart', createPastille);
document.addEventListener('click', createPastille);

// Créer une pastille
function createPastille(event) {
    // Utiliser les coordonnées de la souris ou du touché
    const x = event.touches ? event.touches[0].clientX : event.clientX;
    const y = event.touches ? event.touches[0].clientY : event.clientY;

    // Choisir un intervalle de vibration aléatoire
    const rhythmInterval = random(80, 300); // Intervalle de vibration aléatoire entre 80ms et 300ms
    const size = mapIntervalToSize(rhythmInterval); // Obtenir la taille basée sur l'intervalle

    const couleur = `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
    const pastille = document.createElement('div');
    pastille.classList.add('pastille');
    pastille.style.backgroundColor = couleur;

    // Positionner la pastille à l'endroit du touché ou du clic
    pastille.style.left = `${x - size / 2}px`; // Centrer la pastille
    pastille.style.top = `${y - size / 2}px`;  // Centrer la pastille
    pastille.style.width = `${size}px`; // Définir la taille
    pastille.style.height = `${size}px`; // Définir la taille
    container.appendChild(pastille);
    
    // Joue un son
    playBeat(pastille);

    // Faire battre la pastille à des rythmes différents
    let scale = 1;
    setInterval(() => {
        scale = scale === 1 ? 1.2 : 1; // Alterne entre 1 et 1.2
        pastille.style.transform = `scale(${scale})`;
    }, rhythmInterval); // Changer de taille selon le rythme
}

// Joue un son à chaque battement
function playBeat(pastille) {
    const sound = sounds[Math.floor(Math.random() * 16)];
    sound.currentTime = 0; // Rewind to the start
    sound.play();

    // Joue le son de manière répétée à un rythme aléatoire
    const soundInterval = random(200, 600); // Intervalle de son aléatoire entre 200ms et 600ms
    setInterval(() => {
        sound.currentTime = 0; // Rewind to the start
        sound.play();
    }, soundInterval);
}

// Fonction pour générer un nombre aléatoire
function random(max) {
    return Math.floor(Math.random() * max);
}

// Fonction pour mapper l'intervalle de vibration à la taille de la pastille
function mapIntervalToSize(interval) {
    // Plus l'intervalle est grand, plus la pastille est grande
    return Math.max(50, 200 - interval); // Taille minimum de 50px et maximum de 200px
}
