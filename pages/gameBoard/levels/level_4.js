class Level_4 {
    level = undefined;
    isWin = false;
    soundtrack = undefined;
    gameEngine = undefined;
    player = undefined;
    playerIDX = undefined;
    levelIDX = 5;
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
            // '03.SkyForceReloaded_-_In-Game3',
            '04.SkyForceReloaded_-_In-Game4',
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



        const speederSetT3_1 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 6, 1, 4, 3, 100, 'bottomLeft', {x: '20%', y: '-max%'});
        const speederSetT3_2 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 6, 3, 4, 3, 100, 'bottomRight', {x: '80%', y: '-max%'});
        const shooterSetT4_1 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 1, 7, 0, 4, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const shooterSetT4_2 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 1, 10, 0, 4, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, true
        );
        const wave_1 = [...speederSetT3_1, ...speederSetT3_2, ...shooterSetT4_1, ...shooterSetT4_2];
        await Promise.all(wave_1);


        const speederSetT4_1 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 6, 1, 6, 4, 100, 'bottomLeft', {x: '20%', y: '-max%'});
        const speederSetT4_2 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 6, 4, 6, 4, 100, 'bottomRight', {x: '80%', y: '-max%'});
        const multiSetT4_1 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 1, 6, 1, 4, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const shooterSetT4_3 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 1, 9, 8, 4, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const wave_2 = [...speederSetT4_1, ...speederSetT4_2, ...multiSetT4_1, ...shooterSetT4_3];
        await Promise.all(wave_2);


        const speederSetT4_3 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 8, 0, 4, 4, 100, 'bottomLeft', {x: '10%', y: '-max%'});
        const speederSetT4_4 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 8, 2, 4, 4, 100, 'bottomRight', {x: '90%', y: '-max%'});
        const flamerSetT4_1 = EnemyFactory.createSetFlamer(parallelGameEngine, player, this.level, 1, 6, 1, 4, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, true
        );
        const multiSetT4_2 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 1, 9, 8, 4, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const wave_3 = [...speederSetT4_3, ...speederSetT4_4, ...flamerSetT4_1, ...multiSetT4_2];
        await Promise.all(wave_3);


        const shooterSetT4_4 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 8, 1, 6, 4, 'bias', {
                direction: 'topLeft', speedX: 45, speedY: 45, x: 'max%', y: '-100%'
            }, false
        );
        const shooterSetT4_5 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 8, 1, 6, 4, 'bias', {
                direction: 'topRight', speedX: 45, speedY: 45, x: 'min%', y: '-100%'
            }, false
        );
        const orbSet4_1 = EnemyFactory.createSetOrb(parallelGameEngine, player, this.level, 3, 1, 10, 4, 'topZigzag', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                speedX: 30,
                speedY: 50
            }, true
        );
        const orbSet4_2 = EnemyFactory.createSetOrb(parallelGameEngine, player, this.level, 3, 1, 10, 4, 'topZigzag', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                speedX: 30,
                speedY: 50
            }, false
        );
        const wave_4 = [...shooterSetT4_4, ...shooterSetT4_5, ...orbSet4_1, ...orbSet4_2];
        await Promise.all(wave_4);
        
        
        const shooterSetT4_6 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 1, 1, 0, 4, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const multiSetT4_3 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 1, 2, 0, 4, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const flamerSetT4_2 = EnemyFactory.createSetFlamer(parallelGameEngine, player, this.level, 1, 3, 0, 4, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, true
        );
        const bomberSetT4_1 = EnemyFactory.createSetBomber(parallelGameEngine, player, this.level, 1, 4, 0, 4, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const orbSetT4_2 = EnemyFactory.createSetOrb(parallelGameEngine, player, this.level, 1, 5, 0, 4, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const wave_5 = [...shooterSetT4_6, ...multiSetT4_3, ...flamerSetT4_2, ...bomberSetT4_1, orbSetT4_2];
        await Promise.all(wave_5);


        const multiSetT4_4 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 3, 0, 10, 3, 'horizontal', {
                direction: 'left',
                speedX: 45,
                y:'-50%'
            }, false
        );
        const multiSetT4_5 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 3, 0, 10, 3, 'horizontal', {
                direction: 'right',
                speedX: 45,
                y:'-50%'
            }, false
        );
        const multiSetT4_6 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 3, 0, 10, 3, 'bottom', {
                speedY: 45,
                x:'50%'
            }, false
        );
        const flamerSetT4_3 = EnemyFactory.createSetFlamer(parallelGameEngine, player, this.level, 1, 1, 0, 4, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 150,
                speedY: 120
            }, false
        );
        const flamerSetT4_4 = EnemyFactory.createSetFlamer(parallelGameEngine, player, this.level, 1, 6, 0, 4, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 150,
                speedY: 120
            }, true
        );
        const wave_6 = [...multiSetT4_4, ...multiSetT4_5, ...multiSetT4_6, ...flamerSetT4_3, ...flamerSetT4_4];
        await Promise.all(wave_6);


        const shooterSetT4_7 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 4, 0, 2, 4, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '70%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 150,
                speedY: 120
            }, false
        );
        const shooterSetT4_8 = EnemyFactory.createSetShooter(parallelGameEngine, player, this.level, 4, 1, 2, 4, 'topWave', {
                direction: 'right',
                leftLimit: '30%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 150,
                speedY: 120
            }, false
        );
        const wave_7 = [...shooterSetT4_7, ...shooterSetT4_8];
        await Promise.all(wave_7);
        

        const multiSetT4_7 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 2, 0, 2, 4, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-100%',
                bottomLimit: '-0%',
                speedX: 150,
                speedY: 150
            }, false
        );
        const multiSetT4_8 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 2, 1, 2, 4, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-100%',
                bottomLimit: '-0%',
                speedX: 150,
                speedY: 150
            }, false
        );
        const wave_8 = [...multiSetT4_7, ...multiSetT4_8];
        await Promise.all(wave_8);
        

        const orbSetT4_3 = EnemyFactory.createSetOrb(parallelGameEngine, player, this.level, 1, 1, 0, 4, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-100%',
                bottomLimit: '-0%',
                speedX: 45,
                speedY: 45
            }, true
        );
        const orbSetT4_4 = EnemyFactory.createSetOrb(parallelGameEngine, player, this.level, 1, 5, 0, 4, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-100%',
                bottomLimit: '-0%',
                speedX: 45,
                speedY: 45
            }, false
        );
        const bomberSetT4_2 = EnemyFactory.createSetBomber(parallelGameEngine, player, this.level, 3, 1, 4, 4, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const bomberSetT4_3 = EnemyFactory.createSetBomber(parallelGameEngine, player, this.level, 3, 3, 4, 4, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const wave_9 = [...orbSetT4_3, ...orbSetT4_4, ...bomberSetT4_2, ...bomberSetT4_3];
        await Promise.all(wave_9);


        const multiSetT4_9 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 3, 1, 10, 4, 'topZigzag', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-100%',
                bottomLimit: '-0%',
                speedX: 150,
                speedY: 20
            }, false
        );
        const multiSetT4_10 = EnemyFactory.createSetMulti(parallelGameEngine, player, this.level, 3, 6, 10, 4, 'topZigzag', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-100%',
                bottomLimit: '-0%',
                speedX: 150,
                speedY: 20
            }, false
        );
        const speederSetT4_5 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 10, 1, 3, 4, 130, 'left', {x: 'max%', y: '-15%'});
        const speederSetT4_6 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 10, 27, 3, 4, 130, 'right', {x: 'min%', y: '-45%'});
        const wave_10 = [...multiSetT4_9, ...multiSetT4_10, ...speederSetT4_5, ...speederSetT4_6];
        await Promise.all(wave_10);
        
        
        const bomberSetT4_4 = EnemyFactory.createSetBomber(parallelGameEngine, player, this.level, 5, 0, 2, 4, 'topWave', {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120  // 120
            }, false
        );
        const bomberSetT4_5 = EnemyFactory.createSetBomber(parallelGameEngine, player, this.level, 5, 1, 2, 4, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const speederSetT4_7 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 5, 0, 2, 4, 100, 'right', {x: 'min%', y: '-40%'});
        const speederSetT4_8 = EnemyFactory.createSetSpeeder(parallelGameEngine, player, this.level, 5, 20, 2, 4, 100, 'left', {x: 'max%', y: '-40%'});
        const flamerSetT4_7 = EnemyFactory.createSetOrb(parallelGameEngine, player, this.level, 2, 20, 5, 2, 'topWave', {
                direction: 'right',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-90%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }, false
        );
        const wave_11 = [...bomberSetT4_4, ...bomberSetT4_5, ...speederSetT4_7, ...speederSetT4_8 , ...flamerSetT4_7];
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