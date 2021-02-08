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
        startingAmmo: null,
        damage : 10,
        reach: 240,
        gunHeight: 312,
    },
    Pipebomb: {
        pickup_ammo_small: 1,
        pickup_ammo_big: 1,
        startingAmmo : 1,
        // damage : 15,
        gunHeight: 406,
    },
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
    protected firingImage: string;
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
        DOMUpdater.updateAmmoCounter(this.ammo);
        if (Player.weapon instanceof MachineGun){
            Player.weapon.stopstrafe(); // Messy, attempt to prevent infinite strafing!
        }
        Player.weapon = this;
        setTimeout(() => {
            elements.weaponImg.setAttribute("src", this.gunImage);
        }, 150); 
        if (!(this instanceof ChainSaw)){ //FIX better way to cut the chainsaw noise?
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
    protected loseAmmo(){
        this.ammo--;
        DOMUpdater.updateAmmoCounter(this.ammo);
    }
    protected abstract noAmmoCheck()

    protected targetingChecks(){
        return GameInfo.targeting == true;
    }

    protected checkForFiringShot(){
        if (this.pickupShot()) return false;
        if (this.noAmmoCheck()) return false
        return true
    }
}

abstract class regGun extends weaponry {
    protected firingSound;
    public ricochet() {
        let regGunSounds = new Array(Bullet1, Bullet2, Bullet3);
        super.ricochet(regGunSounds);
    }
    protected abstract reload()
    protected setFiringImage(){
        elements.weaponImg.src = this.firingImage
    }
    
    protected playFiringSound(){
        this.firingSound.play();
    }

    protected noAmmoClick(){
        click2.play();
    }

    protected noAmmoCheck(){
        if (this.ammo <= 0) {
            this.noAmmoClick();
            return true; 
       }
    }

    public switchTo(){
        super.switchTo();
        setMouseAttributes_Normal();
    }

    public shot(e) {
        if (this.checkForFiringShot()){
            return this.fireAndAssessTarget(e);
        }
    }

    protected fireAndAssessTarget(e) {
        this.shotRelease();
        if (!this.targetingChecks()) {
            this.ricochet();
            return false;
        }
        else {
            return this.dealDamage(e);
        }
    }
    protected dealDamage(e) {
        GameInfo.hitTarget.loseHealth(this.damage);
        if (!(GameInfo.hitTarget instanceof Item)) { // for barrels, don't show blood
            return true;
        }
    }

    protected shotRelease(){
        this.loseAmmo();
        this.playFiringSound();
        this.setFiringImage();
        setTimeout(() => {
            this.reload(); // only shotgun?
        }, 200);          
    }
}

class Pistol extends regGun {
    protected firingImage = pics.guns.firing.pistol;
    protected firingSound = Pshot//pistolShots;
    protected gunImage = pics.guns.pistol;
    public damage = gunConfig.Pistol.damage;
    public ammo = gunConfig.Pistol.startingAmmo;
    public pickupStats: pickupStats = 
    new pickupStats(
        pics.pickups.Pistol, 
        gunConfig.Pistol.pickup_ammo_small,
        gunConfig.Pistol.pickup_ammo_small,
        pics.pickups.bullets.clip,
        pics.pickups.bullets.clip
        );
    
    public shot(e) {
        if (super.shot(e)) {
            weaponry.showBlood(e)
            return true
        }
    }

    protected playFiringSound(){
        this.firingSound.playClone();
       // this.soundGen.playNotSoRandomSound(this.firingSound)
    }

    protected reload(){
        setTimeout(() => {
            elements.weaponImg.src = pics.guns.pistol;
      //      this.calculateAndSetGunPosition(MousePosition.x, MousePosition.y);
        }, 50);
    }

    public switchTo() {
        super.switchTo();
        elements.ammoType.setAttribute("src", pics.ammoIcons.bullet);
    }
}

class Shotgun extends regGun {
    protected firingSound = SGshot;
    protected gunImage = pics.guns.shotgun;
    protected firingImage = pics.guns.firing.shotgun;
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
    }
}

