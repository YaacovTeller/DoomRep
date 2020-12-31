class Level {
    public sceneArray: Array<Scene> = new Array();
    public sceneFuncs: Array<Function> = new Array();
    constructor(sceneFuncs) {
        this.sceneFuncs = sceneFuncs;
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
        GameInfo.enemyArray = [];
        for (let i=0; i<numOfEnemies; i++){
            this.enemySelector(enemyNumber, mixedEnemies);
        }
        LevelHandler.startAllRolls(GameInfo.moverollFrequency);
    }

    private static enemySelector(enemyNumber, mixedEnemies){
        enemyNumber = mixedEnemies ? RandomNumberGen.randomNumBetween(0, 3) : enemyNumber;
        let enemy;
        let health: number;
        let x: number = RandomNumberGen.randomNumBetween(5, 85);
        let y: number = RandomNumberGen.randomNumBetween(35, 65);
        if (enemyNumber == 0){
            health = 20;
            enemy = new Troop(health, new Position(x,y));
        }
        if (enemyNumber == 1){
            health = 30;
            enemy = new Imp(health, new Position(x,y));
        }
        if (enemyNumber == 2){
            health = 30;
            enemy = new ShotGun_Troop(health, new Position(x,y));
        }
        if (enemyNumber == 3){
            health = 120;
            enemy = new ChainGGuy(health, new Position(x,y));
        }
        GameInfo.enemyArray.push(enemy)
    }

    private static randomBackground() {
        return pics.background['doom' + RandomNumberGen.randomNumBetween(1, 6)]
    }
    public static sceneLoop() {
        let scene = new Scene(SceneGenerator.randomBackground(),"width: 100%", ()=>SceneGenerator.drawNewEnemiesGeneric())
        GameInfo.currentLevel.addScene(scene)
    }
}

class LevelHandler {
    public static beginGame() {
        startTimer();
        Player.collectWeapon(new ChainSaw);
        Player.collectWeapon(new Pistol);
        if (GameInfo.music == true) { Deuscredits.play(); }
        DOMUpdater.gunTobaseOfScreen(Player.weapon.scrnMargin);

        if (GameInfo.gameMode == 0) {
            GameInfo.addLevel(new Level([scene1, scene2, scene3, scene4, scene5, finalLev, sectionFinish]));
        }
        else {
            GameInfo.addLevel(new Level([SceneGenerator.sceneLoop]));
        }
        this.sceneCheck();
    }

    public static sceneCheck() {
        if (this.checkAllDead()) {
                GameInfo.currentLevel.playNextScene(); // or default
        }
    }

    private static checkAllDead() {
        for (let enemy of GameInfo.enemyArray) {
            if (enemy.deadFlag == false && !(enemy instanceof Extra))
                return false;
        }
        GameInfo.enemiesCleared = true;
        return true;
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
