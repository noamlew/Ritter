const gameScreen = document.getElementById("gameScreen");
const ctx = gameScreen.getContext("2d");

gameScreen.width = window.innerWidth - 15;
gameScreen.height = window.innerHeight - 15;

const imgMenRight = new Image();
imgMenRight.src = "http://pixelartmaker.com/art/50ed9eee6eb3a3f.png";

const imgMenLeft = new Image();
imgMenLeft.src =
    "https://lh3.googleusercontent.com/proxy/bfd3z5oNmy9W4Qwxe3EII-0yroZ2J4FzSnkO-LEDGZUCCoRy5kvOOV0po7G8tNHH-1e8dw91V_BPkJlSJ2_xNC2gmA";

const imgLuckyBox = new Image();
imgLuckyBox.src =
    "https://i.pinimg.com/236x/7c/5b/00/7c5b009cc90ed35f392caf7eed32d682.jpg";

const imgBackground = new Image();
imgBackground.src = "https://pressstart.vip/images/uploads/assets/bluemoon.png";

const audioBackground = new Audio();
audioBackground.src =
    "audio/Spanish Flea (Herb Albert) - Comedy Background Music (HD).mp3";

const audioLose = new Audio();
audioLose.src = "audio/Sad Violin - MLG Sound Effects (HD) (mp3cut.net).mp3";

const audioColect = new Audio();
audioColect.src = "audio/Ting Sound Effects All Sounds (mp3cut.net).mp3";

const audioHa = new Audio();
audioHa.src = "audio/Ha Sound Effect (mp3cut.net).mp3";

const screen = {
    w: gameScreen.width,
    h: gameScreen.height,
};

const audioPlay = {
    background: false,
    lose: false,
    colect: false,
};

const holeSize = 120;
const distanceLine = 90;

let time = 0;
let gameOn = true;
let score = 0;
let menImage = imgMenRight;

let lines = [];
let ground;
let lastGround = ground;

let men;

class Line {
    constructor(vy, startHole) {
        this.y = screen.h;
        this.x = 0;
        this.vy = vy;
        this.startHole = startHole;
        this.endHole = startHole + holeSize;
        this.lastTime = time;
    }

    updateLocation() {
        if (time - this.lastTime >= speed.line) {
            this.y += this.vy;
            this.lastTime = time;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 20;
        ctx.moveTo(0, this.y);
        ctx.lineTo(this.startHole, this.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.endHole, this.y);
        ctx.lineTo(screen.w, this.y);
        ctx.stroke();
    }
}

const menStats = Object.freeze({ stand: 1, fall: 2, goRight: 3, goLeft: 4 });

class Men {
    constructor() {
        this.x = 100;
        this.y = 100;
        this.h = 70;
        this.w = 50;
        this.state = menStats.stand;
        this.vy = -1;
        this.vx = 20;
    }
}

let allSpecial = [];
let specielTitle = "";
let getTitle = "";

const luckyBox = {
    w: 40,
    h: 40,
};

class Special {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = luckyBox.w;
        this.h = luckyBox.h;
        this.img = imgLuckyBox;
        this.lastTime = time;
        this.vy = -1;
        this.realized = false;
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }

    updateLocation() {
        if (time - this.lastTime >= speed.line) {
            this.y += this.vy;
            this.lastTime = time;
        }
    }

    get() {
        this.w = 0;
        this.h = 0;
        audioPlay.colect = true;
        this.realized = true;
    }
}

let myBestScore = localStorage.getItem("bestSFERitter");
let startGameTitle = "Play Ritter!!";

const speed = {
    global: 1,
    line: 10,
};

let lastSpeed;
let lastTimeSpeed = 0;

window.onload = startGame();

function startGame() {
    setUpGame();
    mainLoop();
}

function setUpGame() {
    time = 0;
    myBestScore = localStorage.getItem("bestSFERitter");
    gameOn = true;
    lastTimeSpeed = 0;
    lines = [];
    speed.line = 10;
    score = 0;
    allSpecial = [];

    ground = null;
    lastGround = ground;

    menImage = imgMenRight;
    men = new Men();

    startGameTitle = "Play Ritter!!";

    menMove();
}

