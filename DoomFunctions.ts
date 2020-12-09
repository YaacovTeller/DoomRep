let music: boolean = true;
let riotShieldDeployed: boolean = false;

const elementObj ={
    blood: document.getElementById("blood"),
    oneshot: document.getElementById("shot"),
    Bar: document.getElementById("BossBar1"),
    backImg: document.getElementById("BackImg1"),
    ammoCount: document.getElementById("ammo"),
    ammoType: document.getElementById("ammoType"),
    health: document.getElementById("health"),
    menu: document.getElementById("menu"),
    riotShield: document.getElementById("riotShield"),
    weaponDiv: document.getElementById("weapon"),
    weaponImg: document.getElementById("weaponImg"),
    killCounter: document.getElementById("DCount"),
    finishMsg: document.getElementById("fin"),
    targetBackdrop: document.getElementById("targetBackdrop")
}

function updateKillCounter(totalCount){
    elementObj.killCounter.innerHTML = `Kills:${totalCount}`;
}

function hitWarning() {//THIS needs work
    bizwarn.play()
}
function shieldMove(e) {
    var x = e.pageX;
    var y = e.pageY;
    elementObj.riotShield.style.left = `${x - 600}px`;
    elementObj.riotShield.style.top = `${y / 3 - 100}px`;

}
function shieldToggle() {
    if (riotShieldDeployed == false) {
        riotShieldDeployed = true;
        elementObj.riotShield.style.animationName = "raiseShield";
        slungWeapon = PlayerWeapon;
        pistol.switchTo();
        clearInterval(hurting);
        // document.body.setAttribute("onmousemove", "shieldMove(event); PlayerWeapon.gunMove(event)")
    }
    else {
        elementObj.riotShield.style.animationName = "lowerShield";
        riotShieldDeployed = false;
        slungWeapon.switchTo();
    }
}

function noShot() { elementObj.oneshot.style.display = "none" }

// Checks if the targets were killed, advances to next stage
// בודק אם המטרות נהרגו, ההתקדמות לשלב הבא
function levelCheck() {
    if (target.deadCount == 5) { lev2() }
    else if (target.deadCount == 10) { lev3() }
    else if (target.deadCount == 15) { lev4() }
    else if (target.deadCount == 24) { lev5() }
}
var gameBegun: boolean = false;
function openMenu() {
    elementObj.menu.style.display = "block";
    clearInterval(time);
    stopTimer();
}
function closeMenu() {
    elementObj.menu.style.display = "none";
    if (gameBegun == true) {
        startTimer()
    }
}
function startingAmmo() {
    pistol.ammo = 25;
    shotgun.ammo = 15;
    minigun.ammo = 0;
    dukemgun.ammo = 100;
    duelneutron.ammo = 0;
}
function startingValues(){
    playerDead = false;
    target.extraCount = 0;
    target.objectCount = 0;
    target.deadCount = 0;
    playerHealth = 100;
}
function restart() {
    elementObj.Bar.style.display = "none";
    elementObj.targetBackdrop.innerHTML = "";
    elementObj.riotShield.style.display = "block";
    elementObj.health.innerHTML = `Health: ${playerHealth}`;
    elementObj.ammoCount.innerHTML = `${PlayerWeapon.ammo}`;
    document.getElementById("fin").innerHTML = "";
    clearTimer();
    startingValues();
    startingAmmo();
    updateKillCounter(0);
    beginGame();
}
function creditsMenu() {
    Deuscredits.stop();
    elementObj.menu.style.display = "none";
    UTcredits.play();
    document.getElementById("CreditScreen").style.display = "block";
}
function muteMusic(button) {
    if (music == true) {
        button.innerText = "Unmute music"
        music = false;
        Deuscredits.stop();
    }
    else if (music == false) {
        button.innerText = "Mute music"
        music = true;
        Deuscredits.play();
    }
}

//JAKE-FADING has been made obselete!
//Instead, ADD CSS FADING, it's that simple.
//Actually, can use jquery fading now.
function fadeOut() {
    elementObj.backImg.setAttribute("style", "animation-name: fadeOut; animation-duration: 2s; width: 100% ")
}
function fadeIn() {
    elementObj.backImg.style.animationName = "fadeIn";
}

function playerDeath() {
    playerDead = true;
    Turokscream.play();
    fadeOut();
    openMenu();
    stopTimer();
    Deuscredits.stop();
    elementObj.health.innerHTML = "Health: 0"
    elementObj.backImg.style.animationFillMode = "forwards";
    for (n = 1; n <= (target.objectCount - target.extraCount); n++) {
        document.getElementById(`tgt${n}`).style.display = "none";
    }
    for (n = 0; n <= (regEnemy.regEnemyArray.length - 1); n++) {
        clearInterval(regEnemy.regEnemyArray[n].attackRoller)
    }
    clearInterval(tgt22.attackRoller)
}

function finishMessage(){
    elementObj.finishMsg.innerHTML = 
    `Completed in ${timerObj.m} minutes, ${timerObj.s} seconds and ${timerObj.ss} split seconds!`
}

// $(document).ready(function () {
//     $("#Track").fadeOut();
// });