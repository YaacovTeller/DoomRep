var levelFuncArray = [
    //  [level_2_6]
   // [level_1_3],
    [level_1_1, level_1_2, level_1_3, level_1_4],
    [level_2_1, level_2_2, level_2_3, level_2_4, level_2_5, level_2_6],
    [level_3_1, level_3_2, level_3_3, level_3_4, level_3_5, level_3_6],
];

class Level {
    public sceneArray: Array<Scene> = new Array();
    public sceneFuncs: Array<Function> = new Array();
    public startingWeapons: Array<weaponry> = new Array();
    constructor(sceneFuncs, startingWeapons?: Array<weaponry>) {
        this.sceneFuncs = sceneFuncs;
        this.startingWeapons = startingWeapons;
    }
    public prepLevel(){

        startTimer();
        for (let wep of this.startingWeapons){
            Player.collectWeapon(wep);
        }
        DOMUpdater.gunTobaseOfScreen(Player.weapon.scrnMargin);
       // Player.collectWeapon(new ChainSaw);
    }
    public moreScenes(){
        return this.sceneFuncs.length != this.sceneArray.length; // Allow for 'sectionFin' scene?
    }
    public playNextScene(){
        let func = this.sceneFuncs[this.sceneArray.length] || this.sceneFuncs[0];
        func();
    }
    public addScene(scene){
        this.sceneArray.push(scene)
    }
}

class Scene {
    public number;
    public background;
    public attributes;
    public enemyFunc;
    constructor(background, attributes, enemyFunc, fadeOutDelay?, fadeInDelay?, enemiesDelay?, noFadeOut?){
        this.background = background;
        this.attributes = attributes;
        this.enemyFunc = enemyFunc;
        fadeOutDelay = fadeOutDelay != null ? fadeOutDelay : 500;
        fadeInDelay = fadeInDelay != null ? fadeInDelay : 1700;
        enemiesDelay = enemiesDelay != null ? enemiesDelay : 3000;
        this.genericScene(background, attributes, enemyFunc, fadeOutDelay, fadeInDelay, enemiesDelay, noFadeOut)
    }
    private genericScene(background, attributes, enemyFunc, fadeOutDelay, fadeInDelay, enemiesDelay, noFadeOut?){
        if(!noFadeOut){ LevelHandler.fadeOutClear(fadeOutDelay);}
        LevelHandler.fadeInBackground(fadeInDelay, background, attributes);
        LevelHandler.generateEnemiesDelay(enemiesDelay, enemyFunc);
    }
}

class SceneGenerator{
    private static drawNewEnemiesGeneric(){
        let numOfEnemies = RandomNumberGen.randomNumBetween(4, 10);
        let enemyNumber = RandomNumberGen.randomNumBetween(0, 3);
        let mixedEnemies = RandomNumberGen.randomNumBetween(0, 1);
        let insertBarrel = RandomNumberGen.randomNumBetween(0, 2);
        GameInfo.enemyArray = [];
        for (let i=0; i<numOfEnemies; i++){
            this.enemySelector(enemyNumber, mixedEnemies);
        }
        if (insertBarrel == 2){
            this.itemSelector("barrel");
        }
        LevelHandler.startAllRolls(GameInfo.moverollFrequency, hitLimit.slow); // HITLIMIT , MOVE!
    }
    private static itemSelector(item){
        new Item (item, this.positionSelector(), 40)
    }
    private static positionSelector(){
        let x: number = RandomNumberGen.randomNumBetween(5, 85);
        let y: number = RandomNumberGen.randomNumBetween(35, 65);
        return new Position(x,y)
    }

    private static enemySelector(enemyNumber, mixedEnemies){
        enemyNumber = mixedEnemies ? RandomNumberGen.randomNumBetween(0, 4) : enemyNumber;
        if (GameInfo.currentLevel.sceneArray.length<2 && enemyNumber == 4){ // hack to prevent chainguy rush
            enemyNumber--;
        }
        let ישעיה_שמחה :string;
        let enemy;
        let position = this.positionSelector();  
        if (enemyNumber == 0){
            enemy = new SectorPatrol(position);
        }
        if (enemyNumber == 1){
            enemy = new Troop(position);
        }
        if (enemyNumber == 2){
            enemy = new Imp(position);
        }
        if (enemyNumber == 3){
            enemy = new ShotGun_Troop(position);
        }
        if (enemyNumber == 4){
            enemy = new ChainGGuy(position);
        }
        GameInfo.enemyArray.push(enemy)
    }

