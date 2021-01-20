const gunMoveEvent: string = "Player.weapon.gunLower(event);";
const MgunShotEvent: string = "Player.weapon.MGunShotDisplay(event);"

const gunConfig = {
    Pistol: {
        pickup_ammo_small: 6,
        startingAmmo : 12,
        damage : 20,
        scrnMargin: 280,
        gunHeight: 390,
    },
    Shotgun: {
        pickup_ammo_small: 4,
        pickup_ammo_big: 8,
        startingAmmo : 8,
        damage : 30,
        scrnMargin : 230,
        gunHeight : 350,
    },
    DukeMgun: {
        pickup_ammo_small: 18,
        pickup_ammo_big: 40,
        startingAmmo : 40,
        damage : 10,
        scrnMargin : 280,
        gunHeight : 390,
    },
    Minigun: {
        pickup_ammo_small: 25,
        pickup_ammo_big: 50,
        startingAmmo : 50,
        damage : 20,
        scrnMargin : 370,
        gunHeight : 480,
    },
    DualNuetron: {
        pickup_ammo_small: 15,
        pickup_ammo_big: 30,
        startingAmmo : 36,
        damage : 15,
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
    }
}
class pickupStats {
    public gunImage: string;
    public ammoAmmounts: object;
    public ammoImages: object;
    constructor(gunImage, bigAmmount, smallAmmount, bigImage, smallImage){
        this.gunImage = gunImage;
        this.ammoAmmounts = {
            big: bigAmmount,
            small: smallAmmount
        }
        this.ammoImages = {
            big: bigImage,
            small: smallImage
        }
    }
}

//WEAPON
abstract class weaponry {
    public scrnMargin: number;
    public gunHeight: number;
    public static gunDefaultY
    public static cX
    public static cY;
    public static switching: boolean = false;
    public ammo: number;
    public firing: boolean;
    protected gunImage: string;
    public startingAmmo: number;
    public damage: number;
    public pickupStats: pickupStats;

    // sliding gun switch
    public switchTo(){
        if (weaponry.switching == false){ //avoid bobs for multiple weapon pickup
            weaponry.switching = true;
            setTimeout(() => { weaponry.switching = false }, 150);
            $(elements.weaponDiv).animate({top:'150%'}, 150); 
            $(elements.weaponDiv).animate({top:'90%'}, 150); 
        }
        elements.weaponImg.setAttribute("src", this.gunImage);
        Player.weapon = this;
        DOMUpdater.updateAmmoCounter(this.ammo);
        if (!(this instanceof ChainSaw)){
            SawIdle.stop();
        }
    };
    
    // public static gunTobaseOfScreen(){
    //     this.
    //     elements.weaponDiv.style.top = `${window.outerHeight - this.scrnMargin}px`; 
    // }

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
    // Moves weapon to the mouse location, and keeps it at the base of the screen
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
        RandomSoundGen.playRandomSound(sounds);
    }
    protected pickupShot(){
        if (GameInfo.targeting == false && GameInfo.hitTarget instanceof Pickup){ return true }
    }
}

abstract class regGun extends weaponry {
    protected firingSound;
    public ricochet() {
        let regGunSounds = new Array(Bullet1, Bullet2, Bullet3);
        super.ricochet(regGunSounds);
    }

