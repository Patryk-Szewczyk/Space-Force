class Soundtrack {
    audio = undefined;
    constructor(category, name, extension, isLoop, volume) {
        this.audio = new Audio('/wp-content/themes/SpaceForceGame/objects/soundtracks/' + category + '/' + name + '.' + extension);
        this.audio.loop = isLoop;
        this.audio.volume = volume;
    }
    set volume(value) {
        this.audio.volume = value; // dynamicznie zmienia
    }
    play() {
        this.audio.play();
    }
    pause() {
        this.audio.pause();
    }
    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
    };
}







// DZIAŁA OK

// const s = new Soundtrack(
//     'skyForceReload',
//     '02.SkyForceReloaded_-_In-Game2',
//     'mp3',
//     true,
//     0.5
// );

// setTimeout(() => {  // Przed włączeniem soundtracku, musi wystąpić interakcja użytkownika ze stroną.
//     s.play();
// }, 2000);