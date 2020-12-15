﻿let music: boolean = true;
let riotShieldDeployed: boolean = false;
var gameBegun: boolean = false;

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
        Player.slungWeapon = Player.weapon;
        if(Player.slungWeapon instanceof MachineGun){
            Player.slungWeapon.stopstrafe();
        }
        pistol.switchTo();
       // clearInterval(hurting); // NEEDED?
        // document.body.setAttribute("onmousemove", "shieldMove(event); Player.weapon.gunMove(event)")
    }
    else {
        elements.riotShield.style.animationName = "lowerShield";
        riotShieldDeployed = false;
        Player.slungWeapon.switchTo();
    }
}

function hideElement(elem: HTMLElement){
    elem.style.display = "none";
}
function showElement(elem: HTMLElement){
    elem.style.display = "block";
}

function killAllEnemies(){
    for (let enemy of RegEnemy.enemyArray){
        if (!enemy) continue
        enemy.die();
    }
}

function clearAllEnemies(){
    for (let enemy of RegEnemy.enemyArray){
        if (!enemy) continue
        enemy.deadFlag = true;
        clearInterval(enemy.attackRoller);
        hideElement(enemy.DOMImage);
    }
}
function godMode(){
    for (let enemy of RegEnemy.enemyArray){
        if (!enemy) continue
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
            case 5: finalLev(); break;
        }
    }
}

function checkAllDead(){
    for(let enemy of RegEnemy.enemyArray){
        if (enemy.deadFlag == false && !(enemy instanceof Extra)) return false
    }
    return true;
}

function openMenu() {
    showElement(elements.menuImage)
    showElement(elements.menu)
    stopTimer();
}

function closeMenu() {
    hideElement(elements.menuImage)
    hideElement(elements.menu)
    if (gameBegun == true) {
        startTimer()
    }
}
function startingAmmo() {
    pistol.ammo = 30;
    shotgun.ammo = 16;
    minigun.ammo = 0;
    dukemgun.ammo = 120;
    duelneutron.ammo = 0;
}
function startingValues(){
    Player.dead = false;
    Target.deadExtraCount = 0;
    Target.deadCount = 0;
    Player.health = 100;
}
function restart() {
    document.getElementById("fin").innerHTML = "";
    hideElement(elements.backImg);
    hideElement(elements.Bar);
    showElement(elements.riotShield);
    clearTimer();
    DOMUpdater.updateKillCounter(0);
    DOMUpdater.updateHealthCounter(Player.health);
    beginGame();
}
function creditsMenu() {
    Deuscredits.stop();
    hideElement(elements.menu);
    hideElement(elements.menuImage);
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
  $(elements.backImg).fadeOut(1700)
    //  elements.backImg.setAttribute("style", "animation-name: fadeOut; animation-duration: 2s; width: 100% ")
}
function fadeIn() {
    $(elements.backImg).fadeIn(500)
    //elements.backImg.style.animationName = "fadeIn";
}
function createMessageDiv(className, msg){
    let div:HTMLElement = document.createElement("div");
    div.innerText = msg;
    div.classList.add(className)
    return div;
}

function finishMessage(){
    elements.finishMsg.innerHTML = "";
    let div1:HTMLElement = createMessageDiv("levelMsg","LEVEL 1");
    let div2:HTMLElement = createMessageDiv("levelMsg","COMPLETED");
    let div3:HTMLElement = createMessageDiv("speedMsg", `Time: ${getTime()}`);

    let killsStr = `Total kills: ${Target.deadCount + Target.deadExtraCount}`
    let div4:HTMLElement = createMessageDiv("speedMsg", killsStr);

    slamMessage(div1, elements.finishMsg, 1000)
    slamMessage(div2, elements.finishMsg, 2000)
    slamMessage(div3, elements.finishMsg, 3000)
    slamMessage(div4, elements.finishMsg, 4000)
}
function slamMessage(elem:HTMLElement, parent:HTMLElement, delay:number){
    setTimeout(() => {
        parent.append(elem)
        SGshot.play();
    }, delay);
}

function sectionFinish(){
    gameBegun = false;
    finishMessage()
}

// $(document).ready(function () {
//     $("#Track").fadeOut();
// });