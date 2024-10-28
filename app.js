const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const sound = document.getElementById("sound");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let colors = ["#FFB6C1", "#B0E0E6", "#FFD700", "#98FB98", "#FF69B4", "#ADD8E6"];
let currentColor = 0;
let rainbowMode = false;

const createRipple = (x, y) => {
    ctx.fillStyle = colors[currentColor];
    ctx.beginPath();
    ctx.arc(x, y, 50, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.globalAlpha = 0.5;
    ctx.filter = "blur(10px)";
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.filter = "none";
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

const draw = () => {
    if (rainbowMode) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(draw);
};

canvas.addEventListener("touchstart", (event) => {
    event.preventDefault();
    const touch = event.touches[0];
    createRipple(touch.clientX, touch.clientY);
    sound.play();
    changeColor();
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
