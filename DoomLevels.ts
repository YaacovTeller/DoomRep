//SceneS
openMenu()
elements.weaponDiv.style.top = `${screen.height - 280}px`;

function beginGame() {
    Player.collectWeapon(new ChainSaw);
    Player.collectWeapon(new Pistol);
    if (GameInfo.music == true) { Deuscredits.play() }
    startTimer();
    elements.weaponDiv.style.top = `${screen.height - Player.weapon.scrnMargin}px`;
    sceneCheck();
}

class RandomNumberGen {
    static randomNumBetween(min, max){
        return Math.floor(Math.random() * (max - min +1)) + min;
    }
}

class SceneGenerator{
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
    static sceneLoop() {
        let scene = new Scene(this.randomBackground(),"width: 100%", ()=>this.drawNewEnemiesGeneric())
        GameInfo.currentLevel.push(scene)
    }
}

function scene1() {
   // width: 150%; margin-left: -40%;
   let scene = new Scene(pics.background.wide,"width: 160%", ()=>drawNewEnemies1(), 0, 0, 0, true)
   GameInfo.currentLevel.push(scene)
}

function scene2() {
    GameInfo.currentLevel.length++ // FIX?

    setTimeout(()=>{
        elements.backImg.setAttribute("style", "animation-name: floatRight; animation-duration: 1s; animation-fill-mode: forwards; width: 160%");
        DOMUpdater.timedClearAllImages();
    },300)

    setTimeout(function () {
        drawNewEnemies2();
     }, 700);
}

function scene3(){
    let scene = new Scene(pics.background.doom4,"width: 100%", ()=>drawNewEnemies3());
    GameInfo.currentScene = scene;
    GameInfo.currentLevel.push(scene);
}

function scene4(){
    let scene = new Scene(pics.background.doom6,"", ()=>drawNewEnemies4())
    GameInfo.currentScene = scene;
    GameInfo.currentLevel.push(scene)
}

function scene5(){
    let scene = new Scene(pics.background.doom1,"width: 100%; margin-top: -10%", ()=>drawNewEnemies5())
    GameInfo.currentScene = scene;
    GameInfo.currentLevel.push(scene)
}

function finalLev() {
    GameInfo.currentLevel.length++ // FIX?
    DOMUpdater.timedClearAllImages();
    fadeOut();

    setTimeout(function () {
        elements.backImg.setAttribute("style", "margin: 0px; width: 100%");
        elements.backImg.setAttribute("src", pics.background.boss);
        fadeIn()
    }, 1200);

    setTimeout(function () {
        GameInfo.bossTotalHealth = 350;
        let boss = new ChainGGuy(GameInfo.bossTotalHealth, new Position(40,35, 0.8), [new AnimationInfo("scaleTo_1p8",'7s',1)], true)
        boss.DOMImage.classList.add("fillModeForwards");
        GameInfo.enemyArray.push(
            boss
        )
        showElement(elements.Bar);
        elements.Bar.style.width = `100%`;
    }, 2000);
}

// Checks if the targets were killed, advances to next scene
function sceneCheck() {
    if (checkAllDead()){
        if (GameInfo.gameMode == 0){
            switch (GameInfo.currentLevel.length) {
                case 0: scene1(); break;
                case 1: scene2(); break;
                case 2: scene3(); break;
                case 3: scene4(); break;
                case 4: scene5(); break;
                case 5: finalLev(); break;
                case 6: sectionFinish(); break;
            }
        }
        else if (GameInfo.gameMode == 1){
            SceneGenerator.sceneLoop();
        }
    }
}

function checkAllDead(){
    for(let enemy of GameInfo.enemyArray){
        if (enemy.deadFlag == false && !(enemy instanceof Extra)) return false
    }
    GameInfo.enemiesCleared = true;
    return true;
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

function reduceBar(currentHealth){
    let health = (currentHealth / GameInfo.bossTotalHealth) * 100;
    $(elements.Bar).animate({width: health + "%"},120);
}

function drawNewEnemies1(){
    GameInfo.enemyArray.push(
        new Troop   (30, new Position(0,30, 0.6), [new AnimationInfo("topTo_60",'3s'), new AnimationInfo("scaleTo_1",'3s'), new AnimationInfo("leftTo_10",'2s')]), 
        new Troop   (20, new Position(20,37)),
        new Troop   (20, new Position(30,60)),
        new ShotGun_Troop(30, new Position(50,55)),
        new ShotGun_Troop(30, new Position(70,30), [new AnimationInfo("scaleTo_1",'4s','1')]),
        new Extra("TroopLeft" + "_Tomer", 10, new Position(100,30,0.6), [new AnimationInfo("fleeLeft",'7s', '1')]),
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
        new Imp(30, new Position(45,40,0.45), [new AnimationInfo("leftTo_60",'1.2s')]),
        new Imp(30, new Position(30,40), [new AnimationInfo("leftTo_70",'2s'), new AnimationInfo("topTo_60",'2s'),  new AnimationInfo("scaleTo_3",'2s')]), 
        new Imp(30, new Position(40,45)),
        new Imp(30, new Position(25,55)),
        new Imp(30, new Position(16,48), [new AnimationInfo("leftTo_0",'1.5s'), new AnimationInfo("topTo_60",'1.5s'),  new AnimationInfo("scaleTo_1p6",'1.5s')]),
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