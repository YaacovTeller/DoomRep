"use strict";
//TIMER
var i, m = 0, s = 0;
var stM, stS, stSS;
var ss = 0;
document.getElementById("timer").innerHTML = "0" + m + ":0" + s + ":0" + ss;
var time;
function startTimer() {
    time = setInterval(function () {
        ss++;
        if (ss == 99) {
            ss = 0;
            s++;
        }
        if (s == 59) {
            s = 0;
            m++;
        }
        if (m < 10) {
            stM = "0" + m;
        }
        else
            stM = m.toString();
        if (s < 10) {
            stS = "0" + s;
        }
        else
            stS = s.toString();
        if (ss < 10) {
            stSS = "0" + ss;
        }
        else
            stSS = ss.toString();
        document.getElementById("timer").innerHTML = stM + ":" + stS + ":" + stSS;
    }, 10);
}
function stopTimer() {
    clearInterval(time);
}
function clearTimer() {
    m = 0;
    s = 0;
    ss = 0;
    document.getElementById("timer").innerHTML = "0" + m + ":0" + s + ":0" + ss;
}
