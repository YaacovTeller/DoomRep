//SOUNDS - Guns and creatures
// sound-loader
function sound(src: string) {
    let arr = src.split('/');
    this.title = arr[arr.length-2] + "/" + arr[arr.length-1]
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    //   this.sound.setAttribute("loop", "infinite");  For a sort of macabre doom-rap experience
    //hideElement(this.sound);
    document.body.appendChild(this.sound);

    this.setVolume = function (vol:number) {
        this.sound.volume = vol
    }
    this.playHalfVolume = function () {
        this.setVolume(0.5);
        this.sound.play();
    }
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
    this.playClone = function () {
        this.sound.cloneNode(true).play();
    }
}