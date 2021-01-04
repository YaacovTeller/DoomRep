"use strict";
class DOMUpdater {
    static updateKillCounter(totalCount) {
        this.updateCounter(elements.killCounter, "Kills:" + totalCount);
    }
    static updateAmmoCounter(ammo) {
        this.updateCounter(elements.ammoCount, ammo);
    }
    static updateAmmoWithClick(ammo) {
        this.updateCounter(elements.ammoCount, ammo);
        this.colorChange(elements.ammoCount, 'red', ammo, 10);
        this.blipAnim(elements.ammoCount);
        click2.play();
    }
    static setProgressCounter(num) {
        if (num) {
            elements.progressCounter.parentElement.style.display = 'block';
        }
        else {
            elements.progressCounter.parentElement.style.display = 'none';
        }
    }
    static updateHealthCounter(health) {
        this.updateCounter(elements.health, health);
        this.colorChange(elements.health, 'red', health, 40);
    }
    static updateCounter(elem, str) {
        elem.innerText = str;
    }
    static colorChange(elem, color, ammount, limit) {
        if (ammount < limit) {
            elem.style.color = color;
        }
        else {
            elem.style.color = "black";
        }
    }
    static gunTobaseOfScreen(gunMargin) {
        elements.weaponDiv.style.top = `${window.outerHeight - gunMargin}px`;
    }
    static blipAnim(elem) {
        let fontSize = 60; //parseInt($(elem).css('fontSize'));
        $(elem).animate({ fontSize: (fontSize + 10) + 'px' }, 150);
        $(elem).animate({ fontSize: (fontSize) + 'px' }, 150);
    }
    static timedClearAllImages() {
        this.clearTargets();
        setTimeout(() => {
            this.clearPickups();
        }, 1000);
    }
    static clearTargets() {
        for (let enemy of GameInfo.enemyArray) {
            enemy.undraw();
            clearInterval(enemy.attackRoller);
        }
        GameInfo.enemyArray = [];
    }
    static clearPickups() {
        for (let item of Pickup.array) {
            item.undraw();
        }
        Pickup.array = [];
    }
}
