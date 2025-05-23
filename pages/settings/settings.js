class Settings {
    static settingsTag = document.querySelector('.settings');
    static settingsButtons = document.querySelectorAll('.settings .buttons .button');
    static settingsHandlers = [];
    static fps = 60;
    static audioVolume = 1;
    static inputRange = document.querySelector('.settings .inputAudioVolume');
    static inputRadio = document.querySelectorAll('.settings .inputFps');
    static loadScreen = document.querySelector('.settings .loadScreen');
    static openPage() {
        Settings.settingsTag.style.display = 'flex';
        Settings.downloadData();
    }
    static closePage() {
        Settings.settingsTag.style.display = 'none';
        Menu.openPage();
    }
    static setAEL() {
        for (let i = 0; i < Settings.settingsButtons.length; i++) {
            Settings.settingsHandlers[i] = (e) => {
                const tag = e.currentTarget;
                switch (tag.id) {
                    case 'settings_apply':
                        Settings.saveData();
                        break;
                    case 'settings_back':
                        Settings.closePage();
                        Menu.openPage();
                        break;
                }
            };
            Settings.settingsButtons[i].addEventListener('click', Settings.settingsHandlers[i], false);
        }
    }
    static removeAEL() {
        for (let i = 0; i < Settings.settingsButtons.length; i++) {
            Settings.settingsButtons[i].removeEventListener('click', Settings.settingsHandlers[i], false);
            Settings.settingsHandlers[i] = null;
        }
        Settings.settingsHandlers = [];
    }
    static downloadData() {
        Settings.loadScreen.style.display = 'flex';
        JS_settings_download();
    }
    static saveData() {
        Settings.loadScreen.style.display = 'flex';
        let audioVolume = Settings.inputRange.value / 100;
        let fps = undefined;
        for (let i = 0; i < Settings.inputRadio.length; i++) {
            if (Settings.inputRadio[i].checked) {
                switch (i) {
                    case 0: fps = 15; break;
                    case 1: fps = 30; break;
                    case 2: fps = 45; break;
                    case 3: fps = 60; break;
                    case 4: fps = 120; break;
                }
            }
        }
        JS_settings_save(audioVolume, fps);
    }
    static updateData(dataString) {
        const data = dataString.split('*');
        Settings.audioVolume = data[0];
        Settings.fps = data[1];
        Settings.inputRange.value = Settings.audioVolume * 100;
        const fpsOptions = [15, 30, 45, 60, 120];
        for (let i = 0; i < fpsOptions.length; i++) {
            let radioInput = Settings.inputRadio[i];
            if (radioInput.value == Settings.fps) {
                radioInput.checked = true;
            } else {
                radioInput = false;
            }
        }
        Menu.soundtrack.volume = Settings.audioVolume;
        Settings.loadScreen.style.display = 'none';
    }
}



function JS_settings_download() {
    fetch(AJAX_settings_download.ajax_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'JS_ActionName_settings_download'
        }),
    })
    .then((response) => response.json())
    .then((payload) => {
        // console.log(payload.debug);
        // console.log(payload.data);
        Settings.updateData(payload.data);
    })
    .catch((error) => console.error('Błąd:', error));
}

function JS_settings_save(audioVolume, fps) {
    fetch(AJAX_settings_save.ajax_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'JS_ActionName_settings_save',
            audioVolume: audioVolume,
            fps: fps
        }),
    })
    .then((response) => response.json())
    .then((payload) => {
        // console.log(payload.debug);
        JS_settings_download();
    })
    .catch((error) => console.error('Błąd:', error));
}