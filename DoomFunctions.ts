let music: boolean = true;
let riotShieldDeployed: boolean = false;
var gameBegun: boolean = false;

const elements = {
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
    targetBackdrop: document.getElementById("targetBackdrop"),
    credits: document.getElementById("CreditScreen")
}

class DOMUpdater {
    public static updateKillCounter(totalCount){
        this.updateCounter(elements.killCounter, "Kills:" + totalCount);
    }
    public static updateAmmoCounter(ammo){
        this.updateCounter(elements.ammoCount, ammo);
    }
    public static updateHealthCounter(health){
        this.updateCounter(elements.health, "Health:" + health);
    }
    
    private static updateCounter(elem, str){
        elem.innerText = str;
    }
}

function hitWarning() {//THIS needs work
    bizwarn.play()
}

// function shieldMove(e) {
//     var x = e.pageX;
//     var y = e.pageY;
//     elements.riotShield.style.left = `${x - 600}px`;
//     elements.riotShield.style.top = `${y / 3 - 100}px`;
// }

function shieldToggle() {
    if (riotShieldDeployed == false) {
        riotShieldDeployed = true;
        elements.riotShield.style.animationName = "raiseShield";
        slungWeapon = PlayerWeapon;
        if(slungWeapon instanceof MachineGun){
            slungWeapon.stopstrafe();
        }
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

function hideElement(elem: HTMLElement){
    elem.style.display = "none";
}
function showElement(elem: HTMLElement){
    elem.style.display = "block";
}
function clearAllEnemies(){
    for (let enemy of regEnemy.regEnemyArray){
        if (!enemy) continue
        if (enemy.DOMImage){
            hideElement(enemy.DOMImage);
        }
        clearInterval(enemy.attackRoller);
    }
}

// Checks if the targets were killed, advances to next stage
function levelCheck() {
    if (checkAllDead()){
        switch (level) {
            case 1: lev2(); break;
            case 2: lev3(); break;
            case 3: lev4(); break;
            case 4: lev5(); break;
        }
    }
}
function checkAllDead(){
    for(let enemy of regEnemy.regEnemyArray){
        if (enemy.deadFlag == false) return false
    }
    return true;
}

function openMenu() {
    showElement(elements.menu)
    clearInterval(time);
    stopTimer();
}

function closeMenu() {
    hideElement(elements.menu)
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
    Player.dead = false;
    target.extraCount = 0;
    target.targetCount = 0;
    target.deadCount = 0;
    Player.health = 100;
}
function restart() {
    elements.targetBackdrop.innerHTML = "";
    document.getElementById("fin").innerHTML = "";
    hideElement(elements.Bar)
    showElement(elements.riotShield)
    clearTimer();
    startingValues();
    startingAmmo();
    DOMUpdater.updateAmmoCounter(PlayerWeapon.ammo)
    DOMUpdater.updateKillCounter(0);
    DOMUpdater.updateHealthCounter(Player.health);
    beginGame();
}
function creditsMenu() {
    Deuscredits.stop();
    hideElement(elements.menu);
    UTcredits.play();
    showElement(elements.credits);
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
  $(elements.backImg).fadeOut(2000)
    //  elements.backImg.setAttribute("style", "animation-name: fadeOut; animation-duration: 2s; width: 100% ")
}
function fadeIn() {
    $(elements.backImg).fadeIn(500)
    //elements.backImg.style.animationName = "fadeIn";
}

function finishMessage(){
    elements.finishMsg.innerHTML = 
    `Completed in ${timerObj.m} minutes, ${timerObj.s} seconds and ${timerObj.ss} split seconds!`
}

// $(document).ready(function () {
//     $("#Track").fadeOut();
// });