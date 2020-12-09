//LEVELS
openMenu()
elementObj.weaponDiv.style.top = `${screen.height - 280}px`;

let n: number;
var tgt99: ExtraTarget;
var tgt1: regEnemy, tgt2: regEnemy, tgt3: regEnemy, tgt4: regEnemy, tgt5: regEnemy, tgt6: regEnemy,
    tgt7: regEnemy, tgt8: regEnemy, tgt9: regEnemy, tgt10: regEnemy, tgt11: regEnemy, tgt12: regEnemy,
    tgt13: regEnemy, tgt14: regEnemy, tgt15: regEnemy, tgt16: regEnemy, tgt17: regEnemy, tgt18: regEnemy,
    tgt19: regEnemy, tgt20: regEnemy, tgt21: regEnemy;
var tgt22: Boss;
//var tgt23: regEnemy, tgt24: regEnemy, tgt25: regEnemy;

function beginGame() {
    gameBegun = true;
    if (music == true) { Deuscredits.play() }
    startTimer()
    elementObj.weaponDiv.style.top = `${screen.height - weaponry.scrnMargin}px`;
    lev1();
}

function lev1() {
    elementObj.backImg.setAttribute("style", "width: 160%")
    elementObj.backImg.setAttribute("src", "Pics/WideBack.jpg")
    drawNewEnemies1();
}

function lev2() {
    elementObj.backImg.setAttribute("style", "animation-name: floatRight; animation-duration: 1s; animation-fill-mode: forwards; width: 160%")
    clearTargets();

    setTimeout(function () {
        for (n = 3; n <= (target.objectCount - target.extraCount); n++) {
            document.getElementById(`tgt${n}`).style.display = "block";
        }
        document.getElementById("tgt3").setAttribute("src", "pics/Troop.gif");
        document.getElementById("tgt3").style.pointerEvents = "auto";
        tgt4.health = 20; tgt4.deadFlag = false;
        document.getElementById("tgt4").setAttribute("src", "pics/ShotGGuy.gif");
        document.getElementById("tgt4").style.pointerEvents = "auto";
        tgt4.health = 30; tgt4.deadFlag = false;
        document.getElementById("tgt5").setAttribute("src", "pics/ShotGGuy.gif");
        document.getElementById("tgt5").style.pointerEvents = "auto";
        tgt5.health = 30; tgt5.deadFlag = false;
        tgt6 = new Troop(6, "Troop", 20);
        tgt7 = new Troop(7, "Troop", 20);
    }, 700);
    regEnemy.regEnemyArray.push(tgt6, tgt7)
}

function lev3(){
    genericLevel("Pics/Doom4.png", ()=>drawNewEnemies3())
}
function lev4(){
    genericLevel("Pics/Doom6.png", ()=>drawNewEnemies4())
}

function genericLevel(background, enemyFunc){
    setTimeout(function () {
        fadeOut();
    }, 500);
    setTimeout(function () {
        elementObj.backImg.setAttribute("style", "margin-left: 0%; width: 100%");
        elementObj.backImg.setAttribute("src", background);
        clearTargets();
        fadeIn();
    }, 1700);
    setTimeout(function () {
        enemyFunc();
    }, 2400);
}

function lev5() {
    clearTargets();
    fadeOut();

    setTimeout(function () {
        elementObj.backImg.setAttribute("src", "Pics/BossBack.jpg");
        fadeIn()
    }, 1200);

    setTimeout(function () {
        tgt22 = new Boss(22, "ChainGuy", 200);
        tgt22.fillBar()
        elementObj.Bar.style.width = `${tgt22.health / 2}%`;
    }, 2000);
}

function drawNewEnemies1(){
    tgt1 = new Troop(1, "Troop", 30);
    tgt2 = new Troop(2, "Troop", 20);
    tgt3 = new Troop(3, "Troop", 20);
    tgt4 = new ShotGGuy(4, "ShotGGuy", 30);
    tgt5 = new ShotGGuy(5, "ShotGGuy", 30);
    tgt99 = new ExtraTarget(99, "TroopLeft" + "_Tomer", 10);
    regEnemy.regEnemyArray.push(tgt1, tgt2, tgt3, tgt4, tgt5);
}

function drawNewEnemies3() {
    tgt8 = new Imp(8, "Imp", 30);
    tgt9 = new Imp(9, "Imp", 30);
    tgt10 = new Imp(10, "Imp", 30);
    tgt11 = new Imp(11, "Imp", 30);
    tgt12 = new Imp(12, "Imp", 30);
    regEnemy.regEnemyArray.push(tgt8, tgt9, tgt10, tgt11, tgt12)
}

function drawNewEnemies4(){
    tgt13 = new Troop(13, "Troop", 10);
    tgt14 = new Troop(14, "Troop", 10);
    tgt15 = new ShotGGuy(15, "ShotGGuy", 30);
    tgt16 = new Troop(16, "Troop", 10);
    tgt17 = new ShotGGuy(17, "ShotGGuy", 30);
    tgt18 = new Troop(18, "Troop", 10);
    tgt19 = new Troop(19, "Troop", 10);
    tgt20 = new ShotGGuy(20, "ShotGGuy", 30);
    tgt21 = new Troop(21, "Troop", 10);
    regEnemy.regEnemyArray.push(tgt13, tgt14, tgt15, tgt16, tgt17, tgt18, tgt19, tgt20, tgt21);
}

function clearTargets() {
    for (n = 1; n <= (target.objectCount - target.extraCount); n++) {
        document.getElementById(`tgt${n}`).style.display = "none";
    }
}