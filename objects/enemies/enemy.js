'use strict';

class Enemy {
    static updateEnemyHp(enemy) {
        enemy.infoHp.style.width = ((enemy.currentHp / enemy.maxHp) * 100) + '%';
    }
}

class EnemyObserver {
    setEnemyObserver(element, fullVisible, fullHidden) {
        const firstObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.intersectionRatio == 1) {
                    fullVisible(entry.target);
                    observer.disconnect();
                    const secondObserver = new IntersectionObserver((entries2, observer2) => {
                        entries2.forEach(entry2 => {
                            if (entry2.intersectionRatio == 0) {
                                fullHidden(entry2.target);
                                observer2.disconnect();
                            }
                        });
                    }, {
                        threshold: 0
                    });
                    secondObserver.observe(entry.target);
                }
            });
        }, {
            threshold: 1
        });
        firstObserver.observe(element);
    }
}

class EnemyFactory {
    static createSetSpeeder(gameEngine, player, level, amount, setWaitDelay, spawnDelay, type, speed, direction, startPosition, isPowerUpFireRate = false) {
        let enemies = [];
        let enemy = undefined;
        let powerUpIdx = undefined;
        if (isPowerUpFireRate) {
            powerUpIdx = Math.floor(Math.random() * amount);
        }
        let isFireRate = false;
        // Najpierw tworzenie wrogów z delete Promise:
        for (let i = 0; i < amount; i++) {
            if (i == powerUpIdx) {
                isFireRate = true;
            }
            if (isFireRate) {
                enemy = new Speeder(gameEngine, player, type, speed, direction, startPosition, 'fire-rate');
            }
            if (isFireRate == false) {
                enemy = new Speeder(gameEngine, player, type, speed, direction, startPosition);
            }
            isFireRate = false;
            // Zbieranie Wrogów z delete Promise i zwracanie jaka tablicę:
            enemies.push(enemy);
        }
        // Asynchroniczne wrzucanie wrogów do silnika gry, według opóźnienia między wrogowego i całego zestawu:
        let childrenId = undefined;
        setTimeout(() => {
            childrenId = gameEngine.addObject(enemies[0]);
            enemies[0].setChild_ID(childrenId);  // TODO: sprawdź
            let counter = 1;
            let loop = setInterval(() => {
                if (counter >= enemies.length) {
                    clearInterval(loop);
                    loop = undefined;
                    return;
                }
                childrenId = gameEngine.addObject(enemies[counter]);
                enemies[counter].setChild_ID(childrenId);  // TODO: sprawdź
                counter++;
            }, spawnDelay * 1000);
        }, setWaitDelay * 1000);
        level.objects.push(...enemies);
        return enemies.map(enemy => enemy.promiseDelete);
    }
    static createSetShooter(gameEngine, player, level, amount, setWaitDelay, spawnDelay, type, movementType, movementArgs, isPowerUpFireRate = false) {
        let enemies = [];
        let enemy = undefined;
        let powerUpIdx = undefined;
        if (isPowerUpFireRate) {
            powerUpIdx = Math.floor(Math.random() * amount);
        }
        let isFireRate = false;
        for (let i = 0; i < amount; i++) {
            const movementArgs_CLONE = structuredClone(movementArgs);  // "Głęboka kopia" - Umożliwia mi tworzenie niezależnnej kopii zmiennej w kontekście
            // przesyłania wspólnej zmiennej (w konstruktorze) dla zestawu wszystkich wrogów, gdzie wartości tej zmiennej będą zmienie w trakcie wywoływania
            // metod każdego wroga tego zestawu. Bez głębokiej kopii, drugi i każdy kolejny wróg będzie miał nadpisane dane w tej zmiennej, z modyfikacji
            // dokonanej w metodzie pierwszego wroga, a do poprawnego działania trzeba świeży, zestaw danych.
            if (i == powerUpIdx) {
                isFireRate = true;
            }
            if (isFireRate) {
                enemy = new Shooter(gameEngine, player, type, movementType, movementArgs_CLONE, 'fire-rate');
            }
            if (isFireRate == false) {
                enemy = new Shooter(gameEngine, player, type, movementType, movementArgs_CLONE);
            }
            isFireRate = false;
            enemies.push(enemy);
        }
        let childrenId = undefined;
        setTimeout(() => {
            childrenId = gameEngine.addObject(enemies[0]);
            enemies[0].setChild_ID(childrenId);  // TODO: sprawdź
            let counter = 1;
            let loop = setInterval(() => {
                if (counter >= enemies.length) {
                    clearInterval(loop);
                    loop = undefined;
                    return;
                }
                childrenId = gameEngine.addObject(enemies[counter]);
                enemies[counter].setChild_ID(childrenId);  // TODO: sprawdź
                counter++;
            }, spawnDelay * 1000);
        }, setWaitDelay * 1000);
        level.objects.push(...enemies);
        return enemies.map(enemy => enemy.promiseDelete);
    }
    static createSetMulti(gameEngine, player, level, amount, setWaitDelay, spawnDelay, type, movementType, movementArgs, isPowerUpFireRate = false) {
        let enemies = [];
        let enemy = undefined;
        let powerUpIdx = undefined;
        if (isPowerUpFireRate) {
            powerUpIdx = Math.floor(Math.random() * amount);
        }
        let isFireRate = false;
        for (let i = 0; i < amount; i++) {
            const movementArgs_CLONE = structuredClone(movementArgs);
            if (i == powerUpIdx) {
                isFireRate = true;
            }
            if (isFireRate) {
                enemy = new Multi(gameEngine, player, type, movementType, movementArgs_CLONE, 'fire-rate');
            }
            if (isFireRate == false) {
                enemy = new Multi(gameEngine, player, type, movementType, movementArgs_CLONE);
            }
            isFireRate = false;
            enemies.push(enemy);
        }
        let childrenId = undefined;
        setTimeout(() => {
            childrenId = gameEngine.addObject(enemies[0]);
            enemies[0].setChild_ID(childrenId);
            let counter = 1;
            let loop = setInterval(() => {
                if (counter >= enemies.length) {
                    clearInterval(loop);
                    loop = undefined;
                    return;
                }
                childrenId = gameEngine.addObject(enemies[counter]);
                enemies[counter].setChild_ID(childrenId);
                counter++;
            }, spawnDelay * 1000);
        }, setWaitDelay * 1000);
        level.objects.push(...enemies);
        return enemies.map(enemy => enemy.promiseDelete);
    }
    static createSetFlamer(gameEngine, player, level, amount, setWaitDelay, spawnDelay, type, movementType, movementArgs, isPowerUpFireRate = false) {
        let enemies = [];
        let enemy = undefined;
        let powerUpIdx = undefined;
        if (isPowerUpFireRate) {
            powerUpIdx = Math.floor(Math.random() * amount);
        }
        let isFireRate = false;
        for (let i = 0; i < amount; i++) {
            const movementArgs_CLONE = structuredClone(movementArgs);
            if (i == powerUpIdx) {
                isFireRate = true;
            }
            if (isFireRate) {
                enemy = new Flamer(gameEngine, player, type, movementType, movementArgs_CLONE, 'fire-rate');
            }
            if (isFireRate == false) {
                enemy = new Flamer(gameEngine, player, type, movementType, movementArgs_CLONE);
            }
            isFireRate = false;
            enemies.push(enemy);
        }
        let childrenId = undefined;
        setTimeout(() => {
            childrenId = gameEngine.addObject(enemies[0]);
            enemies[0].setChild_ID(childrenId);
            let counter = 1;
            let loop = setInterval(() => {
                if (counter >= enemies.length) {
                    clearInterval(loop);
                    loop = undefined;
                    return;
                }
                childrenId = gameEngine.addObject(enemies[counter]);
                enemies[counter].setChild_ID(childrenId);
                counter++;
            }, spawnDelay * 1000);
        }, setWaitDelay * 1000);
        level.objects.push(...enemies);
        return enemies.map(enemy => enemy.promiseDelete);
    }
    static createSetBomber(gameEngine, player, level, amount, setWaitDelay, spawnDelay, type, movementType, movementArgs, isPowerUpFireRate = false) {
        let enemies = [];
        let enemy = undefined;
        let powerUpIdx = undefined;
        if (isPowerUpFireRate) {
            powerUpIdx = Math.floor(Math.random() * amount);
        }
        let isFireRate = false;
        for (let i = 0; i < amount; i++) {
            const movementArgs_CLONE = structuredClone(movementArgs);
            if (i == powerUpIdx) {
                isFireRate = true;
            }
            if (isFireRate) {
                enemy = new Bomber(gameEngine, player, type, movementType, movementArgs_CLONE, 'fire-rate');
            }
            if (isFireRate == false) {
                enemy = new Bomber(gameEngine, player, type, movementType, movementArgs_CLONE);
            }
            isFireRate = false;
            enemies.push(enemy);
        }
        let childrenId = undefined;
        setTimeout(() => {
            childrenId = gameEngine.addObject(enemies[0]);
            enemies[0].setChild_ID(childrenId);
            let counter = 1;
            let loop = setInterval(() => {
                if (counter >= enemies.length) {
                    clearInterval(loop);
                    loop = undefined;
                    return;
                }
                childrenId = gameEngine.addObject(enemies[counter]);
                enemies[counter].setChild_ID(childrenId);
                counter++;
            }, spawnDelay * 1000);
        }, setWaitDelay * 1000);
        level.objects.push(...enemies);
        return enemies.map(enemy => enemy.promiseDelete);
    }
    static createSetOrb(gameEngine, player, level, amount, setWaitDelay, spawnDelay, type, movementType, movementArgs, isPowerUpFireRate = false) {
        let enemies = [];
        let enemy = undefined;
        let powerUpIdx = undefined;
        if (isPowerUpFireRate) {
            powerUpIdx = Math.floor(Math.random() * amount);
        }
        let isFireRate = false;
        for (let i = 0; i < amount; i++) {
            const movementArgs_CLONE = structuredClone(movementArgs);
            if (i == powerUpIdx) {
                isFireRate = true;
            }
            if (isFireRate) {
                enemy = new Orb(gameEngine, player, type, movementType, movementArgs_CLONE, 'fire-rate');
            }
            if (isFireRate == false) {
                enemy = new Orb(gameEngine, player, type, movementType, movementArgs_CLONE);
            }
            isFireRate = false;
            enemies.push(enemy);
        }
        let childrenId = undefined;
        setTimeout(() => {
            childrenId = gameEngine.addObject(enemies[0]);
            enemies[0].setChild_ID(childrenId);
            let counter = 1;
            let loop = setInterval(() => {
                if (counter >= enemies.length) {
                    clearInterval(loop);
                    loop = undefined;
                    return;
                }
                childrenId = gameEngine.addObject(enemies[counter]);
                enemies[counter].setChild_ID(childrenId);
                counter++;
            }, spawnDelay * 1000);
        }, setWaitDelay * 1000);
        level.objects.push(...enemies);
        return enemies.map(enemy => enemy.promiseDelete);
    }
    static createAbyssCore(gameEngine, player, level, setWaitDelay, movementArgs) {
        let enemies = [];
        let enemy = undefined;
        const movementArgs_CLONE = structuredClone(movementArgs);
        enemy = new AbyssCore(gameEngine, player, 'topWave', movementArgs_CLONE);
        enemies.push(enemy);
        let childrenId = undefined;
        setTimeout(() => {
            childrenId = gameEngine.addObject(enemies[0]);
            enemies[0].setChild_ID(childrenId);
        }, setWaitDelay * 1000);
        level.objects.push(...enemies);
        return enemies.map(enemy => enemy.promiseDelete);
    }
}



