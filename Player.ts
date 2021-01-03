class Player {
    public static health: number;
    public static dead: boolean = false;
    public static weaponCollection: Object = {};
    public static weapon: weaponry;
    public static slungWeapon: weaponry;
    public static riotShieldDeployed: boolean = false;
    public static damageCheck(damager: RegEnemy, damage) {
        damager.damaging = setTimeout(function () {
            if (Player.riotShieldDeployed == false) {
                Player.playerHit(damage);
            }
            else
                RandomSoundGen.randomSound([Turicochet, BloodRicochet_1, BloodRicochet_2]);
                //Turicochet.play();
        }, 1000);
    }
    public static reset() {
        Player.dead = false;
        Player.health = 100;
        Player.weaponCollection = {};
    }

    public static collectAmmo(ammount: number, weaponName: string) {
        this.weaponCollection[weaponName].ammo += ammount;
        DOMUpdater.updateAmmoWithClick(Player.weapon.ammo);
    }

    public static collectWeapon(weapon: weaponry) {
        let weaponName = weapon.constructor.name;
        if (!this.weaponCollection[weaponName]) {
            this.weaponCollection[weaponName] = weapon;
            this.selectWeapon(weapon);
        }
        else {
            Player.collectAmmo(gunConfig[weaponName].startingAmmo, weaponName);
        }
    }

    public static collectHealth(ammount) {
        Player.health += ammount;
        Player.health = Player.health < 120 ? Player.health : 120; // HEALTH CAP AT 120? 
        DOMUpdater.updateHealthCounter(Player.health);
    }

    public static selectWeapon(weapon: weaponry) {
        weapon.switchTo();
        Player.weapon = weapon;
    }

    public static playerHit(damage) {
        if (GameInfo.invincible == true) return
        Player.health -= damage;
        if (Player.health > 0) {
            DOMUpdater.updateHealthCounter(Player.health);
            document.body.style.animationName = "hit";
            Player.hurtSound();
            setTimeout(function () { document.body.style.removeProperty("animation-name"); }, 1100);
        }
        else { Player.playerDeath(); }
    }

    private static playerDeath() {
        if (Player.dead == true) { return; }
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

        let div1: HTMLElement = createMessageDiv("sceneMsg", "YOU DIED");
        slamMessage(div1, elements.finishMsg, 1000);

        GameInfo.currentLevel = null;
        DOMUpdater.timedClearAllImages(); // DRY?
        setTimeout(() => {
            openMenu();
            clearAllEnemies(); // DRY?
            clearScreenMessages();
        }, 2500);
    }
    private static deadSound() {
        Turokscream.play();
    }
    private static hurtSound() {
        Hlifescream1.play();
    }
}
