"use strict";
//KEY SHORTCUTS
// Changing weapons
var weaponOrder;
(function (weaponOrder) {
    weaponOrder[weaponOrder["null"] = 0] = "null";
    weaponOrder[weaponOrder["ChainSaw"] = 1] = "ChainSaw";
    weaponOrder[weaponOrder["Pistol"] = 2] = "Pistol";
    weaponOrder[weaponOrder["Shotgun"] = 3] = "Shotgun";
    weaponOrder[weaponOrder["DukeMgun"] = 4] = "DukeMgun";
    weaponOrder[weaponOrder["Minigun"] = 5] = "Minigun";
    weaponOrder[weaponOrder["DualNeutron"] = 6] = "DualNeutron";
    weaponOrder[weaponOrder["Pipebomb"] = 7] = "Pipebomb";
    //  Railgun
})(weaponOrder || (weaponOrder = {}));
document.addEventListener("contextmenu", function () {
    if (Player.weapon instanceof MachineGun) {
        debugger;
        Player.weapon.stopstrafe();
    }
});
document.addEventListener("wheel", (event) => {
    wheelWeapons(event.deltaY);
});
function wheelWeapons(deltaY) {
    let currentWeapon = Player.weapon.constructor.name;
    let currentNum = weaponOrder[currentWeapon];
    if (deltaY < 0) {
        for (let i = currentNum + 1; i <= 9; i++) {
            checkForWeaponSwitch(i);
            break;
        }
    }
    else {
        for (let i = currentNum - 1; i >= 0; i--) {
            checkForWeaponSwitch(i);
            break;
        }
    }
}
function checkForWeaponSwitch(num) {
    if (Player.weaponCollection[weaponOrder[num]]) {
        weaponKey(weaponOrder[num]);
    }
}
document.addEventListener('keydown', function (ev) {
    if (ev.key === "escape") {
        openMenu();
        ///
    }
    //CHEATS
    if (ev.key === "e") {
        Player.weapon.ammo += 50;
        DOMUpdater.updateAmmoWithClick(Player.weapon.ammo);
    }
    else if (ev.key === "a") {
        for (let w in GameInfo.allGuns) {
            Player.collectWeapon(GameInfo.allGuns[w]);
        }
        click2.play();
    }
    // else if (ev.key === "c") {
    //     clearAllEnemies(); // single scene
    // }
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
});
document.addEventListener('keyup', function (ev) {
    if (ev.key === " ") {
        lowerShield();
    }
});
function weaponCheck(weapon) {
    return weapon !== Player.weapon;
}
function weaponKey(wepStr) {
    let requestedWeapon = Player.weaponCollection[wepStr];
    if (requestedWeapon && weaponCheck(requestedWeapon)) {
        if (Player.riotShieldDeployed == false || wepStr == 'Pistol') {
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
