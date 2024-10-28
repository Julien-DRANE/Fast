let sounds = [];
const container = document.getElementById('canvas-container');
let pastilleCount = 0; // Compteur de pastilles créées
const maxPastilles = 6; // Nombre maximum de pastilles
let isPlaying = false; // État pour vérifier si un son est en cours de lecture

// Charger les sons
function loadSounds() {
    for (let i = 1; i <= 16; i++) {
        const fileName = (i < 10) ? `sounds/s0${i}.mp3` : `sounds/s${i}.mp3`;
        const audio = new Audio(fileName);
        audio.volume = 0.5; // Ajuster le volume des sons
        sounds.push(audio);
    }
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

    // Faire disparaître la pastille comme de la fumée
    setTimeout(() => {
        pastille.style.transition = 'opacity 0.5s, transform 0.5s'; // Transition pour l'opacité et la transformation
        pastille.style.opacity = '0.8'; // Rendre la pastille transparente
        pastille.style.transform = 'scale(0.5)'; // Réduire la taille
        setTimeout(() => {
            pastille.remove(); // Retirer l'élément du DOM
            pastilleCount--; // Décrémente le compteur de pastilles
        }, 500); // Retirer après la transition
    }, rhythmInterval * 5); // Disparaître après un certain temps

    // Réapparaître après un certain temps
    setTimeout(() => {
        pastille.style.transition = 'opacity 0.5s, transform 0.5s'; // Réinitialiser la transition
        pastille.style.opacity = '1'; // Rendre la pastille visible
        pastille.style.transform = 'scale(1)'; // Remettre à la taille d'origine
        container.appendChild(pastille); // Réajouter la pastille
    }, rhythmInterval * 5 + 1000); // Réapparaître après 1 seconde

    // Ajouter un mouvement aléatoire pour la pastille
    animatePastille(pastille);
}

// Joue un son à chaque battement
function playBeat(pastille, rhythmInterval) {
    if (isPlaying) return; // Ne joue pas si un son est déjà en cours

    // Choisir un son aléatoire parmi les sons disponibles
    const soundIndex = Math.floor(Math.random() * sounds.length);
    const sound = sounds[soundIndex];
    sound.currentTime = 0; // Rewind to the start
    isPlaying = true; // Marque que le son est en cours de lecture
    sound.play();

    sound.onended = () => {
        isPlaying = false; // Remettre à faux lorsque le son est terminé
    };

    // Calculer les intervalles des sons pour la polyrythmie
    const beatInterval = 600; // Intervalle principal en ms
    const secondaryBeatInterval = beatInterval * 2; // Intervalle secondaire

    // Jouer le son principal à l'intervalle principal
    setInterval(() => {
        if (!isPlaying) { // Ne pas jouer si un son est déjà en cours
            const soundIndex = Math.floor(Math.random() * sounds.length); // Nouveau son à chaque intervalle
            const sound = sounds[soundIndex];
            sound.currentTime = 0; // Rewind to the start
            sound.play();
        }
    }, beatInterval);

    // Jouer le son secondaire à l'intervalle secondaire
    setInterval(() => {
        if (!isPlaying) { // Ne pas jouer si un son est déjà en cours
            const soundIndex = Math.floor(Math.random() * sounds.length); // Nouveau son à chaque intervalle
            const sound = sounds[soundIndex];
            sound.currentTime = 0; // Rewind to the start
            sound.play();
        }
    }, secondaryBeatInterval);
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

// Animer la pastille pour lui donner un effet vivant
function animatePastille(pastille) {
    const vibrate = () => {
        const offsetX = random(5) - 2; // Déplacement aléatoire en X
        const offsetY = random(5) - 2; // Déplacement aléatoire en Y
        pastille.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    };
    setInterval(vibrate, 100); // Vibre toutes les 100 ms
}

// Charger les sons lors du chargement
loadSounds();
