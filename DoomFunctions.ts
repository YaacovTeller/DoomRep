class DOMUpdater {
    public static updateKillCounter(totalCount) {
        this.updateCounter(elements.killCounter, "Kills:" + totalCount);
    }
    public static updateAmmoCounter(ammo) {
        this.updateCounter(elements.ammoCount, ammo);
    }
    public static updateAmmoWithClick(ammo) {
        this.updateCounter(elements.ammoCount, ammo);
        this.colorChange(elements.ammoCount, 'red', ammo, 10);
        this.blipAnim(elements.ammoCount);
        click2.play();
    }
    public static updateHealthCounter(health) {
        this.updateCounter(elements.health, health);
        this.colorChange(elements.health, 'red', health, 40);
    }
    public static updateCounter(elem, str) {
        elem.innerText = str;
    }

    public static colorChange(elem, color, ammount, limit) {
        if (ammount < limit) {
            elem.style.color = color;
        }
        else {
            elem.style.color = "black";
        }
    }

    public static blipAnim(elem){
        // let width = parseInt($(elem).css('width'))
        // $(elem).animate({width: (width + 20)+'px'}, 150);
        // $(elem).animate({width: (width - 20)+'px'}, 150);
        let fontSize = parseInt($(elem).css('fontSize'))
        $(elem).animate({fontSize: (fontSize + 10)+'px'}, 150);
        $(elem).animate({fontSize: (fontSize)+'px'}, 150);
    }
    public static timedClearAllImages(){
        this.clearTargets();
        setTimeout(() => {
            this.clearPickups()
        }, 1000);
    }
    public static clearTargets() {
        for (let enemy of GameInfo.enemyArray){
            enemy.undraw();
            clearInterval(enemy.attackRoller);
        }
        GameInfo.enemyArray = [];
    }
    public static clearPickups() {
        for (let item of Pickup.array){
            item.undraw();
        }
        Pickup.array = [];
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
    if (GameInfo.riotShieldDeployed == false) {
        GameInfo.riotShieldDeployed = true;
        elements.riotShield.style.animationName = "raiseShield";
        Player.slungWeapon = Player.weapon;
        if(Player.slungWeapon instanceof MachineGun){
            Player.slungWeapon.stopstrafe();
        }
        Player.weaponCollection['Pistol'].switchTo();
       // clearInterval(hurting); // NEEDED?
        // document.body.setAttribute("onmousemove", "shieldMove(event); Player.weapon.gunMove(event)")
    }
    else {
        elements.riotShield.style.animationName = "lowerShield";
        GameInfo.riotShieldDeployed = false;
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
    for (let enemy of GameInfo.enemyArray){
        if (!enemy) continue
        enemy.die();
    }
}

function clearAllEnemies(){
    for (let enemy of GameInfo.enemyArray){
        if (!enemy) continue
        enemy.deadFlag = true;
        clearInterval(enemy.attackRoller);
        hideElement(enemy.DOMImage);
    }
}
function godMode(){
    for (let enemy of GameInfo.enemyArray){
        if (!enemy) continue
        clearInterval(enemy.attackRoller);
    }
}

// Checks if the targets were killed, advances to next stage
function levelCheck() {
    if (checkAllDead()){
        if (GameInfo.gameMode == 0){
            switch (GameInfo.level) {
                case 1: lev2(); break;
                case 2: lev3(); break;
                case 3: lev4(); break;
                case 4: lev5(); break;
                case 5: finalLev(); break;
                case 6: sectionFinish(); break;
            }
        }
        else if (GameInfo.gameMode == 1){
            LevelGenerator.levelLoop();
        }
    }
}

function checkAllDead(){
    for(let enemy of GameInfo.enemyArray){
        if (enemy.deadFlag == false && !(enemy instanceof Extra)) return false
    }
    GameInfo.enemiesCleared = true;
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
    if (GameInfo.gameBegun == true) {
        startTimer()
    }
}
function startingAmmo() {
    Player.weaponCollection['Pistol'].ammo = gunConfig.Pistol.startingAmmo;
}

function restart(num) {
    document.getElementById("fin").innerHTML = "";
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
    if (GameInfo.music == true) {
        button.innerText = "Unmute music"
        GameInfo.music = false;
        Deuscredits.stop();
    }
    else if (GameInfo.music == false) {
        button.innerText = "Mute music"
        GameInfo.music = true;
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

    let killsStr = `Total kills: ${GameInfo.deadCount + GameInfo.deadExtraCount}`
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
    reduceBar(0);
    stopTimer();
    GameInfo.gameBegun = false;
    Deuscredits.stop();
    finishMessage()
}