    public shot(e) {
        if (this.pickupShot()) return;
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
                if (!(GameInfo.hitTarget instanceof Item)){
                    return true;
                }
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
    public ammo = gunConfig.Pistol.startingAmmo;
    public pickupStats: pickupStats = 
    new pickupStats(
        pics.pickups.Pistol, 
        gunConfig.Pistol.pickup_ammo_small,
        gunConfig.Pistol.pickup_ammo_small,
        pics.pickups.bullets.small,
        pics.pickups.bullets.small
        );
    
    public shot(e) {
        if (super.shot(e)) {
            weaponry.showBlood(e)
            return true
        }
    }

    public switchTo() {
        super.switchTo();
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
    public ammo = gunConfig.Shotgun.startingAmmo;
    public pickupStats: pickupStats = 
    new pickupStats(
        pics.pickups.Shotgun, 
        gunConfig.Shotgun.pickup_ammo_big,
        gunConfig.Shotgun.pickup_ammo_small,
        pics.pickups.shells.big,
        pics.pickups.shells.small
        );

    public shot(e) {
        super.shot(e);
        weaponry.showShot(e)
        return true
    }

    public switchTo() {
        super.switchTo();
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
            if (this.firing){
                this.stopstrafe()
            }
        });
        document.body.setAttribute("onmousemove", gunMoveEvent)
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
    private chainsawReach = gunConfig.ChainSaw.reach; // target height
    protected firingSound = Saw;
    protected gunImage = pics.guns.chainsaw
    protected gunImage_firing = pics.guns.chainsaw_firing
    public gunHeight = gunConfig.ChainSaw.gunHeight;
    public scrnMargin = gunConfig.ChainSaw.scrnMargin;
    public damage = gunConfig.ChainSaw.damage;
    public pickupStats: pickupStats =   new pickupStats( pics.pickups.ChainSaw, "","","","");

    private chainsawDistanceCheck(hitImage) {
        if (hitImage.getBoundingClientRect().height > this.chainsawReach) {
            return true; // height/clientHeight/offsetHeight properties wont give real height
        }
        else return false;
    }

    private chainsawHitCheck(){
        return (GameInfo.targeting == true && this.chainsawDistanceCheck(GameInfo.hitTarget.DOMImage));
    }

    public strafe() {
        if (this.pickupShot()) return;

        document.addEventListener('mouseleave', e => { //avoid getting stuck on strafe mode
            if (this.firing){
                this.stopstrafe()
            }
        });

        this.firing = true;
        this.gunHeight = gunConfig.ChainSaw.firing.gunHeight
        this.scrnMargin = gunConfig.ChainSaw.firing.scrnMargin
        if (this.chainsawHitCheck()) {
            GameInfo.hitTarget.loseHealth(this.damage)
        }
        let _this = this;
        MachineGun.hittingInterval = (setInterval(()=> { 
            if (this.chainsawHitCheck())
            GameInfo.hitTarget.loseHealth(_this.damage); 
        }, 200));
        this.switchSounds();
        elements.weaponImg.setAttribute("src", this.gunImage_firing);
        elements.weaponDiv.style.left = weaponry.cX;
        elements.weaponDiv.style.top = weaponry.cY;
    }
    public switchSounds(){
        if (this.firing){
            SawIdle.stop();
            this.firingSound.play()
        }
        else{
            SawIdle.play();
            this.firingSound.stop()
        }
    }

    public stopstrafe() {
        this.gunHeight = gunConfig.ChainSaw.gunHeight
        this.scrnMargin = gunConfig.ChainSaw.scrnMargin
        clearInterval(MachineGun.hittingInterval);
        elements.weaponImg.setAttribute("src", this.gunImage);
        this.firing = false;
        this.switchSounds();
        document.body.setAttribute("onmousemove", gunMoveEvent)
    }
    public switchTo() {
        super.switchTo();
        DOMUpdater.updateAmmoCounter(`N/A`);
        elements.ammoType.removeAttribute("src");
        SawUp.play();
        let _this = this;
        setTimeout(()=>{
            if (Player.weapon == _this){
                _this.switchSounds();
            }
        },2000)
        setMouseAttributes_MachineGun();
    }
}

class Minigun extends MachineGun {
    static spinUpCheck: boolean = false
    private mgfiring;
    private mgspinning;
    protected gunImage = pics.guns.minigun;
    protected gunImage_firing = pics.guns.minigun_firing;
    public gunHeight = gunConfig.Minigun.gunHeight;
    public scrnMargin = gunConfig.Minigun.scrnMargin;
    public damage = gunConfig.Minigun.damage;
    public ammo = gunConfig.Minigun.startingAmmo;
    protected firingSound = Avpminigun;
    public pickupStats: pickupStats = 
    new pickupStats(
        pics.pickups.Minigun, 
        gunConfig.Minigun.pickup_ammo_big,
        gunConfig.Minigun.pickup_ammo_big,
        pics.pickups.bullets.big,
        pics.pickups.bullets.big // FIX? need small chaingun pickup
        );

 
    public spinUp() {
        elements.weaponImg.setAttribute("src", pics.guns.minigun_spinup);
        SSamRotate2.play();
        this.mgspinning = setTimeout(function () {
            SSamRotate.play();
        }, 700);
    }
    public strafe() {
        if (this.pickupShot()) return;
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
        else elements.weaponImg.setAttribute("src", pics.guns.minigun_frame2);
        // SSamMinigun.stop();
        // SSamMinigun2.stop();
        this.firingSound.stop();
        SSamRotate.stop();
        document.body.setAttribute("onmousemove", gunMoveEvent)
    }
    public switchTo() {
        super.switchTo();
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
    public ammo = gunConfig.DukeMgun.startingAmmo;
    protected firingSound = MGun;
    public pickupStats: pickupStats = 
    new pickupStats(
        pics.pickups.DukeMgun, 
        gunConfig.DukeMgun.pickup_ammo_big,
        gunConfig.DukeMgun.pickup_ammo_big,
        pics.pickups.bullets.big,
        pics.pickups.bullets.big // FIX? need small bullets pickup
        );
    
    public strafe() {
        if (this.pickupShot()) return;
        if (this.ammo <= 0) { click2.play(); }
        else {
            this.ammo--;
            DOMUpdater.updateAmmoCounter(this.ammo);
            super.strafe();
        }
    }
    public stopstrafe() {
        super.stopstrafe();
    }
    public switchTo() {
        super.switchTo();
        elements.ammoType.setAttribute("src", pics.ammoIcons.bullets);
        setMouseAttributes_MachineGun()
    }
}

class DualNeutron extends MachineGun {
    protected gunImage = pics.guns.dualNuetron;
    protected gunImage_firing = pics.guns.dualNuetron_firing;
    public gunHeight = gunConfig.DualNuetron.gunHeight;
    public scrnMargin = gunConfig.DualNuetron.scrnMargin;
    public damage = gunConfig.DualNuetron.damage;
    public ammo = gunConfig.DualNuetron.startingAmmo;
    protected firingSound = SSamMinigun;
    public pickupStats: pickupStats = 
    new pickupStats(
        pics.pickups.DukeMgun, 
        gunConfig.DualNuetron.pickup_ammo_big,
        gunConfig.DualNuetron.pickup_ammo_small,
        pics.pickups.bullets.big,
        pics.pickups.bullets.small
        );

    public strafe() {
        if (this.pickupShot()) return;
        this.gunHeight = gunConfig.DualNuetron.firing.gunHeight
        this.scrnMargin = gunConfig.DualNuetron.firing.scrnMargin
        if (this.ammo <= 0) { click2.play(); }
        else {
            this.ammo--;
            DOMUpdater.updateAmmoCounter(this.ammo);
            super.strafe();
        }
    }

    public stopstrafe() {
        this.gunHeight = gunConfig.DualNuetron.gunHeight
        this.scrnMargin = gunConfig.DualNuetron.scrnMargin
        super.stopstrafe();
    }
    public switchTo() {
        super.switchTo();
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

