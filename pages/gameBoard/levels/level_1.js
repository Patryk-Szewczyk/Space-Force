class Level_1 {
    level = undefined;
    isWin = false;
    soundtrack = undefined;
    gameEngine = undefined;
    player = undefined;
    playerIDX = undefined;
    levelIDX = 2;
    stars = 0;
    score = 0;
    bodyTag = document.querySelector('body');
    infoTag = document.querySelector('.player-info');
    boardTag = document.querySelector('.game-board');
    objects = [];
    isCutsceneIntro = false;
    isCutsceneEnding = false;
    constructor() {
        this.level = this;
        this.soundtrack = new Soundtrack(
            'skyForceReload',
            '01.SkyForceReloaded_-_In-Game1',
            // '02.SkyForceReloaded_-_In-Game2',
            // '03.SkyForceReloaded_-_In-Game3',
            // '04.SkyForceReloaded_-_In-Game4',
            // '05.SkyForceReloaded_-_BossFight',
            // '06.SkyForceReloaded_-_MenuTrack',
            'mp3',
            true,
            Settings.audioVolume
        );
        Player.infoScore.textContent = this.setScore(0);
        Player.infoStars.textContent = '0';
        this.playerIDX = UserMenu.selectedPlayerIDX;
        console.log(UserMenu.playerHp);
        console.log(UserMenu.playerDamage);
    }
    openPage(isCutscene) {
        this.boardTag.style.display = 'flex';
        this.infoTag.style.display = 'grid';
        switch (isCutscene) {  // TODO: Przenieś to później do klasy GameBoard!!!
            case 'intro':
                if (Number(UserMenu.usersData[this.playerIDX][GameBoard.firstLevelScoreIDX]) == 0) {
                    this.isCutsceneIntro = true;
                    GameBoard.runCutsceneIntro(this);
                } else {
                    this.goToLevel();
                }
                console.log('Intro: ' + this.isCutsceneIntro);
                break;
            case 'ending':
                if (Number(UserMenu.usersData[this.playerIDX][GameBoard.lastLevelScoreIDX]) == 0) {
                    this.isCutsceneEnding = true;
                }
                this.goToLevel();
                console.log('Ending: ' + this.isCutsceneEnding);
                break;
            default:
                this.goToLevel();
        }
    }
    closePage() {
        this.soundtrack.stop();
        this.soundtrack = null;
        Menu.soundtrack.play();
        setGameNavigateAllAEL();
        this.boardTag.style.display = 'none';
        this.infoTag.style.display = 'none';
        this.isCutsceneIntro = false;
        this.isCutsceneEnding = false;
        GameSummary.openPage(this.isWin);
    }
    goToLevel() {
        Menu.soundtrack.stop();
        this.soundtrack.play();
        this.run();
        this.waitForPlayerDeathOrWin();
    }
    async run() {
        
        const parallelGameEngine = new ParallelGameEngine(Settings.fps);
        this.gameEngine = parallelGameEngine;

        let childrenId = 0;
        
        const boardSpeed = 70;
        
        const board = new Board(parallelGameEngine, boardSpeed);
        childrenId = parallelGameEngine.addObject(board);
        board.setChild_ID(childrenId);
        this.objects.push(board);
        
        const currency = new Currency(parallelGameEngine, boardSpeed);
        childrenId = parallelGameEngine.addObject(currency);
        currency.setChild_ID(childrenId);
        this.objects.push(currency);
        
        const player = new Player(parallelGameEngine, this.level, UserMenu.playerHp, UserMenu.playerDamage);  // damage: 35, +15, 140 | hp: 100, +35, 345
        player.setAEL();
        childrenId = parallelGameEngine.addObject(player);
        player.setChild_ID(childrenId);
        this.objects.push(player);
        this.player = player;
        
        const powerUps = new PowerUps(parallelGameEngine, boardSpeed);
        childrenId = parallelGameEngine.addObject(powerUps);
        powerUps.setChild_ID(childrenId);
        this.objects.push(powerUps);
        
        parallelGameEngine.startGame();

        

        const speederSetT1_1 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 5, 2, 2, 1, 90, 'bottomLeft', {x: '0%', y: '-max%'});
        const wave_1 = [...speederSetT1_1]
        await Promise.all(wave_1);


        const speederSetT1_2 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 5, 1, 2, 1, 90, 'bottomRight', {x: '100%', y: '-max%'});
        const wave_2 = [...speederSetT1_2]
        await Promise.all(wave_2);


        const speederSetT1_3 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 5, 1, 2, 1, 90, 'bottom', {x: '50%', y: '-max%'}, true);
        const wave_3 = [...speederSetT1_3]
        await Promise.all(wave_3);


        const speederSetT1_4 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 5, 0, 1.5, 1, 100, 'bottom', {x: '30%', y: '-max%'});
        const speederSetT1_5 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 5, 5.5, 2.5, 1, 100, 'bottom', {x: '70%', y: '-max%'});
        const wave_4 = [...speederSetT1_4, ...speederSetT1_5];
        await Promise.all(wave_4);


        const speederSetT1_6 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 5, 1, 2, 1, 90, 'left', {x: 'max%', y: '-40%'}, false);
        const shooterSetT1_1 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 1, 4, 0, 1, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const wave_5 = [...speederSetT1_6, ...shooterSetT1_1];
        await Promise.all(wave_5);


        const shooterSetT1_2 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 1, 1, 0, 1, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const shooterSetT1_3 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 1, 4, 0, 1, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, true
        );
        const wave_6 = [...shooterSetT1_2, ...shooterSetT1_3];
        await Promise.all(wave_6);


        const speederSetT1_7 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 6, 0, 4, 1, 100, 'bottomLeft', {x: '20%', y: '-max%'});
        const speederSetT1_8 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 6, 2, 4, 1, 100, 'bottomRight', {x: '80%', y: '-max%'});
        const shooterSetT1_4 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 2, 8, 5, 1, 'topWave', {
                direction: 'right',
                leftLimit: '30%',
                rightLimit: '70%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const wave_7 = [...speederSetT1_7, ...speederSetT1_8, ...shooterSetT1_4]
        await Promise.all(wave_7);


        const speederSetT1_9 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 8, 0, 3, 1, 110, 'bottomLeft', {x: '10%', y: '-max%'});
        const speederSetT1_10 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 8, 1.5, 3, 1, 110, 'bottomRight', {x: '90%', y: '-max%'});
        const multiSetT1_1 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 2, 1, 3, 1, 'topWave', {
                direction: 'right',
                leftLimit: '20%',
                rightLimit: '80%',
                topLimit: '-90%',
                bottomLimit: '-70%',
                speedX: 120,
                speedY: 150
            }, true
        );
        const wave_8 = [...speederSetT1_9, ...speederSetT1_10, ...multiSetT1_1];
        await Promise.all(wave_8);


        const speederSetT1_11 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 8, 0, 4, 1, 100, 'bottomLeft', {x: '10%', y: '-max%'});
        const speederSetT1_12 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 8, 2, 4, 1, 100, 'bottomRight', {x: '90%', y: '-max%'});
        const multiSetT1_2 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 2, 12, 3, 1, 'topZigzag', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '50%',
                speedX: 120,
                speedY: 20
            }, false
        );
        const multiSetT1_3 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 2, 16, 3, 1, 'topZigzag', {
                 direction: 'right',
                leftLimit: '50%',
                rightLimit: '100%',
                speedX: 120,
                speedY: 20
            }, true
        );
        const wave_9 = [...speederSetT1_11, ...speederSetT1_12, ...multiSetT1_2, ...multiSetT1_3];
        await Promise.all(wave_9);


        const speederSetT1_13 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 10, 1, 3, 1, 130, 'left', {x: 'max%', y: '-40%'});
        const shooterSetT1_5 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 1, 3, 0, 1, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 150
            }, false
        );
        const shooterSetT1_6 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 1, 5, 0, 1, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 150
            }, false
        );
        const shooterSetT1_7 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 1, 7, 0, 1, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 150
            }, false
        );
        const shooterSetT1_8 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 1, 9, 0, 1, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 150
            }, false
        );
        const shooterSetT1_9 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 1, 11, 0, 1, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 150
            }, false
        );
        const shooterSetT1_10 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 1, 13, 0, 1, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 150
            }, false
        );
        const wave_10 = [...speederSetT1_13, ...shooterSetT1_5, ...shooterSetT1_6, ...shooterSetT1_7, ...shooterSetT1_8, ...shooterSetT1_9, ...shooterSetT1_10];
        await Promise.all(wave_10);


        const speederSetT1_14 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 10, 0, 3, 1, 110, 'bottomLeft', {x: '10%', y: '-max%'});
        const speederSetT1_15 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 10, 1.5, 3, 1, 110, 'bottomRight', {x: '90%', y: '-max%'});
        const flamerSetT1_1 = EnemyFactory.createSetFlamer(parallelGameEngine, player, this.level, 1, 5, 0, 1, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 250,
                speedY: 120
            }, true
        );
        const wave_11 = [...speederSetT1_14, ...speederSetT1_15, ...flamerSetT1_1];
        await Promise.all(wave_11);


        const multiSetT1_4 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 1, 0, 10, 1, 'horizontal', {
                direction: 'left',
                speedX: 30,
                y:'-50%'
            }, false
        );
        const multiSetT1_5 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 1, 0, 10, 1, 'horizontal', {
                direction: 'right',
                speedX: 30,
                y:'-50%'
            }, false
        );
        const multiSetT1_6 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 1, 0, 10, 1, 'bottom', {
                speedY: 30,
                x:'50%'
            }, false
        );
        const flamerSetT1_2 = EnemyFactory.createSetFlamer(parallelGameEngine, player, this.level, 1, 1, 0, 1, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 150,
                speedY: 120
            }, false
        );
        const flamerSetT1_3 = EnemyFactory.createSetFlamer(parallelGameEngine, player, this.level, 1, 6, 0, 1, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 150,
                speedY: 120
            }, true
        );
        const shooterSetT1_11 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 3, 10, 3, 1, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 150,
                speedY: 120
            }, false
        );
        const wave_12 = [...multiSetT1_4, ...multiSetT1_5, ...multiSetT1_6, ...flamerSetT1_2, ...flamerSetT1_3, ...shooterSetT1_11];
        await Promise.all(wave_12);


        const multiSetT1_7 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 8, 1, 6, 1, 'bias', {
                direction: 'topLeft', speedX: 45, speedY: 45, x: 'max%', y: '-100%'
            }, false
        );
        const multiSetT1_8 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 8, 1, 6, 1, 'bias', {
                direction: 'topRight', speedX: 45, speedY: 45, x: 'min%', y: '-100%'
            }, false
        );
        const bomberSet1_1 = EnemyFactory.createSetBomber(parallelGameEngine, player, this.level, 5, 5, 5, 1, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const wave_13 = [...multiSetT1_7, ...multiSetT1_8, ...bomberSet1_1];
        await Promise.all(wave_13);


        
        setTimeout(() => {
            this.isWin = true;
            Player.resolveDelete();
        }, GameSummary.goToGameSummeryDelay);

    }
    async waitForPlayerDeathOrWin() {

        await this.player.promiseDelete;

        setTimeout(() => {
            this.StopAndRemoveLevelObjects();

            this.score = Number(Player.infoScore.textContent) + 10000;
            Player.infoScore.textContent = this.determineEmptyScore();
            this.stars = Currency.starsCounter;
            Player.infoStars.textContent = '0';
            Currency.starsCounter = 0;
            Player.fireRate.currentUpdate = 1;

            GameSummary.gainedScore = this.score;
            GameSummary.gainedStars = this.stars;

            if (this.isWin) {
                const playerIDX = UserMenu.selectedPlayerIDX;
                // console.log('current stars: ' + Number(UserMenu.usersData[playerIDX][7]));
                // console.log('add tars: ' + Number(this.stars));
                // console.log(String(Number(UserMenu.usersData[playerIDX][7]) + Number(this.stars)));
                UserMenu.usersData[playerIDX][7] = String(Number(UserMenu.usersData[playerIDX][7]) + Number(this.stars));
                if (Number(this.score) > Number(UserMenu.usersData[playerIDX][this.levelIDX])) {
                    UserMenu.usersData[playerIDX][this.levelIDX] = this.setScore(this.score);
                    UserMenu.usersData[playerIDX][1] =
                    this.setScore(
                        Number(UserMenu.usersData[playerIDX][2]) +
                        Number(UserMenu.usersData[playerIDX][3]) +
                        Number(UserMenu.usersData[playerIDX][4]) +
                        Number(UserMenu.usersData[playerIDX][5]) +
                        Number(UserMenu.usersData[playerIDX][6])
                    );
                }
            }

            this.closePage();
        }, GameSummary.goToGameSummeryDelay);
    }
    StopAndRemoveLevelObjects() {
        this.gameEngine.stopGame();
        this.gameEngine == null;

        this.objects.forEach(object => {
            object.isActive = false;
            if (object instanceof Player) {
                if (object.board.contains(Player.player)) {
                    Player.deletePlayer(Player.player);
                    object.removeAEL();
                }
            } else {
                if (object.worker) {
                    object.worker.terminate();
                }
                if (object.children) {
                    object.children.forEach((child, i) => {
                        child.stopShooting();
                        object.children[i].isActive = false;
                    });
                }
                if (object.objectTag) {
                    if (object.board.contains(object.objectTag)) {
                        object.board.removeChild(object.objectTag);
                    }
                }
            }
            if (
                !(
                    object instanceof Board
                    || object instanceof Currency
                    || object instanceof Player
                    || object instanceof PowerUps
                    || object instanceof Speeder
                )) {
                object.deleteAllEnemyBullets();
            }
        });

        const stars = [...document.querySelectorAll('.game-board .star')];
        const powerUps = [...document.querySelectorAll('.game-board .power-up')];
        const toRemoveItems = [...stars, ...powerUps];
        toRemoveItems.forEach(item => {
            this.boardTag.removeChild(item);
        });
    }
    determineEmptyScore() {
        let zeroString = '';
        for (let i = 0; i < Ranking.scoreZeroAmount; i++) {
            zeroString += '0';
        }
        return zeroString;
    }
    setScore(points) {
        let fullLength = Ranking.scoreZeroAmount;
        let pointsLength = String(points).length;
        let newValue = '';
        for (let i = 0; i < (fullLength - pointsLength); i++) {
            newValue += '0';
        }
        newValue += String(points);
        return newValue;
    }
}