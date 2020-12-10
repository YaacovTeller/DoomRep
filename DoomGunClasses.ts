const pics = {
    guns:{
        chainsaw: "Pics/Saw.png",
        chainsaw_firing: "Pics/ChainSaw.gif",
        pistol: "Pics/pistol_right.png",
        shotgun: "Pics/Ggun2.png",
        dukeMgun: "Pics/DukeMgun.png",
        dukeMgun_firing: "Pics/DukeMgunFire.gif",
        chaingun: "Pics/ChainGun150.png",
        chaingun_firing: "Pics/ChainGunFiring150_8.gif",
        chainsaw_spinup: "Pics/ChainGunSpin_Up_150_8.gif",
        chainsaw_frame2: "Pics/ChainGun150_Alt.png",
        dualNuetron: "Pics/DN.png",
        dualNuetron_firing: "Pics/DN110.gif",
    },
    ammo: {
        bullet: "Pics/Slug.png",
        bullets: "Pics/Bullets.png",
        shell: "Pics/Shell.png",
    },
    background: {
        doom4: "Pics/Doom4.png",
        doom6: "Pics/Doom4.png",
        wide: "Pics/WideBack.jpg",
        boss: "Pics/BossBack.jpg"
    },
    blood: "Pics/Blood_10.gif",
}

const gunMoveEvent: string = "PlayerWeapon.gunMove(event);";
const MgunShotEvent: string = "PlayerWeapon.MGunShotDisplay(event);"

//WEAPON
abstract class weaponry {
    public static w: number = 2 //Sets weapon to pistol at the start
    public static scrnMargin: number;
    public static gunHeight: number;
    public static gunDefaultY
    public static cX
    public static cY;
    public ammo: number

    // Moves the chosen weapon to the mouse location, and keeps it at the base of the screen
    public abstract gunMove(e);
    public abstract switchTo();
    public static showBlood(e) {
        var x = e.pageX;
        var y = e.pageY;
        let blood = elements.blood;
        showElement(blood)
        blood.style.left = `${x - 10}px`;
        blood.style.top = `${y - 10}px`;
        blood.setAttribute("src", pics.blood + "?a=" + Math.random());
        setTimeout(()=>hideElement(blood), 100)
    };
    public static gunLower(e) {
        var Screen: number = screen.height;
        var x = e.pageX;
        var y = e.pageY;
        weaponry.cX = `${x - 44}px`;
// Lowers the weapon when the mouse passes the gun height!
  /*cY*/if (y > (Screen - weaponry.gunHeight)) { weaponry.cY = `${y + 110}px` } else weaponry.cY = `${Screen - weaponry.scrnMargin}px`;
        elements.weaponDiv.style.left = weaponry.cX;
        elements.weaponDiv.style.top = weaponry.cY;
    }
    protected ricochet(sounds) {
        let length = sounds.length;
        let randNum = Math.floor(Math.random() * (length) + 1);
        sounds[randNum-1].play()
    }
}

// elements.weaponDiv.style.left = weaponry.cX;
// elements.weaponDiv.style.top = weaponry.cY;   //check for neccessity in strafe

abstract class MachineGun extends weaponry {
    public static mghit;
    public static spendingBullets;
    public abstract stopstrafe()
    public strafe(){
        document.addEventListener('mouseleave', e => {
            this.stopstrafe()
              });
    }
    public MGunShotDisplay(e) {
        if (targeting == false) {
            this.ricochet()
        }
        else /*Bullet4.play()*/;
        var x = e.pageX;
        var y = e.pageY;
        let shot = elements.oneshot;
        showElement(shot);
        shot.style.left = `${x - 50}px`;
        shot.style.top = `${y - 50}px`;

        setTimeout(()=>hideElement(shot), 10);
    }

