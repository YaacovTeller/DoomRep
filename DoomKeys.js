"use strict";
//KEY SHORTCUTS
// Changing weapons
document.addEventListener('keydown', function (ev) {
    if (ev.key === "2") {
        weaponKey('Pistol');
    }
    else if (ev.key === "1") {
        weaponKey('ChainSaw');
    }
    else if (ev.key === "3") {
        weaponKey('Shotgun');
    }
    else if (ev.key === "4") {
        weaponKey('DukeMgun');
    }
    else if (ev.key === "6") {
        weaponKey('Minigun');
    }
    else if (ev.key === "7") {
        weaponKey('DualNeutron');
    }
    else if (ev.key === " ") {
        shieldToggle();
    }
    else if (ev.key === "Escape") {
        if (elements.menu.style.display == "none") {
            openMenu();
            if (elements.credits.style.display == "block") {
                hideElement(elements.credits);
                UTcredits.stop();
            }
        }
        else
            closeMenu();
    }
    //CHEATS
    else if (ev.key === "e") {
        Player.weapon.ammo += 50;
        DOMUpdater.updateAmmoWithClick(Player.weapon.ammo);
    }
    else if (ev.key === "a") {
        for (let w in GameInfo.allGuns) {
            Player.collectWeapon(GameInfo.allGuns[w]);
        }
        click2.play();
    }
    else if (ev.key === "c") {
        clearAllEnemies(); // single scene
    }
    else if (ev.key === "g") {
        GameInfo.invincible = GameInfo.invincible == true ? false : true;
    }
    else if (ev.key === "k") {
        killAllEnemies(); // single scene
    }
    else if (ev.key === "l") {
        LevelHandler.sceneCheck();
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
