let Level = class {

    constructor(level, players) {

    }
};

import { Render } from "./render.js";
import { AudioAssetPlayer } from "./AudioPlayer.js";
import { Character } from "./character.js";
import Game from "./Game.js"
let oldSession = null;
function startLevel(num = 1) {
    let session = new Game([], num, () => {
        startLevel(num + 1);
    }, () => {
        setTimeout(() => {
            startLevel();
        }, 2000);
    });

    oldSession = session;
}
startLevel();



//This is a huge change