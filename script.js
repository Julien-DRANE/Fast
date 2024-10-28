let sounds = [];
const container = document.getElementById('canvas-container');
let pastilleCount = 0; // Compteur de pastilles créées

// Charger les sons
function loadSounds() {
    for (let i = 1; i <= 16; i++) {
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
    playBeat(pastille, rhythmInterval);
    pastilleCount++; // Incrémente le compteur de pastilles

    // Pitch d'une tierce descendante toutes les 4 pastilles
    if (pastilleCount % 4 === 0) {
        pitchThirdDown();
    }

    let scale = 1;
    setInterval(() => {
        scale = scale === 1 ? 1.2 : 1;
        pastille.style.transform = `scale(${scale})`;
    }, rhythmInterval);
}

// Joue un son à chaque battement
function playBeat(pastille, rhythmInterval) {
    const soundIndex = Math.floor(Math.random() * 16);
    const sound = sounds[soundIndex];
    sound.currentTime = 0; // Rewind to the start
    sound.play();

    const soundInterval = random(600, 1800); // Ralentir le son
    const adjustedSoundInterval = soundInterval * 5; // Espacer les sons pour un rythme lent

    setInterval(() => {
        sound.currentTime = 0; // Rewind to the start
        sound.play();
    }, adjustedSoundInterval);
}

// Fonction pour jouer un son d'une tierce descendante
function pitchThirdDown() {
    const soundIndex = Math.floor(Math.random() * 16);
    const sound = sounds[soundIndex];
    sound.currentTime = 0; // Rewind to the start
    sound.playbackRate = 0.833; // Pitch d'une tierce descendante (environ 0.833 pour 3 demi-tons)
    sound.play();
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
