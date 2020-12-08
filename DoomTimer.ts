//TIMER
<<<<<<< HEAD
var timerObj ={
    m: 0,
    s: 0,
    ss: 0,
    strM: "",
    strS: "",
    strSS: "",
    blankTimerStr:"00:00:00",
    elem: document.getElementById("timer"),
}

clearTimer();
var time;
function startTimer(){
    
time = setInterval(function () {
    timerObj.ss++;
    if (timerObj.ss == 99) { timerObj.ss = 0; timerObj.s++ }
    if (timerObj.s == 59) { timerObj.s = 0; timerObj.m++ }
    if (timerObj.m < 10) { timerObj.strM = `0${timerObj.m}` } else timerObj.strM = timerObj.m.toString();
    if (timerObj.s < 10) { timerObj.strS = `0${timerObj.s}` } else timerObj.strS = timerObj.s.toString();
    if (timerObj.ss < 10) { timerObj.strSS = `0${timerObj.ss}` } else timerObj.strSS = timerObj.ss.toString();

    timerObj.elem.innerHTML = timerObj.strM + ":" + timerObj.strS + ":" + timerObj.strSS;
=======
var i: number, m: number = 0, s: number = 0;
var stM, stS, stSS: string
var ss: number = 0;
document.getElementById("timer").innerHTML = `0${m}:0${s}:0${ss}`
var time;
function startTimer(){
time = setInterval(function () {
    ss++;
    if (ss == 99) { ss = 0; s++ }
    if (s == 59) { s = 0; m++ }
    if (m < 10) { stM = `0${m}` } else stM = m.toString();
    if (s < 10) { stS = `0${s}` } else stS = s.toString();
    if (ss < 10) { stSS = `0${ss}` } else stSS = ss.toString();

    document.getElementById("timer").innerHTML = stM + ":" + stS + ":" + stSS;
>>>>>>> 0ff67a70f8095cc69484045aecc207d216762370
}, 10);
}
function stopTimer(){
    clearInterval(time);
}
function clearTimer(){
<<<<<<< HEAD
    timerObj.m=0; timerObj.s=0; timerObj.ss=0;
    timerObj.elem.innerHTML = timerObj.blankTimerStr;
   // timerElem.innerHTML = `0${m}:0${s}:0${ss}`
=======
    m=0; s=0; ss=0;
    document.getElementById("timer").innerHTML = `0${m}:0${s}:0${ss}`
>>>>>>> 0ff67a70f8095cc69484045aecc207d216762370
}