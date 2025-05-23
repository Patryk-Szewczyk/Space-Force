class Users {
    static usersTag = document.querySelector('.users');
    static usersButtons = [...document.querySelectorAll('.users .buttons .button')];
    static usersHandlers = [];
    static usersItems = document.querySelector('.users .items');
    static data = [];
    static selectedPlayer = undefined;
    static selectedPlayerIDX = undefined;
    static createPlayerScreen = document.querySelector('.users .createPlayer');
    static createPlayerInput = document.querySelector('.users .createPlayer input');
    static scoreZeroAmount = 9;
    static scoreZeroAmountString = undefined;
    static loadScreen = document.querySelector('.users .loadScreen');
    static openPage() {
        Users.usersTag.style.display = 'flex';
        Users.determineEmptyScore();
        Users.downloadData();
    }
    static closePage() {
        Users.usersTag.style.display = 'none';
        Menu.openPage();
    }
    static updateButtons() {
        const userCreateButtons = document.querySelectorAll('.users .createButtons .button');
        Users.usersButtons.push(...userCreateButtons);
    }
    static setAEL() {
        for (let i = 0; i < Users.usersButtons.length; i++) {
            Users.usersHandlers[i] = (e) => {
                const tag = e.currentTarget;
                switch (tag.id) {
                    case 'users_select':
                        if (Users.selectedPlayerIDX == undefined) {
                            return;
                        }
                        UserMenu.selectedPlayerIDX = Users.selectedPlayerIDX;
                        Users.closePage();
                        UserMenu.openPage();
                        break;
                    case 'users_create':
                        Users.createUser();
                        break;
                    case 'users_addPlayer':
                        Users.addUser();
                        break;
                    case 'users_delete':
                        Users.deleteUser();
                        break;
                    case 'users_back':
                        Users.closePage();
                        break;
                }
            };
            Users.usersButtons[i].addEventListener('click', Users.usersHandlers[i], false);
        }
    }
    static removeAEL() {
        for (let i = 0; i < Users.usersButtons.length; i++) {
            Users.usersButtons[i].removeEventListener('click', Users.usersHandlers[i], false);
            Users.usersHandlers[i] = null;
        }
        Users.usersHandlers = [];
    }
    static createUser() {
        Users.createPlayerScreen.style.display = 'flex';
    }
    static addUser() {
        console.trace('addUser');
        const valueToRemoveSpace = Users.createPlayerInput.value.trim();
        Users.createPlayerInput.value = '';
        let value = '';
        let isSpace = false;
        for (let i = 0; i < valueToRemoveSpace.length; i++) {
            let char = valueToRemoveSpace[i];
            if (char === ' ') {
            if (!isSpace) {
                value += ' ';
                isSpace = true;
            }
            } else {
                value += char;
                isSpace = false;
            }
        }
        if (value.length == 0) {
            alert('Field is empty. Enter player name.');
            return;
        }
        for (let i = 0; i < Users.data.length; i++) {
            if (value == Users.data[i][0]) {
                alert('This player already exists. Please enter another name.');
                return;
            }
        }
        Users.createPlayerScreen.style.display = 'none';
        Users.loadScreen.style.display = 'flex';
        let newData = Users.data;
        newData.push([
            value, 
            Users.scoreZeroAmountString,
            Users.scoreZeroAmountString,
            Users.scoreZeroAmountString,
            Users.scoreZeroAmountString,
            Users.scoreZeroAmountString,
            Users.scoreZeroAmountString,
            '0', '0', '0'
        ]);
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
        Users.saveData(dataString);
    }
    static deleteUser() {
        if (Users.selectedPlayerIDX == undefined) {
            return;
        }
        Users.loadScreen.style.display = 'flex';
        if (Users.selectedPlayerIDX != undefined) {
            let newData = Users.data;
            newData.splice(Users.selectedPlayerIDX, 1);
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
            JS_users_save(dataString);
        }
    }
    static downloadData() {
        Users.loadScreen.style.display = 'flex';
        JS_users_download();
    }
    static saveData(data) {
        Users.loadScreen.style.display = 'flex';
        JS_users_save(data);
    }
    static updateData(dataString) {
        const itemsList = document.querySelectorAll('.users .item');
        for (let i = 0; i < itemsList.length; i++) {
            Users.usersItems.removeChild(itemsList[i]);
        }
        const users = dataString.split('*');
        Users.selectedPlayerIDX = undefined;
        if (users == '') {
            Users.loadScreen.style.display = 'none';
            return;
        }
        let usersData = [];
        let usersTag = [];
        for (let i = 0; i < users.length; i++) {
            usersData.push(users[i].split('#'));
            let item = document.createElement('div');
            item.setAttribute('class', 'item');
            item.setAttribute('id', 'selectUser_' + i);
            item.classList.add('item-notChecked');
            let number = document.createElement('div');
            number.setAttribute('class', 'number');
            number.textContent = (i + 1) + '.';
            let name = document.createElement('div');
            name.setAttribute('class', 'name');
            name.textContent = usersData[i][0];
            item.appendChild(number);
            item.appendChild(name);
            usersTag.push(item);
            Users.usersItems.appendChild(item);
        }
        Users.data = usersData;
        for (let i = 0; i < usersTag.length; i++) {
            usersTag[i].addEventListener('click', (e) => {
                const tag = e.currentTarget;
                const id = tag.id.split('_')[1];
                Users.selectedPlayerIDX = id;
                Users.selectedPlayer = Users.data[id][0];
                for (let i = 0; i < usersTag.length; i++) {
                    if (id == i) {  // checked
                        usersTag[i].classList.remove('item-notChecked');
                        usersTag[i].classList.add('item-checked');
                    } else {  // not checked
                        usersTag[i].classList.remove('item-checked');
                        usersTag[i].classList.add('item-notChecked');
                    }
                }
            }, false);
        }
        Users.loadScreen.style.display = 'none';
    }
    static determineEmptyScore() {
        let zeroString = '';
        for (let i = 0; i < Users.scoreZeroAmount; i++) {
            zeroString += '0';
        }
        Users.scoreZeroAmountString = zeroString;
    }
}

Users.updateButtons();



function JS_users_download() {
    fetch(AJAX_ranking_download.ajax_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'JS_ActionName_users_download'
        }),
    })
    .then((response) => response.json())
    .then((payload) => {
        // console.log(payload.debug);
        // console.log(payload.data);
        Users.updateData(payload.data);
    })
    .catch((error) => console.error('Błąd:', error));
}

function JS_users_save(data) {
    fetch(AJAX_users_save.ajax_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'JS_ActionName_users_save',
            data: data
        }),
    })
    .then((response) => response.json())
    .then((payload) => {
        console.log(payload.debug);
        console.log(payload.data);
        JS_users_download();
    })
    .catch((error) => console.error('Błąd:', error));
}