class Pipebomb extends regGun {
    private gibRadius:number = 300;
    private blastRadius:number = 500;
    private areaAffect: AreaAffect = new AreaAffect(this.blastRadius, this.gibRadius);
    protected gunImage = pics.guns.pipebomb;
    protected firingImage = pics.guns.firing.Pipebomb;
    protected firingSound = explosion;
    public ammo = gunConfig.Pipebomb.startingAmmo;
    public pickupStats: pickupStats = 
    new pickupStats(
        pics.pickups.Pipebomb, 
        gunConfig.Pipebomb.pickup_ammo_big,
        gunConfig.Pipebomb.pickup_ammo_small,
        pics.pickups.Pipebomb,
        pics.pickups.Pipebomb // FIX? need small bullets pickup
        );

    public shot(e) {
        super.shot(e)

        return true;
    }
    protected targetingChecks(){
        return true;
    }
    protected dealDamage(e){
        let left = MousePosition.x;
        setTimeout(() => {
            this.bombExplode(left);
            weaponry.showShot(e);
        }, 1000);
        return true
    }

    protected bombExplode(left) {
     //   let left = MousePosition.x;
        this.areaAffect.killInBlastRadius(left);
    }

    public switchTo() {
        super.switchTo();
        elements.ammoType.setAttribute("src", pics.ammoIcons.pipe);
    }

    public reload(){
        setTimeout(() => {
            let img = pics.guns.pipebomb;
            img = this.ammo > 0 ? img : pics.guns.blank;
            elements.weaponImg.src = img;
        }, 1000);
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
        document.body.setAttribute("onmousemove", gunMoveEvent)
        this.addStrafeMouseLeaveEvent();
        this.firing = true;
        this.playFiringSound(true);
        this.spendingBullets();
        this.firstHit()
        this.hittingInterval();
    }

    protected noAmmoClick(){
        click2.play();
    }

    protected noAmmoCheck(){
        if (this.ammo <= 0) {
            this.stopstrafe();
            this.noAmmoClick();
            return true; 
       }
    }

    protected firstHit(){
        let _this = this;
        if (this.targetingChecks()) { 
            GameInfo.hitTarget.loseHealth(_this.damage);
        }
    }
    protected hittingInterval(){
        let _this = this;
        MachineGun.hittingInterval = (setInterval(function () { 
            if (_this.targetingChecks()) {
                GameInfo.hitTarget.loseHealth(_this.damage);
            }
         }, 200));
    }

    protected addStrafeMouseLeaveEvent(){
        document.addEventListener('mouseleave', e => { //avoid getting stuck on strafe mode
            if (this.firing){
                this.stopstrafe()
            }
        });
    }

    protected spendingBullets() {
        elements.weaponImg.setAttribute("src", this.gunImage_firing);
        let _this = this;
        MachineGun.firingInterval = setInterval(function () {
            _this.loseAmmo();
            _this.noAmmoCheck();
        }, 200);
    }

    protected clearFiringIntervals(){
        clearInterval(MachineGun.hittingInterval);
        clearInterval(MachineGun.firingInterval);
    }

    public stopstrafe() {
        this.firing = false;
        elements.weaponImg.setAttribute("src", this.gunImage);
        document.body.setAttribute("onmousemove", gunMoveEvent)
        this.clearFiringIntervals();
        this.playFiringSound(false);
    }
    public switchTo(){
        super.switchTo();
        setMouseAttributes_MachineGun();
    };

    protected playFiringSound(on){
        on ? this.firingSound.play() : this.firingSound.stop();
    }

