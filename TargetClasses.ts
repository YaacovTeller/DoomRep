enum enemies {
    SectorPatrol,
    Troop,
    Imp,
    ShotgunTroop,
    ChaingunGuy,
}
enum specialEnemy {
    Boss,
    Extra
}

abstract class Target implements Iundrawable{
    public num: number;
    public enemy: string;
    public health: number;
    public healthUnit: number;
    public DOMImage: HTMLImageElement;
    public DOMdiv: HTMLElement;
    public deadFlag: boolean = false;
    public firing: boolean = false;
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
        this.creatDOMPresenceWithImg();
        this.setImageSrc(enemyPics[this.enemy]);
        this.positionDiv(this.DOMdiv, position, anim);
        this.createHitbox();
    }
    protected creatDOMPresenceWithImg(){
        let div:HTMLElement = document.createElement("div");
        let img:HTMLImageElement = document.createElement("img");
        this.DOMdiv = div;
        this.DOMImage = img;
        this.DOMImage.classList.add("height_100", "undraggable", "noPointerEvents")
        div.appendChild(img);
        elements.targetBackdrop.appendChild(this.DOMdiv);
    }

    protected createHitbox(){
        let hitbox:HTMLElement = document.createElement("div");
        hitbox.onmouseover = () => GameInfo.setAsTarget(this);
        hitbox.onmouseleave = () => GameInfo.unsetTarget();
        hitbox.classList.add('hitbox', 'autoPointerEvents')
        this.DOMdiv.appendChild(hitbox);
        this.applyHitboxArea(hitbox);
        
        let headshotBox:HTMLElement = document.createElement("div");
        headshotBox.onmouseover = () => GameInfo.setHeadTargeting();
        headshotBox.onmouseleave = () => GameInfo.unsetHeadTargeting();
        headshotBox.classList.add("headshotBox");
        hitbox.appendChild(headshotBox);
        this.applyHeadshotBoxArea(headshotBox);
    }

    protected positionDiv(div, position, anim?){
        div.classList.add('undraggable', 'absolute', 'flexJustifyCenter', 'noPointerEvents',"fillModeForwards",)
        div.style.left = position.x +"%";
        div.style.top = position.y +"%";
        div.style.transform = position.scale ? `scale(${position.scale})` : `scale(${position.y/50*position.y/50})` // Attempt auto-size based on position
        this.applyAnimations(anim, div);
    }

    protected applyHitboxArea(hitbox){
        hitbox.style.width = '75%';
        hitbox.style.height = '100%';
        hitbox.style.paddingTop = '10px';
        hitbox.style.marginTop = '5px';
     //   hitbox.style.margin = "0px 10px 100px"
    }
    protected applyHeadshotBoxArea(headshotBox){
        if (headshotBox){
            headshotBox.style.width = '30%';
            headshotBox.style.height = '20%';
        }
    }

    protected applyAnimations(anim, img){
        if (anim){
            let arr = [];
            for (let a of anim){
                arr.push(a.animationString());
            }
            img.style.animation = arr.join(", ");
        }
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
        $(this.DOMdiv).fadeOut(300, function() { $(this).remove(); })
    }
    
    public loseHealth(damage) {
        damage = GameInfo.headTargeting ? damage*2 : damage;
        this.health -= damage;
        this.setImageSrc(enemyPics.hurt[this.enemy]);
        let _this = this;
        if (this.health <= 0) {
            this.establishCauseOfDeath();
        }
        // Calls redraw to reset
        else { setTimeout(()=>_this.redraw(this), 200); }
    }
    protected establishCauseOfDeath(){
        let gib, headshot;
        if (GameInfo.headTargeting){
            headshot = true;
        }
        this.die(gib, headshot)
    }
    protected freezeAllMovement(){
        this.DOMdiv.style.animationPlayState = "paused"; // stop css...
        $(this.DOMdiv).stop(); // ...and jquery movement
    }

    protected selectDeathGif(gib?, headshot?) {
        let pic: string;
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

    protected die(gib?, headshot?){
        headshot ? console.log("headshot!") : null;

        this.deadFlag = true;

        let pic: string = this.selectDeathGif(gib, headshot);
        this.setImageSrc(pic);

        this.freezeAllMovement();
        GameInfo.unsetTarget();
        GameInfo.unsetHeadTargeting();
        
        let hitbox = this.DOMdiv.getElementsByClassName('hitbox')[0] as HTMLElement;
        this.DOMdiv.removeChild(hitbox)  // messy, get back the hitbox to prevent multiple deaths...

        if (this.randomiseDrop(85)) {
            this.drop(new healthPickup(this, 20));
        }
        if(!GameInfo.kidMode){
            this.deadSound();
        }
    }
    abstract deadSound()
}

