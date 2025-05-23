'use strict';

class AbyssCoreShootingMulti {
    childrenId = undefined;
    engineRef = undefined;
    isActive = true;
    handleWorkerPostmessage = undefined;
    parent = undefined;
    DELATY_LOOP_createBullets = null;
    LOOP_createBullets = null;
    DELATY_betweenCreateBullets = null;
    #bulletWidth = 5;  // px
    #bulletHeight = 15;  // px
    existingBullets = {left: [], center: [], right: []};
    speedX = undefined;
    speedY = undefined;
    shootingArgs = undefined;
    #board = document.querySelector('.game-board');
    #boardRect = this.#board.getBoundingClientRect();
    constructor(engine, parent, shootingArgs) {
        this.engineRef = engine;
        this.parent = parent;
        this.shootingArgs = shootingArgs.multi;
        this.speedX = shootingArgs.multi.speed;
        this.speedY = shootingArgs.multi.speed;
        this.#determineBulletsSpeed();
    }
    stopShooting() {
        const board = document.querySelector('.game-board');
        document.querySelectorAll('.player-bullet').forEach((bullet) => {
            board.removeChild(bullet);
        });
        clearTimeout(this.DELATY_LOOP_createBullets);
        clearInterval(this.LOOP_createBullets);
        clearTimeout(this.DELATY_betweenCreateBullets);
        this.DELATY_LOOP_createBullets = null;
        this.LOOP_createBullets = null;
        this.DELATY_betweenCreateBullets = null;
    }
    startShooting() {
        this.isActive = true;
        this.DELATY_LOOP_createBullets = setTimeout(() => {
            let bulletsCreated = 0;
            const createSingleBullet = () => {
                const bulletPosition = this.#determineBulletsStartPosition();
                ['left', 'center', 'right'].forEach(side => {
                    const bullet = document.createElement('div');
                    bullet.setAttribute('class', 'multi-bullet');
                    bullet.dataset.x = bulletPosition.startX;
                    bullet.dataset.y = bulletPosition.startY;
                    bullet.style.transform = `translate(${bullet.dataset.x}px, ${bullet.dataset.y}px)`;
                    this.#board.appendChild(bullet);
                    this.existingBullets[side].push(bullet);
                });
                bulletsCreated++;
                if (bulletsCreated < this.shootingArgs.bulletsOnRound) {
                    this.DELATY_betweenCreateBullets = setTimeout(createSingleBullet, this.shootingArgs.gapBetweenRounds * 1000);
                }
            };
            createSingleBullet();
            this.LOOP_createBullets = setInterval(() => {
                let bulletsCreated = 0;
                const createSingleBullet = () => {
                    const bulletPosition = this.#determineBulletsStartPosition();
                    ['left', 'center', 'right'].forEach(side => {
                        const bullet = document.createElement('div');
                        bullet.setAttribute('class', 'multi-bullet');
                        bullet.dataset.x = bulletPosition.startX;
                        bullet.dataset.y = bulletPosition.startY;
                        bullet.style.transform = `translate(${bullet.dataset.x}px, ${bullet.dataset.y}px)`;
                        this.#board.appendChild(bullet);
                        this.existingBullets[side].push(bullet);
                    });
                    bulletsCreated++;
                    if (bulletsCreated < this.shootingArgs.bulletsOnRound) {
                        this.DELATY_betweenCreateBullets = setTimeout(createSingleBullet, this.shootingArgs.gapBetweenRounds * 1000);
                    }
                };
                createSingleBullet();
            }, this.shootingArgs.fireRate * 1000);
        }, 1000);
    }
    #determineBulletsSpeed() {
        let leftX = 0;
        let leftY = 0;
        let centerX = 0;
        let centerY = 0;
        let rightX = 0;
        let rightY = 0;
        const biasDivide = Math.SQRT2 / 2;  // Rzutowanie wektora na osie współrzędnych
        leftX = (this.speedX * -1) * biasDivide;
        leftY = this.speedY * biasDivide;
        centerY = this.speedY;
        rightX = this.speedX * biasDivide;
        rightY = this.speedY * biasDivide;
        this.speedX = {left: leftX, center: centerX, right: rightX};
        this.speedY = {left: leftY, center: centerY, right: rightY};
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
        const bulletsRect = {left: [], center: [], right: []};
        const bulletsPosition = {left: [], center: [], right: []};
        ['left', 'center', 'right'].forEach(side => {
            const bullets = this.existingBullets[side];
            bullets.forEach(bullet => {
                bulletsRect[side].push(bullet.getBoundingClientRect());
                bulletsPosition[side].push(
                    {
                        x: Number(bullet.dataset.x),
                        y: Number(bullet.dataset.y)
                    }
                );
            });
        });
        // console.log(bulletsRect);
        // console.log(bulletsPosition);
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