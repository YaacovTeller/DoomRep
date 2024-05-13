var levelFuncArray = [
   // [level_2_6],
   // [level_1_4],

    [level_1_1, level_1_2, level_1_3, level_1_4, level_1_5],
    [level_2_1, level_2_2, level_2_3, level_2_4, level_2_5, level_2_6],
    [level_3_1, level_3_2, level_3_3, level_3_4, level_3_5, level_3_6],
];
enum gameMode {
    campaign,
    continuous
}

class Level {
    public sceneArray: Array<Scene> = new Array();
    public sceneFuncs: Array<Function> = new Array();
    public musicArray: Array<any> = new Array();
    public startingWeapons: Array<weaponry> = new Array();
    constructor(sceneFuncs, musicArray, startingWeapons?: Array<weaponry>) {
        this.musicArray = musicArray;
        this.sceneFuncs = sceneFuncs;
        this.startingWeapons = startingWeapons;
    }
    public prepLevel(){
        startTimer();
        for (let wep of this.startingWeapons){
            Player.collectWeapon(wep);
        }
        Player.weapon.calculateAndSetGunPosition(MousePosition.x, MousePosition.y);
        Player.weapon.switchTo();
        startGameMusic(this.musicArray);
    }
    public moreScenes(){
        return this.sceneFuncs.length != this.sceneArray.length; // Allow for 'sectionFin' scene?
    }
    public playNextScene(){
        let func = this.sceneFuncs[this.sceneArray.length] || this.sceneFuncs[0];
        func();
    }
    public addScene(scene: Scene){
        this.sceneArray.push(scene);
    }
}

class Scene {
    public background;
    public attributes;
    public enemyFunc;
    constructor(background, attributes, enemyFunc, fadeOutDelay?, fadeInDelay?, enemiesDelay?, noFadeOut?){
        this.background = background;
        this.attributes = attributes;
        this.enemyFunc = enemyFunc;
        fadeOutDelay = fadeOutDelay != null ? fadeOutDelay : 500;
        fadeInDelay = fadeInDelay != null ? fadeInDelay : 1700;
        enemiesDelay = enemiesDelay != null ? enemiesDelay : 2500;
        this.genericScene(background, attributes, enemyFunc, fadeOutDelay, fadeInDelay, enemiesDelay, noFadeOut)
    }
    private genericScene(background:string, attributes:string, enemyFunc:Function, fadeOutDelay:number, fadeInDelay:number, enemiesDelay:number, noFadeOut?:boolean){
        if(!noFadeOut){ LevelHandler.fadeOutClear(fadeOutDelay);}
        LevelHandler.fadeInBackground(fadeInDelay, background, attributes);
        LevelHandler.generateEnemiesDelay(enemiesDelay, enemyFunc);
    }
}

class SceneGenerator{
    private static drawNewEnemiesGeneric(){
        let numOfEnemies = RandomNumberGen.randomNumBetween(4, 10);
        let enemyNumber = RandomNumberGen.randomNumBetween(0, 3);
        let mixedEnemies = RandomNumberGen.randomNumBetween(0, 1) == 1 ? true: false;
        let insertBarrel = RandomNumberGen.randomNumBetween(0, 2) == 2 ? true: false;
        let extraEnemy = RandomNumberGen.randomNumBetween(0, 4) == 3 ? true: false;

        let enemyType = enemies[enemyNumber];
        GameInfo.enemyArray = [];
        for (let i=0; i<numOfEnemies; i++){
            enemyType = this.reconsiderEnemyType(enemyType, mixedEnemies)
            this.enemySelector(enemyType);
        }
        if (insertBarrel){
            this.itemSelector("barrel");
        }
        if (extraEnemy){
            this.enemySelector(enemyType, specialEnemy.Extra);
        }
        LevelHandler.startAllRolls(GameInfo.moverollFrequency, hitLimit.slow); // HITLIMIT , MOVE!
    }
    private static itemSelector(item){
        GameInfo.itemArray.push(
            new Item (item, this.positionSelector(), 40)
        )
    }
    private static positionSelector(){
        let x: number = RandomNumberGen.randomNumBetween(5, 85);
        let y: number = RandomNumberGen.randomNumBetween(35, 65);
        return new Position(x,y)
    }

