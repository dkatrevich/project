const { PI, cos, acos, sin, asin, abs, sqrt, pow, floor, round, random, atan2 } = Math;
const HALF_PI = 0.5 * PI;
const TAU = 2 * PI;
const QT3_TAU = TAU - HALF_PI;
const TO_RAD = PI / 180;
const rand = n => n * random();
const randRange = n => n - rand(2 * n);
const fadeIn = (t, m) => t / m;
const fadeOut = (t, m) => (m - t) / m;
const fadeInOut = (t, m) => {
    let hm = 0.5 * m;
    return abs((t + hm) % m - hm) / hm;
};
const dist = (x1, y1, x2, y2) => sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));
const angle = (x1, y1, x2, y2) => atan2(y2 - y1, x2 - x1);
const lerp = (n1, n2, speed) => (1 - speed) * n1 + speed * n2;

const deflectorCount = 50;
const particleCount = 500;

let canvas;
let ctx;
let origin;
let mouse;
let hover;
let deflectors;
let particles;

function setup() {
    canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d');
    canvas.style = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    `;
    document.body.appendChild(canvas);
    origin = {
        x: 0,
        y: 0
    };
    mouse = {
        x: 0,
        y: 0
    };
    hover = false;
    init();
    draw();
}

function init() {
    resize();
    hover = false;

    deflectors = [];
    for(let i = 0; i < deflectorCount; i++) {
        deflectors.push(getDeflector());
    }

    particles = [];
    for(let i = 0; i < particleCount; i++) {
        particles.push(getParticle(i).create());
    }
}

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    origin.x = mouse.x = 0.5 * canvas.width;
    origin.y = mouse.y = 0.5 * canvas.height;
}

function mouseHandler(e) {
    hover = e.type === "mousemove";
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

function getDeflector() {
    return {
        position: {
            x: rand(window.innerWidth),
            y: rand(window.innerHeight)
        },
        velocity: {
            x: randRange(1),
            y: randRange(1)
        },
        threshold: rand(200) + 100,
        direction: rand(TAU),
        move() {
            if (this.position.x > canvas.width || this.position.x < 0) {
                this.velocity.x *= -1;
            }
            if (this.position.y > canvas.height || this.position.y < 0) {
                this.velocity.y *= -1;
            }
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    };
}

function getParticle(i) {
    return {
        create() {
            this.position.x = this.lastPosition.x = origin.x + randRange(1);
            this.position.y = this.lastPosition.x = origin.y + randRange(1);
            this.speed = rand(5) + 1;
            this.size = rand(3) + 0.5;
            this.life = 0;
            this.ttl = rand(100);
            this.hue = randRange(30);
            this.direction = angle(0.5 * canvas.width, 0.5 * canvas.height, this.position.x, this.position.y);
            return this;
        },
        position: {
            x: 0,
            y: 0
        },
        lastPosition: {
            x: 0,
            y: 0
        },
        velocity: {
            x: 0,
            y: 0
        },
        update() {
            this.life++;
            this.lastPosition.x = this.position.x;
            this.lastPosition.y = this.position.y;
            this.velocity.x = lerp(
                this.velocity.x,
                cos(this.direction) * fadeInOut(this.life, this.ttl) * this.speed,
                0.15
            );
            this.velocity.y = lerp(
                this.velocity.y,
                sin(this.direction) * fadeInOut(this.life, this.ttl) * this.speed,
                0.15
            );
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            this.life > this.ttl && this.create();
        },
        draw() {
            this.update();
            ctx.beginPath();
            ctx.lineWidth = this.size;
            ctx.strokeStyle = `hsla(${this.hue},60%,50%,${fadeInOut(this.life, this.ttl) * 0.5})`;
            ctx.moveTo(this.lastPosition.x, this.lastPosition.y);
            ctx.lineTo(this.position.x, this.position.y);
            ctx.stroke();
            ctx.closePath();
        }
    }
}

let deflector, particle;

function draw() {
    let i, j;
    origin.x =
        lerp(
            origin.x,
            hover ? mouse.x : 0.5 * canvas.width,
            0.05
        );
    origin.y =
        lerp(
            origin.y,
            hover ? mouse.y : 0.5 * canvas.height,
            0.05
        );
    ctx.fillStyle = "rgba(0,0,0,0.05)"
    ctx.fillRect(0,0,canvas.width,canvas.height);
    for(i = particles.length - 1; i >= 0; i--) {
        particle = particles[i];
        for(j = deflectors.length - 1; j >= 0; j--) {
            deflector = deflectors[j];

            i === 0 && deflector.move();

            particle.direction =
                dist(
                    particle.position.x,
                    particle.position.y,
                    deflector.position.x,
                    deflector.position.y
                ) < deflector.threshold
                && lerp(
                particle.direction,
                angle(
                    deflector.position.x,
                    deflector.position.y,
                    particle.position.x,
                    particle.position.y
                ) + angle(
                origin.x,
                origin.y,
                particle.position.x,
                particle.position.y
                ),
                0.075
                )
                || particle.direction;
        }

        particle.draw();
    }

    ctx.save();
    ctx.globalCompositeOperation = "lighten";
    ctx.filter = "blur(6px)";
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    ctx.save();
    ctx.drawImage(canvas, 0, 0);
    ctx.restore();

    window.requestAnimationFrame(draw);
}

window.addEventListener("load", setup);
window.addEventListener("resize", resize);
window.addEventListener("mousemove", mouseHandler);
window.addEventListener("mouseout", mouseHandler);
window.addEventListener("click", init);