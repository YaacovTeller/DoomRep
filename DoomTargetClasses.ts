
//TheQuickAndTheDead
let extra: number = 0;
var redrawing;
var hitTarget: target;
var hitImage;
var targeting: boolean = false;
var playerHealth: number = 100;
var hurting;

// My abstract super-class for all targets: Handles drawing and damaging.
//   "abstract super"המחלקה  
abstract class target {
    public num: number;
    public enemy: string;
    public health: number;
    public healthUnit: number;
    public static deadCount: number = 0;
    public static objectCount: number = 0;
    public static extraCount: number = 0;
    public deadFlag: boolean = false;
    public body;
    constructor(num, enemy, health) {
        this.health = health;
        this.num = num;
        this.enemy = enemy;
        this.draw();
    }
    // The abstract "die" function. Implemented differently by the two child classes
    // הפונקציה "המוות" המופשטת. מיושמת אחרת על ידי שני כיתות הילדים
    abstract die()
    abstract deadSound()
    // Creates target image and gives it damage functions
    // יוצר תמונת היעד ונותן לו פונקציות נזק
    abstract draw()
    // 'Re-draw' resets the target to orig .gif after being damaged
    // מאפס את היעד ל- orig .gif לאחר שניזוק
    public redraw() {
        if (hitTarget.deadFlag == false) {
            hitImage = document.getElementById(`tgt${hitTarget.num}`);
            hitImage.setAttribute("src", `pics/${hitTarget.enemy}.gif`)
        }
    }
    // All target damaging: calls `redraw` and `die`
    // כל פגיעה במיקוד
    public loseHealth() {
        if (weaponry.w == 2) {
            hitTarget.healthUnit = 10;
        }
        else if (weaponry.w == 3) { hitTarget.healthUnit = 30 }
        else if (weaponry.w == 1 || weaponry.w == 4 || weaponry.w == 7 || weaponry.w == 4.1 || weaponry.w == 7.1 || weaponry.w == 1.1 || weaponry.w == 6 || weaponry.w == 6.1) { hitTarget.healthUnit = 10 }
        hitTarget.health -= hitTarget.healthUnit;

        // Changes image to 'hurt' image
        // משנה את התמונה לתמונה 'פגועה'
        hitImage = document.getElementById(`tgt${this.num}`);
        hitImage.setAttribute("src", `pics/${this.enemy}_Hurt.png`);
        // Here, the Boss uses the "loseHealth" function, with a condition
        // עם תנאי "loseHealth", כאן, הבוס משתמש בפונקציה
        if (this.enemy == "ChainGuy") {
            let Bar = document.getElementById("BossBar1")
            Bar.style.width = `${tgt22.health / 2}%`;
        }
        if (this.health <= 0) { this.die() }
        // Calls redraw to reset
        else { redrawing = setTimeout(hitTarget.redraw, 200); }
    }
    // The machine gun damage function
    //  פונקציה המכונת ירייה
    public MGhit() {
        hitTarget = this;
        targeting = true;
        hitImage = document.getElementById(`tgt${hitTarget.num}`);
        // Checks if machine guns (7 and 4) or chainsaw (1) are being fired
        // בודק אם מכונות ירייה (7 ו -4) או מסור חשמלי (1) יורים

        if (weaponry.w == 7.1 || weaponry.w == 6.1) {
            MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 100));
        }
        else if (weaponry.w == 1.1) {   //NEEDS FIXING, ALL ARE 300px
            if (hitImage.height > 200) { MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 100)); }
        }
        else if (weaponry.w == 4.1) {
            if (minigun.spinUpCheck == true) {
                MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 100));
            }
        }
    }
    public MGhitEnd() {
        clearInterval(MachineGun.mghit);
        targeting = false;
        // hitTarget = null;
    }
}