    private static isFirstSceneCheck(){
        return GameInfo.currentLevel.sceneArray.length < 1;
    }
    private static reconsiderEnemyType(enemyType, mixedEnemies){
        enemyType = mixedEnemies ? enemies[RandomNumberGen.randomNumBetween(0, 4)] : enemyType;
        if (SceneGenerator.isFirstSceneCheck() && enemyType == enemies.ChaingunGuy){ // hack to prevent chainguy rush
            enemyType == enemies.ShotgunTroop;
        }
        return enemyType;
    }

    private static enemySelector(enemyType, specialStatus?){
        let position = this.positionSelector();  
        this.enemyType(enemyType, position, specialStatus);
    }

    private static enemyType(enemyType, position: Position, specialStatus?){
        let ישעיה_שמחה :string;
        var שמועל: boolean = false;
        let enemy: RegEnemy;
        if (specialStatus == specialEnemy.Extra) {
            position.scale = 0.8;
        }
        if (enemyType == enemies[0]){
            enemy = new SectorPatrol(position, null, [], specialStatus);
        }
        if (enemyType == enemies[1]){
            enemy = new Troop(position, null, [], specialStatus);
        }
        if (enemyType == enemies[2]){
            enemy = new Imp(position, null, [], specialStatus);
        }
        if (enemyType == enemies[3]){
            enemy = new ShotgunTroop(position, null, [], specialStatus);
        }
        if (enemyType == enemies[4]){
            enemy = new ChaingunGuy(position, null, [], specialStatus);
        }
        if (specialStatus == specialEnemy.Extra) {
            enemy.test_precalculatedLateralMove(-200, 4000);
        }
        GameInfo.enemyArray.push(enemy)
    }

