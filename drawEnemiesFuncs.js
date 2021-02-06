"use strict";
var hitLimit = {
    slow: 6,
    normal: 5,
    fast: 4,
    Xfast: 3,
    XXFast: 2
};
function drawNewEnemies_1_1() {
    GameInfo.enemyArray.push(new SectorPatrol(new Position(30, 45)), new SectorPatrol(new Position(50, 50)));
    LevelHandler.startAllRolls(GameInfo.moverollFrequency, hitLimit.fast);
}
function drawNewEnemies_1_2() {
    GameInfo.enemyArray.push(new SectorPatrol(new Position(60, 45)), new SectorPatrol(new Position(70, 50)), new SectorPatrol(new Position(30, 60)));
    LevelHandler.startAllRolls(GameInfo.moverollFrequency, hitLimit.fast);
}
function drawNewEnemies_1_3() {
    GameInfo.enemyArray.push(new SectorPatrol(new Position(10, 65)), new SectorPatrol(new Position(50, 40)), new SectorPatrol(new Position(0, 50)), new SectorPatrol(new Position(20, 45)));
    GameInfo.itemArray.push(new Item("barrel", new Position(52, 25), 40));
    LevelHandler.startAllRolls(GameInfo.moverollFrequency, hitLimit.fast);
}
function drawNewEnemies_1_4() {
    let extra_1 = new SectorPatrol(new Position(50, 25, 0.2), 15, [], specialEnemy.Extra);
    GameInfo.enemyArray.push(extra_1, new SectorPatrol(new Position(15, 65)), new SectorPatrol(new Position(60, 45)), new SectorPatrol(new Position(5, 40)), new SectorPatrol(new Position(70, 45)));
    extra_1.test_precalculatedLateralMove(-200, 4000);
    LevelHandler.startAllRolls(GameInfo.moverollFrequency, hitLimit.fast);
}
function drawNewEnemies_1_5() {
    GameInfo.bossTotalHealth = 150;
    let boss = new SectorPatrol(new Position(40, 35, 0.8), GameInfo.bossTotalHealth, [new AnimationInfo("scaleTo_1p8", '7s', 1)], specialEnemy.Boss);
    //  let boss = new SectorPatrol(new Position(40,35, 0.8), GameInfo.bossTotalHealth, [], true)
    //  boss.moveForward();
    GameInfo.enemyArray.push(new SectorPatrol(new Position(50, 25, 0.2), 15, [], specialEnemy.Extra), boss);
    boss.DOMImage.src = enemyPics.forward.SectorPatrol;
    //   setTimeout(() => {
    LevelHandler.startAllRolls(GameInfo.moverollFrequency, hitLimit.Xfast);
    // }, 2000);
    resetBossBar();
}
////////////////////////////////////////////////
function drawNewEnemies_2_1() {
    let extra_1 = new Troop(new Position(100, 30, 0.6), 10, [], specialEnemy.Extra);
    GameInfo.enemyArray.push(new Troop(new Position(0, 30, 0.6), null, [new AnimationInfo("topTo_60", '3s'), new AnimationInfo("scaleTo_1", '3s'),]), //new AnimationInfo("leftTo_10",'2s')
    new Troop(new Position(20, 37)), new Troop(new Position(30, 60)), new ShotGun_Troop(new Position(50, 55)), new ShotGun_Troop(new Position(70, 30), null, [new AnimationInfo("scaleTo_1", '4s', '1')]), 
    //      new Extra("TroopLeft", new Position(100,30,0.6), null, [new AnimationInfo("fleeLeft",'7s', '1')]),// + "_Tomer"
    extra_1);
    extra_1.test_precalculatedLateralMove(-200, 4000);
    LevelHandler.startAllRolls(GameInfo.moverollFrequency, hitLimit.slow);
}
function drawNewEnemies_2_2() {
    GameInfo.enemyArray.push(new Troop(new Position(30, 50)), new ShotGun_Troop(new Position(40, 45)), new ShotGun_Troop(new Position(60, 55)), new Troop(new Position(85, 65)), new Troop(new Position(75, 35)));
    LevelHandler.startAllRolls(GameInfo.moverollFrequency, hitLimit.slow);
}
function drawNewEnemies_2_3() {
    GameInfo.enemyArray.push(new Imp(new Position(45, 40, 0.45), null, [new AnimationInfo("leftTo_60", '1.2s')]), new Imp(new Position(30, 40), null, [new AnimationInfo("leftTo_70", '2s'), new AnimationInfo("topTo_60", '2s'), new AnimationInfo("scaleTo_3", '2s')]), new Imp(new Position(40, 45)), new Imp(new Position(25, 55)), new Imp(new Position(16, 48), null, [new AnimationInfo("leftTo_0", '1.5s'), new AnimationInfo("topTo_60", '1.5s'), new AnimationInfo("scaleTo_1p6", '1.5s')]));
    LevelHandler.startAllRolls(GameInfo.moverollFrequency, hitLimit.slow);
}
function drawNewEnemies_2_4() {
    let t1 = new Troop(new Position(10, 28, 0.2));
    let t2 = new Troop(new Position(15, 28, 0.2));
    GameInfo.enemyArray.push(t1, t2, 
    // new Troop   (new Position(10,28, 0.2)),
    // new Troop   (new Position(15,28, 0.2)),
    new ShotGun_Troop(new Position(40, 48, 0.3)), new Troop(new Position(46, 48, 0.3)), new ShotGun_Troop(new Position(7, 55, 1)), new Troop(new Position(18, 60, 1.2)), new Troop(new Position(50, 53, 0.5)), new ShotGun_Troop(new Position(60, 53, 0.5)), new Troop(new Position(68, 53, 0.5)));
    t1.noRandomMovement = true;
    t2.noRandomMovement = true;
    LevelHandler.startAllRolls(GameInfo.moverollFrequency, hitLimit.slow);
}
function drawNewEnemies_2_5() {
    GameInfo.enemyArray.push(new Troop(new Position(5, 45)), new Troop(new Position(15, 50)), new Imp(new Position(20, 60)), new ShotGun_Troop(new Position(47, 27, 0.4)), new ShotGun_Troop(new Position(80, 27, 0.4)), new ShotGun_Troop(new Position(65, 45)), new Troop(new Position(60, 50)), new Troop(new Position(70, 30, 0.5)), new Imp(new Position(70, 45)), new Troop(new Position(85, 58)), new ShotGun_Troop(new Position(15, 18, 0.1), 15, [], specialEnemy.Extra));
    LevelHandler.startAllRolls(GameInfo.moverollFrequency, hitLimit.slow);
}
function drawNewEnemies_2_6() {
    GameInfo.bossTotalHealth = 350;
    GameInfo.enemyArray.push(new ChainGGuy(new Position(40, 35, 0.8), GameInfo.bossTotalHealth, [new AnimationInfo("scaleTo_1p8", '7s', 1)], specialEnemy.Boss));
    LevelHandler.startAllRolls(GameInfo.moverollFrequency, hitLimit.fast);
    resetBossBar();
}
function drawNewEnemies_3_1() {
    GameInfo.enemyArray.push(new ChainGGuy(new Position(5, 45)), new ShotGun_Troop(new Position(47, 27, 0.4)), new ShotGun_Troop(new Position(60, 50)), new ShotGun_Troop(new Position(65, 45)), new Troop(new Position(70, 30, 0.5)), new Troop(new Position(70, 45)), new ShotGun_Troop(new Position(80, 30, 0.3), 15, [], specialEnemy.Extra));
    LevelHandler.startAllRolls(GameInfo.moverollFrequency, hitLimit.slow);
}
function drawNewEnemies_3_2() {
    GameInfo.enemyArray.push(new ChainGGuy(new Position(5, 45)), new ChainGGuy(new Position(47, 27, 0.4)), new ChainGGuy(new Position(60, 50)), new ChainGGuy(new Position(65, 45)));
    LevelHandler.startAllRolls(GameInfo.moverollFrequency, hitLimit.slow);
}
function drawNewEnemies_3_3() {
    GameInfo.enemyArray.push(new Imp(new Position(5, 45)), new ChainGGuy(new Position(47, 27, 0.4)), new Imp(new Position(60, 50)), new Imp(new Position(65, 45)), new Imp(new Position(50, 50)), new Imp(new Position(45, 45)));
    LevelHandler.startAllRolls(GameInfo.moverollFrequency, hitLimit.slow);
}
function drawNewEnemies_3_4() {
    GameInfo.enemyArray.push(new SectorPatrol(new Position(5, 45)), new SectorPatrol(new Position(47, 27, 0.4)), new SectorPatrol(new Position(60, 50)), new SectorPatrol(new Position(65, 45)), new SectorPatrol(new Position(50, 50)), new SectorPatrol(new Position(45, 45)), new SectorPatrol(new Position(50, 50)), new SectorPatrol(new Position(45, 45)));
    LevelHandler.startAllRolls(GameInfo.moverollFrequency, hitLimit.Xfast);
}
function drawNewEnemies_3_5() {
    GameInfo.enemyArray.push(new Troop(new Position(5, 45)), new Troop(new Position(47, 27, 0.4)), new ShotGun_Troop(new Position(60, 50)), new ShotGun_Troop(new Position(65, 45)), new ShotGun_Troop(new Position(50, 50)), new Troop(new Position(45, 45)), new Troop(new Position(50, 50)), new Troop(new Position(45, 45)));
    LevelHandler.startAllRolls(GameInfo.moverollFrequency, hitLimit.Xfast);
}
function drawNewEnemies_3_6() {
    GameInfo.enemyArray.push(new ChainGGuy(new Position(5, 45)), new ChainGGuy(new Position(47, 27)), new ChainGGuy(new Position(60, 50)), new ChainGGuy(new Position(65, 45)), new ChainGGuy(new Position(50, 50)), new ChainGGuy(new Position(45, 45)));
    GameInfo.itemArray.push(new Item("barrel", new Position(52, 25), 40));
    LevelHandler.startAllRolls(GameInfo.moverollFrequency, hitLimit.slow);
}
function drawNewEnemies_3_7() {
    GameInfo.bossTotalHealth = 450;
    GameInfo.enemyArray.push(new ChainGGuy(GameInfo.bossTotalHealth, new Position(40, 35, 0.8), [new AnimationInfo("scaleTo_1p8", '7s', 1)], specialEnemy.Boss));
    LevelHandler.startAllRolls(GameInfo.moverollFrequency, hitLimit.fast);
    resetBossBar();
}
