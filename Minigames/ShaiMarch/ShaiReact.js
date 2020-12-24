"use strict";
//SOUND
// function sound(src) {
//     this.sound = document.createElement("audio");
//     this.sound.src = src;
//     this.sound.setAttribute("preload", "auto");
//     this.sound.setAttribute("controls", "none");
//     this.sound.style.display = "none";
//     document.body.appendChild(this.sound);
//     this.play = function () {
//         this.sound.play();
//     }
//     this.stop = function () {
//         this.sound.pause();
//     }
// }
var clang = new sound("ShaiPics/clang.WAV");
var pop = new sound("ShaiPics/Pop.WAV");
var squeek = new sound("ShaiPics/squeek.WAV");
var squeek2 = new sound("ShaiPics/squeek2.mp3");
var woof = new sound("ShaiPics/woof.mp3");
var beep = new sound("ShaiPics/beep.mp3");
//HAND
/*
function handMove(e) {
    var scrnMargin
    var gunHeight
    var gunDefaultY
    scrnMargin = 280; gunHeight = 390;
    var Screen: number = screen.height;
    var x = e.pageX;
    var y = e.pageY;
    var cX, cY;
    cX = `${x - 44}px`;

   if (y > (Screen - gunHeight)) { cY = `${y + 110}px` } else cY = `${Screen - scrnMargin}px`;

    document.getElementById("hand").style.left = cX;
    document.getElementById("hand").style.top = cY;
}*/
function tap(e) {
    var x = e.pageX;
    var y = e.pageY;
    //   beep.play()
}
//SHAIS
var n;
var i;
var shaiCounter = 0;
var slai;
function stop1(n) {
    shaiCounter++;
    slai = document.getElementById(`shai${n}`);
    slai.style.animationPlayState = "paused";
    slai.style.pointerEvents = "none";
    slai.setAttribute("src", "ShaiPics/ShaiStand.png" + "?a=" + Math.random());
    if (n % 2 == 0) {
        squeek2.play();
    }
    else
        woof.play();
    if (shaiCounter == 10) {
        reverse();
        shaiCounter = 0;
    }
}
function reverse() {
    for (n = 1; n <= 10; n++) {
        slai = document.getElementById(`shai${n}`);
        slai.style.animationPlayState = "running";
        slai.setAttribute("src", "ShaiPics/ShaiSmall.gif" + "?a=" + Math.random());
        slai.style.pointerEvents = "initial";
    }
    window.alert("You would halt the marching Shais?? Try and stop the moonwalking Shais!!");
}
