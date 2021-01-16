class Position{
    x: number;
    y: number;
    scale: number;
    constructor(x,y,scale?){
        this.x = x;
        this.y = y;
        this.scale = scale
    }
}
class AnimationInfo{
    animation: string;
    duration: string;
    timing: string;
    iterations: string;
    direction: string; //alternate-reverse

    constructor(anim, dur, iter?, dir?, tim?){
        this.animation = anim;
        this.duration = dur || '5s';
        this.timing = tim || 'ease';
        this.iterations = iter || 'infinite';
        this.direction = dir || "alternate";
    }
    public animationString(){
        return this.animation+" "+this.duration+" "+this.timing+" "+this.iterations+" "+this.direction;
    }
}

class Pickup {
    protected source: Target
    protected image: string;
    protected DOMImage: HTMLElement;
    protected collectNoise = collectItem;
    protected cssClass: string
    constructor(source: Target) {
        this.source = source;
    }
    public draw(){
        let img:HTMLElement = document.createElement('img');
        this.DOMImage = img;
        img.setAttribute('src', this.image);
        img.classList.add('pickup','undraggable');
        img.classList.add(this.cssClass);
        let sourceWidth = this.source.DOMImage.getBoundingClientRect().width;
        let left = this.source.DOMImage.getBoundingClientRect().left + sourceWidth/2; // MID
        let top = this.source.DOMImage.getBoundingClientRect().bottom - 100;
        img.style.left = left + 'px';
        img.style.top = top + 'px';
     //   img.style.border = "3px solid red"
        img.onclick = () => this.grab();
        img.onmouseover = () => this.setAsTarget();
        img.onmouseleave = () => this.unsetTarget();
        elements.targetBackdrop.appendChild(img);
        this.throw(left, top, img);
        GameInfo.pickupArray.push(this);
    }
    public undraw(){
        $(this.DOMImage).fadeOut(500, function() { $(this).remove(); })
    }

    protected grab(){
        this.collectNoise.play();
        this.blipAnim();
        setTimeout(() => { hideElement(this.DOMImage); }, 400); 
    }
    protected blipAnim(){
        let width = parseInt($(this.DOMImage).css('width'))
        $(this.DOMImage).animate({width: (width + 20)+'px'}, 150);
        $(this.DOMImage).animate({width: (width)+'px'}, 150);
    }

    public setAsTarget() {
        GameInfo.hitTarget = this;
       // GameInfo.targeting = true;
    }
    public unsetTarget() {
        GameInfo.hitTarget = null;
       // GameInfo.targeting = false;
    }

    private throw(left, top, img){
        let randomLeftRight = RandomNumberGen.randomNumBetween(0,1)
        let randomHeight = RandomNumberGen.randomNumBetween(20,80)
        let randomDistance = RandomNumberGen.randomNumBetween(20,80)
        $(img).css({ fontSize: 0 }).animate({
            fontSize: 45
        },{
            duration: 300,
            easing: "linear",
            step: function(t, fx){
                var a = t/15;
                var x = randomLeftRight == 1 ? left - Math.cos(a) * randomDistance : left + Math.cos(a) * randomDistance;
                var y = top - Math.sin(a) * randomHeight;
                $(this).css({ left: x, top: y });
            }
        });
    }
}
class healthPickup extends Pickup{
    protected image = pics.pickups.health.small;
    public ammount: number
    protected collectNoise = collectPowerup;
    constructor(source: Target, ammount: number) {
        super(source);
        this.ammount = ammount;
      //  this.image = ammount <= 50 ? pics.pickups.health.small : pics.pickups.health.big;
        if (ammount >= 50){
            this.image = pics.pickups.health.big;
            this.cssClass = "pickup_health_big"
        }
        else {
            this.image = pics.pickups.health.small;
            this.cssClass = "pickup_health_small"
        }
    }
    public grab() {
        Player.collectHealth(this.ammount);
        super.grab();
    }
}

class ammoPickup extends Pickup{
    public weapon: weaponry
    public ammount: number
    protected cssClass = "pickup_ammo"
    protected image;
    constructor(source: Target, weapon:weaponry, size: string){
        super(source);
        this.weapon = weapon;
        this.image = this.weapon.pickupStats.ammoImages[size];
        this.ammount = this.weapon.pickupStats.ammoAmmounts[size];
        if (weapon instanceof Pistol){
            this.cssClass = "pickup_ammo_small"; // FIX!! need proper solution for ammo width classes
        }
        else{
            this.cssClass = size == 'big' ? "pickup_ammo" : "pickup_ammo_small";
        }
    }
    public grab(){
        Player.collectAmmo(this.ammount, this.weapon.constructor.name)
        super.grab();
    }
}

class weaponPickup extends Pickup{
    public weapon: weaponry
    protected cssClass = "pickup_weapon"
    protected image;
    constructor(source: Target, weapon:weaponry){
        super(source);
        this.weapon = weapon;
        this.image = this.weapon.pickupStats.gunImage;
        this.cssClass = this.weapon instanceof Pistol ? "pickup_weapon_pistol" : "pickup_weapon";
    }
    public grab(){
        Player.collectWeapon(this.weapon)
        super.grab();
    }
}

