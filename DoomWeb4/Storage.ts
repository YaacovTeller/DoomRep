/////// MAIN MENU OPEN ////////

function menuReady() { 
    $(elements.loadingBar).fadeOut(200)
    $(elements.fileNames).fadeOut(200)
    setTimeout(()=>{
        $(elements.menu).fadeIn(200);
        openMenu();
        elements.loadingBar.parentElement.style.zIndex = '20';
    },400)
}

var imageArray: Array<string> = [];
var imageLoadingCounter: number = 0;
loadAllImages()

function loadAllImages() {
    iterObj(pics);
    iterObj(enemyPics);
    for (let image of imageArray) {
        preloadImage(image);
    }
}
//preloadImage(pics.guns.reloading.shotgun);
//hideElement(elements.highScores)
function iterObj(item) {
	Object.keys(item).map((key) => {
        if (typeof item[key] === 'object') {
        iterObj(item[key])
    }
    else {
        imageArray.push(item[key]);
    }
  })
}

function preloadImage(url){
    var img = new Image();
    img.onload = function() {
        console.log("Image loaded");
        imageLoadingCounter++;
        let percent = 100 / imageArray.length * imageLoadingCounter;
        let rounded = Math.round(percent)
        if (rounded % 5 == 0) {
            LevelHandler.moveBar(elements.loadingBar, rounded);
        }
        //let percentLoaded: string = rounded + "% loaded"
        //elements.loadingBar.innerText = percentLoaded
        let numberLoaded: string = imageLoadingCounter + "/" + imageArray.length+ " assets loaded"
        elements.loadingBar.innerText = numberLoaded;
        elements.fileNames.innerText = url;

        if (imageLoadingCounter == imageArray.length) {
           // console.log(percentLoaded)
            $(elements.loadingBar).stop(true)
            LevelHandler.moveBar(elements.loadingBar, 100, menuReady)
        } 
    };
    img.src = url;
}


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