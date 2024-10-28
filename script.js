const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const soundSrc = "sound.mp3"; // Chemin vers le fichier audio

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Définir une nouvelle palette de couleurs douce
let colors = ["#FFB6C1", "#B0E0E6", "#FFD700", "#98FB98", "#FF69B4", "#ADD8E6", "#FF4500", "#1E90FF"];
let currentColor = 0;
let rainbowMode = false;
const ripples = [];
const stars = [];
const movingPastilles = [];
let rippleInterval;
let isTouching = false;

// Variables pour l'oscillation des pastilles
let baseRate = 0.5; // Taux minimum
let maxRate = 5;    // Taux maximum
let duration = 5;   // Durée de l'oscillation en secondes
let pastilleRate = 3; // Limite à 3 pastilles par seconde

// Fonction pour obtenir le taux de pastilles à partir de la fonction sinusoïdale
const getCurrentRate = (time) => {
    return baseRate + (maxRate - baseRate) * 0.5 * (Math.sin((time * Math.PI * 2) / duration) + 1);
};

// Créer une pastille de couleur à l'endroit où l'utilisateur touche
const createRipple = (x, y) => {
    const radius = Math.random() * 30 + 20; // Variation de taille
    ripples.push({ x, y, radius, alpha: 0.8 }); // Définir alpha à 0.8 pour éviter l'effet flash
    changeColor();
    
    // Jouer le son
    const sound = new Audio(soundSrc); // Créer une nouvelle instance du son
    sound.currentTime = 0; // Réinitialiser le temps
    sound.play();

    // Retour haptique doux
    if (navigator.vibrate) {
        navigator.vibrate(50); // Vibration de 50ms
    }
};

// Créer une pastille qui s'éloigne
const createMovingPastille = (x, y) => {
    const size = Math.random() * 10 + 5; // Taille aléatoire pour la pastille qui s'éloigne
    movingPastilles.push({ x, y, size, alpha: 0.8, speed: 2 }); // Définir alpha à 0.8 pour éviter l'effet flash
};

// Changer la couleur actuelle
const changeColor = () => {
    currentColor = (currentColor + 1) % colors.length;
};

// Ajouter une étoile brillante
const createStar = (x, y) => {
    const size = Math.random() * 5 + 2; // Taille aléatoire pour l'étoile
    stars.push({ x, y, size, alpha: 1, speed: 1 });
};

// Effet arc-en-ciel
const rainbowEffect = () => {
    rainbowMode = true;
    const rainbowColors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#4B0082", "#9400D3"];
    let index = 0;

    const rainbowInterval = setInterval(() => {
        ctx.fillStyle = rainbowColors[index];
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        index = (index + 1) % rainbowColors.length;

        if (!rainbowMode) {
            clearInterval(rainbowInterval);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }
    }, 100);
};

// Mettre à jour les pastilles de couleur
const updateRipples = () => {
    for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].radius += 2;  // Augmenter le rayon pour l'effet de pastille
        ripples[i].alpha -= 0.02; // Diminuer l'opacité
        if (ripples[i].alpha <= 0) {
            ripples.splice(i, 1); // Supprimer la pastille si alpha <= 0
        }
    }
};

// Mettre à jour les étoiles brillantes
const updateStars = () => {
    for (let i = stars.length - 1; i >= 0; i--) {
        stars[i].size += 0.5; // Augmenter la taille de l'étoile
        stars[i].alpha -= 0.01; // Diminuer l'opacité
        stars[i].speed += 0.05; // Augmenter la vitesse

        // Mettre à jour la position de l'étoile
        stars[i].y -= stars[i].speed;

        if (stars[i].alpha <= 0) {
            stars.splice(i, 1); // Supprimer l'étoile si alpha <= 0
        }
    }
};

// Mettre à jour les pastilles qui s'éloignent
const updateMovingPastilles = () => {
    for (let i = movingPastilles.length - 1; i >= 0; i--) {
        movingPastilles[i].y -= movingPastilles[i].speed; // Éloigner la pastille
        movingPastilles[i].alpha -= 0.02; // Diminuer l'opacité

        if (movingPastilles[i].alpha <= 0) {
            movingPastilles.splice(i, 1); // Supprimer la pastille si alpha <= 0
        }
    }
};