    public ricochet() {
        let machineGunSounds = new Array(Bullet5,Bullet6,Bullet7,Bullet8);
        super.ricochet(machineGunSounds);
    }
}
abstract class regGun extends weaponry {
    public ricochet() {
        let regGunSounds = new Array(Bullet1,Bullet2,Bullet3);
        super.ricochet(regGunSounds);
    }
}
class ChainSaw extends weaponry {
    private static chainsawReach = 240; // target height
    public gunMove(e) {
        if (weaponry.w == 1) { weaponry.scrnMargin = 305; weaponry.gunHeight = 415 }
        else if (weaponry.w == 1.1) { weaponry.scrnMargin = 210; weaponry.gunHeight = 220 }
        weaponry.gunLower(e)
    }
    public static chainsawDistanceCheck(hitImage){
        if (hitImage.src.includes("ChainGuy")){ // change (can't chainsaw the boss)
            return true;
        }
        else if (hitImage.getBoundingClientRect().height>this.chainsawReach) {
            return true; // height/clientHeight/offsetHeight properties wont give real height
        }
        else return false;
    }

    public strafe() {
        hitImage = document.getElementById(`tgt${hitTarget.num}`);
        if (targeting == true && ChainSaw.chainsawDistanceCheck(hitImage)) { 
            hitTarget.loseHealth()
            MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 200));
        }
        weaponry.w = 1.1;
        weaponry.scrnMargin = 210;
        elements.weaponImg.setAttribute("src", pics.guns.chainsaw);
        Saw.play()
        elements.weaponDiv.style.left = weaponry.cX;
        elements.weaponDiv.style.top = weaponry.cY;
    }
    public stopstrafe() {
        clearInterval(MachineGun.mghit);
        weaponry.w = 1;
        elements.weaponImg.setAttribute("src", pics.guns.chainsaw_firing);
        Saw.stop()
        document.body.setAttribute("onmousemove", gunMoveEvent)
    }
    public switchTo() {
        PlayerWeapon = chainsaw;
        weaponry.w = 1;
        weaponry.scrnMargin = 305;
        elements.ammoCount.innerHTML = `N/A`
        elements.weaponDiv.style.top = `${screen.height - weaponry.scrnMargin}px`;
        elements.weaponImg.setAttribute("src", pics.guns.chainsaw_firing);
        elements.ammoType.removeAttribute("src");
        SawUp.play()
        setMouseAttributes_MachineGun();
    }
}

class Pistol extends regGun {
    public gunMove(e) {
        weaponry.scrnMargin = 280;
        weaponry.gunHeight = 390;
        weaponry.gunLower(e)
    }
    public shot(e) {
        if (this.ammo <= 0) { click2.play(); }
        else {
            this.ammo--
            elements.ammoCount.innerHTML = `${this.ammo}`
            if (targeting == false) { this.ricochet() }
            else {
                hitTarget.loseHealth(); /* Bullet4.play() */;
                weaponry.showBlood(e)
            }
            Pshot.play()
        }
    }
    public switchTo() {
        PlayerWeapon = pistol;
        weaponry.w = 2;
        elements.ammoCount.innerHTML = `${this.ammo}`
        weaponry.scrnMargin = 280;
        elements.weaponDiv.style.top = `${screen.height - weaponry.scrnMargin}px`;
        elements.weaponImg.setAttribute("src", pics.guns.pistol);
        elements.ammoType.setAttribute("src", pics.ammo.bullet);
        setMouseAttributes_Normal();
    }
}

