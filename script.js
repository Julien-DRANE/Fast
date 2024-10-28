let sounds = [];
const container = document.getElementById('canvas-container');
let pastilleCount = 0; // Compteur de pastilles créées
const maxPastilles = 6; // Nombre maximum de pastilles

// Niveaux de volume (de très faible à faible)
const volumeLevels = [0.05, 0.1, 0.2, 0.3, 0.5]; // 0.05 = très faible, 0.5 = faible
const pastilleSizes = {
    0.05: '30px', // Très faible
    0.1: '40px',  // Faible
    0.2: '50px',  // Moyen
    0.3: '60px',  // Moyen élevé
    0.5: '70px'   // Élevé
};

// Charger les sons
function loadSounds() {
    for (let i = 1; i <= 16; i++) {
        const fileName = (i < 10) ? `sounds/s0${i}.mp3` : `sounds/s${i}.mp3`;
        const audio = new Audio(fileName);
        const randomVolumeIndex = Math.floor(Math.random() * volumeLevels.length); // Choisir un volume aléatoire
        audio.volume = volumeLevels[randomVolumeIndex]; // Ajuster le volume des sons
        sounds.push(audio);
    }
    
    // Charger et jouer le son de fond
    const backgroundSound = new Audio('sounds/nature.mp3'); // Chemin vers le fichier audio
    backgroundSound.loop = true; // Faire jouer le son en boucle
    backgroundSound.volume = 0.2; // Ajuster le volume à un niveau bas
    backgroundSound.play(); // Jouer le son de fond
}

// Écoute les événements tactiles et souris
document.addEventListener('touchstart', handleInteraction);
document.addEventListener('click', handleInteraction);

// Fonction de gestion des interactions
function handleInteraction(event) {
    if (pastilleCount < maxPastilles) {
        createPastille(event);
    }
}

// Créer une pastille
function createPastille(event) {
    const x = event.touches ? event.touches[0].clientX : event.clientX;
    const y = event.touches ? event.touches[0].clientY : event.clientY;

    const soundIndex = Math.floor(Math.random() * sounds.length);
    const sound = sounds[soundIndex];
    
    // Calculer la taille de la pastille en fonction du volume
    const pastilleSize = pastilleSizes[sound.volume];
    const couleur = `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
    const pastille = document.createElement('div');
    pastille.classList.add('pastille'); // Ajout de la classe d'animation
    pastille.style.backgroundColor = couleur;

    pastille.style.left = `${x}px`; // Positionnement centré
    pastille.style.top = `${y}px`; // Positionnement centré
    pastille.style.width = pastilleSize; // Taille en fonction du volume
    pastille.style.height = pastilleSize; // Taille en fonction du volume
    container.appendChild(pastille);
    
    // Joue un son
    playSoundAndAnimatePastille(pastille, sound);
    pastilleCount++; // Incrémente le compteur de pastilles
}

// Fonction pour jouer un son et animer la pastille
function playSoundAndAnimatePastille(pastille, sound) {
    sound.currentTime = 0; // Rewind to the start
    sound.play();

    // Faire disparaître la pastille après 2 secondes
    setTimeout(() => {
        pastille.style.transition = 'opacity 0.5s, transform 0.5s'; // Transition pour l'opacité et la transformation
        pastille.style.opacity = '0'; // Rendre la pastille transparente
        pastille.style.transform = 'scale(0.5)'; // Réduire la taille
        setTimeout(() => {
            pastille.remove(); // Retirer l'élément du DOM
            pastilleCount--; // Décrémente le compteur de pastilles
        }, 500); // Retirer après la transition
    }, 2000); // Disparaître après 2 secondes
}

// Fonction pour générer un nombre aléatoire
function random(max) {
    return Math.floor(Math.random() * max);
}

// Charger les sons lors du chargement
loadSounds();
