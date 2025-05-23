class Child_1 {
    engineRef = undefined;
    isActive = true;
    handleWorkerPostmessage = undefined;
    parent = undefined;
    x = 300;
    y = -300;
    childrenId = undefined;
    element = document.querySelector('.test-child-1');
    speedX = undefined;
    speedY = undefined;
    constructor(engine, speed, parent) {
        this.engineRef = engine;
        this.speedX = speed * -1;
        this.speedY = speed * -1;
        this.parent = parent;
        this.element.style.transform = 'translate(' + this.x + 'px, ' + this.y + 'px)';
    }
    prepareObjectChildData() {
        const data = {
            speedX: this.speedX,
            speedY: this.speedY,
            x: this.x,
            y: this.y
        };
        this.engineRef.fromObjectChildPrepareData(this.parent.childrenId, data);
    }
}