let Level = class {

    constructor(level, players) {

    }
};

const RenderEngine = new Render();
const AudioMixer = new AudioAssetPlayer(() => {
    let oldSession = null;
    function startLevel(num = 1) {
        let p1 = new Character();
        RenderEngine.level = num;
        let session = new Game(p1, [], num, () => {
            delete oldSession;
            AudioMixer.soundLevel = num;
            AudioMixer.shouldPlayBackground = true;
            startLevel(num + 1);
        }, () => {
            setTimeout(() => {
                delete oldSession;
                startLevel();
            }, 2000);
        });

        oldSession = session;
    }
    startLevel();
});
//This is a huge change