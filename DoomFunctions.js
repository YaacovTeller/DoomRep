"use strict";
var music = true;
var riotShieldDeployed = false;
var gameBegun = false;
var elements = {
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
};
function updateKillCounter(totalCount) {
    elements.killCounter.innerHTML = "Kills:" + totalCount;
}
function hitWarning() {
    bizwarn.play();
}
function shieldMove(e) {
    var x = e.pageX;
    var y = e.pageY;
    elements.riotShield.style.left = x - 600 + "px";
    elements.riotShield.style.top = y / 3 - 100 + "px";
}
function shieldToggle() {
    if (riotShieldDeployed == false) {
        riotShieldDeployed = true;
        elements.riotShield.style.animationName = "raiseShield";
        slungWeapon = PlayerWeapon;
        pistol.switchTo();
        clearInterval(hurting);
        // document.body.setAttribute("onmousemove", "shieldMove(event); PlayerWeapon.gunMove(event)")
    }
    else {
        elements.riotShield.style.animationName = "lowerShield";
        riotShieldDeployed = false;
        slungWeapon.switchTo();
    }
}
function hideElement(elem) {
    elem.style.display = "none";
}
function showElement(elem) {
    elem.style.display = "block";
}
function clearAllEnemies() {
    for (var _i = 0, _a = regEnemy.regEnemyArray; _i < _a.length; _i++) {
        var enemy = _a[_i];
        if (!enemy)
            continue;
        if (enemy.DOMImage) {
            hideElement(enemy.DOMImage);
        }
        clearInterval(enemy.attackRoller);
    }
}
// Checks if the targets were killed, advances to next stage
function levelCheck() {
    if (target.deadCount == 5) {
        lev2();
    }
    else if (target.deadCount == 10) {
        lev3();
    }
    else if (target.deadCount == 15) {
        lev4();
    }
    else if (target.deadCount == 24) {
        lev5();
    }
}
function openMenu() {
    showElement(elements.menu);
    clearInterval(time);
    stopTimer();
}
function closeMenu() {
    hideElement(elements.menu);
    if (gameBegun == true) {
        startTimer();
    }
}
function startingAmmo() {
    pistol.ammo = 25;
    shotgun.ammo = 15;
    minigun.ammo = 0;
    dukemgun.ammo = 100;
    duelneutron.ammo = 0;
}
function startingValues() {
    Player.dead = false;
    target.extraCount = 0;
    target.targetCount = 0;
    target.deadCount = 0;
    Player.health = 100;
}
function restart() {
    elements.targetBackdrop.innerHTML = "";
    elements.health.innerHTML = "Health: " + Player.health;
    elements.ammoCount.innerHTML = "" + PlayerWeapon.ammo;
    document.getElementById("fin").innerHTML = "";
    hideElement(elements.Bar);
    showElement(elements.riotShield);
    clearTimer();
    startingValues();
    startingAmmo();
    updateKillCounter(0);
    beginGame();
}
function creditsMenu() {
    Deuscredits.stop();
    hideElement(elements.menu);
    UTcredits.play();
    showElement(document.getElementById("CreditScreen"));
}
function muteMusic(button) {
    if (music == true) {
        button.innerText = "Unmute music";
        music = false;
        Deuscredits.stop();
    }
    else if (music == false) {
        button.innerText = "Mute music";
        music = true;
        Deuscredits.play();
    }
}
//JAKE-FADING has been made obselete!
//Instead, ADD CSS FADING, it's that simple.
//Actually, can use jquery fading now.
function fadeOut() {
    elements.backImg.setAttribute("style", "animation-name: fadeOut; animation-duration: 2s; width: 100% ");
}
function fadeIn() {
    elements.backImg.style.animationName = "fadeIn";
}
function finishMessage() {
    elements.finishMsg.innerHTML =
        "Completed in " + timerObj.m + " minutes, " + timerObj.s + " seconds and " + timerObj.ss + " split seconds!";
}
// $(document).ready(function () {
//     $("#Track").fadeOut();
// });
