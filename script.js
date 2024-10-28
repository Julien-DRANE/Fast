let sounds = [];
let pastilles = [];
let tempo = 80; // BPM
let interval;
let lastBeatTime = 0;

function preload() {
    for (let i = 1; i <= 16; i++) {
        sounds[i - 1] = loadSound(`sounds/s0${i}.mp3`);
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(240);
    
    // Écouter l'événement de touch
    canvas.addEventListener('touchstart', createPastille);
    
    // Configurer le tempo
    interval = setInterval(playBeat, 60000 / tempo);
}

function draw() {
    background(240);
    for (let i = 0; i < pastilles.length; i++) {
        pastilles[i].update();
        pastilles[i].display();
    }
}

function createPastille() {
    let couleur = color(random(255), random(255), random(255));
    let pastille = new Pastille(random(width), random(height), couleur);
    pastilles.push(pastille);
}

function playBeat() {
    lastBeatTime = millis();
    for (let i = 0; i < pastilles.length; i++) {
        if (pastilles[i].isActive) {
            sounds[floor(random(0, 16))].play();
        }
    }
}

class Pastille {
    constructor(x, y, couleur) {
        this.x = x;
        this.y = y;
        this.size = 50;
        this.couleur = couleur;
        this.isActive = true;
        this.battement = 0;
    }
    
    update() {
        this.battement = sin((millis() - lastBeatTime) * 0.01) * 10;
    }
    
    display() {
        fill(this.couleur);
        noStroke();
        ellipse(this.x, this.y, this.size + this.battement, this.size + this.battement);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
