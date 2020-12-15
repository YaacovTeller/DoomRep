//KEY SHORTCUTS
// Changing weapons
document.addEventListener('keydown', function (ev) {

    if (ev.key === "2") {
        if(weaponCheck(pistol)){
            pistol.switchTo();
        }
    }
    else if (ev.key === "1") {
        if (riotShieldDeployed == false && weaponCheck(chainsaw)){chainsaw.switchTo()}
    }
    else if (ev.key === "3") {
        if (riotShieldDeployed == false && weaponCheck(shotgun)){shotgun.switchTo()}
    }
    else if (ev.key === "4") {
        if (riotShieldDeployed == false && weaponCheck(dukemgun)){dukemgun.switchTo()}
    }
    else if (ev.key === "6") {
        if (riotShieldDeployed == false && weaponCheck(minigun)){minigun.switchTo()}
    }
    else if (ev.key === "7") {
        if (riotShieldDeployed == false && weaponCheck(duelneutron)){duelneutron.switchTo()}
    }
    else if (ev.key === " ") {
        shieldToggle()
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
        DOMUpdater.updateAmmoCounter(Player.weapon.ammo)
        click2.play()
    }
    else if (ev.key === "c") {
        clearAllEnemies();
    }
    else if (ev.key === "g") {
        godMode();
    }
    else if (ev.key === "k") {
        killAllEnemies();
    }
    else if (ev.key === "l") {
        levelCheck();
    }
})
function weaponCheck(weapon){
    return weapon !== Player.weapon;
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
