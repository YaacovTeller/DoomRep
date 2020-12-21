"use strict";
const gunMoveEvent = "Player.weapon.gunMove(event);";
const MgunShotEvent = "Player.weapon.MGunShotDisplay(event);";
const gunConfig = {
    Pistol: {
        pickup_ammo_small: 12,
        startingAmmo: 24,
        damage: 20,
        scrnMargin: 280,
        gunHeight: 390,
    },
    Shotgun: {
        pickup_ammo_small: 4,
        pickup_ammo_big: 8,
        startingAmmo: 8,
        damage: 30,
        scrnMargin: 230,
        gunHeight: 350,
    },
    DukeMgun: {
        pickup_ammo_small: 20,
        pickup_ammo_big: 50,
        startingAmmo: 80,
        damage: 10,
        scrnMargin: 280,
        gunHeight: 390,
    },
    Minigun: {
        pickup_ammo_small: 20,
        pickup_ammo_big: 50,
        startingAmmo: 50,
        damage: 15,
        scrnMargin: 370,
        gunHeight: 480,
    },
    DualNuetron: {
        pickup_ammo_small: 15,
        pickup_ammo_big: 30,
        startingAmmo: 36,
        damage: 12,
        scrnMargin: 250,
        gunHeight: 360,
        firing: {
            scrnMargin: 300,
            gunHeight: 390,
        }
    },
    ChainSaw: {
        damage: 10,
        reach: 240,
        scrnMargin: 280,
        gunHeight: 390,
        firing: {
            scrnMargin: 210,
            gunHeight: 220,
        }
    }
};
class pickupStats {
    constructor(gunImage, bigAmmount, smallAmmount, bigImage, smallImage) {
        this.gunImage = gunImage;
        this.ammoAmmounts = {
            big: bigAmmount,
            small: smallAmmount
        };
        this.ammoImages = {
            big: bigImage,
            small: smallImage
        };
    }
}
//WEAPON
class weaponry {
    // sliding gun switch
    switchTo() {
        if (weaponry.switching == false) { //avoid bobs for multiple weapon pickup
            weaponry.switching = true;
            setTimeout(() => { weaponry.switching = false; }, 150);
            $(elements.weaponDiv).animate({ top: '150%' }, 150);
            $(elements.weaponDiv).animate({ top: '90%' }, 150);
        }
        elements.weaponDiv.style.top = `${window.outerHeight - this.scrnMargin}px`; //screen.height
        elements.weaponImg.setAttribute("src", this.gunImage);
        Player.weapon = this;
        DOMUpdater.updateAmmoCounter(this.ammo);
    }
    ;
    static showBlood(e) {
        this.displayScreenElement(e, elements.blood, 10, 10, 100);
        elements.blood.setAttribute("src", pics.blood + "?a=" + Math.random()); // FIX?
    }
    static showShot(e) {
        this.displayScreenElement(e, elements.oneshot, 50, 50, 10);
    }
    static displayScreenElement(e, elem, xOffset, yOffset, duration) {
        var x = e.pageX;
        var y = e.pageY;
        showElement(elem);
        elem.style.left = `${x - xOffset}px`;
        elem.style.top = `${y - yOffset}px`;
        setTimeout(() => hideElement(elem), duration);
    }
    gunLower(e) {
        var Screen = window.outerHeight; //screen.height;
        var x = e.pageX;
        var y = e.pageY;
        weaponry.cX = `${x - 44}px`;
        // Lowers the weapon when the mouse passes the gun height!
        if (y > (Screen - this.gunHeight)) {
            weaponry.cY = `${y + 110}px`;
        }
        else {
            weaponry.cY = `${Screen - this.scrnMargin}px`;
        }
        elements.weaponDiv.style.left = weaponry.cX;
        elements.weaponDiv.style.top = weaponry.cY;
    }
    ricochet(sounds) {
        let length = sounds.length;
        let randNum = Math.floor(Math.random() * (length) + 1);
        sounds[randNum - 1].play();
    }
    pickupShot() {
        if (GameInfo.targeting == false && GameInfo.hitTarget instanceof Pickup) {
            return true;
        }
    }
}
weaponry.switching = false;
class regGun extends weaponry {
    ricochet() {
        let regGunSounds = new Array(Bullet1, Bullet2, Bullet3);
        super.ricochet(regGunSounds);
    }
    shot(e) {
        if (this.pickupShot())
            return;
        if (this.ammo <= 0) {
            click2.play();
            return false;
        }
        else {
            this.ammo--;
            DOMUpdater.updateAmmoCounter(this.ammo);
            this.firingSound.play();
            if (GameInfo.targeting == false) {
                this.ricochet();
                return false;
            }
            else {
                GameInfo.hitTarget.loseHealth(this.damage);
                return true;
            }
        }
    }
}
class Pistol extends regGun {
    constructor() {
        super(...arguments);
        this.firingSound = Pshot;
        this.gunImage = pics.guns.pistol;
        this.gunHeight = gunConfig.Pistol.gunHeight;
        this.scrnMargin = gunConfig.Pistol.scrnMargin;
        this.damage = gunConfig.Pistol.damage;
        this.ammo = gunConfig.Pistol.startingAmmo;
        this.pickupStats = new pickupStats(pics.guns.pistol, gunConfig.Pistol.pickup_ammo_small, gunConfig.Pistol.pickup_ammo_small, pics.pickups.bullets.big, pics.pickups.bullets.small);
    }
    gunMove(e) {
        super.gunLower(e);
    }
    shot(e) {
        if (super.shot(e)) {
            weaponry.showBlood(e);
            return true;
        }
    }
    switchTo() {
        super.switchTo();
        elements.ammoType.setAttribute("src", pics.ammoIcons.bullet);
        setMouseAttributes_Normal();
    }
}
class Shotgun extends regGun {
    constructor() {
        super(...arguments);
        this.firingSound = SGshot;
        this.gunImage = pics.guns.shotgun;
        this.gunHeight = gunConfig.Shotgun.gunHeight;
        this.scrnMargin = gunConfig.Shotgun.scrnMargin;
        this.damage = gunConfig.Shotgun.damage;
        this.ammo = gunConfig.Shotgun.startingAmmo;
        this.pickupStats = new pickupStats(pics.pickups.Shotgun, gunConfig.Shotgun.pickup_ammo_big, gunConfig.Shotgun.pickup_ammo_small, pics.pickups.shells.big, pics.pickups.shells.small);
    }
    gunMove(e) {
        this.gunLower(e);
    }
    shot(e) {
        super.shot(e);
        weaponry.showShot(e);
        return true;
    }
    switchTo() {
        super.switchTo();
        elements.ammoType.setAttribute("src", pics.ammoIcons.shell);
        setMouseAttributes_Normal();
    }
}
class MachineGun extends weaponry {
    strafe() {
        document.addEventListener('mouseleave', e => {
            this.stopstrafe();
        });
        document.body.setAttribute("onmousemove", gunMoveEvent);
        this.firing = true;
        this.spendingBullets();
        let _this = this;
        if (GameInfo.targeting == true) {
            GameInfo.hitTarget.loseHealth(_this.damage);
        }
        MachineGun.hittingInterval = (setInterval(function () {
            if (GameInfo.targeting == true) {
                GameInfo.hitTarget.loseHealth(_this.damage);
            }
        }, 200));
    }
    spendingBullets() {
        elements.weaponImg.setAttribute("src", this.gunImage_firing);
        this.firingSound.play();
        let _this = this;
        MachineGun.firingInterval = setInterval(function () {
            _this.ammo--;
            DOMUpdater.updateAmmoCounter(_this.ammo);
            if (_this.ammo <= 0) {
                _this.stopstrafe();
                click2.play();
            }
        }, 200);
    }
    stopstrafe() {
        this.firing = false;
        this.firingSound.stop();
        elements.weaponImg.setAttribute("src", this.gunImage);
        document.body.setAttribute("onmousemove", gunMoveEvent);
        clearInterval(MachineGun.hittingInterval);
        clearInterval(MachineGun.firingInterval);
    }
    MGunShotDisplay(e) {
        if (GameInfo.targeting == false) {
            this.ricochet();
        }
        else /*Bullet4.play()*/
            ;
        weaponry.showShot(e);
    }
    ricochet() {
        let machineGunSounds = new Array(Bullet5, Bullet6, Bullet7, Bullet8);
        super.ricochet(machineGunSounds);
    }
}
class ChainSaw extends MachineGun {
    constructor() {
        super(...arguments);
        this.firingSound = Saw;
        this.gunImage = pics.guns.chainsaw;
        this.gunImage_firing = pics.guns.chainsaw_firing;
        this.gunHeight = gunConfig.ChainSaw.gunHeight;
        this.scrnMargin = gunConfig.ChainSaw.scrnMargin;
        this.damage = gunConfig.ChainSaw.damage;
        this.pickupStats = new pickupStats(pics.pickups.ChainSaw, "", "", "", "");
    }
    gunMove(e) {
        this.gunLower(e);
    }
    static chainsawDistanceCheck(hitImage) {
        if (hitImage.src.includes("ChainGuy")) { // change (can't chainsaw the boss?)
            return true;
        }
        else if (hitImage.getBoundingClientRect().height > this.chainsawReach) {
            return true; // height/clientHeight/offsetHeight properties wont give real height
        }
        else
            return false;
    }
    strafe() {
        if (this.pickupShot())
            return;
        this.firing = true;
        this.gunHeight = gunConfig.ChainSaw.firing.gunHeight;
        this.scrnMargin = gunConfig.ChainSaw.firing.scrnMargin;
        if (GameInfo.targeting == true && ChainSaw.chainsawDistanceCheck(GameInfo.hitTarget.DOMImage)) {
            GameInfo.hitTarget.loseHealth(this.damage);
            let _this = this;
            MachineGun.hittingInterval = (setInterval(function () { GameInfo.hitTarget.loseHealth(_this.damage); }, 200));
        }
        elements.weaponImg.setAttribute("src", this.gunImage_firing);
        this.firingSound.play();
        elements.weaponDiv.style.left = weaponry.cX;
        elements.weaponDiv.style.top = weaponry.cY;
    }
    stopstrafe() {
        this.gunHeight = gunConfig.ChainSaw.gunHeight;
        this.scrnMargin = gunConfig.ChainSaw.scrnMargin;
        clearInterval(MachineGun.hittingInterval);
        elements.weaponImg.setAttribute("src", this.gunImage);
        this.firingSound.stop();
        document.body.setAttribute("onmousemove", gunMoveEvent);
    }
    switchTo() {
        super.switchTo();
        DOMUpdater.updateAmmoCounter(`N/A`);
        elements.ammoType.removeAttribute("src");
        SawUp.play();
        setMouseAttributes_MachineGun();
    }
}
ChainSaw.chainsawReach = gunConfig.ChainSaw.reach; // target height
class Minigun extends MachineGun {
    constructor() {
        super(...arguments);
        this.gunImage = pics.guns.minigun;
        this.gunImage_firing = pics.guns.minigun_firing;
        this.gunHeight = gunConfig.Minigun.gunHeight;
        this.scrnMargin = gunConfig.Minigun.scrnMargin;
        this.damage = gunConfig.Minigun.damage;
        this.ammo = gunConfig.Minigun.startingAmmo;
        this.firingSound = Avpminigun;
        this.pickupStats = new pickupStats(pics.pickups.Minigun, gunConfig.Minigun.pickup_ammo_big, gunConfig.Minigun.pickup_ammo_small, pics.pickups.bullets.big, pics.pickups.bullets.small);
    }
    gunMove(e) {
        this.gunLower(e);
    }
    spinUp() {
        elements.weaponImg.setAttribute("src", pics.guns.minigun_spinup);
        SSamRotate2.play();
        this.mgspinning = setTimeout(function () {
            SSamRotate.play();
        }, 700);
    }
    strafe() {
        if (this.pickupShot())
            return;
        if (this.ammo <= 0) {
            click2.play();
        }
        else {
            this.spinUp();
            let superStrafe = () => { super.strafe(); };
            this.mgfiring = setTimeout(function () {
                Minigun.spinUpCheck = true;
                superStrafe();
            }, 1000);
        }
    }
    stopstrafe() {
        clearInterval(MachineGun.hittingInterval);
        clearInterval(MachineGun.firingInterval);
        clearInterval(this.mgfiring);
        clearInterval(this.mgspinning);
        Minigun.spinUpCheck = false;
        // The minigun sometimes ends on the off-spin!
        let randNum = Math.floor(Math.random() * (2 - 1 + 1) + 1);
        if (randNum == 1) {
            elements.weaponImg.setAttribute("src", this.gunImage);
        }
        else
            elements.weaponImg.setAttribute("src", pics.guns.minigun_frame2);
        // SSamMinigun.stop();
        // SSamMinigun2.stop();
        this.firingSound.stop();
        SSamRotate.stop();
        document.body.setAttribute("onmousemove", gunMoveEvent);
    }
    switchTo() {
        super.switchTo();
        elements.ammoType.setAttribute("src", pics.ammoIcons.bullets);
        setMouseAttributes_MachineGun();
    }
}
Minigun.spinUpCheck = false;
class DukeMgun extends MachineGun {
    constructor() {
        super(...arguments);
        this.gunImage = pics.guns.dukeMgun;
        this.gunImage_firing = pics.guns.dukeMgun_firing;
        this.gunHeight = gunConfig.DukeMgun.gunHeight;
        this.scrnMargin = gunConfig.DukeMgun.scrnMargin;
        this.damage = gunConfig.DukeMgun.damage;
        this.ammo = gunConfig.DukeMgun.startingAmmo;
        this.firingSound = MGun;
        this.pickupStats = new pickupStats(pics.pickups.DukeMgun, gunConfig.DukeMgun.pickup_ammo_big, gunConfig.DukeMgun.pickup_ammo_small, pics.pickups.bullets.big, pics.pickups.bullets.small);
    }
    gunMove(e) {
        this.gunLower(e);
    }
    strafe() {
        if (this.pickupShot())
            return;
        if (this.ammo <= 0) {
            click2.play();
        }
        else {
            this.ammo--;
            DOMUpdater.updateAmmoCounter(this.ammo);
            super.strafe();
        }
    }
    stopstrafe() {
        super.stopstrafe();
    }
    switchTo() {
        super.switchTo();
        elements.ammoType.setAttribute("src", pics.ammoIcons.bullets);
        setMouseAttributes_MachineGun();
    }
}
class DualNeutron extends MachineGun {
    constructor() {
        super(...arguments);
        this.gunImage = pics.guns.dualNuetron;
        this.gunImage_firing = pics.guns.dualNuetron_firing;
        this.gunHeight = gunConfig.DualNuetron.gunHeight;
        this.scrnMargin = gunConfig.DualNuetron.scrnMargin;
        this.damage = gunConfig.DualNuetron.damage;
        this.ammo = gunConfig.DualNuetron.startingAmmo;
        this.firingSound = SSamMinigun;
        this.pickupStats = new pickupStats(pics.pickups.DukeMgun, gunConfig.DualNuetron.pickup_ammo_big, gunConfig.DualNuetron.pickup_ammo_small, pics.pickups.bullets.big, pics.pickups.bullets.small);
    }
    gunMove(e) {
        this.gunLower(e);
    }
    strafe() {
        this.gunHeight = gunConfig.DualNuetron.firing.gunHeight;
        this.scrnMargin = gunConfig.DualNuetron.firing.scrnMargin;
        if (this.ammo <= 0) {
            click2.play();
        }
        else {
            this.ammo--;
            DOMUpdater.updateAmmoCounter(this.ammo);
            super.strafe();
        }
    }
    stopstrafe() {
        this.gunHeight = gunConfig.DualNuetron.gunHeight;
        this.scrnMargin = gunConfig.DualNuetron.scrnMargin;
        super.stopstrafe();
    }
    switchTo() {
        super.switchTo();
        elements.ammoType.setAttribute("src", pics.ammoIcons.bullet);
        setMouseAttributes_MachineGun();
    }
}
function setMouseAttributes_Normal() {
    document.body.setAttribute("onmousedown", "Player.weapon.shot(event)");
    document.body.removeAttribute("onmouseup");
    document.body.setAttribute("onmousemove", gunMoveEvent);
}
function setMouseAttributes_MachineGun() {
    document.body.setAttribute("onmousedown", "Player.weapon.strafe()");
    document.body.setAttribute("onmouseup", "Player.weapon.stopstrafe()");
    document.body.setAttribute("onmousemove", gunMoveEvent);
}
