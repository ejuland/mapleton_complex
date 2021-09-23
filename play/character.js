
const LEFT = -1;
const RIGHT = 1;
const Back = 0;


let Character = class {

    maze = {};
    x = 0;
    y = 0;
    orientation = North;
    compass = {}
    item1 = FreeHand;
    item2 = FreeHand;
    canMove = true;
    paralyzed = false;
    changeOrientation(direction) {
        let tmp = this.compass[North]
        switch (direction) {
            case RIGHT:
                this.compass[North] = this.compass[East];
                this.compass[East] = this.compass[South];
                this.compass[South] = this.compass[West];
                this.compass[West] = tmp;
                break;
            case LEFT:
                this.compass[North] = this.compass[West];
                this.compass[West] = this.compass[South];
                this.compass[South] = this.compass[East];
                this.compass[East] = tmp;
                break;
            case Back:
                this.compass[North] = this.compass[South];
                this.compass[South] = tmp;
                tmp = this.compass[West];
                this.compass[West] = this.compass[East];
                this.compass[East] = tmp;
                break;

        }
        this.orientation = this.compass[North];
    }


    headInDirection(dir, apply = true) {
        let x = this.x, y = this.y;
        switch (dir) {
            case North:
                y -= 1;
                break;
            case South:
                y += 1;
                break;
            case East:
                x += 1;
                break;
            case West:
                x -= 1;
                break;
        }
        if (apply) {
            this.x = x;
            this.y = y;
        } else
            return { x: x, y: y };

    }

    getAvaliablePaths() {
        return this.maze.getAvaliablePaths(this.x, this.y);
    }

    moveUp() {
        let newPos = this.headInDirection(this.compass[North], false);
        if (this.getAvaliablePaths()[this.compass[North]] && this.maze.isValidCoord(newPos.x, newPos.y)) {
            this.headInDirection(this.compass[North]);
            AudioMixer.playStep();
            this.stepCount++;
        } else
            console.log("Cant go there buddy");
    }
    moveDown() {
        let newPos = this.headInDirection(this.compass[South], false);
        if (this.getAvaliablePaths()[this.compass[South]] && this.maze.isValidCoord(newPos.x, newPos.y)) {
            this.headInDirection(this.compass[South])
            this.changeOrientation(Back);
            AudioMixer.playStep();
            this.stepCount++;
        } else
            console.log("Cant go there buddy");
    }
    moveLeft() {
        let newPos = this.headInDirection(this.compass[West], false);
        if (this.getAvaliablePaths()[this.compass[West]] && this.maze.isValidCoord(newPos.x, newPos.y)) {
            this.headInDirection(this.compass[West]);
            this.changeOrientation(LEFT);
            AudioMixer.playStep();
            this.stepCount++;
        } else
            console.log("Cant go there buddy");

    }
    moveRight() {
        let newPos = this.headInDirection(this.compass[East], false);
        if (this.getAvaliablePaths()[this.compass[East]] && this.maze.isValidCoord(newPos.x, newPos.y)) {
            this.headInDirection(this.compass[East]);
            this.changeOrientation(RIGHT);
            AudioMixer.playStep();
            this.stepCount++;
        } else
            console.log("Cant go there buddy");
    }
    note = "Find Notes to Proceed";
    reading = false;
    lastGameTime = 0;
    timeSinceLastMove = 0;
    lastLookedBack = 0;
    speedStrikes = 1;
    tired = false;
    staminaMaxedOut = 0;
    triggeredAttack = false;
    STAMINA_LIMIT = Math.ceil(Math.random() * 2) + 2
    getCharacterInput(direction) {
        if (!this.canMove) {
            return
        }

        let speed = this.lastGameTime - this.timeSinceLastMove;
        if (speed < 300)
            return;
        if (speed < 400) {
            if (this.speedStrikes++ % 15 == 0) {

                this.canMove = false;
                AudioMixer.playPlayerBreath(2, () => {
                    this.staminaMaxedOut++;
                    if (this.staminaMaxedOut == this.STAMINA_LIMIT - 1)
                        AudioMixer.playThingBreath(() => {
                            this.canMove = true;

                        }, 2);
                    else if (this.staminaMaxedOut >= this.STAMINA_LIMIT)
                        AudioMixer.playThingBreath(() => {
                            setTimeout(() => {
                                this.triggeredAttack = true;
                                this.staminaMaxedOut = 0;
                                this.speedStrikes = 1
                                this.canMove = true;
                            }, 1000)
                        }, 2);
                    else {
                        this.canMove = true;
                    }

                });
            }

        } else if (this.speedStrikes > 1)
            this.speedStrikes--;
        console.log("Speed" + speed);


        switch (direction) {
            case North:
                this.moveUp();
                break;
            case South:
                this.moveDown();
                this.lastLookedBack = 0;
                break;
            case West:
                this.moveLeft();
                break;
            case East:
                this.moveRight();
                break;
        }
        this.lastPos = { x: this.x, y: this.y };
        this.timeSinceLastMove = this.lastGameTime;
        if (this.totalSteps++ % 20 == 0 && this.stepsSinceSighting++ > 15) {
            if (getRandomNumber(3) == 1)
                this.triggeredSighting = true;
        }
    }
    totalSteps = 0;
    stepsSinceSighting = 0;
    triggeredSighting = false;
    getCharacterPos() {

    }


    generateCharacterView(CTX) {
    }

    stepCount = 0;
    timeSinceOn = 0;

    resetAttackStates() {
        this.timeSinceLastMove = this.lastGameTime;
        console.log("reset_Attacks");
        this.lastLookedBack = 0;
        this.speedStrikes = 1;
        this.staminaMaxedOut = this.lastGameTime;
        this.lightBattery += .001;
        this.canMove = true;

    }
    update(time, pManager) {
        if (!this.canMove) {
            document.getElementById("dpad").classList.add("hidden");
        } else {
            document.getElementById("dpad").classList.remove("hidden");
        }

        if (this.hasMap) {
            let val = 1;
            let avaliable = this.getAvaliablePaths();
            this.map.setTileValue(this.x, this.y, val);
            if (avaliable[North]) {
                this.map.setTileValue(this.x, N(this.y), val);
            }
            if (avaliable[South]) {
                this.map.setTileValue(this.x, S(this.y), val);
            }
            if (avaliable[East]) {
                this.map.setTileValue(E(this.x), (this.y), val);
            }
            if (avaliable[West]) {
                this.map.setTileValue(W(this.x), (this.y), val);
            }
        }
        this.lastGameTime += time;
        this.lastLookedBack += time;

        if (((this.lastGameTime - this.timeSinceLastMove) > (20 * 1000) + (20 * 1000 - (this.maze.level * (20 * 1000 / 10)))) && !this.triggeredAttack) {
            this.timeSinceLastMove = this.lastGameTime;
            this.triggeredAttack = true;
            console.log("slow poke")
        }

        if (((this.lastLookedBack) > (30 * 1000) + (20 * 1000 - (this.maze.level * (20 * 1000 / 10)))) && !this.triggeredAttack) {
            this.lastLookedBack = this.lastGameTime;
            this.triggeredAttack = true;
            console.log("look behind ya buddy")
        } else if (this.triggeredAttack) {
            this.lastLookedBack = 0;
        }


        this.lightOn = this.lightBattery > 0;

        let tVal = this.maze.getTileValue(this.x, this.y);
        if ((tVal == PuzzelEnd && pManager.getPuzzel(this.x, this.y).completed)) {
            if (this.lightBattery <= 0)
                AudioMixer.playPickup();

            this.lightBattery += time / 600;
            if (this.lightBattery >= 100)
                this.lightBattery = 100;

        } else if (this.lightOn) {
            this.timeSinceOn = 0;
            if (this.lightBattery < 20) {
                this.lightBattery -= time / 500;
            } else {
                this.lightBattery -= time / 2000;
            }
            if (this.lightBattery < 0) {
                AudioMixer.playDrop();
                this.lightBattery = 0;
            }
        }
        if (!this.lightOn) {
            this.timeSinceOn += time
            if (this.timeSinceOn > 10 * 1000 && !this.triggeredAttack) {
                console.log("You should be afraid of the dark")
                this.triggeredAttack = true;
                this.timeSinceOn = 0;
            }
        }
    }


    spawnX = this.maze.center_x;
    spawnY = this.maze.center_y;
    setSpawn(x, y) {
        if (this.maze.isValidCoord(x, y)) {
            this.spawnX = x;
            this.spawnY = y;
            if (this.x == undefined || this.y == undefined) {
                this.x = this.spawnX;
                this.y = this.spawnY;
                this.orientation = this.maze.avaliableToDirections(this.getAvaliablePaths(this.x, this.y))[0];
                switch (this.orientation) {
                    case West:
                        this.changeOrientation(RIGHT)
                        break;
                    case East:
                        this.changeOrientation(Left)
                        break;
                    case South:
                        this.moveDown()
                        break;
                    default:
                }
            }
            this.moveLeft()
            this.moveRight()
            this.moveDown();
            this.moveUp()
        } else {
        }
    }

    inMenu = false;
    strobed = false;
    strobeTime = 0;
    lightOn = true;
    lightBattery = 100;
    lastPos = { x: 0, y: 0 };
    playingSound = false;
    thingPosition = 0;
    hasMap = false;
    mapType = 0;
    superMaps = 0;
    render(framesPassed, CTX, screen) {
        screen.player = this;
        let tVal = this.maze.getTileValue(this.x, this.y);
        let block = 10;
        console.log(screen.pX, screen.pY);
        // if (this.lastPos.x != this.x || this.lastPos.y != this.y)
        RenderEngine.renderTileView(CTX, screen, tVal);

        if (this.triggeredSighting && this.maze.level >= 2) {
            this.stepsSinceSighting = 0;
            if (this.thingPosition == 0) {

                RenderEngine.renderThingPosition1(CTX, screen);
                if (!this.playingSound) {
                    this.playingSound = true;
                    AudioMixer.playThingRoar(1, 2, () => {
                        this.triggeredSighting = false;
                        this.playingSound = false;
                        this.thingPosition++;
                    });
                }
            } else {
                RenderEngine.renderThingPosition1(CTX, screen);
                if (!this.playingSound) {
                    this.playingSound = true;
                    AudioMixer.playThingRoar(0, 2, () => {
                        this.triggeredSighting = false;
                        this.playingSound = false;
                        this.thingPosition = 0;
                    });
                }
            }
        }

        RenderEngine.renderFlashLight(CTX, screen, (this.lightOn && this.lightBattery > 0));
        for (let i = 0; i < this.lightBattery / 10; i++) {
            let color;
            if (i < 2)
                color = "red";
            else if (i >= 5)
                color = "green";
            else
                color = "yellow";
            RenderEngine.drawBlock(CTX, color, 0, screen.height - (20 + (i * 20)), 20);
        }

        if (!this.inMenu && (this.hasMap && this.mapType == 1)) {
            RenderEngine.renderMap(CTX, (10 * block), (10 * block), { w: screen.width, h: screen.height, block: block, x: this.x, y: this.y }, this.maze, this.orientation, map_colors);
        }
        else if (!this.inMenu && (this.hasMap)) {
            RenderEngine.renderMap(CTX, (10 * block), (10 * block), { w: screen.width, h: screen.height, block: block, x: this.x, y: this.y }, this.map, this.orientation, map_colors);
        } if (!this.inMenu)
            RenderEngine.renderUserItems(screen);
        if (this.strobed) {
            let secondsPassed = Math.trunc(this.strobeTime++ / 2);
            if (secondsPassed < 7) {
                RenderEngine.renderStrobe(CTX, screen, 8 - (secondsPassed + 1));
            } else {
                RenderEngine.renderStrobe(CTX, screen, 8);
            }
        } else if (!this.strobed && this.strobeTime > 0) {
            let secondsPassed = Math.trunc((this.strobeTime > 200 ? this.strobeTime -= 100 : this.strobeTime--) / 2);
            if (secondsPassed < 7) {
                RenderEngine.renderStrobe(CTX, screen, secondsPassed + 1);
                this.resetAttackStates();
            } else {
                RenderEngine.renderStrobe(CTX, screen, 8);
            }
        }
        // this.generateCharacterView(CTX);
        // CTX.fillStyle = "green";
        // CTX.fillRect(this.x * blockSize, this.y * blockSize, blockSize, blockSize)

    }

    map = null;

    setMaze(maze) {
        this.maze = maze;
        console.log(this.maze.level, this.maze.players);
        this.map = new MazeGenerator({ level: this.maze.level, players: this.maze.players }, true);

    }
    constructor() {

        this.compass[North] = North;
        this.compass[South] = South;
        this.compass[East] = East;
        this.compass[West] = West;
        console.log(this.STAMINA_LIMIT);
        this.x = this.spawnX;
        this.y = this.spawnY;
    }
}