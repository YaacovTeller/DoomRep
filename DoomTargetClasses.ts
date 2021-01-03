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
    constructor(enemy, health, position: Position, anim: Array<AnimationInfo>) {
        this.health = health;
        this.enemy = enemy;
        this.draw(position, anim);
    }
    
    protected draw(position, anim?){
        var img:HTMLImageElement = document.createElement("img");
        img.classList.add("target", "undraggable","fillModeForwards")
        img.onmouseover = () => this.setAsTarget();
        img.onmouseleave = () => this.unsetTarget();
        img.setAttribute('src', enemyPics[this.enemy]);
        img.style.borderRadius = "55px" // reduce the hitbox?
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
            LevelHandler.reduceBar(this.health);
        }
        if (this.health <= 0) { this.die() }
        // Calls redraw to reset
        else { setTimeout(()=>_this.redraw(_this), 200); }
    }

    protected die(){
        if(GameInfo.kidMode){
             rescaleForPotPlants(this.DOMImage) 
             this.DOMImage.setAttribute("src", enemyPics.dead_alt[this.enemy] + "?a=" + Math.random());
        }
        else {
            this.DOMImage.setAttribute("src", enemyPics.dead[this.enemy] + "?a=" + Math.random());
        }
        this.deadFlag = true;
        this.DOMImage.style.animationPlayState = "paused"; // stop css...
        $(this.DOMImage).stop(); // ...and jquery movement
        
        this.DOMImage.style.pointerEvents = "none";
        if (this.randomiseDrop(85))this.drop(new healthPickup(this, 20));
        this.deadSound();
    }

    abstract deadSound()

    // The machine gun damage function
    public setAsTarget() {
        GameInfo.hitTarget = this;
        GameInfo.targeting = true;
    }
    public unsetTarget() {
        GameInfo.hitTarget = null;
        GameInfo.targeting = false;
    }
}

function rescaleForPotPlants(image){ // USED IN KID FRIENDLY MODE, see PictureObjects for alternate death-pics
    let scale = image.style.transform;
    let num = parseFloat(scale.replace("scale(",""));
    image.style.transform = `scale(${num/3})`;
    image.style.left = image.getBoundingClientRect().left - 200 + "px";
}

abstract class RegEnemy extends Target {
    protected damageNumber: number;
    public attackFrequency: number;
    public moveRoller;
    public noRandomMovement: boolean = false;
    public attackRoller;
    public damaging;
    public isBoss: boolean;
    public mover = new MovementGenerator;

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
        clearInterval(this.moveRoller);
        if (!(this instanceof Extra)){
            GameInfo.deadCount++
            LevelHandler.sceneCheck();
        } 
        DOMUpdater.updateKillCounter(GameInfo.deadCount + GameInfo.deadExtraCount);
    }
    private hitRoll(damage) {
        if (Player.dead == false) {
            var die = (Math.floor(Math.random() * 7))
            if (die == 6) {
                this.firing = true;
                $(this.DOMImage).stop();
                this.DOMImage.src = enemyPics.firing[this.enemy];
                let _this = this;
                setTimeout(()=>{
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
                        RandomSoundGen.randomSound([Turicochet, BloodRicochet_1, BloodRicochet_2]);
                    }, 1000);
                }
            }
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
        this.DOMImage.src = enemyPics[direction][this.enemy]
        let _this = this;
        this.mover.moveLateral(lateralDestination, speed, this.DOMImage,()=>_this.redraw(_this) );
    //    this.mover.moveForward(this.mover.calcDimentions(this.DOMImage), speed, this.DOMImage);
    }
    protected inflictDamage(damage, attackFrequency) {
        if (!damage) return;
        var _this = this;
        attackFrequency += RandomNumberGen.randomNumBetween(-500,500);
        this.attackRoller = setInterval(function(){_this.hitRoll(damage)}, attackFrequency);
    }

    public beginInflictDamage(){
        this.inflictDamage(this.damageNumber, this.attackFrequency);
    }
    public beginMoveLateral(moveFrequency){
        if (this.noRandomMovement){ return }
        var _this = this;
        moveFrequency += RandomNumberGen.randomNumBetween(-500,500);
        this.moveRoller = setInterval(function(){_this.moveRoll()}, moveFrequency);
    }
}

