
//TheQuickAndTheDead
let extra: number = 0;
var redrawing;
var hitTarget: target;
var hitImage;
var targeting: boolean = false;
var playerHealth: number = 100;
var hurting;
var playerDead: boolean = false;

// parent class, handles drawing and damaging.
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
    abstract die()
    abstract deadSound()

    abstract draw()
    // 'Re-draw' resets the target to orig .gif after being damaged
    public redraw() {
        if (hitTarget.deadFlag == false) {
            hitImage = document.getElementById(`tgt${hitTarget.num}`);
            hitImage.setAttribute("src", `pics/${hitTarget.enemy}.gif`)
        }
    }
    // All target damaging: calls `redraw` and `die`
    public loseHealth() {
        if (weaponry.w == 2) {
            hitTarget.healthUnit = 10;
        }
        else if (weaponry.w == 3) { 
            hitTarget.healthUnit = 30 
        }
        else if (weaponry.w == 1 || weaponry.w == 4 || weaponry.w == 7 || weaponry.w == 4.1 || weaponry.w == 7.1 || weaponry.w == 1.1 || weaponry.w == 6 || weaponry.w == 6.1) {
             hitTarget.healthUnit = 10 
            }
        hitTarget.health -= hitTarget.healthUnit;

        // Changes image to 'hurt' image
        hitImage = document.getElementById(`tgt${this.num}`);
        hitImage.setAttribute("src", `pics/${this.enemy}_Hurt.png`);
        // Here, the Boss uses the "loseHealth" function, with a condition
        if (this.enemy == "ChainGuy") {
            let Bar = document.getElementById("BossBar1")
            Bar.style.width = `${tgt22.health / 2}%`;
        }
        if (this.health <= 0) { this.die() }
        // Calls redraw to reset
        else { redrawing = setTimeout(hitTarget.redraw, 200); }
    }

    // The machine gun damage function
    public MGhit() {
        hitTarget = this;
        targeting = true;
        hitImage = document.getElementById(`tgt${hitTarget.num}`);
        // Checks if machine guns (7 and 4) or chainsaw (1) are being fired

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
    public damageNumber: number;
    public attackFrequency: number;
    public attackRoller;
    public draw() {
        target.objectCount++;
        elementObj.targetBackdrop.innerHTML +=
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
        elementObj.killCounter.innerHTML = `Kills:${target.deadCount + extra}`;
        levelCheck()
        this.deadSound()
    }
    public hitRoll(damageNumber) {
        if (playerDead == false) {
            var die = (Math.floor(Math.random() * 7))
            if (die == 6) {
                hitWarning()
                if (riotShieldDeployed == false) {
                    hurting = setTimeout(function () {
                        // if (riotShieldDeployed == false) {
                        playerHealth -= damageNumber;
                        if (playerHealth > 0) {
                            elementObj.health.innerHTML = `Health: ${playerHealth}`;
                            document.body.style.animationName = "hit";
                            Hlifescream1.play()
                            setTimeout(function () { document.body.style.removeProperty("animation-name") }, 1100);
                        }
                        else { playerDeath() }
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
    }
    public inflictDamage(damageNumber, attackFrequency) {
        var firingEnemy = this;
        this.attackRoller = setInterval(function(){firingEnemy.hitRoll(damageNumber)}, attackFrequency);
    }
}

class Troop extends regEnemy {
    damageNumber = 10;
    attackFrequency = 2000;
    constructor(num, enemy, health) {
        super(num, enemy, health)
        this.inflictDamage(this.damageNumber, this.attackFrequency)
    }
    public deadSound() {
        ded2.play()
    }
}
class ShotGGuy extends regEnemy {
    damageNumber = 20;
    attackFrequency =2000;
    constructor(num, enemy, health) {
        super(num, enemy, health)
        this.inflictDamage(this.damageNumber, this.attackFrequency)
    }
    public deadSound() {
        ded.play()
    }
}
class Imp extends regEnemy {
    damageNumber = 15;
    attackFrequency = 2000;
    constructor(num, enemy, health) {
        super(num, enemy, health)
        this.inflictDamage(this.damageNumber, this.attackFrequency)
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
        elementObj.targetBackdrop.innerHTML +=
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
        elementObj.killCounter.innerHTML = `Kills:${target.deadCount + extra}`;
        this.deadSound();
    }
    public deadSound() {
        ded2.play()
    }
}

class Boss extends regEnemy {
    damageNumber = 30;
    attackFrequency = 300;
    constructor(num, enemy, health) {
        super(num, enemy, health)
        this.inflictDamage(this.damageNumber, this.attackFrequency);
    }
    public fillBar() {
        elementObj.Bar.style.display = `block`;
        elementObj.Bar.style.width = `100%`;
    }
    public die() {
        this.deadFlag = true;
        clearInterval(MachineGun.mghit);
        clearInterval(this.attackRoller);
        clearInterval(hurting);
        let Boss = document.getElementById("tgt22")
        let Bar = elementObj.Bar;
        Bar.style.width = `0%`;
        Boss.removeAttribute("onmouseenter");
        Boss.removeAttribute("onmousedown");
        Boss.setAttribute("src", "pics/ChainGuy_DeadEd.gif");
        elementObj.killCounter.innerHTML = `Kills:${target.deadCount + extra}`;
        this.deadSound();
        stopTimer();
        //Deuscredits.stop();
        elementObj.finishMsg.innerHTML = 
        `Completed in ${timerObj.m} minutes, ${timerObj.s} seconds and ${timerObj.ss} split seconds!`
    }
    public deadSound() {
        if (this.enemy == "ChainGuy") {
            bossDed.play();
        }
    }
}