/////// MAIN MENU OPEN ////////
openMenu() // MOVE?
preloadImage(pics.guns.reloading.shotgun);

//alertStoredInfo(getFromLocal());

function getFromLocal() {
   let microDoomInfo: Object;
   let str = localStorage.getItem("micro_Doom");
   if (str) {
      microDoomInfo = JSON.parse(str)
   }
   else {
      microDoomInfo = dummyInfo();
      setInLocal(microDoomInfo);
   }
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