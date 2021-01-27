"use strict";
function level_1_1() {
    let scene = new Scene(pics.background.doom2, "width: 100%", () => drawNewEnemies_1_1(), 0, 0, 0, true);
    GameInfo.currentLevel.addScene(scene);
}
function level_1_2() {
    let scene = new Scene(pics.background.doom2, "width: 100%", () => drawNewEnemies_1_2());
    GameInfo.currentLevel.addScene(scene);
}
function level_1_3() {
    let scene = new Scene(pics.background.doom2, "width: 100%", () => drawNewEnemies_1_3());
    GameInfo.currentLevel.addScene(scene);
}
function level_1_4() {
    let scene = new Scene(pics.background.doom2, "width: 100%", () => drawNewEnemies_1_4());
    GameInfo.currentLevel.addScene(scene);
}
////////////////////////////////////////////////////
function level_2_1() {
    let scene = new Scene(pics.background.wide, "width: 160%", () => drawNewEnemies_2_1(), 0, 0, 0, true);
    GameInfo.currentLevel.addScene(scene);
}
function level_2_2() {
    GameInfo.currentLevel.sceneArray.length++; // FIX?
    setTimeout(() => {
        elements.backImg.setAttribute("style", "animation-name: floatRight; animation-duration: 1s; animation-fill-mode: forwards; width: 160%");
        DOMUpdater.timedClearAllImages();
    }, 300);
    setTimeout(function () {
        drawNewEnemies_2_2();
    }, 700);
}
function level_2_3() {
    let scene = new Scene(pics.background.doom4, "width: 100%", () => drawNewEnemies_2_3());
    GameInfo.currentScene = scene;
    GameInfo.currentLevel.addScene(scene);
}
function level_2_4() {
    let scene = new Scene(pics.background.doom6, "", () => drawNewEnemies_2_4());
    GameInfo.currentScene = scene;
    GameInfo.currentLevel.addScene(scene);
}
function level_2_5() {
    let scene = new Scene(pics.background.doom1, "width: 100%; margin-top: -10%", () => drawNewEnemies_2_5());
    GameInfo.currentScene = scene;
    GameInfo.currentLevel.addScene(scene);
}
function level_2_6() {
    let scene = new Scene(pics.background.boss, "width: 100%; margin: 0%", () => drawNewEnemies_2_6());
    GameInfo.currentScene = scene;
    GameInfo.currentLevel.addScene(scene);
    //     boss.DOMImage.classList.add("fillModeForwards");
}
///////////////////////////////////////////////////////////////
function level_3_1() {
    let scene = new Scene(pics.background.doom4, "width: 100%", () => drawNewEnemies_3_1(), 0, 0, 0, true);
    GameInfo.currentLevel.addScene(scene);
}
function level_3_2() {
    let scene = new Scene(pics.background.doom5, "width: 100%", () => drawNewEnemies_3_2());
    GameInfo.currentLevel.addScene(scene);
}
function level_3_3() {
    let scene = new Scene(pics.background.doom6, "width: 100%", () => drawNewEnemies_3_3());
    GameInfo.currentLevel.addScene(scene);
}
function level_3_4() {
    let scene = new Scene(pics.background.doom4, "width: 100%", () => drawNewEnemies_3_4());
    GameInfo.currentLevel.addScene(scene);
}
function level_3_5() {
    let scene = new Scene(pics.background.doom3, "width: 100%", () => drawNewEnemies_3_5());
    GameInfo.currentLevel.addScene(scene);
}
function level_3_6() {
    let scene = new Scene(pics.background.doom2, "width: 100%", () => drawNewEnemies_3_6());
    GameInfo.currentLevel.addScene(scene);
}
