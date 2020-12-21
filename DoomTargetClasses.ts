//TheQuickAndTheDead
// parent class, handles drawing and damaging.
abstract class Target {
    public num: number;
    public enemy: string;
    public health: number;
    public healthUnit: number;
    public DOMImage: HTMLElement;
    public deadFlag: boolean = false;
    public isBoss: boolean;
    protected carriedWeapon: weaponry;
    constructor(enemy, health, position: Position, anim: AnimationInfo) {
        this.health = health;
        this.enemy = enemy;
        this.draw(position, anim);
    }
    
    protected draw(position, anim?){
        var img:HTMLElement = document.createElement("img");
        img.classList.add("target", "undraggable")

      //  img.setAttribute('id', `tgt${RegEnemy.enemyArray.length}`);
        img.onmouseover = () => this.setAsTarget();
        img.onmouseleave = () => this.unsetTarget();
        img.setAttribute('src', enemyPics[this.enemy]);
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
    protected randomiseDrop(num){
        let roll = Math.floor(Math.random() * 100);
        if (roll >= num){
            return true
        }
    }
    protected drop(pickup: Pickup) {
        let num = RandomNumberGen.randomNumBetween(1,5);
        let size = num == 5 ? "big" : "small";
        if (pickup instanceof weaponPickup && Player.weaponCollection[pickup.weapon.constructor.name]) {
            pickup = new ammoPickup(this, pickup.weapon, size);
        } 
        pickup.draw();
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
        if (this.isBoss) {
            reduceBar(this.health);
        }
        if (this.health <= 0) { this.die() }
        // Calls redraw to reset
        else { setTimeout(()=>_this.redraw(_this), 200); }
    }

    protected die(){
        this.deadFlag = true;
        this.DOMImage.style.animationPlayState = "paused";
        this.DOMImage.setAttribute("src", enemyPics.dead[this.enemy] + "?a=" + Math.random());
        this.DOMImage.style.pointerEvents = "none";
        if (this.randomiseDrop(80))this.drop(new healthPickup(this, 20));
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
    protected damageNumber: number;
    public attackFrequency: number;
    public attackRoller;
    public damaging;
    public isBoss: boolean;

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
                if (GameInfo.riotShieldDeployed == false) {
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
    public carriedWeapon = GameInfo.allGuns.Pistol;

    constructor(health, position, anim?) {
        super("Troop", health, position, anim)
        this.inflictDamage(this.damageNumber, this.attackFrequency);
    }
    public deadSound() {
        ded2.play()
    }
    public die(){
        if (this.randomiseDrop(30))this.drop(new weaponPickup(this, GameInfo.allGuns.DukeMgun));//this.carriedWeapon
        super.die();
    }
}

class ShotGun_Troop extends RegEnemy {
    public damageNumber = 20;
    public attackFrequency = 2000;
    public carriedWeapon = GameInfo.allGuns.Shotgun;

    constructor(health, position, anim?) {
        super("ShotGun_Troop", health, position, anim)
        this.inflictDamage(this.damageNumber, this.attackFrequency);
    }
    public deadSound() {
        ded.play()
    }
    public die(){
        if (this.randomiseDrop(30))this.drop(new weaponPickup(this, this.carriedWeapon));
        super.die();
    }
}
class ChainGGuy extends RegEnemy {
    public damageNumber = 30;
    public attackFrequency = 1000;
    public carriedWeapon = GameInfo.allGuns.Minigun;

    constructor(health, position, anim?, isBoss?) {
        super("ChainGuy", health, position, anim)
        this.isBoss = isBoss;
        if (this.isBoss){
            this.attackFrequency
        }
        this.attackFrequency = this.isBoss ? this.attackFrequency / 3 : this.attackFrequency;
        this.inflictDamage(this.damageNumber, this.attackFrequency);
    }
    public deadSound() {
        ded.play()
    }
    public die(){
        if (this.randomiseDrop(0))this.drop(new weaponPickup(this, this.carriedWeapon));
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

    }
    public deadSound() {
         if (this.enemy.includes("Troop")) { ded2.play() }
         else if (this.enemy == "ShotGun_Troop") { ded.play() }
         else if (this.enemy == "Imp") { ded.play() }
    }
}

class Player {
    static health: number = 100;
    static dead: boolean = false;
    static weaponCollection: Object = {};
    static weapon: weaponry;
    static slungWeapon: weaponry;
    static damageCheck(damager: RegEnemy, damage) {
        damager.damaging = setTimeout(function () { 
            if (GameInfo.riotShieldDeployed == false) {
                Player.playerHit(damage)
            }
            else Turicochet.play();
        }, 1000);
    }
    static reset(){
        Player.dead = false;
        Player.health = 100;
        Player.weaponCollection = {};
    }

    static collectAmmo(ammount:number, weaponName: string){
        this.weaponCollection[weaponName].ammo += ammount;
        DOMUpdater.updateAmmoWithClick(Player.weapon.ammo)
    }

    static collectWeapon(weapon: weaponry){
        let weaponName = weapon.constructor.name;
        if (!this.weaponCollection[weaponName]){
            this.weaponCollection[weaponName] = weapon;
            this.selectWeapon(weapon);
        }
        else {
            Player.collectAmmo(gunConfig[weaponName].startingAmmo, weaponName)
        }
    }

    static collectHealth(ammount){
        Player.health += ammount;
        DOMUpdater.updateHealthCounter(Player.health);
    }

    static selectWeapon(weapon: weaponry){
        weapon.switchTo()
        Player.weapon = weapon;
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
        if (Player.dead == true){return}
        Player.dead = true;
        this.deadSound();
        fadeOut();
        stopTimer();
        Deuscredits.stop();
        DOMUpdater.updateHealthCounter(0);
        elements.backImg.style.animationFillMode = "forwards";
        clearAllEnemies();
        let div1:HTMLElement = createMessageDiv("levelMsg","YOU DIED");
        slamMessage(div1, elements.finishMsg, 1000);
        setTimeout(() => { openMenu(); }, 2500); 
    }
    public static deadSound() {
        Turokscream.play();
    }
    public static hurtSound() {
        Hlifescream1.play()
    }
}