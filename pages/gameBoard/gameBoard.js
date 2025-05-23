class GameBoard {
    static firstLevelScoreIDX = 2;
    static lastLevelScoreIDX = 6;
    static tagComic_1_pages = document.querySelectorAll('.comic-1');
    static tagComic_2_pages = document.querySelectorAll('.comic-2');
    static comis_1_delays = [3000, 6000, 4000, 3000];
    static comis_2_delays = [3000, 3000, 3000, 3000, 3000, 3000];
    static runCutsceneIntro(level) {
        GameBoard.tagComic_1_pages[0].style.display = "flex";
        setTimeout(() => {
            GameBoard.tagComic_1_pages[0].style.display = "none";
            GameBoard.tagComic_1_pages[1].style.display = "flex";
            setTimeout(() => {
                GameBoard.tagComic_1_pages[1].style.display = "none";
                GameBoard.tagComic_1_pages[2].style.display = "flex";
                setTimeout(() => {
                    GameBoard.tagComic_1_pages[2].style.display = "none";
                    GameBoard.tagComic_1_pages[3].style.display = "flex";
                    setTimeout(() => {
                        GameBoard.tagComic_1_pages[3].style.display = "none";
                        level.goToLevel();
                    }, GameBoard.comis_1_delays[3]);
                }, GameBoard.comis_1_delays[2]);
            }, GameBoard.comis_1_delays[1]);
        }, GameBoard.comis_1_delays[0]);
    }
    static runCutsceneEnding(level) {
        level.soundtrack.stop();
        level.soundtrack = null;
        Menu.soundtrack.play();
        GameBoard.tagComic_2_pages[0].style.display = "flex";
        setTimeout(() => {
            GameBoard.tagComic_2_pages[0].style.display = "none";
            GameBoard.tagComic_2_pages[1].style.display = "flex";
            setTimeout(() => {
                GameBoard.tagComic_2_pages[1].style.display = "none";
                GameBoard.tagComic_2_pages[2].style.display = "flex";
                setTimeout(() => {
                    GameBoard.tagComic_2_pages[2].style.display = "none";
                    GameBoard.tagComic_2_pages[3].style.display = "flex";
                    setTimeout(() => {
                        GameBoard.tagComic_2_pages[3].style.display = "none";
                        GameBoard.tagComic_2_pages[4].style.display = "flex";
                        setTimeout(() => {
                            GameBoard.tagComic_2_pages[4].style.display = "none";
                            GameBoard.tagComic_2_pages[5].style.display = "flex";
                            setTimeout(() => {
                                GameBoard.tagComic_2_pages[5].style.display = "none";
                                level.closePage();
                            }, GameBoard.comis_2_delays[5]);
                        }, GameBoard.comis_2_delays[4]);
                    }, GameBoard.comis_2_delays[3]);
                }, GameBoard.comis_2_delays[2]);
            }, GameBoard.comis_2_delays[1]);
        }, GameBoard.comis_2_delays[0]);
    }
}