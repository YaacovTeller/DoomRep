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
//TheQuickAndTheDead
var redrawing;
var hitTarget;
var targeting = false;
var hurting;
// parent class, handles drawing and damaging.
var target = /** @class */ (function () {
    function target(num, enemy, health) {
        this.deadFlag = false;
        this.health = health;
        this.num = num;
        this.enemy = enemy;
        this.draw();
    }
    // The abstract "die" function. Implemented differently by the two child classes
    target.prototype.die = function () {
        this.deadFlag = true;
        clearInterval(MachineGun.mghit);
        this.DOMImage.style.animationPlayState = "paused";
        this.DOMImage.setAttribute("src", enemyPics.dead[this.enemy] + "?a=" + Math.random());
        this.DOMImage.style.pointerEvents = "none";
        this.deadSound();
    };
    target.prototype.draw = function () {
        var _this = this;
        var img = document.createElement("img");
        img.setAttribute('class', "target infiniteAlternateReverse");
        img.setAttribute('id', "tgt" + this.num);
        img.onmouseover = function () { return _this.MGhit(); };
        img.onmouseleave = function () { return _this.MGhitEnd(); };
        img.setAttribute('src', enemyPics[this.enemy]);
        img.setAttribute('draggable', "false");
        elements.targetBackdrop.appendChild(img);
        this.DOMImage = img;
    };
    target.prototype.redraw = function () {
        if (hitTarget.deadFlag == false) {
            var hitImage = hitTarget.DOMImage;
            hitImage.setAttribute("src", enemyPics[hitTarget.enemy]);
        }
    };
    target.prototype.undraw = function () {
        $(this.DOMImage).fadeOut(300, function () { $(this).remove(); });
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
        var hitImage = hitTarget.DOMImage;
        hitImage.setAttribute("src", enemyPics.hurt[this.enemy]);
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
        var hitImage = hitTarget.DOMImage;
        // Checks if machine guns (7 and 4) or chainsaw (1) are being fired
        if (weaponry.w == 7.1 || weaponry.w == 6.1) {
            MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 100));
        }
        else if (weaponry.w == 1.1) {
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
    target.targetCount = 0;
    target.deadCount = 0;
    target.extraCount = 0;
    target.deadExtraCount = 0;
    return target;
}());
var regEnemy = /** @class */ (function (_super) {
    __extends(regEnemy, _super);
    function regEnemy(num, enemy, health) {
        return _super.call(this, num, enemy, health) || this;
    }
    regEnemy.prototype.draw = function () {
        _super.prototype.draw.call(this);
        target.targetCount++;
    };
    regEnemy.prototype.die = function () {
        _super.prototype.die.call(this);
        clearInterval(this.attackRoller);
        clearInterval(hurting);
        target.deadCount++;
        DOMUpdater.updateKillCounter(target.deadCount + target.deadExtraCount);
        levelCheck();
    };
    regEnemy.prototype.hitRoll = function (damage) {
        if (Player.dead == false) {
            var die = (Math.floor(Math.random() * 7));
            if (die == 6) {
                hitWarning();
                if (riotShieldDeployed == false) {
                    Player.damageCheck(damage);
                }
                else {
                    setTimeout(function () {
                        Turicochet.play(); /* riotShield.style.animation = "shieldhit 0.5s"; */
                    }, 1000);
                }
            }
        }
    };
    regEnemy.prototype.inflictDamage = function (damage, attackFrequency) {
        if (!damage)
            return;
        var firingEnemy = this;
        this.attackRoller = setInterval(function () { firingEnemy.hitRoll(damage); }, attackFrequency);
    };
    regEnemy.regEnemyArray = new Array();
    return regEnemy;
}(target));
var Troop = /** @class */ (function (_super) {
    __extends(Troop, _super);
    function Troop(num, health) {
        var _this = _super.call(this, num, "Troop", health) || this;
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
    function ShotGGuy(num, health) {
        var _this = _super.call(this, num, "ShotGGuy", health) || this;
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
    function Imp(num, health) {
        var _this = _super.call(this, num, "Imp", health) || this;
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
        this.DOMImage.classList.remove("infiniteAlternateReverse");
        target.extraCount++;
    };
    ExtraTarget.prototype.die = function () {
        _super.prototype.die.call(this);
        target.deadExtraCount++;
    };
    ExtraTarget.prototype.deadSound = function () {
        if (this.enemy == "Troop") {
            ded2.play();
        }
        else if (this.enemy == "SGunG") {
            ded.play();
        }
        else if (this.enemy == "Imp") {
            ded.play();
        }
    };
    ExtraTarget.extraTargetArray = new Array();
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
    Boss.prototype.loseHealth = function () {
        _super.prototype.loseHealth.call(this);
        elements.Bar.style.width = this.health / 2 + "%";
    };
    Boss.prototype.die = function () {
        this.deadFlag = true;
        clearInterval(MachineGun.mghit);
        clearInterval(this.attackRoller);
        clearInterval(hurting);
        var Bar = elements.Bar;
        Bar.style.width = "0%";
        this.DOMImage.removeAttribute("onmouseenter");
        this.DOMImage.removeAttribute("onmousedown");
        this.DOMImage.setAttribute("src", enemyPics.dead.ChainGuy);
        this.DOMImage.style.pointerEvents = "none";
        DOMUpdater.updateKillCounter(target.deadCount + target.deadExtraCount);
        this.deadSound();
        stopTimer();
        finishMessage();
    };
    Boss.prototype.deadSound = function () {
        if (this.enemy == "ChainGuy") {
            bossDed.play();
        }
    };
    return Boss;
}(regEnemy));
var Player = /** @class */ (function () {
    function Player() {
    }
    Player.damageCheck = function (damage) {
        hurting = setTimeout(function () {
            // if (riotShieldDeployed == false) {
            Player.health -= damage;
            if (Player.health > 0) {
                DOMUpdater.updateHealthCounter(Player.health);
                document.body.style.animationName = "hit";
                Hlifescream1.play();
                setTimeout(function () { document.body.style.removeProperty("animation-name"); }, 1100);
            }
            else {
                Player.playerDeath();
            }
            // else Turicochet.play();
        }, 1000);
    };
    Player.playerDeath = function () {
        Player.dead = true;
        Turokscream.play();
        fadeOut();
        openMenu();
        stopTimer();
        Deuscredits.stop();
        DOMUpdater.updateHealthCounter(0);
        elements.backImg.style.animationFillMode = "forwards";
        clearAllEnemies();
        //     clearInterval(tgt22.attackRoller)
    };
    Player.health = 100;
    Player.dead = false;
    return Player;
}());
