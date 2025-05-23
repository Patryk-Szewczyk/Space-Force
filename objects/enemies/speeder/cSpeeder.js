'use strict';

class Speeder extends Enemy {
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
    kind = 1;  // 1, 2, 3, 4, 5, 6 | speeder = 1
    type = undefined;  // 1, 2, 3, 4
    image = null;
    board = document.querySelector('.game-board');
    infoHp = undefined;  // todo przy tworzeniu elementu
    maxHp = 100;
    currentHp = 100;
    impactWithPlayerDamage = undefined;
    objectHitboxes = [];
    x = 0;
    y = 0;
    #speed = undefined;
    speedX = 0;
    speedY = 0;
    startPosition = undefined;
    direction = undefined;
    rotate = undefined;
    powerUp = undefined;
    observer = undefined;
    constructor(engine, player, type, speed, direction, startPosition, powerUp = false) {
        super();
        this.engineRef = engine;
        this.player = player;
        this.type = type;
        this.#speed = speed;
        this.startPosition = startPosition;
        this.direction = direction;
        this.powerUp = powerUp;
        this.#createObject();
        this.#selectType(type);
        this.#determineDirectionsSpeeds();
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
        this.#setWorker();
        this.#setPromiseDeath();
    }
    setChild_ID(id) {
        this.childrenId = id;
    }
    #setWorker() {
        this.worker = new Worker('/wp-content/themes/SpaceForceGame/objects/enemies/speeder/wSpeeder.js');
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
        object.setAttribute('class', 'speeder');
        for (let i = 0; i < 3; i++) {
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
        
        let startX = undefined
        let startY = undefined;
        let maxDimension = undefined;
        let percent = undefined;
        const boardRect = this.board.getBoundingClientRect();
        const objectRect = this.objectTag.getBoundingClientRect();
        const bonusSpace = 20;
        switch (this.startPosition.x) {
            case 'max%':
                startX = boardRect.width + bonusSpace;
                break;
            case 'min%':
                startX = (objectRect.width * -1) - bonusSpace;
                break;
            default:
                maxDimension = boardRect.width - (objectRect.width);
                percent = Number(this.startPosition.x.slice(0, -1));
                startX = maxDimension - (maxDimension * (percent / 100));
        }
        switch (this.startPosition.y) {
            case '-max%':
                startY = (boardRect.height * -1) - bonusSpace;
                break;
            default:
                maxDimension = ((boardRect.height - objectRect.height) * -1);
                percent = Number(this.startPosition.y.slice(0, -1));
                startY = maxDimension + (maxDimension * (percent / 100));
        }
        this.x = startX;
        this.y = startY;
        this.objectTag.style.transform = 'translate(' + this.x + 'px, ' + this.y + 'px)';
    }
    #selectType(type) {  // OK
        switch (type) {
            case 1:
              this.maxHp = 100;
              this.image.classList.add('image-1');
              break;
            case 2:
              this.maxHp = 175;
              this.image.classList.add('image-2');
              break;
            case 3:
              this.maxHp = 250;
              this.image.classList.add('image-3');
              break;
            case 4:
              this.maxHp = 325;
              this.image.classList.add('image-4');
              break;
        }
        this.currentHp = this.maxHp;
        this.impactWithPlayerDamage = this.maxHp / 3;
    }
    #determineDirectionsSpeeds() {
        const speed = this.#speed;  // + | y: ^ [-] | x: > [+]
        switch (this.direction) {
            case 'left':
                this.speedX = speed * -1;
                this.speedY = 0;
                this.rotate = 90;
                break;
            case 'right':
                this.speedX = speed;
                this.speedY = 0;
                this.rotate = -90;
                break;
            case 'bottom':
                this.speedX = 0;
                this.speedY = speed;
                this.rotate = 0;
                break;
            case 'bottomLeft':
                this.speedX = speed * -1;
                this.speedY = speed;
                this.rotate = 45;
                break;
            case 'bottomRight':
                this.speedX = speed;
                this.speedY = speed;
                this.rotate = -45;
                break;
        }
    }
    prepareObjectData() {
        const data = {
            speedX: this.speedX,
            speedY: this.speedY,
            x: this.x,
            y: this.y
        };
        this.engineRef.fromObjectPrepareData(data);
    }
    update(data) {
        this.x = data.x;
        this.y = data.y;
        this.objectTag.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotate}deg)`;
        this.#detectCollision();
    }
    #detectCollision() {
        let playerBullets = undefined;
        let playerHitboxes = undefined;
        let enemyHitboxes = this.objectHitboxes;
        playerBullets = document.querySelectorAll('.game-board > .player-bullet');
        playerHitboxes = document.querySelectorAll('.player > .hitbox');
        this.#detectPlayerBullets(playerBullets, enemyHitboxes);
        this.#detectPlayerHitboxes(playerHitboxes, enemyHitboxes);
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
    #deleteEnemy(byPlayer) {
        if (byPlayer) {
            Player.updateScore((this.kind * 500) + (this.type * 500));
            if (this.player.checkPlayerHpPowerUp()) {
                PowerUps.createPowerUp('hp', this.objectTag);
            } else {
                if (!this.powerUp) {
                Currency.createStarsGroup('speeder', this.type, this.objectTag);
                } else {
                    PowerUps.createPowerUp(this.powerUp, this.objectTag);
                }
            }
        }
        this.worker.terminate();
        this.board.removeChild(this.objectTag);
        this.isActive = false;
        this.resolveDelete();
    }
}





// update(dx, dy) {
//     this.x += dx;
//     this.y += dy;
//     this.speeder.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotate}deg)`;
//     this.#detectCollision();
// }