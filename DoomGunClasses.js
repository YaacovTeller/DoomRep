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
var gunMoveEvent = "Player.weapon.gunMove(event);";
var MgunShotEvent = "Player.weapon.MGunShotDisplay(event);";
var gunConfig = {
    Pistol: {
        damage: 20,
        scrnMargin: 280,
        gunHeight: 390,
    },
    Shotgun: {
        damage: 30,
        scrnMargin: 230,
        gunHeight: 350,
    },
    DukeMgun: {
        damage: 10,
        scrnMargin: 280,
        gunHeight: 390,
    },
    Minigun: {
        damage: 15,
        scrnMargin: 370,
        gunHeight: 480,
    },
    DualNuetron: {
        damage: 10,
        scrnMargin: 250,
        gunHeight: 360,
        firing: {
            scrnMargin: 300,
            gunHeight: 390,
        }
    },
    ChainSaw: {
        damage: 10,
        reach: 240,
        scrnMargin: 280,
        gunHeight: 390,
        firing: {
            scrnMargin: 210,
            gunHeight: 220,
        }
    },
};
//WEAPON
var weaponry = /** @class */ (function () {
    function weaponry() {
    }
    // sliding gun switch
    weaponry.prototype.switchTo = function () {
        $(elements.weaponDiv).animate({ top: '150%' }, 150);
        $(elements.weaponDiv).animate({ top: '90%' }, 150);
        elements.weaponDiv.style.top = window.outerHeight - this.scrnMargin + "px"; //screen.height
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
    weaponry.prototype.gunLower = function (e) {
        var Screen = window.outerHeight; //screen.height;
        var x = e.pageX;
        var y = e.pageY;
        weaponry.cX = x - 44 + "px";
        // Lowers the weapon when the mouse passes the gun height!
        /*cY*/ if (y > (Screen - this.gunHeight)) {
            weaponry.cY = y + 110 + "px";
        }
        else
            weaponry.cY = Screen - this.scrnMargin + "px";
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
                hitTarget.loseHealth(this.damage);
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
        _this_1.gunHeight = gunConfig.Pistol.gunHeight;
        _this_1.scrnMargin = gunConfig.Pistol.scrnMargin;
        _this_1.damage = gunConfig.Pistol.damage;
        return _this_1;
    }
    Pistol.prototype.gunMove = function (e) {
        _super.prototype.gunLower.call(this, e);
    };
    Pistol.prototype.shot = function (e) {
        if (_super.prototype.shot.call(this, e)) {
            weaponry.showBlood(e);
            return true;
        }
    };
    Pistol.prototype.switchTo = function () {
        setTimeout(function () { return Player.weapon = pistol; }, 150);
        _super.prototype.switchTo.call(this);
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
        _this_1.gunHeight = gunConfig.Shotgun.gunHeight;
        _this_1.scrnMargin = gunConfig.Shotgun.scrnMargin;
        _this_1.damage = gunConfig.Shotgun.damage;
        return _this_1;
    }
    Shotgun.prototype.gunMove = function (e) {
        this.gunLower(e);
    };
    Shotgun.prototype.shot = function (e) {
        _super.prototype.shot.call(this, e);
        weaponry.showShot(e);
        return true;
    };
    Shotgun.prototype.switchTo = function () {
        setTimeout(function () { return Player.weapon = shotgun; }, 150);
        _super.prototype.switchTo.call(this);
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
        this.firing = true;
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
        if (targeting == true) {
            MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(_this.damage); }, 200));
        }
    };
    MachineGun.prototype.stopstrafe = function () {
        this.firing = false;
        this.firingSound.stop();
        elements.weaponImg.setAttribute("src", this.gunImage);
        document.body.setAttribute("onmousemove", gunMoveEvent);
        clearInterval(MachineGun.mghit);
        clearInterval(MachineGun.spendingBullets);
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
        _this_1.gunHeight = gunConfig.ChainSaw.gunHeight;
        _this_1.scrnMargin = gunConfig.ChainSaw.scrnMargin;
        _this_1.damage = gunConfig.ChainSaw.damage;
        return _this_1;
    }
    ChainSaw.prototype.gunMove = function (e) {
        this.gunLower(e);
    };
    ChainSaw.chainsawDistanceCheck = function (hitImage) {
        if (hitImage.src.includes("ChainGuy")) { // change (can't chainsaw the boss?)
            return true;
        }
        else if (hitImage.getBoundingClientRect().height > this.chainsawReach) {
            return true; // height/clientHeight/offsetHeight properties wont give real height
        }
        else
            return false;
    };
    ChainSaw.prototype.strafe = function () {
        this.firing = true;
        this.gunHeight = gunConfig.ChainSaw.firing.gunHeight;
        this.scrnMargin = gunConfig.ChainSaw.firing.scrnMargin;
        if (targeting == true && ChainSaw.chainsawDistanceCheck(hitTarget.DOMImage)) {
            hitTarget.loseHealth(this.damage);
            var _this_2 = this;
            MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(_this_2.damage); }, 200));
        }
        elements.weaponImg.setAttribute("src", this.gunImage_firing);
        this.firingSound.play();
        elements.weaponDiv.style.left = weaponry.cX;
        elements.weaponDiv.style.top = weaponry.cY;
    };
    ChainSaw.prototype.stopstrafe = function () {
        this.gunHeight = gunConfig.ChainSaw.gunHeight;
        this.scrnMargin = gunConfig.ChainSaw.scrnMargin;
        clearInterval(MachineGun.mghit);
        elements.weaponImg.setAttribute("src", this.gunImage);
        this.firingSound.stop();
        document.body.setAttribute("onmousemove", gunMoveEvent);
    };
    ChainSaw.prototype.switchTo = function () {
        setTimeout(function () { return Player.weapon = chainsaw; }, 150);
        _super.prototype.switchTo.call(this);
        DOMUpdater.updateAmmoCounter("N/A");
        elements.ammoType.removeAttribute("src");
        SawUp.play();
        setMouseAttributes_MachineGun();
    };
    ChainSaw.chainsawReach = gunConfig.ChainSaw.reach; // target height
    return ChainSaw;
}(MachineGun));
var Minigun = /** @class */ (function (_super) {
    __extends(Minigun, _super);
    function Minigun() {
        var _this_1 = _super !== null && _super.apply(this, arguments) || this;
        _this_1.gunImage = pics.guns.chaingun;
        _this_1.gunImage_firing = pics.guns.chaingun_firing;
        _this_1.gunHeight = gunConfig.Minigun.gunHeight;
        _this_1.scrnMargin = gunConfig.Minigun.scrnMargin;
        _this_1.damage = gunConfig.Minigun.damage;
        _this_1.firingSound = Avpminigun;
        return _this_1;
    }
    Minigun.prototype.gunMove = function (e) {
        this.gunLower(e);
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
            this.spinUp();
            var superStrafe_1 = function () { _super.prototype.strafe.call(_this_1); };
            this.mgfiring = setTimeout(function () {
                Minigun.spinUpCheck = true;
                superStrafe_1();
            }, 1000);
        }
    };
    Minigun.prototype.stopstrafe = function () {
        clearInterval(MachineGun.mghit);
        clearInterval(MachineGun.spendingBullets);
        clearInterval(this.mgfiring);
        clearInterval(this.mgspinning);
        Minigun.spinUpCheck = false;
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
        setTimeout(function () { return Player.weapon = minigun; }, 150);
        _super.prototype.switchTo.call(this);
        DOMUpdater.updateAmmoCounter(this.ammo);
        elements.ammoType.setAttribute("src", pics.ammo.bullets);
        setMouseAttributes_MachineGun();
    };
    Minigun.spinUpCheck = false;
    return Minigun;
}(MachineGun));
var DukeMgun = /** @class */ (function (_super) {
    __extends(DukeMgun, _super);
    function DukeMgun() {
        var _this_1 = _super !== null && _super.apply(this, arguments) || this;
        _this_1.gunImage = pics.guns.dukeMgun;
        _this_1.gunImage_firing = pics.guns.dukeMgun_firing;
        _this_1.gunHeight = gunConfig.DukeMgun.gunHeight;
        _this_1.scrnMargin = gunConfig.DukeMgun.scrnMargin;
        _this_1.damage = gunConfig.DukeMgun.damage;
        _this_1.firingSound = MGun;
        return _this_1;
    }
    DukeMgun.prototype.gunMove = function (e) {
        this.gunLower(e);
    };
    DukeMgun.prototype.strafe = function () {
        if (this.ammo <= 0) {
            click2.play();
        }
        else {
            var thisGun = this;
            thisGun.ammo--;
            DOMUpdater.updateAmmoCounter(thisGun.ammo);
            _super.prototype.strafe.call(this);
        }
    };
    DukeMgun.prototype.stopstrafe = function () {
        _super.prototype.stopstrafe.call(this);
    };
    DukeMgun.prototype.switchTo = function () {
        setTimeout(function () { return Player.weapon = dukemgun; }, 150);
        _super.prototype.switchTo.call(this);
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
        _this_1.gunHeight = gunConfig.DualNuetron.gunHeight;
        _this_1.scrnMargin = gunConfig.DualNuetron.scrnMargin;
        _this_1.damage = gunConfig.DualNuetron.damage;
        _this_1.firingSound = SSamMinigun;
        return _this_1;
    }
    DuelNeutron.prototype.gunMove = function (e) {
        this.gunLower(e);
    };
    DuelNeutron.prototype.strafe = function () {
        this.gunHeight = gunConfig.DualNuetron.firing.gunHeight;
        this.scrnMargin = gunConfig.DualNuetron.firing.scrnMargin;
        if (this.ammo <= 0) {
            click2.play();
        }
        else {
            var thisGun = this;
            thisGun.ammo--;
            DOMUpdater.updateAmmoCounter(thisGun.ammo);
            _super.prototype.strafe.call(this);
        }
    };
    DuelNeutron.prototype.stopstrafe = function () {
        this.gunHeight = gunConfig.DualNuetron.gunHeight;
        this.scrnMargin = gunConfig.DualNuetron.scrnMargin;
        _super.prototype.stopstrafe.call(this);
    };
    DuelNeutron.prototype.switchTo = function () {
        setTimeout(function () { return Player.weapon = duelneutron; }, 150);
        _super.prototype.switchTo.call(this);
        DOMUpdater.updateAmmoCounter(this.ammo);
        elements.ammoType.setAttribute("src", pics.ammo.bullet);
        setMouseAttributes_MachineGun();
    };
    return DuelNeutron;
}(MachineGun));
function setMouseAttributes_Normal() {
    document.body.setAttribute("onmousedown", "Player.weapon.shot(event)");
    document.body.removeAttribute("onmouseup");
    document.body.setAttribute("onmousemove", gunMoveEvent);
}
function setMouseAttributes_MachineGun() {
    document.body.setAttribute("onmousedown", "Player.weapon.strafe()");
    document.body.setAttribute("onmouseup", "Player.weapon.stopstrafe()");
    document.body.setAttribute("onmousemove", gunMoveEvent);
}
// new instance of each weapon. Move?
var chainsaw = new ChainSaw;
var pistol = new Pistol;
var shotgun = new Shotgun;
var minigun = new Minigun;
var dukemgun = new DukeMgun;
var duelneutron = new DuelNeutron;
// startingAmmo()
pistol.ammo = 0;
shotgun.ammo = 0;
minigun.ammo = 0;
dukemgun.ammo = 0;
duelneutron.ammo = 0;
