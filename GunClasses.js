"use strict";
const gunMoveEvent = "Player.weapon.gunLower(event);";
const MgunShotEvent = "Player.weapon.MGunShotDisplay(event);";
const gunConfig = {
    Pistol: {
        pickup_ammo_small: 6,
        startingAmmo: 18,
        damage: 20,
        gunHeight: 284,
    },
    Railgun: {
        pickup_ammo_small: 6,
        startingAmmo: 18,
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
        startingAmmo: null,
        damage: 10,
        reach: 240,
        gunHeight: 312,
    },
    Pipebomb: {
        pickup_ammo_small: 1,
        pickup_ammo_big: 1,
        startingAmmo: 1,
        // damage : 15,
        gunHeight: 406,
    },
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
        this.scrnMargin = 0;
        this.reloading = false;
    }
    // sliding gun switch
    switchTo() {
        //  if (Player.riotShieldDeployed && !(this instanceof Pistol)) return
        if (weaponry.switching == false) { //avoid bobs for multiple weapon pickup
            weaponry.switching = true;
            setTimeout(() => { weaponry.switching = false; }, 150);
            this.weaponBob();
        }
        DOMUpdater.updateAmmoCounter(this.ammo);
        if (Player.weapon instanceof MachineGun) {
            Player.weapon.stopstrafe(); // Messy, attempt to prevent infinite strafing!
        }
        Player.weapon = this;
        setTimeout(() => {
            elements.weaponImg.setAttribute("src", this.gunImage);
        }, 150);
        if (!(this instanceof ChainSaw)) { //FIX better way to cut the chainsaw noise?
            SawIdle.stop();
        }
        elements.ammoType.setAttribute("src", this.ammoIcon);
    }
    ;
    weaponBob() {
        $(elements.weaponDiv).animate({ top: '150%' }, 150);
        let gunTop = this.calculateGunTop(MousePosition.y, true);
        $(elements.weaponDiv).animate({ top: gunTop }, 150);
    }
    static showBlood(e) {
        this.restartGifSrc(elements.blood);
        this.displayScreenElement(e, elements.blood, 10, 10, 300);
    }
    static showShot(e) {
        this.displayScreenElement(e, elements.oneshot, 50, 50, 10);
    }
    static showExplosion(e) {
        let image = elements.explosion;
        this.restartGifSrc(image);
        this.displayScreenElement(e, image, 290, 250, 500);
    }
    static showSmallExplosion(e) {
        let image = elements.explosion_small;
        this.restartGifSrc(image);
        this.displayScreenElement(e, image, 100, 80, 500);
    }
    static restartGifSrc(imageElem) {
        imageElem.src = imageElem.src + "?a=" + Math.random();
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
        this.setGunPosition(gunLeft, gunTop);
    }
    calculateGunTop(y, bob) {
        let screenHeight = window.innerHeight; //screen.height;
        // Lowers the weapon when the mouse passes the gun height!
        let gunTop;
        let gunHeight = bob ? gunConfig[this.constructor.name].gunHeight : elements.weaponImg.height;
        //  let gunHeight = this.gunHeight;
        let scrnMargin = this.scrnMargin;
        let baseGunPosition = screenHeight - gunHeight;
        if (y < baseGunPosition + scrnMargin - 5 || this.reloading) { // 
            gunTop = baseGunPosition + "px";
        }
        else {
            //gunTop = y + 10  + "px"
            gunTop = y + 10 - scrnMargin + "px";
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
    loseAmmo() {
        console.log("AMMO: " + this.ammo);
        this.ammo--;
        DOMUpdater.updateAmmoCounter(this.ammo);
    }
    targetingChecks() {
        return GameInfo.targeting == true;
    }
    checkForFiringShot() {
        if (this.pickupShot())
            return false;
        if (this.noAmmoCheck())
            return false;
        return true;
    }
}
weaponry.switching = false;
class regGun extends weaponry {
    ricochet() {
        let regGunSounds = new Array(Bullet1, Bullet2, Bullet3);
        super.ricochet(regGunSounds);
    }
    setFiringImage() {
        elements.weaponImg.src = this.firingImage;
    }
    playFiringSound() {
        this.firingSound.play();
    }
    noAmmoClick() {
        click2.play();
    }
    noAmmoCheck() {
        if (this.ammo <= 0) {
            this.noAmmoClick();
            return true;
        }
    }
    switchTo() {
        super.switchTo();
        setMouseAttributes_Normal();
    }
    shot(e) {
        if (e.button == 2)
            return;
        if (this.checkForFiringShot()) {
            return this.fireAndAssessTarget(e);
        }
    }
    fireAndAssessTarget(e) {
        this.shotRelease();
        if (!this.targetingChecks()) {
            this.ricochet();
            return false;
        }
        else {
            return this.dealDamage(e);
        }
    }
    dealDamage(e) {
        GameInfo.hitTarget.loseHealth(this.damage);
        if (!(GameInfo.hitTarget instanceof Item)) { // for barrels, don't show blood
            return true;
        }
    }
    shotRelease() {
        this.loseAmmo();
        this.playFiringSound();
        this.setFiringImage();
        setTimeout(() => {
            this.reload(); // only shotgun?
        }, 200);
    }
}
class Pistol extends regGun {
    constructor() {
        super(...arguments);
        this.firingImage = pics.guns.firing.pistol;
        this.firingSound = Pshot; //pistolShots;
        this.gunImage = pics.guns.pistol;
        this.ammoIcon = pics.ammoIcons.bullet;
        this.damage = gunConfig.Pistol.damage;
        this.ammo = gunConfig.Pistol.startingAmmo;
        this.pickupStats = new pickupStats(pics.pickups.Pistol, gunConfig.Pistol.pickup_ammo_small, gunConfig.Pistol.pickup_ammo_small, pics.pickups.bullets.clip, pics.pickups.bullets.clip);
    }
    shot(e) {
        if (super.shot(e)) {
            this.showVisual(e);
            return true;
        }
    }
    showVisual(e) {
        weaponry.showBlood(e);
    }
    ;
    playFiringSound() {
        this.firingSound.playClone();
        // this.soundGen.playNotSoRandomSound(this.firingSound)
    }
    reload() {
        setTimeout(() => {
            elements.weaponImg.src = pics.guns.pistol;
            //      this.calculateAndSetGunPosition(MousePosition.x, MousePosition.y);
        }, 50);
    }
}
class Shotgun extends regGun {
    constructor() {
        super(...arguments);
        this.firingSound = SGshot;
        this.gunImage = pics.guns.shotgun;
        this.firingImage = pics.guns.firing.shotgun;
        this.ammoIcon = pics.ammoIcons.shell;
        this.damage = gunConfig.Shotgun.damage;
        this.ammo = gunConfig.Shotgun.startingAmmo;
        this.pickupStats = new pickupStats(pics.pickups.Shotgun, gunConfig.Shotgun.pickup_ammo_big, gunConfig.Shotgun.pickup_ammo_small, pics.pickups.shells.big, pics.pickups.shells.small);
    }
    shot(e) {
        if (this.reloading)
            return;
        if (super.shot(e) === false) {
            this.showVisual(e);
        }
        return true;
    }
    showVisual(e) {
        weaponry.showShot(e);
    }
    ;
    reload() {
        this.reloading = true;
        elements.weaponImg.src = pics.guns.reloading.shotgun;
        this.calculateAndSetGunPosition(MousePosition.x, MousePosition.y);
        setTimeout(() => {
            elements.weaponImg.src = pics.guns.shotgun;
            this.reloading = false;
            this.calculateAndSetGunPosition(MousePosition.x, MousePosition.y);
        }, 900);
    }
}
class areaAffectGun extends regGun {
    targetingChecks() {
        return true;
    }
    dealDamage(e) {
        setTimeout(() => {
            let point = new Position(e.pageX, e.pageY);
            this.bombExplode(point);
            this.showVisual(e);
        }, this.fuse);
        return true;
    }
    bombExplode(left) {
        this.areaAffect.killInBlastRadius(left);
    }
    reload() {
        setTimeout(() => {
            let img = this.gunImage;
            elements.weaponImg.src = img;
        }, this.fuse);
    }
    playFiringSound() {
        setTimeout(() => {
            super.playFiringSound();
        }, this.fuse);
    }
}
class Pipebomb extends areaAffectGun {
    constructor() {
        super(...arguments);
        this.gibRadius = 100;
        this.blastRadius = 200;
        this.fuse = 1000;
        this.areaAffect = new AreaAffect(this.blastRadius, this.gibRadius);
        this.gunImage = pics.guns.pipebomb;
        this.firingImage = pics.guns.firing.Pipebomb;
        this.ammoIcon = pics.ammoIcons.pipe;
        this.firingSound = explosion;
        this.ammo = gunConfig.Pipebomb.startingAmmo;
        this.pickupStats = new pickupStats(pics.pickups.Pipebomb, gunConfig.Pipebomb.pickup_ammo_big, gunConfig.Pipebomb.pickup_ammo_small, pics.pickups.Pipebomb, pics.pickups.Pipebomb);
    }
    showVisual(e) {
        weaponry.showExplosion(e);
    }
    reload() {
        setTimeout(() => {
            let img = this.gunImage;
            img = this.ammo > 0 ? img : pics.guns.blank;
            elements.weaponImg.src = img;
        }, this.fuse);
    }
}
class Railgun extends areaAffectGun {
    constructor() {
        super(...arguments);
        this.gibRadius = 0;
        this.blastRadius = 0;
        this.fuse = 10;
        this.areaAffect = new AreaAffect(this.blastRadius, this.gibRadius);
        this.gunImage = pics.guns.pistol;
        this.firingImage = pics.guns.firing.pistol;
        this.ammoIcon = pics.ammoIcons.bullet;
        this.firingSound = explosion;
        this.ammo = gunConfig.Pistol.startingAmmo;
        this.pickupStats = new pickupStats(pics.pickups.Pistol, gunConfig.Pistol.pickup_ammo_small, gunConfig.Pistol.pickup_ammo_small, pics.pickups.Pistol, pics.pickups.Pistol);
    }
    showVisual(e) {
        weaponry.showSmallExplosion(e);
    }
}
class MachineGun extends weaponry {
    strafe(e) {
        if (e.button == 2)
            return;
        document.body.setAttribute("onmousemove", gunMoveEvent);
        this.addStrafeMouseLeaveEvent();
        this.firing = true;
        this.playFiringSound(true);
        this.spendingBullets();
        this.firstHit();
        this.hittingInterval();
    }
    noAmmoClick() {
        click2.play();
    }
    noAmmoCheck() {
        if (this.ammo <= 0) {
            this.stopstrafe();
            this.noAmmoClick();
            return true;
        }
    }
    firstHit() {
        let _this = this;
        if (this.targetingChecks()) {
            GameInfo.hitTarget.loseHealth(_this.damage);
        }
    }
    hittingInterval() {
        let _this = this;
        MachineGun.hittingInterval = (setInterval(function () {
            if (_this.targetingChecks()) {
                GameInfo.hitTarget.loseHealth(_this.damage);
            }
        }, 200));
    }
    addStrafeMouseLeaveEvent() {
        document.addEventListener('mouseleave', e => {
            if (this.firing) {
                this.stopstrafe();
            }
        });
    }
    spendingBullets() {
        elements.weaponImg.setAttribute("src", this.gunImage_firing);
        let _this = this;
        MachineGun.firingInterval = setInterval(function () {
            _this.loseAmmo();
            _this.noAmmoCheck();
        }, 200);
    }
    clearFiringIntervals() {
        clearInterval(MachineGun.hittingInterval);
        clearInterval(MachineGun.firingInterval);
    }
    stopstrafe() {
        this.firing = false;
        elements.weaponImg.setAttribute("src", this.gunImage);
        document.body.setAttribute("onmousemove", gunMoveEvent);
        this.clearFiringIntervals();
        this.playFiringSound(false);
    }
    switchTo() {
        super.switchTo();
        setMouseAttributes_MachineGun();
    }
    ;
    playFiringSound(on) {
        on ? this.firingSound.play() : this.firingSound.stop();
    }
    MGunShotDisplay(e) {
        if (!this.targetingChecks()) {
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
        this.ammo = gunConfig.ChainSaw.startingAmmo;
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
    targetingChecks() {
        if (super.targetingChecks()) {
            if (this.chainsawDistanceCheck(GameInfo.hitTarget.DOMImage)) {
                return true;
            }
        }
    }
    loseAmmo() {
        //DOMUpdater.updateAmmoCounter('N/A')
    }
    noAmmoCheck() {
        return false; // infinite chainsaw ammo?
    }
    spendingBullets() { }
    ;
    strafe(e) {
        if (this.checkForFiringShot()) {
            super.strafe(e);
            elements.weaponImg.setAttribute("src", this.gunImage_firing);
            this.calculateAndSetGunPosition(MousePosition.x, MousePosition.y);
        }
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
    switchTo() {
        super.switchTo();
        elements.ammoType.removeAttribute("src");
        SawUp.play();
        let _this = this;
        setTimeout(() => {
            if (Player.weapon == _this) {
                _this.switchSounds();
            }
        }, 2000);
    }
}
class Minigun extends MachineGun {
    constructor() {
        super(...arguments);
        this.gunImage = pics.guns.minigun;
        this.gunImage_firing = pics.guns.minigun_firing;
        this.ammoIcon = pics.ammoIcons.bullets;
        this.damage = gunConfig.Minigun.damage;
        this.ammo = gunConfig.Minigun.startingAmmo;
        this.firingSound = Avpminigun;
        this.pickupStats = new pickupStats(pics.pickups.Minigun, gunConfig.Minigun.pickup_ammo_big, gunConfig.Minigun.pickup_ammo_small, pics.pickups.bullets.box, pics.pickups.bullets.chain);
    }
    spinUp() {
        elements.weaponImg.setAttribute("src", pics.guns.minigun_spinup);
        SSamRotate2.play();
        this.mgspinning = setTimeout(function () {
            SSamRotate.play();
        }, 700);
    }
    strafe(e) {
        if (this.checkForFiringShot()) {
            this.spinUp();
            let superStrafe = () => { super.strafe(e); };
            this.mgfiring = setTimeout(function () {
                Minigun.spinUpCheck = true;
                superStrafe();
            }, 1000);
        }
    }
    clearFiringIntervals() {
        super.clearFiringIntervals();
        clearInterval(this.mgfiring);
        clearInterval(this.mgspinning);
    }
    stopstrafe() {
        super.stopstrafe();
        Minigun.spinUpCheck = false;
        this.randomMinigunFrame();
    }
    playFiringSound(on) {
        super.playFiringSound(on);
        if (on)
            SSamRotate.stop();
    }
    randomMinigunFrame() {
        // The minigun sometimes ends on the off-spin!
        let randNum = Math.floor(Math.random() * (2 - 1 + 1) + 1);
        if (randNum == 1) {
            elements.weaponImg.setAttribute("src", this.gunImage);
        }
        else
            elements.weaponImg.setAttribute("src", pics.guns.minigun_frame2);
    }
}
Minigun.spinUpCheck = false;
class DukeMgun extends MachineGun {
    constructor() {
        super(...arguments);
        this.gunImage = pics.guns.dukeMgun;
        this.gunImage_firing = pics.guns.firing.dukeMgun;
        this.ammoIcon = pics.ammoIcons.bullets;
        this.damage = gunConfig.DukeMgun.damage;
        this.ammo = gunConfig.DukeMgun.startingAmmo;
        this.firingSound = MGun;
        this.pickupStats = new pickupStats(pics.pickups.DukeMgun, gunConfig.DukeMgun.pickup_ammo_big, gunConfig.DukeMgun.pickup_ammo_small, pics.pickups.bullets.box_chain, pics.pickups.bullets.scattered_b);
    }
    strafe(e) {
        if (this.checkForFiringShot()) {
            this.loseAmmo();
            super.strafe(e);
        }
    }
}
class DualNeutron extends MachineGun {
    constructor() {
        super(...arguments);
        this.scrnMargin = 80;
        this.gunImage = pics.guns.dualNeutron;
        this.gunImage_firing = pics.guns.firing.dualNeutron;
        this.ammoIcon = pics.ammoIcons.bullet;
        this.damage = gunConfig.DualNeutron.damage;
        this.ammo = gunConfig.DualNeutron.startingAmmo;
        this.firingSound = SSamMinigun;
        this.pickupStats = new pickupStats(pics.pickups.DualNeutron, gunConfig.DualNeutron.pickup_ammo_big, gunConfig.DualNeutron.pickup_ammo_small, pics.pickups.cells.big, pics.pickups.cells.small);
    }
    strafe(e) {
        if (this.checkForFiringShot()) {
            this.loseAmmo();
            super.strafe(e);
        }
    }
}
function setMouseAttributes_Normal() {
    document.body.setAttribute("onmousedown", "Player.weapon.shot(event)");
    document.body.removeAttribute("onmouseup");
    document.body.setAttribute("onmousemove", gunMoveEvent);
}
function setMouseAttributes_MachineGun() {
    document.body.setAttribute("onmousedown", "Player.weapon.strafe(event)");
    document.body.setAttribute("onmouseup", "Player.weapon.stopstrafe()");
    document.body.setAttribute("onmousemove", gunMoveEvent);
}
function setMouseAttributes_NoShot() {
    document.body.removeAttribute("onmousedown");
    document.body.removeAttribute("onmouseup");
    document.body.setAttribute("onmousemove", gunMoveEvent);
}
