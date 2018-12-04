"use strict";
//SOUNDS - Guns and creatures
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    //   this.sound.setAttribute("loop", "infinite");  For a sort of macabre doom-rap experience
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    };
    this.stop = function () {
        this.sound.pause();
    };
}
var Pshot = new sound("Pics/DoomRaw/DSPISTOL.WAV");
var SGshot = new sound("Pics/DoomRaw/DSSHOTGN.WAV");
var MGun = new sound("Pics/DoomRaw/MachineGun.mp3");
var SawUp = new sound("Pics/DoomRaw/DSSAWUP.WAV");
var Saw = new sound("Pics/DoomRaw/DSSAWFUL.WAV");
var ded = new sound("Pics/DoomRaw/DSDMPAIN.WAV");
var ded2 = new sound("Pics/DoomRaw/DSPODTH3.WAV");
var bossDed = new sound("Pics/DoomRaw/DSBRSDTH.WAV");
//WEAPON
var w = 2;
var num;
var scrnMargin;
var gunHeight;
var gunDefaultY;
function gunMove(e) {
    if (w == 2) {
        scrnMargin = 280;
        gunHeight = 390;
    }
    else if (w == 3) {
        scrnMargin = 230;
        gunHeight = 350;
    }
    else if (w == 1) {
        scrnMargin = 305;
        gunHeight = 415;
    }
    else if (w == 0) {
        scrnMargin = 210;
        gunHeight = 220;
    }
    else if (w == 7) {
        scrnMargin = 250;
        gunHeight = 360;
    }
    else if (w == 7.1) {
        scrnMargin = 300;
        gunHeight = 390;
    }
    var Screen = screen.height;
    var x = e.pageX;
    var y = e.pageY;
    var cX, cY;
    cX = x - 44 + "px";
    /*cY*/ if (y > (Screen - gunHeight)) {
        cY = y + 110 + "px";
    }
    else
        cY = Screen - scrnMargin + "px";
    document.getElementById("wep").style.left = cX;
    document.getElementById("wep").style.top = cY;
}
function strafeHit() {
    setInterval(function () { shot(event); }, 200);
}
var oneshot = document.getElementById("shot");
function strafe() {
    if (w == 4) {
        w = 4.1;
        document.getElementById("weppic").setAttribute("src", "Pics/ChainGunFiring150_15.gif");
    }
    else if (w == 7) {
        w = 7.1;
        document.getElementById("weppic").setAttribute("src", "Pics/DN110.gif");
    }
    document.body.setAttribute("onmousemove", "MGunShotDisplay(event),gunMove(event)");
    MGun.sound.setAttribute("loop", "infinite");
    MGun.play();
}
function MGunShotDisplay(e) {
    var x = e.pageX;
    var y = e.pageY;
    oneshot.style.display = "block";
    oneshot.style.left = x - 50 + "px";
    oneshot.style.top = y - 50 + "px";
    function noShot() { oneshot.style.display = "none"; }
    setTimeout(noShot, 10);
}
function stopstrafe() {
    if (w == 4.1) {
        w = 4;
        num = Math.floor(Math.random() * (2 - 1 + 1) + 1);
        if (num == 1) {
            document.getElementById("weppic").setAttribute("src", "Pics/ChainGun150.png");
        }
        else
            document.getElementById("weppic").setAttribute("src", "Pics/ChainGun150_Alt.png");
    }
    else if (w == 7.1) {
        w = 7;
        document.getElementById("weppic").setAttribute("src", "Pics/DN.png");
    }
    MGun.stop();
    document.body.setAttribute("onmousemove", "gunMove(event)");
}
var sawing;
function sawHit() {
}
function saw() {
    w = 0;
    document.getElementById("weppic").setAttribute("src", "Pics/Saw.png");
    sawing = setInterval(function () { Saw.play(); }, 200);
}
function sawUp() {
    w = 1;
    document.getElementById("weppic").setAttribute("src", "Pics/ChainSaw.gif");
    clearInterval(sawing);
    Saw.stop();
}
function shot(e) {
    var x = e.pageX;
    var y = e.pageY;
    if (w == 2) {
        Pshot.play();
    }
    else if (w == 3) {
        SGshot.play();
    }
    else if (w == 1) {
    }
    else if (w == 7) {
        Pshot.play();
    }
    ;
    oneshot.style.display = "block";
    oneshot.style.left = x - 50 + "px";
    oneshot.style.top = y - 50 + "px";
    function noShot() { oneshot.style.display = "none"; }
    setTimeout(noShot, 100);
}
//Should work w/o reloading gif
//function reviveTheDead() {
//    this.src = "";
//    this.src = "pics/Troop_Death.gif";
//}
//TheQuickAndTheDead
var extra = 0;
var mghit;
var hitTarget;
var hitImage;
var target = /** @class */ (function () {
    function target(num, enemy, health) {
        this.health = health;
        this.num = num;
        this.enemy = enemy;
        this.draw();
    }
    target.prototype.draw = function () {
        target.objectCount++;
        document.getElementById("targetBackdrop").innerHTML +=
            "<img id = \"tgt" + this.num + "\" class=\"target\" onmousedown = \"tgt" + this.num + ".loseHealth()\" onmouseenter = \"tgt" + this.num + ".MGhit()\" onmouseleave = \"tgt" + this.num + ".MGhitEnd()\"  src=\"pics/" + this.enemy + ".gif\" draggable = \"false\" >";
    };
    target.prototype.redraw = function () {
        hitImage = document.getElementById("tgt" + hitTarget.num);
        hitImage.setAttribute("src", "pics/" + hitTarget.enemy + ".gif");
    };
    target.prototype.loseHealth = function () {
        if (w == 2) {
            this.health -= 10;
        }
        else if (w == 3 || w == 1 || w == 4 || w == 7 || w == 4.1 || w == 7.1) {
            this.health -= 30;
        }
        hitTarget = this;
        hitImage = document.getElementById("tgt" + this.num);
        hitImage.setAttribute("src", "pics/" + this.enemy + "_Hurt.png");
        if (this.health <= 0) {
            this.die();
        }
        else
            setTimeout(hitTarget.redraw, 200);
    };
    target.prototype.MGhit = function () {
        if (w == 7.1 || w == 4.1) {
            var hitTarget = this;
            mghit = (setInterval(function () { hitTarget.loseHealth(); }, 100));
            //   if (hitTarget.health <= 0) { clearInterval(mghit) }
        }
    };
    target.prototype.MGhitEnd = function () {
        clearInterval(mghit);
    };
    target.prototype.die = function () {
        this.body = document.getElementById("tgt" + this.num);
        this.body.style.animationPlayState = "paused";
        this.body.setAttribute("src", "pics/" + this.enemy + "_Dead.gif" + "?a=" + Math.random());
        this.body.style.pointerEvents = "none";
        if (this.enemy == "Troop") {
            ded2.play();
        }
        else if (this.enemy == "SGunG") {
            ded.play();
        }
        else if (this.enemy == "Imp") {
            ded.play();
        }
        else if (this.enemy == "ChainGuy") {
            bossDie();
        }
        target.deadCount++;
        document.getElementById("DCount").innerHTML = "Kills:" + (target.deadCount + extra);
        levelCheck();
    };
    target.deadCount = 0;
    target.objectCount = 0;
    return target;
}());
document.getElementById("DCount").innerHTML += "" + target.deadCount;
function levelCheck() {
    if (target.deadCount == 5) {
        document.getElementById("exit1").style.display = "block";
    }
    else if (target.deadCount == 10) {
        document.getElementById("exit2").style.display = "block";
        document.getElementById("exit1").style.display = "none";
    }
    else if (target.deadCount == 15) {
        document.getElementById("exit3").style.display = "block";
        document.getElementById("exit2").style.display = "none";
    }
    else if (target.deadCount == 24) {
        document.getElementById("exit4").style.display = "block";
        document.getElementById("exit3").style.display = "none";
    }
}
//The boss must become a target class!
//<img id="Boss1" class="target" onclick="BossHit()" src="pics/ChainGuy.gif" draggable="false">
var Bar = document.getElementById("BossBar1");
function bossDie() {
    var Boss = document.getElementById("tgt22");
    bossDed.play();
    Bar.style.width = "0%";
    Boss.removeAttribute("onclick");
    document.getElementById("DCount").innerHTML = "Kills:" + (target.deadCount + extra);
    stopTimer();
    document.getElementById("fin").innerHTML = "Completed in " + m + " minutes, " + s + " seconds and " + ss + " split seconds!";
}
// let BossHealth: number = 200
// let Bar = document.getElementById("BossBar1")
// Bar.style.width = `${BossHealth / 2}%`;
// function BossHit() {
//     let Boss = document.getElementById("Boss1")
//     var healthUnit: number;
//     if (w == 2) { healthUnit = 10 }
//     else if (w == 3 || w == 4 || w == 7) { healthUnit = 30 }
//     else if (w <= 1) { healthUnit = 20 }
//     BossHealth -= healthUnit; document.getElementById("BossBar1").style.width = `${BossHealth / 2}%`;
//     if (BossHealth <= 0) {
//         Bar.style.width = `0%`;
//         Boss.setAttribute("src", "pics/ChainGuy_DeadEd.gif");
//         Boss.style.left = "39%";
//         bossDed.play();
//         Boss.removeAttribute("onclick");
//         target.deadCount++
//         document.getElementById("DCount").innerHTML = `Kills:${target.deadCount + extra}`;
//         stopTimer()
//         document.getElementById("fin").innerHTML = `Completed in ${m} minutes, ${s} seconds and ${ss} split seconds!`
//     }
// }
//SHORTCUTS
document.addEventListener('keydown', function (ev) {
    if (ev.key === "e") //&& "..." > 1) 
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
    else if (ev.key === "c") {
        var n_1;
        for (n_1 = 1; n_1 <= 21; n_1++) {
            document.getElementById("tgt" + n_1).style.display = "none";
        }
    }
    else if (ev.key === "3") {
        w = 3;
        document.getElementById("weppic").setAttribute("src", "Pics/Ggun2.png");
        document.body.removeAttribute("onmousedown");
        document.body.removeAttribute("onmouseup");
        document.body.setAttribute("onclick", "shot(event)");
    }
    else if (ev.key === "4") {
        w = 4;
        document.getElementById("weppic").setAttribute("src", "Pics/ChainGun150.png");
        document.body.setAttribute("onmousedown", "strafe()");
        document.body.setAttribute("onmouseup", "stopstrafe()");
        document.body.removeAttribute("onclick");
    }
    else if (ev.key === "7") {
        w = 7;
        document.getElementById("weppic").setAttribute("src", "Pics/DN.png");
        document.body.setAttribute("onmousedown", "strafe()");
        document.body.setAttribute("onmouseup", "stopstrafe()");
        document.body.removeAttribute("onclick");
    }
    else if (ev.key === "2") {
        w = 2;
        document.getElementById("weppic").setAttribute("src", "Pics/gun2.png");
        document.body.setAttribute("onmousedown", "");
        document.body.setAttribute("onmouseup", "");
        document.body.setAttribute("onclick", "shot(event)");
    }
    else if (ev.key === "1") {
        w = 1;
        document.getElementById("weppic").setAttribute("src", "Pics/ChainSaw.gif");
        SawUp.play();
        document.body.setAttribute("onmousedown", "saw()");
        document.body.setAttribute("onmouseup", "sawUp()");
        document.body.removeAttribute("onclick");
    }
    else if (ev.key === "Escape") {
        if (menu.style.display == "none") {
            openMenu();
        }
        else
            closeMenu();
    }
});
function openMenu() {
    menu.style.display = "block";
    clearInterval(time);
    stopTimer();
}
function closeMenu() {
    menu.style.display = "none";
    startTimer();
}
var menu = document.getElementById("menu");
//JAKE-FADING has been made obselete!
//Instead, ADD CSS FADING, it's that simple.
function fadeOut() {
    var f = document.getElementById("BackImg1");
    f.setAttribute("style", "animation-name: fadeOut; animation-duration: 2s; width: 100%");
}
function fadeIn() {
    var f = document.getElementById("BackImg1");
    f.setAttribute("style", "animation-name: fadeIn; animation-duration: 2s; width: 100%");
}
//LEVELS
openMenu();
var n;
var tgt1, tgt2, tgt3, tgt4, tgt5, tgt6, tgt7, tgt8, tgt9, tgt10, tgt11, tgt12, tgt13, tgt14, tgt15, tgt16, tgt17, tgt18, tgt19, tgt20, tgt21, tgt22, tgt23, tgt24, tgt25;
var tgt22;
function lev1() {
    document.getElementById("BackImg1").setAttribute("src", "Pics/WideBack.jpg");
    tgt1 = new target(1, "Troop", 70);
    tgt2 = new target(2, "Troop", 70);
    tgt3 = new target(3, "Troop", 70);
    tgt4 = new target(4, "SGunG", 20);
    tgt5 = new target(5, "SGunG", 20);
}
function lev2() {
    document.getElementById("tgt1").style.display = "none";
    document.getElementById("tgt2").style.display = "none";
    document.getElementById("tgt3").setAttribute("src", "pics/Troop.gif");
    document.getElementById("tgt3").style.pointerEvents = "auto";
    document.getElementById("tgt4").setAttribute("src", "pics/SGunG.gif");
    document.getElementById("tgt4").style.pointerEvents = "auto";
    document.getElementById("tgt5").setAttribute("src", "pics/SGunG.gif");
    document.getElementById("tgt5").style.pointerEvents = "auto";
    tgt6 = new target(6, "Troop", 10);
    tgt7 = new target(7, "Troop", 10);
    document.getElementById("BackImg1").style.cssFloat = "right";
    document.getElementById("exit1").style.display = "none";
}
function lev3() {
    for (n = 1; n <= 2; n++) {
        document.getElementById("exit" + n).style.display = "none";
    }
    document.getElementById("BackImg1").setAttribute("src", "Pics/Doom4.png");
    document.getElementById("BackImg1").style.width = "100%";
    for (n = 1; n <= target.objectCount; n++) {
        document.getElementById("tgt" + n).style.display = "none";
    }
    tgt8 = new target(8, "Imp", 30);
    tgt9 = new target(9, "Imp", 30);
    tgt10 = new target(10, "Imp", 30);
    tgt11 = new target(11, "Imp", 30);
    tgt12 = new target(12, "Imp", 30);
}
function lev4() {
    for (n = 1; n <= 3; n++) {
        document.getElementById("exit" + n).style.display = "none";
    }
    document.getElementById("BackImg1").setAttribute("src", "Pics/Doom6.png");
    document.getElementById("BackImg1").style.width = "100%";
    for (n = 1; n <= target.objectCount; n++) {
        document.getElementById("tgt" + n).style.display = "none";
    }
    tgt13 = new target(13, "Troop", 10);
    tgt14 = new target(14, "Troop", 10);
    tgt15 = new target(15, "SGunG", 30);
    tgt16 = new target(16, "Troop", 10);
    tgt17 = new target(17, "SGunG", 30);
    tgt18 = new target(18, "Troop", 10);
    tgt19 = new target(19, "Troop", 10);
    tgt20 = new target(20, "SGunG", 30);
    tgt21 = new target(21, "Troop", 10);
}
function lev5() {
    for (n = 1; n <= 4; n++) {
        document.getElementById("exit" + n).style.display = "none";
    }
    for (n = 1; n <= target.objectCount; n++) {
        document.getElementById("tgt" + n).style.display = "none";
    }
    fadeOut();
    setTimeout(function () {
        document.getElementById("BackImg1").setAttribute("src", "Pics/BossBack.jpg");
        fadeIn();
    }, 1200);
    setTimeout(function () {
        tgt22 = new target(22, "ChainGuy", 200);
        Bar.style.display = "block";
        Bar.style.width = tgt22.health / 2 + "%";
    }, 2500);
}
