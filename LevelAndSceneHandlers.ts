var levelFuncArray = [
    [preLevel_scene1, preLevel_scene2, preLevel_scene3],
    [scene1, scene2, scene3, scene4, scene5, finalLev]
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
        let barrel = RandomNumberGen.randomNumBetween(0, 2);
        GameInfo.enemyArray = [];
        for (let i=0; i<numOfEnemies; i++){
            this.enemySelector(enemyNumber, mixedEnemies);
        }
        if (barrel == 2){
            this.itemSelector("barrel")
        }
        LevelHandler.startAllRolls(GameInfo.moverollFrequency);
    }
    private static itemSelector(item){
        new Item (item, 40, this.positionSelector())
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
        let enemy;
        let health: number;
        let position = this.positionSelector();
        if (enemyNumber == 0){
            health = 15;
            enemy = new SectorPatrol(health, position);
        }
        if (enemyNumber == 1){
            health = 20;
            enemy = new Troop(health, position);
        }
        if (enemyNumber == 2){
            health = 30;
            enemy = new Imp(health, position);
        }
        if (enemyNumber == 3){
            health = 30;
            enemy = new ShotGun_Troop(health, position);
        }
        if (enemyNumber == 4){
            health = 120;
            enemy = new ChainGGuy(health, position);
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
        if (GameInfo.music == true) { Deuscredits.play(); }
    }

    public static sceneCheck() {
        if (this.checkAllDead()) {
            if (GameInfo.gameMode == 1){
                GameInfo.currentLevel.playNextScene();
            }
            else{
                if (GameInfo.currentLevel.moreScenes()){
                    GameInfo.currentLevel.playNextScene(); // or default
                }
                else {
                    this.sectionFinish();
                }
            } 
        }
    }

    public static nextLevel() {
        clearScreenMessages();
        let wepArray = GameInfo.levelArray.length == 0 ? [GameInfo.allGuns.chainsaw] : [] // starting weapon ?
        GameInfo.gameMode == 0 ? 
            GameInfo.addLevel(new Level(levelFuncArray[GameInfo.levelArray.length], wepArray)) : 
            GameInfo.addLevel(new Level([SceneGenerator.sceneLoop], [GameInfo.allGuns.chainsaw, GameInfo.allGuns.Pistol])); // Add next level ?
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
                delete elements.finishMsg.onclick;
            } 
        }, 4000);
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

    public static startAllRolls(frequency) {
        for (let enemy of GameInfo.enemyArray) {
            enemy.beginInflictDamage();
            enemy.beginMoveLateral(frequency);
        }
    }
    public static startAllMovementRolls() {
        for (let enemy of GameInfo.enemyArray) {
            enemy.beginInflictDamage();
        }
    }
    public static startAllAttackRolls(frequency) {
        for (let enemy of GameInfo.enemyArray) {
            enemy.beginMoveLateral(frequency);
        }
    }
    public static startSelectMovementRolls(frequency, exceptions: Array<number>) {
        for (let i in GameInfo.enemyArray) {
            if (exceptions.includes(parseInt(i))) { continue; }
            GameInfo.enemyArray[i].beginMoveLateral(frequency);
        }
    }
    public static startSelectAttackRolls(exceptions: Array<number>) {
        for (let i in GameInfo.enemyArray) {
            if (exceptions.includes(parseInt(i))) { continue; }
            GameInfo.enemyArray[i].beginInflictDamage();
        }
    }
}
