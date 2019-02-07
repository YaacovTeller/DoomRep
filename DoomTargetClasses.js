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
//TheQuickAndTheDead
var extra = 0;
var redrawing;
var hitTarget;
var hitImage;
var targeting = false;
var playerHealth = 100;
var hurting;
var playerDead = false;
// My abstract super-class for all targets: Handles drawing and damaging.
//   "abstract super"המחלקה  
var target = /** @class */ (function () {
    function target(num, enemy, health) {
        this.deadFlag = false;
        this.health = health;
        this.num = num;
        this.enemy = enemy;
        this.draw();
    }
    // 'Re-draw' resets the target to orig .gif after being damaged
    // מאפס את היעד ל- orig .gif לאחר שניזוק
    target.prototype.redraw = function () {
        if (hitTarget.deadFlag == false) {
            hitImage = document.getElementById("tgt" + hitTarget.num);
            hitImage.setAttribute("src", "pics/" + hitTarget.enemy + ".gif");
        }
    };
    // All target damaging: calls `redraw` and `die`
    // כל פגיעה במיקוד
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
        // משנה את התמונה לתמונה 'פגועה'
        hitImage = document.getElementById("tgt" + this.num);
        hitImage.setAttribute("src", "pics/" + this.enemy + "_Hurt.png");
        // Here, the Boss uses the "loseHealth" function, with a condition
        // עם תנאי "loseHealth", כאן, הבוס משתמש בפונקציה
        if (this.enemy == "ChainGuy") {
            var Bar_1 = document.getElementById("BossBar1");
            Bar_1.style.width = tgt22.health / 2 + "%";
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
    //  פונקציה המכונת ירייה
    target.prototype.MGhit = function () {
        hitTarget = this;
        targeting = true;
        hitImage = document.getElementById("tgt" + hitTarget.num);
        // Checks if machine guns (7 and 4) or chainsaw (1) are being fired
        // בודק אם מכונות ירייה (7 ו -4) או מסור חשמלי (1) יורים
        if (weaponry.w == 7.1 || weaponry.w == 6.1) {
            MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 100));
        }
        else if (weaponry.w == 1.1) { //NEEDS FIXING, ALL ARE 300px
            if (hitImage.height > 200) {
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
        target.objectCount++;
        document.getElementById("targetBackdrop").innerHTML +=
            "<img id = \"tgt" + this.num + "\" class=\"target\" onmouseenter = \"tgt" + this.num + ".MGhit()\" onmouseleave = \"tgt" + this.num + ".MGhitEnd()\"  src=\"pics/" + this.enemy + ".gif\" draggable = \"false\" >";
    };
    regEnemy.prototype.die = function () {
        this.deadFlag = true;
        clearInterval(MachineGun.mghit);
        this.body = document.getElementById("tgt" + this.num);
        this.body.style.animationPlayState = "paused";
        this.body.setAttribute("src", "pics/" + this.enemy + "_Dead.gif" + "?a=" + Math.random());
        this.body.style.pointerEvents = "none";
        clearInterval(this.attackRoller);
        clearInterval(hurting);
        target.deadCount++;
        document.getElementById("DCount").innerHTML = "Kills:" + (target.deadCount + extra);
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
                            health.innerHTML = "Health: " + playerHealth;
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
// Normal enemy class
// מחלקת אויב רגיל
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
        target.extraCount++;
        document.getElementById("targetBackdrop").innerHTML +=
            "<img id = \"tgt" + this.num + "\" class=\"target\" onmouseenter = \"tgt" + this.num + ".MGhit()\" onmouseleave = \"tgt" + this.num + ".MGhitEnd()\"  src=\"pics/" + this.enemy + ".gif\" draggable = \"false\" >";
    };
    ExtraTarget.prototype.die = function () {
        this.deadFlag = true;
        clearInterval(MachineGun.mghit);
        this.body = document.getElementById("tgt" + this.num);
        this.body.style.animationPlayState = "paused";
        this.body.setAttribute("src", "pics/" + this.enemy + "_Dead.gif" + "?a=" + Math.random());
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
        document.getElementById("DCount").innerHTML = "Kills:" + (target.deadCount + extra);
        this.deadSound();
    };
    ExtraTarget.prototype.deadSound = function () {
        ded2.play();
    };
    return ExtraTarget;
}(target));
// Boss class
//  מחלקת אויב בוס
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
        Bar.style.width = "100%";
    };
    Boss.prototype.die = function () {
        this.deadFlag = true;
        clearInterval(MachineGun.mghit);
        var Boss = document.getElementById("tgt22");
        var Bar = document.getElementById("BossBar1");
        Bar.style.width = "0%";
        Boss.removeAttribute("onmouseenter");
        Boss.removeAttribute("onmousedown");
        Boss.setAttribute("src", "pics/ChainGuy_DeadEd.gif");
        document.getElementById("DCount").innerHTML = "Kills:" + (target.deadCount + extra);
        this.deadSound();
        stopTimer();
        //Deuscredits.stop();
        document.getElementById("fin").innerHTML = "Completed in " + m + " minutes, " + s + " seconds and " + ss + " split seconds!";
    };
    Boss.prototype.deadSound = function () {
        if (this.enemy == "ChainGuy") {
            bossDed.play();
        }
    };
    return Boss;
}(regEnemy));
// From before the script became object orientated:
// מלפני שהסקריפט הפך להיות מונחה עצמים:
// The boss was drawn in the HTML already, and operated with his own seperate function
// כבר, ופועל עם פונקיה נפרד שלו HTMLהבוס היה מצויר ב
//<img id="Boss1" class="target" onclick="BossHit()" src="pics/ChainGuy.gif" draggable="false">
//function bossDie() {
// let BossHealth: number = 200
// let Bar = document.getElementById("BossBar1")
// Bar.style.width = `${BossHealth / 2}%`;
// function BossHit() {
//     let Boss = document.getElementById("Boss1")
//     var healthUnit: number;
//     if (w == 2) { healthUnit = 10 }
//     else if (w == 3 || w == 4 || w == 7) { healthUnit = 30 }
//     else if (w <= 1) { healthUnit = 20 }
//     BossHealth -= healthUnit; document.getElementById("BossBar1").style.width = `${BossHealth / 2}%`;
//     if (BossHealth <= 0) {
//         Bar.style.width = `0%`;
//         Boss.setAttribute("src", "pics/ChainGuy_DeadEd.gif");
//         Boss.style.left = "39%";
//         bossDed.play();
//         Boss.removeAttribute("onclick");
//         target.deadCount++
//         document.getElementById("DCount").innerHTML = `Kills:${target.deadCount + extra}`;
//         stopTimer()
//         document.getElementById("fin").innerHTML = `Completed in ${m} minutes, ${s} seconds and ${ss} split seconds!`
//     }
// }
