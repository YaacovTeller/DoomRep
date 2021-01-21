//TheQuickAndTheDead
// parent class, handles drawing and damaging.
abstract class Target {
    public num: number;
    public enemy: string;
    public health: number;
    public healthUnit: number;
    public DOMImage: HTMLImageElement;
    public deadFlag: boolean = false;
    public firing: boolean = false;
    public isBoss: boolean;
    protected carriedWeapon: weaponry;
    constructor(enemy, position: Position, health:number, anim: Array<AnimationInfo>) {
        if (health) {this.health = health}
        this.enemy = enemy;
        this.draw(position, anim);
    }
    protected setImageSrc(img){
        this.DOMImage.src = img + "?a=" + Math.random();
    }
    
    protected draw(position, anim?){
        var img:HTMLImageElement = document.createElement("img");
        this.DOMImage = img;
        img.classList.add("target", "undraggable","fillModeForwards")
        img.onmouseover = () => this.setAsTarget();
        img.onmouseleave = () => this.unsetTarget();
        this.setImageSrc(enemyPics[this.enemy]);
       // img.style.borderRadius = "55px" // reduce the hitbox?
        img.style.left = position.x +"%";
        img.style.top = position.y +"%";
        img.style.transform = position.scale ? `scale(${position.scale})` : `scale(${position.y/50*position.y/50})` // Attempt auto-size based on position
        if (anim){
            let arr = [];
            for (let a of anim){
                arr.push(a.animationString());
            }
            img.style.animation = arr.join(", ");
        }
        elements.targetBackdrop.appendChild(img);
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
            _this.setImageSrc(enemyPics[_this.enemy]);
        }
    }
    public undraw(){
        $(this.DOMImage).fadeOut(300, function() { $(this).remove(); })
    }
    
    public loseHealth(damage) {
        this.health -= damage;
        this.setImageSrc(enemyPics.hurt[this.enemy]);
        let _this = this;
        if (this.isBoss) {
            LevelHandler.reduceBar(this.health);
        }
        if (this.health <= 0) { this.die() }
        // Calls redraw to reset
        else { setTimeout(()=>_this.redraw(_this), 200); }
    }

    protected die(gib?){
        let pic:string;
        if(GameInfo.kidMode){
            pic = enemyPics.dead_alt[this.enemy];
        }
        else if (gib) {
            pic = enemyPics.explode[this.enemy];
        }
        else {
            pic = enemyPics.dead[this.enemy];
            if (this instanceof Imp && RandomNumberGen.randomNumBetween(0,3) == 3){ // FIX, alt deaths need a proper system
                pic = enemyPics.dead[this.enemy + '_alt'];
            }
        } 
        this.setImageSrc(pic);
        this.deadFlag = true;
        this.DOMImage.style.animationPlayState = "paused"; // stop css...
        $(this.DOMImage).stop(); // ...and jquery movement
        
        this.DOMImage.style.pointerEvents = "none";
        if (this.randomiseDrop(85))this.drop(new healthPickup(this, 20));
        this.deadSound();
    }
    abstract deadSound()

    public setAsTarget() {
        GameInfo.hitTarget = this;
        GameInfo.targeting = true;
    }
    public unsetTarget() {
        GameInfo.hitTarget = null;
        GameInfo.targeting = false;
    }
}

abstract class RegEnemy extends Target {
    protected damageNumber: number;
    public attackFrequency: number;
    public moveRoller;
    public noRandomMovement: boolean = false;
    public baseHealth: number;
    public attackRoller;
    public damaging;
    public mover = new MovementGenerator;

    constructor(enemy, position, health, anim) {
        super(enemy, position, health, anim)
    }

