const enemyPics = {
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
}

//TheQuickAndTheDead
var redrawing;
var hitTarget: target;
var hitImage;
var targeting: boolean = false;
var hurting;

// parent class, handles drawing and damaging.
abstract class target {
    public num: number;
    public enemy: string;
    public health: number;
    public healthUnit: number;
    public DOMImage: HTMLElement;
    public static targetCount: number = 0;
    public static deadCount: number = 0;
    public static extraCount: number = 0;
    public static deadExtraCount: number = 0;
    public deadFlag: boolean = false;
    public body;
    constructor(num, enemy, health) {
        this.health = health;
        this.num = num;
        this.enemy = enemy;
        this.draw();
    }
    // The abstract "die" function. Implemented differently by the two child classes
    protected die(){
        this.deadFlag = true;
        clearInterval(MachineGun.mghit);
        this.body = document.getElementById(`tgt${this.num}`);
        this.body.style.animationPlayState = "paused";
        this.body.setAttribute("src", enemyPics.dead[this.enemy] + "?a=" + Math.random());
        this.body.style.pointerEvents = "none";
        this.deadSound();
    }

    abstract deadSound()

    protected draw(){
        var img:HTMLElement = document.createElement("img");
        img.setAttribute('class', "target");
        img.setAttribute('id', `tgt${this.num}`);
        img.setAttribute('onmouseenter', `tgt${this.num}.MGhit()`);
        img.setAttribute('onmouseleave', `tgt${this.num}.MGhitEnd()`);
        img.setAttribute('src', enemyPics[this.enemy]);
        img.setAttribute('draggable', `false`);
        elements.targetBackdrop.appendChild(img);
        this.DOMImage = img;
    }
    public redraw() {
        if (hitTarget.deadFlag == false) {
            hitImage = hitTarget.DOMImage;
            hitImage.setAttribute("src", enemyPics[hitTarget.enemy]);
        }
    }
    public undraw(){
        hideElement(this.DOMImage);
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
        hitImage.setAttribute("src", enemyPics.hurt[this.enemy]);
        // Here, the Boss uses the "loseHealth" function, with a condition
        if (this.enemy == "ChainGuy") {
            elements.Bar.style.width = `${tgt22.health / 2}%`;
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
            if (ChainSaw.chainsawDistanceCheck(hitImage)) { MachineGun.mghit = (setInterval(function () { hitTarget.loseHealth(); }, 100)); }
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
    protected damageNumber: number = 16;
    public attackFrequency: number = 1000;
    public attackRoller;

    constructor(num, enemy, health) {
        super(num, enemy, health)
    }

    public draw() {
        super.draw();
        target.targetCount++;
    }
    public die() {
        super.die();
        clearInterval(this.attackRoller);
        clearInterval(hurting);
        target.deadCount++
        updateKillCounter(target.deadCount + target.deadExtraCount);
        levelCheck();
    }
    private hitRoll(damage) {
        if (Player.dead == false) {
            var die = (Math.floor(Math.random() * 7))
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
    }
    protected inflictDamage(damage, attackFrequency) {
        if (!damage) return;
        var firingEnemy = this;
        this.attackRoller = setInterval(function(){firingEnemy.hitRoll(damage)}, attackFrequency);
    }
}

class Troop extends regEnemy {
    public damageNumber = 10;
    public attackFrequency = 2000;

    constructor(num, health) {
        super(num, "Troop", health)
        this.inflictDamage(this.damageNumber, this.attackFrequency);
    }
    public deadSound() {
        ded2.play()
    }
}
class ShotGGuy extends regEnemy {
    public damageNumber = 20;
    public attackFrequency = 2000;
    constructor(num, health) {
        super(num, "ShotGGuy", health)
        this.inflictDamage(this.damageNumber, this.attackFrequency);
    }
    public deadSound() {
        ded.play()
    }
}
class Imp extends regEnemy {
    public damageNumber = 15;
    public attackFrequency = 2000;
    constructor(num, health) {
        super(num, "Imp", health)
        this.inflictDamage(this.damageNumber, this.attackFrequency);
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
        super.draw()
        target.extraCount++;
   }
    public die() {
        super.die();
        target.deadExtraCount++
    }
    public deadSound() {
         if (this.enemy == "Troop") { ded2.play() }
         else if (this.enemy == "SGunG") { ded.play() }
         else if (this.enemy == "Imp") { ded.play() }
    }
}
class Boss extends regEnemy {
    damageNumber = 30;
    attackFrequency = 300;
    constructor(num, enemy, health) {
        super(num, enemy, health)
    }
    public fillBar() {
        showElement(elements.Bar);
        elements.Bar.style.width = `100%`;
    }

    public die() {
        this.deadFlag = true;
        clearInterval(MachineGun.mghit);
        clearInterval(this.attackRoller);
        clearInterval(hurting);
        let Boss = document.getElementById("tgt22")
        let Bar = elements.Bar;
        Bar.style.width = `0%`;
        Boss.removeAttribute("onmouseenter");
        Boss.removeAttribute("onmousedown");
        Boss.setAttribute("src", enemyPics.dead.ChainGuy);
        updateKillCounter(target.deadCount + target.deadExtraCount);
        this.deadSound();
        stopTimer();
        //Deuscredits.stop();
        finishMessage();
    }
    public deadSound() {
        if (this.enemy == "ChainGuy") {
            bossDed.play();
        }
    }
}

class Player {
    static health: number = 100;
    static dead: boolean = false;
    static damageCheck(damage){
        hurting = setTimeout(function () {
            // if (riotShieldDeployed == false) {
                Player.health -= damage;
            if (Player.health > 0) {
                elements.health.innerHTML = `Health: ${Player.health}`;
                document.body.style.animationName = "hit";
                Hlifescream1.play()
                setTimeout(function () { document.body.style.removeProperty("animation-name") }, 1100);
            }
            else { Player.playerDeath() }
            // else Turicochet.play();
        }, 1000);
    }

    static playerDeath() {
        Player.dead = true;
        Turokscream.play();
        fadeOut();
        openMenu();
        stopTimer();
        Deuscredits.stop();
        elements.health.innerHTML = "Health: 0"
        elements.backImg.style.animationFillMode = "forwards";
        clearAllEnemies();
        clearInterval(tgt22.attackRoller)
    }
}