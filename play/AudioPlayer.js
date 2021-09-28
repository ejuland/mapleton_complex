
import { getRandomNumber } from "./MazeGen.js";
export class AudioAssetPlayer {
    assets = {
        background: ["background_music_2.mp3", "background_music_3.mp3", "background_music_4.mp3"],
        steps: ["step1.mp3", "step2.mp3"],
        ambient: [
            "something coming 1.mp3",
            "something coming 2.mp3",
            "something coming 3.mp3",
            "thing_breath.mp3",// 5
            "thing_step_1.mp3",// 6
            "thing_step_2.mp3",// 7
        ],

        music: [
            "background_music_2.mp3",
            "background_music_4.mp3"
        ],
        coming: [
            "ambient noise 4.mp3",
            "something coming 3.mp3",
        ],
        endgame: [
            "thing_roar_1.mp3", //2
            "thing_roar_2.mp3", //3
            "it_is_here.mp3", //0,
            "player_breath.mp3",
            "close_bin.mp3", //1,
            "background_music_3.mp3",

        ],
        thing: [
            "it_is_here.mp3", //0,
            "close_bin.mp3", //1,
            "thing_roar_1.mp3", //2
            "thing_roar_2.mp3", //3
            "thing_roar_3.mp3", // 4
            "thing_breath.mp3",// 5
            "thing_step_1.mp3",// 6
            "thing_step_2.mp3",// 7
        ],
        elevator: ["bell_chime.mp3", "elevator_down.mp3"],
        character: ["player_breath.mp3"],
        item: ["item aquired.mp3", "strobe.mp3", "strobeEnd.mp3", "item dropped.mp3"],
        puzzel: ["puzzel.mp3"],
        map: ["map_tear.mp3"]
    };



    stepCount = 0;

    times = 0;
    async playStep() {
        console.log(this.times++);
        
        this.sourceFromBuffer(this.buffy, 1).start(0);
    }

    playAudioAsset(assetName, volume = 1, callback) {
        this.loadAudioAsset("./SFX/" + assetName, buffer => {
            callback(buffer);
        });
    }

    loadAudioAsset(path, callback) {

        if (this.audioContext == undefined) {
            return rej("Hold your horses");
            if (this.AudioContext == undefined)
                this.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            console.log(this.audioContext);
        }
        var request = new XMLHttpRequest();

        request.open('GET', path, true);

        request.responseType = 'arraybuffer';

        request.onload = () => {
            var audioData = request.response;
            console.log(this.audioContext);
            this.audioContext.decodeAudioData(audioData, function (buffer) {
                callback(buffer);
            },

                function (e) {
                    console.log("Error with decoding audio data", e);
                    console.error(e.err);
                });

        }

        request.send();
    }

    buffy = [];

    sourceFromBuffer(buffer, volume) {
        let source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        let gainNode = this.audioContext.createGain();
        gainNode.gain.value = volume;
        gainNode.connect(this.audioContext.destination);
        source.connect(gainNode);
        source.loop = false;
        return source;
    }

    AudioContext;
    audioContext;
    constructor(callback) {
        this.AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        this.loadAudioAsset("./SFX/"+this.assets.steps[0], (buff)=>{
            this.buffy = buff;
        });
    }


}