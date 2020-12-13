const gunMoveEvent: string = "Player.weapon.gunMove(event);";
const MgunShotEvent: string = "Player.weapon.MGunShotDisplay(event);"

//WEAPON
abstract class weaponry {
    public static w: number = 2 //Sets weapon to pistol at the start
    public static scrnMargin: number;
    public static gunHeight: number;
    public static gunDefaultY
    public static cX
    public static cY;
    public ammo: number;
    protected gunImage;

    // Moves the chosen weapon to the mouse location, and keeps it at the base of the screen
    public abstract gunMove(e);
    // sliding gun switch
    public switchTo(){
        $(elements.weaponDiv).animate({top:'150%'}, 150); 
        $(elements.weaponDiv).animate({top:'90%'}, 150); 
        elements.weaponDiv.style.top = `${window.outerHeight - weaponry.scrnMargin}px`; //screen.height
        elements.weaponImg.setAttribute("src", this.gunImage);
    };
    public static showBlood(e) {
        this.displayScreenElement(e, elements.blood, 10, 10, 100);
        elements.blood.setAttribute("src", pics.blood + "?a=" + Math.random()); // FIX?
    }
    public static showShot(e) {
        this.displayScreenElement(e, elements.oneshot, 50, 50, 10);
    }
    private static displayScreenElement(e, elem, xOffset, yOffset, duration) {
        var x = e.pageX;
        var y = e.pageY;
        showElement(elem);
        elem.style.left = `${x - xOffset}px`;
        elem.style.top = `${y - yOffset}px`;

        setTimeout(() => hideElement(elem), duration);
    }
    public static gunLower(e) {
        var Screen: number = window.outerHeight;//screen.height;
        var x = e.pageX;
        var y = e.pageY;
        weaponry.cX = `${x - 44}px`;
// Lowers the weapon when the mouse passes the gun height!
  /*cY*/if (y > (Screen - weaponry.gunHeight)) { weaponry.cY = `${y + 110}px` } 
        else weaponry.cY = `${Screen - weaponry.scrnMargin}px`;
        elements.weaponDiv.style.left = weaponry.cX;
        elements.weaponDiv.style.top = weaponry.cY;
    }
    protected ricochet(sounds) {
        let length = sounds.length;
        let randNum = Math.floor(Math.random() * (length) + 1);
        sounds[randNum - 1].play()
    }
}

abstract class regGun extends weaponry {
    protected firingSound;
    public ricochet() {
        let regGunSounds = new Array(Bullet1, Bullet2, Bullet3);
        super.ricochet(regGunSounds);
    }

    public shot(e) {
        if (this.ammo <= 0) { click2.play(); return false; }
        else {
            this.ammo--;
            DOMUpdater.updateAmmoCounter(this.ammo)
            this.firingSound.play();
            if (targeting == false) {
                this.ricochet();
                return false;
            }
            else {
                hitTarget.loseHealth();
                return true;
            }
        }
    }
}

class Pistol extends regGun {
    protected firingSound = Pshot;
    protected gunImage = pics.guns.pistol;
    public gunMove(e) {
        weaponry.scrnMargin = 280;
        weaponry.gunHeight = 390;
        weaponry.gunLower(e)
    }
    public shot(e) {
        if (super.shot(e)) {
            weaponry.showBlood(e)
            return true
        }
    }

    public switchTo() {
        setTimeout(()=>Player.weapon = pistol,150) 
        super.switchTo();
        weaponry.w = 2;
        weaponry.scrnMargin = 280;
        DOMUpdater.updateAmmoCounter(this.ammo);
        elements.ammoType.setAttribute("src", pics.ammo.bullet);
        setMouseAttributes_Normal();
    }
}

class Shotgun extends regGun {
    protected firingSound = SGshot;
    protected gunImage = pics.guns.shotgun;
    public gunMove(e) {
        weaponry.scrnMargin = 230;
        weaponry.gunHeight = 350;
        weaponry.gunLower(e)
    }
    public shot(e) {
        super.shot(e);
        weaponry.showShot(e)
        return true
    }

    public switchTo() {
        setTimeout(()=>Player.weapon = shotgun,150) 
        super.switchTo();
        weaponry.w = 3;
        weaponry.scrnMargin = 230;
        DOMUpdater.updateAmmoCounter(this.ammo);
        elements.ammoType.setAttribute("src", pics.ammo.shell);
        setMouseAttributes_Normal()
    }
}

