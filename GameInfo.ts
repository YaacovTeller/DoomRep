class GameInfo {
    public static moverollFrequency: number = 2000;
    public static gameMode: number;
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
    public static deadCount: number;
    public static deadExtraCount: number;
    public static enemiesCleared: boolean = false;
    public static music: boolean = true;
    public static gameBegun: boolean = false;

    public static allGuns = {
        chainsaw: new ChainSaw,
        Pistol: new Pistol,
        Shotgun: new Shotgun,
        DukeMgun: new DukeMgun,
        Minigun: new Minigun,
        DualNeutron: new DualNeutron,
    };

    public static reset() {
        this.deadCount = 0;
        this.deadExtraCount = 0;
        this.enemiesCleared = false;
        this.levelArray = [];
        this.currentLevel = null;
        this.currentScene = null;
        this.gameBegun = true;
    }

    public static addLevel(level: Level){
        this.levelArray.push(level)
        this.currentLevel = level;
    }
}
