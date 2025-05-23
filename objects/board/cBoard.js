'use strict';

class Board {
    engineRef = undefined;
    isActive = true;
    worker = undefined;
    handleWorkerPostmessage = undefined;
    children = [];
    childrenId = undefined;
    #x = 0;
    #y = 0;
    speedX = 0;
    speedY = 100;
    #board = document.querySelector('.game-board');
    #parts = document.querySelectorAll('.part');
    constructor(engine, speedY) {
        this.engineRef = engine;
        this.speedY = speedY;
        const boardRect = this.#board.getBoundingClientRect();
        this.#parts[0].style.transform = 'translate(' + this.#x + 'px, ' + (boardRect.height * -1) + 'px)';
        this.#parts[1].style.transform = 'translate(' + this.#x + 'px, ' + 0 + 'px)';
        this.#setWorker();
    }
    setChild_ID(id) {
        this.childrenId = id;
    }
    #setWorker() {
        this.worker = new Worker('/wp-content/themes/SpaceForceGame/objects/board/wBoard.js');
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
        const boardRect = this.#board.getBoundingClientRect();
        const partRect = [];
        partRect.push(this.#parts[0].getBoundingClientRect());
        partRect.push(this.#parts[1].getBoundingClientRect());
        const data = {
            partsAmount: this.#parts.length,
            boardRect: boardRect,
            partRect: partRect,
            speedY: this.speedY
        };
        this.engineRef.fromObjectPrepareData(data);
    }
    update(data) {
        for (let i = 0; i < data.length; i++) {
            this.#parts[i].style.transform = 'translate(' + this.#x + 'px, ' + data[i].y + 'px)';
        }
    }
}







    // update(dx, dy) {
    //     // TODO: Weź to do workera Player.
    //     const boardRect = this.#board.getBoundingClientRect();
    //     for (let i = 0; i < this.#parts.length; i++) {
    //         const partRect = this.#parts[i].getBoundingClientRect();
    //         if (partRect.top > boardRect.bottom) {
    //             // Reset pozycji:
    //             this.#y = boardRect.height * -1;
    //             this.#parts[i].style.transform = 'translate(' + this.#x + 'px, ' + this.#y + 'px)';
    //         } else {
    //             // Idziemy w dół:
    //             this.#y = (partRect.top - boardRect.top) + dy;
    //             this.#parts[i].style.transform = 'translate(' + this.#x + 'px, ' + this.#y + 'px)';
    //         }
    //     }
    // }



// Stara wersja klasy Board, która była oparta na CSS. Od nowa napisałem klasę, aby dokładnie zsynchronizować gwiazdki i 6 typ wrogów, które mają poruszać się równo z tłem.

// class Board {
//     #speed;  // equal with CSS
//     #part1 = document.querySelectorAll('.part')[0];
//     #part2 = document.querySelectorAll('.part')[1];
//     #part3 = document.querySelectorAll('.part')[2];
//     #loop = null;
//     constructor(speed) {
//         this.isActive = true;
//         this.#speed = speed * 1000;
//         // 1: screen | 2: down | 3: top 
//         this.#changeClass(this.#part1, 'instant-screen');
//         this.#changeClass(this.#part2, 'slide-down');
//         this.#changeClass(this.#part3, 'instant-top');
//     }
//     runLoop() {
//         const loop = () => {
//             // 1: screen > down | 2: down > top | 3: top > screen 
//             this.#changeClass(this.#part1, 'slide-down');
//             this.#changeClass(this.#part2, 'instant-top');
//             this.#changeClass(this.#part3, 'slide-screen');
//             // 1: down > top | 2: top > screen | 3: screen > down
//             setTimeout(() => {
//                 this.#changeClass(this.#part1, 'instant-top');
//                 this.#changeClass(this.#part2, 'slide-screen');
//                 this.#changeClass(this.#part3, 'slide-down');
//             }, this.#speed);
//             // 1: top > screen | 2: screen > down | 3: down > top
//             setTimeout(() => {
//                 this.#changeClass(this.#part1, 'slide-screen');
//                 this.#changeClass(this.#part2, 'slide-down');
//                 this.#changeClass(this.#part3, 'instant-top');
//             }, this.#speed * 2);
//         };
//         loop();
//         this.#loop = setInterval(loop, this.#speed * 3);
//     }
//     #changeClass(part, addCls) {
//         part.classList.remove('slide-screen', 'slide-down', 'instant-top', 'instant-screen');
//         part.classList.add(addCls);
//         part.offsetWidth;
//         // part.offsetWidth  // wymusza przeliczenie stylów (reflow / repaint) w przeglądarce.
//         // Przeglądarka musi wtedy:
//         //   - przejść cały render tree
//         //   - zaktualizować pozycje, rozmiary, przejścia
//         // To powoduje, że wcześniejsze zmiany klas są "widoczne" i animacja startuje płynnie.
//     }
//     removeLoop() {
//         clearInterval(this.#loop);
//     }
// }










// 1. Zagnieżdżanie: timeouty są zależne od swoich rodziców
// setTimeout(() => {
//     console.log(1);
//     setTimeout(() => {
//         console.log(2);
//         setTimeout(() => {
//             console.log(3);
//         }, 1000);
//     }, 1000);
// }, 1000);

// 2. Osobne: timeouty są niezależne
// setTimeout(() => {
//     console.log(1);
// }, 1000);
// setTimeout(() => {
//     console.log(2);
// }, 2000);
// setTimeout(() => {
//     console.log(3);
// }, 3000);

// 3. setTimeout JEST ASYNCHRONICZNY!!!
// setTimeout(() => {
//     console.log(1);
// }, 1000);
// console.log(2);