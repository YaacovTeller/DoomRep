"use strict";
class MovementGenerator {
    leftLimit(img) {
        return window.outerWidth - parseInt($(img).css('width'));
    }
    leftPosition(img) {
        return parseInt($(img).css('left'));
    }
    distance(img, destination) {
        let leftNum = this.leftPosition(img);
        return Math.abs(destination - leftNum);
    }
    direction(img, destination) {
        let leftNum = this.leftPosition(img);
        let direction = leftNum < destination ? 'right' : 'left';
        return direction;
    }
    calcDimentions(img) {
        let scale = RandomNumberGen.randomNumBetween(0.5, 2.5);
        //    let rect = img.getBoundingClientRect();
        //    let currentScale = width / img.clientWidth;
        let width = img.naturalWidth;
        let height = img.naturalHeight;
        let newWidth = width * scale;
        let newHeight = height * scale;
        return { width: newWidth, height: newHeight };
    }
    lateralDestination(img) {
        let leftLimit = this.leftLimit(img);
        let destination = RandomNumberGen.randomNumBetween(0, leftLimit);
        return destination;
    }
    speed(distance) {
        let speed = distance * 2; //RandomNumberGen.randomNumBetween(quickest, slowest);
        return speed;
    }
    moveForward(dimentions, speed, image) {
        $(image).animate({ width: dimentions.width + 'px' }, { queue: false, duration: speed });
        $(image).animate({ height: dimentions.height + 'px' }, { queue: false, duration: speed });
    }
    moveLateral(distance, speed, image, callback) {
        $(image).animate({ left: distance + 'px' }, { duration: speed, complete: callback });
    }
}
