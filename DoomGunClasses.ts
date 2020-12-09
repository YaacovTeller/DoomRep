//WEAPON
abstract class weaponry {
    public static w: number = 2 //Sets weapon to pistol at the start
    public static randNum;
    public static scrnMargin: number;
    public static gunHeight: number;
    public static gunDefaultY
    public static cX
    public static cY;
    public ammo: number

    // Moves the chosen weapon to the mouse location, and keeps it at the base of the screen
    public abstract gunMove(e);
    public abstract switchTo();
    public static noBlood() { elementObj.blood.style.display = "none" }
    public static showBlood(e) {
        var x = e.pageX;
        var y = e.pageY;
        let blood = elementObj.blood;
        blood.style.display = "block";
        blood.style.left = `${x - 10}px`;
        blood.style.top = `${y - 10}px`;
        blood.setAttribute("src", `pics/Blood_10.gif` + "?a=" + Math.random());
        setTimeout(weaponry.noBlood, 100)
    };
    public static gunLower(e) {
        var Screen: number = screen.height;
        var x = e.pageX;
        var y = e.pageY;
        weaponry.cX = `${x - 44}px`;
// Lowers the weapon when the mouse passes the gun height!
  /*cY*/if (y > (Screen - weaponry.gunHeight)) { weaponry.cY = `${y + 110}px` } else weaponry.cY = `${Screen - weaponry.scrnMargin}px`;
        elementObj.weaponDiv.style.left = weaponry.cX;
        elementObj.weaponDiv.style.top = weaponry.cY;
    }
    // Creates bullet "flashes" at the mouse pointer, shot, hit and ricochet sounds

    // Creates bullet "flashes" for machine guns, shot, hit and ricochet sounds

    // Changes guns to firing image
}

// elementObj.weaponDiv.style.left = weaponry.cX;
// elementObj.weaponDiv.style.top = weaponry.cY;   //check for neccessity in strafe

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
            this.randomMGunRicochet()
        }
        else /*Bullet4.play()*/;
        var x = e.pageX;
        var y = e.pageY;
        let shot = elementObj.oneshot;
        shot.style.display = "block";
        shot.style.left = `${x - 50}px`;
        shot.style.top = `${y - 50}px`;
        function noShot() { shot.style.display = "none" }
        setTimeout(noShot, 10)
    }

    public randomMGunRicochet() {
        weaponry.randNum = Math.floor(Math.random() * (4) + 1);
        if (weaponry.randNum == 1) { Bullet5.play() }
        else if (weaponry.randNum == 2) { Bullet6.play() }
        else if (weaponry.randNum == 3) { Bullet7.play() }
        else if (weaponry.randNum == 4) { Bullet8.play() }
    }
}
abstract class regGun extends weaponry {
    public randomRicochet() {
        weaponry.randNum = Math.floor(Math.random() * (3) + 1);
        if (weaponry.randNum == 1) { Bullet1.play() }
        else if (weaponry.randNum == 2) { Bullet2.play() }
        else if (weaponry.randNum == 3) { Bullet3.play() }
    }
}
class ChainSaw extends weaponry {
    public gunMove(e) {
        if (weaponry.w == 1) { weaponry.scrnMargin = 305; weaponry.gunHeight = 415 }
        else if (weaponry.w == 1.1) { weaponry.scrnMargin = 210; weaponry.gunHeight = 220 }
        weaponry.gunLower(e)
    }
    public strafe() {
        hitImage = document.getElementById(`tgt${hitTarget.num}`);
        if (targeting == true && hitImage.offsetheight > 200) { //NEEDS FIXING, ALL ARE 300px
            hitTarget.loseHealth()
            MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 200));
        }
        weaponry.w = 1.1;
        weaponry.scrnMargin = 210;
        elementObj.weaponImg.setAttribute("src", "Pics/Saw.png");
        Saw.play()
        elementObj.weaponDiv.style.left = weaponry.cX;
        elementObj.weaponDiv.style.top = weaponry.cY;
    }
    public stopstrafe() {
        clearInterval(MachineGun.mghit);
        weaponry.w = 1;
        elementObj.weaponImg.setAttribute("src", "Pics/ChainSaw.gif");
        Saw.stop()
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)")
    }
    public switchTo() {
        PlayerWeapon = chainsaw;
        weaponry.w = 1;
        weaponry.scrnMargin = 305;
        elementObj.ammoCount.innerHTML = `N/A`
        elementObj.weaponDiv.style.top = `${screen.height - weaponry.scrnMargin}px`;
        elementObj.weaponImg.setAttribute("src", "Pics/ChainSaw.gif");
        elementObj.ammoType.removeAttribute("src");
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
            elementObj.ammoCount.innerHTML = `${this.ammo}`
            if (targeting == false) { this.randomRicochet() }
            else {
                hitTarget.loseHealth(); /* Bullet4.play() */;
                weaponry.showBlood(e)
            }
            Pshot.play()
            // oneshot.style.display = "block";
            // oneshot.style.left = `${x - 50}px`;
            // oneshot.style.top = `${y - 50}px`;
            // function noShot() { oneshot.style.display = "none" }
            // setTimeout(noShot, 100)
        }
    }
    public switchTo() {
        PlayerWeapon = pistol;
        weaponry.w = 2;
        elementObj.ammoCount.innerHTML = `${this.ammo}`
        weaponry.scrnMargin = 280;
        elementObj.weaponDiv.style.top = `${screen.height - weaponry.scrnMargin}px`;
        elementObj.weaponImg.setAttribute("src", "Pics/pistol_right.png");
        elementObj.ammoType.setAttribute("src", "Pics/Slug.png");
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
            elementObj.ammoCount.innerHTML = `${this.ammo}`
            if (targeting == false) { this.randomRicochet() }
            else { /*Bullet4.play()*/; hitTarget.loseHealth() }

            var x = e.pageX;
            var y = e.pageY;
            SGshot.play()
            elementObj.oneshot.style.display = "block";
            elementObj.oneshot.style.left = `${x - 50}px`;
            elementObj.oneshot.style.top = `${y - 50}px`;
            setTimeout(noShot, 100)
        }
    }
    public switchTo() {
        PlayerWeapon = shotgun;
        weaponry.w = 3;
        weaponry.scrnMargin = 230;
        elementObj.ammoCount.innerHTML = `${this.ammo}`
        elementObj.weaponDiv.style.top = `${screen.height - weaponry.scrnMargin}px`;
        elementObj.weaponImg.setAttribute("src", "Pics/Ggun2.png");
        elementObj.ammoType.setAttribute("src", "Pics/Shell.png");
        setMouseAttributes_Normal()
    }
}

