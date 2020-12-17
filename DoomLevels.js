"use strict";
//LEVELS
openMenu();
elements.weaponDiv.style.top = `${screen.height - 280}px`;
let n;
var level;
// // new instance of each weapon. Move?
// let chainsaw = new ChainSaw;
// let pistol = new Pistol;
// let shotgun = new Shotgun;
// let minigun = new Minigun;
// let dukemgun = new DukeMgun;
// let DualNeutron = new DualNeutron;
function beginGame() {
    Player.collectWeapon(new Pistol);
    startingValues();
    // startingAmmo();
    DOMUpdater.updateAmmoCounter(Player.weapon.ammo);
    gameBegun = true;
    if (music == true) {
        Deuscredits.play();
    }
    startTimer();
    elements.weaponDiv.style.top = `${screen.height - Player.weapon.scrnMargin}px`;
    lev1();
}
function lev1() {
    level = 1;
    // width: 150%; margin-left: -40%;
    elements.backImg.setAttribute("style", "width: 160%");
    elements.backImg.setAttribute("src", pics.background.wide);
    drawNewEnemies1();
}
function lev2() {
    level = 2;
    setTimeout(() => {
        elements.backImg.setAttribute("style", "animation-name: floatRight; animation-duration: 1s; animation-fill-mode: forwards; width: 160%");
        clearTargets();
    }, 300);
    setTimeout(function () {
        drawNewEnemies2();
    }, 700);
}
function lev3() {
    level = 3;
    genericLevel(pics.background.doom4, "width: 100%", () => drawNewEnemies3());
}
function lev4() {
    level = 4;
    genericLevel(pics.background.doom6, "", () => drawNewEnemies4());
}
function lev5() {
    level = 5;
    genericLevel(pics.background.doom1, "width: 100%; margin-top: -10%", () => drawNewEnemies5());
}
function genericLevel(background, attributes, enemyFunc) {
    setTimeout(function () {
        fadeOut();
        clearTargets();
    }, 500);
    setTimeout(function () {
        elements.backImg.setAttribute("src", background);
        if (attributes) {
            elements.backImg.setAttribute("style", attributes);
        }
        fadeIn();
    }, 1700);
    setTimeout(function () {
        enemyFunc();
    }, 3000);
}
function finalLev() {
    level = 6;
    clearTargets();
    fadeOut();
    setTimeout(function () {
        elements.backImg.setAttribute("style", "margin: 0px; width: 100%");
        elements.backImg.setAttribute("src", pics.background.boss);
        fadeIn();
    }, 1200);
    setTimeout(function () {
        RegEnemy.enemyArray = [];
        let boss = new Boss("ChainGuy", 200, new Position(40, 23, 1.8));
        RegEnemy.enemyArray.push(boss);
        boss.fillBar();
        elements.Bar.style.width = `${boss.health / 2}%`;
    }, 2000);
}
function drawNewEnemies1() {
    RegEnemy.enemyArray = [];
    RegEnemy.enemyArray.push(new Troop(30, new Position(10, 60), new AnimationInfo("move", '7s')), new Troop(20, new Position(20, 37)), new Troop(20, new Position(30, 60)), new ShotGGuy(30, new Position(50, 55)), new ShotGGuy(30, new Position(70, 30), new AnimationInfo("approach", '8s', '', 'alternate')), new Extra("TroopLeft" + "_Tomer", 10, new Position(70, 30, 0.6), new AnimationInfo("flee", '7s', '1')));
}
function drawNewEnemies2() {
    RegEnemy.enemyArray = [];
    RegEnemy.enemyArray.push(new Troop(20, new Position(30, 50)), new ShotGGuy(30, new Position(40, 45)), new ShotGGuy(30, new Position(60, 55)), new Troop(20, new Position(85, 65)), new Troop(20, new Position(75, 35)));
}
function drawNewEnemies3() {
    RegEnemy.enemyArray = [];
    RegEnemy.enemyArray.push(new Imp(30, new Position(10, 40), new AnimationInfo("move8", '4s')), new Imp(30, new Position(50, 40), new AnimationInfo("move9", '3s')), new Imp(30, new Position(40, 45)), new Imp(30, new Position(25, 55)), new Imp(30, new Position(16, 48), new AnimationInfo("move12", '4s')));
}
function drawNewEnemies4() {
    RegEnemy.enemyArray = [];
    RegEnemy.enemyArray.push(new Troop(10, new Position(10, 28, 0.2)), new Troop(10, new Position(15, 28, 0.2)), new ShotGGuy(30, new Position(40, 48, 0.3)), new Troop(10, new Position(46, 48, 0.3)), new ShotGGuy(30, new Position(7, 55, 1)), new Troop(10, new Position(18, 60, 1.2)), new Troop(10, new Position(50, 53, 0.5)), new ShotGGuy(30, new Position(60, 53, 0.5)), new Troop(10, new Position(68, 53, 0.5)));
}
function drawNewEnemies5() {
    RegEnemy.enemyArray = [];
    RegEnemy.enemyArray.push(new Troop(10, new Position(5, 45)), new Troop(10, new Position(15, 50)), new Imp(30, new Position(20, 60)), new ShotGGuy(30, new Position(47, 27, 0.4)), new Troop(10, new Position(60, 50)), new ShotGGuy(30, new Position(65, 45)), new Troop(10, new Position(70, 30, 0.5)), new Imp(30, new Position(70, 45)), new ShotGGuy(30, new Position(80, 27, 0.4)), new Troop(10, new Position(85, 58)), new Extra("ShotGGuy", 10, new Position(15, 18, 0.1)));
}
function clearTargets() {
    for (let enemy of RegEnemy.enemyArray) {
        enemy.undraw();
    }
}
