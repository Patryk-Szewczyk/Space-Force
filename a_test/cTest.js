'use strict';

//Przykładowy obiekt dla silnika gry:
class Object_1 {
    engineRef = undefined;
    isActive = true;
    worker = undefined;
    handleWorkerPostmessage = undefined;
    child1 = undefined;
    child2 = undefined;
    children = [];
    childrenId = undefined;
    x = 300;
    y = -300;
    element = document.querySelector('.new-position-test');
    speedX = undefined;
    speedY = undefined;
    constructor(engine, speed) {
        this.engineRef = engine;
        this.speedX = speed;
        this.speedY = speed * -1;
        this.#setWorker();
        this.element.style.transform = 'translate(' + this.x + 'px, ' + this.y + 'px)';
        this.child1 = new Child_1(this.engineRef, speed, this);
        this.child2 = new Child_2(this.engineRef, speed, this);
        this.children.push(this.child1);
        this.children.push(this.child2);
    }
    setChild_ID(id) {
        this.childrenId = id;
        this.child1.childrenId = id;
        this.child2.childrenId = id;
    }
    #setWorker() {
        this.worker = new Worker('/wp-content/themes/SpaceForceGame/a_test/wTest.js');
        this.handleWorkerPostmessage = (data) => {
            return new Promise((resolve) => {
                this.worker.onmessage = (e) => {
                    navigator.locks.request("engine-lock", async () => {
                        const responseData = {
                            id: e.data.id,
                            payload: e.data.futurePosition
                        };
                        await this.engineRef.fromWorkerData(responseData);
                        resolve();
                    });
                };
                this.worker.postMessage(data);
            });
        };
    }
    prepareObjectData() {
        const data = {
            speedX: this.speedX,
            speedY: this.speedY,
            x: this.x,
            y: this.y
        };
        this.engineRef.fromObjectPrepareData(data);
    }
    update(data) {
        // Rodzic:
        const dataParent = data.parent;
        this.x = dataParent.x;
        this.y = dataParent.y;
        this.element.style.transform = 'translate(' + this.x + 'px, ' + this.y + 'px)';
        // Dziecko 1:
        if (data.child1) {  // Obsługa usunięcia dziecka, kiedy "children[i]" jest puste
            const dataChild1 = data.child1;
            this.child1.x = dataChild1.x;
            this.child1.y = dataChild1.y;
            this.child1.element.style.transform = 'translate(' + this.child1.x + 'px, ' + this.child1.y + 'px)';
        }
        if (data.child2) {
            // Dziecko 2:
            const dataChild2 = data.child2;
            this.child2.x = dataChild2.x;
            this.child2.y = dataChild2.y;
            this.child2.element.style.transform = 'translate(' + this.child2.x + 'px, ' + this.child2.y + 'px)';
        }
    }
}