abstract class regEnemy extends target {
    public static regEnemyArray: Array<regEnemy> = new Array();
    public hitSpeed: number;
    public attackRoller;
    public draw() {
        target.objectCount++;
        document.getElementById("targetBackdrop").innerHTML +=
            `<img id = "tgt${this.num}" class="target" onmouseenter = "tgt${this.num}.MGhit()" onmouseleave = "tgt${this.num}.MGhitEnd()"  src="pics/${this.enemy}.gif" draggable = "false" >`
    }
    public die() {
        this.deadFlag = true;
        clearInterval(MachineGun.mghit);
        this.body = document.getElementById(`tgt${this.num}`);
        this.body.style.animationPlayState = "paused";
        this.body.setAttribute("src", `pics/${this.enemy}_Dead.gif` + "?a=" + Math.random());
        this.body.style.pointerEvents = "none";
        clearInterval(this.attackRoller);
        clearInterval(hurting);
        target.deadCount++
        document.getElementById("DCount").innerHTML = `Kills:${target.deadCount + extra}`;
        levelCheck()
        this.deadSound()
    }
    public inflictDamage() {
        function hitRoll() {
            var die = (Math.floor(Math.random() * 7))
            if (die == 6) {
                hitWarning()
                if (riotShieldDeployed == false) {
                    hurting = setTimeout(function () {
                        // if (riotShieldDeployed == false) {
                        playerHealth -= 10;
                        if (playerHealth>0) {
                        health.innerHTML = `Health: ${playerHealth}`; document.body.style.animationName = "hit";
                        Hlifescream1.play()
                        setTimeout(function () { document.body.style.removeProperty("animation-name") }, 1100);
                        }
                        else {playerDeath()}
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
        this.attackRoller = setInterval(hitRoll, 2000);
    }
}
// Normal enemy class
// מחלקת אויב רגיל
class Troop extends regEnemy {
    constructor(num, enemy, health) {
        super(num, enemy, health)
        this.inflictDamage()
    }
    public deadSound() {
        ded2.play()
    }
}
class ShotGGuy extends regEnemy {
    constructor(num, enemy, health) {
        super(num, enemy, health)
        this.inflictDamage()
    }
    public deadSound() {
        ded.play()
    }
}
class Imp extends regEnemy {
    constructor(num, enemy, health) {
        super(num, enemy, health)
        this.inflictDamage()
    }
    public deadSound() {
        ded2.play()
    }
}
class ExtraTarget extends target {
    constructor(num, enemy, health) {
        super(num, enemy, health)
    }
    public draw() {
        target.extraCount++;
        document.getElementById("targetBackdrop").innerHTML +=
            `<img id = "tgt${this.num}" class="target" onmouseenter = "tgt${this.num}.MGhit()" onmouseleave = "tgt${this.num}.MGhitEnd()"  src="pics/${this.enemy}.gif" draggable = "false" >`
    }
    public die() {
        this.deadFlag = true;
        clearInterval(MachineGun.mghit);
        this.body = document.getElementById(`tgt${this.num}`);
        this.body.style.animationPlayState = "paused";
        this.body.setAttribute("src", `pics/${this.enemy}_Dead.gif` + "?a=" + Math.random());
        this.body.style.pointerEvents = "none";
        if (this.enemy == "Troop") { ded2.play() }
        else if (this.enemy == "SGunG") { ded.play() }
        else if (this.enemy == "Imp") { ded.play() }
        document.getElementById("DCount").innerHTML = `Kills:${target.deadCount + extra}`;
        this.deadSound();
    }
    public deadSound() {
        ded2.play()
    }
}
// Boss class
//  מחלקת אויב בוס
class Boss extends regEnemy {
    constructor(num, enemy, health) {
        super(num, enemy, health)
    }
    public fillBar() {
        Bar.style.width = `100%`;
    }
    public die() {
        this.deadFlag = true;
        clearInterval(MachineGun.mghit);
        let Boss = document.getElementById("tgt22")
        let Bar = document.getElementById("BossBar1")
        Bar.style.width = `0%`;
        Boss.removeAttribute("onmouseenter");
        Boss.removeAttribute("onmousedown");
        Boss.setAttribute("src", "pics/ChainGuy_DeadEd.gif");
        document.getElementById("DCount").innerHTML = `Kills:${target.deadCount + extra}`;
        this.deadSound();
        stopTimer();
        //Deuscredits.stop();
        document.getElementById("fin").innerHTML = `Completed in ${m} minutes, ${s} seconds and ${ss} split seconds!`
    }
    public deadSound() {
        if (this.enemy == "ChainGuy") {
            bossDed.play();
        }
    }
}

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
