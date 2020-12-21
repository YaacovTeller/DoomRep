//LEVELS
openMenu()
elements.weaponDiv.style.top = `${screen.height - 280}px`;

function beginGame() {
    Player.collectWeapon(new ChainSaw);
    Player.collectWeapon(new Pistol);
    if (GameInfo.music == true) { Deuscredits.play() }
    startTimer()
    elements.weaponDiv.style.top = `${screen.height - Player.weapon.scrnMargin}px`;
    GameInfo.gameMode == 0 ? lev1() : continuousPlay();
}

class RandomNumberGen {
    static randomNumBetween(min, max){
        return Math.floor(Math.random() * (max - min +1)) + min;
    }
}

class LevelGenerator{
    static drawNewEnemiesGeneric(){
        let numOfEnemies = RandomNumberGen.randomNumBetween(4, 10);
        let enemyNumber = RandomNumberGen.randomNumBetween(0, 3);
        let mixedEnemies = RandomNumberGen.randomNumBetween(0, 1);
        GameInfo.enemyArray = [];
        for (let i=0; i<numOfEnemies; i++){
            enemyNumber = mixedEnemies ? RandomNumberGen.randomNumBetween(0, 3) : enemyNumber;
            let enemy;
            let health: number;
            let x: number = RandomNumberGen.randomNumBetween(5, 85);
            let y: number = RandomNumberGen.randomNumBetween(35, 65);
            if (enemyNumber == 0){
                health = 20;
                enemy = new Troop(health, new Position(x,y));
            }
            if (enemyNumber == 1){
                health = 30;
                enemy = new Imp(health, new Position(x,y));
            }
            if (enemyNumber == 2){
                health = 30;
                enemy = new ShotGun_Troop(health, new Position(x,y));
            }
            if (enemyNumber == 3){
                health = 120;
                enemy = new ChainGGuy(health, new Position(x,y));
            }
            GameInfo.enemyArray.push(enemy)
        }
    }
    static randomBackground() {
        return pics.background['doom' + RandomNumberGen.randomNumBetween(1, 6)]
    }
    static levelLoop() {
        GameInfo.level++
        genericLevel(this.randomBackground(), "width: 100%", () => this.drawNewEnemiesGeneric())
    }
}

function continuousPlay(){
    GameInfo.level = 1;
    fadeInBackground(100, LevelGenerator.randomBackground(), "width: 100%");
    generateEnemiesDelay(150,()=>LevelGenerator.drawNewEnemiesGeneric());
}

function lev1() {
    GameInfo.level = 1;
   // width: 150%; margin-left: -40%;
    elements.backImg.setAttribute("style", "width: 160%")
    elements.backImg.setAttribute("src", pics.background.wide)
    drawNewEnemies1();
}

function lev2() {
    GameInfo.level = 2;
    setTimeout(()=>{
        elements.backImg.setAttribute("style", "animation-name: floatRight; animation-duration: 1s; animation-fill-mode: forwards; width: 160%");
        DOMUpdater.timedClearAllImages();
    },300)

    setTimeout(function () {
        drawNewEnemies2();
     }, 700);
}

function lev3(){
    GameInfo.level = 3;
    genericLevel(pics.background.doom4,"width: 100%", ()=>drawNewEnemies3())
}

function lev4(){
    GameInfo.level = 4;
    genericLevel(pics.background.doom6,"", ()=>drawNewEnemies4())
}

function lev5(){
    GameInfo.level = 5;
    genericLevel(pics.background.doom1,"width: 100%; margin-top: -10%", ()=>drawNewEnemies5())
}

function fadeOutClear(time){
    setTimeout(function () {
        fadeOut();
        DOMUpdater.timedClearAllImages();
    }, time);
}
function fadeInBackground(time, background, attributes) {
    setTimeout(function () {
        elements.backImg.setAttribute("src", background);
        if (attributes){
            elements.backImg.setAttribute("style", attributes);
        }
        fadeIn();
    }, time);
}
function generateEnemiesDelay(time, enemyFunc){
    setTimeout(function () {
        enemyFunc();
    }, time);
}

