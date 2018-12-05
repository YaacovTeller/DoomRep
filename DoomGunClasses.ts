//WEAPON
//כלי נשק
abstract class weaponry {
    public static w: number = 2 //Sets weapon to pistol at the start
    public static num;
    public static scrnMargin: number;
    public static gunHeight: number;
    public static gunDefaultY
    public static cX
    public static cY;
    public ammo: number

    // Moves the chosen weapon to the mouse location, and keeps it at the base of the screen
    //מזיז את הנשק הנבחר למיקום העכבר ושומר אותו בבסיס המסך 
    public abstract gunMove(e);
    public abstract switchTo();
    public static noBlood() { blood.style.display = "none" }
    public static showBlood(e) {
        var x = e.pageX;
        var y = e.pageY;
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
// מוריד את הנשק כאשר העכבר עובר את גובה האקדח!
  /*cY*/if (y > (Screen - weaponry.gunHeight)) { weaponry.cY = `${y + 110}px` } else weaponry.cY = `${Screen - weaponry.scrnMargin}px`;
        document.getElementById("wep").style.left = weaponry.cX;
        document.getElementById("wep").style.top = weaponry.cY;
    }
    // Creates bullet "flashes" at the mouse pointer, shot, hit and ricochet sounds
    //יצירת "הבזקים" כדוריים במצביע העכבר 

    // Creates bullet "flashes" for machine guns, shot, hit and ricochet sounds

    // Changes guns to firing image
    // משנה כלי נשק למצב ירי  
}

// document.getElementById("wep").style.left = weaponry.cX;
// document.getElementById("wep").style.top = weaponry.cY;   //check for neccessity in strafe

abstract class MachineGun extends weaponry {
    public static mghit;
    public static spendingBullets;
    public abstract strafe()
    public abstract stopstrafe()
    public MGunShotDisplay(e) {
        if (targeting == false) {
            this.randomMGunRicochet()
        }
        else /*Bullet4.play()*/;
        var x = e.pageX;
        var y = e.pageY;
        oneshot.style.display = "block";
        oneshot.style.left = `${x - 50}px`;
        oneshot.style.top = `${y - 50}px`;
        function noShot() { oneshot.style.display = "none" }
        setTimeout(noShot, 10)
    }

    public randomMGunRicochet() {
        weaponry.num = Math.floor(Math.random() * (4) + 1);
        if (weaponry.num == 1) { Bullet5.play() }
        else if (weaponry.num == 2) { Bullet6.play() }
        else if (weaponry.num == 3) { Bullet7.play() }
        else if (weaponry.num == 4) { Bullet8.play() }
    }
}
abstract class regGun extends weaponry {
    public randomRicochet() {
        weaponry.num = Math.floor(Math.random() * (3) + 1);
        if (weaponry.num == 1) { Bullet1.play() }
        else if (weaponry.num == 2) { Bullet2.play() }
        else if (weaponry.num == 3) { Bullet3.play() }
    }
}
// מסור חשמלי
class ChainSaw extends weaponry {
    public gunMove(e) {
        if (weaponry.w == 1) { weaponry.scrnMargin = 305; weaponry.gunHeight = 415 }
        else if (weaponry.w == 1.1) { weaponry.scrnMargin = 210; weaponry.gunHeight = 220 }
        weaponry.gunLower(e)
    }
    public strafe() {
        hitImage = document.getElementById(`tgt${hitTarget.num}`);
        if (targeting == true && hitImage.height > 200) { //NEEDS FIXING, ALL ARE 300px
            hitTarget.loseHealth()
            MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 200));
        }
        weaponry.w = 1.1;
        weaponry.scrnMargin = 210;
        weaponPic.setAttribute("src", "Pics/Saw.png");
        Saw.play()
        document.getElementById("wep").style.left = weaponry.cX;
        document.getElementById("wep").style.top = weaponry.cY;
    }
    public stopstrafe() {
        clearInterval(MachineGun.mghit);
        weaponry.w = 1;
        weaponPic.setAttribute("src", "Pics/ChainSaw.gif");
        Saw.stop()
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)")
    }
    public switchTo() {
        weaponry.w = 1;
        weaponry.scrnMargin = 305;
        ammoCount.innerHTML = `N/A`
        document.getElementById("wep").style.top = `${screen.height - weaponry.scrnMargin}px`;
        weaponPic.setAttribute("src", "Pics/ChainSaw.gif");
        SawUp.play()
        document.body.setAttribute("onmousedown", "PlayerWeapon.strafe()")
        document.body.setAttribute("onmouseup", "PlayerWeapon.stopstrafe()")
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)")
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
            ammoCount.innerHTML = `${this.ammo}`
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
        weaponry.w = 2;
        ammoCount.innerHTML = `${this.ammo}`
        weaponry.scrnMargin = 280;
        document.getElementById("wep").style.top = `${screen.height - weaponry.scrnMargin}px`;
        weaponPic.setAttribute("src", "Pics/pistol_right.png");
        document.body.setAttribute("onmouseup", "");
        document.body.setAttribute("onmousedown", "PlayerWeapon.shot(event)")
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)")
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
            ammoCount.innerHTML = `${this.ammo}`
            if (targeting == false) { this.randomRicochet() }
            else { /*Bullet4.play()*/; hitTarget.loseHealth() }

            var x = e.pageX;
            var y = e.pageY;
            SGshot.play()
            oneshot.style.display = "block";
            oneshot.style.left = `${x - 50}px`;
            oneshot.style.top = `${y - 50}px`;
            setTimeout(noShot, 100)
        }
    }
    public switchTo() {
        weaponry.w = 3;
        weaponry.scrnMargin = 230;
        ammoCount.innerHTML = `${this.ammo}`
        document.getElementById("wep").style.top = `${screen.height - weaponry.scrnMargin}px`;
        weaponPic.setAttribute("src", "Pics/Ggun2.png");
        document.body.removeAttribute("onmouseup");
        document.body.setAttribute("onmousedown", "PlayerWeapon.shot(event)")
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)")
    }
}

