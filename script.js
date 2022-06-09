class Subject {
    constructor(x = innerWidth / 2, y = innerHeight / 2, src = "") {
        this.x = x;
        this.y = y;
        this.src = src;
    }
    setX(x) {
        this.x = x;
    }
    setY(y) {
        this.y = y;
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    startPosition() {
        this.x = innerWidth / 2;
        this.y = innerHeight / 2;
    }
    randomX() {
        this.x = Math.random() * (innerWidth * 0.9 - 10) + 10;
    }
    randomY() {
        this.y = Math.random() * (innerHeight * 0.45 - innerHeight * 0.35) + innerHeight * 0.35;
    }
}

class NPC extends Subject {
    constructor(speed = 5, health = 3, damage = 1) {
        super();
        this.speed = speed;
        this.health = health;
        this.damage = damage;
    }
}

let imgGuard = new Image();
let xGuard = window.innerWidth - 250;
let yGuard = innerHeight - 250;
let attack = false;
let speedGuard = 5;
directionGuard = 0;

let coin = new Subject(500, 500, "./pic/coin.png");
let imgCoin = new Image();
imgCoin.src = coin.src;
let score = 0;
let time = 0;

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

let background = new Image();
background.src = "./pic/background.jpg";

let player = new Image();
let directionPlayer = 1;

let stepSound = new Audio("./sound/step.mp3")

let xPlayer = 50,
    yPlayer = innerHeight - 150;
    speed = 10;
isJump = true;

function defaultPosition() {
    coin.randomX();
    coin.setY(200);
}

defaultPosition();

function draw() {
    if (directionPlayer == 0) {
        player.src = "./pic/playerLeft.png";
    } else {
        player.src = "./pic/playerRight.png";
    }
    if (directionGuard == 0) {
        imgGuard.src = "./pic/guardLeft.png";
    } else {
        imgGuard.src = "./pic/guardRight.png";
    }
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.drawImage(background, 0, 0, innerWidth, innerHeight);
    ctx.drawImage(player, xPlayer, yPlayer, player.width * 1.5, player.height / 3);
    ctx.drawImage(imgCoin, coin.getX(), coin.getY(), imgCoin.width / 7, imgCoin.height / 10);
    ctx.drawImage(imgGuard, xGuard, yGuard, imgGuard.width / 2, imgGuard.width / 2);
    ctx.font = "25px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Score: " + score, 8, 20);
}

imgCoin.onload = player.onload = imgGuard.onload = background.onload = draw;

function timer() {
    time++;
}
setInterval(timer, 1000);


function getCoin() {
    if (xPlayer - 100 <= coin.getX()-150) {
        if (xPlayer + 100 >= coin.getX()-150) {
            if (yPlayer - 100 <= coin.getY()) {
                if (yPlayer + 100 >= coin.getY()) {
                    score++;
                    coin.setX = coin.randomX();
                    if (score > 0) {
                        attack = true;
                    };
                    if (score == 5) {
                        alert("Вы потратили " + time + " секунд своей жизни, чтобы Максим собрал 5 шапок на Красной Площади");
                        
                    };
                }
            }
        }
    }
}

function gameOver() {
    if (attack) {
        if (xPlayer - 50 <= xGuard - 100) {
            if (xPlayer + 50 >= xGuard - 100) {
                if (yPlayer - 100 <= yGuard) {
                    if (yPlayer + 100 >= yGuard) {
                        alert("Вас поймали за неадекватное поведение на Красной Площади, но Вы успели собрать " + score + " шапок");
                        xPlayer = 50,
                        yPlayer = innerHeight - 150;
                        directionPlayer = 1;
                        xGuard = window.innerWidth - 250;
                        yGuard = innerHeight - 250;
                        directionGuard = 0;
                        attack = false;
                        score = 0;
                        time = 0;
                    };
                }
            }
        }
    }
}

//Движение
function jumpUp() {
    {
        setTimeout(function () {
            if (yPlayer > window.innerHeight * 0.2) {
                yPlayer -= 5;
            } else {
                jumpDown();
                return;
            }
            jumpUp();
            draw();
        }, 5);
    }
}

function jumpDown() {
    {
        setTimeout(function () {
            if (yPlayer < window.innerHeight * 0.8) {
                yPlayer += 5;
            } else {
                isJump = true;
                draw();
                return;
            }
            jumpDown();
            draw();
        }, 5);
    }
}

function moveGuard() {
    if (attack) {
        if (directionGuard) {
            xGuard += speedGuard;
        } else {
            xGuard -= speedGuard;
        };
        if (xGuard > window.innerWidth - 230) {
            directionGuard = 0;
        }
        if (xGuard < 0) {
            directionGuard = 1;
        };
    }
}
setInterval(moveGuard, 1);
setInterval(getCoin, 1);
setInterval(gameOver, 1);

//Управление
document.addEventListener("keydown", (event) => {
    let keyPressed = event.key;
    switch (keyPressed) {
        case "ArrowRight": {
            if (xPlayer <= window.innerWidth - 230) {
                xPlayer += speed;
            };
            stepSound.play();
            directionPlayer = 1;
            break;
        }
        case "ArrowLeft": {
            if (xPlayer >= -150) {
                xPlayer -= speed;
            };
            stepSound.play();
            directionPlayer = 0;
            break;
        }
        case 'ArrowUp': {
            if (isJump) {
                isJump = false;
                jumpUp();
            }
        }
    }
    draw();
});

document.addEventListener("keyup", (event) => {
    let keyPressed = event.key;
    switch (keyPressed) {
        case "ArrowRight": {
            stepSound.pause();
            break;
        }
        case "ArrowLeft": {
            stepSound.pause();
            break;
        }
    }
});