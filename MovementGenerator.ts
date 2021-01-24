class MovementGenerator {
    private leftLimit(img) {
        return window.outerWidth - parseInt($(img).css('width'));
    }
    private leftPosition(img) {
        return parseInt($(img).css('left'));
    }

    public distance(img, destination) {
        let leftNum = this.leftPosition(img);
        return Math.abs(destination - leftNum);
    }

    public direction(img, destination) {
        let leftNum = this.leftPosition(img);
        let direction = leftNum < destination ? 'right' : 'left';
        return direction;
    }

    public calcDimentions(img: HTMLImageElement) {
        let scale = RandomNumberGen.randomNumBetween(0.5, 2.5);
        //    let rect = img.getBoundingClientRect();
        //    let currentScale = width / img.clientWidth;
        let width = img.naturalWidth;
        let height = img.naturalHeight;
        let newWidth = width * scale;
        let newHeight = height * scale;
        return { width: newWidth, height: newHeight };
    }

    public lateralDestination(img) {
        let leftLimit = this.leftLimit(img);
        let destination = RandomNumberGen.randomNumBetween(0, leftLimit);
        return destination;
    }

    public speed(distance) {
        let speed = distance * 2; //RandomNumberGen.randomNumBetween(quickest, slowest);
        return speed;
    }

    public moveForward(dimentions, speed, image) { // so far unused

        $(image).animate({ width: dimentions.width + 'px' }, { queue: false, duration: speed });
        $(image).animate({ height: dimentions.height + 'px' }, { queue: false, duration: speed });
    }

    public moveLateral(distance, speed, image, callback) {
        $(image).animate({ left: distance + 'px' }, { duration: speed, complete: callback });
    }
}
