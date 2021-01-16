"use strict";
var levelFuncArray = [
    //  [level_2_6]
    //  [level_1_4],
    [level_1_1, level_1_2, level_1_3, level_1_4],
    [level_2_1, level_2_2, level_2_3, level_2_4, level_2_5, level_2_6],
    [level_3_1, level_3_2, level_3_3, level_3_4, level_3_5, level_3_6],
];
class Level {
    constructor(sceneFuncs, startingWeapons) {
        this.sceneArray = new Array();
        this.sceneFuncs = new Array();
        this.startingWeapons = new Array();
        this.sceneFuncs = sceneFuncs;
        this.startingWeapons = startingWeapons;
    }
    prepLevel() {
        startTimer();
        for (let wep of this.startingWeapons) {
            Player.collectWeapon(wep);
        }
        DOMUpdater.gunTobaseOfScreen(Player.weapon.scrnMargin);
        // Player.collectWeapon(new ChainSaw);
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
        new Item(item, this.positionSelector(), 40);
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
            if (GameInfo.gameMode == 1) {
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
    static nextLevel() {
        if (GameInfo.music == true) {
            Deuscredits.play();
        }
        clearScreenMessages();
        let wepArray = GameInfo.levelArray.length == 0 ? [GameInfo.allGuns.chainsaw] : []; // starting weapon ?
        if (GameInfo.gameMode == 0) {
            if (GameInfo.levelArray.length < levelFuncArray.length) {
                GameInfo.addLevel(new Level(levelFuncArray[GameInfo.levelArray.length], wepArray));
            }
            else {
                let div1 = createMessageDiv("sceneMsg", "A WINNER IS YOU"); // ENDGAME needs a place
                elements.finishMsg.onclick = null;
                slamMessage(div1, elements.finishMsg, 1000);
                setTimeout(() => {
                    openMenu();
                }, 4000);
                return;
            }
        }
        else if (GameInfo.gameMode == 1) {
            GameInfo.addLevel(new Level([SceneGenerator.sceneLoop], [GameInfo.allGuns.chainsaw, GameInfo.allGuns.Pistol]));
        }
        GameInfo.currentLevel.prepLevel();
        this.sceneCheck();
    }
    static checkAllDead() {
        for (let enemy of GameInfo.enemyArray) {
            if (enemy.deadFlag == false && !(enemy instanceof Extra))
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
        Deuscredits.stop();
        genericFinishMessage();
        LevelHandler.fadeOutClear(1000);
        setTimeout(() => {
            elements.finishMsg.onclick = () => {
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
        }, time);
    }
    static reduceBar(currentHealth) {
        let health = (currentHealth / GameInfo.bossTotalHealth) * 100;
        $(elements.Bar).animate({ width: health + "%" }, 120);
    }
    static startAllRolls(frequency, hitLimit) {
        for (let enemy of GameInfo.enemyArray) {
            enemy.beginInflictDamage(hitLimit);
            enemy.beginMoveLateral(frequency);
            if (RandomNumberGen.randomNumBetween(0, 1) == 1) {
                enemy.activeSound();
            }
            enemy.health = enemy.health ? enemy.health : enemy.baseHealth;
        }
    }
}
