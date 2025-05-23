class PlayerBaseInfo {
    static hp = 100;
    static damage = 35;
    static adderHp = 35;
    static adderDamage = 15;
}



class UserMenu {
    static tag = document.querySelector('.userMenu');
    static buttons = [...document.querySelectorAll('.userMenu .buttons .button')];
    static handlers = [];
    static playerHp = undefined;
    static playerDamage = undefined;
    static usersData = [];
    static selectedPlayerIDX = undefined;
    static upgradeAmountHp = 7;
    static upgradeAmountDamage = 7;
    static upgradesValueHp = [40, 80, 120, 160, 200, 280, 400];  // OLD: [20, 40, 60, 80, 100, 140, 200]
    static upgradesValueDamage = [40, 80, 120, 160, 200, 280, 400];  // OLD: [20, 40, 60, 80, 100, 140, 200]
    static buttonHp = document.querySelector('.userMenu .buttonHp');
    static buttonDamage = document.querySelector('.userMenu .buttonDamage');
    static loadScreen = document.querySelector('.userMenu .loadScreen');
    static openPage() {
        UserMenu.tag.style.display = 'flex';
        UserMenu.downloadData();
    }
    static closePageToUsers() {
        UserMenu.tag.style.display = 'none';
        Users.openPage();
    }
    static closePageToLevel(levelNumber) {
        UserMenu.tag.style.display = 'none';
        let level = null;
        switch (levelNumber) {
            case 1:
                level = new Level_1();
                level.openPage('intro');
                break;
            case 2:
                level = new Level_2();
                level.openPage(false);
                break;
            case 3:
                level = new Level_3();
                level.openPage(false);
                break;
            case 4:
                level = new Level_4();
                level.openPage(false);
                break;
            case 5:
                level = new Boss();
                level.openPage('ending');
                break;
        }
    }
    static updateButtons() {
        const upgradeButtons = [...document.querySelectorAll('.userMenu .upgrades .button')];
        const levelButtons = [...document.querySelectorAll('.userMenu .levels .button')];
        UserMenu.buttons.push(...upgradeButtons);
        UserMenu.buttons.push(...levelButtons);
    }
    static setAEL() {
        for (let i = 0; i < UserMenu.buttons.length; i++) {
            UserMenu.handlers[i] = (e) => {
                const tag = e.currentTarget;
                // let className = '';
                switch (tag.id) {
                    case 'userMenu_hp':
                        // console.log('userMenu_hp');
                        UserMenu.upgradeHp(tag);
                        break;
                    case 'userMenu_damage':
                        // console.log('userMenu_damage');
                        UserMenu.upgradeDamage(tag);
                        break;
                    case 'userMenu_level-1':
                        console.log('userMenu_level-1');
                        // UserMenu.tag.style.display = 'none';
                        removeGameNavigateAllAEL(1);
                        UserMenu.closePageToLevel(1);
                        break;
                    case 'userMenu_level-2':
                        if (tag.classList.contains('button-enable')) {
                            console.log('userMenu_level-2');
                            removeGameNavigateAllAEL();
                            UserMenu.closePageToLevel(2);
                        }
                        break;
                    case 'userMenu_level-3':
                        if (tag.classList.contains('button-enable')) {
                            console.log('userMenu_level-3');
                            removeGameNavigateAllAEL();
                            UserMenu.closePageToLevel(3);
                        }
                        break;
                    case 'userMenu_level-4':
                        if (tag.classList.contains('button-enable')) {
                            console.log('userMenu_level-4');
                            removeGameNavigateAllAEL();
                            UserMenu.closePageToLevel(4);
                        }
                        break;
                    case 'userMenu_bossFight':
                        if (tag.classList.contains('button-enable')) {
                            console.log('userMenu_bossFight');
                            removeGameNavigateAllAEL();
                            UserMenu.closePageToLevel(5);
                        }
                        break;
                    case 'userMenu_back':
                        UserMenu.closePageToUsers();
                        break;
                }
            };
            UserMenu.buttons[i].addEventListener('click', UserMenu.handlers[i], false);
        }
    }
    static removeAEL() {
        for (let i = 0; i < UserMenu.buttons.length; i++) {
            UserMenu.buttons[i].removeEventListener('click', UserMenu.handlers[i], false);
            UserMenu.handlers[i] = null;
        }
        UserMenu.handlers = [];
    }
    static updateData() {  // TODO: po każdym download, download zawsze przy wejściu na stronę i po save
        const player = UserMenu.selectedPlayerIDX;

        document.querySelector('.userMenu .title .userName').textContent = UserMenu.usersData[player][0];
        document.querySelector('.userMenu .title .stars').textContent = UserMenu.usersData[player][7];

        const upgradeHp = Number(UserMenu.usersData[player][8]);
        const upgradeDamage = Number(UserMenu.usersData[player][9]);
        const adderHp = 100 / UserMenu.upgradeAmountHp;
        const adderDamage = 100 / UserMenu.upgradeAmountDamage;
        let valueHp = 0;
        let valueDamage = 0;
        valueHp = (upgradeHp < UserMenu.upgradeAmountHp) ? adderHp * upgradeHp : 100;
        valueDamage = (upgradeDamage < UserMenu.upgradeAmountDamage) ? adderDamage * upgradeDamage : 100;
        document.querySelector('.userMenu .bar .hp').style.width = valueHp.toFixed(2) + '%';
        document.querySelector('.userMenu .bar .damage').style.width = valueDamage.toFixed(2) + '%';
        const tagTextHp = document.querySelector('.userMenu .textHP');
        const tagTextDamage = document.querySelector('.userMenu .textDamage');
        if (upgradeHp < UserMenu.upgradeAmountHp) {
            tagTextHp.textContent = UserMenu.upgradesValueHp[upgradeHp];
            UserMenu.buttonHp.style.display = 'flex';
        } else {
            UserMenu.buttonHp.style.display = 'none';
        }
        if (upgradeDamage < UserMenu.upgradeAmountDamage) {
            tagTextDamage.textContent = UserMenu.upgradesValueDamage[upgradeDamage];
            UserMenu.buttonDamage.style.display = 'flex';
        } else {
            UserMenu.buttonDamage.style.display = 'none';
        }
        
        UserMenu.playerHp = PlayerBaseInfo.hp + (PlayerBaseInfo.adderHp * upgradeHp);
        UserMenu.playerDamage = PlayerBaseInfo.damage + (PlayerBaseInfo.adderDamage * upgradeDamage);

        const scores = document.querySelectorAll('.userMenu .scores .score');
        for (let i = 0; i < scores.length; i++) {
            scores[i].textContent = UserMenu.usersData[player][i + 1];
        }
        const levelsButtons = document.querySelectorAll('.userMenu .levels .button');
        levelsButtons[0].classList.add('button-enable');
        for (let i = 0; i < levelsButtons.length - 1; i++) {
            let levelValue = Number(UserMenu.usersData[player][i + 2]);
            if (levelValue > 0) {
                if (levelsButtons[i + 1].classList.contains('button-disable')) {
                    levelsButtons[i + 1].classList.remove('button-disable');
                }
                if (!levelsButtons[i + 1].classList.contains('button-enable')) {
                    levelsButtons[i + 1].classList.add('button-enable');
                }
            } else {
                if (levelsButtons[i + 1].classList.contains('button-enable')) {
                    levelsButtons[i + 1].classList.remove('button-enable');
                }
                if (!levelsButtons[i + 1].classList.contains('button-disable')) {
                    levelsButtons[i + 1].classList.add('button-disable');
                }
            }
        }

        UserMenu.loadScreen.style.display = 'none';
    }
    static unzipData(zipData) {
        console.log(zipData);
        let users = zipData.split('*');
        let usersData = [];
        users.forEach(user => {
            usersData.push(user.split('#'));
        });
        UserMenu.usersData = usersData;
        console.log(UserMenu.usersData);
    }
    static downloadData() {
        UserMenu.loadScreen.style.display = 'flex';
        JS_userMenu_download();
    }
    static saveData(data) {
        UserMenu.loadScreen.style.display = 'flex';
        let newData = data
        let dataString = '';
        for (let i = 0; i < newData.length; i++) {
            for (let j = 0; j < newData[i].length; j++) {
                dataString += newData[i][j];
                if (j < newData[i].length - 1) {
                    dataString += '#';
                }
            }
            if (i < newData.length - 1) {
                dataString += '*';
            }
        }
        JS_userMenu_save(dataString);
    }
    static upgradeHp() {
        const costtHp = Number(document.querySelector('.userMenu .textHP').textContent);
        const player = UserMenu.selectedPlayerIDX;
        let stars = Number(UserMenu.usersData[player][7]);
        console.log('(stars >= costtHp) = ' + stars + ' >= ' + costtHp + ' = ' + (stars >= costtHp));
        if (stars >= costtHp) {
            stars = String(stars - costtHp);
            UserMenu.usersData[player][7] = stars;
            UserMenu.usersData[player][8]++;
            UserMenu.usersData[player][8] = String(UserMenu.usersData[player][8]);
            UserMenu.saveData(UserMenu.usersData);
        }
    }
    static upgradeDamage() {
        const costDamage = Number(document.querySelector('.userMenu .textDamage').textContent);
        const player = UserMenu.selectedPlayerIDX;
        let stars = Number(UserMenu.usersData[player][7]);
        console.log('(stars >= costDamage) = ' + stars + ' >= ' + costDamage + ' = ' + (stars >= costDamage));
        if (stars >= costDamage) {
            stars = String(stars - costDamage);
            UserMenu.usersData[player][7] = stars;
            UserMenu.usersData[player][9]++;
            UserMenu.usersData[player][9] = String(UserMenu.usersData[player][9]);
            UserMenu.saveData(UserMenu.usersData);
        }
    }
}

UserMenu.updateButtons();



function JS_userMenu_download() {
    fetch(AJAX_userMenu_download.ajax_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'JS_ActionName_userMenu_download'
        }),
    })
    .then((response) => response.json())
    .then((payload) => {
        // console.log(payload.debug);
        // console.log(payload.data);
        UserMenu.unzipData(payload.data);
        UserMenu.updateData();
    })
    .catch((error) => console.error('Błąd:', error));
}

function JS_userMenu_save(data) {
    fetch(AJAX_userMenu_save.ajax_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'JS_ActionName_userMenu_save',
            data: data
        }),
    })
    .then((response) => response.json())
    .then((payload) => {
        // console.log(payload.debug);
        // console.log(payload.data);
        JS_userMenu_download();
    })
    .catch((error) => console.error('Błąd:', error));
}