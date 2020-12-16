const gunMoveEvent: string = "Player.weapon.gunMove(event);";
const MgunShotEvent: string = "Player.weapon.MGunShotDisplay(event);"

const gunConfig = {
    Pistol: {
        damage : 20,
        scrnMargin: 280,
        gunHeight: 390,
    },
    Shotgun: {
        damage : 30,
        scrnMargin : 230,
        gunHeight : 350,
    },
    DukeMgun: {
        damage : 10,
        scrnMargin : 280,
        gunHeight : 390,
    },
    Minigun: {
        damage : 15,
        scrnMargin : 370,
        gunHeight : 480,
    },
    DualNuetron: {
        damage : 10,
        scrnMargin : 250,
        gunHeight : 360,
        firing : {
            scrnMargin : 300,
            gunHeight : 390,
        }
    },
    ChainSaw: {
        damage : 10,
        reach: 240,
        scrnMargin: 280,
        gunHeight: 390,
        firing : {
            scrnMargin : 210,
            gunHeight : 220,
        }
    },
}

//WEAPON
abstract class weaponry {
    public static w: number = 2 //Sets weapon to pistol at the start
    public scrnMargin: number;
    public gunHeight: number;
    public static gunDefaultY
    public static cX
    public static cY;
    public ammo: number;
    public firing: boolean;
    protected gunImage: string;
    public damage: number;