abstract class MachineGun extends weaponry {
    public static mghit;
    public static spendingBullets;
    protected gunImage;
    protected firingSound;
    protected gunImage_firing;
    public strafe() {
        document.addEventListener('mouseleave', e => { //avoid getting stuck on strafe mode
            this.stopstrafe()
        });
        elements.weaponImg.setAttribute("src", this.gunImage_firing);
        this.firingSound.play()
        document.body.setAttribute("onmousemove", gunMoveEvent)
        let _this = this;
        MachineGun.spendingBullets = setInterval(function () {
            _this.ammo--;
            DOMUpdater.updateAmmoCounter(_this.ammo);
            if (_this.ammo <= 0) { _this.stopstrafe(); click2.play() }
        }, 200);
    }
    public stopstrafe(){
        clearInterval(MachineGun.mghit);
        clearInterval(MachineGun.spendingBullets);
        elements.weaponImg.setAttribute("src", this.gunImage);
        this.firingSound.stop();
        document.body.setAttribute("onmousemove", gunMoveEvent)
    }

    public MGunShotDisplay(e) {
        if (targeting == false) {
            this.ricochet()
        }
        else /*Bullet4.play()*/;
        weaponry.showShot(e);
    }

    public ricochet() {
        let machineGunSounds = new Array(Bullet5, Bullet6, Bullet7, Bullet8);
        super.ricochet(machineGunSounds);
    }
}


class ChainSaw extends weaponry {
    private static chainsawReach = 240; // target height
    private firingSound = Saw;
    protected gunImage = pics.guns.chainsaw
    protected gunImage_firing = pics.guns.chainsaw_firing
    public gunMove(e) {
        if (weaponry.w == 1) { weaponry.scrnMargin = 305; weaponry.gunHeight = 415 }
        else if (weaponry.w == 1.1) { weaponry.scrnMargin = 210; weaponry.gunHeight = 220 }
        weaponry.gunLower(e)
    }
    public static chainsawDistanceCheck(hitImage) {
        if (hitImage.src.includes("ChainGuy")) { // change (can't chainsaw the boss)
            return true;
        }
        else if (hitImage.getBoundingClientRect().height > this.chainsawReach) {
            return true; // height/clientHeight/offsetHeight properties wont give real height
        }
        else return false;
    }

    public strafe() {
        if (targeting == true && ChainSaw.chainsawDistanceCheck(hitTarget.DOMImage)) {
            hitTarget.loseHealth()
            MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 200));
        }
        weaponry.w = 1.1;
        weaponry.scrnMargin = 210;
        elements.weaponImg.setAttribute("src", this.gunImage_firing);
        this.firingSound.play()
        elements.weaponDiv.style.left = weaponry.cX;
        elements.weaponDiv.style.top = weaponry.cY;
    }
    public stopstrafe() {
        clearInterval(MachineGun.mghit);
        elements.weaponImg.setAttribute("src", this.gunImage);
        this.firingSound.stop()
        document.body.setAttribute("onmousemove", gunMoveEvent)
        weaponry.w = 1;
    }
    public switchTo() {
        setTimeout(()=>Player.weapon = chainsaw,150) 
        super.switchTo();
        weaponry.w = 1;
        weaponry.scrnMargin = 305;
        DOMUpdater.updateAmmoCounter(`N/A`);
        elements.ammoType.removeAttribute("src");
        SawUp.play()
        setMouseAttributes_MachineGun();
    }
}

class Minigun extends MachineGun {
    public spinUpCheck: boolean = false
    private mgfiring;
    private mgspinning;
    protected gunImage = pics.guns.chaingun;
    protected gunImage_firing = pics.guns.chaingun_firing;
    protected firingSound = Avpminigun;
    public gunMove(e) {
        if (weaponry.w == 4) { weaponry.scrnMargin = 370; weaponry.gunHeight = 480 }
        weaponry.gunLower(e)
    }
    public spinUp() {
        elements.weaponImg.setAttribute("src", pics.guns.chaingun_spinup);
        SSamRotate2.play();
        this.mgspinning = setTimeout(function () {
            SSamRotate.play();
        }, 700);
    }
    public strafe() {
        if (this.ammo <= 0) { click2.play(); }
        else {
            var thisGun = this;
            this.spinUp();
            let superFire = () => { super.strafe(); }
            this.mgfiring = setTimeout(function () {
                thisGun.spinUpCheck = true;
                weaponry.w = 4.1;

                superFire();

                if (targeting == true) {
                    MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 200));
                }
            }, 1000);
        }
    }

    public stopstrafe() {
        clearInterval(MachineGun.mghit);
        clearInterval(MachineGun.spendingBullets);
        clearInterval(this.mgfiring);
        clearInterval(this.mgspinning);
        minigun.spinUpCheck = false;
        weaponry.w = 4;
        // The minigun sometimes ends on the off-spin!
        let randNum = Math.floor(Math.random() * (2 - 1 + 1) + 1);
        if (randNum == 1) {
            elements.weaponImg.setAttribute("src", this.gunImage);
        }
        else elements.weaponImg.setAttribute("src", pics.guns.chaingun_frame2);
        // SSamMinigun.stop();
        // SSamMinigun2.stop();
        this.firingSound.stop();
        SSamRotate.stop();
        document.body.setAttribute("onmousemove", gunMoveEvent)
    }
    public switchTo() {
        setTimeout(()=>Player.weapon = minigun,150) 
        super.switchTo();
        weaponry.w = 4;
        weaponry.scrnMargin = 370;
        DOMUpdater.updateAmmoCounter(this.ammo);
        elements.ammoType.setAttribute("src", pics.ammo.bullets);
        setMouseAttributes_MachineGun();
    }
}