function mainLoop() {
    gameOn = !checkLose();

    newLine();
    updateLineLocation();
    removeLine();

    updateSpecielLocation();
    getSpeicel();
    removeSpeciel();

    updateMenLocation();

    setScore();
    changespeed();

    draw();
    playAudio();

    if (gameOn) {
        setTimeout(mainLoop, speed.global);
    } else {
        endGame();
    }

    time++;
}

function newLine() {
    let newLine;
    if (
        lines.length === 0 ||
        screen.h - lines[lines.length - 1].y >= distanceLine
    ) {
        let hole =
            lines.length === 0
                ? screen.w - holeSize - 50
                : Math.floor(Math.random() * (screen.w - holeSize));

        newLine = new Line(-1, hole);
        lines.push(newLine);
        specialThings();
    }
}

function setScore() {
    if (lastGround !== ground) {
        lastGround = ground;
        score++;
    }
}

function changespeed() {
    if (time - lastTimeSpeed > 2000) {
        lastTimeSpeed = time;
        speed.line -= 1;
    }
}

function removeLine() {
    if (lines[0].y < 0) {
        lines.shift();
    }
}

function removeSpeciel() {
    if (allSpecial.length > 0 && allSpecial[0].y + luckyBox.h < 0) {
        allSpecial.shift();
    }
}

function updateLineLocation() {
    lines.forEach((line) => {
        line.updateLocation();
    });
}

function playAudio() {
    let Chance = Math.floor(Math.random() * 2000);

    if (gameOn === false) {
        audioBackground.pause();
        audioLose.play();
    } else {
        audioBackground.volume = 0.08;
        audioBackground.play();
    }
    if (audioPlay.colect === true) {
        audioPlay.colect = false;
        audioColect.volume = 0.2;
        audioColect.play();
    } else if (Chance === 5) {
        audioHa.play();
    }
}

function draw() {
    ctx.beginPath();
    ctx.clearRect(0, 0, screen.w, screen.h);

    ctx.drawImage(imgBackground, 0, 0, screen.w, screen.h);

    ctx.drawImage(menImage, men.x, men.y, men.w, men.h);

    lines.forEach((line) => {
        line.draw();
    });

    allSpecial.forEach((oneSpeciel) => {
        oneSpeciel.draw();
    });

    ctx.font = "100px Arial";
    ctx.textAlign = "center";
    console.log(screen);
    ctx.fillText(`${getTitle}`, screen.w / 2, screen.h / 2 - 150);

    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.fillText(`score: ${score}`, screen.w - 200, 40);
    ctx.fillText(myBestScore, screen.w - 400, 40);

    ctx.textAlign = "center";
    ctx.font = "100px Arial";
    ctx.fillText(`${startGameTitle}`, screen.w / 2, screen.h / 2);
    setTimeout(() => {
        startGameTitle = "";
    }, 2000);

    if (gameOn === false) {
        ctx.textAlign = "center";
        ctx.font = "100px Arial";
        ctx.fillText(`game over | score: ${score}`, screen.w / 2, screen.h / 2);
    }
}

function specialThings() {
    let possibleSpeciel = Math.floor(Math.random() * 2);
    if (possibleSpeciel === 1) {
        let newSpeciel = new Special(
            Math.floor(Math.random() * (screen.w - luckyBox.w)),
            lines[lines.length - 1].y - (luckyBox.h + 10)
        );
        allSpecial.push(newSpeciel);
    }
}

const on = {
    slow: false,
    fast: false,
    goFast: false,
    switch: false,
};

function chooseSpeciel() {
    let type = Math.floor(Math.random() * 8);
    switch (type) {
        case 0:
            if (on.slow === false && on.fast === false) {
                type = "fast";
                getTitle = "fast";
                break;
            }

        case 1:
            if (on.slow === false && on.fast === false) {
                type = "slow";
                getTitle = "slow";
                break;
            }

        case 2:
            type = "coin";
            getTitle = "+3";
            break;

        case 3:
            if (on.goFast === false && on.switch === false) {
                type = "go fast";
                getTitle = "go fast";
                break;
            }

        case 4:
            type = "fall";
            getTitle = "fall down";
            break;

        case 5:
            type = "big coin";
            getTitle = "+5";
            break;

        case 6:
            if (on.slow === false && on.fast === false) {
                type = "very fast";
                getTitle = "very fast";
                break;
            }

        case 7:
            if (on.switch === false && on.goFast === false) {
                type = "switch";
                getTitle = "switch sides";
                break;
            }

        default:
            type = "coin defalut";
            getTitle = "+7";
            break;
    }
    return type;
}

