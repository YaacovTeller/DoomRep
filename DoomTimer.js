"use strict";
//TIMER
var timerObj = {
    m: 0,
    s: 0,
    ss: 0,
    strM: "",
    strS: "",
    strSS: "",
    blankTimerStr: "00:00:00",
    elem: document.getElementById("timer"),
    timeInterval: null,
};
function startTimer() {
    timerObj.timeInterval = setInterval(function () {
        timerObj.ss++;
        if (timerObj.ss == 99) {
            timerObj.ss = 0;
            timerObj.s++;
        }
        if (timerObj.s == 59) {
            timerObj.s = 0;
            timerObj.m++;
        }
        if (timerObj.m < 10) {
            timerObj.strM = "0" + timerObj.m;
        }
        else
            timerObj.strM = timerObj.m.toString();
        if (timerObj.s < 10) {
            timerObj.strS = "0" + timerObj.s;
        }
        else
            timerObj.strS = timerObj.s.toString();
        if (timerObj.ss < 10) {
            timerObj.strSS = "0" + timerObj.ss;
        }
        else
            timerObj.strSS = timerObj.ss.toString();
        timerObj.elem.innerHTML = getTime();
    }, 10);
}
function stopTimer() {
    clearInterval(timerObj.timeInterval);
}
function getTime() {
    return timerObj.strM + ":" + timerObj.strS + ":" + timerObj.strSS;
}
function clearTimer() {
    timerObj.m = 0;
    timerObj.s = 0;
    timerObj.ss = 0;
    timerObj.elem.innerHTML = timerObj.blankTimerStr;
    // timerElem.innerHTML = `0${m}:0${s}:0${ss}`
}
