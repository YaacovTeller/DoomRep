//LEVELS
openMenu()
elements.weaponDiv.style.top = `${screen.height - 280}px`;

let n: number;
var level: number;
//var tgt22: Boss;
//var tgt23: regEnemy, tgt24: regEnemy, tgt25: regEnemy;

function beginGame() {
    Player.weapon = pistol;
    Player.weapon.switchTo();
    startingValues();
    startingAmmo();
    gameBegun = true;
    if (music == true) { Deuscredits.play() }
    startTimer()
    elements.weaponDiv.style.top = `${screen.height - weaponry.scrnMargin}px`;
    lev1();
}

function lev1() {
    level = 1;
   // width: 150%; margin-left: -40%;
    elements.backImg.setAttribute("style", "width: 160%")
    elements.backImg.setAttribute("src", pics.background.wide)
    drawNewEnemies1();
}

function lev2() {
    level = 2;
    setTimeout(()=>{
        elements.backImg.setAttribute("style", "animation-name: floatRight; animation-duration: 1s; animation-fill-mode: forwards; width: 160%");
        clearTargets();
    },300)

    setTimeout(function () {
        drawNewEnemies2();
     }, 700);
}

function lev3(){
    level = 3;
    genericLevel(pics.background.doom4,"width: 100%", ()=>drawNewEnemies3())
}

function lev4(){
    level = 4;
    genericLevel(pics.background.doom6,"", ()=>drawNewEnemies4())
}

function lev5(){
    level = 5;
    genericLevel(pics.background.doom1,"width: 100%; margin-top: -10%", ()=>drawNewEnemies5())
}

function genericLevel(background, attributes, enemyFunc){
    setTimeout(function () {
        fadeOut();
        clearTargets();
    }, 500);
    setTimeout(function () {
        elements.backImg.setAttribute("src", background);
        if (attributes){
            elements.backImg.setAttribute("style", attributes);
        }
        fadeIn();
    }, 1700);
    setTimeout(function () {
        enemyFunc();
    }, 3000);
}

function finalLev() {
    level = 6;
    clearTargets();
    fadeOut();

    setTimeout(function () {
        elements.backImg.setAttribute("style", "margin: 0px; width: 100%");
        elements.backImg.setAttribute("src", pics.background.boss);
        fadeIn()
    }, 1200);

    setTimeout(function () {
        regEnemy.regEnemyArray = [];
        let boss = new Boss(22, "ChainGuy", 200);
        regEnemy.regEnemyArray.push(
            boss
        )
        boss.fillBar()
        elements.Bar.style.width = `${boss.health / 2}%`;
    }, 2000);
}

function drawNewEnemies1(){
    regEnemy.regEnemyArray = [];
    regEnemy.regEnemyArray.push(
        new Troop(1, 30),
        new Troop(2, 20),
        new Troop(3, 20),
        new ShotGGuy(4, 30),
        new ShotGGuy(5, 30),
    )
    ExtraTarget.extraTargetArray.push(
        new ExtraTarget(99, "TroopLeft" + "_Tomer", 10)
    )
}

function drawNewEnemies2(){
    regEnemy.regEnemyArray = [];
    regEnemy.regEnemyArray.push(
        new Troop(3, 20),
        new ShotGGuy(4, 30),
        new ShotGGuy(5, 30),
        new Troop(6, 20),
        new Troop(7, 20),
    )
}

function drawNewEnemies3() {
    regEnemy.regEnemyArray = [];
    regEnemy.regEnemyArray.push(
        new Imp(9, 30),
        new Imp(10, 30),
        new Imp(11, 30),
        new Imp(12, 30),
        new Imp(8, 30),
    )
}

function drawNewEnemies4(){
    regEnemy.regEnemyArray = [];
    regEnemy.regEnemyArray.push(
        new Troop(13, 10),
        new Troop(14, 10),
        new ShotGGuy(15, 30),
        new Troop(16, 10),
        new ShotGGuy(17, 30),
        new Troop(18, 10),
        new Troop(19, 10),
        new ShotGGuy(20, 30),
        new Troop(21, 10),
    )
}

function drawNewEnemies5(){
    regEnemy.regEnemyArray = [];
    regEnemy.regEnemyArray.push(
        new Troop(2, 10),
        new Troop(4, 10),
        new Imp(5, 30),
        new ShotGGuy(6, 30),
        new Troop(8, 10),
        new ShotGGuy(10, 30),
        new Troop(12, 10),
        new Imp(11, 30),
        new ShotGGuy(16, 30),
        new Troop(18, 10),
    )
}

function clearTargets() {
    for (let enemy of regEnemy.regEnemyArray){
        enemy.undraw();
    }
    for (let enemy of ExtraTarget.extraTargetArray){
        enemy.undraw();
    }
}