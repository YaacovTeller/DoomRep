//KEY SHORTCUTS
//כפתורים
// Changing weapons
// שינוי נשקים
document.addEventListener('keydown', function (ev) {

    if (ev.key === "2") {
        pistol.switchTo()
    }
    // מסור חשמלי
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
        if (elementObj.menu.style.display == "none") {
            openMenu()
            if (document.getElementById("CreditScreen").style.display == "block") {
                document.getElementById("CreditScreen").style.display = "none";
                UTcredits.stop();
            }
        }
        else closeMenu()
    }
    // CHEATS - For checking the game stages
    // לבדיקת שלבי המשחק
    else if (ev.key === "e") //&& "..." > 1) 
    {
        document.getElementById("exit2").style.display = "block";
    }
    else if (ev.key === "w") {
        document.getElementById("exit3").style.display = "block";
    }
    else if (ev.key === "q") {
        document.getElementById("exit4").style.display = "block";
    }
    else if (ev.key === "k") {

        target.deadCount++; document.getElementById("DCount").innerHTML = `Kills:${target.deadCount}`;
        if (target.deadCount == 5 && target.deadCount < 10) {
            document.getElementById("exit1").style.display = "block";
        }
        else if (target.deadCount == 10) { document.getElementById("exit2").style.display = "block"; }
        else if (target.deadCount == 15) { document.getElementById("exit3").style.display = "block"; }
        else if (target.deadCount == 24) { document.getElementById("exit4").style.display = "block"; }
    }
    // Clears all enemies
    else if (ev.key === "c") {
        let n: number
        for (n = 1; n <= 21; n++) {
            document.getElementById(`tgt${n}`).style.display = "none";
        }
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
