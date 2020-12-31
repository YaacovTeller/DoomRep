"use strict";
//TheQuickAndTheDead
// parent class, handles drawing and damaging.
class Target {
    constructor(enemy, health, position, anim) {
        this.deadFlag = false;
        this.health = health;
        this.enemy = enemy;
        this.draw(position, anim);
    }
    draw(position, anim) {
        var img = document.createElement("img");
        img.classList.add("target", "undraggable", "fillModeForwards");
        img.onmouseover = () => this.setAsTarget();
        img.onmouseleave = () => this.unsetTarget();
        img.setAttribute('src', enemyPics[this.enemy]);
        img.style.borderRadius = "55px"; // reduce the hitbox?
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
    die() {
        if (GameInfo.kidMode) {
            rescaleForPotPlants(this.DOMImage);
            this.DOMImage.setAttribute("src", enemyPics.dead_alt[this.enemy] + "?a=" + Math.random());
        }
        else {
            this.DOMImage.setAttribute("src", enemyPics.dead[this.enemy] + "?a=" + Math.random());
        }
        this.deadFlag = true;
        this.DOMImage.style.animationPlayState = "paused"; // stop css...
        $(this.DOMImage).stop(); // ...and jquery movement
        this.DOMImage.style.pointerEvents = "none";
        if (this.randomiseDrop(85))
            this.drop(new healthPickup(this, 20));
        this.deadSound();
    }
    // The machine gun damage function
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
    image.style.left = (parseInt(image.style.left) - 150) + "px";
}
class RegEnemy extends Target {
    constructor(enemy, health, position, anim) {
        super(enemy, health, position, anim);
        this.noRandomMovement = false;
        this.mover = new MovementGenerator;
    }
    // public draw(position, anim) {
    //     super.draw(position, anim);
    // }
    die() {
        super.die();
        clearInterval(this.attackRoller);
        clearInterval(this.damaging);
        clearInterval(this.moveRoller);
        if (!(this instanceof Extra)) {
            GameInfo.deadCount++;
            LevelHandler.sceneCheck();
        }
        DOMUpdater.updateKillCounter(GameInfo.deadCount + GameInfo.deadExtraCount);
    }
    hitRoll(damage) {
        if (Player.dead == false) {
            var die = (Math.floor(Math.random() * 7));
            if (die == 6) {
                hitWarning();
                $(this.DOMImage).stop();
                if (Player.riotShieldDeployed == false) {
                    Player.damageCheck(this, damage);
                }
                else {
                    setTimeout(function () {
                        Turicochet.play(); /* riotShield.style.animation = "shieldhit 0.5s"; */
                    }, 1000);
                }
            }
        }
    }
    moveRoll() {
        var die = (Math.floor(Math.random() * 7));
        if (die > 3) {
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
    inflictDamage(damage, attackFrequency) {
        if (!damage)
            return;
        var _this = this;
        attackFrequency += RandomNumberGen.randomNumBetween(-500, 500);
        this.attackRoller = setInterval(function () { _this.hitRoll(damage); }, attackFrequency);
    }
    beginInflictDamage() {
        this.inflictDamage(this.damageNumber, this.attackFrequency);
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
class MovementGenerator {
    leftLimit(img) {
        return window.outerWidth - parseInt($(img).css('width'));
    }
    leftPosition(img) {
        return parseInt($(img).css('left'));
    }
    distance(img, destination) {
        let leftNum = this.leftPosition(img);
        return Math.abs(destination - leftNum);
    }
    direction(img, destination) {
        let leftNum = this.leftPosition(img);
        let direction = leftNum < destination ? 'right' : 'left';
        return direction;
    }
    calcDimentions(img) {
        let scale = RandomNumberGen.randomNumBetween(0.5, 2.5);
        //    let rect = img.getBoundingClientRect();
        //    let currentScale = width / img.clientWidth;
        let width = img.naturalWidth;
        let height = img.naturalHeight;
        let newWidth = width * scale;
        let newHeight = height * scale;
        return { width: newWidth, height: newHeight };
    }
    lateralDestination(img) {
        let leftLimit = this.leftLimit(img);
        let destination = RandomNumberGen.randomNumBetween(0, leftLimit);
        return destination;
    }
    speed(distance) {
        let speed = distance * 2; //RandomNumberGen.randomNumBetween(quickest, slowest);
        return speed;
    }
    moveForward(dimentions, speed, image) {
        $(image).animate({ width: dimentions.width + 'px' }, { queue: false, duration: speed });
        $(image).animate({ height: dimentions.height + 'px' }, { queue: false, duration: speed });
    }
    moveLateral(distance, speed, image, callback) {
        $(image).animate({ left: distance + 'px' }, { duration: speed, complete: callback });
    }
}
class Troop extends RegEnemy {
    constructor(health, position, anim) {
        super("Troop", health, position, anim);
        this.damageNumber = 10;
        this.attackFrequency = 2000;
        this.carriedWeapon = GameInfo.allGuns.Pistol;
    }
    deadSound() {
        ded2.play();
    }
    die() {
        if (this.randomiseDrop(40))
            this.drop(new weaponPickup(this, GameInfo.allGuns.DukeMgun)); //this.carriedWeapon
        super.die();
    }
}
class ShotGun_Troop extends RegEnemy {
    constructor(health, position, anim) {
        super("ShotGun_Troop", health, position, anim);
        this.damageNumber = 20;
        this.attackFrequency = 2000;
        this.carriedWeapon = GameInfo.allGuns.Shotgun;
    }
    deadSound() {
        ded.play();
    }
    die() {
        if (this.randomiseDrop(40))
            this.drop(new weaponPickup(this, this.carriedWeapon));
        super.die();
    }
}
class ChainGGuy extends RegEnemy {
    constructor(health, position, anim, isBoss) {
        super("ChainGuy", health, position, anim);
        this.damageNumber = 30;
        this.attackFrequency = 1000;
        this.carriedWeapon = GameInfo.allGuns.Minigun;
        this.isBoss = isBoss;
        if (this.isBoss) {
            this.attackFrequency;
        }
        this.attackFrequency = this.isBoss ? this.attackFrequency / 3 : this.attackFrequency;
    }
    deadSound() {
        ded.play();
    }
    die() {
        this.drop(new weaponPickup(this, this.carriedWeapon));
        this.drop(new healthPickup(this, 50));
        super.die();
    }
}
class Imp extends RegEnemy {
    constructor(health, position, anim) {
        super("Imp", health, position, anim);
        this.damageNumber = 15;
        this.attackFrequency = 2000;
    }
    deadSound() {
        ded2.play();
    }
}
class SectorPatrol extends RegEnemy {
    constructor(health, position, anim) {
        super("Imp", health, position, anim);
        this.damageNumber = 15;
        this.attackFrequency = 2000;
    }
    deadSound() {
        ded2.play();
    }
}
class Extra extends RegEnemy {
    constructor(enemy, health, position, anim) {
        super(enemy, health, position, anim);
    }
    draw(position, anim) {
        super.draw(position, anim);
        //    this.DOMImage.classList.remove("infiniteAlternateReverse");
        this.DOMImage.classList.add('fillModeForwards', 'extraTarget');
    }
    die() {
        this.drop(new healthPickup(this, 50));
        GameInfo.deadExtraCount++;
        super.die();
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
