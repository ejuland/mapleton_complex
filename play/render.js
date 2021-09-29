
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { ResourceLoader } from "./assets.js";
import * as Maze from "./MazeGen.js"
import * as Item from "./items.js"

export const colors = {
    0: "black",
    1: "blue",
    2: "red",
    3: "grey",
    4: "purple",
    5: "pink",
    6: "orange",
    7: "yellow",
    8: "black",
    9: "black",
    10: "brown",
    22: "hotpink",
    23: "cream",
    24: "skyblue",
    20: "steelblue",
    21: "steelblue",
    26: "olive"


};
export const map_colors = {
    1: "grey",
    2: "grey",
    3: "grey",
    4: "grey",
    5: "grey",
    6: "grey",
    7: "grey",
    8: "grey",
    9: "grey",
    10: "grey",
    11: "grey",
    12: "grey",
    13: "grey",
    14: "grey",
    15: "grey",
    16: "grey",
    17: "grey",
    18: "grey",
    19: "grey",
    20: "grey",
    21: "grey",
    22: "grey",
    23: "grey",
    24: "grey",
    25: "grey",
    26: "grey",
    27: "grey",
    28: "grey",
    29: "grey",
    30: "grey",
};

export const colorz = {
    0: "black",
    1: "red",
    2: "white",
    3: "white",
    4: "white",
    5: "white",
    6: "white",
    8: "white",
    7: "blue",
    22: "hotpink"
};

const LEFT = Math.PI / 2;
const RIGHT = (Math.PI * 3) / 2;
const Back = Math.PI;
const WallTextues = {
    plain_wall: './assets/models/textures/texture_3_web_friendly/office wall.jpg',
    window_wall: './assets/models/textures/texture_3_web_friendly/office wall_2.jpg',
    door_wall: './assets/models/textures/texture_3_web_friendly/office wall_3.jpg',
}
export class Render {


    //render options
    assets = {

        pointer: "./assets/pointer.webp",
        north: "./assets/north.webp",
        south: "./assets/south.webp",
        east: "./assets/east.webp",
        west: "./assets/west.webp",
        key_item: "./assets/key_item.webp",
        note_item: "./assets/note_item.webp",
        salt_item: "./assets/salt_item.webp",
        map_item: "./assets/map.webp",
        strobe_item: "./assets/strobe_item.webp",
        empty: "./assets/blank.webp",
        note1: "./assets/note1.webp",
        note2: "./assets/note2.webp",
        note3: "./assets/note3.webp",
        rust: "./assets/rust.webp",
        star: "./assets/star.webp",
        dark_stuff: "./assets/dark_stuff.webp",
    }

