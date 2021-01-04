"use strict";
class Position {
    constructor(x, y, scale) {
        this.x = x;
        this.y = y;
        this.scale = scale;
    }
}
class AnimationInfo {
    constructor(anim, dur, iter, dir, tim) {
        this.animation = anim;
        this.duration = dur || '5s';
        this.timing = tim || 'ease';
        this.iterations = iter || 'infinite';
        this.direction = dir || "alternate";
    }
    animationString() {
        return this.animation + " " + this.duration + " " + this.timing + " " + this.iterations + " " + this.direction;
    }
}
class Pickup {
    constructor(source) {
        this.collectNoise = collectItem;
        this.source = source;
    }
    draw() {
        let img = document.createElement('img');
        this.DOMImage = img;
        img.setAttribute('src', this.image);
        img.classList.add('pickup', 'undraggable');
        img.classList.add(this.cssClass);
        let sourceWidth = this.source.DOMImage.getBoundingClientRect().width;
        let left = this.source.DOMImage.getBoundingClientRect().left + sourceWidth / 2; // MID
        let top = this.source.DOMImage.getBoundingClientRect().bottom - 100;
        img.style.left = left + 'px';
        img.style.top = top + 'px';
        //   img.style.border = "3px solid red"
        img.onclick = () => this.grab();
        img.onmouseover = () => this.setAsTarget();
        img.onmouseleave = () => this.unsetTarget();
        elements.targetBackdrop.appendChild(img);
        this.throw(left, top, img);
        Pickup.array.push(this);
    }
    undraw() {
        $(this.DOMImage).fadeOut(500, function () { $(this).remove(); });
    }
    grab() {
        this.collectNoise.play();
        this.blipAnim();
        setTimeout(() => { hideElement(this.DOMImage); }, 400);
    }
    blipAnim() {
        let width = parseInt($(this.DOMImage).css('width'));
        $(this.DOMImage).animate({ width: (width + 20) + 'px' }, 150);
        $(this.DOMImage).animate({ width: (width) + 'px' }, 150);
    }
    setAsTarget() {
        GameInfo.hitTarget = this;
        // GameInfo.targeting = true;
    }
    unsetTarget() {
        GameInfo.hitTarget = null;
        // GameInfo.targeting = false;
    }
    throw(left, top, img) {
        let randomLeftRight = RandomNumberGen.randomNumBetween(0, 1);
        let randomHeight = RandomNumberGen.randomNumBetween(20, 80);
        let randomDistance = RandomNumberGen.randomNumBetween(20, 80);
        $(img).css({ fontSize: 0 }).animate({
            fontSize: 45
        }, {
            duration: 300,
            easing: "linear",
            step: function (t, fx) {
                var a = t / 15;
                var x = randomLeftRight == 1 ? left - Math.cos(a) * randomDistance : left + Math.cos(a) * randomDistance;
                var y = top - Math.sin(a) * randomHeight;
                $(this).css({ left: x, top: y });
            }
        });
    }
}
Pickup.array = [];
class healthPickup extends Pickup {
    constructor(source, ammount) {
        super(source);
        this.image = pics.pickups.health.small;
        this.collectNoise = collectPowerup;
        this.ammount = ammount;
        //  this.image = ammount <= 50 ? pics.pickups.health.small : pics.pickups.health.big;
        if (ammount >= 50) {
            this.image = pics.pickups.health.big;
            this.cssClass = "pickup_health_big";
        }
        else {
            this.image = pics.pickups.health.small;
            this.cssClass = "pickup_health_small";
        }
    }
    grab() {
        Player.collectHealth(this.ammount);
        super.grab();
    }
}
class ammoPickup extends Pickup {
    constructor(source, weapon, size) {
        super(source);
        this.cssClass = "pickup_ammo";
        this.weapon = weapon;
        this.image = this.weapon.pickupStats.ammoImages[size];
        this.ammount = this.weapon.pickupStats.ammoAmmounts[size];
        this.cssClass = size == 'big' ? "pickup_ammo" : "pickup_ammo_small";
    }
    grab() {
        Player.collectAmmo(this.ammount, this.weapon.constructor.name);
        super.grab();
    }
}
class weaponPickup extends Pickup {
    constructor(source, weapon) {
        super(source);
        this.cssClass = "pickup_weapon";
        this.weapon = weapon;
        this.image = this.weapon.pickupStats.gunImage;
        this.cssClass = this.weapon instanceof Pistol ? "pickup_weapon_pistol" : "pickup_weapon";
    }
    grab() {
        Player.collectWeapon(this.weapon);
        super.grab();
    }
}
