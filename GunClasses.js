"use strict";
const gunMoveEvent = "Player.weapon.gunLower(event);";
const MgunShotEvent = "Player.weapon.MGunShotDisplay(event);";
const gunConfig = {
    Pistol: {
        pickup_ammo_small: 6,
        startingAmmo: 12,
        damage: 20,
        gunHeight: 284,
    },
    Shotgun: {
        pickup_ammo_small: 4,
        pickup_ammo_big: 8,
        startingAmmo: 8,
        damage: 40,
        gunHeight: 210,
    },
    DukeMgun: {
        pickup_ammo_small: 18,
        pickup_ammo_big: 40,
        startingAmmo: 40,
        damage: 10,
        gunHeight: 343,
    },
    Minigun: {
        pickup_ammo_small: 25,
        pickup_ammo_big: 50,
        startingAmmo: 50,
        damage: 20,
        gunHeight: 487,
    },
    DualNeutron: {
        pickup_ammo_small: 15,
        pickup_ammo_big: 30,
        startingAmmo: 36,
        damage: 15,
        gunHeight: 406,
    },
    ChainSaw: {
        damage: 10,
        reach: 240,
        gunHeight: 312,
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
class MousePosition {
}
//WEAPON
class weaponry {
    constructor() {
        this.reloading = false;
    }
    // sliding gun switch
    switchTo() {
        if (weaponry.switching == false) { //avoid bobs for multiple weapon pickup
            weaponry.switching = true;
            setTimeout(() => { weaponry.switching = false; }, 150);
            this.weaponBob();
        }
        Player.weapon = this;
        setTimeout(() => {
            elements.weaponImg.setAttribute("src", this.gunImage);
        }, 150);
        DOMUpdater.updateAmmoCounter(this.ammo);
        if (!(this instanceof ChainSaw)) {
            SawIdle.stop();
        }
    }
    ;
    weaponBob() {
        $(elements.weaponDiv).animate({ top: '150%' }, 150);
        let gunTop = this.calculateGunTop(MousePosition.y, true);
        $(elements.weaponDiv).animate({ top: gunTop }, 150);
    }
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
    // Moves weapon to the mouse location, and keeps it at the base of the screen
    gunLower(e) {
        // if (this.reloading){ return }
        let mouseX = MousePosition.x = e.pageX;
        let mouseY = MousePosition.y = e.pageY;
        this.calculateAndSetGunPosition(mouseX, mouseY);
    }
    calculateAndSetGunPosition(x, y) {
        let xOffset = 7;
        let gunLeft = x - elements.weaponImg.width / 2 - xOffset + "px";
        let gunTop = this.calculateGunTop(y);
        // this.setGunPosOnePlane("left", gunLeft);
        // this.setGunPosOnePlane("top", gunTop);
        this.setGunPosition(gunLeft, gunTop);
    }
    calculateGunTop(y, bob) {
        let screenHeight = window.innerHeight; //screen.height;
        // Lowers the weapon when the mouse passes the gun height!
        let gunTop;
        let gunHeight = bob ? gunConfig[this.constructor.name].gunHeight : elements.weaponImg.height;
        let baseGunPosition = screenHeight - gunHeight;
        if (y < baseGunPosition || this.reloading) {
            gunTop = baseGunPosition + "px";
        }
        else {
            gunTop = y + 10 + "px";
        }
        return gunTop;
    }
    setGunPosition(x, y) {
        this.setGunPosOnePlane("left", x);
        this.setGunPosOnePlane("top", y);
    }
    setGunPosOnePlane(prop, num) {
        elements.weaponDiv.style[prop] = num;
    }
    ricochet(sounds) {
        RandomSoundGen.playRandomSound(sounds);
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
    reload() { }
    shot(e) {
        if (this.pickupShot())
            return;
        if (this.ammo <= 0) {
            click2.play();
            return;
        }
        else {
            this.ammo--;
            DOMUpdater.updateAmmoCounter(this.ammo);
            this.firingSound.play();
            this.reload(); // only shotgun?
            if (GameInfo.targeting == false) {
                this.ricochet();
                return false;
            }
            else {
                GameInfo.hitTarget.loseHealth(this.damage);
                if (!(GameInfo.hitTarget instanceof Item)) { // for barrels
                    return true;
                }
            }
        }
    }
}
class Pistol extends regGun {
    constructor() {
        super(...arguments);
        this.firingSound = Pshot;
        this.gunImage = pics.guns.pistol;
        this.damage = gunConfig.Pistol.damage;
        this.ammo = gunConfig.Pistol.startingAmmo;
        this.pickupStats = new pickupStats(pics.pickups.Pistol, gunConfig.Pistol.pickup_ammo_small, gunConfig.Pistol.pickup_ammo_small, pics.pickups.bullets.small, pics.pickups.bullets.small);
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
        this.damage = gunConfig.Shotgun.damage;
        this.ammo = gunConfig.Shotgun.startingAmmo;
        this.pickupStats = new pickupStats(pics.pickups.Shotgun, gunConfig.Shotgun.pickup_ammo_big, gunConfig.Shotgun.pickup_ammo_small, pics.pickups.shells.big, pics.pickups.shells.small);
    }
    shot(e) {
        if (this.reloading)
            return;
        if (super.shot(e) === false) {
            weaponry.showShot(e);
        }
        return true;
    }
    reload() {
        this.reloading = true;
        elements.weaponImg.src = pics.guns.reloading.shotgun;
        this.calculateAndSetGunPosition(MousePosition.x, MousePosition.y);
        setTimeout(() => {
            elements.weaponImg.src = pics.guns.shotgun;
            this.reloading = false;
            this.calculateAndSetGunPosition(MousePosition.x, MousePosition.y);
        }, 1000);
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
            if (this.firing) {
                this.stopstrafe();
            }
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
        this.chainsawReach = gunConfig.ChainSaw.reach; // target height
        this.firingSound = Saw;
        this.gunImage = pics.guns.chainsaw;
        this.gunImage_firing = pics.guns.chainsaw_firing;
        this.damage = gunConfig.ChainSaw.damage;
        this.pickupStats = new pickupStats(pics.pickups.ChainSaw, "", "", "", "");
    }
    chainsawDistanceCheck(hitImage) {
        if (hitImage.getBoundingClientRect().height > this.chainsawReach) {
            return true; // height/clientHeight/offsetHeight properties wont give real height
        }
        else
            return false;
    }
    chainsawHitCheck() {
        return (GameInfo.targeting == true && this.chainsawDistanceCheck(GameInfo.hitTarget.DOMImage));
    }
    strafe() {
        if (this.pickupShot())
            return;
        document.addEventListener('mouseleave', e => {
            if (this.firing) {
                this.stopstrafe();
            }
        });
        this.firing = true;
        //   this.gunHeight = gunConfig.ChainSaw.firing.gunHeight
        //   this.scrnMargin = gunConfig.ChainSaw.firing.scrnMargin
        if (this.chainsawHitCheck()) {
            GameInfo.hitTarget.loseHealth(this.damage);
        }
        let _this = this;
        MachineGun.hittingInterval = (setInterval(() => {
            if (this.chainsawHitCheck())
                GameInfo.hitTarget.loseHealth(_this.damage);
        }, 200));
        this.switchSounds();
        elements.weaponImg.setAttribute("src", this.gunImage_firing);
        this.calculateAndSetGunPosition(MousePosition.x, MousePosition.y);
    }
    switchSounds() {
        if (this.firing) {
            SawIdle.stop();
            this.firingSound.play();
        }
        else {
            SawIdle.play();
            this.firingSound.stop();
        }
    }
    stopstrafe() {
        clearInterval(MachineGun.hittingInterval);
        elements.weaponImg.setAttribute("src", this.gunImage);
        this.firing = false;
        this.switchSounds();
        document.body.setAttribute("onmousemove", gunMoveEvent);
    }
    switchTo() {
        super.switchTo();
        DOMUpdater.updateAmmoCounter(`N/A`);
        elements.ammoType.removeAttribute("src");
        SawUp.play();
        let _this = this;
        setTimeout(() => {
            if (Player.weapon == _this) {
                _this.switchSounds();
            }
        }, 2000);
        setMouseAttributes_MachineGun();
    }
}
class Minigun extends MachineGun {
    constructor() {
        super(...arguments);
        this.gunImage = pics.guns.minigun;
        this.gunImage_firing = pics.guns.minigun_firing;
        this.damage = gunConfig.Minigun.damage;
        this.ammo = gunConfig.Minigun.startingAmmo;
        this.firingSound = Avpminigun;
        this.pickupStats = new pickupStats(pics.pickups.Minigun, gunConfig.Minigun.pickup_ammo_big, gunConfig.Minigun.pickup_ammo_big, pics.pickups.bullets.big, pics.pickups.bullets.big // FIX? need small chaingun pickup
        );
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
        this.damage = gunConfig.DukeMgun.damage;
        this.ammo = gunConfig.DukeMgun.startingAmmo;
        this.firingSound = MGun;
        this.pickupStats = new pickupStats(pics.pickups.DukeMgun, gunConfig.DukeMgun.pickup_ammo_big, gunConfig.DukeMgun.pickup_ammo_big, pics.pickups.bullets.big, pics.pickups.bullets.big // FIX? need small bullets pickup
        );
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
    switchTo() {
        super.switchTo();
        elements.ammoType.setAttribute("src", pics.ammoIcons.bullets);
        setMouseAttributes_MachineGun();
    }
}
class DualNeutron extends MachineGun {
    constructor() {
        super(...arguments);
        this.gunImage = pics.guns.dualNeutron;
        this.gunImage_firing = pics.guns.dualNeutron_firing;
        this.damage = gunConfig.DualNeutron.damage;
        this.ammo = gunConfig.DualNeutron.startingAmmo;
        this.firingSound = SSamMinigun;
        this.pickupStats = new pickupStats(pics.pickups.DukeMgun, gunConfig.DualNeutron.pickup_ammo_big, gunConfig.DualNeutron.pickup_ammo_small, pics.pickups.bullets.big, pics.pickups.bullets.small);
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