class Shotgun extends regGun {
    public gunMove(e) {
        weaponry.scrnMargin = 230;
        weaponry.gunHeight = 350;
        weaponry.gunLower(e)
    }
    public shot(e) {
        if (this.ammo <= 0) { click2.play(); }
        else {
            this.ammo--
            elements.ammoCount.innerHTML = `${this.ammo}`
            if (targeting == false) { this.ricochet() }
            else { /*Bullet4.play()*/; hitTarget.loseHealth() }

            var x = e.pageX;
            var y = e.pageY;
            SGshot.play()
            let shot = elements.oneshot;
            showElement(shot);
            shot.style.left = `${x - 50}px`;
            shot.style.top = `${y - 50}px`;
            setTimeout(()=>hideElement(shot), 100);
        }
    }
    public switchTo() {
        PlayerWeapon = shotgun;
        weaponry.w = 3;
        weaponry.scrnMargin = 230;
        elements.ammoCount.innerHTML = `${this.ammo}`
        elements.weaponDiv.style.top = `${screen.height - weaponry.scrnMargin}px`;
        elements.weaponImg.setAttribute("src", pics.guns.shotgun);
        elements.ammoType.setAttribute("src", pics.ammo.shell);
        setMouseAttributes_Normal()
    }
}

class Minigun extends MachineGun {
    public spinUpCheck: boolean = false
    public mgfiring;
    public mgspinning;
    public ammoDisplay() {
        elements.ammoCount.innerHTML += "200"
    }
    public gunMove(e) {
        if (weaponry.w == 4) { weaponry.scrnMargin = 370; weaponry.gunHeight = 480 }
        weaponry.gunLower(e)
    }
    public spinUp() {
        elements.weaponImg.setAttribute("src", pics.guns.chainsaw_spinup);
        SSamRotate2.play();
        this.mgspinning = setTimeout(function () {
            SSamRotate.play();
        }, 700);
    }
    public strafe() {
        super.strafe();
        if (this.ammo <= 0) { click2.play(); }
        else {
            var thisGun = this;
            this.spinUp();
            this.mgfiring = setTimeout(function () {
                thisGun.spinUpCheck = true;
                weaponry.w = 4.1;
                elements.weaponImg.setAttribute("src", pics.guns.chaingun_firing);
                Avpminigun.play()
                document.body.setAttribute("onmousemove", gunMoveEvent + MgunShotEvent)
                MachineGun.spendingBullets = setInterval(function () {
                    thisGun.ammo--; elements.ammoCount.innerHTML = ` ${thisGun.ammo}`; if (thisGun.ammo <= 0) { thisGun.stopstrafe(); click2.play() }
                }, 200);
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
            elements.weaponImg.setAttribute("src", pics.guns.chaingun);
        }
        else elements.weaponImg.setAttribute("src", pics.guns.chainsaw_frame2);
        // SSamMinigun.stop();
        // SSamMinigun2.stop();
        Avpminigun.stop();
        SSamRotate.stop();
        document.body.setAttribute("onmousemove", gunMoveEvent)
    }
    public switchTo() {
        PlayerWeapon = minigun;
        weaponry.w = 4;
        weaponry.scrnMargin = 370;
        elements.ammoCount.innerHTML = `${this.ammo}`
        elements.weaponDiv.style.top = `${screen.height - weaponry.scrnMargin}px`;
        elements.weaponImg.setAttribute("src", pics.guns.chaingun);
        elements.ammoType.setAttribute("src", pics.ammo.bullets);
        setMouseAttributes_MachineGun();
    }
}

class DukeMgun extends MachineGun {
    public gunMove(e) {
        if (weaponry.w == 6) { weaponry.scrnMargin = 280; weaponry.gunHeight = 390 }
        else if (weaponry.w == 6.1) { weaponry.scrnMargin = 280; weaponry.gunHeight = 390 }
        weaponry.gunLower(e)
    }
    public strafe() {
        super.strafe();
        if (this.ammo <= 0) { click2.play(); }
        else {
            var thisGun = this;
            thisGun.ammo--;
            elements.ammoCount.innerHTML = ` ${thisGun.ammo}`
            weaponry.w = 6.1;
            elements.weaponImg.setAttribute("src", pics.guns.dukeMgun_firing);
            MGun.play()
            document.body.setAttribute("onmousemove", gunMoveEvent + MgunShotEvent)
            MachineGun.spendingBullets = setInterval(function () {
                thisGun.ammo--; elements.ammoCount.innerHTML = ` ${thisGun.ammo}`; if (thisGun.ammo <= 0) { thisGun.stopstrafe(); click2.play() }
            }, 200);
            if (targeting == true) {
                hitTarget.loseHealth()
                MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 200));
            }
        }
    }
    public stopstrafe() {
        clearInterval(MachineGun.mghit);
        clearInterval(MachineGun.spendingBullets);
        weaponry.w = 6;
        elements.weaponImg.setAttribute("src", pics.guns.dukeMgun);
        MGun.stop();
        document.body.setAttribute("onmousemove", gunMoveEvent)
    }
    public switchTo() {
        PlayerWeapon = dukemgun;
        weaponry.w = 6;
        weaponry.scrnMargin = 250;
        elements.ammoCount.innerHTML = `${this.ammo}`
        elements.weaponDiv.style.top = `${screen.height - weaponry.scrnMargin}px`;
        elements.weaponImg.setAttribute("src", pics.guns.dukeMgun);
        elements.ammoType.setAttribute("src", pics.ammo.bullets);
        setMouseAttributes_MachineGun()
    }
}
class DuelNeutron extends MachineGun {
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
            elements.ammoCount.innerHTML = ` ${thisGun.ammo}`
            weaponry.w = 7.1;
            elements.weaponImg.setAttribute("src", pics.guns.dualNuetron_firing);
            SSamMinigun.play()
            document.body.setAttribute("onmousemove", gunMoveEvent)
            MachineGun.spendingBullets = setInterval(function () {
                thisGun.ammo--; elements.ammoCount.innerHTML = ` ${thisGun.ammo}`; if (thisGun.ammo <= 0) { thisGun.stopstrafe(); click2.play() }
            }, 200);
            if (targeting == true) {
                hitTarget.loseHealth()
                MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 200));
            }
        }
    }
    
    public stopstrafe() {
        clearInterval(MachineGun.mghit);
        clearInterval(MachineGun.spendingBullets);
        weaponry.w = 7;
        elements.weaponImg.setAttribute("src", pics.guns.dualNuetron);
        SSamMinigun.stop();
        document.body.setAttribute("onmousemove", gunMoveEvent)
    }
    public switchTo() {
        PlayerWeapon = duelneutron;
        weaponry.w = 7;
        weaponry.scrnMargin = 250;
        elements.ammoCount.innerHTML = `${this.ammo}`
        elements.weaponDiv.style.top = `${screen.height - weaponry.scrnMargin}px`;
        elements.weaponImg.setAttribute("src", pics.guns.dualNuetron);
        elements.ammoType.setAttribute("src", pics.ammo.bullet);
        setMouseAttributes_MachineGun()
    }
}

function setMouseAttributes_Normal(){
    document.body.setAttribute("onmousedown", "PlayerWeapon.shot(event)")
    document.body.removeAttribute("onmouseup");
    document.body.setAttribute("onmousemove", gunMoveEvent)
}
function setMouseAttributes_MachineGun(){
    document.body.setAttribute("onmousedown", "PlayerWeapon.strafe()");
    document.body.setAttribute("onmouseup", "PlayerWeapon.stopstrafe()");
    document.body.setAttribute("onmousemove", gunMoveEvent);
}

let chainsaw = new ChainSaw;
let pistol = new Pistol;
let shotgun = new Shotgun;
let minigun = new Minigun;
let dukemgun = new DukeMgun;
let duelneutron = new DuelNeutron;

pistol.ammo = 0;
shotgun.ammo = 0;
minigun.ammo = 0;
dukemgun.ammo = 0;
duelneutron.ammo = 0;
// startingAmmo()

let PlayerWeapon: weaponry = pistol;
let slungWeapon: weaponry;
PlayerWeapon.switchTo()
