'use strict';

class Player {
    engineRef = undefined;
    isActive = true;
    static player = null;
    static worker = undefined;
    handleWorkerPostmessage = undefined;
    promiseDelete = undefined;
    static resolveDelete = undefined;
    children = [];
    childrenId = undefined;
    static level = undefined;
    x = 0;
    y = 0;
    #speed = undefined;
    speedX = 0;
    speedY = 0;
    key = '';
    direction = null;
    directions = [];
    board = document.querySelector('.game-board');
    static board = document.querySelector('.game-board');
    static shooting = null;
    static infoHp = document.querySelector('.player-info .hp div');
    static infoFireRate = document.querySelector('.player-info .fire-rate div');
    static infoScore = document.querySelector('.player-info .score');
    static infoStars = document.querySelector('.player-info .star-counter');
    LOOP_shootong = false;
    LOOP_shootingBorderDelete = undefined;
    static fireRate = {
        max: 0.55,
        min: 0.1,
        upgradeValue: undefined,
        currentValue: undefined,
        upgradesAmount: 7,
        currentUpdate: 1
    };
    static maxHp = undefined;
    static currentHp = undefined;
    static restoreHpLimitPercent = [80, 50, 30];  // mniejsze od n% - ilość hp gracza od którego (w dół) należy się szansa na hp
    static restoreHpChance = [15, 33, 66];  // n% - szansa na odzyskanie hp - POPRZEDNIO: [10, 25, 50]
    static restoreHpLimitValue = [];
    static damage = undefined;
    static bulletSpeed = undefined;
    constructor(engine, level, hp, damage) {
        this.engineRef = engine;
        Player.level = level;
        this.#speed = 350;
        Player.bulletSpeed = 500;
        this.#createPlayer();
        Player.maxHp = hp;
        Player.currentHp = Player.maxHp;
        Player.restoreHpLimitPercent.forEach(el => {
            Player.restoreHpLimitValue.push((el / 100) * Player.maxHp);
        });
        Player.damage = damage;
        Player.updateHpBar(Player.currentHp);
        Player.setFireRateUpgradeValue(Player.fireRate.max, Player.fireRate.min, Player.fireRate.upgradesAmount);
        Player.updateFireRateBar(Player.fireRate.currentUpdate);
        Player.shooting = new PlayerShooting(this.engineRef, Player.bulletSpeed, this);
        this.children.push(Player.shooting);
        Player.shooting.startShooting();
        this.#setWorker();
        this.#setPromiseDeathOrWin();
    }
    setChild_ID(id) {
        this.childrenId = id;
        this.children[0].childrenId = id;
    }
    #setWorker() {
        Player.worker = new Worker('/wp-content/themes/SpaceForceGame/objects/player/wPlayer.js');
        this.handleWorkerPostmessage = (data) => {
            return new Promise((resolve) => {
                Player.worker.onmessage = (e) => {
                    navigator.locks.request("engine-lock", async () => {
                        const responseData = {
                            id: e.data.id,
                            payload: e.data.futurePosition
                        };
                        await this.engineRef.fromWorkerData(responseData);
                        resolve();
                    });
                };
                Player.worker.postMessage(data);
            });
        };
    }
    #setPromiseDeathOrWin() {
        this.promiseDelete = new Promise(resolve => {
            Player.resolveDelete = resolve;
        });
    }
    #createPlayer() {
        const player = document.createElement('div');
        player.setAttribute('class', 'player');
        for (let i = 0; i < 3; i++) {
            const hitbox = document.createElement('div');
            hitbox.setAttribute('class', 'hitbox');
            player.appendChild(hitbox);
        }
        document.querySelector('.game-board').appendChild(player);
        this.x = ((Player.board.getBoundingClientRect().width / 2) - (player.getBoundingClientRect().width / 2));
        this.y = -100
        player.style.transform = 'translate(' + this.x  + 'px, ' + this.y + 'px)';
        Player.player = player;
    }
    prepareObjectData() {
        const boardRect = Player.board.getBoundingClientRect();
        const playerRect = Player.player.getBoundingClientRect();
        const data = {
            speed: this.#speed,
            speedX: this.speedX,
            speedY: this.speedY,
            x: this.x,
            y: this.y,
            directions: this.directions,
            boardRect: boardRect,
            playerRect: playerRect
        };
        this.engineRef.fromObjectPrepareData(data);
    }
    update(data) {
        const dataPlayer = data.player;
        this.speedX = dataPlayer.speedX;
        this.speedY = dataPlayer.speedY;
        this.x = dataPlayer.x;
        this.y = dataPlayer.y;
        Player.player.style.transform = `translate(${this.x}px, ${this.y}px)`;
        if (data.cannon) {
            const dataCannon = data.cannon;
            if (dataCannon.length == 0) {
                return;
            }
            const bullets = document.querySelectorAll('.player-bullet');
            for (let i = 0; i < dataCannon.length; i++) {
                if (
                    dataCannon[i] == false
                    && bullets[i]
                ) {
                    Player.board.removeChild(bullets[i]);
                } else if (
                    dataCannon[i] != false
                    && bullets[i]  // przy złapaniu powerupa mam undefined przy pociskach i z tego powodu jest tu ten rozszerzony if
                    && bullets[i].dataset
                ) {
                    bullets[i].dataset.y = dataCannon[i].y;
                    bullets[i].style.transform = 'translate(' + dataCannon[i].x + 'px, ' + dataCannon[i].y + 'px)';
                }
            }
        }
    }
    #keyDown(e) {
        const key = e.key;
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
            return;
        }
        this.direction = e.key;
        if (this.directions.includes(key)) {
            return;
        }
        if (this.directions.length > 2) {
            return;
        }
        this.directions.push(key);
    }
    #keyUp(e) {
        const key = e.key;
        const index = this.directions.indexOf(key);
        if (index !== -1) {
            this.directions.splice(index, 1); // usunięcie danego kieruneku
        }
    }
    #handleKeyDown = (e) => this.#keyDown(e);
    #handleKeyUp = (e) => this.#keyUp(e);
    setAEL() {
        document.addEventListener('keydown', this.#handleKeyDown, false);
        document.addEventListener('keyup', this.#handleKeyUp, false);
    }
    removeAEL() {
        document.removeEventListener('keydown', this.#handleKeyDown, false);
        document.removeEventListener('keyup', this.#handleKeyUp, false);
    }
    checkPlayerHpPowerUp() {
        let isHp = false;
        let limitBreakerCounter = -1;
        limitBreakerCounter = -1;
        Player.restoreHpLimitValue.forEach(el => {
            if (Player.currentHp <= el) {
                limitBreakerCounter++;
            }
        });
        if (limitBreakerCounter != -1) {
            if (Math.random() * 100 < Player.restoreHpChance[limitBreakerCounter]) {
                isHp = true;
            }
        }
        return isHp;
    }
    static updateHpBar(hp) {
        if (hp <= 0) {
            Player.infoHp.style.width = '0%';
            return;
        }
        Player.infoHp.style.width = ((hp / Player.maxHp) * 100) + '%';
    }
    static setFireRateUpgradeValue(max, min, upgradesAmount) {
        const fireRate = ((min - max) / (upgradesAmount - 1)).toFixed(5);
        Player.fireRate.upgradeValue = fireRate * -1;
        Player.fireRate.currentValue = Player.fireRate.max;
    }
    static updateFireRateBar(currentUpgrade) {
        let newFireRate = 0;
        if (currentUpgrade == Player.fireRate.upgradesAmount) {
            newFireRate = 100;
        } else {
            newFireRate = ((currentUpgrade / Player.fireRate.upgradesAmount) * 100).toFixed(0);
        }
        Player.infoFireRate.style.width = newFireRate + '%';

    }
    static updateScore(points) {
        let fullLength = Ranking.scoreZeroAmount;
        let result = Number(Player.infoScore.textContent) + points;
        let resultLength = String(result).length;
        let newValue = '';
        for (let i = 0; i < (fullLength - resultLength); i++) {
            newValue += '0';
        }
        newValue += String(result);
        Player.infoScore.textContent = newValue;
    }
    static deletePlayer(player) {  // TODO: this.removeAEL(); - Ta linia kodu ma być w levelach, na końcu, ALE jeszcze o tym pomyśl. WIEM, weź utwórz specjalną klasę do obsugi końca gry,
        player.children[0].isActive = false;               // ^ wychwytującą kiedy gracza pada i co dalej, która przechowuje obiekt gracza, a deklaruje się ją w levelach.
        player.isActive = false;
        Player.worker.terminate();
        Player.board.removeChild(Player.player);
        Player.shooting.stopShooting();
        Player.updateFireRateBar(0);
        Player.resolveDelete();
    }
}