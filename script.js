let audioContext;
let sounds = [];
const container = document.getElementById('canvas-container');

// Initialiser l'audio context
function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    loadSounds(); // Charger les sons après l'initialisation
}

// Charger les sons
function loadSounds() {
    const promises = [];
    for (let i = 1; i <= 16; i++) {
        const fileName = (i < 10) ? `sounds/s0${i}.mp3` : `sounds/s${i}.mp3`; // Gérer les noms de fichiers
        promises.push(fetch(fileName)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur lors du chargement de ${fileName}`);
                }
                return response.arrayBuffer();
            })
            .then(data => audioContext.decodeAudioData(data))
            .then(buffer => sounds[i - 1] = buffer));
    }
    return Promise.all(promises);
}

// Écoute les événements tactiles et souris
document.addEventListener('touchstart', handleInteraction);
document.addEventListener('click', handleInteraction);

// Fonction de gestion des interactions
function handleInteraction(event) {
    if (!audioContext) {
        initAudio();
    }
    createPastille(event);
}

// Créer une pastille
function createPastille(event) {
    const x = event.touches ? event.touches[0].clientX : event.clientX;
    const y = event.touches ? event.touches[0].clientY : event.clientY;

    const rhythmInterval = random(240, 900); // Ralentir le rythme (anciennement 80, 300)
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
    playBeat(pastille);

    let scale = 1;
    setInterval(() => {
        scale = scale === 1 ? 1.2 : 1;
        pastille.style.transform = `scale(${scale})`;
    }, rhythmInterval);
}

// Joue un son à chaque battement
function playBeat(pastille) {
    const soundIndex = Math.floor(Math.random() * 16);
    const soundBuffer = sounds[soundIndex];

    const source = audioContext.createBufferSource();
    source.buffer = soundBuffer;

    // Changer le pitch en modifiant la vitesse de lecture
    const pitchShift = random(0.8, 1.2); // Pitch shift entre 0.8x et 1.2x
    source.playbackRate.value = pitchShift; 

    source.connect(audioContext.destination);
    source.start();

    const soundInterval = random(600, 1800); // Ralentir le son (anciennement 200, 600)
    setInterval(() => {
        const source = audioContext.createBufferSource();
        source.buffer = soundBuffer;
        source.playbackRate.value = pitchShift;
        source.connect(audioContext.destination);
        source.start();
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

// Initialisation de l'audio lors du chargement
initAudio();
