
import * as Maze from "./MazeGen.js";
import * as Puzzels from "./puzzelmanager.js";
import * as Items from "./items.js"
import { Render } from "./render.js";
import { THING } from "./Thing.js";
import { Character } from "./character.js";
import { AudioAssetPlayer } from "./AudioPlayer.js";

export default class Game {
    SCREEN = document.querySelector("#screen");
    SCREEN2 = document.querySelector("#action_screen");
    CTX = this.SCREEN.getContext("2d");
    WIDTH = 0;
    HEIGHT = 0;
    BLOCK_SIZE = 50;
    maze = null;
    OFFSET = 0;
    resize() {

        this.HEIGHT = document.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
        this.WIDTH = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
        if (this.WIDTH > this.HEIGHT)
            this.WIDTH = this.HEIGHT * (16 / 9);
        else
            this.HEIGHT = this.WIDTH * (9 / 16);
        this.WIDTH *= .9;
        this.HEIGHT *= .9;
        this.SCREEN.setAttribute("width", window.innerWidth);
        this.SCREEN.setAttribute("height", window.innerHeight);
        this.SCREEN2.setAttribute("width", window.innerWidth);
        this.SCREEN2.setAttribute("height", window.innerHeight);

    }

    GAMESTATE = {
        running: true
    }



    populateChoices(choices, image = false) {
        let options = choices.map((item, index) => {
            if (!image) {
                return `
                    <div class="choice-item" val='${item.id}'><p>${item.des}</p></div>
                `;
            } else {
                return `
                    <div class="choice-item" val='${item.id}'><img src="${item.des}"></div>
                `;
            }
        }).reduce((html, item) => {
            return html + item;
        }, "")
        console.log(options);
        document.getElementById("items-container").innerHTML = options;
    }
    openChoiceMenu(choices, image = false, complete, results = 1) {

        console.log(choices);
        this.populateChoices(choices, image);
        document.getElementById("options-menu").classList.remove("hidden");
        let menuResults = [];
        document.querySelectorAll(".choice-item").forEach(element => {
            let listener = (e) => {
                let src = (e.target.getAttribute("val") == null ? e.target.parentElement : e.target);
                if (!src.classList.contains("selected")) {
                    src.classList.add("selected");
                    console.log(src);
                    menuResults.push(src.getAttribute("val"));
                    if (menuResults.length == results) {
                        document.querySelectorAll(".choice-item").forEach(element => {
                            element.removeEventListener("touchend", listener);
                        });
                        document.getElementById("items-container").innerHTML = "";
                        document.getElementById("options-menu").classList.add("hidden");
                        complete(menuResults);
                    }
                } else {
                    if (menuResults.length < results) {
                        src.classList.remove("selected");
                        menuResults.splice(src.getAttribute("val"), 1);
                        console.log(menuResults);
                    }
                }
            };
            element.addEventListener("touchend", listener);
        });

    }

    renderImageAsset(image, x, y, w, h) {
        this.CTX.drawImage(image, x, y, w, h);
    }


    pointInBox(px, py, x, y, w, h) {
        let inz = (px >= x && px <= x + w) && (py >= y && py <= y + h);
        return inz;
    }

    renderCharacter(time) {
        this.RenderEngine.renderPlayerHUD(this.player1, time, this.CTX, { height: this.HEIGHT, width: this.WIDTH, pX: this.pointerX, pY: this.pointerY });
        this.Thing.render(this.CTX, { height: this.HEIGHT, width: this.WIDTH });
    }


