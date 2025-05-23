class Boss {
    level = undefined;
    isWin = false;
    soundtrack = undefined;
    gameEngine = undefined;
    player = undefined;
    playerIDX = undefined;
    levelIDX = 6;
    stars = 0;
    score = 0;
    bodyTag = document.querySelector('body');
    infoTag = document.querySelector('.player-info');
    boardTag = document.querySelector('.game-board');
    objects = [];
    isCutsceneIntro = false;
    isCutsceneEnding = false;
    isBossDefeat = false;
    constructor() {
        this.level = this;
        this.soundtrack = new Soundtrack(
            'skyForceReload',
            // '01.SkyForceReloaded_-_In-Game1',
            // '02.SkyForceReloaded_-_In-Game2',
            // '03.SkyForceReloaded_-_In-Game3',
            // '04.SkyForceReloaded_-_In-Game4',
            '05.SkyForceReloaded_-_BossFight',
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
    openPage(isCutscene) {  // TODO: Przenieś to później do klasy GameBoard!!!
        this.boardTag.style.display = 'flex';
        this.infoTag.style.display = 'grid';
        switch (isCutscene) {
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
        if (this.soundtrack) {
            this.soundtrack.stop();
            this.soundtrack = null;
        }
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

        // Konfuguracja szybkostrzelności gracza pod bossa:
        Player.fireRate.currentValue = 0.1;
        Player.updateFireRateBar(Player.fireRate.upgradesAmount);
        Player.shooting.stopShooting();
        Player.shooting.startShooting();

        const abyssCore = EnemyFactory.createAbyssCore(parallelGameEngine, player, this.level, 1, {
                direction: 'left',
                leftLimit: '0%',
                rightLimit: '100%',
                topLimit: '-95%',
                bottomLimit: '-60%',
                speedX: 120,
                speedY: 120
            }
        );

        await Promise.all(abyssCore);
        this.isBossDefeat = true;
        // console.log('ok');

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
            
            if (!this.isCutsceneEnding || !this.isBossDefeat) {
                this.closePage();
            } else {
                GameBoard.runCutsceneEnding(this);
            }
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