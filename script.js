const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const sound = document.getElementById("sound");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Définir la palette de couleurs
let colors = ["#FFB6C1", "#B0E0E6", "#FFD700", "#98FB98", "#FF69B4", "#ADD8E6"];
let currentColor = 0;
let rainbowMode = false;
const ripples = [];

// Créer une pastille de couleur à l'endroit où l'utilisateur touche
const createRipple = (x, y) => {
    ripples.push({ x, y, radius: 50, alpha: 1 });
    changeColor();
    sound.currentTime = 0; // Réinitialiser le temps pour superposer le son
    sound.play();
};

// Changer la couleur actuelle
const changeColor = () => {
    currentColor = (currentColor + 1) % colors.length;
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

// Dessiner sur le canvas
const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Effacer le canvas chaque image

    ctx.fillStyle = "black"; // Fond noir
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (rainbowMode) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ripples.forEach(ripple => {
        ctx.fillStyle = `rgba(${parseInt(colors[currentColor].slice(1, 3), 16)}, ${parseInt(colors[currentColor].slice(3, 5), 16)}, ${parseInt(colors[currentColor].slice(5, 7), 16)}, ${ripple.alpha})`;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2, false);
        ctx.fill();
    });

    updateRipples();
    requestAnimationFrame(draw);
};

// Écouter les événements de touché sur le canvas
canvas.addEventListener("touchstart", (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    createRipple(touch.clientX, touch.clientY);
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