    public MGunShotDisplay(e) {
        if (!this.targetingChecks()) {
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
    public ammo = gunConfig.ChainSaw.startingAmmo;
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
    protected targetingChecks(){
        if (super.targetingChecks()){
            if (this.chainsawDistanceCheck(GameInfo.hitTarget.DOMImage)){
                return true;
            }
        }
    }

    protected loseAmmo(){
        //DOMUpdater.updateAmmoCounter('N/A')
    }
    protected noAmmoCheck(){
        return false; // infinite chainsaw ammo?
    }
    protected spendingBullets(){};

    public strafe() {
        if (this.checkForFiringShot()){
            super.strafe();
            elements.weaponImg.setAttribute("src", this.gunImage_firing);
            this.calculateAndSetGunPosition(MousePosition.x, MousePosition.y);
        }
    }

    protected switchSounds(){
        if (this.firing){
            SawIdle.stop();
            this.firingSound.play()
        }
        else{
            SawIdle.play();
            this.firingSound.stop()
        }
    }

    public switchTo() {
        super.switchTo();
        elements.ammoType.removeAttribute("src");
        SawUp.play();
        let _this = this;
        setTimeout(()=>{
            if (Player.weapon == _this){
                _this.switchSounds();
            }
        },2000)
    }
}

class Minigun extends MachineGun {
    static spinUpCheck: boolean = false
    private mgfiring;
    private mgspinning;
    protected gunImage = pics.guns.minigun;
    protected gunImage_firing = pics.guns.minigun_firing;
    protected ammoIcon = pics.ammoIcons.bullets;
    public damage = gunConfig.Minigun.damage;
    public ammo = gunConfig.Minigun.startingAmmo;
    protected firingSound = Avpminigun;
    public pickupStats: pickupStats = 
    new pickupStats(
        pics.pickups.Minigun, 
        gunConfig.Minigun.pickup_ammo_big,
        gunConfig.Minigun.pickup_ammo_small,
        pics.pickups.bullets.box,
        pics.pickups.bullets.scattered
        );

    public spinUp() {
        elements.weaponImg.setAttribute("src", pics.guns.minigun_spinup);
        SSamRotate2.play();
        this.mgspinning = setTimeout(function () {
            SSamRotate.play();
        }, 700);
    }
    public strafe() {
        if (this.checkForFiringShot()){
            this.spinUp();
            let superStrafe = () => { super.strafe(); }
            this.mgfiring = setTimeout(function () {
                Minigun.spinUpCheck = true;
                superStrafe();
            }, 1000);
        }
    }
    protected clearFiringIntervals(){
        super.clearFiringIntervals();
        clearInterval(this.mgfiring);
        clearInterval(this.mgspinning);
    }

    public stopstrafe() {
        super.stopstrafe();
        Minigun.spinUpCheck = false;
        this.randomMinigunFrame();
    }
    protected playFiringSound(on){
        super.playFiringSound(on);
        if (on) SSamRotate.stop();
    }

    private randomMinigunFrame() {
        // The minigun sometimes ends on the off-spin!
        let randNum = Math.floor(Math.random() * (2 - 1 + 1) + 1);
        if (randNum == 1) {
            elements.weaponImg.setAttribute("src", this.gunImage);
        }
        else elements.weaponImg.setAttribute("src", pics.guns.minigun_frame2);
    }

    public switchTo() {
        super.switchTo();
        elements.ammoType.setAttribute("src", pics.ammoIcons.bullets);
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
        gunConfig.DukeMgun.pickup_ammo_small,
        pics.pickups.bullets.chain,
        pics.pickups.bullets.scattered_b
        );

    public strafe() {
        if (this.checkForFiringShot()){
            this.loseAmmo();
            super.strafe();
        }
    }
    public switchTo() {
        super.switchTo();
        elements.ammoType.setAttribute("src", pics.ammoIcons.bullets);
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
        pics.pickups.DualNeutron, 
        gunConfig.DualNeutron.pickup_ammo_big,
        gunConfig.DualNeutron.pickup_ammo_small,
        pics.pickups.cells,
        pics.pickups.cells
        );

    public strafe() {
        if (this.checkForFiringShot()){
            this.loseAmmo();
            super.strafe();
        }
    }

    public switchTo() {
        super.switchTo();
        elements.ammoType.setAttribute("src", pics.ammoIcons.bullet);
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