function genericLevel(background, attributes, enemyFunc){
    fadeOutClear(500);
    fadeInBackground(1700, background, attributes);
    generateEnemiesDelay(3000, enemyFunc);
}

function finalLev() {
    GameInfo.level = 6;
    DOMUpdater.timedClearAllImages();
    fadeOut();

    setTimeout(function () {
        elements.backImg.setAttribute("style", "margin: 0px; width: 100%");
        elements.backImg.setAttribute("src", pics.background.boss);
        fadeIn()
    }, 1200);

    setTimeout(function () {
        GameInfo.bossTotalHealth = 350;
        let boss = new ChainGGuy(GameInfo.bossTotalHealth, new Position(40,23, 1.8), new AnimationInfo("approachBoss",'5s',1), true)
        boss.DOMImage.classList.add("fillModeForwards");
        GameInfo.enemyArray.push(
            boss
        )
        showElement(elements.Bar);
        elements.Bar.style.width = `100%`;
    }, 2000);
}
function reduceBar(currentHealth){
    let health = (currentHealth / GameInfo.bossTotalHealth) * 100;
    $(elements.Bar).animate({width: health + "%"},120);
}

function drawNewEnemies1(){
    GameInfo.enemyArray.push(
        new Troop   (30, new Position(10,60), new AnimationInfo("move",'7s')),
        new Troop   (20, new Position(20,37)),
        new Troop   (20, new Position(30,60)),
        new ShotGun_Troop(30, new Position(50,55)),
        new ShotGun_Troop(30, new Position(70,30), new AnimationInfo("approach",'8s','','alternate')),
        new Extra("TroopLeft" + "_Tomer", 10, new Position(70,30,0.6), new AnimationInfo("flee",'7s', '1')),
    )
}

function drawNewEnemies2(){
    GameInfo.enemyArray.push(
        new Troop   (20, new Position(30,50)),
        new ShotGun_Troop(30, new Position(40,45)),
        new ShotGun_Troop(30, new Position(60,55)),
        new Troop   (20, new Position(85,65)),
        new Troop   (20, new Position(75,35)),
    )
}

function drawNewEnemies3() { 

    GameInfo.enemyArray.push(
        new Imp(30, new Position(10,40), new AnimationInfo("move8",'4s')),
        new Imp(30, new Position(50,40), new AnimationInfo("move9",'3s')),
        new Imp(30, new Position(40,45)),
        new Imp(30, new Position(25,55)),
        new Imp(30, new Position(16,48), new AnimationInfo("move12",'4s')),
    )
}

function drawNewEnemies4(){
   GameInfo.enemyArray.push(
        new Troop   (10, new Position(10,28, 0.2)),
        new Troop   (10, new Position(15,28, 0.2)),
        new ShotGun_Troop(30, new Position(40,48, 0.3)),
        new Troop   (10, new Position(46,48, 0.3)),
        new ShotGun_Troop(30, new Position(7,55, 1)),
        new Troop   (10, new Position(18,60, 1.2)),
        new Troop   (10, new Position(50,53, 0.5)),
        new ShotGun_Troop(30, new Position(60,53, 0.5)),
        new Troop   (10, new Position(68,53, 0.5)),
    )
}

function drawNewEnemies5(){
   GameInfo.enemyArray.push(
        new Troop   (10, new Position(5,45)),
        new Troop   (10, new Position(15,50)),
        new Imp     (30, new Position(20,60)),
        new ShotGun_Troop(30, new Position(47,27,0.4)),
        new Troop   (10, new Position(60,50)),
        new ShotGun_Troop(30, new Position(65,45)),
        new Troop   (10, new Position(70,30,0.5)),
        new Imp     (30, new Position(70,45)),
        new ShotGun_Troop(30, new Position(80,27,0.4)),
        new Troop   (10, new Position(85,58)),
        new Extra("ShotGun_Troop", 10, new Position(15,18,0.1))
    )
}