    shouldPlayBackgroundMusic = true;
    gameOver = false;
    /* MAIN GAME LOOP*/
    GameLoop(time) {
        //this.renderMaze();
        this.RenderEngine.update3DAssets(this.CTX, { height: this.HEIGHT, width: this.WIDTH, pX: this.pointerX, pY: this.pointerY });
        this.renderCharacter(time);
        this.player1.update(time, this.puzzelManager);
        if (this.levelNum == 1 && this.player1.lightBattery < 20) {
            this.player1.lightBattery = 20;
        }
        if (this.player1.triggeredAttack && this.levelNum >= 2 && !this.Thing.attackTriggered) {


            this.Thing.setVictim(this.player1);
            this.shouldPlayBackgroundMusic = false;
            this.Thing.beginAttackSequence(() => {
                this.shouldPlayBackgroundMusic = true;
                this.player1.triggeredAttack = false;
                this.player1.canMove = true;
            });
        } else {
            this.player1.triggeredAttack = false;
        }
        if (this.itemManager.canUseItem(this.player1.item1)) {
            document.getElementById("item-1").classList.add("interacting");
        } else {
            document.getElementById("item-1").classList.remove("interacting");
        }

        if (this.itemManager.canUseItem(this.player1.item2)) {
            document.getElementById("item-2").classList.add("interacting");
        } else {

            document.getElementById("item-2").classList.remove("interacting");
        }



        if (this.maze.getTileValue(this.player1.x, this.player1.y) == Maze.PuzzelEnd) {
            if (this.puzzelManager.getPuzzel(this.player1.x, this.player1.y).completed) {
                this.AudioMixer.playPuzzelOn();
            }
        }

        if (this.puzzelManager.puzzelsRemaining() <= 0) {
            if (!this.endGameStarted && this.GAMESTATE.running) {
                this.endGameStarted = true;
                this.AudioMixer.playThingBreath();
                setTimeout(() => {
                    this.player1.triggeredAttack = true;
                }, Math.ceil(Math.random(25 * 1000)) + 5 * 1000);
                //this.AudioMixer.playThingRoar(2, 2);
                this.maze.setTileValue(this.maze.exit.x, this.maze.exit.y, OpenDoorEnd);
            }

            if (this.maze.getTileValue(this.player1.x, this.player1.y) == OpenDoorEnd && !this.gameOver) {
                this.GAMESTATE.running = false;
                this.gameOver = true
                setTimeout(() => {
                    this.openMessageBox(this.levelNum + " Complete!");

                    setTimeout(() => {
                        this.res();
                    }, 2000);

                }, 2000);


            }



        }

        if (this.allPlayers.reduce((up, player) => {
            if (!player.paralyzed)
                return up + 1;
            return up;
        }, 0) <= 0) {
            this.GAMESTATE.running = false;
            this.openMessageBox("You Lost!");
            setTimeout(() => {
                this.rej();
            }, 1000)
        }
        if (this.player1.reading) {
            this.inMessage = true;
            this.messageBoxText = this.player1.note;
        }

        if (this.inMessage) {
            if (!this.player1.reading)
                this.RenderEngine.renderText(this.CTX, { height: this.HEIGHT, width: this.WIDTH }, this.messageBoxText);
            else {
                this.RenderEngine.renderNote(this.CTX, { height: this.HEIGHT, width: this.WIDTH }, this.messageBoxText, 25);
            }
        }

    }
    messageBoxText = "";
    openMessageBox(text) {
        this.messageBoxText = text;
        this.inMessage = true;
    }

    endGameStarted = false;
    shouldKillGame(gamestate) {
        return !(gamestate.running);
    }

    played = false;
    logKeyDown(e) {
        //this.player1.triggeredAttack = true;
        let dir = 0;
        if (e.code == "ArrowUp")
            dir = Maze.North;
        if (e.code == "ArrowDown")
            dir = Maze.South;
        if (e.code == "ArrowRight")
            dir = Maze.East;
        if (e.code == "ArrowLeft")
            dir = Maze.West;
        if (dir != 0 && this.GAMESTATE.running)
            this.player1.getCharacterInput(dir);
    }
    logKeyUp(e) {

    }


    render(action, shouldTerminate, framesPassed = 0, FPS = 60) {
        let startTime = new Date().getTime();

        if (shouldTerminate(this.GAMESTATE)) return;

        action(framesPassed);

        setTimeout(function () {
            let old = startTime;
            let newT = new Date().getTime();
            let diff = newT - old;
            this.render(action, shouldTerminate, diff % (1000 / FPS));
        }.bind(this), 10);
    }


