"use strict";
//KEY SHORTCUTS
//כפתורים
// Changing weapons
// שינוי נשקים
document.addEventListener('keydown', function (ev) {
    if (ev.key === "2") {
        PlayerWeapon = pistol;
        PlayerWeapon.switchTo();
    }
    // מסור חשמלי
    else if (ev.key === "1") {
        PlayerWeapon = chainsaw;
        PlayerWeapon.switchTo();
    }
    else if (ev.key === "3") {
        PlayerWeapon = shotgun;
        PlayerWeapon.switchTo();
    }
    else if (ev.key === "4") {
        PlayerWeapon = minigun;
        PlayerWeapon.switchTo();
    }
    else if (ev.key === "6") {
        PlayerWeapon = dukemgun;
        PlayerWeapon.switchTo();
    }
    else if (ev.key === "7") {
        PlayerWeapon = duelneutron;
        PlayerWeapon.switchTo();
    }
    else if (ev.key === " ") {
        shieldToggle();
    }
    else if (ev.key === "Escape") {
        if (menu.style.display == "none") {
            openMenu();
            if (document.getElementById("CreditScreen").style.display == "block") {
                document.getElementById("CreditScreen").style.display = "none";
                UTcredits.stop();
            }
        }
        else
            closeMenu();
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
        target.deadCount++;
        document.getElementById("DCount").innerHTML = "Kills:" + target.deadCount;
        if (target.deadCount == 5 && target.deadCount < 10) {
            document.getElementById("exit1").style.display = "block";
        }
        else if (target.deadCount == 10) {
            document.getElementById("exit2").style.display = "block";
        }
        else if (target.deadCount == 15) {
            document.getElementById("exit3").style.display = "block";
        }
        else if (target.deadCount == 24) {
            document.getElementById("exit4").style.display = "block";
        }
    }
    // Clears all enemies
    else if (ev.key === "c") {
        var n_1;
        for (n_1 = 1; n_1 <= 21; n_1++) {
            document.getElementById("tgt" + n_1).style.display = "none";
        }
    }
});
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
