"use strict";
var levelFuncArray = [
    //  [level_2_6],
    // [level_1_4],
    //   [level_1_1, level_1_2, level_1_3, level_1_4, level_1_5],
    [level_2_1, level_2_2, level_2_3, level_2_4, level_2_5, level_2_6],
    [level_3_1, level_3_2, level_3_3, level_3_4, level_3_5, level_3_6],
];
var gameMode;
(function (gameMode) {
    gameMode[gameMode["campaign"] = 0] = "campaign";
    gameMode[gameMode["continuous"] = 1] = "continuous";
})(gameMode || (gameMode = {}));
class Level {
    constructor(sceneFuncs, musicArray, startingWeapons) {
        this.sceneArray = new Array();
        this.sceneFuncs = new Array();
        this.musicArray = new Array();
        this.startingWeapons = new Array();
        this.musicArray = musicArray;
        this.sceneFuncs = sceneFuncs;
        this.startingWeapons = startingWeapons;
    }
    prepLevel() {
        startTimer();
        for (let wep of this.startingWeapons) {
            Player.collectWeapon(wep);
        }
        Player.weapon.calculateAndSetGunPosition(MousePosition.x, MousePosition.y);
        startGameMusic(this.musicArray);
    }
    moreScenes() {
        return this.sceneFuncs.length != this.sceneArray.length; // Allow for 'sectionFin' scene?
    }
    playNextScene() {
        let func = this.sceneFuncs[this.sceneArray.length] || this.sceneFuncs[0];
        func();
    }
    addScene(scene) {
        this.sceneArray.push(scene);
    }
}
class Scene {
    constructor(background, attributes, enemyFunc, fadeOutDelay, fadeInDelay, enemiesDelay, noFadeOut) {
        this.background = background;
        this.attributes = attributes;
        this.enemyFunc = enemyFunc;
        fadeOutDelay = fadeOutDelay != null ? fadeOutDelay : 500;
        fadeInDelay = fadeInDelay != null ? fadeInDelay : 1700;
        enemiesDelay = enemiesDelay != null ? enemiesDelay : 2500;
        this.genericScene(background, attributes, enemyFunc, fadeOutDelay, fadeInDelay, enemiesDelay, noFadeOut);
    }
    genericScene(background, attributes, enemyFunc, fadeOutDelay, fadeInDelay, enemiesDelay, noFadeOut) {
        if (!noFadeOut) {
            LevelHandler.fadeOutClear(fadeOutDelay);
        }
        LevelHandler.fadeInBackground(fadeInDelay, background, attributes);
        LevelHandler.generateEnemiesDelay(enemiesDelay, enemyFunc);
    }
}
class SceneGenerator {
    static drawNewEnemiesGeneric() {
        let numOfEnemies = RandomNumberGen.randomNumBetween(4, 10);
        let enemyNumber = RandomNumberGen.randomNumBetween(0, 3);
        let mixedEnemies = RandomNumberGen.randomNumBetween(0, 1);
        let insertBarrel = RandomNumberGen.randomNumBetween(0, 2);
        GameInfo.enemyArray = [];
        for (let i = 0; i < numOfEnemies; i++) {
            this.enemySelector(enemyNumber, mixedEnemies);
        }
        if (insertBarrel == 2) {
            this.itemSelector("barrel");
        }
        LevelHandler.startAllRolls(GameInfo.moverollFrequency, hitLimit.slow); // HITLIMIT , MOVE!
    }
    static itemSelector(item) {
        GameInfo.itemArray.push(new Item(item, this.positionSelector(), 40));
    }
    static positionSelector() {
        let x = RandomNumberGen.randomNumBetween(5, 85);
        let y = RandomNumberGen.randomNumBetween(35, 65);
        return new Position(x, y);
    }
    static isFirstSceneCheck() {
        return GameInfo.currentLevel.sceneArray.length < 1;
    }
    static enemySelector(enemyNumber, mixedEnemies) {
        enemyNumber = mixedEnemies ? RandomNumberGen.randomNumBetween(0, 4) : enemyNumber;
        if (SceneGenerator.isFirstSceneCheck() && enemyNumber == 4) { // hack to prevent chainguy rush
            enemyNumber--;
        }
        let ישעיה_שמחה;
        let enemy;
        let position = this.positionSelector();
        if (enemyNumber == 0) {
            enemy = new SectorPatrol(position);
        }
        if (enemyNumber == 1) {
            enemy = new Troop(position);
        }
        if (enemyNumber == 2) {
            enemy = new Imp(position);
        }
        if (enemyNumber == 3) {
            enemy = new ShotGun_Troop(position);
        }
        if (enemyNumber == 4) {
            enemy = new ChainGGuy(position);
        }
        GameInfo.enemyArray.push(enemy);
    }
    static randomBackground() {
        return pics.background['doom' + RandomNumberGen.randomNumBetween(1, 6)];
    }
    static sceneLoop() {
        let scene;
        if (SceneGenerator.isFirstSceneCheck()) {
            scene = new Scene(SceneGenerator.randomBackground(), "width: 100%", () => SceneGenerator.drawNewEnemiesGeneric(), 0, 0, 0);
        }
        else {
            scene = new Scene(SceneGenerator.randomBackground(), "width: 100%", () => SceneGenerator.drawNewEnemiesGeneric());
        }
        GameInfo.currentLevel.addScene(scene);
        elements.progressCounter.innerText = "" + (GameInfo.currentLevel.sceneArray.length);
    }
}
class LevelHandler {
    static beginGame() {
        this.nextLevel();
    }
    static sceneCheck() {
        if (this.checkAllDead()) {
            if (GameInfo.gameMode == gameMode.continuous) {
                GameInfo.currentLevel.playNextScene();
            }
            else {
                if (GameInfo.currentLevel.moreScenes()) {
                    GameInfo.currentLevel.playNextScene();
                }
                else {
                    this.sectionFinish();
                }
            }
        }
    }
    static deathMssg() {
        let div1 = createMessageDiv("sceneMsg", "YOU DIED");
        slamMessage(div1, elements.finishMsg, 1000);
    }
    static winGame() {
        this.winMssg();
        setTimeout(() => {
            creditsMenu();
            //openMenu();
        }, 4000);
    }
    static winMssg() {
        let str = "A WINNER IS YOU";
        if (GameInfo.invincible == true) {
            let div2 = createMessageDiv("sceneMsg", "(you did cheat though...)");
            slamMessage(div2, elements.finishMsg, 2500);
        }
        let div1 = createMessageDiv("sceneMsg", str); // ENDGAME needs a place
        elements.finishMsg.onclick = null;
        slamMessage(div1, elements.finishMsg, 1000);
        this.storeEndgame();
    }
    static storeEndgame() {
        let gameInfo = {};
        gameInfo['gameMode'] = GameInfo.gameMode;
        gameInfo['kills'] = GameInfo.getTotalKills();
        gameInfo['levelArraylength'] = GameInfo.levelArray.length;
        gameInfo['invincible'] = GameInfo.invincible;
        let microDoom = getFromLocal();
        if (microDoom) {
            let currentMostKills = microDoom['mostKills'] || 0;
            if (gameInfo['kills'] > currentMostKills) {
                microDoom['mostKills'] = gameInfo['kills'];
            }
            let currentFurthestLevel, currentFurthestStage;
            if (GameInfo.gameMode == gameMode.campaign) {
                currentFurthestLevel = microDoom['furthestCampaignLevel'] || 0;
                let level = GameInfo.levelArray.length;
                if (level > currentFurthestLevel) {
                    microDoom['furthestCampaignLevel'] = level;
                }
            }
            else {
                // this.storeHighScore(microDoom, 'furthestContinuousStage', GameInfo.currentLevel.sceneArray.length)
                currentFurthestStage = microDoom['furthestContinuousStage'] || 0;
                let stage = GameInfo.currentLevel.sceneArray.length;
                if (stage > currentFurthestStage) {
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
    static nextLevel() {
        clearScreenMessages();
        let levelFunc;
        let wepArray = [];
        let musicArray = [];
        if (GameInfo.levelArray.length == 0) {
            wepArray = [GameInfo.allGuns.chainsaw]; // starting weapon ?
            musicArray = BlakeMusic;
        }
        else {
            musicArray = DoomMusic;
        }
        if (GameInfo.gameMode == gameMode.campaign) {
            if (GameInfo.levelArray.length < levelFuncArray.length) {
                levelFunc = levelFuncArray[GameInfo.levelArray.length];
            }
            else {
                this.winGame(); // badly placed?
                return;
            }
        }
        else if (GameInfo.gameMode == gameMode.continuous) {
            musicArray = DoomMusic;
            levelFunc = [SceneGenerator.sceneLoop];
            wepArray = [GameInfo.allGuns.chainsaw, GameInfo.allGuns.Pistol];
        }
        GameInfo.addLevel(new Level(levelFunc, musicArray, wepArray));
        GameInfo.currentLevel.prepLevel();
        this.sceneCheck();
    }
    static checkAllDead() {
        for (let enemy of GameInfo.enemyArray) {
            //  if (enemy.deadFlag == false && !(enemy instanceof Extra))
            if (enemy.deadFlag == false && !(enemy.specialStatus == specialEnemy.Extra))
                return false;
        }
        GameInfo.enemiesCleared = true;
        return true;
    }
    static sectionFinish() {
        LevelHandler.reduceBar(0);
        stopTimer();
        GameInfo.hitTarget = null; // FIX?
        GameInfo.gameBegun = false;
        stopGameMusic();
        Intermission.play();
        genericFinishMessage();
        LevelHandler.fadeOutClear(1000);
        setTimeout(() => {
            elements.finishMsg.onclick = () => {
                Intermission.stop();
                LevelHandler.nextLevel(); // NEXT LEVEL, FIX?
                elements.finishMsg.onclick = null;
            };
        }, 6000);
    }
    static fadeOutClear(time) {
        setTimeout(() => {
            fadeOut();
            DOMUpdater.timedClearAllImages();
        }, time);
    }
    static fadeInBackground(time, background, attributes) {
        setTimeout(() => {
            elements.backImg.setAttribute("src", background);
            if (attributes) {
                elements.backImg.setAttribute("style", attributes);
            }
            fadeIn();
        }, time);
    }
    static generateEnemiesDelay(time, enemyFunc) {
        setTimeout(() => {
            enemyFunc();
            this.setZindexes(); // FIX? oddly placed
        }, time);
    }
    static setPickupFlash() {
        setInterval(() => {
            this.pickupFlash();
        }, 5000);
    }
    static pickupFlash() {
        for (let item of GameInfo.pickupArray) {
            item.flash();
        }
    }
    static setZindexes() {
        let domElems = this.getAllSprites();
        for (let item of domElems) {
            item.style.zIndex = this.getScaleStringTimesTen(item);
        }
    }
    static getAllSprites() {
        let allDomElems = [];
        let enemyDomElems = GameInfo.enemyArray.map(x => x.DOMdiv);
        let itemDomElems = GameInfo.itemArray.map(x => x.DOMdiv);
        allDomElems = allDomElems.concat(enemyDomElems, itemDomElems);
        return allDomElems;
    }
    static getScaleStringTimesTen(item) {
        let trans = item.style.transform.replace("scale(", "");
        let scale = parseFloat(trans);
        scale *= 10;
        return Math.round(scale).toString();
    }
    static reduceBar(currentHealth) {
        let health = (currentHealth / GameInfo.bossTotalHealth) * 100;
        $(elements.Bar).animate({ width: health + "%" }, 120);
    }
    static startAllRolls(frequency, hitLimit) {
        for (let enemy of GameInfo.enemyArray) {
            if (!(enemy.specialStatus == specialEnemy.Extra)) {
                //        enemy.beginInflictDamage(hitLimit);
                //        enemy.beginMoveLateral(frequency);
            }
            this.randomisedActiveSound(enemy);
            enemy.health = enemy.health ? enemy.health : enemy.baseHealth;
        }
    }
    static randomisedActiveSound(enemy) {
        if (RandomNumberGen.randomNumBetween(0, 1) == 1) {
            enemy.activeSound();
        }
    }
}
