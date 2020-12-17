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
        img.setAttribute('class', "target"); //infiniteAlternateReverse
        img.setAttribute('id', `tgt${RegEnemy.enemyArray.length}`);
        img.onmouseover = () => this.setAsTarget();
        img.onmouseleave = () => this.unsetTarget();
        img.setAttribute('src', enemyPics[this.enemy]);
        img.setAttribute('draggable', `false`);
        //  img.style.border = "2px solid red"
        img.style.borderRadius = "55px"; // reduce the hitbox?
        img.style.left = position.x + "%";
        img.style.top = position.y + "%";
        img.style.transform = position.scale ? `scale(${position.scale})` : `scale(${position.y / 50 * position.y / 50})`;
        if (anim) {
            let str = anim.animationString();
            img.style.animation = str;
        }
        elements.targetBackdrop.appendChild(img);
        this.DOMImage = img;
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
        if (this.health <= 0) {
            this.die();
        }
        // Calls redraw to reset
        else {
            setTimeout(() => _this.redraw(_this), 200);
        }
    }
    die() {
        this.deadFlag = true;
        this.DOMImage.style.animationPlayState = "paused";
        this.DOMImage.setAttribute("src", enemyPics.dead[this.enemy] + "?a=" + Math.random());
        this.DOMImage.style.pointerEvents = "none";
        this.deadSound();
    }
    // The machine gun damage function
    setAsTarget() {
        GameInfo.hitTarget = this;
        GameInfo.targeting = true;
    }
    unsetTarget() {
        GameInfo.targeting = false;
        GameInfo.hitTarget = null;
    }
}
class RegEnemy extends Target {
    constructor(enemy, health, position, anim) {
        super(enemy, health, position, anim);
    }
    // public draw(position, anim) {
    //     super.draw(position, anim);
    // }
    die() {
        super.die();
        clearInterval(this.attackRoller);
        clearInterval(this.damaging);
        if (!(this instanceof Extra)) {
            GameInfo.deadCount++;
            levelCheck();
        }
        DOMUpdater.updateKillCounter(GameInfo.deadCount + GameInfo.deadExtraCount);
    }
    hitRoll(damage) {
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
    }
    inflictDamage(damage, attackFrequency) {
        if (!damage)
            return;
        var firingEnemy = this;
        this.attackRoller = setInterval(function () { firingEnemy.hitRoll(damage); }, attackFrequency);
    }
}
RegEnemy.enemyArray = new Array();
class Troop extends RegEnemy {
    constructor(health, position, anim) {
        super("Troop", health, position, anim);
        this.damageNumber = 10;
        this.attackFrequency = 2000;
        this.inflictDamage(this.damageNumber, this.attackFrequency);
    }
    deadSound() {
        ded2.play();
    }
}
class ShotGGuy extends RegEnemy {
    constructor(health, position, anim) {
        super("ShotGGuy", health, position, anim);
        this.damageNumber = 20;
        this.attackFrequency = 2000;
        this.inflictDamage(this.damageNumber, this.attackFrequency);
    }
    deadSound() {
        ded.play();
    }
    die() {
        if (!Player.weaponCollection[allGuns.Shotgun.constructor.name]) {
            let gun = new weaponPickup(this, allGuns.Shotgun);
            gun.draw();
        }
        else {
            let ammo = new ammoPickup(this, allGuns.Shotgun, 8);
            ammo.draw();
        }
        super.die();
    }
}
class Imp extends RegEnemy {
    constructor(health, position, anim) {
        super("Imp", health, position, anim);
        this.damageNumber = 15;
        this.attackFrequency = 2000;
        this.inflictDamage(this.damageNumber, this.attackFrequency);
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
        GameInfo.deadExtraCount++;
        super.die();
    }
    deadSound() {
        let str = "";
        if (this.enemy.includes("Troop")) {
            ded2.play();
        }
        else if (this.enemy == "ShotGGuy") {
            ded.play();
        }
        else if (this.enemy == "Imp") {
            ded.play();
        }
    }
}
class Boss extends RegEnemy {
    constructor(enemy, health, position, anim) {
        super(enemy, health, position, anim);
        this.damageNumber = 30;
        this.attackFrequency = 300;
        this.inflictDamage(this.damageNumber, this.attackFrequency);
        this.bar = elements.Bar;
    }
    fillBar() {
        showElement(this.bar);
        this.bar.style.width = `100%`;
    }
    loseHealth(damage) {
        super.loseHealth(damage);
        this.bar.style.width = `${this.health / 2}%`;
    }
    die() {
        this.deadFlag = true;
        clearInterval(this.attackRoller);
        clearInterval(this.damaging);
        this.bar.style.width = `0%`;
        this.DOMImage.removeAttribute("onmouseenter");
        this.DOMImage.removeAttribute("onmousedown");
        this.DOMImage.setAttribute("src", enemyPics.dead.ChainGuy);
        this.DOMImage.style.pointerEvents = "none";
        DOMUpdater.updateKillCounter(GameInfo.deadCount + GameInfo.deadExtraCount);
        this.deadSound();
        let gun = new weaponPickup(this, allGuns.Minigun);
        gun.draw();
        stopTimer();
        sectionFinish();
    }
    deadSound() {
        if (this.enemy == "ChainGuy") {
            bossDed.play();
        }
    }
}
class Player {
    static damageCheck(damager, damage) {
        damager.damaging = setTimeout(function () {
            if (riotShieldDeployed == false) {
                Player.playerHit(damage);
            }
            else
                Turicochet.play();
        }, 1000);
    }
    static collectWeapon(weapon) {
        this.weaponCollection[weapon.constructor.name] = weapon;
        this.selectWeapon(weapon);
    }
    static selectWeapon(weapon) {
        weapon.switchTo();
        Player.weapon = weapon;
    }
    static playerHit(damage) {
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
    }
    static playerDeath() {
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
    }
    static deadSound() {
        Turokscream.play();
    }
    static hurtSound() {
        Hlifescream1.play();
    }
}
Player.health = 100;
Player.dead = false;
Player.weaponCollection = {};
