"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//WEAPON
//כלי נשק
var weaponry = /** @class */ (function () {
    function weaponry() {
    }
    weaponry.noBlood = function () { blood.style.display = "none"; };
    weaponry.showBlood = function (e) {
        var x = e.pageX;
        var y = e.pageY;
        blood.style.display = "block";
        blood.style.left = x - 10 + "px";
        blood.style.top = y - 10 + "px";
        blood.setAttribute("src", "pics/Blood_10.gif" + "?a=" + Math.random());
        setTimeout(weaponry.noBlood, 100);
    };
    ;
    weaponry.gunLower = function (e) {
        var Screen = screen.height;
        var x = e.pageX;
        var y = e.pageY;
        weaponry.cX = x - 44 + "px";
        // Lowers the weapon when the mouse passes the gun height!
        // מוריד את הנשק כאשר העכבר עובר את גובה האקדח!
        /*cY*/ if (y > (Screen - weaponry.gunHeight)) {
            weaponry.cY = y + 110 + "px";
        }
        else
            weaponry.cY = Screen - weaponry.scrnMargin + "px";
        document.getElementById("wep").style.left = weaponry.cX;
        document.getElementById("wep").style.top = weaponry.cY;
    };
    weaponry.w = 2; //Sets weapon to pistol at the start
    return weaponry;
}());
// document.getElementById("wep").style.left = weaponry.cX;
// document.getElementById("wep").style.top = weaponry.cY;   //check for neccessity in strafe
var MachineGun = /** @class */ (function (_super) {
    __extends(MachineGun, _super);
    function MachineGun() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MachineGun.prototype.MGunShotDisplay = function (e) {
        if (targeting == false) {
            this.randomMGunRicochet();
        }
        else /*Bullet4.play()*/
            ;
        var x = e.pageX;
        var y = e.pageY;
        oneshot.style.display = "block";
        oneshot.style.left = x - 50 + "px";
        oneshot.style.top = y - 50 + "px";
        function noShot() { oneshot.style.display = "none"; }
        setTimeout(noShot, 10);
    };
    MachineGun.prototype.randomMGunRicochet = function () {
        weaponry.num = Math.floor(Math.random() * (4) + 1);
        if (weaponry.num == 1) {
            Bullet5.play();
        }
        else if (weaponry.num == 2) {
            Bullet6.play();
        }
        else if (weaponry.num == 3) {
            Bullet7.play();
        }
        else if (weaponry.num == 4) {
            Bullet8.play();
        }
    };
    return MachineGun;
}(weaponry));
var regGun = /** @class */ (function (_super) {
    __extends(regGun, _super);
    function regGun() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    regGun.prototype.randomRicochet = function () {
        weaponry.num = Math.floor(Math.random() * (3) + 1);
        if (weaponry.num == 1) {
            Bullet1.play();
        }
        else if (weaponry.num == 2) {
            Bullet2.play();
        }
        else if (weaponry.num == 3) {
            Bullet3.play();
        }
    };
    return regGun;
}(weaponry));
// מסור חשמלי
var ChainSaw = /** @class */ (function (_super) {
    __extends(ChainSaw, _super);
    function ChainSaw() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ChainSaw.prototype.gunMove = function (e) {
        if (weaponry.w == 1) {
            weaponry.scrnMargin = 305;
            weaponry.gunHeight = 415;
        }
        else if (weaponry.w == 1.1) {
            weaponry.scrnMargin = 210;
            weaponry.gunHeight = 220;
        }
        weaponry.gunLower(e);
    };
    ChainSaw.prototype.strafe = function () {
        hitImage = document.getElementById("tgt" + hitTarget.num);
        if (targeting == true && hitImage.height > 200) { //NEEDS FIXING, ALL ARE 300px
            hitTarget.loseHealth();
            MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 200));
        }
        weaponry.w = 1.1;
        weaponry.scrnMargin = 210;
        weaponPic.setAttribute("src", "Pics/Saw.png");
        Saw.play();
        document.getElementById("wep").style.left = weaponry.cX;
        document.getElementById("wep").style.top = weaponry.cY;
    };
    ChainSaw.prototype.stopstrafe = function () {
        clearInterval(MachineGun.mghit);
        weaponry.w = 1;
        weaponPic.setAttribute("src", "Pics/ChainSaw.gif");
        Saw.stop();
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)");
    };
    ChainSaw.prototype.switchTo = function () {
        weaponry.w = 1;
        weaponry.scrnMargin = 305;
        ammoCount.innerHTML = "N/A";
        document.getElementById("wep").style.top = screen.height - weaponry.scrnMargin + "px";
        weaponPic.setAttribute("src", "Pics/ChainSaw.gif");
        SawUp.play();
        document.body.setAttribute("onmousedown", "PlayerWeapon.strafe()");
        document.body.setAttribute("onmouseup", "PlayerWeapon.stopstrafe()");
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)");
    };
    return ChainSaw;
}(weaponry));
var Pistol = /** @class */ (function (_super) {
    __extends(Pistol, _super);
    function Pistol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Pistol.prototype.gunMove = function (e) {
        weaponry.scrnMargin = 280;
        weaponry.gunHeight = 390;
        weaponry.gunLower(e);
    };
    Pistol.prototype.shot = function (e) {
        if (this.ammo <= 0) {
            click2.play();
        }
        else {
            this.ammo--;
            ammoCount.innerHTML = "" + this.ammo;
            if (targeting == false) {
                this.randomRicochet();
            }
            else {
                hitTarget.loseHealth(); /* Bullet4.play() */
                ;
                weaponry.showBlood(e);
            }
            Pshot.play();
            // oneshot.style.display = "block";
            // oneshot.style.left = `${x - 50}px`;
            // oneshot.style.top = `${y - 50}px`;
            // function noShot() { oneshot.style.display = "none" }
            // setTimeout(noShot, 100)
        }
    };
    Pistol.prototype.switchTo = function () {
        weaponry.w = 2;
        ammoCount.innerHTML = "" + this.ammo;
        weaponry.scrnMargin = 280;
        document.getElementById("wep").style.top = screen.height - weaponry.scrnMargin + "px";
        weaponPic.setAttribute("src", "Pics/pistol_right.png");
        document.body.setAttribute("onmouseup", "");
        document.body.setAttribute("onmousedown", "PlayerWeapon.shot(event)");
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)");
    };
    return Pistol;
}(regGun));
var Shotgun = /** @class */ (function (_super) {
    __extends(Shotgun, _super);
    function Shotgun() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Shotgun.prototype.gunMove = function (e) {
        weaponry.scrnMargin = 230;
        weaponry.gunHeight = 350;
        weaponry.gunLower(e);
    };
    Shotgun.prototype.shot = function (e) {
        if (this.ammo <= 0) {
            click2.play();
        }
        else {
            this.ammo--;
            ammoCount.innerHTML = "" + this.ammo;
            if (targeting == false) {
                this.randomRicochet();
            }
            else { /*Bullet4.play()*/
                ;
                hitTarget.loseHealth();
            }
            var x = e.pageX;
            var y = e.pageY;
            SGshot.play();
            oneshot.style.display = "block";
            oneshot.style.left = x - 50 + "px";
            oneshot.style.top = y - 50 + "px";
            setTimeout(noShot, 100);
        }
    };
    Shotgun.prototype.switchTo = function () {
        weaponry.w = 3;
        weaponry.scrnMargin = 230;
        ammoCount.innerHTML = "" + this.ammo;
        document.getElementById("wep").style.top = screen.height - weaponry.scrnMargin + "px";
        weaponPic.setAttribute("src", "Pics/Ggun2.png");
        document.body.removeAttribute("onmouseup");
        document.body.setAttribute("onmousedown", "PlayerWeapon.shot(event)");
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)");
    };
    return Shotgun;
}(regGun));
var Minigun = /** @class */ (function (_super) {
    __extends(Minigun, _super);
    function Minigun() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.spinUpCheck = false;
        return _this;
    }
    Minigun.prototype.ammoDisplay = function () {
        ammoCount.innerHTML += "200";
    };
    Minigun.prototype.gunMove = function (e) {
        if (weaponry.w == 4) {
            weaponry.scrnMargin = 370;
            weaponry.gunHeight = 480;
        }
        weaponry.gunLower(e);
    };
    Minigun.prototype.spinUp = function () {
        weaponPic.setAttribute("src", "Pics/ChainGunSpin_Up_150_8.gif");
        SSamRotate2.play();
        this.mgspinning = setTimeout(function () {
            SSamRotate.play();
        }, 700);
    };
    Minigun.prototype.strafe = function () {
        if (this.ammo <= 0) {
            click2.play();
        }
        else {
            var thisGun = this;
            this.spinUp();
            this.mgfiring = setTimeout(function () {
                thisGun.spinUpCheck = true;
                weaponry.w = 4.1;
                weaponPic.setAttribute("src", "Pics/ChainGunFiring150_8.gif");
                Avpminigun.play();
                document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event); PlayerWeapon.MGunShotDisplay(event)");
                MachineGun.spendingBullets = setInterval(function () {
                    thisGun.ammo--;
                    ammoCount.innerHTML = " " + thisGun.ammo;
                    if (thisGun.ammo <= 0) {
                        thisGun.stopstrafe();
                        click2.play();
                    }
                }, 200);
                if (targeting == true) {
                    MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 200));
                }
            }, 1000);
        }
    };
    Minigun.prototype.stopstrafe = function () {
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
        else
            weaponPic.setAttribute("src", "Pics/ChainGun150_Alt.png");
        // SSamMinigun.stop();
        // SSamMinigun2.stop();
        Avpminigun.stop();
        SSamRotate.stop();
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)");
    };
    Minigun.prototype.switchTo = function () {
        weaponry.w = 4;
        weaponry.scrnMargin = 370;
        ammoCount.innerHTML = "" + this.ammo;
        document.getElementById("wep").style.top = screen.height - weaponry.scrnMargin + "px";
        weaponPic.setAttribute("src", "Pics/ChainGun150.png");
        document.body.setAttribute("onmousedown", "PlayerWeapon.strafe()");
        document.body.setAttribute("onmouseup", "PlayerWeapon.stopstrafe()");
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)");
    };
    return Minigun;
}(MachineGun));
var DukeMgun = /** @class */ (function (_super) {
    __extends(DukeMgun, _super);
    function DukeMgun() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DukeMgun.prototype.gunMove = function (e) {
        if (weaponry.w == 6) {
            weaponry.scrnMargin = 280;
            weaponry.gunHeight = 390;
        }
        else if (weaponry.w == 6.1) {
            weaponry.scrnMargin = 280;
            weaponry.gunHeight = 390;
        }
        weaponry.gunLower(e);
    };
    DukeMgun.prototype.strafe = function () {
        if (this.ammo <= 0) {
            click2.play();
        }
        else {
            var thisGun = this;
            thisGun.ammo--;
            ammoCount.innerHTML = " " + thisGun.ammo;
            weaponry.w = 6.1;
            weaponPic.setAttribute("src", "Pics/DukeMgunFire.gif");
            MGun.play();
            document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event); PlayerWeapon.MGunShotDisplay(event)");
            MachineGun.spendingBullets = setInterval(function () {
                thisGun.ammo--;
                ammoCount.innerHTML = " " + thisGun.ammo;
                if (thisGun.ammo <= 0) {
                    thisGun.stopstrafe();
                    click2.play();
                }
            }, 200);
            if (targeting == true) {
                hitTarget.loseHealth();
                MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 200));
            }
        }
    };
    DukeMgun.prototype.stopstrafe = function () {
        clearInterval(MachineGun.mghit);
        clearInterval(MachineGun.spendingBullets);
        weaponry.w = 6;
        weaponPic.setAttribute("src", "Pics/DukeMgun.png");
        MGun.stop();
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)");
    };
    DukeMgun.prototype.switchTo = function () {
        weaponry.w = 6;
        weaponry.scrnMargin = 250;
        ammoCount.innerHTML = "" + this.ammo;
        document.getElementById("wep").style.top = screen.height - weaponry.scrnMargin + "px";
        weaponPic.setAttribute("src", "Pics/DukeMgun.png");
        document.body.setAttribute("onmousedown", "PlayerWeapon.strafe()");
        document.body.setAttribute("onmouseup", "PlayerWeapon.stopstrafe()");
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)");
    };
    return DukeMgun;
}(MachineGun));
var DuelNeutron = /** @class */ (function (_super) {
    __extends(DuelNeutron, _super);
    function DuelNeutron() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DuelNeutron.prototype.gunMove = function (e) {
        if (weaponry.w == 7) {
            weaponry.scrnMargin = 250;
            weaponry.gunHeight = 360;
        }
        else if (weaponry.w == 7.1) {
            weaponry.scrnMargin = 300;
            weaponry.gunHeight = 390;
        }
        weaponry.gunLower(e);
    };
    DuelNeutron.prototype.strafe = function () {
        if (this.ammo <= 0) {
            click2.play();
        }
        else {
            var thisGun = this;
            thisGun.ammo--;
            ammoCount.innerHTML = " " + thisGun.ammo;
            weaponry.w = 7.1;
            weaponPic.setAttribute("src", "Pics/DN110.gif");
            SSamMinigun.play();
            document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event); PlayerWeapon.MGunShotDisplay(event)");
            MachineGun.spendingBullets = setInterval(function () {
                thisGun.ammo--;
                ammoCount.innerHTML = " " + thisGun.ammo;
                if (thisGun.ammo <= 0) {
                    thisGun.stopstrafe();
                    click2.play();
                }
            }, 200);
            if (targeting == true) {
                hitTarget.loseHealth();
                MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 200));
            }
        }
    };
    DuelNeutron.prototype.stopstrafe = function () {
        clearInterval(MachineGun.mghit);
        clearInterval(MachineGun.spendingBullets);
        weaponry.w = 7;
        weaponPic.setAttribute("src", "Pics/DN.png");
        SSamMinigun.stop();
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)");
    };
    DuelNeutron.prototype.switchTo = function () {
        weaponry.w = 7;
        weaponry.scrnMargin = 250;
        ammoCount.innerHTML = "" + this.ammo;
        document.getElementById("wep").style.top = screen.height - weaponry.scrnMargin + "px";
        weaponPic.setAttribute("src", "Pics/DN.png");
        document.body.setAttribute("onmousedown", "PlayerWeapon.strafe()");
        document.body.setAttribute("onmouseup", "PlayerWeapon.stopstrafe()");
        document.body.setAttribute("onmousemove", "PlayerWeapon.gunMove(event)");
    };
    return DuelNeutron;
}(MachineGun));
var chainsaw = new ChainSaw;
var pistol = new Pistol;
var shotgun = new Shotgun;
var minigun = new Minigun;
var dukemgun = new DukeMgun;
var duelneutron = new DuelNeutron;
pistol.ammo = 0;
shotgun.ammo = 0;
minigun.ammo = 0;
dukemgun.ammo = 0;
duelneutron.ammo = 0;
// startingAmmo()
var PlayerWeapon = pistol;
PlayerWeapon.switchTo();
