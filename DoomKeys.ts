//KEY SHORTCUTS
// Changing weapons
enum weaponOrder {
    null,
    ChainSaw,
    Pistol,
    Shotgun,
    DukeMgun,
    Minigun,
    DualNeutron,
    Pipebomb,
  //  Railgun
}
document.addEventListener("contextmenu", function(){
    if(Player.weapon instanceof MachineGun){
        debugger
        Player.weapon.stopstrafe();
    }
  });
document.addEventListener("wheel", (event) => 
{
    wheelWeapons(event.deltaY);
});

function wheelWeapons(deltaY) {
    let currentWeapon: string = Player.weapon.constructor.name;
    let currentNum: number = weaponOrder[currentWeapon];
    if (deltaY<0){
        for (let i = currentNum + 1; i <= 9; i++){
            checkForWeaponSwitch(i);
            break
        }
    }
    else {
        for (let i = currentNum - 1; i >= 0; i--){
            checkForWeaponSwitch(i);
            break
        }
    }
}
function checkForWeaponSwitch(num:number) {
    if(Player.weaponCollection[weaponOrder[num]]){
        weaponKey(weaponOrder[num]);
    }
}

document.addEventListener('keydown', function (ev) {

    if(weaponOrder[ev.key]){
        weaponKey(weaponOrder[ev.key]);
    }

    else if (ev.key === " ") {
        if (!Player.riotShieldDeployed){
            raiseShield()
        }
      //  shieldToggle()
    }
    else if (ev.key === "Escape") {
        if (elements.menu.style.display == "none") {
            openMenu()
            if (elements.credits.style.display == "block") {
                hideElement(elements.credits);
                UTcredits.stop();
            }
        }
        else closeMenu()
    }

    //CHEATS
    else if (ev.key === "e")
    {
        Player.weapon.ammo += 50;
        DOMUpdater.updateAmmoWithClick(Player.weapon.ammo)
    }
    else if (ev.key === "a")
    {
        for (let w in GameInfo.allGuns){
            Player.collectWeapon(GameInfo.allGuns[w])
        }
        click2.play()
    }
    else if (ev.key === "c") {
        clearAllEnemies(); // single scene
    }
    else if (ev.key === "g") {
        GameInfo.invincible = GameInfo.invincible == true ? false : true;
        elements.invincible.innerText = GameInfo.invincible == true ? "INVULNERABLE" : "";
    }
    else if (ev.key === "k") {
        killAllEnemies(true); // single scene
    }
    else if (ev.key === "l") {
        LevelHandler.sceneCheck();
    }
})

document.addEventListener('keyup', function (ev) {
    if (ev.key === " ") {
        lowerShield();
    }
});

function weaponCheck(weapon){
    return weapon !== Player.weapon;
}

function weaponKey(wepStr){
    let requestedWeapon: weaponry = Player.weaponCollection[wepStr];
    if(requestedWeapon && weaponCheck(requestedWeapon)){
        if (Player.riotShieldDeployed == false || wepStr == 'Pistol'){
            requestedWeapon.switchTo();
        }
        else {
            Player.slungWeapon = requestedWeapon;
        }
    }
}
// jQuerystuff
// var raiseShield = document.getElementById('riotShield').animate(
//     [
//       { transform: 'translate(-50%, -50%) scale(.5)' },
//       { transform: 'translate(-50%, -50%) scale(2)' }   
//     ], { 
//       duration: 8000, 
//       easing: 'ease-in-out', 
//       fill: 'both'
//     });
