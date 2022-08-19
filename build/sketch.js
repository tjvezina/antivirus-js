import Camera from './3d/camera.js';
import Matrix from './3d/matrix.js';
import Mesh from './3d/mesh.js';
import { loadMesh } from './3d/mesh-loader.js';
import { IncomingActor, ProjectileActor } from './game/actor.js';
import ParticleExplosion from './game/particle-explosion.js';
export const VIEW_WIDTH = 1440;
export const VIEW_HEIGHT = 860;
let viewScale = 1;
export const TUBE_LENGTH = 400;
let score = 0;
const MAX_SCORE = 660;
const SCORE_INC = 4;
let gameCamera;
let lightSource;
let MAX_SPEED;
let MAX_SHIP_ROT;
let worldRot;
let shipRotZ = 0;
let projectileList = [];
let incomingList = [];
let explosions = [];
const SPAWN_INC_INTERVAL = 12.5;
const SPAWN_INC_AMOUNT = 0.025;
let lastSpawnInc = 0;
let closestEnemy = TUBE_LENGTH;
let firstEnemyFound = false;
const INCOMING_SPEED_INC = 0.75;
let incomingSpeed = 25;
let spawnRate = 1;
let lastSpawn = 0;
let imgPaused;
let imgMainScreen;
let imgGUILeft;
let imgGUIRight;
let imgGreenBar;
let imgSpeaker;
let imgSpeakerBar;
let imgTutorial;
let imgClick2Go;
let imgGameOver;
let imgYouWin;
let shipMesh;
let tubeMesh1;
let tubeMesh2;
let tubeMesh3;
let panelMesh;
let shotMesh;
let pickupMesh;
let enemyMesh;
let dataMesh;
let introMusic;
let music1;
let music2;
let music3;
let shoot;
let pickupGood;
let pickupBad;
let balloonPop;
let blowup;
let alarm;
let isTitleScreen = true;
let isTutorial = false;
let isTransition = false;
let isInGame = false;
let isPaused = false;
let isGameOver = false;
let isGameWon = false;
const TUTORIAL_ON_TOTAL = 2;
let tutorialOnTime = 0;
let tutorialMeshSpin = 0;
let tutorialShip;
let tutorialShot;
let tutorialPickup;
let tutorialData;
let tutorialEnemy;
const VOLUME_DISPLAY_TIME = 2;
const VOLUME_INC = 0.04;
let showVolume = false;
let volume = 0.4;
let volumeTimeElapsed = 0;
let currentMusic;
const END_GAME_DELAY = 3;
let endGameTime = 0;
let prevMovedX = 0;
globalThis.preload = function () {
    loadImage('./assets/images/Paused.png', result => { imgPaused = result; });
    loadImage('./assets/images/MainScreen.png', result => { imgMainScreen = result; });
    loadImage('./assets/images/GUI Left.png', result => { imgGUILeft = result; });
    loadImage('./assets/images/GUI Right.png', result => { imgGUIRight = result; });
    loadImage('./assets/images/GreenGradient.png', result => { imgGreenBar = result; });
    loadImage('./assets/images/SpeakerIcon.png', result => { imgSpeaker = result; });
    loadImage('./assets/images/GreenBar.png', result => { imgSpeakerBar = result; });
    loadImage('./assets/images/TutorialScreen.png', result => { imgTutorial = result; });
    loadImage('./assets/images/Click to Continue.png', result => { imgClick2Go = result; });
    loadImage('./assets/images/GameOver.png', result => { imgGameOver = result; });
    loadImage('./assets/images/YouWin.png', result => { imgYouWin = result; });
    loadMesh('Ship', color(0, 78, 206), result => { shipMesh = result; });
    loadMesh('Tube2A', color(30, 30, 30), result => { tubeMesh1 = result; });
    loadMesh('Tube2B', color(150, 75, 0), result => { tubeMesh2 = result; });
    loadMesh('Tube2C', color(200, 175, 0), result => { tubeMesh3 = result; });
    loadMesh('Panel', color(200, 200, 0), result => { panelMesh = result; });
    loadMesh('Shot', color(175, 0, 0), result => { shotMesh = result; });
    loadMesh('Pickup', color(20, 150, 0), result => { pickupMesh = result; });
    loadMesh('Enemy1', color(175, 0, 0), result => { enemyMesh = result; });
    loadMesh('Data1', color(20, 150, 0), result => { dataMesh = result; });
    loadSound('./assets/audio/Buzz Loop.mp3', result => { introMusic = result; });
    loadSound('./assets/audio/Octivate.mp3', result => { music1 = result; });
    loadSound('./assets/audio/Reggaelator.mp3', result => { music2 = result; });
    loadSound('./assets/audio/Freedom.mp3', result => { music3 = result; });
    loadSound('./assets/audio/Shoot.wav', result => { shoot = result; });
    loadSound('./assets/audio/PickupGood.wav', result => { pickupGood = result; });
    loadSound('./assets/audio/PickupBad.wav', result => { pickupBad = result; });
    loadSound('./assets/audio/BalloonPop.wav', result => { balloonPop = result; });
    loadSound('./assets/audio/Blowup.wav', result => { blowup = result; });
    loadSound('./assets/audio/Alarm.wav', result => { alarm = result; });
};
globalThis.windowResized = function () {
    viewScale = (windowWidth / windowHeight < VIEW_WIDTH / VIEW_HEIGHT ? windowWidth / VIEW_WIDTH : windowHeight / VIEW_HEIGHT);
    resizeCanvas(VIEW_WIDTH * viewScale, VIEW_HEIGHT * viewScale);
};
globalThis.setup = function () {
    viewScale = (windowWidth / windowHeight < VIEW_WIDTH / VIEW_HEIGHT ? windowWidth / VIEW_WIDTH : windowHeight / VIEW_HEIGHT);
    createCanvas(VIEW_WIDTH * viewScale, VIEW_HEIGHT * viewScale);
    pixelDensity(1);
    strokeJoin(ROUND);
    strokeCap(ROUND);
    gameCamera = new Camera(createVector(0, 0, -50), createVector(0, 0, 1), PI / 4, width / height);
    lightSource = createVector(0.87, -1.24, -0.92);
    worldRot = PI;
    MAX_SPEED = PI * 0.05;
    MAX_SHIP_ROT = PI / 4;
    tutorialShip = new Mesh(shipMesh);
    tutorialShot = new Mesh(shotMesh);
    tutorialPickup = new Mesh(pickupMesh);
    tutorialData = new Mesh(dataMesh);
    tutorialEnemy = new Mesh(enemyMesh);
    document.addEventListener('pointerlockchange', onPointerLockChange);
    volume = getItem('volume') ?? 0.4;
    resetGame();
};
globalThis.draw = function () {
    background(42);
    scale(viewScale);
    if (isTitleScreen || isTutorial || isTransition) {
        mainMenu();
    }
    else if (isInGame) {
        if (!isPaused)
            update();
        drawGame();
        if (isPaused)
            paused();
    }
    if (showVolume) {
        drawVolume();
    }
    prevMovedX = ((isTransition || isInGame) && !isPaused ? movedX : 0);
};
globalThis.keyPressed = function () {
    if (keyCode === ESCAPE && !isPaused) {
        exitPointerLock();
    }
    if ((isGameOver || isGameWon) && endGameTime > END_GAME_DELAY && (keyCode === ENTER || keyCode === 32)) {
        resetGame();
    }
    if ([107, 187].includes(keyCode)) {
        volume = constrain(volume + VOLUME_INC, 0, 1);
        showVolume = true;
        volumeTimeElapsed = 0;
        currentMusic.setVolume(volume / 2);
        storeItem('volume', volume);
    }
    if ([109, 189].includes(keyCode)) {
        volume = constrain(volume - VOLUME_INC, 0, 1);
        showVolume = true;
        volumeTimeElapsed = 0;
        currentMusic.setVolume(volume / 2);
        storeItem('volume', volume);
    }
};
globalThis.mouseClicked = function () {
    if (mouseButton !== LEFT)
        return;
    if (isTitleScreen && !isTutorial) {
        isTutorial = true;
        return;
    }
    if (isTutorial) {
        playMusic(random([music1, music2, music3]));
        requestPointerLock();
        isTransition = true;
        isTitleScreen = false;
        return;
    }
    if (isPaused) {
        isPaused = false;
        requestPointerLock();
        return;
    }
    if ((isGameOver || isGameWon) && endGameTime > END_GAME_DELAY) {
        resetGame();
    }
};
globalThis.mousePressed = function () {
    if (isInGame && !isPaused && !isGameOver) {
        switch (mouseButton) {
            case LEFT:
                projectileList.push(new ProjectileActor(shotMesh, roundToTrack(-worldRot), false));
                playSound(shoot);
                break;
            case RIGHT:
                projectileList.push(new ProjectileActor(pickupMesh, roundToTrack(-worldRot), true));
                playSound(shoot);
                break;
        }
    }
};
function onPointerLockChange() {
    if (isInGame && !isPaused && document.pointerLockElement === null) {
        isPaused = true;
    }
}
function mainMenu() {
    if (isTitleScreen) {
        image(imgMainScreen, 0, 0, VIEW_WIDTH, VIEW_HEIGHT);
    }
    if (isTutorial) {
        if (isTransition) {
            gameCamera.pos = createVector(0, 0, -50 - (100 * (tutorialOnTime / TUTORIAL_ON_TOTAL)));
            update();
            drawGame();
        }
        image(imgTutorial, 0, -VIEW_HEIGHT + (VIEW_HEIGHT * (tutorialOnTime / TUTORIAL_ON_TOTAL)));
        if (!isTitleScreen && !isTransition) {
            tutorialMeshSpin += PI * (deltaTime / 1000);
            tutorialShip.world = Matrix.mult(Matrix.createTranslation(-32, 20, 0), Matrix.createRotationY(radians(-10)), Matrix.createRotationX(radians(-90)));
            tutorialShot.world = Matrix.mult(Matrix.createTranslation(6.5, 11.4, 0), Matrix.createRotationY(tutorialMeshSpin));
            tutorialPickup.world = Matrix.mult(Matrix.createTranslation(1.5, 11, 0), Matrix.createRotationY(tutorialMeshSpin));
            tutorialData.world = Matrix.mult(Matrix.createTranslation(-24, -6, 0), Matrix.createRotationY(radians(10)), Matrix.createScale(2));
            tutorialEnemy.world = Matrix.mult(Matrix.createTranslation(24, 3, 0), Matrix.createRotationX(radians(-10)), Matrix.createRotationY(radians(10)), Matrix.createScale(2));
            [tutorialShip, tutorialShot, tutorialPickup, tutorialData, tutorialEnemy].forEach(mesh => {
                mesh.convert2D(gameCamera);
                mesh.draw(lightSource);
            });
        }
        if (!isTransition) {
            if (tutorialOnTime < TUTORIAL_ON_TOTAL) {
                tutorialOnTime += (deltaTime / 1000);
            }
            else {
                tutorialOnTime = TUTORIAL_ON_TOTAL;
                isTitleScreen = false;
            }
        }
        else {
            if (tutorialOnTime > 0) {
                tutorialOnTime -= (deltaTime / 1000);
            }
            else {
                isTutorial = false;
                isTransition = false;
                isInGame = true;
                gameCamera.pos = createVector(0, 0, -50);
            }
        }
    }
    if (!isTransition) {
        image(imgClick2Go, 1174, 10);
    }
}
function update() {
    lastSpawn += (deltaTime / 1000);
    lastSpawnInc += (deltaTime / 1000);
    if (lastSpawnInc > SPAWN_INC_INTERVAL) {
        lastSpawnInc -= SPAWN_INC_INTERVAL;
        spawnRate -= SPAWN_INC_AMOUNT;
        incomingSpeed += INCOMING_SPEED_INC;
    }
    worldRot += constrain(PI * -prevMovedX * (deltaTime / 1000) / 10, -MAX_SPEED, MAX_SPEED);
    worldRot %= TWO_PI;
    shipRotZ += PI * (deltaTime / 1000) * -prevMovedX / 10;
    shipRotZ = constrain(shipRotZ, -MAX_SHIP_ROT, MAX_SHIP_ROT);
    if (prevMovedX === 0) {
        if (shipRotZ < 0) {
            shipRotZ += PI * (deltaTime / 1000);
            if (shipRotZ > 0)
                shipRotZ = 0;
        }
        else if (shipRotZ > 0) {
            shipRotZ -= PI * (deltaTime / 1000);
            if (shipRotZ < 0)
                shipRotZ = 0;
        }
    }
    if ((random() > 0.5 || isGameOver) && !isGameWon) {
        if (lastSpawn >= spawnRate) {
            lastSpawn -= spawnRate;
            incomingList.push(new IncomingActor(enemyMesh, radians(floor(random(18)) * 20 + 10), false, incomingSpeed));
        }
    }
    else {
        if (lastSpawn >= spawnRate) {
            lastSpawn -= spawnRate;
            incomingList.push(new IncomingActor(dataMesh, radians(floor(random(18)) * 20 + 10), true, incomingSpeed));
        }
    }
    [tubeMesh1, tubeMesh2, tubeMesh3].forEach(tubeMesh => { tubeMesh.world = Matrix.createRotationZ(worldRot); });
    panelMesh.world = Matrix.createRotationZ(getPanelPos(worldRot));
    shipMesh.world = Matrix.mult(Matrix.createTranslation(0, -18, 0), Matrix.createRotationZ(shipRotZ));
    projectileList = projectileList.filter(projectile => projectile.update(worldRot));
    firstEnemyFound = false;
    incomingList = incomingList.filter(incoming => {
        if (!firstEnemyFound && !incoming.isGood && !incoming.isLeaving) {
            firstEnemyFound = true;
            closestEnemy = incoming.posZ;
        }
        const isAlive = incoming.update(worldRot);
        if (!isAlive && !isGameOver && !incoming.isGood && !incoming.isLeaving) {
            isGameOver = true;
            playSound(alarm);
        }
        return isAlive;
    });
    if (!firstEnemyFound)
        closestEnemy = TUBE_LENGTH;
    closestEnemy = constrain(closestEnemy, 0, TUBE_LENGTH);
    tubeMesh2.color = lerpColor(color(255, 0, 0), color(200, 125, 0), sqrt(sqrt(closestEnemy / TUBE_LENGTH)));
    for (const projectile of [...projectileList]) {
        for (const incoming of [...incomingList]) {
            if (incoming.isLeaving)
                continue;
            if (checkCollision(projectile, incoming)) {
                if (projectile.isGood) {
                    incoming.pickup();
                    if (incoming.isGood) {
                        score += SCORE_INC;
                        playSound(pickupGood);
                    }
                    else {
                        score -= SCORE_INC;
                        playSound(pickupBad);
                    }
                }
                else {
                    if (incoming.isGood) {
                        playSound(balloonPop);
                    }
                    else {
                        playSound(blowup);
                    }
                    explosions.push(new ParticleExplosion(incoming.posZ, incoming.rot, incoming.mesh.color));
                    incomingList.splice(incomingList.indexOf(incoming), 1);
                }
                projectileList.splice(projectileList.indexOf(projectile), 1);
                break;
            }
        }
    }
    explosions = explosions.filter(explosion => explosion.update(worldRot));
    if (isGameOver) {
        endGameTime += (deltaTime / 1000);
        tubeMesh3.color = lerpColor(color(200, 175, 0), color(255, 0, 0), (sin(endGameTime * TWO_PI * 2) + 1) / 2);
        tubeMesh2.color = lerpColor(color(255, 0, 0), color(200, 125, 0), (sin(endGameTime * TWO_PI) + 1) / 2);
    }
    else if (isGameWon) {
        endGameTime += (deltaTime / 1000);
        tubeMesh3.color = lerpColor(color(200, 175, 0), color(0, 255, 0), (sin(endGameTime * TWO_PI * 2) + 1) / 2);
        tubeMesh2.color = lerpColor(color(0, 255, 0), color(200, 125, 0), (sin(endGameTime * TWO_PI) + 1) / 2);
    }
    score = constrain(score, 0, MAX_SCORE);
    if (score === MAX_SCORE) {
        isGameWon = true;
        incomingList = incomingList.filter(incoming => {
            if (!incoming.isGood && !incoming.isLeaving) {
                explosions.push(new ParticleExplosion(incoming.posZ, incoming.rot, incoming.mesh.color));
                return false;
            }
            return true;
        });
    }
}
function drawGame() {
    tubeMesh1.convert2D(gameCamera);
    tubeMesh2.convert2D(gameCamera);
    tubeMesh3.convert2D(gameCamera);
    panelMesh.convert2D(gameCamera);
    tubeMesh1.draw(lightSource);
    tubeMesh2.draw(lightSource);
    tubeMesh3.draw(lightSource);
    panelMesh.draw(lightSource);
    [...incomingList].reverse().forEach(incoming => incoming.draw(gameCamera, lightSource));
    for (const explosion of explosions) {
        explosion.convert2D(gameCamera);
        explosion.draw();
    }
    projectileList.forEach(projectile => projectile.draw(gameCamera, lightSource));
    shipMesh.convert2D(gameCamera);
    shipMesh.draw(lightSource);
    fill(0).stroke(0).strokeWeight(1);
    rect(1270, 90, 100, 770);
    image(imgGreenBar, 1275, 760 - score, 75, score);
    image(imgGUILeft, 0, 0);
    image(imgGUIRight, 1170, 0);
    if (endGameTime > END_GAME_DELAY) {
        const img = (isGameOver ? imgGameOver : imgYouWin);
        push();
        {
            imageMode(CENTER);
            image(img, VIEW_WIDTH / 2, VIEW_HEIGHT / 2);
            image(imgClick2Go, VIEW_WIDTH / 2, VIEW_HEIGHT / 2 + (img.height + imgClick2Go.height) / 2);
        }
        pop();
    }
}
function paused() {
    push();
    {
        imageMode(CENTER);
        image(imgPaused, VIEW_WIDTH / 2, VIEW_HEIGHT / 2);
    }
    pop();
}
function drawVolume() {
    volumeTimeElapsed += (deltaTime / 1000);
    if (volumeTimeElapsed > VOLUME_DISPLAY_TIME) {
        showVolume = false;
    }
    image(imgSpeaker, 300, 700);
    for (let c = 0; c < round(volume / VOLUME_INC); c++) {
        image(imgSpeakerBar, 444 + (25 * c), 720, 10, 88);
    }
}
function checkCollision(a, b) {
    if (abs(a.posZ - b.posZ) < 6) {
        let orbitA = a.rot - floor(a.rot / TWO_PI) * TWO_PI;
        let orbitB = b.rot - floor(b.rot / TWO_PI) * TWO_PI;
        orbitA = ((orbitA % TWO_PI) + TWO_PI) % TWO_PI;
        orbitB = ((orbitB % TWO_PI) + TWO_PI) % TWO_PI;
        const dist = abs(orbitA - orbitB);
        return (dist < (PI / 36) || dist > (TWO_PI - PI / 36));
    }
    return false;
}
function playSound(sound) {
    sound.playMode('sustain');
    sound.play();
    sound.setVolume(volume / 2);
}
function playMusic(music) {
    currentMusic?.stop();
    currentMusic = music;
    currentMusic.loop();
    currentMusic.setVolume(volume / 2);
}
function resetGame() {
    isTitleScreen = true;
    isTutorial = false;
    isTransition = false;
    isInGame = false;
    isPaused = false;
    isGameOver = false;
    isGameWon = false;
    exitPointerLock();
    score = 0;
    tutorialOnTime = 0;
    lastSpawnInc = 0;
    incomingSpeed = 25;
    spawnRate = 1;
    lastSpawn = 0;
    endGameTime = 0;
    tubeMesh3.color = color(200, 175, 0);
    projectileList.length = 0;
    incomingList.length = 0;
    explosions.length = 0;
    alarm.stop();
    playMusic(introMusic);
}
function roundToTrack(value) {
    let deg = floor(degrees(value));
    while (deg < 0)
        deg += 360;
    return radians(deg - (deg % 20) + 10);
}
function getPanelPos(worldRot) {
    let deg = degrees(worldRot);
    while (deg < 0)
        deg += 360;
    const mod = floor(deg / 20);
    return radians(deg - mod * 20);
}
//# sourceMappingURL=sketch.js.map