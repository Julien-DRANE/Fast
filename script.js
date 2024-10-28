let sounds = [];
const container = document.getElementById('canvas-container');
let pastilleCount = 0; // Compteur de pastilles créées
const maxPastilles = 5; // Limite du nombre de pastilles

// Niveaux de volume (de très faible à faible) et tailles correspondantes
const volumeLevels = [0.05, 0.1, 0.2, 0.3, 0.5]; // 0.05 = très faible, 0.5 = faible
const pastilleSizes = {
    0.05: '100px', // Très faible
    0.1: '120px',  // Faible
    0.2: '140px',  // Moyen
    0.3: '160px',  // Moyen élevé
    0.5: '180px'   // Élevé
};

// Couleurs chaudes pour les pastilles
const warmColors = ['#FF5733', '#FFB300', '#FFEA00', '#FF6F61', '#FFD700'];

// Charger les sons
function loadSounds() {
    for (let i = 1; i <= 16; i++) {
        const fileName = (i < 10) ? `sounds/s0${i}.mp3` : `sounds/s${i}.mp3`;
        const audio = new Audio(fileName);
        sounds.push(audio); // Ajouter les sons à la liste
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
    createPastille(event);
}

// Créer une pastille
function createPastille(event) {
    if (pastilleCount >= maxPastilles) {
        // Supprimer la première pastille si on dépasse la limite
        const firstPastille = container.querySelector('.pastille');
        if (firstPastille) {
            firstPastille.remove();
            pastilleCount--;
        }
    }

    const x = event.touches ? event.touches[0].clientX : event.clientX;
    const y = event.touches ? event.touches[0].clientY : event.clientY;

    const soundIndex1 = Math.floor(Math.random() * sounds.length);
    const soundIndex2 = (soundIndex1 + 1) % sounds.length; // Choisir un autre son
    const sound1 = sounds[soundIndex1];
    const sound2 = sounds[soundIndex2];

    // Calculer la taille de la pastille en fonction du volume
    const pastilleSize = pastilleSizes[volumeLevels[Math.floor(Math.random() * volumeLevels.length)]]; // Taille aléatoire
    const couleur = warmColors[Math.floor(Math.random() * warmColors.length)]; // Couleur chaude aléatoire
    const pastille = document.createElement('div');
    pastille.classList.add('pastille'); // Ajout de la classe d'animation
    pastille.style.backgroundColor = couleur;

    pastille.style.left = `${x}px`; // Positionnement centré
    pastille.style.top = `${y}px`; // Positionnement centré
    pastille.style.width = pastilleSize; // Taille en fonction du volume
    pastille.style.height = pastilleSize; // Taille en fonction du volume
    container.appendChild(pastille);
    
    // Joue le son et configure la répétition
    playSoundAndAnimatePastille(pastille, sound1, sound2);
    pastilleCount++; // Incrémente le compteur de pastilles
}

// Fonction pour jouer un son et animer la pastille
function playSoundAndAnimatePastille(pastille, sound1, sound2) {
    let currentSound = sound1; // Commencer par le premier son
    let repetitionCount = 0; // Compteur de répétitions
    const rhythmInterval = 800; // Intervalle de base pour les répétitions

    // Définir la fonction pour jouer le son et oscillation
    const repeatSound = setInterval(() => {
        // Choisir un volume aléatoire parmi les niveaux de volume
        const randomVolume = volumeLevels[Math.floor(Math.random() * volumeLevels.length)];
        currentSound.volume = randomVolume; // Appliquer le volume aléatoire

        currentSound.currentTime = 0; // Rewind to the start
        currentSound.play();

        // Créer une nouvelle pastille à chaque répétition
        createPastille({ clientX: pastille.offsetLeft, clientY: pastille.offsetTop });

        // Alterner entre les deux sons
        currentSound = (currentSound === sound1) ? sound2 : sound1;

        // Osciller la pastille
        oscillatePastille(pastille);

        // Incrémenter le compteur de répétitions
        repetitionCount++;

        // Changer de sons après 16 répétitions
        if (repetitionCount === 16) {
            // Choisir de nouveaux sons aléatoires
            const newSoundIndex1 = Math.floor(Math.random() * sounds.length);
            const newSoundIndex2 = (newSoundIndex1 + 1) % sounds.length; // Choisir un autre son
            sound1 = sounds[newSoundIndex1];
            sound2 = sounds[newSoundIndex2];

            // Réinitialiser le compteur de répétitions
            repetitionCount = 0;
        }
    }, rhythmInterval);

    // Arrêter la répétition lorsque la pastille est retirée
    pastille.addEventListener('transitionend', () => {
        clearInterval(repeatSound);
        pastille.remove(); // Retirer la pastille initiale
        pastilleCount--; // Décrémente le compteur de pastilles
    });
}

// Fonction pour osciller la pastille
function oscillatePastille(pastille) {
    let oscillation = 0; // Position d'oscillation
    const oscillationInterval = setInterval(() => {
        oscillation += 5; // Augmenter l'oscillation
        pastille.style.transform = `translateX(${Math.sin(oscillation * Math.PI / 180) * 10}px)`; // Oscillation de gauche à droite
    }, 50); // Durée de l'oscillation

    // Arrêter l'oscillation après un certain temps
    setTimeout(() => {
        clearInterval(oscillationInterval);
        pastille.style.transform = 'translateX(0px)'; // Réinitialiser la position
    }, 1000); // Durée d'oscillation
}

// Fonction pour générer un nombre aléatoire
function random(max) {
    return Math.floor(Math.random() * max);
}

// Charger les sons lors du chargement
loadSounds();
