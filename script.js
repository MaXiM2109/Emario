let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

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
    setDirection(direction){
        this.direction = direction;
    }
    getDirection(){
        return this.direction;
    }
}

class NPC extends Subject {
    constructor(speed = 5, attack = false, direction = 0) {
        super();
        this.speed = speed;
        this.attack = attack;
        this.direction = direction;
    }
    setPhase(attack){
        this.attack = attack;
    }
    getPhase(){
        return this.attack;
    }
}

class Player extends Subject{
    constructor(speed = 5, direction = 0) {
        super();
        this.speed = speed;
        this.direction = direction;
    }
}

//ОБЪЕКТЫ

let guard = new NPC(5, false, 0);
let imgGuard = new Image();

let coin = new Subject(0, 0, "./pic/coin.png");
coin.setY(200);
let imgCoin = new Image();
imgCoin.src = coin.src;
let score = 0;
let time = 0;

let background = new Image(500,500);
background.src = "./pic/background.jpg";

let player = new Player(10, 1);
let isJump = true;
let imgPlayer = new Image();
let stepSound = new Audio("./sound/step.mp3")

//НАЧАЛЬНОЕ ПОЛОЖЕНИЕ

function defaultPosition() {
    coin.randomX();
    player.setX(50);
    player.setY(innerHeight - 150);
    guard.setX(window.innerWidth - 250);
    guard.setY(innerHeight - 250);
    guard.setPhase(false);
    guard.setDirection(0);
    time = 0;
    score = 0;
}

defaultPosition();

//ОТРИСОВКА

function draw() {
    if (player.getDirection()) {
        imgPlayer.src = "./pic/playerRight.png";
    } else {
        imgPlayer.src = "./pic/playerLeft.png";
    }
   if (guard.getDirection()) {
        imgGuard.src = "./pic/guardRight.png";
    } else {
        imgGuard.src = "./pic/guardLeft.png";
    }
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.drawImage(background, 0, 0, innerWidth, innerHeight);
    ctx.drawImage(imgPlayer, player.getX(), player.getY(), imgPlayer.width * 1.5, imgPlayer.height / 3);
    ctx.drawImage(imgCoin, coin.getX(), coin.getY(), imgCoin.width / 7, imgCoin.height / 10);
    ctx.drawImage(imgGuard, guard.getX(), guard.getY(), imgGuard.width/2, imgGuard.height/2);
    ctx.font = "25px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Score: " + score, 8, 20);
}

imgCoin.onload = imgPlayer.onload = imgGuard.onload = background.onload = draw;

//ТАЙМЕР

function timer() {
    time++;
}
setInterval(timer, 1000);

//УСЛОВИЯ

function getCoin() {
    if (player.getX() - 100 <= coin.getX()-150) {
        if (player.getX() + 100 >= coin.getX()-150) {
            if (player.getY() - 100 <= coin.getY()) {
                if (player.getY() + 100 >= coin.getY()) {
                    score++;
                    coin.setX = coin.randomX();
                    if (score > 0) {
                        guard.setPhase(true);
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
    if (guard.getPhase()) {
        if (player.getX() - 50 <= guard.getX() - 100) {
            if (player.getX() + 50 >= guard.getX() - 100) {
                if (player.getY() - 100 <= guard.getY()) {
                    if (player.getY() + 100 >= guard.getY()) {
                        alert("Вас поймали за неадекватное поведение на Красной Площади, но Вы успели собрать " + score + " шапок");
                        defaultPosition();
                    };
                }
            }
        }
    }
}

//ДВИЖЕНИЕ

function jumpUp() {
    {
        setTimeout(function () {
            if (player.getY() > window.innerHeight * 0.2) {
                player.setY(player.getY() - 5);
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
            if (player.getY() < window.innerHeight * 0.8) {
               player.setY(player.getY()+5);
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
    if (guard.getPhase()) {
        if (guard.getDirection()) {
            guard.setX(guard.getX() + guard.speed);
        } else {
            guard.setX(guard.getX() - guard.speed);
        };
        if (guard.getX() > window.innerWidth - 230) {
            guard.setDirection(0);
        }
        if (guard.getX() < 0) {
            guard.setDirection(1);
        };
    }
}
setInterval(moveGuard, 1);
setInterval(getCoin, 1);
setInterval(gameOver, 1);

//УПРАВЛЕНИЕ

document.addEventListener("keydown", (event) => {
    let keyPressed = event.key;
    switch (keyPressed) {
        case "ArrowRight": {
            if (player.getX() <= window.innerWidth - 230) {
                player.setX(player.getX() + player.speed);
            };
            stepSound.play();
            player.setDirection(1);
            break;
        }
        case "ArrowLeft": {
            if (player.getX() >= -150) {
                player.setX(player.getX() - player.speed);
            };
            stepSound.play();
            player.setDirection(0);
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