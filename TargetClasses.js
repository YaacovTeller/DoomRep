"use strict";
var specialEnemy;
(function (specialEnemy) {
    specialEnemy[specialEnemy["Boss"] = 0] = "Boss";
    specialEnemy[specialEnemy["Extra"] = 1] = "Extra";
})(specialEnemy || (specialEnemy = {}));
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
        this.creatDOMPresenceWithImg();
        this.setImageSrc(enemyPics[this.enemy]);
        this.positionDiv(this.DOMdiv, position, anim);
        this.createHitbox();
    }
    creatDOMPresenceWithImg() {
        let div = document.createElement("div");
        let img = document.createElement("img");
        this.DOMdiv = div;
        this.DOMImage = img;
        this.DOMImage.classList.add("height_100", "undraggable", "noPointerEvents");
        div.appendChild(img);
        elements.targetBackdrop.appendChild(this.DOMdiv);
    }
    createHitbox() {
        let hitbox = document.createElement("div");
        hitbox.onmouseover = () => GameInfo.setAsTarget(this);
        hitbox.onmouseleave = () => GameInfo.unsetTarget();
        hitbox.classList.add('hitbox', 'autoPointerEvents');
        this.DOMdiv.appendChild(hitbox);
        this.applyHitboxArea(hitbox);
        let headshotBox = document.createElement("div");
        headshotBox.onmouseover = () => GameInfo.setHeadTargeting();
        headshotBox.onmouseleave = () => GameInfo.unsetHeadTargeting();
        headshotBox.classList.add("headshotBox");
        hitbox.appendChild(headshotBox);
        this.applyHeadshotBoxArea(headshotBox);
    }
    positionDiv(div, position, anim) {
        div.classList.add('undraggable', 'absolute', 'flexJustifyCenter', 'noPointerEvents', "fillModeForwards");
        div.style.left = position.x + "%";
        div.style.top = position.y + "%";
        div.style.transform = position.scale ? `scale(${position.scale})` : `scale(${position.y / 50 * position.y / 50})`; // Attempt auto-size based on position
        this.applyAnimations(anim, div);
    }
    applyHitboxArea(hitbox) {
        hitbox.style.width = '75%';
        hitbox.style.height = '100%';
        hitbox.style.paddingTop = '10px';
        hitbox.style.marginTop = '5px';
        //   hitbox.style.margin = "0px 10px 100px"
    }
    applyHeadshotBoxArea(headshotBox) {
        if (headshotBox) {
            headshotBox.style.width = '30%';
            headshotBox.style.height = '20%';
        }
    }
    applyAnimations(anim, img) {
        if (anim) {
            let arr = [];
            for (let a of anim) {
                arr.push(a.animationString());
            }
            img.style.animation = arr.join(", ");
        }
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
        $(this.DOMdiv).fadeOut(300, function () { $(this).remove(); });
    }
    loseHealth(damage) {
        damage = GameInfo.headTargeting ? damage * 2 : damage;
        this.health -= damage;
        this.setImageSrc(enemyPics.hurt[this.enemy]);
        let _this = this;
        if (this.health <= 0) {
            this.establishCauseOfDeath();
        }
        // Calls redraw to reset
        else {
            setTimeout(() => _this.redraw(this), 200);
        }
    }
    establishCauseOfDeath() {
        let gib, headshot;
        if (GameInfo.headTargeting) {
            headshot = true;
        }
        this.die(gib, headshot);
    }
    freezeAllMovement() {
        this.DOMdiv.style.animationPlayState = "paused"; // stop css...
        $(this.DOMdiv).stop(); // ...and jquery movement
    }
    selectDeathGif(gib, headshot) {
        let pic;
        if (GameInfo.kidMode) {
            pic = enemyPics.dead_alt[this.enemy];
        }
        else {
            if (gib) {
                pic = enemyPics.explode[this.enemy];
            }
            else {
                if (headshot && enemyPics.headshot[this.enemy]) {
                    pic = enemyPics.headshot[this.enemy];
                }
                else {
                    pic = enemyPics.dead[this.enemy];
                    if (this instanceof Imp && RandomNumberGen.randomNumBetween(0, 3) == 3) { // FIX, alt deaths need a proper system
                        pic = enemyPics.dead[this.enemy + '_alt'];
                    }
                }
            }
        }
        return pic;
    }
    die(gib, headshot) {
        headshot ? console.log("headshot!") : null;
        this.deadFlag = true;
        let pic = this.selectDeathGif(gib, headshot);
        this.setImageSrc(pic);
        this.freezeAllMovement();
        GameInfo.unsetTarget();
        GameInfo.unsetHeadTargeting();
        let hitbox = this.DOMdiv.getElementsByClassName('hitbox')[0];
        this.DOMdiv.removeChild(hitbox); // messy, get back the hitbox to prevent multiple deaths...
        if (this.randomiseDrop(85)) {
            this.drop(new healthPickup(this, 20));
        }
        if (!GameInfo.kidMode) {
            this.deadSound();
        }
    }
}
class RegEnemy extends Target {
    constructor(enemy, position, health, anim, special) {
        super(enemy, position, health, anim);
        this.noRandomMovement = false;
        this.mover = new MovementGenerator;
        this.specialStatus = special;
    }
    loseHealth(damage) {
        super.loseHealth(damage);
        if (this.specialStatus == specialEnemy.Boss) {
            LevelHandler.reduceBar(this.health);
        }
    }
    extraDrops() {
        this.drop(new healthPickup(this, 50));
        if (this.randomiseDrop(50)) {
            this.drop(new weaponPickup(this, GameInfo.allGuns.DualNeutron));
        }
        else {
            this.drop(new weaponPickup(this, GameInfo.allGuns.Pipebomb));
        }
    }
    die(gib, headshot) {
        super.die(gib, headshot);
        clearInterval(this.attackRoller);
        clearInterval(this.damaging);
        clearInterval(this.moveRoller);
        if (this.specialStatus == specialEnemy.Extra) {
            GameInfo.deadExtraCount++;
            this.extraDrops();
        }
        else {
            GameInfo.deadCount++;
            LevelHandler.sceneCheck();
        }
        DOMUpdater.updateKillCounter(GameInfo.getTotalKills());
    }
    hitRoll(damage, hitLimit) {
        if (Player.dead == false) {
            var die = RandomNumberGen.randomNumBetween(1, 6);
            if (die >= hitLimit) {
                this.firing = true;
                $(this.DOMdiv).stop();
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
        let width = this.DOMdiv.getBoundingClientRect().width;
        let height = this.DOMdiv.getBoundingClientRect().height;
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
        let lateralDestination = this.mover.lateralDestination(this.DOMdiv);
        let distance = this.mover.distance(this.DOMdiv, lateralDestination);
        let direction = this.mover.direction(this.DOMdiv, lateralDestination);
        let speed = this.mover.speed(distance);
        this.setImageSrc(enemyPics[direction][this.enemy]);
        let _this = this;
        this.mover.moveLateral(lateralDestination, speed, this.DOMdiv, () => _this.redraw(_this));
        //    this.mover.moveForward(this.mover.calcDimentions(this.DOMdiv), speed, this.DOMdiv);
    }
    test_precalculatedLateralMove(lateralDestination, speed) {
        let direction = this.mover.direction(this.DOMdiv, lateralDestination);
        this.setImageSrc(enemyPics[direction][this.enemy]);
        let _this = this;
        this.mover.moveLateral(lateralDestination, speed, this.DOMdiv, () => _this.redraw(_this));
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
    constructor(position, health, anim, special) {
        super("Troop", position, health, anim, special);
        this.baseHealth = 40;
        this.damageNumber = 10;
        this.attackFrequency = 2000;
        //  public carriedWeapon = GameInfo.allGuns.Pistol;
        this.carriedWeapon = GameInfo.allGuns.DukeMgun;
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
    die(gib, headshot) {
        if (!this.specialStatus && this.randomiseDrop(40)) {
            this.drop(new weaponPickup(this, this.carriedWeapon));
        }
        super.die(gib, headshot);
    }
    applyHitboxArea(hitbox) {
        hitbox.style.width = '60%';
        hitbox.style.height = '100%';
        hitbox.style.marginLeft = '-30px';
        //   hitbox.style.margin = "0px 10px 100px"
    }
}
class ShotGun_Troop extends RegEnemy {
    constructor(position, health, anim, special) {
        super("ShotGun_Troop", position, health, anim, special);
        this.baseHealth = 40;
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
    die(gib, headshot) {
        if (this.randomiseDrop(40))
            this.drop(new weaponPickup(this, this.carriedWeapon));
        super.die(gib, headshot);
    }
}
class ChainGGuy extends RegEnemy {
    constructor(position, health, anim, special) {
        super("ChainGuy", position, health, anim, special);
        this.baseHealth = 130;
        this.damageNumber = 30;
        this.attackFrequency = 2000;
        this.carriedWeapon = GameInfo.allGuns.Minigun;
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
    die(gib, headshot) {
        this.drop(new weaponPickup(this, this.carriedWeapon));
        this.drop(new healthPickup(this, 30));
        super.die(gib, headshot);
    }
    applyHitboxArea(hitbox) {
        hitbox.style.width = '55%';
        hitbox.style.height = '95%';
        //   hitbox.style.margin = "0px 10px 100px"
    }
}
class Imp extends RegEnemy {
    constructor(position, health, anim, special) {
        super("Imp", position, health, anim, special);
        this.baseHealth = 40;
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
    constructor(position, health, anim, special) {
        super("SectorPatrol", position, health, anim, special);
        this.baseHealth = 30;
        this.damageNumber = 10;
        this.attackFrequency = 2000;
        this.carriedWeapon = GameInfo.allGuns.Pistol;
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
    die(gib, headshot) {
        this.drop(new weaponPickup(this, this.carriedWeapon));
        super.die(gib, headshot);
    }
}
class AreaAffect {
    constructor(blastRadius, gibRadius) {
        this.blastRadius = blastRadius;
        this.gibRadius = gibRadius;
    }
    killInBlastRadius(epicenter) {
        this.blastArray(epicenter, GameInfo.enemyArray);
        this.blastArray(epicenter, GameInfo.itemArray);
    }
    blastArray(epicenter, array) {
        for (let enemy of array) {
            if (!enemy || enemy.deadFlag == true)
                continue;
            let rect = enemy.DOMdiv.getBoundingClientRect();
            if (this.checkDistance(epicenter, rect, this.blastRadius)) {
                if (this.checkDistance(epicenter, rect, this.gibRadius)) {
                    enemy.die(true);
                }
                else {
                    enemy.die();
                }
            }
        }
    }
    checkDistance(epicenter, rect, distance) {
        let left = rect.left;
        let right = left + rect.width;
        return epicenter >= left - distance && epicenter <= right + distance;
    }
}
class Item extends Target {
    constructor(item, position, health, anim) {
        super(item, position, health, anim);
        this.gibRadius = 250;
        this.blastRadius = 400;
        this.areaAffect = new AreaAffect(this.blastRadius, this.gibRadius);
    }
    die() {
        // killAllEnemies(true);
        super.die();
        this.barrelExplode();
    }
    centerPosition() {
        let rect = this.DOMdiv.getBoundingClientRect();
        let left = rect.left;
        let width = rect.width;
        let centre = left + (width / 2);
        return centre;
    }
    barrelExplode() {
        let barrelCenter = this.centerPosition();
        this.areaAffect.killInBlastRadius(barrelCenter);
    }
    checkDistance(left1, left2) {
        return Math.abs(left1 - left2);
    }
    applyHitboxArea(hitbox) {
        hitbox.style.width = '38%';
        hitbox.style.height = '60%';
        hitbox.style.margin = "47px -7px 0px";
        hitbox.style.borderRadius = '10px';
    }
    deadSound() {
        explosion.play();
    }
}
