'use strict';

class AbyssCoreShootingOrb {
    childrenId = undefined;
    engineRef = undefined;
    isActive = true;
    handleWorkerPostmessage = undefined;
    parent = undefined;
    LOOP_createBullets = null;
    DELATY_betweenCreateBullets = null;
    #bulletWidth = 9;  // px
    #bulletHeight = 9;  // px
    existingBullets = {left: [], right: [], top: [], bottom: [], leftBottom: [], rightBottom: [], leftTop: [], rightTop: []};
    sides = ['left', 'right', 'top', 'bottom', 'leftBottom', 'rightBottom', 'leftTop', 'rightTop'];
    speedX = undefined;
    speedY = undefined;
    shootingArgs = {undefined};
    #board = document.querySelector('.game-board');
    #boardRect = this.#board.getBoundingClientRect();
    constructor(engine, parent, shootingArgs) {
        this.engineRef = engine;
        this.parent = parent;
        this.shootingArgs = shootingArgs.orb;
        this.speedX = shootingArgs.orb.speed;
        this.speedY = shootingArgs.orb.speed;
        this.#determineBulletsSpeed();
    }
    stopShooting() {
        const board = document.querySelector('.game-board');
        document.querySelectorAll('.player-bullet').forEach((bullet) => {
            board.removeChild(bullet);
        });
        clearInterval(this.LOOP_createBullets);
        clearTimeout(this.DELATY_betweenCreateBullets);
        this.DELATY_LOOP_createBullets = null;
        this.LOOP_createBullets = null;
        this.DELATY_betweenCreateBullets = null;
    }
    startShooting() {
        this.isActive = true;
        this.LOOP_createBullets = setInterval(() => {
            let bulletsCreated = 0;
            const createSingleBullet = () => {
                const bulletPosition = this.#determineBulletsStartPosition();
                this.sides.forEach(side => {
                    const bullet = document.createElement('div');
                    bullet.setAttribute('class', 'orb-bullet');
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
    }
    #determineBulletsSpeed() {
        const biasDivide = Math.SQRT2 / 2;  // Rzutowanie wektora na osie współrzędnych
        const leftX = this.speedX * -1;
        const leftY = 0;
        const rightX = this.speedX;
        const rightY = 0;
        const topX = 0;
        const topY = this.speedY * -1;
        const bottomX = 0;
        const bottomY = this.speedY;
        const leftBottomX = (this.speedX * -1) * biasDivide;
        const leftBottomY = this.speedY * biasDivide;
        const rightBottomX = this.speedX * biasDivide;
        const rightBottomY = this.speedY * biasDivide;
        const leftTopX = (this.speedX * -1) * biasDivide;
        const leftTopY = (this.speedY * -1) * biasDivide;
        const rightTopX = this.speedX * biasDivide;
        const rightTopY = (this.speedY * -1) * biasDivide;
        this.speedX = {
            left: leftX,
            right: rightX,
            top: topX,
            bottom: bottomX,
            leftBottom: leftBottomX,
            rightBottom: rightBottomX,
            leftTop: leftTopX,
            rightTop: rightTopX
        };
        this.speedY = {
            left: leftY,
            right: rightY,
            top: topY,
            bottom: bottomY,
            leftBottom: leftBottomY,
            rightBottom: rightBottomY,
            leftTop: leftTopY,
            rightTop: rightTopY
        };
    }
    #determineBulletsStartPosition() {
        const objectRect = this.parent.objectTag.getBoundingClientRect();
        const boardRect = this.#board.getBoundingClientRect();
        let bulletPositionX = objectRect.left - boardRect.left + ((objectRect.width / 2) - (this.#bulletWidth / 2));
        let bulletPositionY = objectRect.bottom - boardRect.bottom - ((objectRect.height / 2) - (this.#bulletHeight / 2));
        return {startX: bulletPositionX, startY: bulletPositionY};
    }
    prepareObjectChildData() {
        const bulletsRect = {left: [], right: [], top: [], bottom: [], leftBottom: [], rightBottom: [], leftTop: [], rightTop: []};
        const bulletsPosition = {left: [], right: [], top: [], bottom: [], leftBottom: [], rightBottom: [], leftTop: [], rightTop: []};
        this.sides.forEach(side => {
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