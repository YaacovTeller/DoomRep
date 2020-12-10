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
var enemyPics = {
    Troop: "pics/Troop.gif",
    ShotGGuy: "pics/ShotGGuy.gif",
    Imp: "pics/Imp.gif",
    ChainGuy: "pics/ChainGuy.gif",
    TroopLeft: "pics/TroopLeft.gif",
    TroopLeft_Tomer: "pics/TroopLeft_Tomer.gif",
    hurt: {
        Troop: "pics/Troop_Hurt.png",
        ShotGGuy: "pics/ShotGGuy_Hurt.png",
        Imp: "pics/Imp_Hurt.png",
        ChainGuy: "pics/ChainGuy_Hurt.png",
    },
    dead: {
        Troop: "pics/Troop_Dead.gif",
        ShotGGuy: "pics/ShotGGuy_Dead.gif",
        Imp: "pics/Imp_Dead.gif",
        ChainGuy: "pics/ChainGuy_DeadEd.gif",
        TroopLeft: "pics/TroopLeft_Dead.gif",
        TroopLeft_Tomer: "pics/TroopLeft_Tomer_Dead.gif",
    }
};
//TheQuickAndTheDead
var redrawing;
var hitTarget;
var hitImage;
var targeting = false;
var playerHealth = 100;
var hurting;
var playerDead = false;
// parent class, handles drawing and damaging.
var target = /** @class */ (function () {
    function target(num, enemy, health) {
        this.deadFlag = false;
        this.health = health;
        this.num = num;
        this.enemy = enemy;
        this.draw();
    }
    target.prototype.draw = function () {
        var img = document.createElement("img");
        img.setAttribute('class', "target");
        img.setAttribute('id', "tgt" + this.num);
        img.setAttribute('onmouseenter', "tgt" + this.num + ".MGhit()");
        img.setAttribute('onmouseleave', "tgt" + this.num + ".MGhitEnd()");
        img.setAttribute('src', enemyPics[this.enemy]);
        img.setAttribute('draggable', "false");
        elements.targetBackdrop.appendChild(img);
        this.DOMImage = img;
    };
    target.prototype.redraw = function () {
        if (hitTarget.deadFlag == false) {
            hitImage = hitTarget.DOMImage;
            hitImage.setAttribute("src", enemyPics[hitTarget.enemy]);
        }
    };
    // All target damaging: calls `redraw` and `die`
    target.prototype.loseHealth = function () {
        if (weaponry.w == 2) {
            hitTarget.healthUnit = 10;
        }
        else if (weaponry.w == 3) {
            hitTarget.healthUnit = 30;
        }
        else if (weaponry.w == 1 || weaponry.w == 4 || weaponry.w == 7 || weaponry.w == 4.1 || weaponry.w == 7.1 || weaponry.w == 1.1 || weaponry.w == 6 || weaponry.w == 6.1) {
            hitTarget.healthUnit = 10;
        }
        hitTarget.health -= hitTarget.healthUnit;
        // Changes image to 'hurt' image
        hitImage = document.getElementById("tgt" + this.num);
        hitImage.setAttribute("src", enemyPics.hurt[this.enemy]);
        // Here, the Boss uses the "loseHealth" function, with a condition
        if (this.enemy == "ChainGuy") {
            elements.Bar.style.width = tgt22.health / 2 + "%";
        }
        if (this.health <= 0) {
            this.die();
        }
        // Calls redraw to reset
        else {
            redrawing = setTimeout(hitTarget.redraw, 200);
        }
    };
    // The machine gun damage function
    target.prototype.MGhit = function () {
        hitTarget = this;
        targeting = true;
        hitImage = document.getElementById("tgt" + hitTarget.num);
        // Checks if machine guns (7 and 4) or chainsaw (1) are being fired
        if (weaponry.w == 7.1 || weaponry.w == 6.1) {
            MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 100));
        }
        else if (weaponry.w == 1.1) { //NEEDS FIXING, ALL ARE 300px
            if (ChainSaw.chainsawDistanceCheck(hitImage)) {
                MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 100));
            }
        }
        else if (weaponry.w == 4.1) {
            if (minigun.spinUpCheck == true) {
                MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 100));
            }
        }
    };
    target.prototype.MGhitEnd = function () {
        clearInterval(MachineGun.mghit);
        targeting = false;
        // hitTarget = null;
    };
    target.deadCount = 0;
    target.objectCount = 0;
    target.extraCount = 0;
    return target;
}());
var regEnemy = /** @class */ (function (_super) {
    __extends(regEnemy, _super);
    function regEnemy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    regEnemy.prototype.draw = function () {
        _super.prototype.draw.call(this);
        target.objectCount++;
    };
    regEnemy.prototype.die = function () {
        this.deadFlag = true;
        clearInterval(MachineGun.mghit);
        this.body = document.getElementById("tgt" + this.num);
        this.body.style.animationPlayState = "paused";
        this.body.setAttribute("src", enemyPics.dead[this.enemy] + "?a=" + Math.random());
        this.body.style.pointerEvents = "none";
        clearInterval(this.attackRoller);
        clearInterval(hurting);
        target.deadCount++;
        elements.killCounter.innerHTML = "Kills:" + (target.deadCount + target.extraCount);
        levelCheck();
        this.deadSound();
    };
    regEnemy.prototype.hitRoll = function (damageNumber) {
        if (playerDead == false) {
            var die = (Math.floor(Math.random() * 7));
            if (die == 6) {
                hitWarning();
                if (riotShieldDeployed == false) {
                    hurting = setTimeout(function () {
                        // if (riotShieldDeployed == false) {
                        playerHealth -= damageNumber;
                        if (playerHealth > 0) {
                            elements.health.innerHTML = "Health: " + playerHealth;
                            document.body.style.animationName = "hit";
                            Hlifescream1.play();
                            setTimeout(function () { document.body.style.removeProperty("animation-name"); }, 1100);
                        }
                        else {
                            playerDeath();
                        }
                        // }
                        // else Turicochet.play();
                    }, 1000);
                }
                else {
                    setTimeout(function () {
                        Turicochet.play(); /* riotShield.style.animation = "shieldhit 0.5s"; */
                    }, 1000);
                }
            }
        }
    };
    regEnemy.prototype.inflictDamage = function (damageNumber, attackFrequency) {
        var firingEnemy = this;
        this.attackRoller = setInterval(function () { firingEnemy.hitRoll(damageNumber); }, attackFrequency);
    };
    regEnemy.regEnemyArray = new Array();
    return regEnemy;
}(target));
var Troop = /** @class */ (function (_super) {
    __extends(Troop, _super);
    function Troop(num, enemy, health) {
        var _this = _super.call(this, num, enemy, health) || this;
        _this.damageNumber = 10;
        _this.attackFrequency = 2000;
        _this.inflictDamage(_this.damageNumber, _this.attackFrequency);
        return _this;
    }
    Troop.prototype.deadSound = function () {
        ded2.play();
    };
    return Troop;
}(regEnemy));
var ShotGGuy = /** @class */ (function (_super) {
    __extends(ShotGGuy, _super);
    function ShotGGuy(num, enemy, health) {
        var _this = _super.call(this, num, enemy, health) || this;
        _this.damageNumber = 20;
        _this.attackFrequency = 2000;
        _this.inflictDamage(_this.damageNumber, _this.attackFrequency);
        return _this;
    }
    ShotGGuy.prototype.deadSound = function () {
        ded.play();
    };
    return ShotGGuy;
}(regEnemy));
var Imp = /** @class */ (function (_super) {
    __extends(Imp, _super);
    function Imp(num, enemy, health) {
        var _this = _super.call(this, num, enemy, health) || this;
        _this.damageNumber = 15;
        _this.attackFrequency = 2000;
        _this.inflictDamage(_this.damageNumber, _this.attackFrequency);
        return _this;
    }
    Imp.prototype.deadSound = function () {
        ded2.play();
    };
    return Imp;
}(regEnemy));
var ExtraTarget = /** @class */ (function (_super) {
    __extends(ExtraTarget, _super);
    function ExtraTarget(num, enemy, health) {
        return _super.call(this, num, enemy, health) || this;
    }
    ExtraTarget.prototype.draw = function () {
        _super.prototype.draw.call(this);
        target.extraCount++;
    };
    ExtraTarget.prototype.die = function () {
        this.deadFlag = true;
        clearInterval(MachineGun.mghit);
        this.body = document.getElementById("tgt" + this.num);
        this.body.style.animationPlayState = "paused";
        this.body.setAttribute("src", enemyPics.dead[this.enemy] + "?a=" + Math.random());
        this.body.style.pointerEvents = "none";
        if (this.enemy == "Troop") {
            ded2.play();
        }
        else if (this.enemy == "SGunG") {
            ded.play();
        }
        else if (this.enemy == "Imp") {
            ded.play();
        }
        updateKillCounter(target.deadCount + target.extraCount);
        this.deadSound();
    };
    ExtraTarget.prototype.deadSound = function () {
        ded2.play();
    };
    return ExtraTarget;
}(target));
var Boss = /** @class */ (function (_super) {
    __extends(Boss, _super);
    function Boss(num, enemy, health) {
        var _this = _super.call(this, num, enemy, health) || this;
        _this.damageNumber = 30;
        _this.attackFrequency = 300;
        _this.inflictDamage(_this.damageNumber, _this.attackFrequency);
        return _this;
    }
    Boss.prototype.fillBar = function () {
        showElement(elements.Bar);
        elements.Bar.style.width = "100%";
    };
    Boss.prototype.die = function () {
        this.deadFlag = true;
        clearInterval(MachineGun.mghit);
        clearInterval(this.attackRoller);
        clearInterval(hurting);
        var Boss = document.getElementById("tgt22");
        var Bar = elements.Bar;
        Bar.style.width = "0%";
        Boss.removeAttribute("onmouseenter");
        Boss.removeAttribute("onmousedown");
        Boss.setAttribute("src", enemyPics.dead.ChainGuy);
        updateKillCounter(target.deadCount + target.extraCount);
        //   elements.killCounter.innerHTML = `Kills:${target.deadCount + target.extraCount}`;
        this.deadSound();
        stopTimer();
        //Deuscredits.stop();
        finishMessage();
    };
    Boss.prototype.deadSound = function () {
        if (this.enemy == "ChainGuy") {
            bossDed.play();
        }
    };
    return Boss;
}(regEnemy));
