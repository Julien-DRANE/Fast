let sounds = [];
const container = document.getElementById('canvas-container');

// Charger les sons
function loadSounds() {
    for (let i = 1; i <= 16; i++) {
        // Gérer les noms de fichiers pour s01 à s10, puis s11 à s16
        const fileName = (i < 10) ? `sounds/s0${i}.mp3` : `sounds/s${i}.mp3`;
        const audio = new Audio(fileName);
        sounds.push(audio);
    }
}

// Écoute les événements tactiles et souris
document.addEventListener('touchstart', handleInteraction);
document.addEventListener('click', handleInteraction);

// Fonction de gestion des interactions
function handleInteraction(event) {
    // Appeler createPastille lors de l'interaction
    createPastille(event);
}

// Créer une pastille
function createPastille(event) {
    const x = event.touches ? event.touches[0].clientX : event.clientX;
    const y = event.touches ? event.touches[0].clientY : event.clientY;

    const rhythmInterval = random(240, 900); // Ralentir le rythme
    const size = mapIntervalToSize(rhythmInterval);

    const couleur = `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
    const pastille = document.createElement('div');
    pastille.classList.add('pastille');
    pastille.style.backgroundColor = couleur;

    pastille.style.left = `${x - size / 2}px`;
    pastille.style.top = `${y - size / 2}px`;
    pastille.style.width = `${size}px`;
    pastille.style.height = `${size}px`;
    container.appendChild(pastille);
    
    // Joue un son
    playBeat();

    let scale = 1;
    setInterval(() => {
        scale = scale === 1 ? 1.2 : 1;
        pastille.style.transform = `scale(${scale})`;
    }, rhythmInterval);
}

// Joue un son à chaque battement
function playBeat() {
    const soundIndex = Math.floor(Math.random() * 16);
    const sound = sounds[soundIndex];
    sound.currentTime = 0; // Rewind to the start
    sound.play();

    const soundInterval = random(600, 1800); // Ralentir le son
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
    return Math.max(50, 200 - interval);
}

// Charger les sons lors du chargement
loadSounds();
