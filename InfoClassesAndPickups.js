"use strict";
class GameInfo {
}
GameInfo.hitTarget = null;
GameInfo.targeting = false;
GameInfo.deadCount = 0;
GameInfo.deadExtraCount = 0;
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
        this.direction = dir || "";
    }
    animationString() {
        return this.animation + " " + this.duration + " " + this.timing + " " + this.iterations + " " + this.direction;
    }
}
class Pickup {
    constructor(source) {
        this.source = source;
    }
    draw() {
        let img = document.createElement('img');
        this.DOMImage = img;
        img.setAttribute('src', this.image);
        img.classList.add('pickup');
        img.classList.add(this.cssClass);
        let left = this.source.DOMImage.getBoundingClientRect().right;
        let top = this.source.DOMImage.getBoundingClientRect().bottom - 100;
        img.style.left = left + 'px';
        img.style.top = top + 'px';
        //   img.style.border = "3px solid red"
        img.onclick = () => this.grab();
        elements.targetBackdrop.appendChild(img);
        this.throw(left, top, img);
    }
    grab() {
        hideElement(this.DOMImage);
    }
    setAsTarget() {
        GameInfo.hitTarget = this;
        // GameInfo.targeting = true;
    }
    throw(left, top, img) {
        $(img).css({ fontSize: 0 }).animate({
            fontSize: 45
        }, {
            duration: 300,
            easing: "linear",
            step: function (t, fx) {
                var a = t / 15;
                var x = left - Math.cos(a) * 50;
                var y = top - Math.sin(a) * 50;
                $(this).css({ left: x, top: y });
            }
        });
    }
}
class ammoPickup extends Pickup {
    constructor(source, weapon, ammount) {
        super(source);
        this.cssClass = "pickup_ammo";
        this.image = pics.pickups.shells;
        this.weapon = weapon;
        this.ammount = ammount;
    }
    grab() {
        this.weapon.ammo += this.ammount;
        if (Player.weapon == this.weapon) {
            DOMUpdater.updateAmmoCounter(Player.weapon.ammo);
        }
        super.grab();
    }
}
class weaponPickup extends Pickup {
    constructor(source, weapon) {
        super(source);
        this.cssClass = "pickup_weapon";
        this.weapon = weapon;
        this.image = pics.pickups[weapon.constructor.name];
    }
    grab() {
        Player.collectWeapon(this.weapon);
        super.grab();
    }
}
