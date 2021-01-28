/////// MAIN MENU OPEN ////////
openMenu() // MOVE?
preloadImage(pics.guns.reloading.shotgun);
//hideElement(elements.highScores)

//alertStoredInfo(getFromLocal());
function displayHighscore(){
    let userInfo = getFromLocal();
    if (!userInfo || Object.keys(userInfo).length === 0){
        hideElement(elements.highScores)
    }
    else {
        showElement(elements.highScores)
        let str:string = "";
        if (userInfo['furthestCampaignLevel']){
            str += `Furthest campaign level: ${userInfo['furthestCampaignLevel']}`;
            str += '<br>'
        }
        if (userInfo['furthestContinuousStage']){
            str += `Furthest continous stage: ${userInfo['furthestContinuousStage']}`;
            str += '<br>'
        }
        if (userInfo['mostKills']){
            str += `Most kills: ${userInfo['mostKills']}`;
            str += '<br>'
        }
        elements.highScores.innerHTML = str;
    }
}

function getFromLocal() {
   let microDoomInfo: Object = {};
   let str = localStorage.getItem("micro_Doom");
   if (str) {
      microDoomInfo = JSON.parse(str)
   }
//    else {
//       microDoomInfo = dummyInfo();
//       setInLocal(microDoomInfo);
//    }
   return microDoomInfo;
}
function clearLocal() {
    localStorage.removeItem("micro_Doom");
}

function dummyInfo() {
   let obj = {};
   let user = "YT"
   let highScore = "300"
   obj['user'] = user;
   obj['highScore'] = highScore;
   return obj;
}

function setInLocal(info) {
   let json = JSON.stringify(info);
   localStorage.setItem("micro_Doom", json)
}
function alertStoredInfo(obj) {
    if (obj && obj.user && obj.highScore){
        alert(`Hello ${obj.user}, your previous score was ${obj.highScore} kills`)
    }
}