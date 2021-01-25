"use strict";
class DOMUpdater {
    static stopMiscSound() {
        SawIdle.stop();
    }
    static updateKillCounter(totalCount) {
        this.updateCounter(elements.killCounter, "Kills:" + totalCount);
    }
    static updateAmmoCounter(ammo) {
        this.updateCounter(elements.ammoCount, ammo);
        let lowAmmoLimit = Player.weapon.pickupStats.ammoAmmounts['big'];
        this.colorChange(elements.ammoCount, 'red', ammo, lowAmmoLimit);
    }
    static updateAmmoWithClick(ammo) {
        this.updateAmmoCounter(ammo);
        this.blipAnim(elements.ammoCount);
        click2.play();
    }
    static setProgressCounter(mode) {
        if (mode == gameMode.continuous) {
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
    static blipAnim(elem) {
        let fontSize = 60; //parseInt($(elem).css('fontSize'));
        $(elem).animate({ fontSize: (fontSize + 10) + 'px' }, 150);
        $(elem).animate({ fontSize: (fontSize) + 'px' }, 150);
    }
    static timedClearAllImages() {
        this.clearTargets();
        this.clearItems();
        setTimeout(() => {
            this.clearPickups();
        }, 1000);
    }
    static clearTargets() {
        this.clearGeneric(GameInfo.enemyArray);
    }
    static clearPickups() {
        this.clearGeneric(GameInfo.pickupArray);
    }
    static clearItems() {
        this.clearGeneric(GameInfo.itemArray);
    }
    static clearGeneric(array) {
        for (let item of array) {
            item.undraw();
            if (item instanceof RegEnemy) {
                clearInterval(item.attackRoller);
            }
        }
        array.length = 0;
        //array = []; // does not affect the orig array!
    }
}
