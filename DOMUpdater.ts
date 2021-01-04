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
    public static setProgressCounter(num){
        if (num){
            elements.progressCounter.parentElement.style.display = 'block'
        }
        else{
            elements.progressCounter.parentElement.style.display = 'none'
        }
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
    public static gunTobaseOfScreen(gunMargin){
        elements.weaponDiv.style.top = `${window.outerHeight - gunMargin}px`; 
    }

    public static blipAnim(elem) {
        let fontSize = 60 //parseInt($(elem).css('fontSize'));
        $(elem).animate({ fontSize: (fontSize + 10) + 'px' }, 150);
        $(elem).animate({ fontSize: (fontSize) + 'px' }, 150);
    }
    public static timedClearAllImages() { // for scene change
        this.clearTargets();
        setTimeout(() => {
            this.clearPickups();
        }, 1000);
    }
    public static clearTargets() {
        for (let enemy of GameInfo.enemyArray) {
            enemy.undraw();
            clearInterval(enemy.attackRoller);
        }
        GameInfo.enemyArray = [];
    }
    public static clearPickups() {
        for (let item of Pickup.array) {
            item.undraw();
        }
        Pickup.array = [];
    }
}
