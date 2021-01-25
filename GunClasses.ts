const gunMoveEvent: string = "Player.weapon.gunLower(event);";
const MgunShotEvent: string = "Player.weapon.MGunShotDisplay(event);"

const gunConfig = {
    Pistol: {
        pickup_ammo_small: 6,
        startingAmmo : 12,
        damage : 20,
        gunHeight: 284,
    },
    Shotgun: {
        pickup_ammo_small: 4,
        pickup_ammo_big: 8,
        startingAmmo : 8,
        damage : 40,
        gunHeight: 210,
    },
    DukeMgun: {
        pickup_ammo_small: 18,
        pickup_ammo_big: 40,
        startingAmmo : 40,
        damage : 10,
        gunHeight: 343,
    },
    Minigun: {
        pickup_ammo_small: 25,
        pickup_ammo_big: 50,
        startingAmmo : 50,
        damage : 20,
        gunHeight: 487,
    },
    DualNeutron: {
        pickup_ammo_small: 15,
        pickup_ammo_big: 30,
        startingAmmo : 36,
        damage : 15,
        gunHeight: 406,
    },
    ChainSaw: {
        damage : 10,
        reach: 240,
        gunHeight: 312,
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
class MousePosition {
    public static x:number
    public static y:number
}

//WEAPON
abstract class weaponry {
    public scrnMargin: number = 0;
    public gunHeight: number;
    public static gunDefaultY
    public static switching: boolean = false;
    public reloading: boolean = false;
    public ammo: number;
    public firing: boolean;
    protected gunImage: string;
    public firingImage: string;
    public startingAmmo: number;
    public damage: number;
    public pickupStats: pickupStats;

    // sliding gun switch
    public switchTo(){
        if (weaponry.switching == false){ //avoid bobs for multiple weapon pickup
            weaponry.switching = true;
            setTimeout(() => { weaponry.switching = false }, 150);
            this.weaponBob();
        }
        Player.weapon = this;
        setTimeout(() => {
            elements.weaponImg.setAttribute("src", this.gunImage);
        }, 150); 
        DOMUpdater.updateAmmoCounter(this.ammo);
        if (!(this instanceof ChainSaw)){
            SawIdle.stop();
        }
    };
    public weaponBob(){
        $(elements.weaponDiv).animate({top:'150%'}, 150); 

        let gunTop = this.calculateGunTop(MousePosition.y, true)

        $(elements.weaponDiv).animate({top: gunTop }, 150); 
    }

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
       // if (this.reloading){ return }
        let mouseX = MousePosition.x = e.pageX;
        let mouseY = MousePosition.y = e.pageY;
        this.calculateAndSetGunPosition(mouseX, mouseY);
    }
    public calculateAndSetGunPosition(x, y){
        let xOffset = 7;
        let gunLeft = x - elements.weaponImg.width / 2 - xOffset + "px";
        let gunTop = this.calculateGunTop(y);
        this.setGunPosition(gunLeft, gunTop);
    }
    protected calculateGunTop(y, bob?) {
        let screenHeight: number = window.innerHeight; //screen.height;
        // Lowers the weapon when the mouse passes the gun height!
        let gunTop;
        let gunHeight = bob ? gunConfig[this.constructor.name].gunHeight : elements.weaponImg.height;
      //  let gunHeight = this.gunHeight;
        let scrnMargin = this.scrnMargin;
        let baseGunPosition = screenHeight - gunHeight
        if (y < baseGunPosition + scrnMargin - 5 || this.reloading) {    // 
            gunTop = baseGunPosition + "px";
        }
        else {                                  
            //gunTop = y + 10  + "px"
            gunTop = y + 10 - scrnMargin + "px"
        }
        return gunTop;
    }
    protected setGunPosition(x, y){
        this.setGunPosOnePlane("left", x);
        this.setGunPosOnePlane("top", y);
    }
    protected setGunPosOnePlane(prop, num){
        elements.weaponDiv.style[prop] = num;
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
    protected reload(){}
    protected setFiringImage(){}

    public shot(e) {
        if (this.pickupShot()) return;
        if (this.ammo <= 0) {
             click2.play(); 
             return; 
            }
        else {
            return this.fireAndAssessTarget();
        }
    }
    protected fireAndAssessTarget() {
        this.shotRelease();
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
    protected shotRelease(){
        this.ammo--;
        DOMUpdater.updateAmmoCounter(this.ammo)
        this.firingSound.play();
        this.setFiringImage();
        setTimeout(() => {
            this.reload(); // only shotgun?
        }, 200);          
    }
}

class Pistol extends regGun {
    public firingImage = pics.guns.firing.pistol;
    protected firingSound = Pshot;
    protected gunImage = pics.guns.pistol;
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
    protected reload(){
        setTimeout(() => {
            elements.weaponImg.src = pics.guns.pistol;
      //      this.calculateAndSetGunPosition(MousePosition.x, MousePosition.y);
        }, 50);
    }
    protected setFiringImage(){
        elements.weaponImg.src = pics.guns.firing.pistol;
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
        if (this.reloading) return;
        if (super.shot(e) === false){
            weaponry.showShot(e);
        }
        return true
    }
    protected setFiringImage(){
        elements.weaponImg.src = pics.guns.firing.shotgun;
    }
    protected reload(){
        this.reloading = true;
        elements.weaponImg.src = pics.guns.reloading.shotgun;
        this.calculateAndSetGunPosition(MousePosition.x, MousePosition.y);
        setTimeout(() => {
            elements.weaponImg.src = pics.guns.shotgun;
            this.reloading = false;
            this.calculateAndSetGunPosition(MousePosition.x, MousePosition.y);
        }, 1000);
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
        this.calculateAndSetGunPosition(MousePosition.x, MousePosition.y);
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
    protected gunImage_firing = pics.guns.firing.dukeMgun;
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
    public switchTo() {
        super.switchTo();
        elements.ammoType.setAttribute("src", pics.ammoIcons.bullets);
        setMouseAttributes_MachineGun()
    }
}

class DualNeutron extends MachineGun {
    public scrnMargin = 80;
    protected gunImage = pics.guns.dualNeutron;
    protected gunImage_firing = pics.guns.firing.dualNeutron;
    public damage = gunConfig.DualNeutron.damage;
    public ammo = gunConfig.DualNeutron.startingAmmo;
    protected firingSound = SSamMinigun;
    public pickupStats: pickupStats = 
    new pickupStats(
        pics.pickups.DukeMgun, 
        gunConfig.DualNeutron.pickup_ammo_big,
        gunConfig.DualNeutron.pickup_ammo_small,
        pics.pickups.bullets.big,
        pics.pickups.bullets.small
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

