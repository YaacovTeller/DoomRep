"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var pics = {
    guns: {
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
};
var gunMoveEvent = "PlayerWeapon.gunMove(event);";
var MgunShotEvent = "PlayerWeapon.MGunShotDisplay(event);";
//WEAPON
var weaponry = /** @class */ (function () {
    function weaponry() {
    }
    weaponry.showBlood = function (e) {
        var x = e.pageX;
        var y = e.pageY;
        var blood = elements.blood;
        showElement(blood);
        blood.style.left = x - 10 + "px";
        blood.style.top = y - 10 + "px";
        blood.setAttribute("src", pics.blood + "?a=" + Math.random());
        setTimeout(function () { return hideElement(blood); }, 100);
    };
    ;
    weaponry.gunLower = function (e) {
        var Screen = screen.height;
        var x = e.pageX;
        var y = e.pageY;
        weaponry.cX = x - 44 + "px";
        // Lowers the weapon when the mouse passes the gun height!
        /*cY*/ if (y > (Screen - weaponry.gunHeight)) {
            weaponry.cY = y + 110 + "px";
        }
        else
            weaponry.cY = Screen - weaponry.scrnMargin + "px";
        elements.weaponDiv.style.left = weaponry.cX;
        elements.weaponDiv.style.top = weaponry.cY;
    };
    weaponry.prototype.ricochet = function (sounds) {
        var length = sounds.length;
        var randNum = Math.floor(Math.random() * (length) + 1);
        sounds[randNum - 1].play();
    };
    weaponry.w = 2; //Sets weapon to pistol at the start
    return weaponry;
}());
// elements.weaponDiv.style.left = weaponry.cX;
// elements.weaponDiv.style.top = weaponry.cY;   //check for neccessity in strafe
var MachineGun = /** @class */ (function (_super) {
    __extends(MachineGun, _super);
    function MachineGun() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MachineGun.prototype.strafe = function () {
        var _this = this;
        document.addEventListener('mouseleave', function (e) {
            _this.stopstrafe();
        });
    };
    MachineGun.prototype.MGunShotDisplay = function (e) {
        if (targeting == false) {
            this.ricochet();
        }
        else /*Bullet4.play()*/
            ;
        var x = e.pageX;
        var y = e.pageY;
        var shot = elements.oneshot;
        showElement(shot);
        shot.style.left = x - 50 + "px";
        shot.style.top = y - 50 + "px";
        setTimeout(function () { return hideElement(shot); }, 10);
    };
    MachineGun.prototype.ricochet = function () {
        var machineGunSounds = new Array(Bullet5, Bullet6, Bullet7, Bullet8);
        _super.prototype.ricochet.call(this, machineGunSounds);
    };
    return MachineGun;
}(weaponry));
var regGun = /** @class */ (function (_super) {
    __extends(regGun, _super);
    function regGun() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    regGun.prototype.ricochet = function () {
        var regGunSounds = new Array(Bullet1, Bullet2, Bullet3);
        _super.prototype.ricochet.call(this, regGunSounds);
    };
    return regGun;
}(weaponry));
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
    ChainSaw.chainsawDistanceCheck = function (hitImage) {
        if (hitImage.src.includes("ChainGuy")) { // change (can't chainsaw the boss)
            return true;
        }
        else if (hitImage.getBoundingClientRect().height > this.chainsawReach) {
            return true; // height/clientHeight/offsetHeight properties wont give real height
        }
        else
            return false;
    };
    ChainSaw.prototype.strafe = function () {
        hitImage = document.getElementById("tgt" + hitTarget.num);
        if (targeting == true && ChainSaw.chainsawDistanceCheck(hitImage)) {
            hitTarget.loseHealth();
            MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 200));
        }
        weaponry.w = 1.1;
        weaponry.scrnMargin = 210;
        elements.weaponImg.setAttribute("src", pics.guns.chainsaw);
        Saw.play();
        elements.weaponDiv.style.left = weaponry.cX;
        elements.weaponDiv.style.top = weaponry.cY;
    };
    ChainSaw.prototype.stopstrafe = function () {
        clearInterval(MachineGun.mghit);
        weaponry.w = 1;
        elements.weaponImg.setAttribute("src", pics.guns.chainsaw_firing);
        Saw.stop();
        document.body.setAttribute("onmousemove", gunMoveEvent);
    };
    ChainSaw.prototype.switchTo = function () {
        PlayerWeapon = chainsaw;
        weaponry.w = 1;
        weaponry.scrnMargin = 305;
        elements.ammoCount.innerHTML = "N/A";
        elements.weaponDiv.style.top = screen.height - weaponry.scrnMargin + "px";
        elements.weaponImg.setAttribute("src", pics.guns.chainsaw_firing);
        elements.ammoType.removeAttribute("src");
        SawUp.play();
        setMouseAttributes_MachineGun();
    };
    ChainSaw.chainsawReach = 240; // target height
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
            elements.ammoCount.innerHTML = "" + this.ammo;
            if (targeting == false) {
                this.ricochet();
            }
            else {
                hitTarget.loseHealth(); /* Bullet4.play() */
                ;
                weaponry.showBlood(e);
            }
            Pshot.play();
        }
    };
    Pistol.prototype.switchTo = function () {
        PlayerWeapon = pistol;
        weaponry.w = 2;
        elements.ammoCount.innerHTML = "" + this.ammo;
        weaponry.scrnMargin = 280;
        elements.weaponDiv.style.top = screen.height - weaponry.scrnMargin + "px";
        elements.weaponImg.setAttribute("src", pics.guns.pistol);
        elements.ammoType.setAttribute("src", pics.ammo.bullet);
        setMouseAttributes_Normal();
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
            elements.ammoCount.innerHTML = "" + this.ammo;
            if (targeting == false) {
                this.ricochet();
            }
            else { /*Bullet4.play()*/
                ;
                hitTarget.loseHealth();
            }
            var x = e.pageX;
            var y = e.pageY;
            SGshot.play();
            var shot_1 = elements.oneshot;
            showElement(shot_1);
            shot_1.style.left = x - 50 + "px";
            shot_1.style.top = y - 50 + "px";
            setTimeout(function () { return hideElement(shot_1); }, 100);
        }
    };
    Shotgun.prototype.switchTo = function () {
        PlayerWeapon = shotgun;
        weaponry.w = 3;
        weaponry.scrnMargin = 230;
        elements.ammoCount.innerHTML = "" + this.ammo;
        elements.weaponDiv.style.top = screen.height - weaponry.scrnMargin + "px";
        elements.weaponImg.setAttribute("src", pics.guns.shotgun);
        elements.ammoType.setAttribute("src", pics.ammo.shell);
        setMouseAttributes_Normal();
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
        elements.ammoCount.innerHTML += "200";
    };
    Minigun.prototype.gunMove = function (e) {
        if (weaponry.w == 4) {
            weaponry.scrnMargin = 370;
            weaponry.gunHeight = 480;
        }
        weaponry.gunLower(e);
    };
    Minigun.prototype.spinUp = function () {
        elements.weaponImg.setAttribute("src", pics.guns.chainsaw_spinup);
        SSamRotate2.play();
        this.mgspinning = setTimeout(function () {
            SSamRotate.play();
        }, 700);
    };
    Minigun.prototype.strafe = function () {
        _super.prototype.strafe.call(this);
        if (this.ammo <= 0) {
            click2.play();
        }
        else {
            var thisGun = this;
            this.spinUp();
            this.mgfiring = setTimeout(function () {
                thisGun.spinUpCheck = true;
                weaponry.w = 4.1;
                elements.weaponImg.setAttribute("src", pics.guns.chaingun_firing);
                Avpminigun.play();
                document.body.setAttribute("onmousemove", gunMoveEvent + MgunShotEvent);
                MachineGun.spendingBullets = setInterval(function () {
                    thisGun.ammo--;
                    elements.ammoCount.innerHTML = " " + thisGun.ammo;
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
        var randNum = Math.floor(Math.random() * (2 - 1 + 1) + 1);
        if (randNum == 1) {
            elements.weaponImg.setAttribute("src", pics.guns.chaingun);
        }
        else
            elements.weaponImg.setAttribute("src", pics.guns.chainsaw_frame2);
        // SSamMinigun.stop();
        // SSamMinigun2.stop();
        Avpminigun.stop();
        SSamRotate.stop();
        document.body.setAttribute("onmousemove", gunMoveEvent);
    };
    Minigun.prototype.switchTo = function () {
        PlayerWeapon = minigun;
        weaponry.w = 4;
        weaponry.scrnMargin = 370;
        elements.ammoCount.innerHTML = "" + this.ammo;
        elements.weaponDiv.style.top = screen.height - weaponry.scrnMargin + "px";
        elements.weaponImg.setAttribute("src", pics.guns.chaingun);
        elements.ammoType.setAttribute("src", pics.ammo.bullets);
        setMouseAttributes_MachineGun();
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
        _super.prototype.strafe.call(this);
        if (this.ammo <= 0) {
            click2.play();
        }
        else {
            var thisGun = this;
            thisGun.ammo--;
            elements.ammoCount.innerHTML = " " + thisGun.ammo;
            weaponry.w = 6.1;
            elements.weaponImg.setAttribute("src", pics.guns.dukeMgun_firing);
            MGun.play();
            document.body.setAttribute("onmousemove", gunMoveEvent + MgunShotEvent);
            MachineGun.spendingBullets = setInterval(function () {
                thisGun.ammo--;
                elements.ammoCount.innerHTML = " " + thisGun.ammo;
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
        elements.weaponImg.setAttribute("src", pics.guns.dukeMgun);
        MGun.stop();
        document.body.setAttribute("onmousemove", gunMoveEvent);
    };
    DukeMgun.prototype.switchTo = function () {
        PlayerWeapon = dukemgun;
        weaponry.w = 6;
        weaponry.scrnMargin = 250;
        elements.ammoCount.innerHTML = "" + this.ammo;
        elements.weaponDiv.style.top = screen.height - weaponry.scrnMargin + "px";
        elements.weaponImg.setAttribute("src", pics.guns.dukeMgun);
        elements.ammoType.setAttribute("src", pics.ammo.bullets);
        setMouseAttributes_MachineGun();
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
        _super.prototype.strafe.call(this);
        if (this.ammo <= 0) {
            click2.play();
        }
        else {
            var thisGun = this;
            thisGun.ammo--;
            elements.ammoCount.innerHTML = " " + thisGun.ammo;
            weaponry.w = 7.1;
            elements.weaponImg.setAttribute("src", pics.guns.dualNuetron_firing);
            SSamMinigun.play();
            document.body.setAttribute("onmousemove", gunMoveEvent);
            MachineGun.spendingBullets = setInterval(function () {
                thisGun.ammo--;
                elements.ammoCount.innerHTML = " " + thisGun.ammo;
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
        elements.weaponImg.setAttribute("src", pics.guns.dualNuetron);
        SSamMinigun.stop();
        document.body.setAttribute("onmousemove", gunMoveEvent);
    };
    DuelNeutron.prototype.switchTo = function () {
        PlayerWeapon = duelneutron;
        weaponry.w = 7;
        weaponry.scrnMargin = 250;
        elements.ammoCount.innerHTML = "" + this.ammo;
        elements.weaponDiv.style.top = screen.height - weaponry.scrnMargin + "px";
        elements.weaponImg.setAttribute("src", pics.guns.dualNuetron);
        elements.ammoType.setAttribute("src", pics.ammo.bullet);
        setMouseAttributes_MachineGun();
    };
    return DuelNeutron;
}(MachineGun));
function setMouseAttributes_Normal() {
    document.body.setAttribute("onmousedown", "PlayerWeapon.shot(event)");
    document.body.removeAttribute("onmouseup");
    document.body.setAttribute("onmousemove", gunMoveEvent);
}
function setMouseAttributes_MachineGun() {
    document.body.setAttribute("onmousedown", "PlayerWeapon.strafe()");
    document.body.setAttribute("onmouseup", "PlayerWeapon.stopstrafe()");
    document.body.setAttribute("onmousemove", gunMoveEvent);
}
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
var slungWeapon;
PlayerWeapon.switchTo();
