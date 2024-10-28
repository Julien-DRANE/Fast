let sounds = [];
const container = document.getElementById('canvas-container');
let pastilleCount = 0; // Compteur de pastilles créées
const maxPastilles = 5; // Limite du nombre de pastilles
let activeSounds = 0; // Compteur de sons actifs
const maxActiveSounds = 5; // Maximum de sons simultanés
let soundInterval; // Intervalle pour jouer les sons
let lastSoundIndex = -1; // Pour suivre le dernier son joué
let isDoubleProcess = false; // Indicateur pour savoir si le processus est doublé
let clickCount = 0; // Compteur de clics

// Niveaux de volume (de très faible à faible) et tailles correspondantes
const volumeLevels = [0.05, 0.1, 0.2, 0.3]; // Niveaux de volume doux
const pastilleSizes = ['80px', '100px', '120px']; // Tailles de pastilles
const warmColors = ['#FFA500', '#FFD700', '#FF4500', '#FFFF00', '#FF8C00']; // Couleurs chaudes
const greenColors = ['#4CAF50', '#66BB6A']; // Couleurs vertes pour les pastilles

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
    backgroundSound.volume = 0.3; // Ajuster le volume à un niveau bas
    backgroundSound.play(); // Jouer le son de fond
}

// Écoute les événements tactiles et souris
document.addEventListener('touchstart', handleInteraction);
document.addEventListener('click', handleInteraction);

// Fonction de gestion des interactions
function handleInteraction() {
    clickCount++; // Incrémenter le compteur de clics
    if (clickCount === 1) { // Premier clic
        if (activeSounds === 0) { // Si aucun son n'est en cours, démarrer la génération
            startGenerating();
        }
    } else if (clickCount === 2) { // Deuxième clic
        if (!isDoubleProcess) { // Si déjà en cours, doubler le processus
            isDoubleProcess = true;
            startGenerating(true); // Démarrer le double processus
        }
    } else if (clickCount === 3) { // Troisième clic
        removeWarmPastilles(); // Enlever les pastilles rouges et orange
    } else if (clickCount === 4) { // Quatrième clic
        stopGenerating(); // Arrêter le processus
    }
}

// Commencer à générer des pastilles et des sons
function startGenerating(doubleProcess = false) {
    soundInterval = setInterval(() => {
        if (activeSounds < maxActiveSounds) { // Vérifie le nombre de sons actifs
            playSound(doubleProcess); // Joue un son
        }
    }, getRandomInterval()); // Espacement aléatoire pour créer de la polyrythmie
}

// Fonction pour obtenir un intervalle aléatoire
function getRandomInterval() {
    const intervals = [1000, 1200, 1400, 1600, 1800]; // Espacement augmenté (1 à 1.8s)
    return intervals[Math.floor(Math.random() * intervals.length)];
}

// Jouer un son
function playSound(doubleProcess) {
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
    activeSounds++; // Incrémenter le compteur de sons actifs

    // Créer une pastille
    createPastille(doubleProcess);

    // Lorsque le son se termine, décrémenter le compteur de sons actifs
    currentSound.addEventListener('ended', () => {
        activeSounds--;
    });
}

// Créer une pastille
function createPastille(doubleProcess) {
    const x = Math.random() * (window.innerWidth - 120); // Position X aléatoire, 120 pour éviter le débordement
    const y = Math.random() * (window.innerHeight - 120); // Position Y aléatoire, 120 pour éviter le débordement
    const couleur = doubleProcess 
        ? greenColors[Math.floor(Math.random() * greenColors.length)] // Couleurs vertes si double process
        : warmColors[Math.floor(Math.random() * warmColors.length)]; // Couleur chaude aléatoire
    const pastilleSize = pastilleSizes[Math.floor(Math.random() * pastilleSizes.length)]; // Taille aléatoire

    const pastille = document.createElement('div');
    pastille.classList.add('pastille'); // Ajout de la classe d'animation
    if (doubleProcess) {
        pastille.classList.add('green'); // Ajout de la classe pour les pastilles vertes
    }
    pastille.style.backgroundColor = couleur;
    pastille.style.left = `${x}px`; // Positionnement aléatoire
    pastille.style.top = `${y}px`; // Positionnement aléatoire
    pastille.style.width = pastilleSize; // Taille
    pastille.style.height = pastilleSize; // Taille
    container.appendChild(pastille);
    
    // Créer la traînée derrière la pastille
    createTrainee(x, y); // Appeler la fonction pour créer la traînée
    
    // Faire disparaître la pastille via l'animation CSS
}

// Fonction pour créer une traînée
function createTrainee(x, y) {
    const traine = document.createElement('div');
    traine.classList.add('trainee'); // Ajout de la classe de traînée
    traine.style.left = `${x + 40}px`; // Position X légèrement décalée (au centre de la pastille)
    traine.style.top = `${y + 70}px`; // Position Y légèrement en dessous de la pastille
    traine.style.width = '10px'; // Largeur de la traînée
    traine.style.height = '60px'; // Hauteur de la traînée
    traine.style.backgroundColor = 'rgba(255, 255, 0, 0.8)'; // Couleur de la traînée
    container.appendChild(traine); // Ajouter la traînée au conteneur

    // Disparition de la traînée après un certain temps
    setTimeout(() => {
        traine.style.opacity = '0'; // Faire disparaître la traînée
        traine.addEventListener('transitionend', () => traine.remove()); // Retirer la traînée après la transition
    }, 2000); // Disparaît après 2 secondes
}

// Fonction pour enlever les pastilles rouges et orange
function removeWarmPastilles() {
    const pastilles = container.querySelectorAll('.pastille');
    pastilles.forEach(pastille => {
        const color = pastille.style.backgroundColor;
        if (warmColors.includes(color)) {
            pastille.remove(); // Retirer les pastilles rouges et orange
        }
    });
}

// Fonction pour arrêter la génération
function stopGenerating() {
    clearInterval(soundInterval); // Arrêter l'intervalle
    activeSounds = 0; // Réinitialiser le compteur de sons actifs
    clickCount = 0; // Réinitialiser le compteur de clics
    isDoubleProcess = false; // Réinitialiser l'indicateur de processus
}

// Charger les sons lors du chargement
loadSounds();
