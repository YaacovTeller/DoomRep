"use strict";
class GameInfo {
    static resetAllGuns() {
        this.allGuns = {
            chainsaw: new ChainSaw,
            Pistol: new Pistol,
            Shotgun: new Shotgun,
            DukeMgun: new DukeMgun,
            Minigun: new Minigun,
            DualNeutron: new DualNeutron,
            Pipebomb: new Pipebomb,
        };
    }
    static reset() {
        this.resetAllGuns();
        this.deadCount = 0;
        this.deadExtraCount = 0;
        this.headshotCount = 0;
        this.enemiesCleared = false;
        this.levelArray = [];
        this.currentLevel = null;
        this.currentScene = null;
        this.gameBegun = true;
        if (this.music) {
            this.music.stop();
        }
        this.music = null;
    }
    static setMusic(array) {
        this.music = RandomSoundGen.getRandomSound(array);
    }
    static addLevel(level) {
        this.levelArray.push(level);
        this.currentLevel = level;
    }
    static getTotalKills() {
        return this.deadCount + this.deadExtraCount;
    }
    static setHeadTargeting() {
        this.headTargeting = true;
    }
    static unsetHeadTargeting() {
        this.headTargeting = false;
    }
    static setAsTarget(target) {
        this.hitTarget = target;
        this.targeting = true;
    }
    static unsetTarget() {
        this.hitTarget = null;
        this.targeting = false;
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
GameInfo.headTargeting = false;
GameInfo.enemiesCleared = false;
GameInfo.mute = false;
GameInfo.gameBegun = false;
GameInfo.allGuns = {
    chainsaw: null,
    Pistol: null,
    Shotgun: null,
    DukeMgun: null,
    Minigun: null,
    DualNeutron: null,
    Pipebomb: null
};
