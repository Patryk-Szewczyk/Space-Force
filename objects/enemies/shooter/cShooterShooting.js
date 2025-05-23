'use strict';

class ShooterShooting {
    childrenId = undefined;
    engineRef = undefined;
    isActive = true;
    handleWorkerPostmessage = undefined;
    parent = undefined;
    LOOP_createBullets = null;
    DELATY_betweenCreateBullets = null;
    #bulletWidth = 5;  // px
    #bulletHeight = 15;  // px
    existingBullets = [];
    speedX = undefined;
    speedY = undefined;
    rotate = undefined;
    shootingArgs = undefined;
    #board = document.querySelector('.game-board');
    #boardRect = this.#board.getBoundingClientRect();
    constructor(engine, parent, shootingArgs) {
        this.engineRef = engine;
        this.parent = parent;
        this.shootingArgs = shootingArgs;
        this.speedX = shootingArgs.speed;
        this.speedY = shootingArgs.speed;
        this.#determineBulletsRotateAndSpeed();
    }
    stopShooting() {
        const board = document.querySelector('.game-board');
        document.querySelectorAll('.player-bullet').forEach((bullet) => {
            board.removeChild(bullet);
        });
        clearInterval(this.LOOP_createBullets);
        clearTimeout(this.DELATY_betweenCreateBullets);
        this.LOOP_createBullets = null;
        this.DELATY_betweenCreateBullets = null;
    }
    startShooting() {
        this.isActive = true;
        this.LOOP_createBullets = setInterval(() => {  // Ciągłe strzelanie:
            let bulletsCreated = 0;
            const createSingleBullet = () => {
                const bullet = document.createElement('div');
                bullet.setAttribute('class', 'shooter-bullet');
                const bulletPosition = this.#determineBulletsStartPosition();
                bullet.dataset.x = bulletPosition.startX;
                bullet.dataset.y = bulletPosition.startY;
                bullet.style.transform = `translate(${bullet.dataset.x}px, ${bullet.dataset.y}px) rotate(${this.rotate}deg)`;
                this.#board.appendChild(bullet);
                this.existingBullets.push(bullet);
                bulletsCreated++;
                if (bulletsCreated < this.shootingArgs.bulletsOnRound) {
                    // zaplanuj kolejny pocisk w tej samej serii
                    this.DELATY_betweenCreateBullets = setTimeout(createSingleBullet, this.shootingArgs.gapBetweenRounds * 1000);
                }
            };
            // start serii pocisków
            createSingleBullet();
        }, this.shootingArgs.fireRate * 1000);
    }
    #determineBulletsRotateAndSpeed() {
        switch (this.parent.movementType) {
            case 'horizontal': 
                switch (this.parent.movementArgs.direction) {
                    case 'left':
                        this.rotate = 90;
                        this.speedX *= -1;
                        break
                    case 'right':
                        this.rotate = -90;
                        break;
                }
                break
            case 'bias':
                switch (this.parent.movementArgs.direction) {
                    case 'bottomLeft':
                        this.rotate = 45;
                        this.speedX *= -1;
                        break
                    case 'bottomRight':
                        this.rotate = -45;
                        break
                    case 'topLeft':
                        this.rotate = 135;
                        this.speedX *= -1;
                        this.speedY *= -1;
                        break
                    case 'topRight':
                        this.rotate = -135;
                        this.speedY *= -1;
                        break
                }
                break
            default:
                this.rotate = 0;
            
        }
    }
    #determineBulletsStartPosition() {
        const objectRect = this.parent.objectTag.getBoundingClientRect();
        const boardRect = this.#board.getBoundingClientRect();
        let deviateX = undefined;
        let deviateY = undefined;
        let bulletPositionX = undefined;
        let bulletPositionY = undefined;
        switch (this.parent.movementType) {
            case 'horizontal': 
                switch (this.parent.movementArgs.direction) {
                    case 'left':
                        deviateX = 5;
                        bulletPositionX = objectRect.left - boardRect.left - (this.#bulletWidth / 2) + deviateX;
                        bulletPositionY = objectRect.bottom - boardRect.bottom - ((objectRect.height / 2) + ((this.#bulletWidth * -1) * 1.5));
                        break
                    case 'right':
                        this.rotate = -90;
                        deviateX = 5;
                        bulletPositionX = objectRect.left - boardRect.left + (objectRect.width - (this.#bulletWidth / 2)) - deviateX;
                        bulletPositionY = objectRect.bottom - boardRect.bottom - ((objectRect.height / 2) + ((this.#bulletWidth * -1) * 1.5));
                        break;
                }
                break
            case 'bias':
                switch (this.parent.movementArgs.direction) {
                    case 'bottomLeft':
                        deviateX = 20;
                        deviateY = 10;
                        bulletPositionX = objectRect.left - boardRect.left + (this.#bulletWidth / 2) + deviateX;
                        bulletPositionY = objectRect.bottom  - boardRect.bottom - (this.#bulletHeight / 2) - deviateY;
                        break
                    case 'bottomRight':
                        deviateX = -25;
                        deviateY = 10;
                        bulletPositionX = objectRect.right - boardRect.left - (this.#bulletWidth / 2) + deviateX;
                        bulletPositionY = objectRect.bottom - boardRect.bottom - (this.#bulletHeight / 2) - deviateY;
                        break
                    case 'topLeft':
                        deviateX = 20;
                        deviateY = 25;
                        bulletPositionX = objectRect.left - boardRect.left + (this.#bulletWidth / 2) + deviateX;
                        bulletPositionY = objectRect.top - boardRect.bottom + (this.#bulletHeight / 2) + deviateY;
                        break
                    case 'topRight':
                        deviateX = -25;
                        deviateY = 25;
                        bulletPositionX = objectRect.right - boardRect.left - (this.#bulletWidth / 2) + deviateX;
                        bulletPositionY = objectRect.top - boardRect.bottom + (this.#bulletHeight / 2) + deviateY;
                        break
                }
                break
            default:
                deviateY = 5;
                bulletPositionX = objectRect.left - boardRect.left + ((objectRect.width / 2) - (this.#bulletWidth / 2));
                bulletPositionY = objectRect.bottom - boardRect.bottom + deviateY;
            
        }
        return {startX: bulletPositionX, startY: bulletPositionY};
    }
    prepareObjectChildData() {
        const bullets = this.existingBullets;
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
            movementType: this.parent.movementType,
            movementDirection: this.parent.movementArgs.direction,
            speedX: this.speedX,
            speedY: this.speedY
        };
        this.engineRef.fromObjectChildPrepareData(this.parent.childrenId, data);
    }
}