function updateSpecielLocation() {
    allSpecial.forEach((oneSpeciel) => {
        oneSpeciel.updateLocation();
    });
}

function getSpeicel() {
    allSpecial.forEach((oneSpeciel) => {
        if (
            men.x < oneSpeciel.x + luckyBox.w &&
            men.x + men.w > oneSpeciel.x &&
            men.y - oneSpeciel.y > -40 &&
            men.y - oneSpeciel.y < 0 &&
            oneSpeciel.realized === false
        ) {
            oneSpeciel.get();
            doSpeciel();
        }
    });
}

function doSpeciel() {
    let val = chooseSpeciel();
    switch (val) {
        case "coin":
            score += 3;
            break;

        case "fast":
            lastSpeed = speed.line;
            speed.line -= 3;
            on.fast = true;
            setTimeout(() => {
                speed.line = lastSpeed;
                on.fast = false;
            }, 2000);
            break;

        case "slow":
            lastSpeed = speed.line;
            speed.line += 5;
            on.slow = true;
            setTimeout(() => {
                speed.line = lastSpeed;
                on.slow = false;
            }, 3000);
            break;

        case "go fast":
            men.vx = 45;
            on.goFast = true;
            setTimeout(() => {
                men.vx = 20;
                on.goFast = false;
            }, 5000);
            break;

        case "fall":
            men.y += 135;
            break;

        case "big coin":
            score += 5;
            break;

        case "very fast":
            lastSpeed = speed.line;
            speed.line -= 6;
            on.fast = true;
            setTimeout(() => {
                speed.line = lastSpeed;
                on.fast = false;
            }, 3000);
            break;

        case "switch":
            men.vx = -men.vx;
            on.switch = true;
            setTimeout(() => {
                men.vx = -men.vx;
                on.switch = false;
            }, 6000);
            break;

        case "coin defalut":
            score += 7;
            break;
    }

    clearGetTitle();
}

function clearGetTitle() {
    setTimeout(() => {
        getTitle = "";
    }, 2000);
}

function menMove() {
    document.addEventListener("keydown", (event) => {
        if (men.state !== menStats.fall) {
            switch (event.keyCode) {
                case 37:
                    men.state = menStats.goLeft;
                    menImage = imgMenLeft;
                    break;

                case 39:
                    men.state = menStats.goRight;
                    menImage = imgMenRight;
                    break;
            }
        }
    });

    document.addEventListener("keyup", () => {
        if (men.state !== menStats.fall) {
            men.state = menStats.stand;
        }
    });
}

function updateMenLocation() {
    updateLocation();
    setGround();
    setFallState();
}

function setFallState() {
    if (
        men.y + men.h < ground.y - 2 ||
        (men.x + men.w < ground.endHole && men.x > ground.startHole)
    ) {
        men.state = menStats.fall;
    } else {
        men.state = menStats.stand;
    }
}

function setGround() {
    for (let oneLine of lines) {
        if (oneLine.y > men.y + men.h) {
            ground = oneLine;
            break;
        }
    }
}

function updateLocation() {
    if (men.state !== menStats.fall) {
        men.y += men.vy;
    } else {
        men.y -= men.vy;
    }

    if (men.state === menStats.goLeft) {
        men.x -= men.vx;
    } else if (men.state === menStats.goRight) {
        men.x += men.vx;
    }

    if (men.x > screen.w - men.w / 2) {
        men.x = men.w / 2;
    } else if (men.x + men.w < men.w / 2) {
        men.x = screen.w - men.w / 2;
    }
}

function checkLose() {
    if (men.y + men.h < 0 || men.y > screen.h) {
        return true;
    } else {
        return false;
    }
}

function endGame() {
    bestScore();
    draw();
    setTimeout(startGame, 3000);
}

function bestScore() {
    myBestScore = parseInt(myBestScore);
    if (!myBestScore) {
        localStorage.setItem("bestSFERitter", score);
    } else if (score > myBestScore) {
        myBestScore = score;
        localStorage.setItem("bestSFERitter", score);
    }
}