    pointerX = 0;
    pointerY = 0;
    moving = false;
    addTouchSupport() {

        let endTouch = (dir) => {
            if (!this.moving) {
                if (dir !== Maze.South && !this.player1.getAvaliablePaths()[this.player1.compass[dir]])
                    return;
                this.moving = true;
                this.RenderEngine.transitionInDirection(dir, () => {
                    if (this.GAMESTATE.running){
                        this.player1.getCharacterInput(dir);
                        this.RenderEngine.renderTileView(this.CTX, {player:this.player1, maze:this.maze})
                    }
                    this.moving = false;
                    return true;
                });
            }
        };

        document.getElementById("up").addEventListener("touchend", () => {
            endTouch(Maze.North)
        }, false);
        document.getElementById("down").addEventListener("touchend", () => {
            endTouch(Maze.South)
        }, false);
        document.getElementById("right").addEventListener("touchend", () => {
            endTouch(Maze.East)
        }, false);
        document.getElementById("left").addEventListener("touchend", () => {
            endTouch(Maze.West)
        }, false);


        this.SCREEN.addEventListener("touchmove", ((e) => {
            e.preventDefault();
            let touch = e.touches[0];
            // let x = touch.pageX;
            // let y = touch.pageY;
            let x = touch.pageX - this.SCREEN.offsetLeft;
            let y = touch.pageY - this.SCREEN.offsetTop;
            this.pointerX = x;
            this.pointerY = y;
        }).bind(this), false);

        this.SCREEN.addEventListener("touchend", ((e) => {
            e.preventDefault();
            if (this.inMessage) {
                this.inMessage = false;
                setTimeout(() => {
                    if (this.player1.reading)
                        this.player1.reading = false;
                })
            }
        }).bind(this), false);


    }





    puzzelManager = null;
    setUpPuzzels() {
        this.puzzelManager = new Puzzels.PuzzelManager(this)
        let puzzels = this.maze.getTilesWithValue(Maze.PuzzelEnd).forEach(coord => {
            this.puzzelManager.createPuzzel(coord.x, coord.y);
        });
        return true;
    }

    player1 = null;
    Thing = null;
    deadEnds = [];
    allPlayers;
    itemManager = null;
    useItem1(e) {
        e.preventDefault();
        if (this.GAMESTATE.running)
            this.itemManager.useItem(this.player1.item1, 1, this.CTX);
    }
    useItem2(e) {
        e.preventDefault();
        if (this.GAMESTATE.running)
            this.itemManager.useItem(this.player1.item2, 2, this.CTX);
    }

    inMessage = false;
    res = () => { };
    rej = () => { };
    levelNum = undefined;
    // export constructor(player1, otherPlayers = [], num, win, loose) {

    //     this.res = win;
    //     this.rej = loose;
    //     let started = false;
    //     this.levelNum = num;
    //     let Game = this;
    //     this.player1 = player1;
    //     this.allPlayers = [player1].concat(...otherPlayers);
    //     let levelDat = {
    //         players: this.allPlayers.length,
    //         level: this.levelNum
    //     };
    //     this.maze = new MazeGenerator(levelDat);
    //     this.playerSpawns = this.maze.getTilesWithValue(Maze.SupplyEnd);
    //     this.player1.setMaze(this.maze);
    //     let spawn = this.maze.getTilesWithValue(PlayerStart)[0];
    //     this.allPlayers.forEach((player) => {
    //         player.setSpawn(spawn.x, spawn.y)
    //     });
    //     this.setUpPuzzels();
    //     this.maze.exit = this.maze.getTilesWithValue(ClosedDoorEnd)[0];

    //     let start = (() => {
    //         if (!started) {
    //             started = true;

    //             // this.RenderEngine.renderFlashLight(this.CTX, { height: this.HEIGHT, width: this.WIDTH, pX: this.pointerX, pY: this.pointerY }, false)
    //             // this.RenderEngine.renderTileView(this.CTX, { height: this.HEIGHT, width: this.WIDTH, pX: this.pointerX, pY: this.pointerY }, LevelLoading)
    //             // this.AudioMixer.playElevatorDown(() => {
    //             //     this.AudioMixer.playThingBreath();
    //             //     this.RenderEngine.renderTileView(this.CTX, { height: this.HEIGHT, width: this.WIDTH, pX: this.pointerX, pY: this.pointerY }, LevelStart)
    //             //     setTimeout(() => {
    //             //         this.RenderEngine.renderFlashLight(this.CTX, { height: this.HEIGHT, width: this.WIDTH, pX: this.pointerX, pY: this.pointerY }, false)
    //             //         this.AudioMixer.playDrop();
    //             //         setTimeout(() => {
    //             this.AudioMixer.playBackground(this.levelNum)
    //             document.getElementById("item-1").addEventListener("touchstart", this.useItem1.bind(this), false)
    //             document.getElementById("item-1").addEventListener("mouseup", this.useItem1.bind(this))
    //             document.getElementById("item-2").addEventListener("touchstart ", this.useItem2.bind(this))
    //             document.getElementById("item-2").addEventListener("mouseup", this.useItem2.bind(this), false)
    //             this.itemManager = new ItemsManager(this.player1, this.maze, this);
    //             this.Thing = new THING(this.maze, [player1].concat(...otherPlayers));
    //             this.Thing.setVictim(this.player1);
    //             setTimeout(()=>{
    //                 this.player1.triggeredAttack = true;
    //                 console.log("Now youve done it!");
    //             }, 2000);
    //             this.render(this.GameLoop.bind(this), this.shouldKillGame);
    //             document.addEventListener("keydown", this.logKeyDown.bind(this));
    //             document.addEventListener("keyup", this.logKeyUp.bind(this));
    //             this.addTouchSupport();
    //             //         }, 2000);
    //             //     }, 2000);
    //             // }, 1);

