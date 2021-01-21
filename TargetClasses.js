"use strict";
//TheQuickAndTheDead
// parent class, handles drawing and damaging.
class Target {
    constructor(enemy, position, health, anim) {
        this.deadFlag = false;
        this.firing = false;
        if (health) {
            this.health = health;
        }
        this.enemy = enemy;
        this.draw(position, anim);
    }
    setImageSrc(img) {
        this.DOMImage.src = img + "?a=" + Math.random();
    }
    draw(position, anim) {
        var img = document.createElement("img");
        this.DOMImage = img;
        img.classList.add("target", "undraggable", "fillModeForwards");
        img.onmouseover = () => this.setAsTarget();
        img.onmouseleave = () => this.unsetTarget();
        this.setImageSrc(enemyPics[this.enemy]);
        // img.style.borderRadius = "55px" // reduce the hitbox?
        img.style.left = position.x + "%";
        img.style.top = position.y + "%";
        img.style.transform = position.scale ? `scale(${position.scale})` : `scale(${position.y / 50 * position.y / 50})`; // Attempt auto-size based on position
        if (anim) {
            let arr = [];
            for (let a of anim) {
                arr.push(a.animationString());
            }
            img.style.animation = arr.join(", ");
        }
        elements.targetBackdrop.appendChild(img);
    }
    randomiseDrop(num) {
        let roll = Math.floor(Math.random() * 100);
        if (roll >= num) {
            return true;
        }
    }
    drop(pickup) {
        let num = RandomNumberGen.randomNumBetween(1, 5);
        let size = num == 5 ? "big" : "small";
        if (pickup instanceof weaponPickup && Player.weaponCollection[pickup.weapon.constructor.name]) {
            pickup = new ammoPickup(this, pickup.weapon, size);
        }
        pickup.draw();
    }
    redraw(_this) {
        if (_this.deadFlag == false) {
            _this.setImageSrc(enemyPics[_this.enemy]);
        }
    }
    undraw() {
        $(this.DOMImage).fadeOut(300, function () { $(this).remove(); });
    }
    loseHealth(damage) {
        this.health -= damage;
        this.setImageSrc(enemyPics.hurt[this.enemy]);
        let _this = this;
        if (this.isBoss) {
            LevelHandler.reduceBar(this.health);
        }
        if (this.health <= 0) {
            this.die();
        }
        // Calls redraw to reset
        else {
            setTimeout(() => _this.redraw(_this), 200);
        }
    }
    die(gib) {
        let pic;
        if (GameInfo.kidMode) {
            pic = enemyPics.dead_alt[this.enemy];
        }
        else if (gib) {
            pic = enemyPics.explode[this.enemy];
        }
        else {
            pic = enemyPics.dead[this.enemy];
            if (this instanceof Imp && RandomNumberGen.randomNumBetween(0, 3) == 3) { // FIX, alt deaths need a proper system
                pic = enemyPics.dead[this.enemy + '_alt'];
            }
        }
        this.setImageSrc(pic);
        this.deadFlag = true;
        this.DOMImage.style.animationPlayState = "paused"; // stop css...
        $(this.DOMImage).stop(); // ...and jquery movement
        this.DOMImage.style.pointerEvents = "none";
        if (this.randomiseDrop(85))
            this.drop(new healthPickup(this, 20));
        this.deadSound();
    }
    setAsTarget() {
        GameInfo.hitTarget = this;
        GameInfo.targeting = true;
    }
    unsetTarget() {
        GameInfo.hitTarget = null;
        GameInfo.targeting = false;
    }
}
class RegEnemy extends Target {
    constructor(enemy, position, health, anim) {
        super(enemy, position, health, anim);
        this.noRandomMovement = false;
        this.mover = new MovementGenerator;
    }
    // public draw(position, anim) {
    //     super.draw(position, anim);
    // }
    die(gib) {
        super.die(gib);
        clearInterval(this.attackRoller);
        clearInterval(this.damaging);
        clearInterval(this.moveRoller);
        if (!(this instanceof Extra)) {
            GameInfo.deadCount++;
            LevelHandler.sceneCheck();
        }
        DOMUpdater.updateKillCounter(GameInfo.deadCount + GameInfo.deadExtraCount);
    }
    hitRoll(damage, hitLimit) {
        if (Player.dead == false) {
            var die = RandomNumberGen.randomNumBetween(1, 6);
            if (die >= hitLimit) {
                this.firing = true;
                $(this.DOMImage).stop();
                this.setImageSrc(enemyPics.firing[this.enemy]);
                let _this = this;
                setTimeout(() => {
                    this.attackSound();
                    this.redraw(_this);
                    this.firing = false;
                }, 1000);
                hitWarning();
                if (Player.riotShieldDeployed == false) {
                    Player.damageCheck(this, damage);
                }
                else {
                    setTimeout(function () {
                        //Turicochet.play(); /* riotShield.style.animation = "shieldhit 0.5s"; */
                        RandomSoundGen.playRandomSound([Turicochet, BloodRicochet_1, BloodRicochet_2]);
                    }, 1000);
                }
            }
        }
    }
    moveForward() {
        let width = this.DOMImage.getBoundingClientRect().width;
        let height = this.DOMImage.getBoundingClientRect().height;
        let pic = this.DOMImage;
        let time = 2000;
        this.mover.moveForward({ width: width * 2, height: height * 2 }, time, pic);
        let _this = this;
        if (enemyPics.forward[this.enemy]) {
            setTimeout(() => {
                pic.src = enemyPics.forward[_this.enemy];
            }, time);
        }
    }
    moveRoll() {
        var die = (Math.floor(Math.random() * 7));
        if (die > 3 && !this.firing) {
            this.calculateMove();
        }
    }
    calculateMove() {
        let lateralDestination = this.mover.lateralDestination(this.DOMImage);
        let distance = this.mover.distance(this.DOMImage, lateralDestination);
        let direction = this.mover.direction(this.DOMImage, lateralDestination);
        let speed = this.mover.speed(distance);
        this.setImageSrc(enemyPics[direction][this.enemy]);
        let _this = this;
        this.mover.moveLateral(lateralDestination, speed, this.DOMImage, () => _this.redraw(_this));
        //    this.mover.moveForward(this.mover.calcDimentions(this.DOMImage), speed, this.DOMImage);
    }
    beginInflictDamage(hitLimit) {
        var _this = this;
        let attackFrequency = this.attackFrequency + RandomNumberGen.randomNumBetween(-500, 500);
        this.attackRoller = setInterval(function () { _this.hitRoll(_this.damageNumber, hitLimit); }, attackFrequency);
    }
    beginMoveLateral(moveFrequency) {
        if (this.noRandomMovement) {
            return;
        }
        var _this = this;
        moveFrequency += RandomNumberGen.randomNumBetween(-500, 500);
        this.moveRoller = setInterval(function () { _this.moveRoll(); }, moveFrequency);
    }
}
class Troop extends RegEnemy {
    constructor(position, health, anim) {
        super("Troop", position, health, anim);
        this.baseHealth = 30;
        this.damageNumber = 10;
        this.attackFrequency = 2000;
        this.carriedWeapon = GameInfo.allGuns.Pistol;
    }
    deadSound() {
        RandomSoundGen.playRandomSound(troopDeaths);
    }
    attackSound() {
        Pshot.play();
    }
    activeSound() {
        RandomSoundGen.playRandomSound(troopShouts);
    }
    die(gib) {
        if (this.randomiseDrop(40))
            this.drop(new weaponPickup(this, GameInfo.allGuns.DukeMgun)); //this.carriedWeapon
        super.die(gib);
    }
}
class ShotGun_Troop extends RegEnemy {
    constructor(position, health, anim) {
        super("ShotGun_Troop", position, health, anim);
        this.baseHealth = 30;
        this.damageNumber = 20;
        this.attackFrequency = 2000;
        this.carriedWeapon = GameInfo.allGuns.Shotgun;
    }
    deadSound() {
        RandomSoundGen.playRandomSound(troopDeaths);
    }
    attackSound() {
        SGshot.play();
    }
    activeSound() {
        RandomSoundGen.playRandomSound(troopShouts);
    }
    die(gib) {
        if (this.randomiseDrop(40))
            this.drop(new weaponPickup(this, this.carriedWeapon));
        super.die(gib);
    }
}
class ChainGGuy extends RegEnemy {
    constructor(position, health, anim, isBoss) {
        super("ChainGuy", position, health, anim);
        this.baseHealth = 120;
        this.damageNumber = 30;
        this.attackFrequency = 2000;
        this.carriedWeapon = GameInfo.allGuns.Minigun;
        this.isBoss = isBoss;
        //  this.attackFrequency = this.isBoss ? this.attackFrequency / 3 : this.attackFrequency;
    }
    deadSound() {
        RandomSoundGen.playRandomSound(troopDeaths);
    }
    attackSound() {
        Avpminigun2.play();
    }
    activeSound() {
        RandomSoundGen.playRandomSound(troopShouts);
    }
    die(gib) {
        this.drop(new weaponPickup(this, this.carriedWeapon));
        this.drop(new healthPickup(this, 50));
        super.die(gib);
    }
}
class Imp extends RegEnemy {
    constructor(position, health, anim) {
        super("Imp", position, health, anim);
        this.baseHealth = 30;
        this.damageNumber = 15;
        this.attackFrequency = 2000;
    }
    deadSound() {
        RandomSoundGen.playRandomSound(ImpDeaths);
    }
    attackSound() {
        Imp_Attack.play();
    }
    activeSound() {
        RandomSoundGen.playRandomSound(ImpShouts);
    }
}
class SectorPatrol extends RegEnemy {
    constructor(position, health, anim, isBoss) {
        super("SectorPatrol", position, health, anim);
        this.baseHealth = 20;
        this.damageNumber = 10;
        this.attackFrequency = 2000;
        this.carriedWeapon = GameInfo.allGuns.Pistol;
        this.isBoss = isBoss;
    }
    deadSound() {
        RandomSoundGen.playRandomSound(patrolDeaths);
    }
    attackSound() {
        Pshot.play();
    }
    activeSound() {
        RandomSoundGen.playRandomSound(patrolShouts);
    }
    die(gib) {
        this.drop(new weaponPickup(this, this.carriedWeapon));
        super.die(gib);
    }
}
class Extra extends RegEnemy {
    constructor(enemy, position, health, anim) {
        super(enemy, position, health, anim);
        this.baseHealth = 15;
    }
    draw(position, anim) {
        super.draw(position, anim);
        this.DOMImage.classList.add('fillModeForwards', 'extraTarget');
    }
    die(gib) {
        this.drop(new healthPickup(this, 50));
        GameInfo.deadExtraCount++;
        super.die(gib);
    }
    deadSound() {
        if (this.enemy.includes("Troop")) {
            RandomSoundGen.playRandomSound(troopDeaths);
        }
        else if (this.enemy == "ShotGun_Troop") {
            RandomSoundGen.playRandomSound(troopDeaths);
        }
        else if (this.enemy == "Imp") {
            RandomSoundGen.playRandomSound(ImpDeaths);
        }
    }
    attackSound() { }
    ;
    activeSound() { }
    ;
    beginInflictDamage() { }
    ;
    beginMoveLateral() { }
    ;
}
class Item extends Target {
    constructor(item, position, health, anim) {
        super(item, position, health, anim);
        this.blastRadius = 500;
    }
    die() {
        // killAllEnemies(true);
        this.killInBlastRadius(true);
        super.die();
    }
    killInBlastRadius(gib) {
        let barrelLeft = this.DOMImage.getBoundingClientRect().left;
        for (let enemy of GameInfo.enemyArray) {
            if (!enemy || enemy.deadFlag == true)
                continue;
            let enemyLeft = enemy.DOMImage.getBoundingClientRect().left;
            if (this.checkDistance(barrelLeft, enemyLeft) < this.blastRadius) {
                enemy.die(gib);
            }
        }
    }
    checkDistance(left1, left2) {
        return Math.abs(left1 - left2);
    }
    deadSound() {
        explosion.play();
    }
}
