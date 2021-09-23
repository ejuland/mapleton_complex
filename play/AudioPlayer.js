
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
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
        elevator:["bell_chime.mp3", "elevator_down.mp3"],
        character: ["player_breath.mp3"],
        item: ["item aquired.mp3", "strobe.mp3", "strobeEnd.mp3", "item dropped.mp3"],
        puzzel: ["puzzel.mp3"],
        map: ["map_tear.mp3"]
    };

    shouldPlayBackground = true;
    soundLevel = 0;
    playBackground() {
        if (!this.shouldPlayBackground)
            return false;
        this.shouldPlayBackground = false;
        console.log("Play Background!");
        let soundPool = [];
        let soundLevel = this.soundLevel;
        console.log(soundLevel);
        let populateSoundPool = () => {
            console.log(soundLevel);
            soundPool = soundPool.concat(...this.assets.coming);
            if (soundLevel > 1)
                soundPool = soundPool.concat(...this.assets.ambient);
            if (soundLevel >= 3)
                soundPool = soundPool.concat(...this.assets.music);
            if (soundLevel > 5)
                soundPool = soundPool.concat(...this.assets.endgame);
        };

        let getSoundFromSoundPool = () => {
            if (soundPool.length <= 0)
                populateSoundPool();
            let assetIndex = getRandomNumber(soundPool.length);
            let asset = soundPool[assetIndex];
            console.log(asset);
            soundPool.splice(assetIndex, 1);
            return asset;
        };

        let playsound = () => {
            let audio = this.createSourceFromBuffer(getSoundFromSoundPool(), .3)
            audio.start(0);
            audio.addEventListener('ended', () => {
                if (this.shouldPlayBackground){
                    soundPool = [];
                    populateSoundPool();
                }
                    setTimeout(playsound, 30000);
            }, false);
        }

        playsound();
    }

    killBackgroundMusic() {

        this.shouldPlayBackground = false;
    }

    playComing(callback, index = -1, volume = .3) {
        if (index < 0)
            index = Math.floor(Math.random() * this.assets.coming.length);
        let audio = this.createSourceFromBuffer(this.assets.coming[index], volume)
        audio.start(0);
        if (callback)
            audio.addEventListener('ended', callback, false);
    }


    playThingBreath(callback, volume = .6) {
        let audio = this.createSourceFromBuffer(this.assets.thing[1], volume)
        audio.start(0);
        if (callback)
            audio.addEventListener('ended', callback, false);
    }
    
    playChime(callback, volume = .6) {
        let audio = this.createSourceFromBuffer(this.assets.elevator[0], volume)
        audio.start(0);
        if (callback)
            audio.addEventListener('ended', callback, false);
    }
    playElevatorDown(callback, volume = .6) {
        let audio = this.createSourceFromBuffer(this.assets.elevator[1], volume)
        audio.start(0);
        if (callback)
            audio.addEventListener('ended', callback, false);
    }

    playThingSqueal(callback, volume = .6) {
        let audio = this.createSourceFromBuffer(this.assets.thing[5], volume)
        audio.start(0);
        if (callback)
            audio.addEventListener('ended', callback, false);
    }

    playThingRoar(index = 0, volume = .6, callback) {

        let audio = this.createSourceFromBuffer(this.assets.thing[2 + index], volume)
        audio.start(0);
        if (callback)
            audio.addEventListener('ended', callback, false);
    }

    playingPuzzel = false;
    playPuzzelOn(callback) {
        if (this.playingPuzzel)
            return false;
        this.playingPuzzel = true;
        let audio = this.createSourceFromBuffer(this.assets.puzzel[0], .1)
        audio.start(0, 0, 3);
        audio.addEventListener('ended', () => {
            setTimeout(() => {
                if (callback)
                    callback();
                this.playingPuzzel = false;
            }, 5 * 1000)
        }, false);
    }

    playItIsHere(stage1, stage2, stage3, done) {
        console.log("YOLO", this.assets.thing);
        let audio = this.createSourceFromBuffer(this.assets.thing[0], .2)
        audio.start(0, 0, 3);
        this.playThingBreath();
        this.playThingRoar();
        stage1();
        setTimeout(() => {
            if (stage2)
                stage2();
            audio = this.createSourceFromBuffer(this.assets.thing[0], .4)
            audio.start(0, 4.5, 3)
            this.playThingBreath();
            this.playThingRoar(1, 1.5);
            setTimeout(() => {
                let shouldContinue = true;
                if (stage3)
                    shouldContinue = stage3();
                if (shouldContinue) {
                    this.playThingBreath();
                    audio = this.createSourceFromBuffer(this.assets.thing[0], .8)
                    audio.start(0, 9.5)
                    this.playThingRoar(2, 2);
                    setTimeout(() => {
                        if (done)
                            done();
                    }, 2000)
                } else
                    if (done)
                        done();
            }, 3000)
        }, 3000)
    }

    shouldPlayAmbientSound = true;
    current
    startAmbientSoundLoop() {

        let lastPlayed = -1;
        let getSound = () => {
            let soundNumber = 0;
            do {
                soundNumber = Math.floor(Math.random() * this.assets.ambient.length);
            } while (soundNumber == lastPlayed);
            lastPlayed = soundNumber;
            return this.assets.ambient[soundNumber];
        };

        let setSoundDelay = () => {
            if (this.shouldPlayAmbientSound) {
                this.shouldPlayAmbientSound = false;
                let audio = this.createSourceFromBuffer(getSound(), .3);
                audio.addEventListener('ended', () => {
                    setTimeout(() => {
                        this.shouldPlayAmbientSound = true;
                        audio.start(0);
                        //setSoundDelay();
                    }, 30 * 1000);
                }, false);
            };


        }
        setTimeout(setSoundDelay, 30000);
    }

    killAmbientSoundLoop() {
        this.shouldPlayAmbientSound = false;
    }

    breathing = false;
    additionalBreaths = 0;
    playPlayerBreath(times = 1, callback) {
        if (this.breathing) {
            this.additionalBreaths++;
            return;
        }
        this.breathing = true;
        if (times > 0) {
            let audio = this.createSourceFromBuffer(this.assets.character[0], .1)
            audio.start(0);
            audio.addEventListener('ended', () => {
                this.breathing = false;
                let breathsLeft = (times - 1) + this.additionalBreaths;
                this.additionalBreaths = 0;
                this.playPlayerBreath(breathsLeft, callback);

            }, false);
        } else{
            this.breathing = false;
            callback();
        }
    }

    stepNumber = 0;

    playPickup() {
        //this.assets.steps[this.stepNumber].volume = 1;
        let audio = this.createSourceFromBuffer(this.assets.item[0], .1)
        audio.start(0);
    }
    playDrop() {
        //this.assets.steps[this.stepNumber].volume = 1;
        let audio = this.createSourceFromBuffer(this.assets.item[3], .3)
        audio.start(0);
    }
    playTear() {
        //this.assets.steps[this.stepNumber].volume = 1;
        let audio = this.createSourceFromBuffer(this.assets.map[0], .3)
        audio.start(0);
    }

    strobPlaying = false;
    playStrobe(callback) {
        if (!this.strobPlaying) {
            this.strobPlaying = true;
            let audio = this.createSourceFromBuffer(this.assets.item[1], 1)
            audio.start(0);
            audio.addEventListener('ended', () => {
                this.strobPlaying = false;
                if (callback)
                    callback();

            }, false);
        }
    }

    playStep() {
        if (this.stepNumber >= this.assets.steps.length)
            this.stepNumber = 0;
        //this.assets.steps[this.stepNumber].volume = 1;
        let audio = this.createSourceFromBuffer(this.assets.steps[this.stepNumber], .1)
        audio.start(0);
        this.stepNumber++;
    }
    stepThingNumber = 0;
    thingStepPlaying = false;
    playThingStep(volume) {
        // if (this.thingStepPlaying)
        //     return console.log("woopsie");
        this.thingStepPlaying = true;
        if (this.stepThingNumber > 1)
            this.stepThingNumber = 0;
        //this.assets.steps[this.stepNumber].volume = 1;
        let audio = this.createSourceFromBuffer(this.assets.thing[6 + this.stepNumber], volume)
        audio.addEventListener('ended', () => {
            this.thingStepPlaying = false;
        }, false);
        audio.start(0);
        this.stepThingNumber++;
    }

    createSourceFromBuffer(buffer, volume = 1) {
        let source = audioContext.createBufferSource();
        source.buffer = buffer;
        let gainNode = audioContext.createGain();
        gainNode.gain.value = volume;
        gainNode.connect(audioContext.destination);
        source.connect(gainNode);
        source.loop = false;
        return source;
    }

    loadAudioBuffer(url, asset, index) {
        return new Promise((res, rej) => {

            var request = new XMLHttpRequest();

            request.open('GET', url, true);

            request.responseType = 'arraybuffer';

            request.onload = function () {
                var audioData = request.response;

                audioContext.decodeAudioData(audioData, function (buffer) {
                    res({ buffer: buffer, asset: asset, index: index });
                },

                    function (e) {
                        console.log("Error with decoding audio data" + e.err);
                        rej(e.err);
                    });

            }

            request.send();
        });

    }

    constructor(callback) {
        let sounds = [];
        for (var asset in this.assets) {
            for (let index in this.assets[asset])
                sounds.push(this.loadAudioBuffer("./SFX/" + this.assets[asset][index], asset, index));

            // this.assets[asset].forEach(asset=>{
            //     //asset.volume = 0;
            //     asset.play();
            // });
        }
        Promise.all(sounds).then(buffers => {
            buffers.forEach((data) => {
                this.assets[data.asset][data.index] = data.buffer;
            });
            if (callback)
                callback();
        });
    }


}