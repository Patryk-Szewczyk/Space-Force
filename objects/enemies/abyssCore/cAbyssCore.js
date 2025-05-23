'use strict';

class AbyssCore extends Enemy {
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
    // kind = 7;  // 1, 2, 3, 4, 5, 6 | abyssCore = 7
    // type = undefined;  // 1, 2, 3, 4
    image = null;
    movementType = undefined;
    movementArgs = undefined;
    shootingArgs = {shooter: {}, multi: {}, flamer: {}, bomber: {}, orb: {}};
    rotate = undefined;
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
    // observer = undefined;
    constructor(engine, player, movementType, movementArgs) {
        super();
        this.engineRef = engine;
        this.player = player;
        this.movementType = movementType;
        this.movementArgs = movementArgs;
        this.#createObject();
        this.#selectType();
        this.#determineRotateAndSpeedDirections();
        this.#determineStartPosition()
        this.observer = new EnemyObserver();
        // this.observer.setEnemyObserver(
        //     this.objectTag,
        //     (object) => { },
        //     (object) => {
        //         if (this.board.contains(object)) {
        //             this.#deleteEnemy(false);
        //         }
        //     }
        // );
        this.children.push(new AbyssCoreShootingOrb(this.engineRef, this, this.shootingArgs));
        this.children.push(new AbyssCoreShootingMulti(this.engineRef, this, this.shootingArgs));
        this.children.push(new AbyssCoreShootingLeftShooter(this.engineRef, this, this.shootingArgs));
        this.children.push(new AbyssCoreShootingRightShooter(this.engineRef, this, this.shootingArgs));
        this.children.push(new AbyssCoreShootingLeftFlamer(this.engineRef, this, this.shootingArgs));
        this.children.push(new AbyssCoreShootingRightFlamer(this.engineRef, this, this.shootingArgs));
        this.children.push(new AbyssCoreShootingLeftBomber(this.engineRef, this, this.shootingArgs));
        this.children.push(new AbyssCoreShootingRightBomber(this.engineRef, this, this.shootingArgs));
        this.children.forEach(child => {
            child.startShooting();
        });
        this.#setWorker();
        this.#setPromiseDeath();
        
    }
    setChild_ID(id) {
        this.childrenId = id;
        this.children.forEach(child => {
            child.childrenId = id;
        });
    }
    #setWorker() {
        this.worker = new Worker('/wp-content/themes/SpaceForceGame/objects/enemies/abyssCore/wAbyssCore.js');
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
        object.setAttribute('class', 'abyss-core');
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
    }
    #selectType() {
        this.maxHp = 30000;
        this.damage = {shooter: 45, multi: 32, flamer: 3, bomber: 80, orb: 40};
        this.shootingArgs.orb = {bulletsOnRound: 2, speed: 125, fireRate: 3, gapBetweenRounds: 0.75};
        this.shootingArgs.multi = {bulletsOnRound: 2, speed: 300, fireRate: 3, gapBetweenRounds: 0.4};
        this.shootingArgs.leftShooter = {bulletsOnRound: 2, speed: 300, fireRate: 2, gapBetweenRounds: 0.2};
        this.shootingArgs.rightShooter = {bulletsOnRound: 2, speed: 300, fireRate: 2, gapBetweenRounds: 0.2};
        this.shootingArgs.leftFlamer = {bulletsOnRound: 60, speed: 300, fireRate: 5, gapBetweenRounds: 0.0125};
        this.shootingArgs.rightFlamer = {bulletsOnRound: 60, speed: 300, fireRate: 5, gapBetweenRounds: 0.0125};
        this.shootingArgs.leftBomber = {bulletsOnRound: 2, speed: 150, fireRate: 4.5, gapBetweenRounds: 1.5};
        this.shootingArgs.rightBomber = {bulletsOnRound: 2, speed: 150, fireRate: 4.5, gapBetweenRounds: 1.5};
        this.image.classList.add('image-1');
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
    #determineStartPosition() {
        const args = this.movementArgs;
        let startX = undefined
        let startY = undefined;
        let maxDimension = undefined;
        let percent = undefined;
        const boardRect = this.board.getBoundingClientRect();
        const objectRect = this.objectTag.getBoundingClientRect();
        const bonusSpace = 20;
        switch (this.movementType) {
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
        
        if (data.cannon_orb) {
            this.children[0].sides.forEach(side => {
                const dataCannon_orb = data.cannon_orb[side];
                if (dataCannon_orb.length > 0) {
                    const bullets = this.children[0].existingBullets[side];
                    for (let i = dataCannon_orb.length - 1; i >= 0; i--) {
                        if (
                            dataCannon_orb[i] === false &&
                            bullets[i]
                        ) {
                            this.board.removeChild(bullets[i]);
                            bullets.splice(i, 1);
                        } else if (
                            dataCannon_orb[i] !== false &&
                            bullets[i] &&
                            bullets[i].dataset
                        ) {
                            bullets[i].dataset.x = dataCannon_orb[i].x;
                            bullets[i].dataset.y = dataCannon_orb[i].y;
                            bullets[i].style.transform = 'translate(' + dataCannon_orb[i].x + 'px, ' + dataCannon_orb[i].y + 'px) ';
                        }
                    }
                }
            });
        }
        
        if (data.cannon_multi) {
            ['left', 'center', 'right'].forEach(side => {
                const dataCannon_multi = data.cannon_multi[side];
                if (dataCannon_multi.length > 0) {
                    const bullets = this.children[1].existingBullets[side];
                    for (let i = dataCannon_multi.length - 1; i >= 0; i--) {
                        if (
                            dataCannon_multi[i] === false &&
                            bullets[i]
                        ) {
                            this.board.removeChild(bullets[i]);
                            bullets.splice(i, 1);
                        } else if (
                            dataCannon_multi[i] !== false &&
                            bullets[i] &&
                            bullets[i].dataset
                        ) {
                            bullets[i].dataset.x = dataCannon_multi[i].x;
                            bullets[i].dataset.y = dataCannon_multi[i].y;
                            bullets[i].style.transform = 'translate(' + dataCannon_multi[i].x + 'px, ' + dataCannon_multi[i].y + 'px) ';
                        }
                    }
                }
            });
        }

        if (data.cannon_leftShooter) {
            const dataCannon = data.cannon_leftShooter;
            if (dataCannon.length > 0) {
                const bullets = this.children[2].existingBullets;
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
                        bullets[i].style.transform = 'translate(' + dataCannon[i].x + 'px, ' + dataCannon[i].y + 'px)';
                    }
                }
            }
        }

        if (data.cannon_rightShooter) {
            const dataCannon = data.cannon_rightShooter;
            if (dataCannon.length > 0) {
                const bullets = this.children[3].existingBullets;
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
                        bullets[i].style.transform = 'translate(' + dataCannon[i].x + 'px, ' + dataCannon[i].y + 'px)';
                    }
                }
            }
        }

        if (data.cannon_leftFlamer) {
            const dataCannon = data.cannon_leftFlamer;
            if (dataCannon.length > 0) {
                const bullets = this.children[4].existingBullets;
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
                        bullets[i].style.transform = 'translate(' + dataCannon[i].x + 'px, ' + dataCannon[i].y + 'px)';
                    }
                }
            }
        }

        if (data.cannon_rightFlamer) {
            const dataCannon = data.cannon_rightFlamer;
            if (dataCannon.length > 0) {
                const bullets = this.children[5].existingBullets;
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
                        bullets[i].style.transform = 'translate(' + dataCannon[i].x + 'px, ' + dataCannon[i].y + 'px)';
                    }
                }
            }
        }

        if (data.cannon_leftBomber) {
            const dataCannon = data.cannon_leftBomber;
            if (dataCannon.length > 0) {
                const bullets = this.children[6].existingBullets;
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
                        bullets[i].style.transform = 'translate(' + dataCannon[i].x + 'px, ' + dataCannon[i].y + 'px)';
                    }
                }
            }
        }

        if (data.cannon_rightBomber) {
            const dataCannon = data.cannon_rightBomber;
            if (dataCannon.length > 0) {
                const bullets = this.children[7].existingBullets;
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
                        bullets[i].style.transform = 'translate(' + dataCannon[i].x + 'px, ' + dataCannon[i].y + 'px)';
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
        const enemyExistingBullets = {
            array_orb: this.children[0].existingBullets,
            array_multi: this.children[1].existingBullets,
            array_leftShooter: this.children[2].existingBullets,
            array_rightShooter: this.children[3].existingBullets,
            array_leftFlamer: this.children[4].existingBullets,
            array_rightFlamer: this.children[5].existingBullets,
            array_leftBomber: this.children[6].existingBullets,
            array_rightBomber: this.children[7].existingBullets
        };
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
                        // this.#deleteEnemy(true);
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
            [
                'array_orb',
                'array_multi',
                'array_leftShooter',
                'array_rightShooter',
                'array_leftFlamer',
                'array_rightFlamer',
                'array_leftBomber',
                'array_rightBomber'
            ].forEach(bulletsArray => {
                switch(bulletsArray) {
                    case 'array_orb':
                        this.children[0].sides.forEach(side => {
                            for (let j = 0; j < enemyExistingBullets[bulletsArray][side].length; j++) {
                                enemyBullet = enemyExistingBullets[bulletsArray][side][j].getBoundingClientRect();
                                if (
                                    playerHitbox.top < enemyBullet.bottom &&
                                    playerHitbox.bottom > enemyBullet.top &&
                                    playerHitbox.left < enemyBullet.right &&
                                    playerHitbox.right > enemyBullet.left
                                ) {
                                    if (Player.currentHp > 0) {
                                        Player.currentHp -= this.damage.orb;
                                        this.board.removeChild(enemyExistingBullets[bulletsArray][side][j]);
                                        this.children[0].existingBullets[side].splice(j, 1);
                                        Player.updateHpBar(Player.currentHp);
                                        if (Player.currentHp <= 0) {
                                            Player.deletePlayer(this.player);
                                        }
                                        break;
                                    }
                                }
                            }
                        });
                        break;
                    case 'array_multi':
                        ['left', 'center', 'right'].forEach(side => {
                            for (let j = 0; j < enemyExistingBullets[bulletsArray][side].length; j++) {
                                enemyBullet = enemyExistingBullets[bulletsArray][side][j].getBoundingClientRect();
                                if (
                                    playerHitbox.top < enemyBullet.bottom &&
                                    playerHitbox.bottom > enemyBullet.top &&
                                    playerHitbox.left < enemyBullet.right &&
                                    playerHitbox.right > enemyBullet.left
                                ) {
                                    if (Player.currentHp > 0) {
                                        Player.currentHp -= this.damage.multi;
                                        this.board.removeChild(enemyExistingBullets[bulletsArray][side][j]);
                                        this.children[1].existingBullets[side].splice(j, 1);
                                        Player.updateHpBar(Player.currentHp);
                                        if (Player.currentHp <= 0) {
                                            Player.deletePlayer(this.player);
                                        }
                                        break;
                                    }
                                }
                            }
                        });
                        break;
                    default:
                        for (let j = 0; j < enemyExistingBullets[bulletsArray].length; j++) {
                            enemyBullet = enemyExistingBullets[bulletsArray][j].getBoundingClientRect();
                            if (
                                playerHitbox.top < enemyBullet.bottom &&
                                playerHitbox.bottom > enemyBullet.top &&
                                playerHitbox.left < enemyBullet.right &&
                                playerHitbox.right > enemyBullet.left
                            ) {
                                if (Player.currentHp > 0) {
                                    this.board.removeChild(enemyExistingBullets[bulletsArray][j]);
                                    switch(bulletsArray) {
                                        case 'array_leftShooter':
                                            this.children[2].existingBullets.splice(j, 1);
                                            Player.currentHp -= this.damage.shooter;
                                            break;
                                        case 'array_rightShooter':
                                            this.children[3].existingBullets.splice(j, 1);
                                            Player.currentHp -= this.damage.shooter;
                                            break;
                                        case 'array_leftFlamer':
                                            this.children[4].existingBullets.splice(j, 1);
                                            Player.currentHp -= this.damage.flamer;
                                            break;
                                        case 'array_rightFlamer':
                                            this.children[5].existingBullets.splice(j, 1);
                                            Player.currentHp -= this.damage.flamer;
                                            break;
                                        case 'array_leftBomber':
                                            this.children[6].existingBullets.splice(j, 1);
                                            Player.currentHp -= this.damage.bomber;
                                            break;
                                        case 'array_rightBomber':
                                            this.children[7].existingBullets.splice(j, 1);
                                            Player.currentHp -= this.damage.bomber;
                                            break;
                                    }
                                    Player.updateHpBar(Player.currentHp);
                                    if (Player.currentHp <= 0) {
                                        Player.deletePlayer(this.player);
                                    }
                                    break;
                                }
                            }
                        }
                }
            });
        }
    }
    #deleteEnemy(byPlayer) {
        if (byPlayer) {
            Player.updateScore(100000);
            if (!this.powerUp) {
                Currency.createStarsGroup('abyssCore', this.type, this.objectTag);
            } else {
                PowerUps.createPowerUp(this.powerUp, this.objectTag);
            }
        }
        this.isActive = false;
        this.worker.terminate();
        this.board.removeChild(this.objectTag);
        this.children.forEach((child, i) => {
            child.stopShooting();
            this.children[i].isActive = false;
        });
        this.deleteAllEnemyBullets();
        this.resolveDelete();
    }
    deleteAllEnemyBullets() {
        this.children[0].sides.forEach(side => {
            this.children[0].existingBullets[side].forEach(bullet => {
                this.board.removeChild(bullet);
            });
            this.children[0].existingBullets[side] = [];
        });

        ['left', 'center', 'right'].forEach(side => {
            this.children[1].existingBullets[side].forEach(bullet => {
                this.board.removeChild(bullet);
            });
            this.children[1].existingBullets[side] = [];
        });

        this.children[2].existingBullets.forEach(bullet => {
            this.board.removeChild(bullet);
        });
        this.children[2].existingBullets = [];

        this.children[3].existingBullets.forEach(bullet => {
            this.board.removeChild(bullet);
        });
        this.children[3].existingBullets = [];

        this.children[4].existingBullets.forEach(bullet => {
            this.board.removeChild(bullet);
        });
        this.children[4].existingBullets = [];

        this.children[5].existingBullets.forEach(bullet => {
            this.board.removeChild(bullet);
        });
        this.children[5].existingBullets = [];

        this.children[6].existingBullets.forEach(bullet => {
            this.board.removeChild(bullet);
        });
        this.children[6].existingBullets = [];

        this.children[7].existingBullets.forEach(bullet => {
            this.board.removeChild(bullet);
        });
        this.children[7].existingBullets = [];
    }
}