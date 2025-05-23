class Level_3 {
    level = undefined;
    isWin = false;
    soundtrack = undefined;
    gameEngine = undefined;
    player = undefined;
    playerIDX = undefined;
    levelIDX = 4;
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
            // '01.SkyForceReloaded_-_In-Game1',
            // '02.SkyForceReloaded_-_In-Game2',
            '03.SkyForceReloaded_-_In-Game3',
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



        const speederSetT3_1 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 5, 0, 3, 3, 100, 'right', {x: 'min%', y: '-20%'});
        const speederSetT3_2 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 5, 10, 3, 3, 100, 'left', {x: 'max%', y: '-30%'});
        const wave_1 = [...speederSetT3_1, ...speederSetT3_2]
        await Promise.all(wave_1);


        const speederSetT3_3 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 6, 2, 4, 3, 100, 'bottomRight', {x: '90%', y: '-max%'});
        const shooterSetT3_1 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 2, 8, 5, 3, 'topWave', {
                direction: 'right',
                leftLimit: '30%',
                rightLimit: '70%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, true
        );
        const wave_2 = [...speederSetT3_3, ...shooterSetT3_1]
        await Promise.all(wave_2);


        const speederSetT3_4 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 6, 1, 6, 3, 100, 'bottomLeft', {x: '20%', y: '-max%'});
        const speederSetT3_5 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 6, 4, 6, 3, 100, 'bottomRight', {x: '80%', y: '-max%'});
        const multiSetT3_1 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 1, 6, 1, 3, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const shooterSetT3_2 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 1, 9, 8, 3, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const wave_3 = [...speederSetT3_4, ...speederSetT3_5, ...multiSetT3_1, ...shooterSetT3_2];
        await Promise.all(wave_3);


        const speederSetT3_6 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 6, 1, 6, 3, 100, 'bottomLeft', {x: '20%', y: '-max%'});
        const speederSetT3_7 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 6, 4, 6, 3, 100, 'bottomRight', {x: '80%', y: '-max%'});
        const flamerSetT3_1 = EnemyFactory.createSetFlamer(parallelGameEngine, player, this.level, 2, 6, 8, 2, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, true
        );
        const multiSetT3_2 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 2, 10, 8, 2, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const wave_4 = [...speederSetT3_6, ...speederSetT3_7, ...flamerSetT3_1, ...multiSetT3_2];
        await Promise.all(wave_4);


        const shooterSetT3_3 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 2, 1, 10, 3, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const multiSetT3_3 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 2, 2, 10, 3, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const flamerSetT3_2 = EnemyFactory.createSetFlamer(parallelGameEngine, player, this.level, 2, 3, 10, 3, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const wave_5 = [...shooterSetT3_3, ...multiSetT3_3, ...flamerSetT3_2];
        await Promise.all(wave_5);
        
        
        const bomberSetT3_1 = EnemyFactory.createSetBomber(parallelGameEngine, player, this.level, 3, 1, 6, 3, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const bomberSetT3_2 = EnemyFactory.createSetBomber(parallelGameEngine, player, this.level, 3, 4, 6, 3, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const orbSetT3_1 = EnemyFactory.createSetOrb(parallelGameEngine, player, this.level, 2, 2, 15, 3, 'topZigzag', {
                direction: 'right',
                leftLimit: '20%',
                rightLimit: '80%',
                speedX: 60,
                speedY: 30
            }, true
        );
        const wave_6 = [...bomberSetT3_1, ...bomberSetT3_2, ...orbSetT3_1];
        await Promise.all(wave_6);


        const speederSetT3_8 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 10, 1, 3, 3, 130, 'left', {x: 'max%', y: '-40%'});
        const shooterSetT3_4 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 1, 3, 0, 3, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 150
            }, false
        );
        const shooterSetT3_5 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 1, 5, 0, 3, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 150
            }, false
        );
        const wave_7 = [...speederSetT3_8, ...shooterSetT3_4, ...shooterSetT3_5];
        await Promise.all(wave_7);


        const shooterSetT3_6 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 5, 0, 2, 3, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const shooterSetT3_7 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 5, 1, 2, 3, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, true
        );
        const wave_8 = [...shooterSetT3_6, ...shooterSetT3_7];
        await Promise.all(wave_8);


        const shooterSetT2_8 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 1, 1, 0, 3, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const multiSetT3_4 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 1, 2, 0, 3, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, true
        );
        const flamerSetT3_3 = EnemyFactory.createSetFlamer(parallelGameEngine, player, this.level, 1, 3, 0, 3, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const bomberSetT3_3 = EnemyFactory.createSetBomber(parallelGameEngine, player, this.level, 1, 4, 0, 3, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const orbSetT3_2 = EnemyFactory.createSetOrb(parallelGameEngine, player, this.level, 1, 5, 0, 3, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const wave_9 = [...shooterSetT2_8, ...multiSetT3_4, ...flamerSetT3_3, ...bomberSetT3_3, orbSetT3_2];
        await Promise.all(wave_9);


        const speederSetT4_1 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 5, 1, 3, 3, 100, 'left', {x: 'max%', y: '-40%'});
        const speederSetT4_2 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 5, 13, 3, 3, 100, 'right', {x: 'min%', y: '-40%'});
        const flamerSetT4_1 = EnemyFactory.createSetOrb(parallelGameEngine, player, this.level, 2, 0, 5, 3, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const orbSetT4_1 = EnemyFactory.createSetOrb(parallelGameEngine, player, this.level, 2, 10, 5, 3, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, true
        );
        const wave_10 = [...speederSetT4_1, ...speederSetT4_2, ...flamerSetT4_1, ...orbSetT4_1];
        await Promise.all(wave_10);


        const multiSetT3_5 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 1, 1, 10, 3, 'horizontal', {
                direction: 'left',
                speedX: 30,
                y:'-50%'
            }, false
        );
        const multiSetT3_6 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 1, 1, 10, 3, 'horizontal', {
                direction: 'right',
                speedX: 30,
                y:'-50%'
            }, false
        );
        const multiSetT3_7 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 1, 1, 6, 3, 'bottom', {
                speedY: 30,
                x:'50%'
            }, false
        );
        const flamerSetT3_4 = EnemyFactory.createSetFlamer(parallelGameEngine, player, this.level, 1, 1, 12, 3, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 150,
                speedY: 120
            }, false
        );
        const flamerSetT3_5 = EnemyFactory.createSetFlamer(parallelGameEngine, player, this.level, 1, 6, 12, 3, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 150,
                speedY: 120
            }, false
        );
        const shooterSetT3_9 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 6, 10, 3, 3, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 150,
                speedY: 120
            }, false
        );
        const wave_11 = [...multiSetT3_5, ...multiSetT3_6, ...multiSetT3_7, ...flamerSetT3_4, ...flamerSetT3_5, ...shooterSetT3_9];
        await Promise.all(wave_11);

       

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