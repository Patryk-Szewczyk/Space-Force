'use strict';

class PlayerShooting {
    childrenId = undefined;
    engineRef = undefined;
    isActive = true;
    handleWorkerPostmessage = undefined;
    parent = undefined;
    speedX = 0;
    speedY = 0;
    LOOP_createBullets;
    #bulletWidth = 5;  // px
    #deviateY = 5;  // px
    #board = document.querySelector('.game-board');
    #boardRect = this.#board.getBoundingClientRect();
    constructor(engine, speed, parent) {
        this.engineRef = engine;
        this.speedY = speed * -1;
        this.parent = parent;
    }
    stopShooting() {
        const board = document.querySelector('.game-board');
        document.querySelectorAll('.player-bullet').forEach((bullet) => {
            board.removeChild(bullet);
        });
        clearInterval(this.LOOP_createBullets);
        this.LOOP_createBullets = null;
    }
    startShooting() {
        this.isActive = true;
        this.LOOP_createBullets = setInterval(() => {
            const bullet = document.createElement('div');
            const playerRect = Player.player.getBoundingClientRect();
            const boardRect = Player.board.getBoundingClientRect();
            bullet.setAttribute('class', 'player-bullet');
            bullet.dataset.x = playerRect.left - boardRect.left + ((playerRect.width / 2) - (this.#bulletWidth / 2));
            bullet.dataset.y = playerRect.bottom - boardRect.bottom - playerRect.height + this.#deviateY;
            bullet.style.transform = 'translate(' + bullet.dataset.x + 'px, ' + bullet.dataset.y + 'px)';
            Player.board.appendChild(bullet);
        }, Player.fireRate.currentValue * 1000);
    }
    prepareObjectChildData() {
        const bullets = document.querySelectorAll('.player-bullet');
        let bulletsRect = [];
        let bulletsPosition = [];
        bullets.forEach(bullet => {
            bulletsRect.push(bullet.getBoundingClientRect());
            bulletsPosition.push(
                {
                    x: Number(bullet.dataset.x),
                    y: Number(bullet.dataset.y)
                }
            );
        });
        const data = {
            boardRect: this.#boardRect,
            bulletsRect: bulletsRect,
            bulletsPosition: bulletsPosition,
            speedY: this.speedY
        };
        this.engineRef.fromObjectChildPrepareData(this.parent.childrenId, data);
    }
}



// Stary update(): (synchroniczny)
// update(dx, dy) {
//     const bullets = document.querySelectorAll('.player-bullet');
//     if (bullets.length == 0) {
//         return;
//     }
//     const boardRect = Player.board.getBoundingClientRect();
//     for (let i = 0; i < bullets.length; i++) {
//         const bulletRect = bullets[i].getBoundingClientRect();
//         if (bulletRect.top < boardRect.top) {
//             Player.board.removeChild(bullets[i]);
//         } else {
//             let x = Number(bullets[i].dataset.x);
//             let y = Number(bullets[i].dataset.y);
//             y += dy;
//             bullets[i].dataset.y = y;
//             bullets[i].style.transform = 'translate(' + x + 'px, ' + y + 'px)';
//         }
//     }
// }