// Dessiner sur le canvas
const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canvas chaque image

    ctx.fillStyle = "black"; // Fond noir
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (rainbowMode) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Dessiner les pastilles
    ripples.forEach(ripple => {
        ctx.fillStyle = `rgba(${parseInt(colors[currentColor].slice(1, 3), 16)}, ${parseInt(colors[currentColor].slice(3, 5), 16)}, ${parseInt(colors[currentColor].slice(5, 7), 16)}, ${ripple.alpha})`;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2, false);
        ctx.fill();
    });

    // Dessiner les étoiles brillantes
    stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`; // Étoile blanche
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2, false);
        ctx.fill();
    });

    // Dessiner les pastilles qui s'éloignent
    movingPastilles.forEach(pastille => {
        ctx.fillStyle = `rgba(255, 255, 255, ${pastille.alpha})`; // Couleur des pastilles qui s'éloignent
        ctx.beginPath();
        ctx.arc(pastille.x, pastille.y, pastille.size, 0, Math.PI * 2, false);
        ctx.fill();
    });

    updateRipples();
    updateStars();
    updateMovingPastilles();
    requestAnimationFrame(draw);
};

// Démarrer la création de pastilles lors du contact
const startCreatingRipples = (x, y) => {
    if (!isTouching) { // Empêche de démarrer une nouvelle création si déjà en cours
        isTouching = true;
        createRipple(x, y);
        createStar(x, y); // Créer une étoile à l'endroit touché
        createMovingPastille(x, y); // Créer une pastille qui s'éloigne

        // Créer des pastilles à intervalles réguliers
        rippleInterval = setInterval(() => {
            if (movingPastilles.length < pastilleRate) { // Limiter à 3 pastilles par seconde
                createRipple(x, y);
                createMovingPastille(x, y); // Créer une pastille qui s'éloigne
            }
        }, 1000 / pastilleRate); // 3 pastilles par seconde
    }
};

// Arrêter la création de pastilles lorsque le contact se termine
const stopCreatingRipples = () => {
    clearInterval(rippleInterval);
    isTouching = false;
};

// Mettre à jour la position des pastilles pour suivre le doigt
const updateRipplePosition = (x, y) => {
    if (isTouching) {
        createRipple(x, y);
        createStar(x, y); // Créer une étoile à l'endroit touché
        createMovingPastille(x, y); // Créer une pastille qui s'éloigne
    }
};

// Écouter les événements de touché sur le canvas
canvas.addEventListener("touchstart", (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    startCreatingRipples(touch.clientX, touch.clientY);
});

// Écouter les événements de souris
canvas.addEventListener("mousedown", (event) => {
    startCreatingRipples(event.clientX, event.clientY);
});

canvas.addEventListener("mousemove", (event) => {
    updateRipplePosition(event.clientX, event.clientY);
});

canvas.addEventListener("mouseup", (event) => {
    stopCreatingRipples();
});

// Mettre à jour la position lors du mouvement
canvas.addEventListener("touchmove", (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    updateRipplePosition(touch.clientX, touch.clientY);
});

// Écouter les événements de fin de contact
canvas.addEventListener("touchend", (event) => {
    stopCreatingRipples();
});

// Changer en mode arc-en-ciel à intervalles réguliers
setInterval(() => {
    if (!rainbowMode) {
        rainbowEffect();
        setTimeout(() => {
            rainbowMode = false;
        }, 2000);
    }
}, 30000); // Change this to 50000 for 50 seconds

// Boucle principale pour dessiner
draw();

// Boucle pour mettre à jour le taux de pastilles
setInterval(() => {
    const currentTime = Date.now() / 1000; // Temps en secondes
    rippleInterval = getCurrentRate(currentTime % duration); // Mettre à jour le taux de pastilles
}, 100); // Met à jour toutes les 100 ms
