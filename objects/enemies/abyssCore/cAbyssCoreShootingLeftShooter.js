'use strict';

class AbyssCoreShootingLeftShooter {
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
        this.shootingArgs = shootingArgs.leftShooter;
        this.speedX = shootingArgs.leftShooter.speed;
        this.speedY = shootingArgs.leftShooter.speed;
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
                bullet.style.transform = `translate(${bullet.dataset.x}px, ${bullet.dataset.y}px)`;
                this.#board.appendChild(bullet);
                this.existingBullets.push(bullet);
                bulletsCreated++;
                if (bulletsCreated < this.shootingArgs.bulletsOnRound) {
                    this.DELATY_betweenCreateBullets = setTimeout(createSingleBullet, this.shootingArgs.gapBetweenRounds * 1000);
                }
            };
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
        const deviateX = 26;
        const deviateY = 5;
        let bulletPositionX = undefined;
        let bulletPositionY = undefined;
        bulletPositionX = objectRect.left - boardRect.left + ((objectRect.width / 2) - (this.#bulletWidth / 2) - deviateX) ;
        bulletPositionY = objectRect.bottom - boardRect.bottom + deviateY;
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