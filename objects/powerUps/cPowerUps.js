'use-strict';

class PowerUps {
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
    valueHp = 20;  // +%
    valueFireRate = undefined; // -
    #board = document.querySelector('.game-board');
    #boardRect = this.#board.getBoundingClientRect();
    constructor(engine, speed) {
        this.engineRef = engine;
        this.speedY = speed;
        this.#setWorker();
        this.valueFireRate = Player.fireRate.upgradeValue;
    }
    setChild_ID(id) {
        this.childrenId = id;
    }
    #setWorker() {
        this.worker = new Worker('/wp-content/themes/SpaceForceGame/objects/powerUps/wPowerUps.js');
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
    static createPowerUp(powerUpType, enemyObject) {
        const board = document.querySelector('.game-board');
        const boardRect = board.getBoundingClientRect();
        const enemyRect = enemyObject.getBoundingClientRect();
        const powerUp = document.createElement('div');
        powerUp.setAttribute('class', 'power-up');
        const image = document.createElement('div');
        image.setAttribute('class', 'image');
        let powerUpSize = 30;
        switch (powerUpType) {
            case 'hp':
                image.classList.add('hp');
                break;
            case 'fire-rate':
                image.classList.add('fire-rate');
                break;
        }
        powerUp.style.width = powerUpSize + 'px';
        powerUp.style.height = powerUpSize + 'px';
        powerUp.dataset.x = (enemyRect.left - boardRect.left) + ((enemyRect.width / 2) - (powerUpSize / 2));
        powerUp.dataset.y = (enemyRect.bottom - boardRect.bottom) - ((enemyRect.height / 2) - (powerUpSize / 2));
        powerUp.style.transform = 'translate(' + powerUp.dataset.x + 'px, ' + powerUp.dataset.y + 'px)';
        powerUp.appendChild(image);
        board.appendChild(powerUp);
    }
    prepareObjectData() {
        const powerUps = document.querySelectorAll('.game-board > .power-up');
        let powerUpsRect = [];
        let powerUpsPosition = [];
        powerUps.forEach(powerUp => {
            powerUpsRect.push(powerUp.getBoundingClientRect());
            powerUpsPosition.push(
                {
                    x: Number(powerUp.dataset.x),
                    y: Number(powerUp.dataset.y)
                }
            );
        });
        const data = {
            boardRect: this.#boardRect,
            powerUpsRect: powerUpsRect,
            powerUpsPosition: powerUpsPosition,
            speedY: this.speedY
        };
        this.engineRef.fromObjectPrepareData(data);
    }
    update(data) {
        const powerUps = document.querySelectorAll('.game-board > .power-up');
        if (data.length == 0) {
            return;
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i] == false) {
                this.#board.removeChild(powerUps[i]);
            } else if (
                data[i] != false &&
                powerUps[i] &&
                powerUps[i].dataset
            ) {
                powerUps[i].dataset.y = data[i].y;
                powerUps[i].style.transform = 'translate(' + data[i].x + 'px, ' + data[i].y + 'px)';
            }
        }
        this.#detectPlayer(powerUps);
    }
    #detectPlayer(powerUps) {
        const playerHitboxes = document.querySelectorAll('.player > .hitbox');
        let powerUp = undefined;
        let hitbox = undefined;
        for (let i = 0; i < powerUps.length; i++) {
            powerUp = powerUps[i].getBoundingClientRect();
            for (let j = 0; j < playerHitboxes.length; j++) {
                hitbox = playerHitboxes[j].getBoundingClientRect();
                if (
                    powerUp.top < hitbox.bottom &&
                    powerUp.bottom > hitbox.top &&
                    powerUp.left < hitbox.right &&
                    powerUp.right > hitbox.left
                ) {
                    switch (powerUps[i].firstElementChild.classList[1]) {
                        case 'hp':
                            if (Player.currentHp < Player.maxHp) {
                                const max = Player.maxHp;
                                const toPercent = this.valueHp;
                                const percentDifferential = max * ((toPercent - 100) / -100);
                                const result = max - percentDifferential;
                                const newHp = Player.currentHp + result;
                                if (newHp > max) {
                                    Player.currentHp = max;
                                } else if (newHp < 0) {
                                    Player.currentHp = 0;
                                } else {
                                    Player.currentHp += result;
                                }
                                Player.updateHpBar(Player.currentHp);
                            }
                            break;
                        case 'fire-rate':
                            if (Player.fireRate.currentUpdate < Player.fireRate.upgradesAmount) {
                                Player.fireRate.currentUpdate++;
                                Player.fireRate.currentValue -= this.valueFireRate;
                                Player.updateFireRateBar(Player.fireRate.currentUpdate);
                                Player.shooting.stopShooting();
                                Player.shooting.startShooting();
                            }
                            break;
                    }
                    document.querySelector('.game-board').removeChild(powerUps[i]);
                    break;
                }
            }
        }
    }
}



// Stary update(): (synchroniczny)
// update(dx, dy) {
//     const powerUps = document.querySelectorAll('.game-board > .power-up');
//     if (powerUps.length == 0) {
//         return;
//     }
//     const board = document.querySelector('.game-board');
//     const boardRect = board.getBoundingClientRect();
//     for (let i = 0; i < powerUps.length; i++) {
//         const powerUpRect = powerUps[i].getBoundingClientRect();
//         if (powerUpRect.top > boardRect.bottom) {
//             board.removeChild(powerUps[i]);
//         } else {
//             let x = Number(powerUps[i].dataset.x);
//             let y = Number(powerUps[i].dataset.y);
//             y += dy;
//             powerUps[i].dataset.y = y;
//             powerUps[i].style.transform = 'translate(' + x + 'px, ' + y + 'px)';
//         }
//     }
//     this.#detectPlayer(powerUps);
// }