abstract class RegEnemy extends Target {
    protected damageNumber: number;
    public attackFrequency: number;
    public moveRoller;
    public noRandomMovement: boolean = false;
    public baseHealth: number;
    public attackRoller;
    public damaging;
    public specialStatus: specialEnemy;
    public mover = new MovementGenerator;

    constructor(enemy, position, health, anim, special) {
        super(enemy, position, health, anim)
        this.specialStatus = special;
    }

    abstract attackSound()
    abstract activeSound()

    public loseHealth(damage) {
        super.loseHealth(damage)
        if (this.specialStatus == specialEnemy.Boss) {
            LevelHandler.reduceBar(this.health);
        }
    }
    protected extraDrops() {
        this.drop(new healthPickup(this, 50));
        if (this.randomiseDrop(50)) {
            this.drop(new weaponPickup(this, GameInfo.allGuns.DualNeutron));
        }
        else {
            this.drop(new weaponPickup(this, GameInfo.allGuns.Pipebomb));
        }
    }

    public die(gib?, headshot?) {
        super.die(gib, headshot);
        clearInterval(this.attackRoller);
        clearInterval(this.damaging);
        clearInterval(this.moveRoller);
        if (this.specialStatus == specialEnemy.Extra){
            GameInfo.deadExtraCount++;
            this.extraDrops();
        } 
        else{
            GameInfo.deadCount++
            LevelHandler.sceneCheck();
        }
        DOMUpdater.updateKillCounter(GameInfo.getTotalKills());
    }
    private hitRoll(damage, hitLimit) {
        if (Player.dead == false) {
            var die = RandomNumberGen.randomNumBetween(1,6)
            if (die >= hitLimit) {
                this.firing = true;
                $(this.DOMdiv).stop();
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
        let width = this.DOMdiv.getBoundingClientRect().width;
        let height = this.DOMdiv.getBoundingClientRect().height;
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
        let lateralDestination:number = this.mover.lateralDestination(this.DOMdiv);
        let distance:number = this.mover.distance(this.DOMdiv, lateralDestination);
        let direction:string = this.mover.direction(this.DOMdiv, lateralDestination);
        let speed:number = this.mover.speed(distance);
        this.setImageSrc(enemyPics[direction][this.enemy]);
        let _this = this;
        this.mover.moveLateral(lateralDestination, speed, this.DOMdiv,()=>_this.redraw(_this) );
    //    this.mover.moveForward(this.mover.calcDimentions(this.DOMdiv), speed, this.DOMdiv);
    }
    public test_precalculatedLateralMove(lateralDestination, speed){
        let direction:string = this.mover.direction(this.DOMdiv, lateralDestination);
        this.setImageSrc(enemyPics[direction][this.enemy]);
        let _this = this;
        this.mover.moveLateral(lateralDestination, speed, this.DOMdiv, ()=>_this.redraw(_this) );
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
    public baseHealth = 40;
    public damageNumber = 10;
    public attackFrequency = 2000;
  //  public carriedWeapon = GameInfo.allGuns.Pistol;
  public carriedWeapon = GameInfo.allGuns.DukeMgun;

    constructor(position, health?, anim?, special?) {
        super(enemies[1], position, health, anim, special)
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
    public die(gib?, headshot?){
        if (!this.specialStatus && this.randomiseDrop(40)) {
            this.drop(new weaponPickup(this, this.carriedWeapon));
        }
        super.die(gib, headshot);
    }
    protected applyHitboxArea(hitbox){
        hitbox.style.width = '60%';
        hitbox.style.height = '100%';
        hitbox.style.marginLeft = '-30px';
        
     //   hitbox.style.margin = "0px 10px 100px"
    }
}

class ShotgunTroop extends RegEnemy {
    public baseHealth = 40;
    public damageNumber = 20;
    public attackFrequency = 2000;
    public carriedWeapon = GameInfo.allGuns.Shotgun;

    constructor(position, health?, anim?, special?) {
        super(enemies[3], position, health, anim, special)
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
    public die(gib?, headshot?){
        if (this.randomiseDrop(40)) this.drop(new weaponPickup(this, this.carriedWeapon));
        super.die(gib, headshot);
    }
}

class ChaingunGuy extends RegEnemy {
    public baseHealth = 130;
    public damageNumber = 30;
    public attackFrequency = 2000;
    public carriedWeapon = GameInfo.allGuns.Minigun;

    constructor(position, health?, anim?, special?) {
        super(enemies[4], position, health, anim, special)
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
    public die(gib?, headshot?){
        this.drop(new weaponPickup(this, this.carriedWeapon));
        this.drop(new healthPickup(this, 30));
        super.die(gib, headshot);
    }
    protected applyHitboxArea(hitbox){
        hitbox.style.width = '55%';
        hitbox.style.height = '95%';
     //   hitbox.style.margin = "0px 10px 100px"
    }
}

class Imp extends RegEnemy {
    public baseHealth = 40;
    public damageNumber = 15;
    public attackFrequency = 2000;
    constructor(position, health?, anim?, special?) {
        super(enemies[2], position, health, anim, special)
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
    public baseHealth = 30;
    public damageNumber = 10;
    public attackFrequency = 2000;
    public carriedWeapon = GameInfo.allGuns.Pistol;
    constructor(position, health?, anim?, special?) {
        super(enemies[0], position, health, anim, special)
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
    public die(gib?, headshot?){
        this.drop(new weaponPickup(this, this.carriedWeapon));
        super.die(gib, headshot);
    }
}

class AreaAffect {
    public blastRadius;
    public gibRadius;
    public constructor(blastRadius, gibRadius){
        this.blastRadius = blastRadius;
        this.gibRadius = gibRadius;
    }
    public killInBlastRadius(epicenter: Position) {
        this.blastArray(epicenter, GameInfo.enemyArray);
        this.blastArray(epicenter, GameInfo.itemArray);
    }
    protected blastArray(epicenter, array){
        for (let enemy of array){
            if (!enemy || enemy.deadFlag == true) continue
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

    protected checkDistance(epicenter: Position, rect, distance){
        let left = rect.left;
        let right = rect.right;
        let top = rect.top;
        let bottom = rect.bottom;
        let hit = (epicenter.x >= left - distance && epicenter.x <= right + distance) &&
                  (epicenter.y >= top - distance && epicenter.y <= bottom + distance)
        return hit;
    }
}

class Item extends Target {
    private gibRadius:number = 250;
    private blastRadius:number = 400;
    private areaAffect: AreaAffect = new AreaAffect(this.blastRadius, this.gibRadius);
    constructor(item, position: Position, health?, anim?) {
        super(item, position, health, anim)
    }
    public die() {
       // killAllEnemies(true);
        super.die();
        this.barrelExplode()
    }
    private centerPosition(){
        let rect = this.DOMdiv.getBoundingClientRect();
        let left = rect.left;
        let width = rect.width;
        let x = left + (width / 2);

        let top = rect.top;
        let height = rect.height;
        let y = top + (height / 2)
        return new Position(x, y);
    }

    protected barrelExplode() {
        let barrelCenter = this.centerPosition();
        this.areaAffect.killInBlastRadius(barrelCenter);
    }
    protected checkDistance(left1,left2){
        return Math.abs(left1 - left2)
    }
    protected applyHitboxArea(hitbox){
        hitbox.style.width = '38%';
        hitbox.style.height = '60%';
        hitbox.style.margin = "47px -7px 0px"
        hitbox.style.borderRadius = '10px';
    }

    public deadSound(){
        explosion.play()
    }
}