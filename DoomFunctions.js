"use strict";
var music = true;
var riotShieldDeployed = false;
<<<<<<< HEAD
var elementObj = {
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
=======
var blood = document.getElementById("blood");
var oneshot = document.getElementById("shot");
var weaponPic = document.getElementById("weppic");
var Bar = document.getElementById("BossBar1");
var backImg = document.getElementById("BackImg1");
var ammoCount = document.getElementById("ammo");
var ammoType = document.getElementById("ammoType");
var health = document.getElementById("health");
var menu = document.getElementById("menu");
var riotShield = document.getElementById("riotShield");
>>>>>>> 0ff67a70f8095cc69484045aecc207d216762370
function hitWarning() {
    bizwarn.play();
}
function shieldMove(e) {
    var x = e.pageX;
    var y = e.pageY;
<<<<<<< HEAD
    elementObj.riotShield.style.left = x - 600 + "px";
    elementObj.riotShield.style.top = y / 3 - 100 + "px";
=======
    riotShield.style.left = x - 600 + "px";
    riotShield.style.top = y / 3 - 100 + "px";
>>>>>>> 0ff67a70f8095cc69484045aecc207d216762370
}
function shieldToggle() {
    if (riotShieldDeployed == false) {
        riotShieldDeployed = true;
<<<<<<< HEAD
        elementObj.riotShield.style.animationName = "raiseShield";
=======
        riotShield.style.animationName = "raiseShield";
>>>>>>> 0ff67a70f8095cc69484045aecc207d216762370
        slungWeapon = PlayerWeapon;
        pistol.switchTo();
        clearInterval(hurting);
        // document.body.setAttribute("onmousemove", "shieldMove(event); PlayerWeapon.gunMove(event)")
    }
    else {
<<<<<<< HEAD
        elementObj.riotShield.style.animationName = "lowerShield";
=======
        riotShield.style.animationName = "lowerShield";
>>>>>>> 0ff67a70f8095cc69484045aecc207d216762370
        riotShieldDeployed = false;
        slungWeapon.switchTo();
    }
}
<<<<<<< HEAD
function noShot() { elementObj.oneshot.style.display = "none"; }
=======
function noShot() { oneshot.style.display = "none"; }
>>>>>>> 0ff67a70f8095cc69484045aecc207d216762370
// Checks if the targets were killed, advances to next stage
// בודק אם המטרות נהרגו, ההתקדמות לשלב הבא
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
var gameBegin = false;
function openMenu() {
<<<<<<< HEAD
    elementObj.menu.style.display = "block";
=======
    menu.style.display = "block";
>>>>>>> 0ff67a70f8095cc69484045aecc207d216762370
    clearInterval(time);
    stopTimer();
}
function closeMenu() {
<<<<<<< HEAD
    elementObj.menu.style.display = "none";
=======
    menu.style.display = "none";
>>>>>>> 0ff67a70f8095cc69484045aecc207d216762370
    if (gameBegin == true) {
        startTimer();
    }
}
function startingAmmo() {
<<<<<<< HEAD
    pistol.ammo = 25;
    shotgun.ammo = 15;
    minigun.ammo = 0;
    dukemgun.ammo = 100;
    duelneutron.ammo = 0;
=======
    pistol.ammo = 15;
    shotgun.ammo = 6;
    minigun.ammo = 100;
    dukemgun.ammo = 80;
    duelneutron.ammo = 20;
>>>>>>> 0ff67a70f8095cc69484045aecc207d216762370
}
function startingValues() {
    playerDead = false;
    extra = 0;
    target.objectCount = 0;
    target.deadCount = 0;
    playerHealth = 100;
}
function restart() {
    clearTimer();
<<<<<<< HEAD
    elementObj.Bar.style.display = "none";
    elementObj.targetBackdrop.innerHTML = "";
    document.getElementById("fin").innerHTML = "";
    elementObj.riotShield.style.display = "block";
    startingValues();
    startingAmmo();
    elementObj.health.innerHTML = "Health: " + playerHealth;
    document.getElementById("DCount").innerHTML = "Kills:" + (target.deadCount + extra);
    elementObj.ammoCount.innerHTML = "" + PlayerWeapon.ammo;
=======
    document.getElementById("targetBackdrop").innerHTML = "";
    document.getElementById("fin").innerHTML = "";
    riotShield.style.display = "block";
    startingValues();
    startingAmmo();
    health.innerHTML = "Health: " + playerHealth;
    document.getElementById("DCount").innerHTML = "Kills:" + (target.deadCount + extra);
    ammoCount.innerHTML = "" + PlayerWeapon.ammo;
>>>>>>> 0ff67a70f8095cc69484045aecc207d216762370
    lev1();
}
function creditsMenu() {
    Deuscredits.stop();
<<<<<<< HEAD
    elementObj.menu.style.display = "none";
=======
    menu.style.display = "none";
>>>>>>> 0ff67a70f8095cc69484045aecc207d216762370
    UTcredits.play();
    document.getElementById("CreditScreen").style.display = "block";
}
function muteMusic() {
    if (music == true) {
        music = false;
        Deuscredits.stop();
    }
    else if (music == false) {
        music = true;
        Deuscredits.play();
    }
}
//JAKE-FADING has been made obselete!
//Instead, ADD CSS FADING, it's that simple.
//Actually, can use jquery fading now.
function fadeOut() {
<<<<<<< HEAD
    elementObj.backImg.setAttribute("style", "animation-name: fadeOut; animation-duration: 2s; width: 100% ");
}
function fadeIn() {
    elementObj.backImg.style.animationName = "fadeIn";
=======
    backImg.setAttribute("style", "animation-name: fadeOut; animation-duration: 2s; width: 100% ");
}
function fadeIn() {
    backImg.style.animationName = "fadeIn";
>>>>>>> 0ff67a70f8095cc69484045aecc207d216762370
}
function playerDeath() {
    playerDead = true;
    Turokscream.play();
    fadeOut();
    openMenu();
    stopTimer();
    Deuscredits.stop();
<<<<<<< HEAD
    elementObj.health.innerHTML = "Health: 0";
    elementObj.backImg.style.animationFillMode = "forwards";
=======
    health.innerHTML = "Health: 0";
    backImg.style.animationFillMode = "forwards";
>>>>>>> 0ff67a70f8095cc69484045aecc207d216762370
    for (n = 1; n <= (target.objectCount - extra); n++) {
        document.getElementById("tgt" + n).style.display = "none";
    }
    for (n = 0; n <= (regEnemy.regEnemyArray.length - 1); n++) {
        clearInterval(regEnemy.regEnemyArray[n].attackRoller);
    }
    clearInterval(tgt22.attackRoller);
}
// $(document).ready(function () {
//     $("#Track").fadeOut();
// });
