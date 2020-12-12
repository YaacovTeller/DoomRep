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
var gunMoveEvent = "PlayerWeapon.gunMove(event);";
var MgunShotEvent = "PlayerWeapon.MGunShotDisplay(event);";
//WEAPON
var weaponry = /** @class */ (function () {
    function weaponry() {
    }
    // sliding gun switch
    weaponry.prototype.switchTo = function () {
        $(elements.weaponDiv).animate({ top: '150%' }, 150);
        $(elements.weaponDiv).animate({ top: '90%' }, 150);
        elements.weaponDiv.style.top = window.outerHeight - weaponry.scrnMargin + "px"; //screen.height
        elements.weaponImg.setAttribute("src", this.gunImage);
    };
    ;
    weaponry.showBlood = function (e) {
        this.displayScreenElement(e, elements.blood, 10, 10, 100);
        elements.blood.setAttribute("src", pics.blood + "?a=" + Math.random()); // FIX?
    };
    weaponry.showShot = function (e) {
        this.displayScreenElement(e, elements.oneshot, 50, 50, 10);
    };
    weaponry.displayScreenElement = function (e, elem, xOffset, yOffset, duration) {
        var x = e.pageX;
        var y = e.pageY;
        showElement(elem);
        elem.style.left = x - xOffset + "px";
        elem.style.top = y - yOffset + "px";
        setTimeout(function () { return hideElement(elem); }, duration);
    };
    weaponry.gunLower = function (e) {
        var Screen = window.outerHeight; //screen.height;
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
var regGun = /** @class */ (function (_super) {
    __extends(regGun, _super);
    function regGun() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    regGun.prototype.ricochet = function () {
        var regGunSounds = new Array(Bullet1, Bullet2, Bullet3);
        _super.prototype.ricochet.call(this, regGunSounds);
    };
    regGun.prototype.shot = function (e) {
        if (this.ammo <= 0) {
            click2.play();
            return false;
        }
        else {
            this.ammo--;
            DOMUpdater.updateAmmoCounter(this.ammo);
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
    };
    return regGun;
}(weaponry));
var Pistol = /** @class */ (function (_super) {
    __extends(Pistol, _super);
    function Pistol() {
        var _this_1 = _super !== null && _super.apply(this, arguments) || this;
        _this_1.firingSound = Pshot;
        _this_1.gunImage = pics.guns.pistol;
        return _this_1;
    }
    Pistol.prototype.gunMove = function (e) {
        weaponry.scrnMargin = 280;
        weaponry.gunHeight = 390;
        weaponry.gunLower(e);
    };
    Pistol.prototype.shot = function (e) {
        if (_super.prototype.shot.call(this, e)) {
            weaponry.showBlood(e);
            return true;
        }
    };
    Pistol.prototype.switchTo = function () {
        setTimeout(function () { return PlayerWeapon = pistol; }, 150);
        _super.prototype.switchTo.call(this);
        weaponry.w = 2;
        weaponry.scrnMargin = 280;
        DOMUpdater.updateAmmoCounter(this.ammo);
        elements.ammoType.setAttribute("src", pics.ammo.bullet);
        setMouseAttributes_Normal();
    };
    return Pistol;
}(regGun));
var Shotgun = /** @class */ (function (_super) {
    __extends(Shotgun, _super);
    function Shotgun() {
        var _this_1 = _super !== null && _super.apply(this, arguments) || this;
        _this_1.firingSound = SGshot;
        _this_1.gunImage = pics.guns.shotgun;
        return _this_1;
    }
    Shotgun.prototype.gunMove = function (e) {
        weaponry.scrnMargin = 230;
        weaponry.gunHeight = 350;
        weaponry.gunLower(e);
    };
    Shotgun.prototype.shot = function (e) {
        _super.prototype.shot.call(this, e);
        weaponry.showShot(e);
        return true;
    };
    Shotgun.prototype.switchTo = function () {
        setTimeout(function () { return PlayerWeapon = shotgun; }, 150);
        _super.prototype.switchTo.call(this);
        weaponry.w = 3;
        weaponry.scrnMargin = 230;
        DOMUpdater.updateAmmoCounter(this.ammo);
        elements.ammoType.setAttribute("src", pics.ammo.shell);
        setMouseAttributes_Normal();
    };
    return Shotgun;
}(regGun));
var MachineGun = /** @class */ (function (_super) {
    __extends(MachineGun, _super);
    function MachineGun() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MachineGun.prototype.strafe = function () {
        var _this_1 = this;
        document.addEventListener('mouseleave', function (e) {
            _this_1.stopstrafe();
        });
        elements.weaponImg.setAttribute("src", this.gunImage_firing);
        this.firingSound.play();
        document.body.setAttribute("onmousemove", gunMoveEvent);
        var _this = this;
        MachineGun.spendingBullets = setInterval(function () {
            _this.ammo--;
            DOMUpdater.updateAmmoCounter(_this.ammo);
            if (_this.ammo <= 0) {
                _this.stopstrafe();
                click2.play();
            }
        }, 200);
    };
    MachineGun.prototype.stopstrafe = function () {
        clearInterval(MachineGun.mghit);
        clearInterval(MachineGun.spendingBullets);
        elements.weaponImg.setAttribute("src", this.gunImage);
        this.firingSound.stop();
        document.body.setAttribute("onmousemove", gunMoveEvent);
    };
    MachineGun.prototype.MGunShotDisplay = function (e) {
        if (targeting == false) {
            this.ricochet();
        }
        else /*Bullet4.play()*/
            ;
        weaponry.showShot(e);
    };
    MachineGun.prototype.ricochet = function () {
        var machineGunSounds = new Array(Bullet5, Bullet6, Bullet7, Bullet8);
        _super.prototype.ricochet.call(this, machineGunSounds);
    };
    return MachineGun;
}(weaponry));
var ChainSaw = /** @class */ (function (_super) {
    __extends(ChainSaw, _super);
    function ChainSaw() {
        var _this_1 = _super !== null && _super.apply(this, arguments) || this;
        _this_1.firingSound = Saw;
        _this_1.gunImage = pics.guns.chainsaw;
        _this_1.gunImage_firing = pics.guns.chainsaw_firing;
        return _this_1;
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
        if (targeting == true && ChainSaw.chainsawDistanceCheck(hitTarget.DOMImage)) {
            hitTarget.loseHealth();
            MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 200));
        }
        weaponry.w = 1.1;
        weaponry.scrnMargin = 210;
        elements.weaponImg.setAttribute("src", this.gunImage_firing);
        this.firingSound.play();
        elements.weaponDiv.style.left = weaponry.cX;
        elements.weaponDiv.style.top = weaponry.cY;
    };
    ChainSaw.prototype.stopstrafe = function () {
        clearInterval(MachineGun.mghit);
        elements.weaponImg.setAttribute("src", this.gunImage);
        this.firingSound.stop();
        document.body.setAttribute("onmousemove", gunMoveEvent);
        weaponry.w = 1;
    };
    ChainSaw.prototype.switchTo = function () {
        setTimeout(function () { return PlayerWeapon = chainsaw; }, 150);
        _super.prototype.switchTo.call(this);
        weaponry.w = 1;
        weaponry.scrnMargin = 305;
        DOMUpdater.updateAmmoCounter("N/A");
        elements.ammoType.removeAttribute("src");
        SawUp.play();
        setMouseAttributes_MachineGun();
    };
    ChainSaw.chainsawReach = 240; // target height
    return ChainSaw;
}(weaponry));
var Minigun = /** @class */ (function (_super) {
    __extends(Minigun, _super);
    function Minigun() {
        var _this_1 = _super !== null && _super.apply(this, arguments) || this;
        _this_1.spinUpCheck = false;
        _this_1.gunImage = pics.guns.chaingun;
        _this_1.gunImage_firing = pics.guns.chaingun_firing;
        _this_1.firingSound = Avpminigun;
        return _this_1;
    }
    Minigun.prototype.gunMove = function (e) {
        if (weaponry.w == 4) {
            weaponry.scrnMargin = 370;
            weaponry.gunHeight = 480;
        }
        weaponry.gunLower(e);
    };
    Minigun.prototype.spinUp = function () {
        elements.weaponImg.setAttribute("src", pics.guns.chaingun_spinup);
        SSamRotate2.play();
        this.mgspinning = setTimeout(function () {
            SSamRotate.play();
        }, 700);
    };
    Minigun.prototype.strafe = function () {
        var _this_1 = this;
        if (this.ammo <= 0) {
            click2.play();
        }
        else {
            var thisGun = this;
            this.spinUp();
            var superFire_1 = function () { _super.prototype.strafe.call(_this_1); };
            this.mgfiring = setTimeout(function () {
                thisGun.spinUpCheck = true;
                weaponry.w = 4.1;
                superFire_1();
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
            elements.weaponImg.setAttribute("src", this.gunImage);
        }
        else
            elements.weaponImg.setAttribute("src", pics.guns.chaingun_frame2);
        // SSamMinigun.stop();
        // SSamMinigun2.stop();
        this.firingSound.stop();
        SSamRotate.stop();
        document.body.setAttribute("onmousemove", gunMoveEvent);
    };
    Minigun.prototype.switchTo = function () {
        setTimeout(function () { return PlayerWeapon = minigun; }, 150);
        _super.prototype.switchTo.call(this);
        weaponry.w = 4;
        weaponry.scrnMargin = 370;
        DOMUpdater.updateAmmoCounter(this.ammo);
        elements.ammoType.setAttribute("src", pics.ammo.bullets);
        setMouseAttributes_MachineGun();
    };
    return Minigun;
}(MachineGun));
var DukeMgun = /** @class */ (function (_super) {
    __extends(DukeMgun, _super);
    function DukeMgun() {
        var _this_1 = _super !== null && _super.apply(this, arguments) || this;
        _this_1.gunImage = pics.guns.dukeMgun;
        _this_1.gunImage_firing = pics.guns.dukeMgun_firing;
        _this_1.firingSound = MGun;
        return _this_1;
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
            DOMUpdater.updateAmmoCounter(thisGun.ammo);
            weaponry.w = 6.1;
            _super.prototype.strafe.call(this);
            if (targeting == true) {
                hitTarget.loseHealth();
                MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 200));
            }
        }
    };
    DukeMgun.prototype.stopstrafe = function () {
        _super.prototype.stopstrafe.call(this);
        weaponry.w = 6;
    };
    DukeMgun.prototype.switchTo = function () {
        setTimeout(function () { return PlayerWeapon = dukemgun; }, 150);
        _super.prototype.switchTo.call(this);
        weaponry.w = 6;
        weaponry.scrnMargin = 250;
        DOMUpdater.updateAmmoCounter(this.ammo);
        elements.ammoType.setAttribute("src", pics.ammo.bullets);
        setMouseAttributes_MachineGun();
    };
    return DukeMgun;
}(MachineGun));
var DuelNeutron = /** @class */ (function (_super) {
    __extends(DuelNeutron, _super);
    function DuelNeutron() {
        var _this_1 = _super !== null && _super.apply(this, arguments) || this;
        _this_1.gunImage = pics.guns.dualNuetron;
        _this_1.gunImage_firing = pics.guns.dualNuetron_firing;
        _this_1.firingSound = SSamMinigun;
        return _this_1;
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
            DOMUpdater.updateAmmoCounter(thisGun.ammo);
            weaponry.w = 7.1;
            _super.prototype.strafe.call(this);
            if (targeting == true) {
                hitTarget.loseHealth();
                MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 200));
            }
        }
    };
    DuelNeutron.prototype.stopstrafe = function () {
        _super.prototype.stopstrafe.call(this);
        weaponry.w = 7;
    };
    DuelNeutron.prototype.switchTo = function () {
        setTimeout(function () { return PlayerWeapon = duelneutron; }, 150);
        _super.prototype.switchTo.call(this);
        weaponry.w = 7;
        weaponry.scrnMargin = 250;
        DOMUpdater.updateAmmoCounter(this.ammo);
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
