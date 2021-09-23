
const BasicPuzzel = 0;
const ShapePuzzel = 1;
const WordPuzzel = 2;
const ImagePuzzel = 3;
const ColorPuzzel = 4;
const PuzzelTypes = [ShapePuzzel, WordPuzzel, ColorPuzzel];
//const PuzzelTypes = [ShapePuzzel];

const Puzzel = class {
    x
    y
    type
    completed
    puzzelOpen = false
    key
    render(CTX, screen, time) {
        if (this.puzzelOpen) {



        }
    }
    beginPuzzel(completed, failed) {
        if (this.type == BasicPuzzel) {
            this.completed = true;
            completed();
        } else if (this.type == ImagePuzzel) {
            let keys = ([].concat(...PuzzelKeys[this.type])).map(item => { return { id: item, des: RenderEngine.assets[item].src } });
            console.log(keys);
            this.game.openChoiceMenu(keys, true, (res) => {
                if (res.join("") == this.key.join("")) {
                    this.completed = true;
                    completed();
                } else {
                    failed();
                }
            }, 1);
        } else {
            let keys = ([].concat(...PuzzelKeys[this.type])).map(item => { return { id: item, des: item } });
            console.log(keys);
            this.game.openChoiceMenu(keys, false, (res) => {
                if (res.join("") == this.key.join("")) {
                    this.completed = true;
                    completed();
                } else {
                    window.alert("looser");
                }
            }, 1);
        }
    }
    game
    constructor(x, y, type, key, game) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.completed = false;
        this.key = key;
        this.game = game
    }
};
const PuzzelKeys = (() => {
    let keys = {};
        keys[ShapePuzzel] = ["Square", "Circle", "Triangle", "Rectangle"],
        keys[WordPuzzel] = ["Dog", "Cat", "Chicken", "Horse", "Dodo"],
        keys[ImagePuzzel] = ["teammate_fallen"],
        keys[ColorPuzzel] = ["Red", "Green", "Blue", "Pink", "Purple"];
    return keys;
})();
const NOTES = {
    1: [`the beast that ascendeth\n out of the bottomless pit\n shall make war against them\n and shall overcome them\nRev. 11:7`],
    2: [`the beast that ascendeth\n out of the bottomless pit\n shall make war against them\n and shall overcome them\nRev. 11:7`],
    3: [`the beast that ascendeth\n out of the bottomless pit\n shall make war against them\n and shall overcome them\nRev. 11:7`],
    4: [`the beast that ascendeth\n out of the bottomless pit\n shall make war against them\n and shall overcome them\nRev. 11:7`],
    5: [`the beast that ascendeth\n out of the bottomless pit\n shall make war against them\n and shall overcome them\nRev. 11:7`],
    6: [`the beast that ascendeth\n out of the bottomless pit\n shall make war against them\n and shall overcome them\nRev. 11:7`],
    7: [`the beast that ascendeth\n out of the bottomless pit\n shall make war against them\n and shall overcome them\nRev. 11:7`],
    8: [`the beast that ascendeth\n out of the bottomless pit\n shall make war against them\n and shall overcome them\nRev. 11:7`],
    9: [`the beast that ascendeth\n out of the bottomless pit\n shall make war against them\n and shall overcome them\nRev. 11:7`],
    10:[`the beast that ascendeth\n out of the bottomless pit\n shall make war against them\n and shall overcome them\nRev. 11:7`],
};
const PuzzelManager = class {
    puzzels = {};
    puzzelType = BasicPuzzel;
    key = [];

    getNote() {
        return NOTES[this.game.levelNum][getRandomNumber(NOTES[this.game.levelNum].length)] + "\n" + this.key.join("|");
    }

    createPuzzel(x, y) {
        let puzzel = new Puzzel(x, y, this.puzzelType, this.key, this.game);
        this.addPuzzel(puzzel);
    }

    addPuzzel(puzzel) {
        this.puzzels[`{${puzzel.x},${puzzel.y}}`] = puzzel;
        console.log(puzzel)
    }

    getPuzzel(x, y) {
        return this.puzzels[`{${x},${y}}`];
    }

    generateKey(level) {
        this.puzzelType = PuzzelTypes[getRandomNumber(PuzzelTypes.length)];
        let keys = [].concat(...PuzzelKeys[this.puzzelType]);
        while (this.key.length < level && keys.length > 0) {
            this.key.push(keys.splice(getRandomNumber(keys.length), 1));
            console.log(keys);
        }
        console.log(this.key);
    }

    puzzelsCompleted = false;

    game;
    constructor(game) {
        this.game = game;
        this.generateKey(this.game.levelNum);
    }
    puzzelsRemaining() {
        let count = 0;
        for (let i in this.puzzels)
            if (this.puzzels[i].completed == false)
                count++;

        return count;
    }
};
