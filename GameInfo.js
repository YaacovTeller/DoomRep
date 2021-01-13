"use strict";
class GameInfo {
    static reset() {
        this.deadCount = 0;
        this.deadExtraCount = 0;
        this.enemiesCleared = false;
        this.levelArray = [];
        this.currentLevel = null;
        this.currentScene = null;
        this.gameBegun = true;
    }
    static addLevel(level) {
        this.levelArray.push(level);
        this.currentLevel = level;
    }
}
GameInfo.moverollFrequency = 2000;
GameInfo.invincible = false;
GameInfo.kidMode = false;
GameInfo.AvailableEnemies = new Array();
GameInfo.enemyArray = new Array();
GameInfo.pickupArray = new Array();
GameInfo.itemArray = new Array();
GameInfo.levelArray = new Array();
GameInfo.hitTarget = null;
GameInfo.targeting = false;
GameInfo.enemiesCleared = false;
GameInfo.music = true;
GameInfo.gameBegun = false;
GameInfo.allGuns = {
    chainsaw: new ChainSaw,
    Pistol: new Pistol,
    Shotgun: new Shotgun,
    DukeMgun: new DukeMgun,
    Minigun: new Minigun,
    DualNeutron: new DualNeutron,
};
