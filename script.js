const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const sound = document.getElementById("sound");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let colors = ["#FFB6C1", "#B0E0E6", "#FFD700", "#98FB98", "#FF69B4", "#ADD8E6"];
let currentColor = 0;
let rainbowMode = false;
const ripples = [];

const createRipple = (x, y) => {
    ripples.push({ x, y, radius: 50, alpha: 1 });
    changeColor();
    sound.play();
};

const changeColor = () => {
    currentColor = (currentColor + 1) % colors.length;
};

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

const updateRipples = () => {
    for (let i = 0; i < ripples.length; i++) {
        ripples[i].radius += 2;  // Increase the radius for the ripple effect
        ripples[i].alpha -= 0.02; // Decrease the opacity
        if (ripples[i].alpha <= 0) {
            ripples.splice(i, 1);
            i--;
        }
    }
};

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas each frame

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

canvas.addEventListener("touchstart", (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    createRipple(touch.clientX, touch.clientY);
});

setInterval(() => {
    if (!rainbowMode) {
        rainbowEffect();
        setTimeout(() => {
            rainbowMode = false;
        }, 2000);
    }
}, 30000); // Change this to 50000 for 50 seconds

draw();
