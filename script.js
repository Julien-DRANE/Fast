const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const sound = document.getElementById("sound");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Définir une nouvelle palette de couleurs douce
let colors = ["#FFB6C1", "#B0E0E6", "#FFD700", "#98FB98", "#FF69B4", "#ADD8E6", "#FF4500", "#1E90FF"];
let currentColor = 0;
let rainbowMode = false;
const ripples = [];
const stars = [];
let rippleInterval;
let isTouching = false;

// Créer une pastille de couleur à l'endroit où l'utilisateur touche
const createRipple = (x, y) => {
    const radius = Math.random() * 30 + 20; // Variation de taille
    ripples.push({ x, y, radius, alpha: 1 });
    changeColor();
    sound.currentTime = 0; // Réinitialiser le temps pour superposer le son
    sound.play();
};

// Changer la couleur actuelle
const changeColor = () => {
    currentColor = (currentColor + 1) % colors.length;
};

// Ajouter une étoile brillante
const createStar = (x, y) => {
    stars.push({ x, y, size: 5, alpha: 1, speed: 1 });
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
    for (let i = 0; i < ripples.length; i++) {
        ripples[i].radius += 2;  // Augmenter le rayon pour l'effet de pastille
        ripples[i].alpha -= 0.02; // Diminuer l'opacité
        if (ripples[i].alpha <= 0) {
            ripples.splice(i, 1);
            i--;
        }
    }
};

// Mettre à jour les étoiles brillantes
const updateStars = () => {
    for (let i = 0; i < stars.length; i++) {
        stars[i].size += 0.5; // Augmenter la taille de l'étoile
        stars[i].alpha -= 0.01; // Diminuer l'opacité
        stars[i].speed += 0.05; // Augmenter la vitesse

        // Mettre à jour la position de l'étoile
        stars[i].y -= stars[i].speed;

        if (stars[i].alpha <= 0) {
            stars.splice(i, 1);
            i--;
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

    updateRipples();
    updateStars();
    requestAnimationFrame(draw);
};

// Démarrer la création de pastilles lors du contact
const startCreatingRipples = (x, y) => {
    isTouching = true;
    createRipple(x, y);
    createStar(x, y); // Créer une étoile à l'endroit touché

    // Créer des pastilles à intervalles réguliers
    rippleInterval = setInterval(() => {
        createRipple(x, y);
    }, 1000 / 5); // 5 pastilles par seconde
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
    }
};

// Écouter les événements de touché sur le canvas
canvas.addEventListener("touchstart", (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    startCreatingRipples(touch.clientX, touch.clientY);
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

draw();