// if (Player.currentHp <= Player.restoreHpLimitValue) {
//     if (Math.random() * 100 < Player.restoreHpChance) {
//         isHp = true;
//     }
// }



// INSTRUKCJA TWORZENIA ZESTAWÓW WROGÓW:

        // Speeder - start position:
        // left, {x: max%, y: -value%}
        // right, {x: min%, y: -value%}
        // bottom, {x: value%, y -max%}
        // bottomLeft, {x: value%, y: -max%}
        // bottomLeft, {x: max%, y: -value%}
        // bottomRight, {x: value%, y: -max%}
        // bottomRight, {x: max%, y: -value%}

        // let speederSetT1_1 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 5, 1, 1.5, 1, 100, 'bottomLeft', {x: '0%', y: '-max%'});
        // await Promise.all(speederSetT1_1);

        // let speederSetT1_1 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 5, 1, 1.5, 1, 100, 'bottomLeft', {x: '0%', y: '-max%'});
        // await Promise.all(speederSetT1_1);

        // let speederSetT1_2 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 5, 1, 1.5, 1, 100, 'bottomRight', {x: '100%', y: '-max%'});
        // await Promise.all(speederSetT1_2);

        // let speederSetT1_3 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 5, 1, 1.5, 1, 100, 'bottom', {x: '50%', y: '-max%'}, true);
        // await Promise.all(speederSetT1_3);

        // let speederSetT1_4 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 5, 0, 1.5, 1, 120, 'bottom', {x: '30%', y: '-max%'});
        // let speederSetT1_5 = [];
        // setTimeout(() => {
        //     speederSetT1_5 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 5, 0, 2.5, 1, 100, 'bottom', {x: '70%', y: '-max%'});
        // }, 5000);
        // await Promise.all(speederSetT1_4);



        // - - - - - - - - - - - - - - - - - - - - - - -
        // const movementType = 'bottom';
        // const movementArgs = {speedY: 100, x: '60%'};
        // - - - - - - - - - - - - - - - - - - - - - - -
        // const movementType = 'horizontal';
        // const movementArgs = {direction: 'right', speedX: 100, y: '-50%'};
        // const movementArgs = {direction: 'left', speedX: 100, y: '-0%'};
        // - - - - - - - - - - - - - - - - - - - - - - -
        // const movementType = 'bias';
        // const movementArgs = {direction: 'bottomLeft', speedX: 100, speedY: 100, x: '20%', y: '-max%'};
        // const movementArgs = {direction: 'bottomLeft', speedX: 100, speedY: 100, x: 'max%', y: '-20%'};
        // const movementArgs = {direction: 'bottomRight', speedX: 100, speedY: 100, x: '80%', y: '-max%'};
        // const movementArgs = {direction: 'bottomRight', speedX: 100, speedY: 100, x: 'min%', y: '-20%'};
        // const movementArgs = {direction: 'topLeft', speedX: 100, speedY: 100, x: '20%', y: '-min%'};
        // const movementArgs = {direction: 'topLeft', speedX: 100, speedY: 100, x: 'max%', y: '-80%'};
        // const movementArgs = {direction: 'topRight', speedX: 100, speedY: 100, x: '80%', y: '-min%'};
        // const movementArgs = {direction: 'topRight', speedX: 100, speedY: 100, x: 'min%', y: '-80%'};
        // - - - - - - - - - - - - - - - - - - - - - - -
        // const movementType = 'topWave';
        // const movementArgs = {
        //     direction: 'right',
        //     leftLimit: '30%',
        //     rightLimit: '70%',
        //     topLimit: '-90%',
        //     bottomLimit: '-60%',
        //     speedX: 150,
        //     speedY: 150
        // };
        // - - - - - - - - - - - - - - - - - - - - - - -
        // const movementType = 'topZigzag';
        // const movementArgs = {
        //     direction: 'left',
        //     leftLimit: '30%',
        //     rightLimit: '70%',
        //     speedX: 150,
        //     speedY: 50
        // };
        // - - - - - - - - - - - - - - - - - - - - - - -
        // const shoterSet_1 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 2, 0, 2, 1, 'topWave', {
        //         direction: 'right',
        //         leftLimit: '30%',
        //         rightLimit: '70%',
        //         topLimit: '-90%',
        //         bottomLimit: '-60%',
        //         speedX: 150,
        //         speedY: 150
        //     }, false
        // );



        
        // - - - - - - - - - - - - - - - - - - - - - - -
        // SHOOTER =====================================
        // - - - - - - - - - - - - - - - - - - - - - - -
        // const shooterSet_1 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 1, 0, 0, 1, 'topWave', {
        //         direction: 'left',
        //         // leftLimit: '30%',
        //         // rightLimit: '70%',
        //         leftLimit: '0%',
        //         rightLimit: '100%',
        //         topLimit: '-90%',
        //         bottomLimit: '-60%',
        //         speedX: 120,  // 250: flamer
        //         speedY: 120
        //     }, false
        // );
        // const shooterSet_1 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 5, 0, 3, 1, 'topZigzag', {
        //         direction: 'left',
        //         // leftLimit: '30%',
        //         // rightLimit: '70%',
        //         leftLimit: '0%',
        //         rightLimit: '100%',
        //         speedX: 120,  // 250: flamer
        //         speedY: 30
        //     }, false
        // );
        // const shooterSet_1 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 1, 0, 0, 1, 'bottom', {
        //         speedY: 100,
        //         x: '50%'
        //     }, false
        // );
        // const shooterSet_1 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 1, 0, 0, 1, 'horizontal', {
        //         direction: 'left',
        //         speedX: 100,
        //         y:'-50%'
        //     }, false
        // );
        // const shooterSet_1 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 1, 0, 0, 1, 'bias', {
        //         direction: 'bottomLeft', speedX: 100, speedY: 100, x: '20%', y: '-max%'
        //     }, false
        // );
        // - - - - - - - - - - - - - - - - - - - - - - -
        // MULTI =======================================
        // - - - - - - - - - - - - - - - - - - - - - - -
        // const multiSet_1 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 1, 0, 0, 4, 'topWave', {
        //         direction: 'left',
        //         // leftLimit: '30%',
        //         // rightLimit: '70%',
        //         leftLimit: '0%',
        //         rightLimit: '100%',
        //         topLimit: '-90%',
        //         bottomLimit: '-60%',
        //         speedX: 120,  // 250: flamer
        //         speedY: 120
        //     }, false
        // );
        // const multiSet_1 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 5, 0, 3, 1, 'topZigzag', {
        //         direction: 'left',
        //         // leftLimit: '30%',
        //         // rightLimit: '70%',
        //         leftLimit: '0%',
        //         rightLimit: '100%',
        //         speedX: 120,  // 250: flamer
        //         speedY: 30
        //     }, false
        // );
        // const multiSet_1 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 1, 0, 0, 1, 'bottom', {
        //         speedY: 100,
        //         x: '50%'
        //     }, false
        // );
        // const multiSet_1 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 1, 0, 0, 1, 'horizontal', {
        //         direction: 'left',
        //         speedX: 100,
        //         y:'-50%'
        //     }, false
        // );
        // const multiSet_1 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 1, 0, 0, 1, 'bias', {
        //         direction: 'bottomLeft', speedX: 100, speedY: 100, x: '20%', y: '-max%'
        //     }, false
        // );
        // - - - - - - - - - - - - - - - - - - - - - - -
        // FLAMER ======================================
        // - - - - - - - - - - - - - - - - - - - - - - -
        // const flamerSet_1 = EnemyFactory.createSetFlamer(parallelGameEngine, player, this.level, 2, 0, 5, 4, 'topWave', {
        //         direction: 'left',
        //         // leftLimit: '30%',
        //         // rightLimit: '70%',
        //         leftLimit: '0%',
        //         rightLimit: '100%',
        //         topLimit: '-90%',
        //         bottomLimit: '-60%',
        //         speedX: 120,  // 250: flamer
        //         speedY: 120
        //     }, false
        // );
        // const flamerSet_1 = EnemyFactory.createSetFlamer(parallelGameEngine, player, this.level, 5, 0, 3, 1, 'topZigzag', {
        //         direction: 'left',
        //         // leftLimit: '30%',
        //         // rightLimit: '70%',
        //         leftLimit: '0%',
        //         rightLimit: '100%',
        //         speedX: 120,  // 250: flamer
        //         speedY: 30
        //     }, false
        // );
        // const flamerSet_1 = EnemyFactory.createSetFlamer(parallelGameEngine, player, this.level, 1, 0, 0, 1, 'bottom', {
        //         speedY: 100,
        //         x: '50%'
        //     }, false
        // );
        // const flamerSet_1 = EnemyFactory.createSetFlamer(parallelGameEngine, player, this.level, 1, 0, 0, 1, 'horizontal', {
        //         direction: 'left',
        //         speedX: 100,
        //         y:'-50%'
        //     }, false
        // );
        // const flamerSet_1 = EnemyFactory.createSetFlamer(parallelGameEngine, player, this.level, 1, 0, 0, 1, 'bias', {
        //         direction: 'topRight', speedX: 100, speedY: 100, x: 'min%', y: '-80%'
        //     }, false
        // );
        // - - - - - - - - - - - - - - - - - - - - - - -
        // BOMBER ======================================
        // - - - - - - - - - - - - - - - - - - - - - - -
        // const bomberSet_1 = EnemyFactory.createSetBomber(parallelGameEngine, player, this.level, 2, 0, 5, 4, 'topWave', {
        //         direction: 'left',
        //         // leftLimit: '30%',
        //         // rightLimit: '70%',
        //         leftLimit: '0%',
        //         rightLimit: '100%',
        //         topLimit: '-90%',
        //         bottomLimit: '-60%',
        //         speedX: 120,  // 250: flamer
        //         speedY: 120
        //     }, false
        // );
        // const bomberSet_1 = EnemyFactory.createSetBomber(parallelGameEngine, player, this.level, 5, 0, 3, 1, 'topZigzag', {
        //         direction: 'left',
        //         // leftLimit: '30%',
        //         // rightLimit: '70%',
        //         leftLimit: '0%',
        //         rightLimit: '100%',
        //         speedX: 120,  // 250: flamer
        //         speedY: 30
        //     }, false
        // );
        // const bomberSet_1 = EnemyFactory.createSetBomber(parallelGameEngine, player, this.level, 1, 0, 0, 4, 'bottom', {
        //         speedY: 30,
        //         x: '50%'
        //     }, false
        // );
        // const bomberSet_1 = EnemyFactory.createSetBomber(parallelGameEngine, player, this.level, 1, 0, 0, 1, 'horizontal', {
        //         direction: 'right',
        //         speedX: 30,
        //         y:'-50%'
        //     }, false
        // );
        // const bomberSet_1 = EnemyFactory.createSetBomber(parallelGameEngine, player, this.level, 1, 0, 0, 1, 'bias', {
        //         // direction: 'bottomLeft', speedX: 50, speedY: 50, x: '20%', y: '-max%'
        //         // direction: 'bottomLeft', speedX: 50, speedY: 50, x: 'max%', y: '-20%'
        //         // direction: 'bottomRight', speedX: 50, speedY: 50, x: '80%', y: '-max%'
        //         // direction: 'bottomRight', speedX: 50, speedY: 50, x: 'min%', y: '-20%'
        //         // direction: 'topLeft', speedX: 50, speedY: 50, x: '20%', y: '-min%'
        //         // direction: 'topLeft', speedX: 50, speedY: 50, x: 'max%', y: '-80%'
        //         // direction: 'topRight', speedX: 50, speedY: 50, x: '80%', y: '-min%'
        //         // direction: 'topRight', speedX: 50, speedY: 50, x: 'min%', y: '-80%'
        //     }, false
        // );
        // - - - - - - - - - - - - - - - - - - - - - - -
        // ORB ======================================
        // - - - - - - - - - - - - - - - - - - - - - - -
        // const orbSet_1 = EnemyFactory.createSetOrb(parallelGameEngine, player, this.level, 2, 0, 5, 4, 'topWave', {
        //         direction: 'left',
        //         // leftLimit: '30%',
        //         // rightLimit: '70%',
        //         leftLimit: '0%',
        //         rightLimit: '100%',
        //         topLimit: '-90%',
        //         bottomLimit: '-60%',
        //         speedX: 120,  // 250: flamer
        //         speedY: boardSpeed / 3
        //     }, false
        // );
        // const orbSet_1 = EnemyFactory.createSetOrb(parallelGameEngine, player, this.level, 5, 0, 3, 1, 'topZigzag', {
        //         direction: 'left',
        //         // leftLimit: '30%',
        //         // rightLimit: '70%',
        //         leftLimit: '0%',
        //         rightLimit: '100%',
        //         speedX: 120,  // 250: flamer
        //         speedY: boardSpeed / 3
        //     }, false
        // );
        // const orbSet_1 = EnemyFactory.createSetOrb(parallelGameEngine, player, this.level, 1, 0, 0, 4, 'bottom', {
        //         speedY: boardSpeed / 3,
        //         x: '50%'
        //     }, false
        // );
        // const orbSet_1 = EnemyFactory.createSetOrb(parallelGameEngine, player, this.level, 1, 0, 0, 2, 'horizontal', {
        //         direction: 'left',
        //         speedX: boardSpeed / 3,
        //         y:'-50%'
        //     }, false
        // );
        // const orbSet_1 = EnemyFactory.createSetOrb(parallelGameEngine, player, this.level, 1, 0, 0, 1, 'bias', {
        //         direction: 'bottomLeft', speedX: boardSpeed / 3, speedY: boardSpeed / 3, x: '20%', y: '-max%'
        //         // direction: 'bottomLeft', speedX: boardSpeed / 3, speedY: boardSpeed / 3, x: 'max%', y: '-20%'
        //         // direction: 'bottomRight', speedX: boardSpeed / 3, speedY: boardSpeed / 3, x: '80%', y: '-max%'
        //         // direction: 'bottomRight', speedX: boardSpeed / 3, speedY: boardSpeed / 3, x: 'min%', y: '-20%'
        //         // direction: 'topLeft', speedX: boardSpeed / 3, speedY: boardSpeed / 3, x: '20%', y: '-min%'
        //         // direction: 'topLeft', speedX: boardSpeed / 3, speedY: boardSpeed / 3, x: 'max%', y: '-80%'
        //         // direction: 'topRight', speedX: boardSpeed / 3, speedY: boardSpeed / 3, x: '80%', y: '-min%'
        //         // direction: 'topRight', speedX: boardSpeed / 3, speedY: boardSpeed / 3, x: 'min%', y: '-80%'
        //     }, false
        // );
        // - - - - - - - - - - - - - - - - - - - - - - -
        // ABYSS CORE ==================================
        // - - - - - - - - - - - - - - - - - - - - - - -
        // const abyssCore = EnemyFactory.createAbyssCore(parallelGameEngine, player, this.level, 0, {
        //         direction: 'left',
        //         leftLimit: '0%',
        //         rightLimit: '100%',
        //         topLimit: '-95%',
        //         bottomLimit: '-60%',
        //         speedX: 120,  // 250: flamer
        //         speedY: 120
        //     }
        // );

        // window.addEventListener('DOMContentLoaded', () => {
        //     Player.damage = 1250;  // 125
        //     Player.fireRate.currentValue = 0.1;
        //     Player.updateFireRateBar(7);
        //     Player.shooting.stopShooting();
        //     Player.shooting.startShooting();
        // }, false);


        // // const mix_1 = [...shoterSet_1, ...multiSet_1];
        // await Promise.all(abyssCore);
        // console.log('ok');
        // // soundtrack.stop();
        // // soundtrack = null;


        // // KONIEC POZIOMU: (wyświetlenie ekranu informacji)
        // setTimeout(() => {
        //     Player.resolveDelete();
        // }, 1000);  // 6000


        // 1. [OK] speeder
        // 2. [OK] shooter  [15, 25, 35, 45]
        // 3. [OK] multi    [10, 18, 26, 32]
        // 4. [OK] flamer   [1, 2, 2, 3]
        // 5. [OK] bomber   [25, 40, 65, 80]
        // 6. [OK] orb      [10, 20, 30, 40]
        // 7. [] boss       [45, 32, 4, 80, 40] (posiada wszystkie typy broni) [hp: 50 000]



        // 1. speeder
        // 2. shooter
        // 3. multi
        // 4. flamer
        // 5. bomber
        // 6. orb




// PIERWSZE TESTY RÓWNOLEGŁEGO SILNIKA GRY: (nieaktualne)

// setTimeout(() => {  // OK
//     testObj.child2.isActive = false
// }, 1000);

// setTimeout(() => {  // OK
//     testObj.isActive = false
// }, 2000);

// setTimeout(() => {
//     Player.deletePlayer(player);
// }, 2500);

// setTimeout(() => {
//     console.log(parallelGameEngine.objects);
//     console.log(player.isActive);
// }, 3000);

// const testObj = new Object_1(parallelGameEngine, 50);
// childrenID = parallelGameEngine.addObject(testObj);
// testObj.setChild_ID(childrenID);