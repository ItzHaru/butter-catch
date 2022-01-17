let canvas, character, characterImage, butterImage;
let time = 0;
let sprint = 7;
let butter = [];

function preload() {
    butterImage = loadImage("img/butter.png");
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

    move() {
        if (keyIsDown(16)) {
            sprint = 15;
        } else {
            sprint = 7;
        }
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
            if (this.x > 0) this.x -= sprint;
        }
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
            if (this.x < width - this.w) this.x += sprint;
        }
    }

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

    draw() {
        this.move();
        push();
        translate(this.x + 20, this.y + 40);
        rotate(((2 * PI) / 360) * this.angle);
        image(rjImage, -20, -40);
        pop();
    }
}

/* Butter */
class Butter {
    constructor() {
        this.size = random(50, 100);
        this.y = - 100;
        this.x = random(this.size, width - this.size);
        this.speed = random(2, 5);
    }

    move() {
        this.y += this.speed;
    }

    draw() {
        this.move();
        image(butterImage, this.x, this.y, this.size, this.size);
    }
}

/* Funkce pro základní nastavení aplikace v P5 JS */
function setup() {
    canvas = createCanvas(1000, 600);
    canvas.parent("mycanvas");
    character = new Character(width - 550, height - 120);
}

/* Funkce, která vykresluje objekty na canvas 60x za sekundu */
function draw() {
    time++;
    background(80,80,80);
    character.draw();

    /* Butter spawn */
    if (time % 77 == 0) {
        butter.push(new Butter());
    }

    butter.forEach(function (butter, index, array) {
        butter.draw();
        if (character.detectCollision(butter)) {
            array.splice(index, 1);
        }

        if (butter.y > height) {
            array.splice(index, 1);
        }
    })
}



