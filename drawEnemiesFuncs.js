"use strict";
function drawNewEnemies_pre_1() {
    GameInfo.enemyArray.push(new SectorPatrol(20, new Position(30, 45)), new SectorPatrol(20, new Position(50, 50)));
    LevelHandler.startAllRolls(GameInfo.moverollFrequency);
}
function drawNewEnemies_pre_2() {
    GameInfo.enemyArray.push(new SectorPatrol(20, new Position(60, 45)), new SectorPatrol(20, new Position(70, 50)), new SectorPatrol(20, new Position(30, 60)));
    LevelHandler.startAllRolls(GameInfo.moverollFrequency);
}
function drawNewEnemies_pre_3() {
    GameInfo.enemyArray.push(new Extra("SectorPatrol", 10, new Position(50, 25, 0.2)), new SectorPatrol(20, new Position(10, 65)), new SectorPatrol(20, new Position(50, 40)), new SectorPatrol(20, new Position(0, 50)), new SectorPatrol(20, new Position(20, 45)));
    new Item("barrel", 40, new Position(52, 25));
    LevelHandler.startAllRolls(GameInfo.moverollFrequency);
}
function drawNewEnemies1() {
    GameInfo.enemyArray.push(new Troop(30, new Position(0, 30, 0.6), [new AnimationInfo("topTo_60", '3s'), new AnimationInfo("scaleTo_1", '3s'),]), //new AnimationInfo("leftTo_10",'2s')
    new Troop(20, new Position(20, 37)), new Troop(20, new Position(30, 60)), new ShotGun_Troop(30, new Position(50, 55)), new ShotGun_Troop(30, new Position(70, 30), [new AnimationInfo("scaleTo_1", '4s', '1')]), new Extra("TroopLeft", 10, new Position(100, 30, 0.6), [new AnimationInfo("fleeLeft", '7s', '1')]));
    LevelHandler.startAllRolls(GameInfo.moverollFrequency);
}
function drawNewEnemies2() {
    GameInfo.enemyArray.push(new Troop(20, new Position(30, 50)), new ShotGun_Troop(30, new Position(40, 45)), new ShotGun_Troop(30, new Position(60, 55)), new Troop(20, new Position(85, 65)), new Troop(20, new Position(75, 35)));
    LevelHandler.startAllRolls(GameInfo.moverollFrequency);
}
function drawNewEnemies3() {
    GameInfo.enemyArray.push(new Imp(30, new Position(45, 40, 0.45), [new AnimationInfo("leftTo_60", '1.2s')]), new Imp(30, new Position(30, 40), [new AnimationInfo("leftTo_70", '2s'), new AnimationInfo("topTo_60", '2s'), new AnimationInfo("scaleTo_3", '2s')]), new Imp(30, new Position(40, 45)), new Imp(30, new Position(25, 55)), new Imp(30, new Position(16, 48), [new AnimationInfo("leftTo_0", '1.5s'), new AnimationInfo("topTo_60", '1.5s'), new AnimationInfo("scaleTo_1p6", '1.5s')]));
    LevelHandler.startAllRolls(GameInfo.moverollFrequency);
}
function drawNewEnemies4() {
    GameInfo.enemyArray.push(new Troop(10, new Position(10, 28, 0.2)), new Troop(10, new Position(15, 28, 0.2)), new ShotGun_Troop(30, new Position(40, 48, 0.3)), new Troop(10, new Position(46, 48, 0.3)), new ShotGun_Troop(30, new Position(7, 55, 1)), new Troop(10, new Position(18, 60, 1.2)), new Troop(10, new Position(50, 53, 0.5)), new ShotGun_Troop(30, new Position(60, 53, 0.5)), new Troop(10, new Position(68, 53, 0.5)));
    LevelHandler.startAllRolls(GameInfo.moverollFrequency);
}
function drawNewEnemies5() {
    GameInfo.enemyArray.push(new Troop(10, new Position(5, 45)), new Troop(10, new Position(15, 50)), new Imp(30, new Position(20, 60)), new ShotGun_Troop(30, new Position(47, 27, 0.4)), new Troop(10, new Position(60, 50)), new ShotGun_Troop(30, new Position(65, 45)), new Troop(10, new Position(70, 30, 0.5)), new Imp(30, new Position(70, 45)), new ShotGun_Troop(30, new Position(80, 27, 0.4)), new Troop(10, new Position(85, 58)), new Extra("ShotGun_Troop", 10, new Position(15, 18, 0.1)));
    LevelHandler.startAllRolls(GameInfo.moverollFrequency);
}
