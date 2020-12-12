//LEVELS
openMenu()
elements.weaponDiv.style.top = `${screen.height - 280}px`;

let n: number;
var level: number;
var tgt22: Boss;
//var tgt23: regEnemy, tgt24: regEnemy, tgt25: regEnemy;

function beginGame() {
    gameBegun = true;
    if (music == true) { Deuscredits.play() }
    startTimer()
    elements.weaponDiv.style.top = `${screen.height - weaponry.scrnMargin}px`;
    lev1();
}

function lev1() {
    level = 1;
    elements.backImg.setAttribute("style", "width: 160%")
    elements.backImg.setAttribute("src", pics.background.wide)
    drawNewEnemies1();
}

function lev2() {
    level = 2;
    setTimeout(()=>{
        elements.backImg.setAttribute("style", "animation-name: floatRight; animation-duration: 1s; animation-fill-mode: forwards; width: 160%");
        clearTargets();
    },200)

    setTimeout(function () {
        drawNewEnemies2();
     }, 700);
}

function lev3(){
    level = 3;
    genericLevel(pics.background.doom4, ()=>drawNewEnemies3())
}

function lev4(){
    level = 4;
    genericLevel(pics.background.doom6, ()=>drawNewEnemies4())
}

function genericLevel(background, enemyFunc){
    setTimeout(function () {
        fadeOut();
        clearTargets();
    }, 500);
    setTimeout(function () {
        elements.backImg.setAttribute("style", "margin-left: 0%; width: 100%");
        elements.backImg.setAttribute("src", background);
        fadeIn();
    }, 1700);
    setTimeout(function () {
        enemyFunc();
    }, 3000);
}

function lev5() {
    level = 5;
    clearTargets();
    fadeOut();

    setTimeout(function () {
        elements.backImg.setAttribute("src", pics.background.boss);
        fadeIn()
    }, 1200);

    setTimeout(function () {
        tgt22 = new Boss(22, "ChainGuy", 200);
        tgt22.fillBar()
        elements.Bar.style.width = `${tgt22.health / 2}%`;
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

function clearTargets() {
    for (let enemy of regEnemy.regEnemyArray){
        enemy.undraw();
    }
    for (let enemy of ExtraTarget.extraTargetArray){
        enemy.undraw();
    }
}