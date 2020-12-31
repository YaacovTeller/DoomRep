"use strict";
class Level {
    constructor(sceneFuncs) {
        this.sceneArray = new Array();
        this.sceneFuncs = new Array();
        this.sceneFuncs = sceneFuncs;
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
        enemiesDelay = enemiesDelay != null ? enemiesDelay : 3000;
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
        GameInfo.enemyArray = [];
        for (let i = 0; i < numOfEnemies; i++) {
            this.enemySelector(enemyNumber, mixedEnemies);
        }
        LevelHandler.startAllRolls(GameInfo.moverollFrequency);
    }
    static enemySelector(enemyNumber, mixedEnemies) {
        enemyNumber = mixedEnemies ? RandomNumberGen.randomNumBetween(0, 3) : enemyNumber;
        let enemy;
        let health;
        let x = RandomNumberGen.randomNumBetween(5, 85);
        let y = RandomNumberGen.randomNumBetween(35, 65);
        if (enemyNumber == 0) {
            health = 20;
            enemy = new Troop(health, new Position(x, y));
        }
        if (enemyNumber == 1) {
            health = 30;
            enemy = new Imp(health, new Position(x, y));
        }
        if (enemyNumber == 2) {
            health = 30;
            enemy = new ShotGun_Troop(health, new Position(x, y));
        }
        if (enemyNumber == 3) {
            health = 120;
            enemy = new ChainGGuy(health, new Position(x, y));
        }
        GameInfo.enemyArray.push(enemy);
    }
    static randomBackground() {
        return pics.background['doom' + RandomNumberGen.randomNumBetween(1, 6)];
    }
    static sceneLoop() {
        let scene = new Scene(SceneGenerator.randomBackground(), "width: 100%", () => SceneGenerator.drawNewEnemiesGeneric());
        GameInfo.currentLevel.addScene(scene);
    }
}
class LevelHandler {
    static beginGame() {
        startTimer();
        Player.collectWeapon(new ChainSaw);
        Player.collectWeapon(new Pistol);
        if (GameInfo.music == true) {
            Deuscredits.play();
        }
        DOMUpdater.gunTobaseOfScreen(Player.weapon.scrnMargin);
        if (GameInfo.gameMode == 0) {
            GameInfo.addLevel(new Level([scene1, scene2, scene3, scene4, scene5, finalLev, sectionFinish]));
        }
        else {
            GameInfo.addLevel(new Level([SceneGenerator.sceneLoop]));
        }
        this.sceneCheck();
    }
    static sceneCheck() {
        if (this.checkAllDead()) {
            GameInfo.currentLevel.playNextScene(); // or default
        }
    }
    static checkAllDead() {
        for (let enemy of GameInfo.enemyArray) {
            if (enemy.deadFlag == false && !(enemy instanceof Extra))
                return false;
        }
        GameInfo.enemiesCleared = true;
        return true;
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
    static startAllRolls(frequency) {
        for (let enemy of GameInfo.enemyArray) {
            enemy.beginInflictDamage();
            enemy.beginMoveLateral(frequency);
        }
    }
    static startAllMovementRolls() {
        for (let enemy of GameInfo.enemyArray) {
            enemy.beginInflictDamage();
        }
    }
    static startAllAttackRolls(frequency) {
        for (let enemy of GameInfo.enemyArray) {
            enemy.beginMoveLateral(frequency);
        }
    }
    static startSelectMovementRolls(frequency, exceptions) {
        for (let i in GameInfo.enemyArray) {
            if (exceptions.includes(parseInt(i))) {
                continue;
            }
            GameInfo.enemyArray[i].beginMoveLateral(frequency);
        }
    }
    static startSelectAttackRolls(exceptions) {
        for (let i in GameInfo.enemyArray) {
            if (exceptions.includes(parseInt(i))) {
                continue;
            }
            GameInfo.enemyArray[i].beginInflictDamage();
        }
    }
}
