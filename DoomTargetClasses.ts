//TheQuickAndTheDead
class GameInfo {
    public static hitTarget: Target = null;
    public static targeting: boolean = false;
    public static deadCount: number = 0;
    public static deadExtraCount: number = 0;
}

// interface Function { // to get class names from an instance // relevant for es5
//     name: string;
// }

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

class pickup {
    protected source: Target
    protected image;// = pics.pickups.shotgun;
    protected cssClass
    constructor(source) {
        this.source = source;
    }
    public draw(){
        let img:HTMLElement = document.createElement('img');
        
        img.setAttribute('src', this.image);
        img.classList.add('pickup');
        img.classList.add(this.cssClass);
        let left = this.source.DOMImage.getBoundingClientRect().right;
        let top = this.source.DOMImage.getBoundingClientRect().bottom - 100;
        img.style.left = left + 'px';
        img.style.top = top + 'px';
     //   img.style.border = "3px solid red"
        elements.targetBackdrop.appendChild(img);
        this.throw(left, top, img);
    }
    private throw(left, top, img){
        $(img).css({ fontSize: 0 }).animate({
            fontSize: 45
        },{
            duration: 500,
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
class ammoPickup extends pickup{
    protected cssClass = "pickup_ammo"
    protected image = pics.pickups.shells;
}
class weaponPickup extends pickup{
    protected cssClass = "pickup_weapon"
    protected image = pics.pickups.shotgun;
}

// parent class, handles drawing and damaging.
abstract class Target {
    public num: number;
    public enemy: string;
    public health: number;
    public healthUnit: number;
    public DOMImage: HTMLElement;
    public deadFlag: boolean = false;
    constructor(enemy, health, position: Position, anim: AnimationInfo) {
        this.health = health;
        this.enemy = enemy;
        this.draw(position, anim);
    }
    
    protected draw(position, anim?){
        var img:HTMLElement = document.createElement("img");
        img.setAttribute('class', "target"); //infiniteAlternateReverse
        
        img.setAttribute('id', `tgt${RegEnemy.enemyArray.length}`);
        img.onmouseover = () => this.setAsTarget();
        img.onmouseleave = () => this.unsetTarget();
        img.setAttribute('src', enemyPics[this.enemy]);
        img.setAttribute('draggable', `false`);
      //  img.style.border = "2px solid red"
        img.style.borderRadius = "55px" // reduce the hitbox?
        img.style.left = position.x +"%";
        img.style.top = position.y +"%";
        img.style.transform = position.scale ? `scale(${position.scale})` : `scale(${position.y/50*position.y/50})`
        if (anim){
            let str = anim.animationString();
            img.style.animation = str;
        }
        elements.targetBackdrop.appendChild(img);
        this.DOMImage = img;
    }
    public redraw(_this) {
        if (_this.deadFlag == false) {
            _this.DOMImage.setAttribute("src", enemyPics[_this.enemy]);
        }
    }
    public undraw(){
        $(this.DOMImage).fadeOut(300, function() { $(this).remove(); })
    }
    
    public loseHealth(damage) {
        this.health -= damage;
        this.DOMImage.setAttribute("src", enemyPics.hurt[this.enemy]);
        let _this = this;
        if (this.health <= 0) { this.die() }
        // Calls redraw to reset
        else { setTimeout(()=>_this.redraw(_this), 200); }
    }

    protected die(){
        this.deadFlag = true;
        this.DOMImage.style.animationPlayState = "paused";
        this.DOMImage.setAttribute("src", enemyPics.dead[this.enemy] + "?a=" + Math.random());
        this.DOMImage.style.pointerEvents = "none";
        this.deadSound();
    }

    abstract deadSound()

    // The machine gun damage function
    public setAsTarget() {
        GameInfo.hitTarget = this;
        GameInfo.targeting = true;
    }
    public unsetTarget() {
        GameInfo.targeting = false;
        GameInfo.hitTarget = null;
    }
}

abstract class RegEnemy extends Target {
    public static enemyArray: Array<RegEnemy> = new Array();
    protected damageNumber: number;
    public attackFrequency: number;
    public attackRoller;
    public damaging;

    constructor(enemy, health, position, anim) {
        super(enemy, health, position, anim)
    }

    // public draw(position, anim) {
    //     super.draw(position, anim);
    // }
    public die() {
        super.die();
        clearInterval(this.attackRoller);
        clearInterval(this.damaging);
        if (!(this instanceof Extra)){
            GameInfo.deadCount++
            levelCheck();
        } 
        DOMUpdater.updateKillCounter(GameInfo.deadCount + GameInfo.deadExtraCount);
    }
    private hitRoll(damage) {
        if (Player.dead == false) {
            var die = (Math.floor(Math.random() * 7))
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
    protected inflictDamage(damage, attackFrequency) {
        if (!damage) return;
        var firingEnemy = this;
        this.attackRoller = setInterval(function(){firingEnemy.hitRoll(damage)}, attackFrequency);
    }
}

class Troop extends RegEnemy {
    public damageNumber = 10;
    public attackFrequency = 2000;

    constructor(health, position, anim?) {
        super("Troop", health, position, anim)
        this.inflictDamage(this.damageNumber, this.attackFrequency);
    }
    public deadSound() {
        ded2.play()
    }
}
class ShotGGuy extends RegEnemy {
    public damageNumber = 20;
    public attackFrequency = 2000;
    constructor(health, position, anim?) {
        super("ShotGGuy", health, position, anim)
        this.inflictDamage(this.damageNumber, this.attackFrequency);
    }
    public deadSound() {
        ded.play()
    }
    public die(){
        let p = new ammoPickup(this);
        p.draw();
        super.die();
    }
}
class Imp extends RegEnemy {
    public damageNumber = 15;
    public attackFrequency = 2000;
    constructor(health, position, anim?) {
        super("Imp", health, position, anim)
        this.inflictDamage(this.damageNumber, this.attackFrequency);
    }
    public deadSound() {
        ded2.play()
    }
}
class Extra extends RegEnemy {
    constructor(enemy, health, position, anim?) {
        super(enemy, health, position, anim)
    }
    public draw(position, anim) {
        super.draw(position, anim)
    //    this.DOMImage.classList.remove("infiniteAlternateReverse");
        this.DOMImage.classList.add('fillModeForwards', 'extraTarget')
   }
    public die() {
        GameInfo.deadExtraCount++
        super.die();
        let p = new weaponPickup(this);
        p.draw();
    }
    public deadSound() {
        let str = "";
         if (this.enemy.includes("Troop")) { ded2.play() }
         else if (this.enemy == "ShotGGuy") { ded.play() }
         else if (this.enemy == "Imp") { ded.play() }
    }
}
let a: string
class Boss extends RegEnemy {
    damageNumber = 30;
    attackFrequency = 300;
    bar:HTMLElement;
    constructor(enemy, health, position, anim?) {
        super(enemy, health, position, anim)
        this.inflictDamage(this.damageNumber, this.attackFrequency);
        this.bar = elements.Bar;
    }
    public fillBar() {
        showElement(this.bar);
        this.bar.style.width = `100%`;
    }
    public loseHealth(damage){
        super.loseHealth(damage);
        this.bar.style.width = `${this.health / 2}%`;
    }
    public die() {
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
        stopTimer();
        sectionFinish();
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
    static weapon: weaponry;
    static slungWeapon: weaponry;
    static damageCheck(damager: RegEnemy, damage) {
        damager.damaging = setTimeout(function () { 
            if (riotShieldDeployed == false) {
                Player.playerHit(damage)
            }
            else Turicochet.play();
        }, 1000);
    }

    static playerHit(damage){
        Player.health -= damage;
        if (Player.health > 0) {
            DOMUpdater.updateHealthCounter(Player.health);
            document.body.style.animationName = "hit";
            Player.hurtSound();
            setTimeout(function () { document.body.style.removeProperty("animation-name") }, 1100);
        }
        else { Player.playerDeath() }
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
    public static deadSound() {
        Turokscream.play();
    }
    public static hurtSound() {
        Hlifescream1.play()
    }
}