    private static randomBackground() {
        return pics.background['doom' + RandomNumberGen.randomNumBetween(1, 6)]
    }
    public static sceneLoop() {
        let scene: Scene;
        if (SceneGenerator.isFirstSceneCheck()){
            scene = new Scene(SceneGenerator.randomBackground(),"width: 100%", ()=>SceneGenerator.drawNewEnemiesGeneric(), 0, 0, 0)
        }
        else{
            scene = new Scene(SceneGenerator.randomBackground(),"width: 100%", ()=>SceneGenerator.drawNewEnemiesGeneric());
        }
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
            if (GameInfo.gameMode == gameMode.continuous){
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
    public static deathMssg(){
        let div1: HTMLElement = createMessageDiv("sceneMsg", "YOU DIED");
        slamMessage(div1, elements.finishMsg, 1000);
    }
    public static winGame(){
        this.winMssg()
        setTimeout(() => {
            creditsMenu();
            //openMenu();
        }, 4000);
    }

    public static winMssg(){
        let str = "A WINNER IS YOU";
        if (GameInfo.invincible == true){
            let div2: HTMLElement = createMessageDiv("sceneMsg", "(you did cheat though...)");
            slamMessage(div2, elements.finishMsg, 2500);
        }
        let div1: HTMLElement = createMessageDiv("sceneMsg", str); // ENDGAME needs a place
        elements.finishMsg.onclick = null;
        slamMessage(div1, elements.finishMsg, 1000);
        this.storeEndgame();
    }

    public static storeEndgame(){
        let gameInfo = {};
        gameInfo['gameMode'] = GameInfo.gameMode
        gameInfo['kills'] = GameInfo.getTotalKills();
        gameInfo['levelArraylength'] = GameInfo.levelArray.length;
        gameInfo['invincible'] = GameInfo.invincible;
        
        let microDoom = getFromLocal();
        if (microDoom){
            let currentMostKills = microDoom['mostKills'] || 0;
            if (gameInfo['kills'] > currentMostKills){
                microDoom['mostKills'] = gameInfo['kills']
            }

            let currentFurthestLevel, currentFurthestStage;
            if (GameInfo.gameMode == gameMode.campaign){
                currentFurthestLevel = microDoom['furthestCampaignLevel'] || 0;
                let level = GameInfo.levelArray.length;
                if (level > currentFurthestLevel){
                    microDoom['furthestCampaignLevel'] = level;
                }
            }
            else {
               // this.storeHighScore(microDoom, 'furthestContinuousStage', GameInfo.currentLevel.sceneArray.length)

                currentFurthestStage = microDoom['furthestContinuousStage'] || 0;
                let stage = GameInfo.currentLevel.sceneArray.length;
                if (stage > currentFurthestStage){
                    microDoom['furthestContinuousStage'] = stage;
                }
            }
        }

        microDoom['gameInfo'] = gameInfo;
        setInLocal(microDoom);
    }
    // public static storeHighScore(obj, furthestStageName, num){
    //     let currentFurthestStage = obj[furthestStageName] || 0;
    //     if (num > currentFurthestStage){
    //         microDoom[furthestStageName] = num;
    //     }
    // }

    public static nextLevel() {
        clearScreenMessages();
        let levelFunc;
        let wepArray = [];
        let musicArray = [];
        if (GameInfo.levelArray.length == 0){
            wepArray = [GameInfo.allGuns.chainsaw] // starting weapon ?
            musicArray = BlakeMusic;
        }
        else{
            musicArray = DoomMusic;
        }
        if (GameInfo.gameMode == gameMode.campaign){
            if (GameInfo.levelArray.length < levelFuncArray.length){
                levelFunc = levelFuncArray[GameInfo.levelArray.length]
            }
            else {
                this.winGame(); // badly placed?
                return;
            }
        }
        else if (GameInfo.gameMode == gameMode.continuous){
            musicArray = DoomMusic;
            levelFunc = [SceneGenerator.sceneLoop];
            wepArray = [GameInfo.allGuns.chainsaw, GameInfo.allGuns.Pistol];
        }

        GameInfo.addLevel(new Level(levelFunc, musicArray, wepArray));
        GameInfo.currentLevel.prepLevel();
        this.sceneCheck();
    }

    private static checkAllDead() {
        for (let enemy of GameInfo.enemyArray) {
          //  if (enemy.deadFlag == false && !(enemy instanceof Extra))
          if (enemy.deadFlag == false && !(enemy.specialStatus == specialEnemy.Extra))
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
        stopGameMusic();
        Intermission.play();
        genericFinishMessage();
        LevelHandler.fadeOutClear(1000);
        setMouseAttributes_NoShot();
        setTimeout(() => {
            elements.finishMsg.onclick = ()=>{
                Intermission.stop();
                LevelHandler.nextLevel(); // NEXT LEVEL, FIX?

                elements.finishMsg.onclick = null; // prevents NEXT message from skipping the timeout
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
            this.setZindexes(); // FIX? oddly placed
        }, time);
    }
    public static setPickupFlash(){
        setInterval(()=>{
            this.pickupFlash();
        },5000)
    }

    private static pickupFlash(){
        for (let item of GameInfo.pickupArray){
            item.flash();
        }
    }

    private static setZindexes(){
        let domElems = this.getAllSprites();
        for (let item of domElems){    
            item.style.zIndex = this.getScaleStringTimesTen(item);
        }
    }
    private static getAllSprites(){
        let allDomElems: Array<HTMLElement> = [];
        let enemyDomElems = GameInfo.enemyArray.map(x=>x.DOMdiv)
        let itemDomElems = GameInfo.itemArray.map(x=>x.DOMdiv);
        allDomElems = allDomElems.concat(enemyDomElems, itemDomElems);
        return allDomElems;
    }
    private static getScaleStringTimesTen(item: HTMLElement){
        let trans = item.style.transform.replace("scale(","")
        let scale = parseFloat(trans);
        scale *= 10;
        return Math.round(scale).toString();
    }

    public static reduceBar(currentHealth) {
        let health = (currentHealth / GameInfo.bossTotalHealth) * 100;
        this.moveBar(elements.Bar, health);
    }
    public static moveBar(bar, num, callback?){
        $(bar).animate({ width: num + "%" }, 120, callback);
    }

    public static startAllRolls(frequency, hitLimit) {
        for (let enemy of GameInfo.enemyArray) {
            if (!(enemy.specialStatus == specialEnemy.Extra)){
                enemy.beginInflictDamage(hitLimit);
                enemy.beginMoveLateral(frequency);
            }
            this.randomisedActiveSound(enemy)
            enemy.health = enemy.health ? enemy.health : enemy.baseHealth;
        }
    }
    
    private static randomisedActiveSound(enemy){
        if (RandomNumberGen.randomNumBetween(0,1) == 1){
            enemy.activeSound();
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