    //         } else if (this.inMessage) {
    //             this.inMessage = false;
    //             if (this.player1.reading)
    //                 this.player1.reading = false;
    //         }
    //     }).bind(this);

    //     window.onclick = start;
    //     window.onresize = this.resize.bind(this);
    //     this.resize();
    //     this.RenderEngine.renderTileView(this.CTX, { height: this.HEIGHT, width: this.WIDTH, pX: this.pointerX, pY: this.pointerY }, LevelLoading)
    //     this.RenderEngine.renderText(this.CTX, { height: this.HEIGHT, width: this.WIDTH }, "Level " + this.levelNum + "\nTap to begin!");

    //     document.addEventListener("touchend", start, false);


    // }



    setUpGameInstance(levelNumber) {
        this.levelNum = levelNumber;
        this.RenderEngine.level = this.levelNum;

        this.player1 = new Character();
        this.allPlayers = [this.player1];//.concat(...otherPlayers);
        let levelDat = {
            players: this.allPlayers.length,
            level: this.levelNum
        };
        this.maze = new Maze.MazeGenerator(levelDat);
        this.player1.setMaze(this.maze);

        this.playerSpawns = this.maze.getTilesWithValue(Maze.SupplyEnd);

        this.player1.setMaze(this.maze);

        let spawn = this.maze.getTilesWithValue(Maze.PlayerStart)[0];

        this.allPlayers.forEach((player) => {
            player.setSpawn(spawn.x, spawn.y)
        });

        this.setUpPuzzels();

        this.maze.exit = this.maze.getTilesWithValue(Maze.ClosedDoorEnd)[0];

        this.itemManager = new Items.ItemsManager(this.player1, this.maze, this);

        this.Thing = new THING(this.maze, [this.player1]);//.concat(...otherPlayers));

        this.Thing.setVictim(this.player1);


        window.onresize = this.resize.bind(this);


        this.addTouchSupport();
        this.linkControls();

    }


    linkControls() {
        document.getElementById("item-1").addEventListener("touchend", this.useItem1.bind(this), false)
        document.getElementById("item-1").addEventListener("mouseup", this.useItem1.bind(this), false)

        if (this.levelNum <= 5) {
            document.getElementById("item-2").addEventListener("touchend ", this.useItem2.bind(this), false)
            document.getElementById("item-2").addEventListener("mouseup", this.useItem2.bind(this), false)
        } else {
            document.getElementById("item-2").classList.add("hidden");
        }


        document.addEventListener("keydown", this.logKeyDown.bind(this));
        document.addEventListener("keyup", this.logKeyUp.bind(this));
    }

    startGameLoop() {
        this.render(this.GameLoop.bind(this), this.shouldKillGame);
    }

    RenderEngine = new Render();
    constructor(otherPlayers = [], num, win, loose) {

        this.RenderEngine.loadLevelAssets().then(() => {
            this.setUpGameInstance(1);
            this.RenderEngine.renderTileView(this.CTX, { maze: this.maze, player: this.player1 }, Maze.LevelStart);

            this.res = win;
            this.rej = loose;
            let started = false;
            this.AudioMixer = new AudioAssetPlayer();
            // let start = (() => {
            if (!started) {
                this.startGameLoop();
                started = true;
            }

            // this.AudioMixer.playAudioAsset(this.AudioMixer.assets.steps[0], 1, () => { });
            // this.AudioMixer.playStep();
            //this.player1.setAudioMixer(this.AudioMixer);
            //}).bind(this);

            this.resize();
            this.RenderEngine.renderText(this.CTX, { height: this.HEIGHT, width: this.WIDTH }, "Level " + this.levelNum + "\nTap to begin!");
            this.RenderEngine.renderTileView(this.CTX, { maze: this.maze, player: this.player1 }, Maze.LevelStart);
            // this.SCREEN.addEventListener("touchend", start, false);
        });


    }
    //INIT
};