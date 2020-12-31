"use strict";
class Player {
    static damageCheck(damager, damage) {
        damager.damaging = setTimeout(function () {
            if (Player.riotShieldDeployed == false) {
                Player.playerHit(damage);
            }
            else
                Turicochet.play();
        }, 1000);
    }
    static reset() {
        Player.dead = false;
        Player.health = 100;
        Player.weaponCollection = {};
    }
    static collectAmmo(ammount, weaponName) {
        this.weaponCollection[weaponName].ammo += ammount;
        DOMUpdater.updateAmmoWithClick(Player.weapon.ammo);
    }
    static collectWeapon(weapon) {
        let weaponName = weapon.constructor.name;
        if (!this.weaponCollection[weaponName]) {
            this.weaponCollection[weaponName] = weapon;
            this.selectWeapon(weapon);
        }
        else {
            Player.collectAmmo(gunConfig[weaponName].startingAmmo, weaponName);
        }
    }
    static collectHealth(ammount) {
        Player.health += ammount;
        Player.health = Player.health < 120 ? Player.health : 120; // HEALTH CAP AT 120? 
        DOMUpdater.updateHealthCounter(Player.health);
    }
    static selectWeapon(weapon) {
        weapon.switchTo();
        Player.weapon = weapon;
    }
    static playerHit(damage) {
        if (GameInfo.invincible == true)
            return;
        Player.health -= damage;
        if (Player.health > 0) {
            DOMUpdater.updateHealthCounter(Player.health);
            document.body.style.animationName = "hit";
            Player.hurtSound();
            setTimeout(function () { document.body.style.removeProperty("animation-name"); }, 1100);
        }
        else {
            Player.playerDeath();
        }
    }
    static playerDeath() {
        if (Player.dead == true) {
            return;
        }
        Player.dead = true;
        this.deadSound();
        fadeOut();
        stopTimer();
        $(elements.weaponDiv).animate({ top: '130%' }, 3000);
        document.body.setAttribute("onmousemove", null);
        this.weapon = null;
        Deuscredits.stop();
        DOMUpdater.updateHealthCounter(0);
        elements.backImg.style.animationFillMode = "forwards";
        let div1 = createMessageDiv("sceneMsg", "YOU DIED");
        slamMessage(div1, elements.finishMsg, 1000);
        GameInfo.currentLevel = null;
        DOMUpdater.timedClearAllImages(); // DRY?
        setTimeout(() => {
            openMenu();
            clearAllEnemies(); // DRY?
            clearScreenMessages();
        }, 2500);
    }
    static deadSound() {
        Turokscream.play();
    }
    static hurtSound() {
        Hlifescream1.play();
    }
}
Player.dead = false;
Player.weaponCollection = {};
Player.riotShieldDeployed = false;