class Minigun extends MachineGun {
    public spinUpCheck: boolean = false
    public mgfiring;
    public mgspinning;
    public ammoDisplay() {
        ammoCount.innerHTML += "200"
    }
    public gunMove(e) {
        if (weaponry.w == 4) { weaponry.scrnMargin = 370; weaponry.gunHeight = 480 }
        weaponry.gunLower(e)
    }
    public spinUp() {
        weaponPic.setAttribute("src", "Pics/ChainGunSpin_Up_150_8.gif");
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
            this.mgfiring = setTimeout(function () {
                thisGun.spinUpCheck = true;
                weaponry.w = 4.1;
                weaponPic.setAttribute("src", "Pics/ChainGunFiring150_8.gif");
                Avpminigun.play()
                document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event); PlayerWeapon.MGunShotDisplay(event)")
                MachineGun.spendingBullets = setInterval(function () {
                    thisGun.ammo--; ammoCount.innerHTML = ` ${thisGun.ammo}`; if (thisGun.ammo <= 0) { thisGun.stopstrafe(); click2.play() }
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
        weaponry.num = Math.floor(Math.random() * (2 - 1 + 1) + 1);
        if (weaponry.num == 1) {
            weaponPic.setAttribute("src", "Pics/ChainGun150.png");
        }
        else weaponPic.setAttribute("src", "Pics/ChainGun150_Alt.png");
        // SSamMinigun.stop();
        // SSamMinigun2.stop();
        Avpminigun.stop();
        SSamRotate.stop();
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)")
    }
    public switchTo() {
        weaponry.w = 4;
        weaponry.scrnMargin = 370;
        ammoCount.innerHTML = `${this.ammo}`
        document.getElementById("wep").style.top = `${screen.height - weaponry.scrnMargin}px`;
        weaponPic.setAttribute("src", "Pics/ChainGun150.png");
        document.body.setAttribute("onmousedown", "PlayerWeapon.strafe()");
        document.body.setAttribute("onmouseup", "PlayerWeapon.stopstrafe()");
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)");
    }

}

class DukeMgun extends MachineGun {
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
            ammoCount.innerHTML = ` ${thisGun.ammo}`
            weaponry.w = 6.1;
            weaponPic.setAttribute("src", "Pics/DukeMgunFire.gif");
            MGun.play()
            document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event); PlayerWeapon.MGunShotDisplay(event)")
            MachineGun.spendingBullets = setInterval(function () {
                thisGun.ammo--; ammoCount.innerHTML = ` ${thisGun.ammo}`; if (thisGun.ammo <= 0) { thisGun.stopstrafe(); click2.play() }
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
        weaponPic.setAttribute("src", "Pics/DukeMgun.png");
        MGun.stop();
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)")
    }
    public switchTo() {
        weaponry.w = 6;
        weaponry.scrnMargin = 250;
        ammoCount.innerHTML = `${this.ammo}`
        document.getElementById("wep").style.top = `${screen.height - weaponry.scrnMargin}px`;
        weaponPic.setAttribute("src", "Pics/DukeMgun.png");
        document.body.setAttribute("onmousedown", "PlayerWeapon.strafe()");
        document.body.setAttribute("onmouseup", "PlayerWeapon.stopstrafe()");
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)");

    }
}
class DuelNeutron extends MachineGun {
    public gunMove(e) {
        if (weaponry.w == 7) { weaponry.scrnMargin = 250; weaponry.gunHeight = 360 }
        else if (weaponry.w == 7.1) { weaponry.scrnMargin = 300; weaponry.gunHeight = 390 }
        weaponry.gunLower(e)
    }
    public strafe() {
        if (this.ammo <= 0) { click2.play(); }
        else {
            var thisGun = this;
            thisGun.ammo--;
            ammoCount.innerHTML = ` ${thisGun.ammo}`
            weaponry.w = 7.1;
            weaponPic.setAttribute("src", "Pics/DN110.gif");
            SSamMinigun.play()
            document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event); PlayerWeapon.MGunShotDisplay(event)")
            MachineGun.spendingBullets = setInterval(function () {
                thisGun.ammo--; ammoCount.innerHTML = ` ${thisGun.ammo}`; if (thisGun.ammo <= 0) { thisGun.stopstrafe(); click2.play() }
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
        weaponPic.setAttribute("src", "Pics/DN.png");
        SSamMinigun.stop();
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)")
    }
    public switchTo() {
        weaponry.w = 7;
        weaponry.scrnMargin = 250;
        ammoCount.innerHTML = `${this.ammo}`
        document.getElementById("wep").style.top = `${screen.height - weaponry.scrnMargin}px`;
        weaponPic.setAttribute("src", "Pics/DN.png");
        document.body.setAttribute("onmousedown", "PlayerWeapon.strafe()");
        document.body.setAttribute("onmouseup", "PlayerWeapon.stopstrafe()");
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)");

    }
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
PlayerWeapon.switchTo()
