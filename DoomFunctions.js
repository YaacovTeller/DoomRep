"use strict";
class RandomNumberGen {
    static randomNumBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
class RandomSoundGen {
    static randomSound(sounds) {
        let length = sounds.length;
        let randNum = Math.floor(Math.random() * (length) + 1);
        sounds[randNum - 1].play();
    }
}
function hitWarning() {
    bizwarn.play();
}
// function shieldMove(e) {
//     var x = e.pageX;
//     var y = e.pageY;
//     elements.riotShield.style.left = `${x - 600}px`;
//     elements.riotShield.style.top = `${y / 3 - 100}px`;
// }
function raiseShield() {
    Player.riotShieldDeployed = true;
    elements.riotShield.style.animationName = "raiseShield";
    Player.slungWeapon = Player.weapon;
    if (Player.slungWeapon instanceof MachineGun) {
        Player.slungWeapon.stopstrafe();
    }
    Player.weaponCollection['Pistol'].switchTo();
}
function lowerShield() {
    elements.riotShield.style.animationName = "lowerShield";
    Player.riotShieldDeployed = false;
    Player.slungWeapon.switchTo();
}
function hideElement(elem) {
    elem.style.display = "none";
}
function showElement(elem) {
    elem.style.display = "block";
}
function killAllEnemies() {
    for (let enemy of GameInfo.enemyArray) {
        if (!enemy)
            continue;
        enemy.die();
    }
}
function clearAllEnemies() {
    for (let enemy of GameInfo.enemyArray) {
        if (!enemy)
            continue;
        enemy.deadFlag = true;
        clearInterval(enemy.attackRoller);
        hideElement(enemy.DOMImage);
    }
}
function openMenu() {
    showElement(elements.menuImage);
    showElement(elements.menu);
    stopTimer();
}
function closeMenu() {
    hideElement(elements.menuImage);
    hideElement(elements.menu);
    if (GameInfo.gameBegun == true) {
        startTimer();
    }
}
function startingAmmo() {
    Player.weaponCollection['Pistol'].ammo = gunConfig.Pistol.startingAmmo;
}
function restart(num) {
    clearScreenMessages();
    hideElement(elements.backImg);
    hideElement(elements.Bar);
    showElement(elements.riotShield);
    clearTimer();
    Player.reset();
    GameInfo.reset();
    GameInfo.gameMode = num;
    DOMUpdater.clearTargets();
    DOMUpdater.updateKillCounter(0);
    DOMUpdater.updateHealthCounter(Player.health);
    LevelHandler.beginGame();
}
function creditsMenu() {
    clearScreenMessages();
    Deuscredits.stop();
    hideElement(elements.menu);
    hideElement(elements.menuImage);
    UTcredits.play();
    showElement(elements.credits);
}
function kidMode(value) {
    if (value == true) {
        GameInfo.kidMode = true;
    }
    else
        GameInfo.kidMode = false;
}
function muteMusic(value) {
    if (value == false) {
        elements.muteLabel.innerText = "Music off";
        GameInfo.music = false;
        Deuscredits.stop();
    }
    else if (value == true) {
        elements.muteLabel.innerText = "Music on";
        GameInfo.music = true;
        Deuscredits.play();
    }
}
//JAKE-FADING has been made obselete!
//Instead, ADD CSS FADING, it's that simple.
//Actually, can use jquery fading now.
function fadeOut() {
    $(elements.backImg).fadeOut(1700);
    //  elements.backImg.setAttribute("style", "animation-name: fadeOut; animation-duration: 2s; width: 100% ")
}
function fadeIn() {
    $(elements.backImg).fadeIn(500);
    //elements.backImg.style.animationName = "fadeIn";
}
function createMessageDiv(className, msg) {
    let div = document.createElement("div");
    div.innerText = msg;
    div.classList.add(className);
    return div;
}
function clearScreenMessages() {
    elements.finishMsg.innerHTML = "";
}
function genericFinishMessage() {
    clearScreenMessages();
    let div1 = createMessageDiv("sceneMsg", `STAGE ${GameInfo.levelArray.length}`);
    let div2 = createMessageDiv("sceneMsg", "COMPLETED");
    let div3 = createMessageDiv("speedMsg", `Time: ${getTime()}`);
    let killsStr = `Total kills: ${GameInfo.deadCount + GameInfo.deadExtraCount}`;
    let div4 = createMessageDiv("speedMsg", killsStr);
    slamMessage(div1, elements.finishMsg, 1000);
    slamMessage(div2, elements.finishMsg, 2000);
    slamMessage(div3, elements.finishMsg, 3000);
    slamMessage(div4, elements.finishMsg, 4000);
}
function slamMessage(elem, parent, delay) {
    setTimeout(() => {
        parent.append(elem);
        SGshot.play();
    }, delay);
}
