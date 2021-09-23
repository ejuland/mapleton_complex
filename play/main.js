let Level = class {

    constructor(level, players) {

    }
};

import { Render } from "./render.js";
import { AudioAssetPlayer } from "./AudioPlayer.js";
import { Character } from "./character.js";
import Game from "./Game.js"
const AudioMixer = new AudioAssetPlayer(() => {
    let oldSession = null;
    function startLevel(num = 1) {
        let p1 = new Character(AudioMixer);
        let session = new Game(p1, [], num, AudioMixer, () => {
            AudioMixer.soundLevel = num;
            AudioMixer.shouldPlayBackground = true;
            startLevel(num + 1);
        }, () => {
            setTimeout(() => {
                startLevel();
            }, 2000);
        });

        oldSession = session;
    }
    startLevel();
});
//This is a huge change