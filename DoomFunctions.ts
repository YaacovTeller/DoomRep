let music: boolean = true;
let riotShieldDeployed: boolean = false;

let blood = document.getElementById("blood");
let oneshot = document.getElementById("shot");
let weaponPic = document.getElementById("weppic");
let Bar = document.getElementById("BossBar1");
let backImg = document.getElementById("BackImg1");
var ammoCount = document.getElementById("ammo");
var ammoType = document.getElementById("ammoType");
var health = document.getElementById("health");
var menu = document.getElementById("menu");
var riotShield = document.getElementById("riotShield");

function hitWarning() {//THIS needs work
    bizwarn.play()
}
function shieldMove(e) {
    var x = e.pageX;
    var y = e.pageY;
    riotShield.style.left = `${x - 600}px`;
    riotShield.style.top = `${y / 3 - 100}px`;
}
function shieldToggle() {
    if (riotShieldDeployed == false) {
        riotShieldDeployed = true;
        riotShield.style.animationName = "raiseShield"
        slungWeapon = PlayerWeapon;
        pistol.switchTo();
        clearInterval(hurting);
        // document.body.setAttribute("onmousemove", "shieldMove(event); PlayerWeapon.gunMove(event)")
    }
    else {
        riotShield.style.animationName = "lowerShield"
        riotShieldDeployed = false;
        slungWeapon.switchTo();
    }
}

function noShot() { oneshot.style.display = "none" }

// Checks if the targets were killed, advances to next stage
// בודק אם המטרות נהרגו, ההתקדמות לשלב הבא
function levelCheck() {
    if (target.deadCount == 5) { lev2() }
    else if (target.deadCount == 10) { lev3() }
    else if (target.deadCount == 15) { lev4() }
    else if (target.deadCount == 24) { lev5() }
}
var gameBegin: boolean = false;
function openMenu() {
    menu.style.display = "block";
    clearInterval(time);
    stopTimer();
}
function closeMenu() {
    menu.style.display = "none";
    if (gameBegin == true) {
        startTimer()
    }
}
function startingAmmo() {
    pistol.ammo = 15;
    shotgun.ammo = 6;
    minigun.ammo = 100;
    dukemgun.ammo = 80;
    duelneutron.ammo = 20;
}
function startingValues(){
    playerDead = false;
    extra = 0;
    target.objectCount = 0;
    target.deadCount = 0;
    playerHealth = 100;
}
function restart() {
    clearTimer();
    document.getElementById("targetBackdrop").innerHTML = "";
    document.getElementById("fin").innerHTML = "";
    riotShield.style.display = "block";
    startingValues()
    startingAmmo()
    health.innerHTML = `Health: ${playerHealth}`;
    document.getElementById("DCount").innerHTML = `Kills:${target.deadCount + extra}`;
    ammoCount.innerHTML = `${PlayerWeapon.ammo}`;
    lev1()
}
function creditsMenu() {
    Deuscredits.stop();
    menu.style.display = "none";
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
    backImg.setAttribute("style", "animation-name: fadeOut; animation-duration: 2s; width: 100% ")
}
function fadeIn() {
    backImg.style.animationName = "fadeIn";
}

function playerDeath() {
    playerDead = true;
    Turokscream.play();
    fadeOut();
    openMenu();
    stopTimer();
    Deuscredits.stop();
    health.innerHTML = "Health: 0"
    backImg.style.animationFillMode = "forwards";
    for (n = 1; n <= (target.objectCount - extra); n++) {
        document.getElementById(`tgt${n}`).style.display = "none";
    }
    for (n = 0; n <= (regEnemy.regEnemyArray.length - 1); n++) {
        clearInterval(regEnemy.regEnemyArray[n].attackRoller)
    }
    clearInterval(tgt22.attackRoller)
}
// $(document).ready(function () {
//     $("#Track").fadeOut();
// });