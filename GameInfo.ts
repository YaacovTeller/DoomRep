class GameInfo {
    public static moverollFrequency: number = 2000;
    public static gameMode: gameMode;
    public static invincible: boolean = false;
    public static kidMode: boolean = false;

    public static AvailableEnemies: Array<string> = new Array();
    public static enemyArray: Array<RegEnemy> = new Array();
    public static pickupArray: Array<Pickup> = new Array();
    public static itemArray: Array<Item> = new Array();

    public static levelArray: Array<Level> = new Array();
    public static currentLevel: Level
    public static currentScene: Scene;

    public static bossTotalHealth: number;

    public static hitTarget: any = null;
    public static targeting: boolean = false;
    public static headTargeting: boolean = false;

    public static deadCount: number;
    public static deadExtraCount: number;
    public static headshotCount: number;
    public static enemiesCleared: boolean = false;
    public static music: any;
    public static mute: boolean = false;
    public static gameBegun: boolean = false;

    public static allGuns = {
        chainsaw: null,
        Pistol: null,
        Shotgun: null,
        DukeMgun: null,
        Minigun: null,
        DualNeutron: null,
        Pipebomb: null
    };

    public static resetAllGuns(){
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

    public static reset() {
        this.resetAllGuns()
        this.deadCount = 0;
        this.deadExtraCount = 0;
        this.headshotCount = 0;
        this.enemiesCleared = false;
        this.levelArray = [];
        this.currentLevel = null;
        this.currentScene = null;
        this.gameBegun = true;
        if (this.music){
            this.music.stop();
        }
        this.music = null;
    }

    public static setMusic(array){
        this.music = RandomSoundGen.getRandomSound(array);
    }

    public static addLevel(level: Level){
        this.levelArray.push(level)
        this.currentLevel = level;
    }

    public static getTotalKills(){
        return this.deadCount + this.deadExtraCount;
    }
    public static setHeadTargeting() {
        this.headTargeting = true;
    }
    public static unsetHeadTargeting() {
        this.headTargeting = false;
    }
    public static setAsTarget(target) {
        this.hitTarget = target;
        this.targeting = true;
    }
    public static unsetTarget() {
        this.hitTarget = null;
        this.targeting = false;
    }
}
