class Credits {
    static creditsTag = document.querySelector('.credits');
    static creditsContentTag = document.querySelector('.credits .content');
    static creditsHandler = null;
    static soundtrack = new Soundtrack(
        'skyForceReload',
        '07.SkyForceReloaded2006_-_In-Game1',
        'mp3',
        true,
        Settings.audioVolume
    );
    static openPage() {
        Credits.setAEL();
        Credits.creditsContentTag.style.transform = `translate(${0}px, ${750}px)`;
        Credits.creditsTag.style.display = 'flex';
        Credits.soundtrack.play();
        const contentHeight = Credits.creditsContentTag.getBoundingClientRect().height * -1;
        Credits.creditsContentTag.style.transform = `translate(${0}px, ${contentHeight}px)`;
    }
    static closePage() {
        Credits.removeAEL();
        Credits.soundtrack.stop();
        Credits.creditsTag.style.display = 'none';
        Menu.openPage();
        Menu.soundtrack.play();
    }
    static setAEL() {
        Credits.creditsHandler = (e) => {
            if (e.key == 'Escape') {
                Credits.closePage();
            }
        };
        window.addEventListener('keyup', Credits.creditsHandler, false);
    }
    static removeAEL() {
        window.removeEventListener('keyup', Credits.creditsHandler, false);
        Credits.creditsHandler = null;
    }
}