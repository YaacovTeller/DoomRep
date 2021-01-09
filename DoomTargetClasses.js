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
    draw(position, anim) {
        var img = document.createElement("img");
        img.classList.add("target", "undraggable", "fillModeForwards");
        img.onmouseover = () => this.setAsTarget();
        img.onmouseleave = () => this.unsetTarget();
        img.setAttribute('src', enemyPics[this.enemy]);
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
        this.DOMImage = img;
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
            _this.DOMImage.setAttribute("src", enemyPics[_this.enemy]);
        }
    }
    undraw() {
        $(this.DOMImage).fadeOut(300, function () { $(this).remove(); });
    }
    loseHealth(damage) {
        this.health -= damage;
        this.DOMImage.setAttribute("src", enemyPics.hurt[this.enemy]);
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
            rescaleForPotPlants(this.DOMImage);
        }
        else if (gib) {
            pic = enemyPics.explode[this.enemy];
        }
        else
            pic = enemyPics.dead[this.enemy];
        this.DOMImage.setAttribute("src", pic + "?a=" + Math.random());
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
function rescaleForPotPlants(image) {
    let scale = image.style.transform;
    let num = parseFloat(scale.replace("scale(", ""));
    image.style.transform = `scale(${num / 3})`;
    image.style.left = image.getBoundingClientRect().left - 200 + "px";
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
                this.DOMImage.src = enemyPics.firing[this.enemy];
                let _this = this;
                setTimeout(() => {
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
                        RandomSoundGen.randomSound([Turicochet, BloodRicochet_1, BloodRicochet_2]);
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
        this.DOMImage.src = enemyPics[direction][this.enemy];
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
        ded2.play();
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
        ded.play();
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
        ded.play();
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
        ded2.play();
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
        //    this.attackFrequency = this.isBoss ? this.attackFrequency / 3 : this.attackFrequency;
    }
    deadSound() {
        humanDead.play();
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
        //    this.DOMImage.classList.remove("infiniteAlternateReverse");
        this.DOMImage.classList.add('fillModeForwards', 'extraTarget');
    }
    die(gib) {
        this.drop(new healthPickup(this, 50));
        GameInfo.deadExtraCount++;
        super.die(gib);
    }
    deadSound() {
        if (this.enemy.includes("Troop")) {
            ded2.play();
        }
        else if (this.enemy == "ShotGun_Troop") {
            ded.play();
        }
        else if (this.enemy == "Imp") {
            ded.play();
        }
    }
    beginInflictDamage() { }
    beginMoveLateral() { }
}
class Item extends Target {
    constructor(item, position, health, anim) {
        super(item, position, health, anim);
    }
    die() {
        killAllEnemies(true);
        super.die();
    }
    deadSound() {
        explosion.play();
    }
}