    abstract attackSound()
    abstract activeSound()
    // public draw(position, anim) {
    //     super.draw(position, anim);
    // }
    public die(gib?) {
        super.die(gib);
        clearInterval(this.attackRoller);
        clearInterval(this.damaging);
        clearInterval(this.moveRoller);
        if (!(this instanceof Extra)){
            GameInfo.deadCount++
            LevelHandler.sceneCheck();
        } 
        DOMUpdater.updateKillCounter(GameInfo.deadCount + GameInfo.deadExtraCount);
    }
    private hitRoll(damage, hitLimit) {
        if (Player.dead == false) {
            var die = RandomNumberGen.randomNumBetween(1,6)
            if (die >= hitLimit) {
                this.firing = true;
                $(this.DOMImage).stop();
                this.setImageSrc(enemyPics.firing[this.enemy])
                let _this = this;
                setTimeout(()=>{
                    this.attackSound()
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
    public moveForward() {
        let width = this.DOMImage.getBoundingClientRect().width;
        let height = this.DOMImage.getBoundingClientRect().height;
        let pic = this.DOMImage;
        let time = 2000;
        this.mover.moveForward({width: width*2,height: height*2}, time, pic)
        let _this = this;
        if (enemyPics.forward[this.enemy]){
            setTimeout(() => {
                pic.src = enemyPics.forward[_this.enemy];
            }, time);
        }
    }

    private moveRoll(){
        var die = (Math.floor(Math.random() * 7))
        if (die > 3 && !this.firing) {
            this.calculateMove();
        }
    }

    private calculateMove(){
        let lateralDestination:number = this.mover.lateralDestination(this.DOMImage);
        let distance:number = this.mover.distance(this.DOMImage, lateralDestination);
        let direction:string = this.mover.direction(this.DOMImage, lateralDestination);
        let speed:number = this.mover.speed(distance);
        this.setImageSrc(enemyPics[direction][this.enemy]);
        let _this = this;
        this.mover.moveLateral(lateralDestination, speed, this.DOMImage,()=>_this.redraw(_this) );
    //    this.mover.moveForward(this.mover.calcDimentions(this.DOMImage), speed, this.DOMImage);
    }
    public beginInflictDamage(hitLimit) {
        var _this = this;
        let attackFrequency = this.attackFrequency+ RandomNumberGen.randomNumBetween(-500,500);
        this.attackRoller = setInterval(function(){_this.hitRoll(_this.damageNumber, hitLimit)}, attackFrequency);
    }

    public beginMoveLateral(moveFrequency){
        if (this.noRandomMovement){ return }
        var _this = this;
        moveFrequency += RandomNumberGen.randomNumBetween(-500,500);
        this.moveRoller = setInterval(function(){_this.moveRoll()}, moveFrequency);
    }
}

class Troop extends RegEnemy {
    public baseHealth = 30;
    public damageNumber = 10;
    public attackFrequency = 2000;
    public carriedWeapon = GameInfo.allGuns.Pistol;

    constructor(position, health?, anim?) {
        super("Troop", position, health, anim)
    }
    public deadSound() {
        RandomSoundGen.playRandomSound(troopDeaths);
    }
    public attackSound(){
        Pshot.play()
    }
    public activeSound(){
        RandomSoundGen.playRandomSound(troopShouts);
    }
    public die(gib?){
        if (this.randomiseDrop(40))this.drop(new weaponPickup(this, GameInfo.allGuns.DukeMgun));//this.carriedWeapon
        super.die(gib);
    }
}

class ShotGun_Troop extends RegEnemy {
    public baseHealth = 30;
    public damageNumber = 20;
    public attackFrequency = 2000;
    public carriedWeapon = GameInfo.allGuns.Shotgun;

    constructor(position, health?, anim?) {
        super("ShotGun_Troop", position, health, anim)
    }
    public deadSound() {
        RandomSoundGen.playRandomSound(troopDeaths)
    }
    public attackSound(){
        SGshot.play()
    }
    public activeSound(){
        RandomSoundGen.playRandomSound(troopShouts);
    }
    public die(gib?){
        if (this.randomiseDrop(40))this.drop(new weaponPickup(this, this.carriedWeapon));
        super.die(gib);
        
    }
}
class ChainGGuy extends RegEnemy {
    public baseHealth = 120;
    public damageNumber = 30;
    public attackFrequency = 2000;
    public carriedWeapon = GameInfo.allGuns.Minigun;

    constructor(position, health?, anim?, isBoss?) {
        super("ChainGuy", position, health, anim)
        this.isBoss = isBoss;
      //  this.attackFrequency = this.isBoss ? this.attackFrequency / 3 : this.attackFrequency;
    }
    public deadSound() {
        RandomSoundGen.playRandomSound(troopDeaths)
    }
    public attackSound(){
        Avpminigun2.play()
    }
    public activeSound(){
        RandomSoundGen.playRandomSound(troopShouts);
    }
    public die(gib?){
        this.drop(new weaponPickup(this, this.carriedWeapon));
        this.drop(new healthPickup(this, 50));
        super.die(gib);
    }
}

class Imp extends RegEnemy {
    public baseHealth = 30;
    public damageNumber = 15;
    public attackFrequency = 2000;
    constructor(position, health?, anim?) {
        super("Imp", position, health, anim)
    }
    public deadSound() {
        RandomSoundGen.playRandomSound(ImpDeaths)
    }
    public attackSound(){
        Imp_Attack.play()
    }
    public activeSound(){
        RandomSoundGen.playRandomSound(ImpShouts);
    }
}

class SectorPatrol extends RegEnemy {
    public baseHealth = 20;
    public damageNumber = 10;
    public attackFrequency = 2000;
    public carriedWeapon = GameInfo.allGuns.Pistol;
    constructor(position, health?, anim?, isBoss?) {
        super("SectorPatrol", position, health, anim)
        this.isBoss = isBoss;
    }
    public deadSound() {
        RandomSoundGen.playRandomSound(patrolDeaths);
    }
    public attackSound(){
        Pshot.play()
    }
    public activeSound(){
        RandomSoundGen.playRandomSound(patrolShouts);
    }
    public die(gib?){
        this.drop(new weaponPickup(this, this.carriedWeapon));
        super.die(gib);
    }
}

class Extra extends RegEnemy { // FIX _ REMOVE !! 
    public baseHealth = 15;
    constructor(enemy, position, health?, anim?) {
        super(enemy, position, health, anim)
    }
    public draw(position, anim) {
        super.draw(position, anim)
        this.DOMImage.classList.add('fillModeForwards', 'extraTarget')
   }
    public die(gib?) {
        this.drop(new healthPickup(this, 50));
        GameInfo.deadExtraCount++
        super.die(gib);

    }
    public deadSound() {
         if (this.enemy.includes("Troop")) { RandomSoundGen.playRandomSound(troopDeaths) }
         else if (this.enemy == "ShotGun_Troop") { RandomSoundGen.playRandomSound(troopDeaths) }
         else if (this.enemy == "Imp") { RandomSoundGen.playRandomSound(ImpDeaths) }
    }
    public attackSound(){};
    public activeSound(){};
    public beginInflictDamage(){};
    public beginMoveLateral(){};
}

class Item extends Target {
    private blastRadius:number = 500;
    constructor(item, position: Position, health?, anim?) {
        super(item, position, health, anim)
    }
    public die() {
       // killAllEnemies(true);
        this.killInBlastRadius(true)
        super.die();
    }
    protected killInBlastRadius(gib?:boolean) {
        let barrelLeft = this.DOMImage.getBoundingClientRect().left;
        for (let enemy of GameInfo.enemyArray){
            if (!enemy || enemy.deadFlag == true) continue
            let enemyLeft = enemy.DOMImage.getBoundingClientRect().left
            if (this.checkDistance(barrelLeft, enemyLeft) < this.blastRadius) {
                enemy.die(gib);
            }
        }
    }
    protected checkDistance(left1,left2){
        return Math.abs(left1 - left2)
    }

    public deadSound(){
        explosion.play()
    }
}