    renderTileView(CTX, screen) {
        //this.clearScreen(CTX, screen);
        this.refreshMazeSection();
        let cap = 4;

        let position = { x: screen.player.x, y: screen.player.y };
        let positions = [];
        let getAdjacent = (x, y, depth = 0) => {
            let tval = screen.maze.getTileValue(x, y);
            if (!screen.maze.isValidCoord(x, y) || !(screen.maze.isPath(tval) || screen.maze.isEnd(tval)))
                return;
            if (depth >= cap)
                return;
            positions.push({ x: x, y: y });
            let avaliable = screen.maze.getAvaliablePaths(x, y);
            if (avaliable[Maze.North])
                getAdjacent(x, Maze.N(y), depth + 1);
            if (avaliable[Maze.South])
                getAdjacent(x, Maze.S(y), depth + 1);
            if (avaliable[Maze.East])
                getAdjacent(Maze.E(x), (y), depth + 1);
            if (avaliable[Maze.West])
                getAdjacent(Maze.W(x), (y), depth + 1);

        };
        getAdjacent(position.x, position.y);
        positions = positions.map(pos => {
            pos.value = screen.maze.getTileValue(pos.x, pos.y);
            pos.maze = {};
            pos.maze.x = pos.x,
                pos.maze.y = pos.y,
                pos.x -= position.x;
            pos.y -= position.y;
            // switch (screen.player.orientation) {
            //     case Maze.West:
            //         pos.y *= -1;
            //         break;
            //     case Maze.East:
            //         pos.x *= -1;
            //         break;
            //     case Maze.South:
            //         pos.y *= -1;
            //         pos.x *= -1;
            //         break;
            // }
            return pos;
        });


        let renderTileInPosition = (pos) => {

            //this.renderFlashLight(CTX, screen, false);
            switch (pos.value) {
                case Maze.Corner:
                    this.renderCorner(pos, screen);
                    break;
                case Maze.Deadend:
                    this.renderDeadend(pos, screen)
                    break;
                case Maze.Fork:
                    this.renderFork(pos, screen);
                    break;
                case Maze.Intersection:
                    this.renderIntersection(pos, screen)
                    break;
                case Maze.SupplyEnd:
                    this.renderClosedDoor(pos, screen)
                    break;

                case Maze.KeyEnd:
                    this.renderClosedDoor(pos, screen)
                    break;
                case Maze.EmptyKeyEnd:
                    this.renderClosedDoor(pos, screen)
                    break;

                case Maze.PuzzelEnd:
                    this.renderClosedDoor(pos, screen)
                    // this.renderImageAsset(CTX, this.assets.puzzel_end, 0, 0, window.innerWidth, window.innerHeight)
                    break;
                case Maze.LevelStart:
                    this.renderDeadend(pos, screen);
                    break;
                case Maze.LevelLoading:
                    this.renderClosedDoor(pos, screen)
                    break;
                case Maze.OpenDoorEnd:
                    this.renderClosedDoor(pos, screen)
                    break;
                case Maze.ClosedDoorEnd:
                    this.renderClosedDoor(pos, screen)
                    break;
                case Maze.PlayerStart:
                    this.renderClosedDoor(pos, screen)
                    break;
                case Maze.OpenSupplyEnd:
                    this.renderClosedDoor(pos, screen)
                    break;
                case Maze.NoteEnd:
                    this.renderClosedDoor(pos, screen)
                    break;
                default:
                    this.renderStraight(pos, screen);
            }
        }

        positions.forEach(renderTileInPosition)
    }



    renderText(CTX, screen, text = "") {
        //this.drawBlock(CTX, "black", 0, 0, (window.innerWidth > window.innerHeight) ? window.innerWidth : window.innerHeight);
        CTX.font = "this.48px sans-serif";
        let lines = text.split("\n");

        let marginTop = (window.innerHeight - (lines.length * 48)) / 2
        lines.forEach(line => {
            CTX.fillStyle = "black";
            CTX.textAlign = "center";
            CTX.fillText(line, window.innerWidth / 2 + 2, marginTop += 50);
        });
        marginTop = (window.innerHeight - (lines.length * 48)) / 2
        lines.forEach(line => {
            CTX.fillStyle = "white";
            CTX.textAlign = "center";
            CTX.fillText(line, window.innerWidth / 2, marginTop += 48);
        });

    }

    renderNote(CTX, screen, text = "", fontSize = 48, type = 1) {
        //this.drawBlock(CTX, "black", 0, 0, (window.innerWidth > window.innerHeight) ? window.innerWidth : window.innerHeight);
        this.renderImageAsset(CTX, this.assets["note" + type], 0, 0, window.innerWidth, window.innerHeight)
        CTX.font = fontSize + "this.px 'Courier New'";
        let lines = text.split("\n");

        // let marginTop = (window.innerHeight - (lines.length * fontSize)) / 2
        // lines.forEach(line => {
        //     CTX.fillStyle = "grey";
        //     CTX.textAlign = "center";
        //     CTX.fillText(line, window.innerWidth / 2, marginTop += fontSize);
        // });
        let marginTop = (window.innerHeight - (lines.length * fontSize)) / 2
        lines.forEach(line => {
            CTX.fillStyle = "black";
            CTX.textAlign = "center";
            CTX.fillText(line, window.innerWidth / 2 + 2, marginTop += fontSize + 1);
        });

    }

