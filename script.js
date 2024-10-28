let sounds = [];
const container = document.getElementById('canvas-container');
let lastSoundIndex = -1; // Pour suivre le dernier son joué
const volumeLevels = [0.05, 0.1, 0.2, 0.3]; // Niveaux de volume doux
const pastilleSizes = ['80px', '100px', '120px']; // Tailles de pastilles
const warmColors = ['#048a81ff', '#06d6a0ff', '#54c6ebff', '#8a89c0ff', '#cda2abff']; // Couleurs fournies

// Charger les sons
function loadSounds() {
    for (let i = 1; i <= 16; i++) {
        const fileName = (i < 10) ? `sounds/s0${i}.mp3` : `sounds/s${i}.mp3`;
        const audio = new Audio(fileName);
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
function handleInteraction() {
    playSound();
}

// Jouer un son
function playSound() {
    let soundIndex;
    do {
        soundIndex = Math.floor(Math.random() * sounds.length); // Choisir un son aléatoire
    } while (soundIndex === lastSoundIndex); // Éviter de jouer le même son à la suite

    lastSoundIndex = soundIndex; // Mettre à jour le dernier son joué
    const currentSound = sounds[soundIndex];
    
    // Définir un volume aléatoire
    const volume = volumeLevels[Math.floor(Math.random() * volumeLevels.length)];
    currentSound.volume = volume;
    
    currentSound.currentTime = 0; // Remettre à zéro le temps
    currentSound.play(); // Jouer le son

    // Créer une pastille
    createPastille();
}

// Créer une pastille
function createPastille() {
    const x = Math.random() * window.innerWidth; // Position X aléatoire
    const y = Math.random() * window.innerHeight; // Position Y aléatoire
    const couleur = warmColors[Math.floor(Math.random() * warmColors.length)]; // Couleur chaude aléatoire
    const pastilleSize = pastilleSizes[Math.floor(Math.random() * pastilleSizes.length)]; // Taille aléatoire

    const pastille = document.createElement('div');
    pastille.classList.add('pastille'); // Ajout de la classe d'animation
    pastille.style.backgroundColor = couleur;
    pastille.style.left = `${x}px`; // Positionnement aléatoire
    pastille.style.top = `${y}px`; // Positionnement aléatoire
    pastille.style.width = pastilleSize; // Taille
    pastille.style.height = pastilleSize; // Taille
    container.appendChild(pastille);
    
    // Faire disparaître la pastille après un certain temps
    setTimeout(() => {
        pastille.style.opacity = '0'; // Rendre la pastille transparente
        pastille.addEventListener('transitionend', () => pastille.remove()); // Retirer la pastille après la transition
    }, 2000); // Disparaît après 2 secondes
}

// Charger les sons lors du chargement
loadSounds();
