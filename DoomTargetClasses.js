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
var hitTarget;
var targeting = false;
var Position = /** @class */ (function () {
    function Position(x, y, scale) {
        this.x = x;
        this.y = y;
        this.scale = scale;
    }
    return Position;
}());
var AnimationInfo = /** @class */ (function () {
    function AnimationInfo(anim, dur, iter, dir, tim) {
        this.animation = anim;
        this.duration = dur || '5s';
        this.timing = tim || 'ease';
        this.iterations = iter || 'infinite';
        this.direction = dir || "";
    }
    AnimationInfo.prototype.animationString = function () {
        return this.animation + " " + this.duration + " " + this.timing + " " + this.iterations + " " + this.direction;
    };
    return AnimationInfo;
}());
// parent class, handles drawing and damaging.
var Target = /** @class */ (function () {
    function Target(num, enemy, health, position, anim) {
        this.deadFlag = false;
        this.health = health;
        this.num = num;
        this.enemy = enemy;
        this.draw(position, anim);
    }
    Target.prototype.draw = function (position, anim) {
        var _this_1 = this;
        var img = document.createElement("img");
        img.setAttribute('class', "target"); //infiniteAlternateReverse
        img.setAttribute('id', "tgt" + this.num);
        img.onmouseover = function () { return _this_1.MGhit(); };
        img.onmouseleave = function () { return _this_1.MGhitEnd(); };
        img.setAttribute('src', enemyPics[this.enemy]);
        img.setAttribute('draggable', "false");
        img.style.left = position.x + "%";
        img.style.top = position.y + "%";
        img.style.transform = position.scale ? "scale(" + position.scale + ")" : "scale(" + position.y / 50 * position.y / 50 + ")";
        if (anim) {
            var str = anim.animationString();
            img.style.animation = str;
        }
        elements.targetBackdrop.appendChild(img);
        this.DOMImage = img;
    };
    Target.prototype.redraw = function () {
        if (this.deadFlag == false) {
            this.DOMImage.setAttribute("src", enemyPics[this.enemy]);
        }
    };
    Target.prototype.undraw = function () {
        $(this.DOMImage).fadeOut(300, function () { $(this).remove(); });
    };
    Target.prototype.loseHealth = function (damage) {
        this.health -= damage;
        this.DOMImage.setAttribute("src", enemyPics.hurt[this.enemy]);
        var _this = this;
        if (this.health <= 0) {
            this.die();
        }
        // Calls redraw to reset
        else {
            setTimeout(_this.redraw, 200);
        }
    };
    Target.prototype.die = function () {
        this.deadFlag = true;
        clearInterval(MachineGun.mghit);
        this.DOMImage.style.animationPlayState = "paused";
        this.DOMImage.setAttribute("src", enemyPics.dead[this.enemy] + "?a=" + Math.random());
        this.DOMImage.style.pointerEvents = "none";
        this.deadSound();
    };
    // The machine gun damage function
    Target.prototype.MGhit = function () {
        hitTarget = this;
        targeting = true;
        var hitImage = this.DOMImage;
        if (!Player.weapon.firing) {
            return;
        }
        switch (Player.weapon.constructor.name) {
            case 'ChainSaw': {
                if (ChainSaw.chainsawDistanceCheck(hitImage)) {
                    MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(Player.weapon.damage); }, 100));
                }
                break;
            }
            case 'Minigun': {
                if (Minigun.spinUpCheck == true) {
                    MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(Player.weapon.damage); }, 100));
                }
                break;
            }
            default: {
                MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(Player.weapon.damage); }, 100));
            }
        }
    };
    Target.prototype.MGhitEnd = function () {
        clearInterval(MachineGun.mghit);
        targeting = false;
        // hitTarget = null;
    };
    Target.deadCount = 0;
    Target.deadExtraCount = 0;
    return Target;
}());
var RegEnemy = /** @class */ (function (_super) {
    __extends(RegEnemy, _super);
    function RegEnemy(num, enemy, health, position, anim) {
        return _super.call(this, num, enemy, health, position, anim) || this;
    }
    // public draw(position, anim) {
    //     super.draw(position, anim);
    // }
    RegEnemy.prototype.die = function () {
        _super.prototype.die.call(this);
        clearInterval(this.attackRoller);
        clearInterval(this.damaging);
        if (!(this instanceof Extra)) {
            Target.deadCount++;
            levelCheck();
        }
        DOMUpdater.updateKillCounter(Target.deadCount + Target.deadExtraCount);
    };
    RegEnemy.prototype.hitRoll = function (damage) {
        if (Player.dead == false) {
            var die = (Math.floor(Math.random() * 7));
            if (die == 6) {
                hitWarning();
                if (riotShieldDeployed == false) {
                    Player.damageCheck(this, damage);
                }
                else {
                    setTimeout(function () {
                        Turicochet.play(); /* riotShield.style.animation = "shieldhit 0.5s"; */
                    }, 1000);
                }
            }
        }
    };
    RegEnemy.prototype.inflictDamage = function (damage, attackFrequency) {
        if (!damage)
            return;
        var firingEnemy = this;
        this.attackRoller = setInterval(function () { firingEnemy.hitRoll(damage); }, attackFrequency);
    };
    RegEnemy.enemyArray = new Array();
    return RegEnemy;
}(Target));
var Troop = /** @class */ (function (_super) {
    __extends(Troop, _super);
    function Troop(num, health, position, anim) {
        var _this_1 = _super.call(this, num, "Troop", health, position, anim) || this;
        _this_1.damageNumber = 10;
        _this_1.attackFrequency = 2000;
        _this_1.inflictDamage(_this_1.damageNumber, _this_1.attackFrequency);
        return _this_1;
    }
    Troop.prototype.deadSound = function () {
        ded2.play();
    };
    return Troop;
}(RegEnemy));
var ShotGGuy = /** @class */ (function (_super) {
    __extends(ShotGGuy, _super);
    function ShotGGuy(num, health, position, anim) {
        var _this_1 = _super.call(this, num, "ShotGGuy", health, position, anim) || this;
        _this_1.damageNumber = 20;
        _this_1.attackFrequency = 2000;
        _this_1.inflictDamage(_this_1.damageNumber, _this_1.attackFrequency);
        return _this_1;
    }
    ShotGGuy.prototype.deadSound = function () {
        ded.play();
    };
    return ShotGGuy;
}(RegEnemy));
var Imp = /** @class */ (function (_super) {
    __extends(Imp, _super);
    function Imp(num, health, position, anim) {
        var _this_1 = _super.call(this, num, "Imp", health, position, anim) || this;
        _this_1.damageNumber = 15;
        _this_1.attackFrequency = 2000;
        _this_1.inflictDamage(_this_1.damageNumber, _this_1.attackFrequency);
        return _this_1;
    }
    Imp.prototype.deadSound = function () {
        ded2.play();
    };
    return Imp;
}(RegEnemy));
var Extra = /** @class */ (function (_super) {
    __extends(Extra, _super);
    function Extra(num, enemy, health, position, anim) {
        return _super.call(this, num, enemy, health, position, anim) || this;
    }
    Extra.prototype.draw = function (position, anim) {
        _super.prototype.draw.call(this, position, anim);
        //    this.DOMImage.classList.remove("infiniteAlternateReverse");
        this.DOMImage.classList.add('fillModeForwards', 'extraTarget');
    };
    Extra.prototype.die = function () {
        Target.deadExtraCount++;
        _super.prototype.die.call(this);
    };
    Extra.prototype.deadSound = function () {
        if (this.enemy == "Troop") {
            ded2.play();
        }
        else if (this.enemy == "ShotGGuy") {
            ded.play();
        }
        else if (this.enemy == "Imp") {
            ded.play();
        }
    };
    return Extra;
}(RegEnemy));
var Boss = /** @class */ (function (_super) {
    __extends(Boss, _super);
    function Boss(num, enemy, health, position, anim) {
        var _this_1 = _super.call(this, num, enemy, health, position, anim) || this;
        _this_1.damageNumber = 30;
        _this_1.attackFrequency = 300;
        _this_1.inflictDamage(_this_1.damageNumber, _this_1.attackFrequency);
        _this_1.bar = elements.Bar;
        return _this_1;
    }
    Boss.prototype.fillBar = function () {
        showElement(this.bar);
        this.bar.style.width = "100%";
    };
    Boss.prototype.loseHealth = function (damage) {
        _super.prototype.loseHealth.call(this, damage);
        this.bar.style.width = this.health / 2 + "%";
    };
    Boss.prototype.die = function () {
        this.deadFlag = true;
        clearInterval(MachineGun.mghit);
        clearInterval(this.attackRoller);
        clearInterval(this.damaging);
        this.bar.style.width = "0%";
        this.DOMImage.removeAttribute("onmouseenter");
        this.DOMImage.removeAttribute("onmousedown");
        this.DOMImage.setAttribute("src", enemyPics.dead.ChainGuy);
        this.DOMImage.style.pointerEvents = "none";
        DOMUpdater.updateKillCounter(Target.deadCount + Target.deadExtraCount);
        this.deadSound();
        stopTimer();
        sectionFinish();
    };
    Boss.prototype.deadSound = function () {
        if (this.enemy == "ChainGuy") {
            bossDed.play();
        }
    };
    return Boss;
}(RegEnemy));
var Player = /** @class */ (function () {
    function Player() {
    }
    Player.damageCheck = function (damager, damage) {
        damager.damaging = setTimeout(function () {
            if (riotShieldDeployed == false) {
                Player.playerHit(damage);
            }
            else
                Turicochet.play();
        }, 1000);
    };
    Player.playerHit = function (damage) {
        Player.health -= damage;
        if (Player.health > 0) {
            DOMUpdater.updateHealthCounter(Player.health);
            document.body.style.animationName = "hit";
            Player.hurtSound();
            setTimeout(function () { document.body.style.removeProperty("animation-name"); }, 1100);
        }
        else {
            Player.playerDeath();
        }
    };
    Player.playerDeath = function () {
        Player.dead = true;
        this.deadSound();
        fadeOut();
        openMenu();
        stopTimer();
        Deuscredits.stop();
        DOMUpdater.updateHealthCounter(0);
        elements.backImg.style.animationFillMode = "forwards";
        clearAllEnemies();
        //     clearInterval(tgt22.attackRoller)
    };
    Player.deadSound = function () {
        Turokscream.play();
    };
    Player.hurtSound = function () {
        Hlifescream1.play();
    };
    Player.health = 100;
    Player.dead = false;
    return Player;
}());
