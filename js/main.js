let canvas, character, characterImage, butterImage;
let time = 0;
let sprint = 7;
let butterscore = 0;
let end = false;
let butter = [];
let dynamite = [];

/* Preload obrázků */
function preload() {
    butterImage = loadImage("img/butter.png");
    dynamiteImage = loadImage("img/dynamite.png");
    rjImage = loadImage("img/rj.png");
}

/* Vycentrování canvasu */
function centerCanvas() {
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    canvas.position(x, y);
}

/* Postava */
class Character {
    constructor(posX, posY) {
        this.x = posX;
        this.y = posY;
        this.w = 120;
        this.h = 0;
        this.angle = 0;
    }
    /* pohyb postavy */
    move() {
        if (keyIsDown(16)) {
            sprint = 15;
        } else {
            sprint = 7;
        }
        if (keyIsDown(65)) {
            if (this.x > 0) this.x -= sprint;
        }
        if (keyIsDown(68)) {
            if (this.x < width - this.w) this.x += sprint;
        }
    }

    /* kolize postavy s máslem */
    detectCollision(butter) {
        return collideRectRect(
            this.x,
            this.y,
            this.w,
            this.h,
            butter.x,
            butter.y,
            butter.size,
            butter.size
        );
    }

    /* vykreslení postavy */
    draw() {
        this.move();
        push();
        translate(this.x + 20, this.y + 40);
        image(rjImage, -20, -40);
        pop();
    }
}

/* Butter */
class Butter {
    constructor() {
        this.size = random(100, 50);
        this.y = - 100;
        this.x = random(this.size, width - this.size);
        this.speed = random(2, 5);
    }

    /* Rychlost padání másla */
    move() {
        this.y += this.speed;
    }

    /* Vykreslení másla */
    draw() {
        this.move();
        image(butterImage, this.x, this.y, this.size, this.size);
    }
}

/* Dynamite */
class Dynamite {
    constructor() {
        this.size = random(50, 100);
        this.y = - 100;
        this.x = random(this.size, width - this.size);
        this.speed = random(2, 5);
    }

    /* Rychlost padání dynamitu */
    move() {
        this.y += this.speed;
    }

    /* Vykreslení dynamitu */
    draw() {
        this.move();
        image(dynamiteImage, this.x, this.y, this.size, this.size);
    }
}

/* Základní nastavení aplikace v P5 JS */
function setup() {
    canvas = createCanvas(1000, 600);
    canvas.parent("mycanvas");
    character = new Character(width - 550, height - 120);
}

/* Vykreslení canvasu */
function draw() {
    time++;
    if (!end) {
        background(80, 80, 80);
        character.draw();
        /* Butter spawn */
        if (time % 77 == 0) {
            butter.push(new Butter());
        }

        /* Když postava chytí máslo - máslo zmizí a přičte se 1 skóre */
        butter.forEach(function (butter, index, array) {
            butter.draw();
            if (character.detectCollision(butter)) {
                array.splice(index, 1);
                butterscore++;
                score();
            }

            if (butter.y > height) {
                array.splice(index, 1);
            }
        });

        /* Dynamite spawn */
        if (time % 150 == 0) {
            dynamite.push(new Dynamite());
        }

        /* Když postava chytí dynamit - dynamit zmizí a hra se ukončí */
        dynamite.forEach(function (dynamite, index, array) {
            dynamite.draw();
            if (character.detectCollision(dynamite)) {
                array.splice(index, 1);
                dead();
            }

            if (dynamite.y > height) {
                array.splice(index, 1);
            }
        });
    }
}

/* Funkce na přepisování skóre */
function score() {
    const div = document.getElementById('score');
    div.innerHTML = `${butterscore}x <img src="img/butter-score.png" alt="butter">`
}

/* Funkce na vykreslení konec hry */
function dead() {
    end = true;
    background(0);
    fill(255);
    textSize(50);
    textStyle(BOLD);
    text('You lose :(', width / 2 - 115, height / 2);
    text('Click F5 to restart the game', width / 2 - 310, height / 2 + 77);
}