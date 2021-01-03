/////// MAIN MENU OPEN ////////
openMenu() // MOVE?

function preLevel_scene1(){
    let scene = new Scene(pics.background.doom2,"width: 100%", ()=>drawNewEnemies_pre_1(), 0, 0, 0, true)
   GameInfo.currentLevel.addScene(scene)
}
function preLevel_scene2(){
    let scene = new Scene(pics.background.doom2,"width: 100%", ()=>drawNewEnemies_pre_2())
   GameInfo.currentLevel.addScene(scene)
}
function preLevel_scene3(){
    let scene = new Scene(pics.background.doom2,"width: 100%", ()=>drawNewEnemies_pre_3())
   GameInfo.currentLevel.addScene(scene)
}

function scene1() {
   let scene = new Scene(pics.background.wide,"width: 160%", ()=>drawNewEnemies1(), 0, 0, 0, true)
   GameInfo.currentLevel.addScene(scene)
}

function scene2() {
    GameInfo.currentLevel.sceneArray.length++ // FIX?
    setTimeout(()=>{
        elements.backImg.setAttribute("style", "animation-name: floatRight; animation-duration: 1s; animation-fill-mode: forwards; width: 160%");
        DOMUpdater.timedClearAllImages();
    },300)

    setTimeout(function () {
        drawNewEnemies2();
     }, 700);
}

function scene3(){
    let scene = new Scene(pics.background.doom4,"width: 100%", ()=>drawNewEnemies3());
    GameInfo.currentScene = scene;
    GameInfo.currentLevel.addScene(scene);
}

function scene4(){
    let scene = new Scene(pics.background.doom6,"", ()=>drawNewEnemies4())
    GameInfo.currentScene = scene;
    GameInfo.currentLevel.addScene(scene);
}

function scene5(){
    let scene = new Scene(pics.background.doom1,"width: 100%; margin-top: -10%", ()=>drawNewEnemies5())
    GameInfo.currentScene = scene;
    GameInfo.currentLevel.addScene(scene);
}

function finalLev() {
    GameInfo.currentLevel.sceneArray.length++ // FIX?
    DOMUpdater.timedClearAllImages();
    fadeOut();

    setTimeout(function () {
        elements.backImg.setAttribute("style", "margin: 0px; width: 100%");
        elements.backImg.setAttribute("src", pics.background.boss);
        fadeIn()
    }, 1200);

    setTimeout(function () {
        GameInfo.bossTotalHealth = 350;
        let boss = new ChainGGuy(GameInfo.bossTotalHealth, new Position(40,35, 0.8), [new AnimationInfo("scaleTo_1p8",'7s',1)], true)
        boss.DOMImage.classList.add("fillModeForwards");
        GameInfo.enemyArray.push(
            boss
        )
        LevelHandler.startAllRolls(GameInfo.moverollFrequency);
        showElement(elements.Bar);
        elements.Bar.style.width = `100%`;
    }, 2000);
}

