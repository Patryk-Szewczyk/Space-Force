'use strict';

class Flamer extends Enemy {
    engineRef = undefined;
    player = undefined;
    isActive = true;
    promiseDelete = undefined;
    resolveDelete = undefined;
    objectTag = null;
    worker = undefined;
    handleWorkerPostmessage = undefined;
    children = [];
    childrenId = undefined;
    kind = 4;  // 1, 2, 3, 4, 5, 6 | flamer = 4
    type = undefined;  // 1, 2, 3, 4
    image = null;
    movementType = undefined;
    movementArgs = undefined;
    movementCalculatedLimits = {left: undefined, right: undefined, top: undefined, bottom: undefined};
    shootingArgs = undefined;
    rotate = undefined
    shooting = undefined;
    board = document.querySelector('.game-board');
    infoHp = undefined;  // todo przy tworzeniu elementu
    maxHp = 100;
    currentHp = 100;
    impactWithPlayerDamage = undefined;
    damage = undefined
    objectHitboxes = [];
    x = 0;
    y = 0;
    speedX = 0;
    speedY = 0;
    startPosition = undefined;
    direction = undefined;
    powerUp = undefined;
    observer = undefined;
    constructor(engine, player, type, movementType, movementArgs, powerUp = false) {
        super();
        this.engineRef = engine;
        this.player = player;
        this.type = type;
        this.movementType = movementType;
        this.movementArgs = movementArgs;
        this.powerUp = powerUp;
        this.#createObject();
        this.#selectType(type);
        this.#determineRotateAndSpeedDirections();
        this.#determineStartPosition()
        this.observer = new EnemyObserver();
        this.observer.setEnemyObserver(
            this.objectTag,
            (object) => { },
            (object) => {
                if (this.board.contains(object)) {
                    this.#deleteEnemy(false);
                }
            }
        );
        this.shooting = new FlamerShooting(this.engineRef, this, this.shootingArgs);
        this.children.push(this.shooting);
        this.shooting.startShooting();
        this.#setWorker();
        this.#setPromiseDeath();
        
    }
    setChild_ID(id) {
        this.childrenId = id;
        this.children[0].childrenId = id;
    }
    #setWorker() {
        this.worker = new Worker('/wp-content/themes/SpaceForceGame/objects/enemies/flamer/wFlamer.js');
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
    #setPromiseDeath() {
        this.promiseDelete = new Promise(resolve => {
            this.resolveDelete = resolve;
        });
    }
    #createObject() {
        const object = document.createElement('div');
        object.setAttribute('class', 'flamer');
        for (let i = 0; i < 2; i++) {
            const hitbox = document.createElement('div');
            hitbox.setAttribute('class', 'hitbox');
            object.appendChild(hitbox);
            this.objectHitboxes[i] = hitbox;
        }
        const image = document.createElement('div');
        image.setAttribute('class', 'image');
        object.appendChild(image);
        const hp = document.createElement('div');
        hp.setAttribute('class', 'hp');
        const hpBar = document.createElement('div');
        hp.appendChild(hpBar);
        object.appendChild(hp);
        this.board.appendChild(object);
        this.objectTag = object;
        this.infoHp = hpBar;
        this.image = image;
    }
    #selectType(type) {  // OK
        switch (type) {
            case 1:
                this.maxHp = 250;
                this.damage = 1;
                this.shootingArgs = {bulletsOnRound: 40, speed: 300, fireRate: 2, gapBetweenRounds: 0.0125};
                this.image.classList.add('image-1');
                break;
            case 2:
                this.maxHp = 425;
                this.damage = 2;
                this.shootingArgs = {bulletsOnRound: 60, speed: 300, fireRate: 2, gapBetweenRounds: 0.0125};
                this.image.classList.add('image-2');
                break;
            case 3:
                this.maxHp = 625;
                this.damage = 2;
                this.shootingArgs = {bulletsOnRound: 80, speed: 300, fireRate: 2, gapBetweenRounds: 0.0125};
                this.image.classList.add('image-3');
                break;
            case 4:
                this.maxHp = 850;
                this.damage = 3;
                this.shootingArgs = {bulletsOnRound: 100, speed: 300, fireRate: 2, gapBetweenRounds: 0.0125};
                this.image.classList.add('image-4');
                break;
        }
        this.currentHp = this.maxHp;
        this.impactWithPlayerDamage = this.maxHp / 3;
    }
    #determineRotateAndSpeedDirections() {
        switch (this.movementType) {
            case 'horizontal': 
                switch (this.movementArgs.direction) {
                    case 'left':
                        this.rotate = 90;
                        this.movementArgs.speedX *= -1;
                        break;
                    case 'right':
                        this.rotate = -90;
                        break;
                }
                break;
            case 'bias':
                switch (this.movementArgs.direction) {
                    case 'bottomLeft':
                        this.rotate = 45;
                        this.movementArgs.speedX *= -1;
                        break;
                    case 'bottomRight':
                        this.rotate = -45;
                        break;
                    case 'topLeft':
                        this.rotate = 135;
                        this.movementArgs.speedX *= -1;
                        this.movementArgs.speedY *= -1;
                        break;
                    case 'topRight':
                        this.rotate = -135;
                        this.movementArgs.speedY *= -1;
                        break;
                }
                break;
            default:
                this.rotate = 0;
        }
    }
    #determineStartPosition() {  // TODO: Zrób też tak w Speeder
        const args = this.movementArgs;
        let startX = undefined
        let startY = undefined;
        let maxDimension = undefined;
        let percent = undefined;
        const boardRect = this.board.getBoundingClientRect();
        const objectRect = this.objectTag.getBoundingClientRect();
        const bonusSpace = 20;
        switch (this.movementType) {
            case 'bottom': {
                maxDimension = boardRect.width - (objectRect.width);
                percent = Number(args.x.slice(0, -1));
                startX = maxDimension - (maxDimension * (percent / 100));
                startY = (boardRect.height * -1) - bonusSpace;
            }
            break;
            case 'horizontal': {
                maxDimension = ((boardRect.height - objectRect.height) * -1);
                percent = Number(args.y.slice(0, -1));
                startY = maxDimension + (maxDimension * (percent / 100));
                switch (args.direction) {
                    case 'left':
                        startX = boardRect.width + bonusSpace;
                        break;
                    case 'right':
                        startX = (objectRect.width * -1) - bonusSpace;
                        break;
                }
            }
            break;
            case 'bias': {
                switch (args.x) {
                    case 'min%':
                        startX = (objectRect.width * -1) - bonusSpace;
                        break;
                    case 'max%':
                        startX = boardRect.width + bonusSpace;
                        break;
                    default:
                        maxDimension = boardRect.width - (objectRect.width);
                        percent = Number(args.x.slice(0, -1));
                        startX = maxDimension - (maxDimension * (percent / 100));
                }
                switch (args.y) {
                    case '-min%':
                        startY = objectRect.height + bonusSpace;
                        break;
                    case '-max%':
                        startY = (boardRect.height * -1) - bonusSpace;
                        break;
                    default:
                        maxDimension = (boardRect.height * -1);
                        percent = Number(args.y.slice(0, -1));
                        startY = maxDimension + (maxDimension * (percent / 100));
                }
            }
            break;
            case 'topWave': {
                let leftLimit = undefined;
                let rightLimit = undefined;
                let topLimit = undefined;
                let bottomLimit = undefined;
                const CSS__GAME_BOARD_player_info_height__HALF = 20;  // połowa wartości właściwości z CSS
                const spaceleft = (window.innerWidth - boardRect.width) / 2;
                const spaceTop = (((window.innerHeight - boardRect.height) / 2) - CSS__GAME_BOARD_player_info_height__HALF) * -1;

                maxDimension = boardRect.width - (objectRect.width);
                percent = Number(args.leftLimit.slice(0, -1));
                leftLimit = maxDimension - (maxDimension * (percent / 100)) + spaceleft;
                this.movementArgs.leftLimit = leftLimit;

                maxDimension = boardRect.width - (objectRect.width);
                percent = Number(args.rightLimit.slice(0, -1));
                rightLimit = maxDimension - (maxDimension * (percent / 100)) + spaceleft;
                this.movementArgs.rightLimit = rightLimit;

                maxDimension = boardRect.height;
                percent = Number(args.topLimit.slice(0, -1));
                topLimit = (maxDimension + (maxDimension * (percent / 100))) - spaceTop;
                this.movementArgs.topLimit = topLimit;

                maxDimension = boardRect.height;
                percent = Number(args.bottomLimit.slice(0, -1));
                bottomLimit = (maxDimension + (maxDimension * (percent / 100))) - spaceTop;
                this.movementArgs.bottomLimit = bottomLimit;

                startX = (leftLimit + rightLimit) / 2 - spaceleft;
                startY = (boardRect.height * -1) - bonusSpace;
                
                const stopY = (topLimit + bottomLimit) / 2;
                this.movementArgs.stopY = stopY;

                if (args.direction == 'left') {
                    this.movementArgs.speedX *= -1;
                }

                this.movementArgs.onPosition = false;
            }
            break;
            case 'topZigzag': {
                let leftLimit = undefined;
                let rightLimit = undefined;
                const spaceleft = (window.innerWidth - boardRect.width) / 2;

                maxDimension = boardRect.width - (objectRect.width);
                percent = Number(args.leftLimit.slice(0, -1));
                leftLimit = maxDimension - (maxDimension * (percent / 100)) + spaceleft;
                this.movementArgs.leftLimit = leftLimit;

                maxDimension = boardRect.width - (objectRect.width);
                percent = Number(args.rightLimit.slice(0, -1));
                rightLimit = maxDimension - (maxDimension * (percent / 100)) + spaceleft;
                this.movementArgs.rightLimit = rightLimit;

                startX = (leftLimit + rightLimit) / 2 - spaceleft;
                startY = (boardRect.height * -1) - bonusSpace;

                if (args.direction == 'left') {
                    this.movementArgs.speedX *= -1;
                }
            }
            break;
        }
        this.x = startX;
        this.y = startY;
        this.objectTag.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotate}deg)`;
    }
    prepareObjectData() {
        this.movementArgs.parentRect = this.objectTag.getBoundingClientRect();
        const data = {
            movementType: this.movementType,
            movementArgs: this.movementArgs,
            x: this.x,
            y: this.y,
        };
        this.engineRef.fromObjectPrepareData(data);
    }
    update(data) {
        const dataParent = data.parent;
        if (dataParent.speedX && dataParent.speedX != undefined) {
            this.movementArgs.speedX = dataParent.speedX;
        }
        if (dataParent.speedY && dataParent.speedY != undefined) {
            this.movementArgs.speedY = dataParent.speedY;
        }
        if (dataParent.onPosition && dataParent.onPosition != undefined) {
            this.movementArgs.onPosition = dataParent.onPosition;
        }
        this.x = dataParent.x;
        this.y = dataParent.y;
        this.objectTag.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotate}deg)`;
        if (data.cannon) {
            const dataCannon = data.cannon;
            if (dataCannon.length > 0) {
                const bullets = this.shooting.existingBullets;
                for (let i = dataCannon.length - 1; i >= 0; i--) {
                    if (
                        dataCannon[i] === false &&
                        bullets[i]
                    ) {
                        this.board.removeChild(bullets[i]);
                        bullets.splice(i, 1);
                    } else if (
                        dataCannon[i] !== false &&
                        bullets[i] &&
                        bullets[i].dataset
                    ) {
                        bullets[i].dataset.x = dataCannon[i].x;
                        bullets[i].dataset.y = dataCannon[i].y;
                        bullets[i].style.transform = 'translate(' + dataCannon[i].x + 'px, ' + dataCannon[i].y + 'px) ' + 'rotate(' + this.shooting.rotate + 'deg)';
                    }
                }
            }
        }
        this.#detectCollision();
    }
    #detectCollision() {
        const playerBullets = document.querySelectorAll('.game-board > .player-bullet');;
        const playerHitboxes = document.querySelectorAll('.player .hitbox');
        const enemyHitboxes = this.objectHitboxes;
        const enemyExistingBullets = this.shooting.existingBullets;
        this.#detectPlayerBullets(playerBullets, enemyHitboxes);
        this.#detectPlayerHitboxes(playerHitboxes, enemyHitboxes);
        this.#detectEnemyHitPlayer(playerHitboxes, enemyExistingBullets);
    }
    #detectPlayerBullets(playerBullets, enemyHitboxes) {
        // Zderzenie pocisku gracza z wrogiem
        let bullet = undefined;
        let hitbox = undefined;
        for (let i = 0; i < playerBullets.length; i++) {
            bullet = playerBullets[i].getBoundingClientRect();
            for (let j = 0; j < enemyHitboxes.length; j++) {
                hitbox = enemyHitboxes[j].getBoundingClientRect();
                if (
                    bullet.top < hitbox.bottom &&
                    bullet.bottom > hitbox.top &&
                    bullet.left < hitbox.right &&
                    bullet.right > hitbox.left
                ) {
                    if (this.currentHp > 0) {
                        this.currentHp -= Player.damage;
                        Enemy.updateEnemyHp(this);
                        // if (playerBullets[i]?.parentElement === board) {
                            Player.board.removeChild(playerBullets[i]);
                        // }
                        if (this.currentHp <= 0) {
                            this.#deleteEnemy(true);
                        }
                        break;
                    }
                }
            }
        }
    }
    #detectPlayerHitboxes(playerHitboxes, enemyHitboxes) {
        // Zderzenie gracza z wrogiem
        let playerHitbox = undefined;
        let enemyHitbox = undefined;
        for (let i = 0; i < playerHitboxes.length; i++) {
            playerHitbox = playerHitboxes[i].getBoundingClientRect();
            for (let j = 0; j < enemyHitboxes.length; j++) {
                enemyHitbox = enemyHitboxes[j].getBoundingClientRect();
                if (
                    playerHitbox.top < enemyHitbox.bottom &&
                    playerHitbox.bottom > enemyHitbox.top &&
                    playerHitbox.left < enemyHitbox.right &&
                    playerHitbox.right > enemyHitbox.left
                ) {
                    if (Player.currentHp > 0) {
                        Player.currentHp -= this.impactWithPlayerDamage;
                        Player.updateHpBar(Player.currentHp);
                        this.#deleteEnemy(true);
                        if (Player.currentHp <= 0) {
                            Player.deletePlayer(this.player);
                        }
                        break;
                    }
                }
            }
        }
    }
    #detectEnemyHitPlayer(playerHitboxes, enemyExistingBullets) {
        let playerHitbox = undefined;
        let enemyBullet = undefined;
        for (let i = 0; i < playerHitboxes.length; i++) {
            playerHitbox = playerHitboxes[i].getBoundingClientRect();
            for (let j = 0; j < enemyExistingBullets.length; j++) {
                enemyBullet = enemyExistingBullets[j].getBoundingClientRect();
                if (
                    playerHitbox.top < enemyBullet.bottom &&
                    playerHitbox.bottom > enemyBullet.top &&
                    playerHitbox.left < enemyBullet.right &&
                    playerHitbox.right > enemyBullet.left
                ) {
                    if (Player.currentHp > 0) {
                        Player.currentHp -= this.damage;
                        Player.updateHpBar(Player.currentHp);
                        this.board.removeChild(enemyExistingBullets[j]);
                        this.shooting.existingBullets.splice(j, 1);
                        if (Player.currentHp <= 0) {
                            Player.deletePlayer(this.player);
                        }
                        break;
                    }
                }
            }
        }
    }
    #deleteEnemy(byPlayer) {
        if (byPlayer) {
            Player.updateScore((this.kind * 500) + (this.type * 500));
            if (this.player.checkPlayerHpPowerUp()) {
                PowerUps.createPowerUp('hp', this.objectTag);
            } else {
                if (!this.powerUp) {
                Currency.createStarsGroup('flamer', this.type, this.objectTag);
                } else {
                    PowerUps.createPowerUp(this.powerUp, this.objectTag);
                }
            }
        }
        this.children[0].isActive = false;
        this.isActive = false;
        this.worker.terminate();
        this.board.removeChild(this.objectTag);
        this.shooting.stopShooting();
        this.deleteAllEnemyBullets();
        this.resolveDelete();
    }
    deleteAllEnemyBullets() {
        if (this.shooting.existingBullets.length > 0) {
            this.shooting.existingBullets.forEach(bullet => {
                this.board.removeChild(bullet);
            });
        }
        this.shooting.existingBullets = [];
    }
}