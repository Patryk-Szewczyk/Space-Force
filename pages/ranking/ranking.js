class Ranking {
    static maxPlayers = 20;
    static rankingTag = document.querySelector('.ranking');
    static rankingButtons = document.querySelectorAll('.ranking .buttons .button');
    static rankingHandlers = [];
    static rankingItems = document.querySelector('.ranking .items');
    static scoreZeroAmount = 9;
    static scoreZeroAmountString = undefined;
    static loadScreen = document.querySelector('.ranking .loadScreen');
    static openPage() {
        Ranking.rankingTag.style.display = 'flex';
        const itemsList = document.querySelectorAll('.ranking .item');
        for (let i = 0; i < itemsList.length; i++) {
            Ranking.rankingItems.removeChild(itemsList[i]);
        }
        Ranking.determineEmptyScore();
        Ranking.downloadData();
    }
    static closePage() {
        Ranking.rankingTag.style.display = 'none';
        Menu.openPage();
    }
    static setAEL() {
        for (let i = 0; i < Ranking.rankingButtons.length; i++) {
            Ranking.rankingHandlers[i] = (e) => {
                const tag = e.currentTarget;
                switch (tag.id) {
                    case 'ranking_back':
                        Ranking.closePage();
                        Menu.openPage();
                        break;
                }
            };
            Ranking.rankingButtons[i].addEventListener('click', Ranking.rankingHandlers[i], false);
        }
    }
    static removeAEL() {
        for (let i = 0; i < Ranking.rankingButtons.length; i++) {
            Ranking.rankingButtons[i].removeEventListener('click', Ranking.rankingHandlers[i], false);
            Ranking.rankingHandlers[i] = null;
        }
        Ranking.rankingHandlers = [];
    }
    static downloadData() {
        Ranking.loadScreen.style.display = 'flex';
        JS_ranking_download();
    }
    static updateData(dataString) {
        let users = dataString.split('*');
        let usersData = [];
        for (let i = 0; i < users.length; i++) {
            usersData.push(users[i].split('#'));
        }

        let swapped = true;
        while (swapped) {
            swapped = false;
            for (let i = 0; i < usersData.length - 1; i++) {
                if (usersData[i][1] < usersData[i + 1][1]) {
                    let first = usersData[i];
                    let second = usersData[i + 1];
                    usersData[i] = second;
                    usersData[i + 1] = first;
                    swapped = true;
                }
            }
        }
        console.log(usersData);

        let isNot20 = true
        let lastIdx = Ranking.maxPlayers;
        for (let i = 0; i < usersData.length; i++) {
            if (i < Ranking.maxPlayers) {
                let item = document.createElement('div');
                item.setAttribute('class', 'item');
                let number = document.createElement('div');
                number.setAttribute('class', 'number');
                number.textContent = (i + 1) + '.';
                let name = document.createElement('div');
                name.setAttribute('class', 'name');
                name.textContent = usersData[i][0];
                let score = document.createElement('div');
                score.setAttribute('class', 'score');
                score.textContent = usersData[i][1];
                item.appendChild(number);
                item.appendChild(name);
                item.appendChild(score);
                Ranking.rankingItems.appendChild(item);
            }
            if (i == Ranking.maxPlayers - 1) {
                isNot20 = false;
                break;
            }
            lastIdx = i + 1;
        }
        if (isNot20) {
            for (let i = lastIdx; i < 20; i++) {
                let item = document.createElement('div');
                item.setAttribute('class', 'item');
                let number = document.createElement('div');
                number.setAttribute('class', 'number');
                number.textContent = (i + 1) + '.';
                let name = document.createElement('div');
                name.setAttribute('class', 'name');
                let score = document.createElement('div');
                score.setAttribute('class', 'score');
                score.textContent = Ranking.scoreZeroAmountString;
                item.appendChild(number);
                item.appendChild(name);
                item.appendChild(score);
                Ranking.rankingItems.appendChild(item);
            }
        }
        Ranking.loadScreen.style.display = 'none';
        console.log(usersData);
    }
    static determineEmptyScore() {
        let zeroString = '';
        for (let i = 0; i < Ranking.scoreZeroAmount; i++) {
            zeroString += '0';
        }
        Ranking.scoreZeroAmountString = zeroString;
    }
}



function JS_ranking_download() {
    fetch(AJAX_ranking_download.ajax_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'JS_ActionName_ranking_download'
        }),
    })
    .then((response) => response.json())
    .then((payload) => {
        console.log(payload.debug);
        console.log(payload.data);
        Ranking.updateData(payload.data);
    })
    .catch((error) => console.error('Błąd:', error));
}