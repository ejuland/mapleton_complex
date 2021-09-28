
const LEFT = -1;
const RIGHT = 1;
const Back = 0;

import * as Maze from "./MazeGen.js";
import * as Item from "./items.js";
export class Character {

    maze = {};
    x = 0;
    y = 0;
    orientation = Maze.North;
    compass = {}
    item1 = Item.MapItem;
    item2 = Item.FreeHand;
    canMove = true;
    paralyzed = false;
    changeOrientation(direction) {
        let tmp = this.compass[Maze.North]
        switch (direction) {
            case RIGHT:
                this.compass[Maze.North] = this.compass[Maze.East];
                this.compass[Maze.East] = this.compass[Maze.South];
                this.compass[Maze.South] = this.compass[Maze.West];
                this.compass[Maze.West] = tmp;
                break;
            case LEFT:
                this.compass[Maze.North] = this.compass[Maze.West];
                this.compass[Maze.West] = this.compass[Maze.South];
                this.compass[Maze.South] = this.compass[Maze.East];
                this.compass[Maze.East] = tmp;
                break;
            case Back:
                this.compass[Maze.North] = this.compass[Maze.South];
                this.compass[Maze.South] = tmp;
                tmp = this.compass[Maze.West];
                this.compass[Maze.West] = this.compass[Maze.East];
                this.compass[Maze.East] = tmp;
                break;

        }
        this.orientation = this.compass[Maze.North];
    }

    relDirectionOfPoint(x, y) {
        let dirs = {};
        dirs[Maze.West] = false;
        dirs[Maze.East] = false;
        dirs[Maze.North] = false;
        dirs[Maze.South] = false;
        
        if (x < this.x)
        dirs[this.compass[Maze.East]] = true;
        if (x > this.x)
        dirs[this.compass[Maze.West]] = true;
        if (y < this.y)
        dirs[this.compass[Maze.South]] = true;
        if (y > this.y)
        dirs[this.compass[Maze.North]] = true;
        
        return dirs;
    }


    headInDirection(dir, apply = true) {
        let x = this.x, y = this.y;
        switch (dir) {
            case Maze.North:
                y -= 1;
                break;
            case Maze.South:
                y += 1;
                break;
            case Maze.East:
                x += 1;
                break;
            case Maze.West:
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
        let newPos = this.headInDirection(this.compass[Maze.North], false);
        if (this.getAvaliablePaths()[this.compass[Maze.North]] && this.maze.isValidCoord(newPos.x, newPos.y)) {
            this.headInDirection(this.compass[Maze.North]);
            if (this.AudioMixer)
                this.AudioMixer.playStep();
            this.stepCount++;
        } else
            console.log("Cant go there buddy");
    }
    moveDown() {
        let newPos = this.headInDirection(this.compass[Maze.South], false);
        if (this.getAvaliablePaths()[this.compass[Maze.South]] && this.maze.isValidCoord(newPos.x, newPos.y)) {
            this.headInDirection(this.compass[Maze.South])
            this.changeOrientation(Back);
            if (this.AudioMixer)
                this.AudioMixer.playStep();
            this.stepCount++;
        } else
            console.log("Cant go there buddy");
    }
    moveLeft() {
        let newPos = this.headInDirection(this.compass[Maze.West], false);
        if (this.getAvaliablePaths()[this.compass[Maze.West]] && this.maze.isValidCoord(newPos.x, newPos.y)) {
            this.headInDirection(this.compass[Maze.West]);
            this.changeOrientation(LEFT);
            if (this.AudioMixer)
                this.AudioMixer.playStep();
            this.stepCount++;
        } else
            console.log("Cant go there buddy");

    }
    moveRight() {
        let newPos = this.headInDirection(this.compass[Maze.East], false);
        if (this.getAvaliablePaths()[this.compass[Maze.East]] && this.maze.isValidCoord(newPos.x, newPos.y)) {
            this.headInDirection(this.compass[Maze.East]);
            this.changeOrientation(RIGHT);
            if (this.AudioMixer)
                this.AudioMixer.playStep();
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
    staminaMazedOut = 0;
    triggeredAttack = false;
    STAMINA_LIMIT = Math.ceil(Math.random() * 2) + 2
    getCharacterInput(direction) {
        if (!this.canMove) {
            return
        }

        switch (direction) {
            case Maze.North:
                this.moveUp();
                break;
            case Maze.South:
                this.moveDown();
                this.lastLookedBack = 0;
                break;
            case Maze.West:
                this.moveLeft();
                break;
            case Maze.East:
                this.moveRight();
                break;
        }
        this.lastPos = { x: this.x, y: this.y };
        this.timeSinceLastMove = this.lastGameTime;
        if (this.totalSteps++ % 20 == 0 && this.stepsSinceSighting++ > 15) {
            if (Maze.getRandomNumber(3) == 1)
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
        this.staminaMazedOut = this.lastGameTime;
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
            if (avaliable[Maze.North]) {
                this.map.setTileValue(this.x, Maze.N(this.y), val);
            }
            if (avaliable[Maze.South]) {
                this.map.setTileValue(this.x, Maze.S(this.y), val);
            }
            if (avaliable[Maze.East]) {
                this.map.setTileValue(Maze.E(this.x), (this.y), val);
            }
            if (avaliable[Maze.West]) {
                this.map.setTileValue(Maze.W(this.x), (this.y), val);
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
        if ((tVal == Maze.PuzzelEnd && pManager.getPuzzel(this.x, this.y).completed)) {
            if (this.lightBattery <= 0)
                this.AudioMixer.playPickup();

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
                this.AudioMixer.playDrop();
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
                console.log(this.orientation);
                switch (this.orientation) {
                    case Maze.West:
                        this.changeOrientation(RIGHT)
                        this.changeOrientation(Back);

                        break;
                        case Maze.East:
                        this.changeOrientation(LEFT)
                        this.changeOrientation(Back);

                        break;
                    case Maze.South:
                        this.changeOrientation(Back);
                        //this.moveDown()
                        break;
                    default:
                }
            }

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
    hasMap = true;
    mapType = 1;
    superMaps = 0;
    render(framesPassed, CTX, screen) {

    }

    map = null;

    setMaze(maze) {
        this.maze = maze;
        console.log(this.maze.level, this.maze.players);
        this.map = new Maze.MazeGenerator({ level: this.maze.level, players: this.maze.players }, true);

    }
    AudioMixer
    setAudioMixer(mix) {
        this.AudioMixer = mix;
    }
    constructor() {
        this.compass[Maze.North] = Maze.North;
        this.compass[Maze.South] = Maze.South;
        this.compass[Maze.East] = Maze.East;
        this.compass[Maze.West] = Maze.West;
        console.log(this.STAMINA_LIMIT);
        this.x = this.spawnX;
        this.y = this.spawnY;
    }
}