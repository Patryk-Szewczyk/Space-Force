class GameSummary {
    static tag = document.querySelector('.game-summary');
    static buttons = document.querySelectorAll('.game-summary .buttons .button');
    static handlers = [];
    static gainedScore = undefined;
    static gainedStars = undefined;
    static isWin = undefined;
    static infoWin = document.querySelector('.game-summary .info-win');
    static infoLose = document.querySelector('.game-summary .info-lose');
    static tagScoreValue = document.querySelector('.game-summary .score .value');
    static tagStarsValue = document.querySelector('.game-summary .stars .value');
    static goToGameSummeryDelay = 2500;
    static openPage(isWin) {
        GameSummary.tag.style.display = 'flex';
        GameSummary.isWin = isWin;
        if (GameSummary.isWin) {
            GameSummary.infoWin.style.display = 'flex';
            GameSummary.infoLose.style.display = 'none';
            GameSummary.tagScoreValue.textContent = GameSummary.gainedScore;
            GameSummary.tagStarsValue.textContent = GameSummary.gainedStars;
        } else {
            GameSummary.infoWin.style.display = 'none';
            GameSummary.infoLose.style.display = 'flex';
            GameSummary.tagScoreValue.textContent = '';
            GameSummary.tagStarsValue.textContent = '';
        }
    }
    static closePage() {
        GameSummary.tag.style.display = 'none';
        UserMenu.tag.style.display = 'flex';
        if (GameSummary.isWin) UserMenu.saveData(UserMenu.usersData);
    }
    static setAEL() {
        for (let i = 0; i < GameSummary.buttons.length; i++) {
            GameSummary.handlers[i] = (e) => {
                const tag = e.currentTarget;
                switch (tag.id) {
                    case 'gameSummary_back':
                        GameSummary.closePage();
                        break;
                }
            };
            GameSummary.buttons[i].addEventListener('click', GameSummary.handlers[i], false);
        }
    }
    static removeAEL() {
        for (let i = 0; i < GameSummary.buttons.length; i++) {
            GameSummary.buttons[i].removeEventListener('click', GameSummary.handlers[i], false);
            GameSummary.handlers[i] = null;
        }
        GameSummary.handlers = [];
    }
}