class Minigun extends MachineGun {
    public spinUpCheck: boolean = false
    public mgfiring;
    public mgspinning;
    public ammoDisplay() {
        elementObj.ammoCount.innerHTML += "200"
    }
    public gunMove(e) {
        if (weaponry.w == 4) { weaponry.scrnMargin = 370; weaponry.gunHeight = 480 }
        weaponry.gunLower(e)
    }
    public spinUp() {
        elementObj.weaponImg.setAttribute("src", "Pics/ChainGunSpin_Up_150_8.gif");
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
                elementObj.weaponImg.setAttribute("src", "Pics/ChainGunFiring150_8.gif");
                Avpminigun.play()
                document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event); PlayerWeapon.MGunShotDisplay(event)")
                MachineGun.spendingBullets = setInterval(function () {
                    thisGun.ammo--; elementObj.ammoCount.innerHTML = ` ${thisGun.ammo}`; if (thisGun.ammo <= 0) { thisGun.stopstrafe(); click2.play() }
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
        weaponry.randNum = Math.floor(Math.random() * (2 - 1 + 1) + 1);
        if (weaponry.randNum == 1) {
            elementObj.weaponImg.setAttribute("src", "Pics/ChainGun150.png");
        }
        else elementObj.weaponImg.setAttribute("src", "Pics/ChainGun150_Alt.png");
        // SSamMinigun.stop();
        // SSamMinigun2.stop();
        Avpminigun.stop();
        SSamRotate.stop();
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)")
    }
    public switchTo() {
        PlayerWeapon = minigun;
        weaponry.w = 4;
        weaponry.scrnMargin = 370;
        elementObj.ammoCount.innerHTML = `${this.ammo}`
        elementObj.weaponDiv.style.top = `${screen.height - weaponry.scrnMargin}px`;
        elementObj.weaponImg.setAttribute("src", "Pics/ChainGun150.png");
        elementObj.ammoType.setAttribute("src", "Pics/Bullets.png");
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
            elementObj.ammoCount.innerHTML = ` ${thisGun.ammo}`
            weaponry.w = 6.1;
            elementObj.weaponImg.setAttribute("src", "Pics/DukeMgunFire.gif");
            MGun.play()
            document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event); PlayerWeapon.MGunShotDisplay(event)")
            MachineGun.spendingBullets = setInterval(function () {
                thisGun.ammo--; elementObj.ammoCount.innerHTML = ` ${thisGun.ammo}`; if (thisGun.ammo <= 0) { thisGun.stopstrafe(); click2.play() }
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
        elementObj.weaponImg.setAttribute("src", "Pics/DukeMgun.png");
        MGun.stop();
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)")
    }
    public switchTo() {
        PlayerWeapon = dukemgun;
        weaponry.w = 6;
        weaponry.scrnMargin = 250;
        elementObj.ammoCount.innerHTML = `${this.ammo}`
        elementObj.weaponDiv.style.top = `${screen.height - weaponry.scrnMargin}px`;
        elementObj.weaponImg.setAttribute("src", "Pics/DukeMgun.png");
        elementObj.ammoType.setAttribute("src", "Pics/Bullets.png");
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
            elementObj.ammoCount.innerHTML = ` ${thisGun.ammo}`
            weaponry.w = 7.1;
            elementObj.weaponImg.setAttribute("src", "Pics/DN110.gif");
            SSamMinigun.play()
            document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event); PlayerWeapon.MGunShotDisplay(event)")
            MachineGun.spendingBullets = setInterval(function () {
                thisGun.ammo--; elementObj.ammoCount.innerHTML = ` ${thisGun.ammo}`; if (thisGun.ammo <= 0) { thisGun.stopstrafe(); click2.play() }
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
        elementObj.weaponImg.setAttribute("src", "Pics/DN.png");
        SSamMinigun.stop();
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)")
    }
    public switchTo() {
        PlayerWeapon = duelneutron;
        weaponry.w = 7;
        weaponry.scrnMargin = 250;
        elementObj.ammoCount.innerHTML = `${this.ammo}`
        elementObj.weaponDiv.style.top = `${screen.height - weaponry.scrnMargin}px`;
        elementObj.weaponImg.setAttribute("src", "Pics/DN.png");
        elementObj.ammoType.setAttribute("src", "Pics/Bullet.png");
        setMouseAttributes_MachineGun()
    }
}

function setMouseAttributes_Normal(){
    document.body.setAttribute("onmousedown", "PlayerWeapon.shot(event)")
    document.body.removeAttribute("onmouseup");
    document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)")
}
function setMouseAttributes_MachineGun(){
    document.body.setAttribute("onmousedown", "PlayerWeapon.strafe()");
    document.body.setAttribute("onmouseup", "PlayerWeapon.stopstrafe()");
    document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)");
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