class MovementGenerator {
    private leftLimit(img){
        return window.outerWidth - parseInt($(img).css('width'));
    }
    private leftPosition(img){
        return parseInt($(img).css('left'));
    }

    public distance(img, destination){
        let leftNum = this.leftPosition(img);
        return Math.abs(destination - leftNum)
    }

    public direction(img, destination){
        let leftNum = this.leftPosition(img);
        let direction = leftNum < destination ? 'right': 'left';
        return direction;
    }

    public calcDimentions(img: HTMLImageElement){
        let scale = RandomNumberGen.randomNumBetween(0.5, 2.5)
        //    let rect = img.getBoundingClientRect();
        //    let currentScale = width / img.clientWidth;
        let width = img.naturalWidth;
        let height = img.naturalHeight;
        let newWidth =  width * scale;
        let newHeight =  height * scale;
        return {width: newWidth, height: newHeight};
    }

    public lateralDestination(img){
        let leftLimit = this.leftLimit(img);
        let destination = RandomNumberGen.randomNumBetween(0, leftLimit);
        return destination;
    }

    public speed(distance){
        let speed = distance * 2 //RandomNumberGen.randomNumBetween(quickest, slowest);
        return speed;
    }

    public moveForward(dimentions, speed, image){

        $(image).animate({width: dimentions.width+'px'},{ queue: false, duration: speed });
        $(image).animate({height: dimentions.height+'px'},{ queue: false, duration: speed });
    }

    public moveLateral(distance, speed, image, callback){
        $(image).animate({left: distance+'px'},{ duration: speed, complete: callback});
    }
}

class Troop extends RegEnemy {
    public damageNumber = 10;
    public attackFrequency = 2000;
    public carriedWeapon = GameInfo.allGuns.Pistol;

    constructor(health, position, anim?) {
        super("Troop", health, position, anim)
    }
    public deadSound() {
        ded2.play()
    }
    public die(){
        if (this.randomiseDrop(40))this.drop(new weaponPickup(this, GameInfo.allGuns.DukeMgun));//this.carriedWeapon
        super.die();
    }
}

class ShotGun_Troop extends RegEnemy {
    public damageNumber = 20;
    public attackFrequency = 2000;
    public carriedWeapon = GameInfo.allGuns.Shotgun;

    constructor(health, position, anim?) {
        super("ShotGun_Troop", health, position, anim)
    }
    public deadSound() {
        ded.play()
    }
    public die(){
        if (this.randomiseDrop(40))this.drop(new weaponPickup(this, this.carriedWeapon));
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
    }
    public deadSound() {
        ded.play()
    }
    public die(){
        this.drop(new weaponPickup(this, this.carriedWeapon));
        this.drop(new healthPickup(this, 50));
        super.die();
    }
}

class Imp extends RegEnemy {
    public damageNumber = 15;
    public attackFrequency = 2000;
    constructor(health, position, anim?) {
        super("Imp", health, position, anim)
    }
    public deadSound() {
        ded2.play()
    }
}

class SectorPatrol extends RegEnemy {
    public damageNumber = 10;
    public attackFrequency = 2000;
    public carriedWeapon = GameInfo.allGuns.Pistol;
    constructor(health, position, anim?) {
        super("SectorPatrol", health, position, anim)
    }
    public deadSound() {
        humanDead.play()
    }
    public die(){
        this.drop(new weaponPickup(this, this.carriedWeapon));
        super.die();
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
        this.drop(new healthPickup(this, 50));
        GameInfo.deadExtraCount++
        super.die();

    }
    public deadSound() {
         if (this.enemy.includes("Troop")) { ded2.play() }
         else if (this.enemy == "ShotGun_Troop") { ded.play() }
         else if (this.enemy == "Imp") { ded.play() }
    }
    public beginInflictDamage(){}
    public beginMoveLateral(){}
}