    renderOpenSupplyEnd(CTX, screen) {
        this.renderImageAsset(CTX, this.assets.supply_end_open, 0, 0, window.innerWidth, window.innerHeight)
    }
    /* THING RENDER */
    renderThingPosition1(CTX, screen) {
        this.renderImageAsset(CTX, this.assets.stage1, 0, 0, window.innerWidth, window.innerHeight);
        this.pX = window.innerWidth / 2;
        this.pY = window.innerHeight / 2;
        this.renderFlashLight(CTX, screen, true);
    }
    renderThingPosition2(CTX, screen) {
        this.renderImageAsset(CTX, this.assets.stage2, 0, 0, window.innerWidth, window.innerHeight);
        this.pX = window.innerWidth / 2;
        this.pY = window.innerHeight / 2;
        this.renderFlashLight(CTX, screen, true);

    }
    renderThingPosition3(CTX, screen) {
        this.renderImageAsset(CTX, this.assets.stage3, 0, 0, window.innerWidth, window.innerHeight);
        this.renderFlashLight(CTX, screen, true);
    }
    renderThingPosition4(CTX, screen) {
        this.renderImageAsset(CTX, this.assets.stage4, 0, 0, window.innerWidth, window.innerHeight);
        this.pX = window.innerWidth / 2;
        this.pY = window.innerHeight / 2;
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
    renderRight(pos, rotation) {
        switch (rotation) {
            case RIGHT:
                this.loadMazeSection(this.MazeSections["base"], pos.x, pos.y);
                this.loadMazeSection(this.MazeSections["back"], pos.x, pos.y, WallTextues.plain_wall);
                this.loadMazeSection(this.MazeSections["right"], pos.x, pos.y, WallTextues.plain_wall);
                break;
            default:
                this.loadMazeSection(this.MazeSections["base"], pos.x, pos.y);
                this.loadMazeSection(this.MazeSections["left"], pos.x, pos.y, WallTextues.plain_wall);
                this.loadMazeSection(this.MazeSections["back"], pos.x, pos.y, WallTextues.plain_wall);
        }

    }
    renderCorner(pos, screen, avaliable) {
        let asset = "";
        if (pos.x == 0 && pos.y == 0) {
            this.loadMazeSection(this.MazeSections["base"], pos.x, pos.y);
            //this.loadMazeSection(this.MazeSections["front"], pos.x, pos.y, WallTextues.plain_wall);
            if (!screen.maze.getAvaliablePaths(pos.maze.x, pos.maze.y)[screen.player.compass[Maze.East]])
                this.loadMazeSection(this.MazeSections["right"], pos.x, pos.y);
            if (!screen.maze.getAvaliablePaths(pos.maze.x, pos.maze.y)[screen.player.compass[Maze.West]])
                this.loadMazeSection(this.MazeSections["left"], pos.x, pos.y);
            if (!screen.maze.getAvaliablePaths(pos.maze.x, pos.maze.y)[screen.player.compass[Maze.North]])
                this.loadMazeSection(this.MazeSections["back"], pos.x, pos.y);
            if (!screen.maze.getAvaliablePaths(pos.maze.x, pos.maze.y)[screen.player.compass[Maze.South]])
                this.loadMazeSection(this.MazeSections["front"], pos.x, pos.y);
        } else {
            let relPosition = screen.player.relDirectionOfPoint(pos.maze.x, pos.maze.y);

            console.log(pos)
            this.orientPos(pos, screen.player);
            console.log(pos);
            this.loadMazeSection(this.MazeSections["base"], pos.x, pos.y);
            if (!screen.maze.getAvaliablePaths(pos.maze.x, pos.maze.y)[screen.player.compass[Maze.East]])
                this.loadMazeSection(this.MazeSections["right"], pos.x, pos.y);
            if (!screen.maze.getAvaliablePaths(pos.maze.x, pos.maze.y)[screen.player.compass[Maze.West]])
                this.loadMazeSection(this.MazeSections["left"], pos.x, pos.y);
            if (!screen.maze.getAvaliablePaths(pos.maze.x, pos.maze.y)[screen.player.compass[Maze.North]])
                this.loadMazeSection(this.MazeSections["back"], pos.x, pos.y);
            if (!screen.maze.getAvaliablePaths(pos.maze.x, pos.maze.y)[screen.player.compass[Maze.South]])
                this.loadMazeSection(this.MazeSections["front"], pos.x, pos.y);
        }
        // if (avaliable[screen.player.compass[Maze.East]]) {
        //     //RIGHT
        // } else {
        //     //LEFT
        // }
    }

    renderFork(position, screen) {
        let asset = "";
        let pos = Object.assign({}, position);
        this.orientPos(pos, screen.player);
        this.loadMazeSection(this.MazeSections["base"], pos.x, pos.y);

        if (!screen.maze.getAvaliablePaths(pos.maze.x, pos.maze.y)[screen.player.compass[Maze.East]])
            this.loadMazeSection(this.MazeSections["right"], pos.x, pos.y);
        if (!screen.maze.getAvaliablePaths(pos.maze.x, pos.maze.y)[screen.player.compass[Maze.West]])
            this.loadMazeSection(this.MazeSections["left"], pos.x, pos.y);
        if (!screen.maze.getAvaliablePaths(pos.maze.x, pos.maze.y)[screen.player.compass[Maze.North]])
            this.loadMazeSection(this.MazeSections["back"], pos.x, pos.y);
        if (!screen.maze.getAvaliablePaths(pos.maze.x, pos.maze.y)[screen.player.compass[Maze.South]])
            this.loadMazeSection(this.MazeSections["front"], pos.x, pos.y);

    }

    renderDeadend(position, screen) {
        let pos = Object.assign({}, position);
        let avaliable = screen.maze.getAvaliablePaths(pos.maze.x, pos.maze.y);

        let relPosition = screen.player.relDirectionOfPoint(pos.maze.x, pos.maze.y);
        this.orientPos(pos, screen.player);
        this.loadMazeSection(this.MazeSections["base"], pos.x, pos.y);
        if (screen.maze.getAvaliablePaths(pos.maze.x, pos.maze.y)[screen.player.compass[Maze.West]]) {
            this.loadMazeSection(this.MazeSections["left"], pos.x, pos.y, WallTextues.plain_wall);
            this.loadMazeSection(this.MazeSections["front"], pos.x, pos.y, WallTextues.plain_wall);
            this.loadMazeSection(this.MazeSections["back"], pos.x, pos.y, WallTextues.plain_wall);

        }
        if (screen.maze.getAvaliablePaths(pos.maze.x, pos.maze.y)[screen.player.compass[Maze.East]]) {
            this.loadMazeSection(this.MazeSections["left"], pos.x, pos.y, WallTextues.plain_wall);
            this.loadMazeSection(this.MazeSections["right"], pos.x, pos.y, WallTextues.plain_wall);
            this.loadMazeSection(this.MazeSections["back"], pos.x, pos.y, WallTextues.plain_wall);
        }
        if (screen.maze.getAvaliablePaths(pos.maze.x, pos.maze.y)[screen.player.compass[Maze.North]]) {
            this.loadMazeSection(this.MazeSections["left"], pos.x, pos.y, WallTextues.plain_wall);
            this.loadMazeSection(this.MazeSections["right"], pos.x, pos.y, WallTextues.plain_wall);
            this.loadMazeSection(this.MazeSections["front"], pos.x, pos.y, WallTextues.plain_wall);
        }
        if (screen.maze.getAvaliablePaths(pos.maze.x, pos.maze.y)[screen.player.compass[Maze.South]]) {
            this.loadMazeSection(this.MazeSections["left"], pos.x, pos.y, WallTextues.plain_wall);
            this.loadMazeSection(this.MazeSections["right"], pos.x, pos.y, WallTextues.plain_wall);
            this.loadMazeSection(this.MazeSections["back"], pos.x, pos.y, WallTextues.plain_wall);
        }




    }
    renderOpenDoor(CTX, screen) {
        //OPEN DOOR
    }
    renderClosedDoor(pos, screen) {
        this.renderDeadend(pos, screen)
        //CLOSED DOOR
    }
    renderIntersection(pos, screen) {
        this.orientPos(pos, screen.player);
        this.loadMazeSection(this.MazeSections["base"], pos.x, pos.y);

    }
    stepCount = 0;
    orientPos(pos, player) {
        let x = 0;
        let y = 0;
        switch (player.orientation) {
            case Maze.East:
                y = pos.y;
                pos.y = pos.x;
                pos.x = y;
                break;
            case Maze.West:
                y = pos.y;
                pos.y = -pos.x;
                pos.x = -y;
                break;
            case Maze.South:
                pos.x *= -1;
                break;
            case Maze.North:
                pos.y *= -1;

                break;
        }
    }
    renderStraight(pos, screen) {

        if (pos.x == 0 && pos.y == 0) {
            this.loadMazeSection(this.MazeSections["base"], pos.x, pos.y);
            this.loadMazeSection(this.MazeSections["left"], pos.x, pos.y);
            this.loadMazeSection(this.MazeSections["right"], pos.x, pos.y);
            //this.loadMazeSection(this.MazeSections["front"], pos.x, pos.y, WallTextues.plain_wall);
        } else {

            console.log(pos);
            let relPosition = screen.player.relDirectionOfPoint(pos.maze.x, pos.maze.y);
            this.orientPos(pos, screen.player);
            console.log(pos, relPosition)
            this.loadMazeSection(this.MazeSections["base"], pos.x, pos.y);

            if (screen.maze.getAvaliablePaths(pos.maze.x, pos.maze.y)[screen.player.compass[Maze.North]]) {
                this.loadMazeSection(this.MazeSections["left"], pos.x, pos.y);
                this.loadMazeSection(this.MazeSections["right"], pos.x, pos.y);
            } else {
                this.loadMazeSection(this.MazeSections["front"], pos.x, pos.y);
                this.loadMazeSection(this.MazeSections["back"], pos.x, pos.y);
            }
            // this.loadMazeSection(this.MazeSections["front"], pos.x, pos.y, WallTextues.plain_wall);
            // this.loadMazeSection(this.MazeSections["left"], pos.x, pos.y, WallTextues.plain_wall);
            // this.loadMazeSection(this.MazeSections["right"], pos.x, pos.y, WallTextues.plain_wall);


            //this.loadMazeSection(this.MazeSections["left"], pos.x, pos.y, WallTextues.plain_wall);
            //this.loadMazeSection(this.MazeSections["right"], pos.x, pos.y, WallTextues.plain_wall);
        }
    }

    getItemImage(item) {
        let src = "";
        switch (item) {
            case Item.Strobe:
                src = this.assets.strobe_item.src;
                break;
            case Item.Salt:
                src = this.assets.salt_item.src;
                break;
            case Item.Key:
                src = this.assets.key_item.src;
                break;
            case Item.MapItem:
                src = this.assets.map_item.src;
                break;
            case Item.FreeHand:
                src = this.assets.empty.src
                break;
            case Item.Note:
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
        //TODO: Strobe Animation With Gradients....
    }


    renderMap(CTX, xOff, yOff, screen, map, orient = North, colorScheme = map_colors, cap = 10) {
        if (map.maze_perimiter < 10)
            cap = 4;
        CTX.save();
        let blockSize = screen.block;
        CTX.translate(screen.w - xOff, screen.h - yOff)
        // this.renderImageAsset(CTX, this.assets.note1, -100, -1000, window.innerWidth, window.innerHeight);
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
            case Maze.North:
                asset = this.assets.north;
                break;
            case Maze.East:
                asset = this.assets.east;
                break;
            case Maze.South:
                asset = this.assets.south;
                break;
            case Maze.West:
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
    clearScreen(CTX, screen) {
        CTX.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }

    renderFlashLight(CTX, screen, on) {
        //var gradient = CTX.createRadialGradient(this.px, this.py, 50, this.px - 50, this.py - 50, 70);
        if (on) {

            var gradient = CTX.createRadialGradient(
                this.px + 10, this.py + 10, this.flashLightInnerRadius,
                this.px, this.py, this.flashLightOutterRadius
            );
            gradient.addColorStop(0, 'transparent');
            gradient.addColorStop(1, '#000000fe');
            CTX.fillStyle = gradient;
            CTX.fillRect(0, 0, window.innerWidth, window.innerHeight);
        } else {
            var gradient = CTX.createRadialGradient(
                this.px + 10, this.py + 10, this.flashLightInnerRadius,
                this.px, this.py, this.flashLightOutterRadius
            );
            gradient.addColorStop(0, '#000000a0');
            gradient.addColorStop(1, '#000000fe');
            CTX.fillStyle = gradient;
            CTX.fillRect(0, 0, window.innerWidth, window.innerHeight);

        }
    }

    // 3D Rendering Operations

    updateRenderSize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("action_screen") });
    camera = null;

    inTransition = false;
    offsetY = 0;
    rotationX = 0;
    px = window.innerWidth / 2;
    py = window.innerHeight / 2;
    flashLightInnerRadius = 130;
    flashLightOutterRadius = 200;
    refeshing = false;
    maxFlashlightRadius = 200;
    offsetX = 0;
    cameraX = 0;
    targetPosition = null;


    cameraInPosition() {
        return (this.offsetX > this.cameraX - .05) && (this.offsetX < this.cameraX + .05);
    }


    turnRight = false;
    turnLeft = false;
    slot = 0;

    delayOver = false;
    setDelay = false;

    delayed(time) {
        if (!this.delayOver) {
            if (!this.setDelay) {
                this.setDelay = true;
                setTimeout(() => {
                    this.delayOver = true;
                }, time);
            }
        }
        else {
            this.delayOver = false;
            this.setDelay = false;
            return true;
        }
    }

    smoothness = 0.09 // 0 to 1 only
    WIDTH;
    HEIGHT;
    focousOnFloor(point = maxFlashlightRadius / 2) {

        if (this.py < this.HEIGHT - point)
            this.py += 10;
        return (this.py > this.HEIGHT - point) && this.shrinkFlashlight(70, 50)

    }

    shrinkFlashlight(amount = 10, rate = 5) {
        this.flashlightOn = false;
        return true;
        if (this.flashLightInnerRadius >= 20) {
            this.flashLightInnerRadius -= rate;
            this.flashLightOutterRadius -= rate;
        } else {
            this.flashLightInnerRadius--;
            this.flashLightOutterRadius--;
        }
        if (this.flashLightOutterRadius < 0) {
            this.flashLightOutterRadius = 0;
        }
        if (this.flashLightInnerRadius < 0) {
            this.flashLightInnerRadius = 0;
        }
        return this.flashLightInnerRadius <= amount
    };

    transitions = {
        straight: [
            () => {
                this.MoveCameraToPoint(0, 0, 2)
                return this.shrinkFlashlight() && this.reachedPoint(this.targetPosition, this.camera.position);
            }
        ],
        right: [
            () => {
                this.MoveCameraToPoint(0, 0, 1.5)
                return this.reachedPoint(this.targetPosition, this.camera.position);
            },
            () => {
                this.cameraX = Math.PI / -2;
                return this.cameraInPosition();
            }, () => {
                this.MoveCameraToPoint(-1, 0, 1)
                if (this.reachedPoint(this.targetPosition, this.camera.position))
                    this.flashlightOn = false;
                return this.reachedPoint(this.targetPosition, this.camera.position);
            }

        ],
        left: [
            () => {
                this.MoveCameraToPoint(0, 0, 2)
                return this.shrinkFlashlight() && this.reachedPoint(this.targetPosition, this.camera.position);
            },
            () => {
                this.cameraX = Math.PI / 2;
                return this.shrinkFlashlight() && this.cameraInPosition();
            }, () => {
                this.MoveCameraToPoint(1, 0, 3)
                if (this.reachedPoint(this.targetPosition, this.camera.position))
                    this.flashlightOn = false;
                return this.reachedPoint(this.targetPosition, this.camera.position);
            }
        ],
        uturn: [
            () => {
                this.MoveCameraToPoint(0, 0, 1)
                return this.delayed(1000) && this.reachedPoint(this.targetPosition, this.camera.position);
            },
            () => {
                this.cameraX = Math.PI;
                return this.shrinkFlashlight() && this.cameraInPosition();
            }
        ]
    };

    reachedPoint(pos, pos2, epsilon) {
        return (
            (Math.ceil(Math.abs(pos.x) * 100) / 100 - Math.ceil(Math.abs(pos2.x) * 100) / 100 <= 0.005) &&
            (Math.ceil(Math.abs(pos.z) * 100) / 100 - Math.ceil(Math.abs(pos2.z) * 100) / 100 <= 0.005));
    }

    refreshMazeSection() {
        this.refeshing = true;
        this.scene.clear();
        this.renderer.render(this.scene, this.camera);
        this.camera.position.set(0, 0, 0)
        this.targetPosition = this.camera.position.clone();
        this.scene.add(this.camera);
        this.offsetX = 0;
        this.cameraX = 0;
        this.refeshing = false;
    }

    MoveCameraToPoint(x, y, z) {
        this.targetPosition = this.camera.position.clone();
        this.targetPosition.z = -z;
        this.targetPosition.y = -y;
        this.targetPosition.x = -x;
    }

    removeEntity(object) {
        scene.clear();
        // renderer.render(scene, gltf.cameras[0]);
    }

    loadMazeSection(obj, offX = 0, offY = 0, asset) {
        var tex = (asset) ? new THREE.TextureLoader().load(asset) : null;
        if (tex)
            tex.flipY = false; // for glTF models.


        let section = obj.scene.clone();
        this.scene.add(section);
        section.traverse(n => {
            if (n.isMesh) {
                // n.castShadow = true;
                // n.receiveShadow = true;
                if (tex && n.material.map) n.material.map = tex;
                // if (n.material.map) n.material.map.anisotropy = 16;
            }
        });
        section.position.y = -1;
        section.position.x = (offX * 2);
        section.position.z = -1 - (offY * 2);

        //renderer.render(scene, gltf.cameras[0]);
    }
    transitionInstructions = [];
    transitionInDirection(dir, callback) {
        let buffer = () => {
            return this.delayed(1500);
        };
        switch (dir) {
            case Maze.North:
                this.transitionInstructions = [].concat(...this.transitions.straight, callback, buffer);
                break;
            case Maze.East:
                this.transitionInstructions = [].concat(...this.transitions.right, callback, buffer);
                break;
            case Maze.West:
                this.transitionInstructions = [].concat(...this.transitions.left, callback, buffer);
                break;
            case Maze.South:
                this.transitionInstructions = [].concat(...this.transitions.uturn, callback, buffer);
                break;
        }
        this.transitionInstructions.push(() => {
            // if (this.py + maxFlashlightRadius / 2 > window.innerHeight / 2)
            //     this.py -= 20;

            this.flashlightOn = true;
            this.cameraX = 0;
            this.offsetX = 0;
            this.camera.position.set(0, 0, 0);
            this.targetPosition.set(0, 0, 0);
            return this.delayed(500);

        });
    }

    renderPlayerHUD(player, time, CTX, screen) {
        screen.player = player;
        let tVal = player.maze.getTileValue(player.x, player.y);
        let block = 10;
        // if (this.lastPos.x != this.x || this.lastPos.y != this.y)
        //this.renderTileView(CTX, screen, tVal);

        if (player.triggeredSighting && player.maze.level >= 2) {
            player.stepsSinceSighting = 0;
            if (player.thingPosition == 0) {

                this.renderThingPosition1(CTX, screen);
                if (!player.playingSound) {
                    player.playingSound = true;
                    player.AudioMixer.playThingRoar(1, 2, () => {
                        player.triggeredSighting = false;
                        player.playingSound = false;
                        player.thingPosition++;
                    });
                }
            } else {
                this.renderThingPosition1(CTX, screen);
                if (!player.playingSound) {
                    player.playingSound = true;
                    player.AudioMixer.playThingRoar(0, 2, () => {
                        player.triggeredSighting = false;
                        player.playingSound = false;
                        player.thingPosition = 0;
                    });
                }
            }
        }

        for (let i = 0; i < player.lightBattery / 10; i++) {
            let color;
            if (i < 2)
                color = "red";
            else if (i >= 5)
                color = "green";
            else
                color = "yellow";
            this.drawBlock(CTX, color, 0, screen.height - (20 + (i * 20)), 20);
        }

        if (!player.inMenu && (player.hasMap && player.mapType == 1)) {
            this.renderMap(CTX, (10 * block), (10 * block), { w: screen.width, h: screen.height, block: block, x: player.x, y: player.y }, player.maze, player.orientation, map_colors);
        }
        else if (!player.inMenu && (player.hasMap)) {
            this.renderMap(CTX, (10 * block), (10 * block), { w: screen.width, h: screen.height, block: block, x: player.x, y: player.y }, player.map, player.orientation, map_colors);
        } if (!player.inMenu)
            this.renderUserItems(screen);
        if (player.strobed) {
            let secondsPassed = Math.trunc(player.strobeTime++ / 2);
            if (secondsPassed < 7) {
                this.renderStrobe(CTX, screen, 8 - (secondsPassed + 1));
            } else {
                this.renderStrobe(CTX, screen, 8);
            }
        } else if (!player.strobed && player.strobeTime > 0) {
            let secondsPassed = Math.trunc((player.strobeTime > 200 ? player.strobeTime -= 100 : player.strobeTime--) / 2);
            if (secondsPassed < 7) {
                this.renderStrobe(CTX, screen, secondsPassed + 1);
                player.resetAttackStates();
            } else {
                this.renderStrobe(CTX, screen, 8);
            }
        }
        // this.generateCharacterView(CTX);
        // CTX.fillStyle = "green";
        // CTX.fillRect(this.x * blockSize, this.y * blockSize, blockSize, blockSize)
    }
    flashlightOn = true;
    // setTimeout(() => MoveCameraToPoint(0, 0, 2), 5000);
    update3DAssets(CTX, screen) {
        this.updateRenderSize(window.innerWidth, window.innerHeight);
        this.rotationX = (screen.pX / window.innerWidth) - .5;
        //offsetY = (Y / (h / 2)) - .5;   
        // requestAnimationFrame(() => this.update3DAssets(CTX, screen));
        this.px = screen.pX;
        this.py = screen.pY;
        this.clearScreen(CTX);
        this.renderFlashLight(CTX, screen, this.flashlightOn);
        if (this.refeshing)
            return;
        // this.cameraX += .02;
        if (!this.cameraInPosition()) {
            if (this.offsetX < this.cameraX - .05)
                this.offsetX += this.smoothness / 2
            else if (this.offsetX > this.cameraX + .05)
                this.offsetX -= this.smoothness / 2
        }

        this.camera.rotation.y = -this.rotationX + this.offsetX;
        this.camera.rotation.x = -this.offsetY - this.offsetY;

        if (this.transitionInstructions.length > 0) {
            this.inTransition = true;
            if (this.transitionInstructions[0]())
                this.transitionInstructions.shift();
        }
        else
            this.inTransition = false;
        this.camera.position.lerp(this.targetPosition, this.smoothness);
        this.renderer.render(this.scene, this.camera);
    }


    player
    MazeSections = {};
    RLoader = null;

    loadLevelAssets() {

        return Promise.all(this.RLoader.getAssetsForLevel(0).map((section) => {
            return this.RLoader.load3DAsset(section.location).then(obj => {
                return Promise.resolve({ name: section.name, obj: obj });
            })
        })).then(items => {
            items.forEach(item => {
                this.MazeSections[item.name] = item.obj;
            });
        })

    }

    constructor(player) {
        let assets = new ResourceLoader(this.assets);
        this.RLoader = assets;
        new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.add(new THREE.PointLight(0xdd9c22, 1.3));
        this.targetPosition = this.camera.position.clone();
        screen.player = player;

        // setInterval(() => {
        //     this.cameraX += Math.PI;
        // }, 3500);

    }
};