    private static randomBackground() {
        return pics.background['doom' + RandomNumberGen.randomNumBetween(1, 6)]
    }
    public static sceneLoop() {
        let scene = new Scene(SceneGenerator.randomBackground(),"width: 100%", ()=>SceneGenerator.drawNewEnemiesGeneric())
        GameInfo.currentLevel.addScene(scene);
        elements.progressCounter.innerText = "" + (GameInfo.currentLevel.sceneArray.length)
    }
}

class LevelHandler {
    public static beginGame() {
        this.nextLevel();
    }

    public static sceneCheck() {
        if (this.checkAllDead()) {
            if (GameInfo.gameMode == 1){
                GameInfo.currentLevel.playNextScene();
            }
            else{
                if (GameInfo.currentLevel.moreScenes()){
                    GameInfo.currentLevel.playNextScene();
                }
                else {
                    this.sectionFinish();
                }
            } 
        }
    }

    public static nextLevel() {

        if (GameInfo.music == true) { Deuscredits.play(); }
        clearScreenMessages();
        let wepArray = GameInfo.levelArray.length == 0 ? [GameInfo.allGuns.chainsaw] : [] // starting weapon ?

        if (GameInfo.gameMode == 0){
            if (GameInfo.levelArray.length < levelFuncArray.length){
                GameInfo.addLevel(new Level(levelFuncArray[GameInfo.levelArray.length], wepArray))
            }
            else {
                let div1: HTMLElement = createMessageDiv("sceneMsg", "A WINNER IS YOU");
                elements.finishMsg.onclick = null;
                slamMessage(div1, elements.finishMsg, 1000);
                setTimeout(() => {
                    openMenu();
                }, 4000);
                return;
            }
        }
        else if (GameInfo.gameMode == 1){
            GameInfo.addLevel(new Level([SceneGenerator.sceneLoop], [GameInfo.allGuns.chainsaw, GameInfo.allGuns.Pistol]));
        }

        GameInfo.currentLevel.prepLevel();
        this.sceneCheck();
    }

    private static checkAllDead() {
        for (let enemy of GameInfo.enemyArray) {
            if (enemy.deadFlag == false && !(enemy instanceof Extra))
                return false;
        }
        GameInfo.enemiesCleared = true;
        return true;
    }

    private static sectionFinish(){
        LevelHandler.reduceBar(0);
        stopTimer();
        GameInfo.hitTarget = null // FIX?
        GameInfo.gameBegun = false;
        Deuscredits.stop();
        genericFinishMessage()
        setTimeout(() => {
            LevelHandler.fadeOutClear(0);
            elements.finishMsg.onclick = ()=>{
                LevelHandler.nextLevel(); // NEXT LEVEL, FIX?
                elements.finishMsg.onclick = null;
            } 
        }, 6000);
    }

    public static fadeOutClear(time) {
        setTimeout(() => {
            fadeOut();
            DOMUpdater.timedClearAllImages();
        }, time);
    }
    public static fadeInBackground(time, background, attributes) {
        setTimeout(() => {
            elements.backImg.setAttribute("src", background);
            if (attributes) {
                elements.backImg.setAttribute("style", attributes);
            }
            fadeIn();
        }, time);
    }
    public static generateEnemiesDelay(time, enemyFunc) {
        setTimeout(() => {
            enemyFunc();
        }, time);
    }

    public static reduceBar(currentHealth) {
        let health = (currentHealth / GameInfo.bossTotalHealth) * 100;
        $(elements.Bar).animate({ width: health + "%" }, 120);
    }

    public static startAllRolls(frequency, hitLimit) {
        for (let enemy of GameInfo.enemyArray) {
            enemy.beginInflictDamage(hitLimit);
            enemy.beginMoveLateral(frequency);

            if (RandomNumberGen.randomNumBetween(0,1) == 1){
                enemy.activeSound();
            }

            enemy.health = enemy.health ? enemy.health : enemy.baseHealth;
        }
    }
    // public static startAllAttackRolls(hitLimit) {
    //     for (let enemy of GameInfo.enemyArray) {
    //         enemy.beginInflictDamage(hitLimit);
    //     }
    // }
    // public static startAllMovementRolls(frequency) {
    //     for (let enemy of GameInfo.enemyArray) {
    //         enemy.beginMoveLateral(frequency);
    //     }
    // }
    // public static startSelectMovementRolls(frequency, exceptions: Array<number>) {
    //     for (let i in GameInfo.enemyArray) {
    //         if (exceptions.includes(parseInt(i))) { continue; }
    //         GameInfo.enemyArray[i].beginMoveLateral(frequency);
    //     }
    // }
    // public static startSelectAttackRolls(exceptions: Array<number>, hitLimit) {
    //     for (let i in GameInfo.enemyArray) {
    //         if (exceptions.includes(parseInt(i))) { continue; }
    //         GameInfo.enemyArray[i].beginInflictDamage(hitLimit);
    //     }
    // }
}
