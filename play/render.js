let Render = class {


    //render options
    assets = {
        corner_right: "./assets/right.webp",
        corner_right_2: "./assets/right2.webp",
        corner_right_3: "./assets/right3.webp",
        corner_left: "./assets/left.webp",
        corner_left_2: "./assets/left2.webp",
        corner_left_3: "./assets/left3.webp",
        corner_fork: "./assets/t.webp",
        corner_fork_2: "./assets/t2.webp",
        corner_fork_3: "./assets/t3.webp",
        corner_fork_right: "./assets/tright.webp",
        corner_fork_right_2: "./assets/tright2.webp",
        corner_fork_right_3: "./assets/tright3.webp",
        corner_fork_left: "./assets/tleft.webp",
        corner_fork_left_2: "./assets/tleft2.webp",
        corner_fork_left_3: "./assets/tleft3.webp",
        deadend: "./assets/dead.webp",
        deadend_2: "./assets/dead_2.webp",
        deadend_3: "./assets/dead3.webp",
        straight: "./assets/straight.webp",
        straight_2: "./assets/straight_2.webp",
        straight_3: "./assets/straight_3.webp",
        straight2: "./assets/straight2.webp",
        straight2_2: "./assets/straight2_2.webp",
        straight2_3: "./assets/straight_2_3.webp",
        intersection: "./assets/4w.webp",
        intersection_2: "./assets/4w2.webp",
        intersection_3: "./assets/4w3.webp",
        pointer: "./assets/pointer.webp",
        north: "./assets/north.webp",
        south: "./assets/south.webp",
        east: "./assets/east.webp",
        west: "./assets/west.webp",
        door_end_closed_1: "./assets/door_end_closed_1.webp",
        door_end_closed_2: "./assets/door_end_closed_2.webp",
        door_end_closed_3: "./assets/door_end_closed_3.webp",
        door_end_opened_1: "./assets/door_end_open_1.webp",
        door_end_opened_2: "./assets/door_end_open_2.webp",
        door_end_opened_3: "./assets/door_end_open_3.webp",
        key_end: "./assets/key_end.webp",
        key_end_empty: "./assets/key_end_empty.webp",
        key_item: "./assets/key_item.webp",
        note_item: "./assets/note_item.webp",
        note_end: "./assets/note_end.webp",
        puzzel_end: "./assets/puzzel_end.webp",
        salt_item: "./assets/salt_item.webp",
        map_item: "./assets/map.webp",
        strobe_item: "./assets/strobe_item.webp",
        supply_end: "./assets/supply_end.webp",
        supply_end_open: "./assets/supply_end_open.webp",
        teammate_fallen: "./assets/teammate_fallen.webp",
        teammate: "./assets/teammate.webp",
        stage1: "./assets/thing_1.webp",
        stage2: "./assets/thing_2.webp",
        stage3: "./assets/thing_3.webp",
        stage4: "./assets/thing_4.webp",
        empty: "./assets/blank.webp",
        strobe_1: "./assets/strobe_1.webp",
        strobe_2: "./assets/strobe_2.webp",
        strobe_3: "./assets/strobe_3.webp",
        strobe_4: "./assets/strobe_4.webp",
        strobe_5: "./assets/strobe_5.webp",
        strobe_6: "./assets/strobe_6.webp",
        strobe_7: "./assets/strobe_7.webp",
        strobe_8: "./assets/strobe_8.webp",
        light_on: "./assets/flashlight_on.webp",
        light_off: "./assets/flashlight_off.webp",
        start: "./assets/level_start.webp",
        loading: "./assets/level_loading.webp",
        panel: "./assets/panel.webp",
        power_door: "./assets/power_door.webp",
        note1: "./assets/note1.webp",
        note2: "./assets/note2.webp",
        note3: "./assets/note3.webp",
        rust: "./assets/rust.webp",
        star: "./assets/star.webp",
        dark_stuff: "./assets/dark_stuff.webp",
    }

    renderTileView(CTX, screen, tVal) {
        this.renderFlashLight(CTX, screen, false);
        switch (tVal) {
            case Corner:
                RenderEngine.renderCorner(CTX, screen, screen.player.getAvaliablePaths());
                break;
            case Deadend:
                RenderEngine.renderDeadend(CTX, screen)
                break;
            case Fork:
                RenderEngine.renderFork(CTX, screen, screen.player.getAvaliablePaths());
                break;
            case Intersection:
                RenderEngine.renderIntersection(CTX, screen)
                break;
            case SupplyEnd:
                RenderEngine.renderDeadend(CTX, screen)
                this.renderImageAsset(CTX, this.assets.supply_end, 0, 0, screen.width, screen.height)
                break;

            case KeyEnd:
                RenderEngine.renderDeadend(CTX, screen)
                this.renderImageAsset(CTX, this.assets.key_end, 0, 0, screen.width, screen.height)
                break;
            case EmptyKeyEnd:
                RenderEngine.renderDeadend(CTX, screen)
                this.renderImageAsset(CTX, this.assets.key_end_empty, 0, 0, screen.width, screen.height)
                break;

            case PuzzelEnd:
                RenderEngine.renderDeadend(CTX, screen)
                this.renderImageAsset(CTX, this.assets.puzzel_end, 0, 0, screen.width, screen.height)
                break;
            case LevelStart:
                RenderEngine.renderDeadend(CTX, screen)
                this.renderImageAsset(CTX, this.assets.start, 0, 0, screen.width, screen.height)
                break;
            case LevelLoading:
                RenderEngine.renderFlashLight(CTX, screen, false);
                this.renderImageAsset(CTX, this.assets.loading, 0, 0, screen.width, screen.height)
                break;
            case OpenDoorEnd:
                RenderEngine.renderOpenDoor(CTX, screen)
                break;
            case ClosedDoorEnd:
                RenderEngine.renderClosedDoor(CTX, screen)
                this.renderImageAsset(CTX, this.assets.panel, 0, 0, screen.width, screen.height)
                this.renderImageAsset(CTX, this.assets.power_door, 0, 0, screen.width, screen.height)
                break;
            case PlayerStart:
                RenderEngine.renderClosedDoor(CTX, screen)
                this.renderImageAsset(CTX, this.assets.panel, 0, 0, screen.width, screen.height)
                break;
            case OpenSupplyEnd:
                RenderEngine.renderDeadend(CTX, screen)
                this.renderOpenSupplyEnd(CTX, screen)
                break;
            case NoteEnd:
                RenderEngine.renderDeadend(CTX, screen)
                this.renderImageAsset(CTX, this.assets.note_end, 0, 0, screen.width, screen.height)
                break;
            default:
                console.log(tVal)
                RenderEngine.renderStraight(CTX, screen)
        }
    }



    renderText(CTX, screen, text = "") {
        //this.drawBlock(CTX, "black", 0, 0, (screen.width > screen.height) ? screen.width : screen.height);
        CTX.font = "48px sans-serif";
        let lines = text.split("\n");

        let marginTop = (screen.height - (lines.length * 48)) / 2
        lines.forEach(line => {
            CTX.fillStyle = "black";
            CTX.textAlign = "center";
            CTX.fillText(line, screen.width / 2 + 2, marginTop += 50);
        });
        marginTop = (screen.height - (lines.length * 48)) / 2
        lines.forEach(line => {
            CTX.fillStyle = "white";
            CTX.textAlign = "center";
            CTX.fillText(line, screen.width / 2, marginTop += 48);
        });

    }

    renderNote(CTX, screen, text = "", fontSize = 48, type = 1) {
        //this.drawBlock(CTX, "black", 0, 0, (screen.width > screen.height) ? screen.width : screen.height);
        this.renderImageAsset(CTX, this.assets["note" + type], 0, 0, screen.width, screen.height)
        CTX.font = fontSize + "px 'Courier New'";
        let lines = text.split("\n");

        // let marginTop = (screen.height - (lines.length * fontSize)) / 2
        // lines.forEach(line => {
        //     CTX.fillStyle = "grey";
        //     CTX.textAlign = "center";
        //     CTX.fillText(line, screen.width / 2, marginTop += fontSize);
        // });
        let marginTop = (screen.height - (lines.length * fontSize)) / 2
        lines.forEach(line => {
            CTX.fillStyle = "black";
            CTX.textAlign = "center";
            CTX.fillText(line, screen.width / 2 + 2, marginTop += fontSize + 1);
        });

    }

    renderOpenSupplyEnd(CTX, screen) {
        this.renderImageAsset(CTX, this.assets.supply_end_open, 0, 0, screen.width, screen.height)
    }
    /* THING RENDER */
    renderThingPosition1(CTX, screen) {
        this.renderImageAsset(CTX, this.assets.stage1, 0, 0, screen.width, screen.height);
        screen.pX = screen.width / 2;
        screen.pY = screen.height / 2;
        this.renderFlashLight(CTX, screen, true);
    }
    renderThingPosition2(CTX, screen) {
        this.renderImageAsset(CTX, this.assets.stage2, 0, 0, screen.width, screen.height);
        screen.pX = screen.width / 2;
        screen.pY = screen.height / 2;
        this.renderFlashLight(CTX, screen, true);

    }
    renderThingPosition3(CTX, screen) {
        this.renderImageAsset(CTX, this.assets.stage3, 0, 0, screen.width, screen.height);
        this.renderFlashLight(CTX, screen, true);
    }
    renderThingPosition4(CTX, screen) {
        this.renderImageAsset(CTX, this.assets.stage4, 0, 0, screen.width, screen.height);
        screen.pX = screen.width / 2;
        screen.pY = screen.height / 2;
        this.renderFlashLight(CTX, screen, true);
    }

    renderImageAsset(CTX, image, x, y, w, h) {
        CTX.drawImage(image, x, y, w, h);
    }

    drawBlock(CTX, color, x, y, blockSize) {
        // Fill with gradient
        CTX.fillStyle = color;
        CTX.fillRect(x, y, blockSize, blockSize)
    }
    level = 0;
    renderCorner(CTX, screen, avaliable) {
        let asset = "";
        if (avaliable[screen.player.compass[East]]) {
            switch (this.level) {
                case 1:
                case 2:
                    asset = this.assets.corner_right;
                    break;
                case 3:
                case 4:
                    asset = this.assets.corner_right_2;
                    break;
                case 5:
                case 6:
                    asset = this.assets.corner_right_3;
                    break;
                default:
                    asset = this.assets.corner_right;

            }
        } else
            switch (this.level) {
                case 1:
                case 2:
                    asset = this.assets.corner_left;
                    break;
                case 3:
                case 4:
                    asset = this.assets.corner_left_2;
                    break;
                case 5:
                case 6:
                    asset = this.assets.corner_left_3;
                    break;
                default:
                    asset = this.assets.corner_left;

            }
        this.renderImageAsset(CTX, asset, 0, 0, screen.width, screen.height);
    }

    renderFork(CTX, screen, avaliable) {
        let asset = "";
        if (avaliable[screen.player.compass[East]] && avaliable[screen.player.compass[North]]) {
            switch (this.level) {
                case 1:
                case 2:
                    asset = this.assets.corner_fork_right;
                    break;
                case 3:
                case 4:
                    asset = this.assets.corner_fork_right_2;
                    break;
                case 5:
                case 6:
                    asset = this.assets.corner_fork_right_3;
                    break;
                default:
                    asset = this.assets.corner_fork_right;

            }
        } else if (avaliable[screen.player.compass[West]] && avaliable[screen.player.compass[North]])
            switch (this.level) {
                case 1:
                case 2:
                    asset = this.assets.corner_fork_left;
                    break;
                case 3:
                case 4:
                    asset = this.assets.corner_fork_left_2;
                    break;
                case 5:
                case 6:
                    asset = this.assets.corner_fork_left_3;
                    break;
                default:
                    asset = this.assets.corner_fork_left;

            }
        else
            switch (this.level) {
                case 1:
                case 2:
                    asset = this.assets.corner_fork;
                    break;
                case 3:
                case 4:
                    asset = this.assets.corner_fork_2;
                    break;
                case 5:
                case 6:
                    asset = this.assets.corner_fork_3;
                    break;
                default:
                    asset = this.assets.corner_fork;

            }
        this.renderImageAsset(CTX, asset, 0, 0, screen.width, screen.height);
    }

    renderDeadend(CTX, screen) {
        let asset = "";
        switch (this.level) {
            case 1:
            case 2:
                asset = this.assets.deadend;
                break;
            case 3:
            case 4:
                asset = this.assets.deadend_2;
                break;
            case 5:
            case 6:
                asset = this.assets.deadend_3;
                break;
            default:
                asset = this.assets.deadend;

        }
        this.renderImageAsset(CTX, asset, 0, 0, screen.width, screen.height);
    }
    renderOpenDoor(CTX, screen) {
        let asset = "";
        switch (this.level) {
            case 1:
            case 2:
                asset = this.assets.door_end_opened_1;
                break;
            case 3:
            case 4:
                asset = this.assets.door_end_opened_2;
                break;
            case 5:
            case 6:
                asset = this.assets.door_end_opened_3;
                break;
            default:
                asset = this.assets.door_end_opened_1;

        }
        this.renderImageAsset(CTX, asset, 0, 0, screen.width, screen.height);
    }
    renderClosedDoor(CTX, screen) {
        let asset = "";
        switch (this.level) {
            case 1:
            case 2:
                asset = this.assets.door_end_closed_1;
                break;
            case 3:
            case 4:
                asset = this.assets.door_end_closed_2;
                break;
            case 5:
            case 6:
                asset = this.assets.door_end_closed_3;
                break;
            default:
                asset = this.assets.door_end_closed_1;

        }
        this.renderImageAsset(CTX, asset, 0, 0, screen.width, screen.height);
    }
    renderIntersection(CTX, screen) {
        let asset = "";
        switch (this.level) {
            case 1:
            case 2:
                asset = this.assets.intersection;
                break;
            case 3:
            case 4:
                asset = this.assets.intersection_2;
                break;
            case 5:
            case 6:
                asset = this.assets.intersection_3;
                break;
            default:
                asset = this.assets.intersection;

        }
        this.renderImageAsset(CTX, asset, 0, 0, screen.width, screen.height);
    }
    stepCount = 0;
    renderStraight(CTX, screen) {
        let asset = "";

        if (screen.player.stepCount % 2 == 0)
            switch (this.level) {
                case 1:
                case 2:
                    asset = this.assets.straight;
                    break;
                case 3:
                case 4:
                    asset = this.assets.straight_2;
                    break;
                case 5:
                case 6:
                    asset = this.assets.straight_3;
                    break;
                default:
                    asset = this.assets.straight;

            }
        else
            switch (this.level) {
                case 1:
                case 2:
                    asset = this.assets.straight2;
                    break;
                case 3:
                case 4:
                    asset = this.assets.straight2_2;
                    break;
                case 5:
                case 6:
                    asset = this.assets.straight2_3;
                    break;
                default:
                    asset = this.assets.straight2;

            }
        this.renderImageAsset(CTX, asset, 0, 0, screen.width, screen.height);
    }

    getItemImage(item) {
        let src = "";
        switch (item) {
            case Strobe:
                src = this.assets.strobe_item.src;
                break;
            case Salt:
                src = this.assets.salt_item.src;
                break;
            case Key:
                src = this.assets.key_item.src;
                break;
            case MapItem:
                src = this.assets.map_item.src;
                break;
            case FreeHand:
                src = this.assets.empty.src
                break;
            case Note:
                src = this.assets.note_item.src
                break;
        }
        return src;
    }

    renderUserItems(screen) {
        document.getElementById("item-1").src = this.getItemImage(screen.player.item1);
        document.getElementById("item-2").src = this.getItemImage(screen.player.item2);
    }
    renderStrobe(CTX, screen, stage) {
        return this.renderImageAsset(CTX, this.assets["strobe_" + stage], 0, 0, screen.width, screen.height)
    }

    renderFlashLight(CTX, screen, on = true) {
        let x = screen.pX, y = screen.pY;
        if (x < 0)
            x = 0;
        if (x > screen.width)
            x = screen.width;
        if (y < 0)
            y = 0;
        if (y > screen.height)
            y = screen.height;
        if (screen.width < 1000) {
            return this.renderImageAsset(CTX, this.assets[on ? "light_on" : "light_off"], (-screen.width * 2) + x, (-screen.height * 2) + y, screen.width * 4, screen.height * 4)
        } else
            return this.renderImageAsset(CTX, this.assets[on ? "light_on" : "light_off"], -screen.width + x, -screen.height + y, screen.width * 2, screen.height * 2)
    }
    renderMap(CTX, xOff, yOff, screen, map, orient = North, colorScheme = map_colors, cap = 10) {
        if (map.maze_perimiter < 10)
            cap = 4;
        CTX.save();
        let blockSize = screen.block;
        CTX.translate(screen.w - xOff, screen.h - yOff)
        this.renderImageAsset(CTX, this.assets.note1, -100, -1000, screen.width, screen.height);
        //this.drawBlock(CTX, "red", 0, 0, 200, 200)
        let xLower =
            (screen.x - (cap / 2) >= 0) ?
                (screen.x <= map.maze_perimiter - cap) ?
                    screen.x - (cap / 2)
                    : map.maze_perimiter - cap
                : 0;
        let yLower = (screen.y - (cap / 2) >= 0) ? (screen.y <= map.maze_perimiter - cap) ? screen.y - (cap / 2) : map.maze_perimiter - cap : 0;
        for (let y = yLower; y < yLower + cap; y++)
            for (let x = xLower; x < xLower + cap; x++) {
                if (map.maze[y][x] != 0)
                    this.drawBlock(CTX, colorScheme[map.maze[y][x]], ((x - xLower) * blockSize) - (xOff) / 2, ((y - yLower) * blockSize) - (yOff) / 2, blockSize);
            }

        // for (let y = 0; y < map.maze_perimiter; y++)
        //     for (let x = 0; x < map.maze_perimiter; x++) {
        //         // this.drawBlock(CTX, colorScheme[map.maze[y][x]], ((x - xLower) * blockSize) - (xOff) / 2, ((y - yLower) * blockSize) - (yOff) / 2, blockSize);
        //         this.drawBlock(CTX, colorScheme[map.maze[y][x]], (x * blockSize), (y * blockSize), blockSize);
        //     }
        CTX.save();
        CTX.fillStyle = "green";
        CTX.translate(((screen.x - xLower) * blockSize) - (xOff) / 2, ((screen.y - yLower) * blockSize) - (yOff) / 2)
        let asset = 0;
        switch (orient) {
            case North:
                asset = this.assets.north;
                break;
            case East:
                asset = this.assets.east;
                break;
            case South:
                asset = this.assets.south;
                break;
            case West:
                asset = this.assets.west;
                break;
            default:
                asset = this.assets.north;
        }
        this.renderImageAsset(
            CTX,
            asset,
            0,
            0,
            blockSize,
            blockSize)
        CTX.restore();

        CTX.restore();

    }
    player
    constructor(player) {
        let assets = new ResourceLoader(this.assets);
        screen.player = player;
    }
};