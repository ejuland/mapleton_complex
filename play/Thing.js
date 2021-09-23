let THING = class {
    Maze = null
    Players = []
    Stage = 0;
    assets = {

    };

    victim = null
    setVictim(player) {
        this.victim = player
        this.turnedAround = false;
    }
    turnedAround = false;
    lightsOut = false;
    render(CTX, screen) {
        screen.player = this.victim;
        screen.pX = screen.width / 2;
        screen.pY = screen.height / 2;
        if (this.lightsOut) {
            RenderEngine.renderTileView(CTX, screen, this.maze.getTileValue(this.victim.x, this.victim.y));
            return RenderEngine.renderFlashLight(CTX, screen, false);
        }
        let avaliable = this.victim.getAvaliablePaths();
        if (this.victim != null) {
            let attackScene = this.maze.getTileValue(this.victim.x, this.victim.y);
            if ((this.maze.isEnd(attackScene)) || attackScene == Corner) {
                if (!this.turnedAround) {
                    this.turnedAround = true;
                    this.victim.moveDown();
                };
            } else if (
                attackScene == Fork &&
                !((avaliable[this.victim.compass[East]] && avaliable[this.victim.compass[North]]) || (avaliable[this.victim.compass[West]] && avaliable[this.victim.compass[North]]))
            ) {
                if (!this.turnedAround) {
                    this.turnedAround = true;
                    this.victim.moveDown();
                };

            }
            if (this.attackTriggered) {
                RenderEngine.renderTileView(CTX, screen, this.maze.getTileValue(this.victim.x, this.victim.y));
                RenderEngine.renderFlashLight(CTX, screen, false); RenderEngine.renderFlashLight(CTX, screen, false);
            }
            switch (this.Stage) {
                case 1:
                    RenderEngine.renderThingPosition1(CTX, screen);
                    break;
                case 2:
                    RenderEngine.renderThingPosition2(CTX, screen);
                    break;
                case 3:
                    RenderEngine.renderThingPosition3(CTX, screen);
                    break;
                case 4:
                    RenderEngine.renderThingPosition4(CTX, screen);
                    break;
            }
        }
    }

    retreated = false;
    takeFlash() {
        if (this.vulnerable) {
            this.retreated = true;
            this.Stage = 0;
            AudioMixer.playThingRoar(2, 2);
        } else {
        }
    }

    attackTriggered = false;
    vulnerable = false;
    attackSuccessful = false;
    beginAttackSequence(callback) {

        if (!this.attackTriggered && !this.victim.paralyzed) {
            this.attackTriggered = true;
            let finishAttack = () => {
                this.retreated = false;
                this.attackTriggered = false;
                this.turnedAround = false;
                this.vulnerable = false;
                this.victim.triggeredAttack = false;
                this.victim.paralyzed = true;
                this.attackSuccessful = false;
            }

            let doRoarSequence = (roar, volume, event1, event2) => {
                AudioMixer.playThingRoar(roar, volume, () => {
                    event1();
                    setTimeout(() => {
                        event2();
                    }, 1500 + getRandomNumber(2500));
                });
            }

            this.victim.canMove = false;
            this.vulnerable = true;
            document.getElementById("options-menu").classList.add("hidden");
            this.lightsOut = true;
            doRoarSequence(3, 1, () => {
                this.vulnerable = false;
            }, () => {
                this.lightsOut = false;
                if (!this.retreated) {
                    this.Stage = 1;
                    doRoarSequence(0, 1, () => { }, () => {
                        this.Stage = 2;
                        doRoarSequence(1, 1.5, () => { }, () => {
                            this.lightsOut = true;
                            setTimeout(() => {
                                this.lightsOut = false;
                                this.Stage = 3;
                                doRoarSequence(2, 2, () => { }, () => {
                                    this.Stage = 0;
                                    this.lightsOut = true;
                                    finishAttack();
                                });
                            }, 1500 + getRandomNumber(3000));
                        });

                    });
                } else {
                    this.retreated = false;
                    this.attackTriggered = false;
                    this.turnedAround = false;
                    this.vulnerable = false;
                    this.victim.triggeredAttack = false;
                    this.victim.resetAttackStates();

                }
            });
        }
    }

    maze;
    constructor(maze, players) {
        this.maze = maze;
    }
};