class DukeMgun extends MachineGun {
    protected gunImage = pics.guns.dukeMgun;
    protected gunImage_firing = pics.guns.dukeMgun_firing;
    protected firingSound = MGun;
    public gunMove(e) {
        if (weaponry.w == 6) { weaponry.scrnMargin = 280; weaponry.gunHeight = 390 }
        else if (weaponry.w == 6.1) { weaponry.scrnMargin = 280; weaponry.gunHeight = 390 }
        weaponry.gunLower(e)
    }
    public strafe() {
        if (this.ammo <= 0) { click2.play(); }
        else {
            var thisGun = this;
            thisGun.ammo--;
            DOMUpdater.updateAmmoCounter(thisGun.ammo);
            weaponry.w = 6.1;

            super.strafe();

            if (targeting == true) {
                hitTarget.loseHealth()
                MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 200));
            }
        }
    }
    public stopstrafe() {
        super.stopstrafe();
        weaponry.w = 6;
    }
    public switchTo() {
        setTimeout(()=>Player.weapon = dukemgun,150) 
        super.switchTo();
        weaponry.w = 6;
        weaponry.scrnMargin = 250;
        DOMUpdater.updateAmmoCounter(this.ammo);
        elements.ammoType.setAttribute("src", pics.ammo.bullets);
        setMouseAttributes_MachineGun()
    }
}
class DuelNeutron extends MachineGun {
    protected gunImage = pics.guns.dualNuetron;
    protected gunImage_firing = pics.guns.dualNuetron_firing;
    protected firingSound = SSamMinigun;
    public gunMove(e) {
        if (weaponry.w == 7) { weaponry.scrnMargin = 250; weaponry.gunHeight = 360 }
        else if (weaponry.w == 7.1) { weaponry.scrnMargin = 300; weaponry.gunHeight = 390 }
        weaponry.gunLower(e)
    }
    public strafe() {
        super.strafe();
        if (this.ammo <= 0) { click2.play(); }
        else {
            var thisGun = this;
            thisGun.ammo--;
            DOMUpdater.updateAmmoCounter(thisGun.ammo);
            weaponry.w = 7.1;

            super.strafe();

            if (targeting == true) {
                hitTarget.loseHealth()
                MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 200));
            }
        }
    }

    public stopstrafe() {
        super.stopstrafe();
        weaponry.w = 7;
    }
    public switchTo() {
        setTimeout(()=>Player.weapon = duelneutron,150) 
        super.switchTo();
        weaponry.w = 7;
        weaponry.scrnMargin = 250;
        DOMUpdater.updateAmmoCounter(this.ammo);
        elements.ammoType.setAttribute("src", pics.ammo.bullet);
        setMouseAttributes_MachineGun()
    }
}

function setMouseAttributes_Normal() {
    document.body.setAttribute("onmousedown", "Player.weapon.shot(event)")
    document.body.removeAttribute("onmouseup");
    document.body.setAttribute("onmousemove", gunMoveEvent)
}
function setMouseAttributes_MachineGun() {
    document.body.setAttribute("onmousedown", "Player.weapon.strafe()");
    document.body.setAttribute("onmouseup", "Player.weapon.stopstrafe()");
    document.body.setAttribute("onmousemove", gunMoveEvent);
}

// new instance of each weapon. Move?
let chainsaw = new ChainSaw;
let pistol = new Pistol;
let shotgun = new Shotgun;
let minigun = new Minigun;
let dukemgun = new DukeMgun;
let duelneutron = new DuelNeutron;

// startingAmmo()
pistol.ammo = 0;
shotgun.ammo = 0;
minigun.ammo = 0;
dukemgun.ammo = 0;
duelneutron.ammo = 0;