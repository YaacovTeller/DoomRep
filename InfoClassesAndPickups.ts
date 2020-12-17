class GameInfo {
    public static hitTarget: any = null;
    public static targeting: boolean = false;
    public static deadCount: number = 0;
    public static deadExtraCount: number = 0;
}

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
        this.direction = dir || "";
    }
    public animationString(){
        return this.animation+" "+this.duration+" "+this.timing+" "+this.iterations+" "+this.direction;
    }
}

class Pickup {
    protected source: Target
    protected image: string;
    protected DOMImage: HTMLElement;
    protected cssClass: string
    constructor(source: Target) {
        this.source = source;
    }
    public draw(){
        let img:HTMLElement = document.createElement('img');
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
    protected grab(){
        hideElement(this.DOMImage);
    }

    public setAsTarget() {
        GameInfo.hitTarget = this;
       // GameInfo.targeting = true;
    }

    private throw(left, top, img){
        $(img).css({ fontSize: 0 }).animate({
            fontSize: 45
        },{
            duration: 300,
            easing: "linear",
            step: function(t, fx){
                var a = t/15;
                var x = left - Math.cos(a) * 50;
                var y = top - Math.sin(a) * 50;
                $(this).css({ left: x, top: y });
            }
        });
    }
}
class ammoPickup extends Pickup{
    public weapon: weaponry
    public ammount: number
    protected cssClass = "pickup_ammo"
    protected image = pics.pickups.shells;
    constructor(source: Target, weapon:weaponry,ammount:number){
        super(source);
        this.weapon = weapon;
        this.ammount = ammount;
    }
    public grab(){
        this.weapon.ammo += this.ammount;
        if (Player.weapon == this.weapon){
            DOMUpdater.updateAmmoCounter(Player.weapon.ammo);
        }
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
        this.image = pics.pickups[weapon.constructor.name];
    }
    public grab(){
        Player.collectWeapon(this.weapon)
        super.grab();
    }
}

