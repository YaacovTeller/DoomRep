//KEY SHORTCUTS
// Changing weapons
document.addEventListener('keydown', function (ev) {

    if (ev.key === "2") {
        pistol.switchTo()
    }
    else if (ev.key === "1") {
        if (riotShieldDeployed == false){chainsaw.switchTo()}
    }
    else if (ev.key === "3") {
        if (riotShieldDeployed == false){shotgun.switchTo()}
    }
    else if (ev.key === "4") {
        if (riotShieldDeployed == false){dukemgun.switchTo()}
    }
    else if (ev.key === "6") {
        if (riotShieldDeployed == false){minigun.switchTo()}
    }
    else if (ev.key === "7") {
        if (riotShieldDeployed == false){duelneutron.switchTo()}
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
    else if (ev.key === "e")
    {
        PlayerWeapon.ammo += 50;
        DOMUpdater.updateAmmoCounter(PlayerWeapon.ammo)
        click2.play()
    }
    // CHEATS - For checking the game stages // DEPRECATED
    // else if (ev.key === "e") //&& "..." > 1) 
    // {
    //     document.getElementById("exit2").style.display = "block";
    // }

    // Clears all enemies
    else if (ev.key === "c") {
        clearAllEnemies();
    }
})
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
