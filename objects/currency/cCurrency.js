'use strict';

class Currency {
    engineRef = undefined;
    isActive = true;
    worker = undefined;
    handleWorkerPostmessage = undefined;
    children = [];
    childrenId = undefined;
    x = 0;
    y = 0;
    speedX = 0;
    speedY = 0;
    static STAR_small = 15;
    static STAR_medium = 20;
    static STAR_big = 25;
    static starsCounter = 0;
    #board = document.querySelector('.game-board');
    #boardRect = this.#board.getBoundingClientRect();
    constructor(engine, speed) {
        this.engineRef = engine;
        this.speedY = speed;
        this.#setWorker();
    }
    setChild_ID(id) {
        this.childrenId = id;
    }
    #setWorker() {
        this.worker = new Worker('/wp-content/themes/SpaceForceGame/objects/currency/wCurrency.js');
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
    static createStarsGroup(enemyName, enemytype, enemyObject) {
        switch (enemyName) {
            case 'speeder':
                switch (enemytype) {
                    case 1:  // 1 mała
                        Currency.createStar(enemyObject, 1, {x: 0, y: 0});
                        break;
                    case 2:  // 2 małe
                        Currency.createStar(enemyObject, 1, {x: 10, y: 0});
                        Currency.createStar(enemyObject, 1, {x: -10, y: 0});
                        break;
                    case 3:  // 3 małe
                        Currency.createStar(enemyObject, 1, {x: 10, y: 10});
                        Currency.createStar(enemyObject, 1, {x: -10, y: 10});
                        Currency.createStar(enemyObject, 1, {x: 0, y: -10});
                        break;
                    case 4:  // 4 małe
                        Currency.createStar(enemyObject, 1, {x: 10, y: 10});
                        Currency.createStar(enemyObject, 1, {x: -10, y: 10});
                        Currency.createStar(enemyObject, 1, {x: 10, y: -10});
                        Currency.createStar(enemyObject, 1, {x: -10, y: -10});
                        break;
                }
                break;
            case 'shooter':
                switch (enemytype) {
                    case 1:  // 2 | 2 małe
                        Currency.createStar(enemyObject, 1, {x: 10, y: 0});
                        Currency.createStar(enemyObject, 1, {x: -10, y: 0});
                        break;
                    case 2:  // 4 | 4 małe
                        Currency.createStar(enemyObject, 1, {x: 10, y: 10});
                        Currency.createStar(enemyObject, 1, {x: -10, y: 10});
                        Currency.createStar(enemyObject, 1, {x: 10, y: -10});
                        Currency.createStar(enemyObject, 1, {x: -10, y: -10});
                        break;
                    case 3:  // 6 | 2 średnie
                        Currency.createStar(enemyObject, 2, {x: 12.5, y: 0});
                        Currency.createStar(enemyObject, 2, {x: -12.5, y: 0});
                        break;
                    case 4:  // 8 | 2 średnie, 2 małe
                        Currency.createStar(enemyObject, 2, {x: 12.5, y: 0});
                        Currency.createStar(enemyObject, 2, {x: -12.5, y: 0});
                        Currency.createStar(enemyObject, 1, {x: 0, y: -15});
                        Currency.createStar(enemyObject, 1, {x: 0, y: 15});
                        break;
                }
                break;
            case 'multi':
                switch (enemytype) {
                    case 1:  // 3 | 2 małe
                        Currency.createStar(enemyObject, 1, {x: 10, y: 10});
                        Currency.createStar(enemyObject, 1, {x: -10, y: 10});
                        Currency.createStar(enemyObject, 1, {x: 0, y: -10});
                        break;
                    case 2:  // 6 | 2 średnie
                        Currency.createStar(enemyObject, 2, {x: 12.5, y: 0});
                        Currency.createStar(enemyObject, 2, {x: -12.5, y: 0});
                        break;
                    case 3:  // 9 | 3 średnie
                        Currency.createStar(enemyObject, 2, {x: 0, y: -12});
                        Currency.createStar(enemyObject, 2, {x: 12.5, y: 8});
                        Currency.createStar(enemyObject, 2, {x: -12.5, y: 8});
                        break;
                    case 4:  // 12 | 4 średnie
                        Currency.createStar(enemyObject, 2, {x: 12.5, y: -14.5});
                        Currency.createStar(enemyObject, 2, {x: -12.5, y: -14.5});
                        Currency.createStar(enemyObject, 2, {x: 12.5, y: 10.5});
                        Currency.createStar(enemyObject, 2, {x: -12.5, y: 10.5});
                        break;
                }
                break;
            case 'flamer':
                switch (enemytype) {
                    case 1:  // 4 | 4 małe
                        Currency.createStar(enemyObject, 1, {x: 10, y: 10});
                        Currency.createStar(enemyObject, 1, {x: -10, y: 10});
                        Currency.createStar(enemyObject, 1, {x: 10, y: -10});
                        Currency.createStar(enemyObject, 1, {x: -10, y: -10});
                        break;
                    case 2:  // 8 | 2 średnie, 2 małe
                        Currency.createStar(enemyObject, 2, {x: 12.5, y: 0});
                        Currency.createStar(enemyObject, 2, {x: -12.5, y: 0});
                        Currency.createStar(enemyObject, 1, {x: 0, y: -15});
                        Currency.createStar(enemyObject, 1, {x: 0, y: 15});
                        break;
                    case 3:  // 12 | 4 średnie
                        Currency.createStar(enemyObject, 2, {x: 12.5, y: -14.5});
                        Currency.createStar(enemyObject, 2, {x: -12.5, y: -14.5});
                        Currency.createStar(enemyObject, 2, {x: 12.5, y: 10.5});
                        Currency.createStar(enemyObject, 2, {x: -12.5, y: 10.5});
                        break;
                    case 4:  // 16 | 2 duże, 2 średnie
                        Currency.createStar(enemyObject, 3, {x: 14.5, y: 0});
                        Currency.createStar(enemyObject, 3, {x: -14.5, y: 0});
                        Currency.createStar(enemyObject, 2, {x: 0, y: -17});
                        Currency.createStar(enemyObject, 2, {x: 0, y: 17});
                        break;
                }
                break;
            case 'bomber':
                switch (enemytype) {
                    case 1:  // 5 | 1 duża
                        Currency.createStar(enemyObject, 3, {x: 0, y: 0});
                        break;
                    case 2:  // 10 | 2 duże
                        Currency.createStar(enemyObject, 3, {x: 15, y: 0});
                        Currency.createStar(enemyObject, 3, {x: -15, y: 0});
                        break;
                    case 3:  // 15 | 3 duże
                        Currency.createStar(enemyObject, 3, {x: 15, y: 12});
                        Currency.createStar(enemyObject, 3, {x: -15, y: 12});
                        Currency.createStar(enemyObject, 3, {x: 0, y: -12});
                        break;
                    case 4:  // 20 | 4 duże
                        Currency.createStar(enemyObject, 3, {x: 15, y: 15});
                        Currency.createStar(enemyObject, 3, {x: -15, y: 15});
                        Currency.createStar(enemyObject, 3, {x: 15, y: -15});
                        Currency.createStar(enemyObject, 3, {x: -15, y: -15});
                        break;
                }
                break;
            case 'orb':
                switch (enemytype) {
                    case 1:  // 6 | 2 średnie
                        Currency.createStar(enemyObject, 2, {x: 12.5, y: 0});
                        Currency.createStar(enemyObject, 2, {x: -12.5, y: 0});
                        break;
                    case 2:  // 12 | 4 średnie
                        Currency.createStar(enemyObject, 2, {x: 12.5, y: -14.5});
                        Currency.createStar(enemyObject, 2, {x: -12.5, y: -14.5});
                        Currency.createStar(enemyObject, 2, {x: 12.5, y: 10.5});
                        Currency.createStar(enemyObject, 2, {x: -12.5, y: 10.5});
                        break;
                    case 3:  // 18 | 3 duże, 1 średnia
                        Currency.createStar(enemyObject, 3, {x: 15, y: 18});
                        Currency.createStar(enemyObject, 3, {x: -15, y: 18});
                        Currency.createStar(enemyObject, 3, {x: 0, y: -22});
                        Currency.createStar(enemyObject, 2, {x: 0, y: 0});
                        break;
                    case 4:  // 24 | 4 duże, 4 małe
                        Currency.createStar(enemyObject, 3, {x: 15, y: 15});
                        Currency.createStar(enemyObject, 3, {x: -15, y: 15});
                        Currency.createStar(enemyObject, 3, {x: 15, y: -15});
                        Currency.createStar(enemyObject, 3, {x: -15, y: -15});
                        Currency.createStar(enemyObject, 1, {x: 30, y: 0});
                        Currency.createStar(enemyObject, 1, {x: -30, y: 0});
                        Currency.createStar(enemyObject, 1, {x: 0, y: 30});
                        Currency.createStar(enemyObject, 1, {x: 0, y: -30});
                        break;
                }
                break;
            case 'abyssCore':
                // 125 gwiazdek | 25 dużych
                Currency.createStar(enemyObject, 3, {x: 0, y: -60});
                Currency.createStar(enemyObject, 3, {x: -30, y: -60});
                Currency.createStar(enemyObject, 3, {x: 30, y: -60});
                Currency.createStar(enemyObject, 3, {x: -60, y: -60});
                Currency.createStar(enemyObject, 3, {x: 60, y: -60});
                Currency.createStar(enemyObject, 3, {x: 0, y: -30});
                Currency.createStar(enemyObject, 3, {x: -30, y: -30});
                Currency.createStar(enemyObject, 3, {x: 30, y: -30});
                Currency.createStar(enemyObject, 3, {x: -60, y: -30});
                Currency.createStar(enemyObject, 3, {x: 60, y: -30});
                Currency.createStar(enemyObject, 3, {x: 0, y: 0});
                Currency.createStar(enemyObject, 3, {x: -30, y: 0});
                Currency.createStar(enemyObject, 3, {x: 30, y: 0});
                Currency.createStar(enemyObject, 3, {x: -60, y: 0});
                Currency.createStar(enemyObject, 3, {x: 60, y: 0});
                Currency.createStar(enemyObject, 3, {x: 0, y: 30});
                Currency.createStar(enemyObject, 3, {x: -30, y: 30});
                Currency.createStar(enemyObject, 3, {x: 30, y: 30});
                Currency.createStar(enemyObject, 3, {x: -60, y: 30});
                Currency.createStar(enemyObject, 3, {x: 60, y: 30});
                Currency.createStar(enemyObject, 3, {x: 0, y: 60});
                Currency.createStar(enemyObject, 3, {x: -30, y: 60});
                Currency.createStar(enemyObject, 3, {x: 30, y: 60});
                Currency.createStar(enemyObject, 3, {x: -60, y: 60});
                Currency.createStar(enemyObject, 3, {x: 60, y: 60});
                break;
        }
    }
    static createStar(enemyObject, size, deviate = {x: 0, y: 0}) {  // tag, int, [x: int, y: int], [x: int, y: int]
        const board = document.querySelector('.game-board');
        const boardRect = board.getBoundingClientRect();
        const enemyRect = enemyObject.getBoundingClientRect();
        const star = document.createElement('div');
        star.setAttribute('class', 'star');
        let starSize = undefined;
        switch (size) {
            case 1:
                star.classList.add('small');  // identyfikator typu gwiazdki
                starSize = Currency.STAR_small;
                break;
            case 2:
                star.classList.add('medium');
                starSize = Currency.STAR_medium;
                break;
            case 3:
                star.classList.add('big');
                starSize = Currency.STAR_big;
                break;
        }
        star.style.width = starSize + 'px';
        star.style.height = starSize + 'px';
        // const equalizationY = 0;
        star.dataset.x = ((enemyRect.left + deviate.x) - boardRect.left) + ((enemyRect.width / 2) - (starSize / 2));
        star.dataset.y = ((enemyRect.bottom + deviate.y) - boardRect.bottom) - ((enemyRect.height / 2) - (starSize / 2));
        star.style.transform = 'translate(' + star.dataset.x + 'px, ' + star.dataset.y + 'px)';
        board.appendChild(star);
    }
    prepareObjectData() {
        const stars = document.querySelectorAll('.game-board > .star');
        let starsRect = [];
        let starsPosition = [];
        stars.forEach(star => {
            starsRect.push(star.getBoundingClientRect());
            starsPosition.push(
                {
                    x: Number(star.dataset.x),
                    y: Number(star.dataset.y)
                }
            );
        });
        const data = {
            boardRect: this.#boardRect,
            starsRect: starsRect,
            starsPosition: starsPosition,
            speedY: this.speedY
        };
        this.engineRef.fromObjectPrepareData(data);
    }
    update(data) {
        const stars = document.querySelectorAll('.game-board > .star');
        if (data.length == 0) {
            return;
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i] == false) {
                this.#board.removeChild(stars[i]);
            } else if (
                data[i] != false &&
                stars[i] &&
                stars[i].dataset
            ) {
                stars[i].dataset.y = data[i].y;
                stars[i].style.transform = 'translate(' + data[i].x + 'px, ' + data[i].y + 'px)';
            }
        }
        this.#detectPlayer(stars);
    }
    #detectPlayer(stars) {
        const playerHitboxes = document.querySelectorAll('.player > .hitbox');
        let star = undefined;
        let hitbox = undefined;
        for (let i = 0; i < stars.length; i++) {
            star = stars[i].getBoundingClientRect();
            for (let j = 0; j < playerHitboxes.length; j++) {
                hitbox = playerHitboxes[j].getBoundingClientRect();
                if (
                    star.top < hitbox.bottom &&
                    star.bottom > hitbox.top &&
                    star.left < hitbox.right &&
                    star.right > hitbox.left
                ) {
                    switch (stars[i].classList[1]) {
                        case 'small':
                            Currency.starsCounter += 1
                            Player.updateScore(100);
                            break;
                        case 'medium':
                            Currency.starsCounter += 3
                            Player.updateScore(300);
                            break;
                        case 'big':
                            Currency.starsCounter += 5
                            Player.updateScore(500);
                            break;
                    }
                    document.querySelector('.star-counter').textContent = Currency.starsCounter;
                    document.querySelector('.game-board').removeChild(stars[i]);
                    break;
                }
            }
        }
    }
}



// Stary update(): (synchroniczny)
// update(dx, dy) {
//     const stars = document.querySelectorAll('.game-board > .star');
//     if (stars.length == 0) {
//         return;
//     }
//     const board = document.querySelector('.game-board');
//     const boardRect = board.getBoundingClientRect();
//     for (let i = 0; i < stars.length; i++) {
//         const starRect = stars[i].getBoundingClientRect();
//         if (starRect.top > boardRect.bottom) {
//             board.removeChild(stars[i]);
//         } else {
//             let x = Number(stars[i].dataset.x);
//             let y = Number(stars[i].dataset.y);
//             y += dy;
//             stars[i].dataset.y = y;
//             stars[i].style.transform = 'translate(' + x + 'px, ' + y + 'px)';
//         }
//     }
//     this.#detectPlayer(stars);
// }