    // Moves the chosen weapon to the mouse location, and keeps it at the base of the screen
    public abstract gunMove(e);
    // sliding gun switch
    public switchTo(){
        $(elements.weaponDiv).animate({top:'150%'}, 150); 
        $(elements.weaponDiv).animate({top:'90%'}, 150); 
        elements.weaponDiv.style.top = `${window.outerHeight - this.scrnMargin}px`; //screen.height
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
    public gunLower(e) {
        var Screen: number = window.outerHeight;//screen.height;
        var x = e.pageX;
        var y = e.pageY;
        weaponry.cX = `${x - 44}px`;
        // Lowers the weapon when the mouse passes the gun height!
        if (y > (Screen - this.gunHeight)) {    
            weaponry.cY = `${y + 110}px`
        }
        else {                                  
            weaponry.cY = `${Screen - this.scrnMargin}px`;
        }
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
    protected firingSound = Pshot;
    protected gunImage = pics.guns.pistol;
    public gunHeight = gunConfig.Pistol.gunHeight;
    public scrnMargin = gunConfig.Pistol.scrnMargin;
    public damage = gunConfig.Pistol.damage;
    public gunMove(e) {
        super.gunLower(e)
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

        DOMUpdater.updateAmmoCounter(this.ammo);
        elements.ammoType.setAttribute("src", pics.ammoIcons.bullet);
        setMouseAttributes_Normal();
    }
}

class Shotgun extends regGun {
    protected firingSound = SGshot;
    protected gunImage = pics.guns.shotgun;
    public gunHeight = gunConfig.Shotgun.gunHeight;
    public scrnMargin = gunConfig.Shotgun.scrnMargin;
    public damage = gunConfig.Shotgun.damage;
    public gunMove(e) {
        this.gunLower(e)
    }
    public shot(e) {
        super.shot(e);
        weaponry.showShot(e)
        return true
    }

    public switchTo() {
        setTimeout(()=>Player.weapon = shotgun,150) 
        super.switchTo();
        DOMUpdater.updateAmmoCounter(this.ammo);
        elements.ammoType.setAttribute("src", pics.ammoIcons.shell);
        setMouseAttributes_Normal()
    }
}

abstract class MachineGun extends weaponry {
    public static hittingInterval;
    public static firingInterval;
    protected gunImage;
    protected firingSound;
    protected gunImage_firing;
    public gunHeight;
    public scrnMargin;
    public firing: boolean
    public strafe() {
        document.addEventListener('mouseleave', e => { //avoid getting stuck on strafe mode
            this.stopstrafe()
        });
        document.body.setAttribute("onmousemove", gunMoveEvent)
        this.firing = true;

        this.spendingBullets();

        let _this = this;
        if (GameInfo.targeting == true) { GameInfo.hitTarget.loseHealth(_this.damage);}
        MachineGun.hittingInterval = (setInterval(function () { 
            if (GameInfo.targeting == true) {
                GameInfo.hitTarget.loseHealth(_this.damage);
            }
         }, 200));
    }

    protected spendingBullets() {
        elements.weaponImg.setAttribute("src", this.gunImage_firing);
        this.firingSound.play()
        let _this = this;
        MachineGun.firingInterval = setInterval(function () {
            _this.ammo--;
            DOMUpdater.updateAmmoCounter(_this.ammo);
            if (_this.ammo <= 0) { _this.stopstrafe(); click2.play() }
        }, 200);
    }

    public stopstrafe() {
        this.firing = false;
        this.firingSound.stop();
        elements.weaponImg.setAttribute("src", this.gunImage);
        document.body.setAttribute("onmousemove", gunMoveEvent)
        clearInterval(MachineGun.hittingInterval);
        clearInterval(MachineGun.firingInterval);
    }

    public MGunShotDisplay(e) {
        if (GameInfo.targeting == false) {
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


class ChainSaw extends MachineGun {
    private static chainsawReach = gunConfig.ChainSaw.reach; // target height
    protected firingSound = Saw;
    protected gunImage = pics.guns.chainsaw
    protected gunImage_firing = pics.guns.chainsaw_firing
    public gunHeight = gunConfig.ChainSaw.gunHeight;
    public scrnMargin = gunConfig.ChainSaw.scrnMargin;
    public damage = gunConfig.ChainSaw.damage;
    public gunMove(e) {
        this.gunLower(e)
    }
    public static chainsawDistanceCheck(hitImage) {
        if (hitImage.src.includes("ChainGuy")) { // change (can't chainsaw the boss?)
            return true;
        }
        else if (hitImage.getBoundingClientRect().height > this.chainsawReach) {
            return true; // height/clientHeight/offsetHeight properties wont give real height
        }
        else return false;
    }

    public strafe() {
        this.firing = true;
        this.gunHeight = gunConfig.ChainSaw.firing.gunHeight
        this.scrnMargin = gunConfig.ChainSaw.firing.scrnMargin
        if (GameInfo.targeting == true && ChainSaw.chainsawDistanceCheck(GameInfo.hitTarget.DOMImage)) {
            GameInfo.hitTarget.loseHealth(this.damage)
            let _this = this;
            MachineGun.hittingInterval = (setInterval(function () { GameInfo.hitTarget.loseHealth(_this.damage); }, 200));
        }
        elements.weaponImg.setAttribute("src", this.gunImage_firing);
        this.firingSound.play()
        elements.weaponDiv.style.left = weaponry.cX;
        elements.weaponDiv.style.top = weaponry.cY;
    }
    public stopstrafe() {
        this.gunHeight = gunConfig.ChainSaw.gunHeight
        this.scrnMargin = gunConfig.ChainSaw.scrnMargin
        clearInterval(MachineGun.hittingInterval);
        elements.weaponImg.setAttribute("src", this.gunImage);
        this.firingSound.stop()
        document.body.setAttribute("onmousemove", gunMoveEvent)
    }
    public switchTo() {
        setTimeout(()=>Player.weapon = chainsaw,150) 
        super.switchTo();

        DOMUpdater.updateAmmoCounter(`N/A`);
        elements.ammoType.removeAttribute("src");
        SawUp.play()
        setMouseAttributes_MachineGun();
    }
}

class Minigun extends MachineGun {
    static spinUpCheck: boolean = false
    private mgfiring;
    private mgspinning;
    protected gunImage = pics.guns.chaingun;
    protected gunImage_firing = pics.guns.chaingun_firing;
    public gunHeight = gunConfig.Minigun.gunHeight;
    public scrnMargin = gunConfig.Minigun.scrnMargin;
    public damage = gunConfig.Minigun.damage;
    protected firingSound = Avpminigun;
    public gunMove(e) {
        this.gunLower(e)
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
            this.spinUp();
            let superStrafe = () => { super.strafe(); }
            this.mgfiring = setTimeout(function () {
                Minigun.spinUpCheck = true;

                superStrafe();
            }, 1000);
        }
    }

    public stopstrafe() {
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

        DOMUpdater.updateAmmoCounter(this.ammo);
        elements.ammoType.setAttribute("src", pics.ammoIcons.bullets);
        setMouseAttributes_MachineGun();
    }
}

class DukeMgun extends MachineGun {
    protected gunImage = pics.guns.dukeMgun;
    protected gunImage_firing = pics.guns.dukeMgun_firing;
    public gunHeight = gunConfig.DukeMgun.gunHeight;
    public scrnMargin = gunConfig.DukeMgun.scrnMargin;
    public damage = gunConfig.DukeMgun.damage;
    protected firingSound = MGun;
    public gunMove(e) {
        this.gunLower(e)
    }
    public strafe() {
        if (this.ammo <= 0) { click2.play(); }
        else {
            var thisGun = this;
            thisGun.ammo--;
            DOMUpdater.updateAmmoCounter(thisGun.ammo);

            super.strafe();
        }
    }
    public stopstrafe() {
        super.stopstrafe();
    }
    public switchTo() {
        setTimeout(()=>Player.weapon = dukemgun,150) 
        super.switchTo();

        DOMUpdater.updateAmmoCounter(this.ammo);
        elements.ammoType.setAttribute("src", pics.ammoIcons.bullets);
        setMouseAttributes_MachineGun()
    }
}
class DuelNeutron extends MachineGun {
    protected gunImage = pics.guns.dualNuetron;
    protected gunImage_firing = pics.guns.dualNuetron_firing;
    public gunHeight = gunConfig.DualNuetron.gunHeight;
    public scrnMargin = gunConfig.DualNuetron.scrnMargin;
    public damage = gunConfig.DualNuetron.damage;
    protected firingSound = SSamMinigun;
    public gunMove(e) {
        this.gunLower(e)
    }
    public strafe() {
        this.gunHeight = gunConfig.DualNuetron.firing.gunHeight
        this.scrnMargin = gunConfig.DualNuetron.firing.scrnMargin
        if (this.ammo <= 0) { click2.play(); }
        else {
            var thisGun = this;
            thisGun.ammo--;
            DOMUpdater.updateAmmoCounter(thisGun.ammo);
            super.strafe();
        }
    }

    public stopstrafe() {
        this.gunHeight = gunConfig.DualNuetron.gunHeight
        this.scrnMargin = gunConfig.DualNuetron.scrnMargin
        super.stopstrafe();
    }
    public switchTo() {
        setTimeout(()=>Player.weapon = duelneutron,150) 
        super.switchTo();
        DOMUpdater.updateAmmoCounter(this.ammo);
        elements.ammoType.setAttribute("src", pics.ammoIcons.bullet);
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