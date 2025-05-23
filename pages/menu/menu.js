class Menu {
    static isCoverAlreadySee = false;
    static menuTag = document.querySelector('.menu');
    static covertag = document.querySelector('.menu .cover');
    static navtag = document.querySelector('.menu .nav');
    static coverButton = document.querySelector('.menu .cover .button');
    static navButtons = document.querySelectorAll('.menu .nav .button');
    static coverHandler = null;
    static navHandlers = [];  // [event, event, ...]
    static soundtrack = new Soundtrack(
        'skyForceReload',
        '06.SkyForceReloaded_-_MenuTrack',
        'mp3',
        true,
        Settings.audioVolume
    );
    static openPage(info) {
        if (info) {
            console.log(info);
        }
        Menu.menuTag.style.display = 'flex';
        if (!Menu.isCoverAlreadySee) {
            Menu.covertag.style.display = 'flex';
            Menu.navtag.style.display = 'none';
            Menu.menuTag.classList.add('image-menu-cover');
        } else {
            Menu.covertag.style.display = 'none';
            Menu.navtag.style.display = 'flex';
            Menu.menuTag.classList.add('image-menu-nav');
        }
    }
    static closeCoverPage() {
        Menu.isCoverAlreadySee = true;
        Menu.covertag.style.display = 'none';
        Menu.navtag.style.display = 'flex';
        Menu.menuTag.classList.remove('image-menu-cover');
        Menu.menuTag.classList.add('image-menu-nav');
        Menu.soundtrack.play();
    }
    static closeNavPage() {
        Menu.navtag.style.display = 'none';
        Menu.menuTag.style.display = 'none';
        Menu.menuTag.classList.remove('image-menu-nav');
    }
    static setCoverAEL() {
        Menu.coverHandler = () => Menu.closeCoverPage();
        Menu.coverButton.addEventListener('click', Menu.coverHandler, false);
    }
    static removeCoverAEL() {
        Menu.coverButton.removeEventListener('click', Menu.coverHandler, false);
        Menu.coverHandler = null;
    }
    static setNavAEL() {
        for (let i = 0; i < Menu.navButtons.length; i++) {
            Menu.navHandlers[i] = (e) => {
                const tag = e.currentTarget;
                switch (tag.id) {
                    case 'menu_selectPlayer':
                        Menu.closeNavPage();
                        Users.openPage();
                        break;
                    case 'menu_ranking':
                        Menu.closeNavPage();
                        Ranking.openPage();
                        break;
                    case 'menu_instruction':
                        Menu.closeNavPage();
                        Instruction.openPage();
                        break;
                    case 'menu_settings':
                        Menu.closeNavPage();
                        Settings.openPage();
                        break;
                    case 'menu_credits':
                        Menu.soundtrack.stop();
                        Menu.closeNavPage();
                        Credits.openPage();
                        break;
                }
            };
            Menu.navButtons[i].addEventListener('click', Menu.navHandlers[i], false);
        }
    }
    static removeNavAEL() {
        for (let i = 0; i < Menu.navButtons.length; i++) {
            Menu.navButtons[i].removeEventListener('click', Menu.navHandlers[i], false);
            Menu.navHandlers[i] = null;
        }
        Menu.navHandlers = [];
    }
}

function setGameNavigateAllAEL() {
    Menu.setCoverAEL();
    Menu.setNavAEL();
    Users.setAEL();
    UserMenu.setAEL();
    Ranking.setAEL();
    Instruction.setAEL();
    Settings.setAEL();
    GameSummary.setAEL();
}

function removeGameNavigateAllAEL() {
    Menu.removeCoverAEL();
    Menu.removeNavAEL();
    Users.removeAEL();
    UserMenu.removeAEL();
    Ranking.removeAEL();
    Instruction.removeAEL();
    Settings.removeAEL();
    GameSummary.removeAEL();
    
    // console.log('cover ', getEventListeners(Menu.coverButton));
    // Menu.navButtons.forEach((btn, i) => {
    //     console.log(btn.id, getEventListeners(btn));
    // });
    // Users.usersButtons.forEach((btn, i) => {
    //     console.log(btn.id, getEventListeners(btn));
    // });
    // UserMenu.buttons.forEach((btn, i) => {
    //     console.log(btn.id, getEventListeners(btn));
    // });
    // Ranking.rankingButtons.forEach((btn, i) => {
    //     console.log(btn.id, getEventListeners(btn));
    // });
    // Instruction.instructionButtons.forEach((btn, i) => {
    //     console.log(btn.id, getEventListeners(btn));
    // });
    // Settings.settingsButtons.forEach((btn, i) => {
    //     console.log(btn.id, getEventListeners(btn));
    // });
}

window.addEventListener('DOMContentLoaded', () => {
    Settings.downloadData();
    setGameNavigateAllAEL();
    Menu.openPage();
}, false);