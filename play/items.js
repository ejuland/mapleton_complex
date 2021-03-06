export const Strobe = 1;
export const Salt = 2;
export const Key = 3;
export const Note = 4;
export const MapItem = 5;
export const FreeHand = 0;

import * as Maze from "./MazeGen.js"

export class ItemsManager {
    maze = null;
    player = null;

    /*Item Management*/

    inSupplyMenu = false;
    supplyItem = 0;
    openSupplyScreen(itemIndex, assets, CTX) {
        this.player.canMove = false;
        this.player.inMenu = true;
        this.player.maze.setTileValue(this.player.x, this.player.y, Maze.OpenSupplyEnd);
        this.inSupplyMenu = true;
        this.supplyItem = itemIndex;
        document.getElementById("item-1").src = assets.strobe_item.src;
        document.getElementById("item-2").src = assets.map_item.src;

    }

    closeSupplyScreen() {
        this.player.inMenu = false;
        this.player.canMove = true;
        this.inSupplyMenu = false;
        this.player.maze.setTileValue(this.player.x, this.player.y, Maze.SupplyEnd);
    }

    setPlayerItem(index, val) {
        if (index == 1) {
            this.player.item1 = val;
        } else {
            this.player.item2 = val;
        }
    }

    usingItem = false;
    useItem(item, itemIndex, assets, CTX) {
        if (this.usingItem)
            return;
        if (this.inSupplyMenu) {
            switch (itemIndex) {
                case 1:
                    this.setPlayerItem(this.supplyItem, Strobe);
                    break;
                case 2:
                    this.setPlayerItem(this.supplyItem, MapItem);
                    break;
            }
            AudioMixer.playPickup();
            this.closeSupplyScreen();
            return;
        }
        console.log("Used Item", item);
        let tVal = this.maze.getTileValue(this.player.x, this.player.y);
        if (item == FreeHand) {
            switch (tVal) {
                case Maze.SupplyEnd:
                    this.game.openChoiceMenu([{ id: Strobe, des: assets.strobe_item.src }, { id: MapItem, des: assets.map_item.src }], true, (res) => {
                        let val = parseInt(res[0]);
                        if (val == MapItem)
                            if (Maze.getRandomNumber(100) == 66 && this.player.superMaps < 5) {
                                this.player.superMaps++;
                                this.player.mapType = 1;
                                this.player.hasMap = true;
                                this.setPlayerItem(itemIndex, val);
                            } else {
                                this.player.hasMap = true;
                                this.setPlayerItem(itemIndex, val);

                            }
                        else
                            this.setPlayerItem(itemIndex, val);
                    }, 1);
                    break;
                case Maze.KeyEnd:
                    this.setPlayerItem(itemIndex, Key);
                    this.maze.setTileValue(this.player.x, this.player.y, Maze.EmptyKeyEnd)
                    break;
                case Maze.NoteEnd:
                    this.setPlayerItem(itemIndex, Note);
                    this.maze.setTileValue(this.player.x, this.player.y, Maze.Deadend)
                    break;

            }

        }
        if (item == Note) {
            console.log(this.player.reading);
            if (!this.player.reading) {
                console.log("LETS READ!");
                this.player.note = this.game.puzzelManager.getNote();
                this.player.reading = true;
                console.log(this.player.reading);
            } else {
                console.log("Good Bye!");
                AudioMixer.playTear();
                this.setPlayerItem(itemIndex, FreeHand);
                this.player.reading = false;
                this.player.note = "";
                let coord = this.maze.getTilesWithValue(Maze.Deadend)[0];
                this.maze.setTileValue(coord.x, coord.y, Maze.NoteEnd);
            }
        }

        if (item == MapItem) {
            this.setPlayerItem(itemIndex, FreeHand);
            this.player.hasMap = false;
            this.player.mapType = 0;
            AudioMixer.playTear();
        }

        if (item == Strobe) {

            this.usingItem = true;

            setTimeout(() => {
                this.game.Thing.takeFlash();
            }, Maze.getRandomNumber(10) * 100)

            this.player.strobed = true;
            AudioMixer.playStrobe(() => {
                this.player.strobed = false;
                this.usingItem = false;
                this.setPlayerItem(itemIndex, FreeHand);
            });
        }

        if (item == Key && tVal == Maze.PuzzelEnd) {
            this.game.puzzelManager.getPuzzel(this.player.x, this.player.y).beginPuzzel(() => {
                this.usingItem = false;
                this.setPlayerItem(itemIndex, FreeHand);
                let coord = this.maze.getTilesWithValue(Maze.Deadend)[0];
                this.maze.setTileValue(coord.x, coord.y, Maze.KeyEnd);
            }, () => {
                this.setPlayerItem(itemIndex, FreeHand);
                let coord = this.maze.getTilesWithValue(Maze.EmptyKeyEnd)[0];
                this.maze.setTileValue(coord.x, coord.y, Maze.KeyEnd);
            });
        }
    }

    canUseItem(item) {
        let tVal = this.maze.getTileValue(this.player.x, this.player.y);
        if (item == FreeHand) {
            return tVal == Maze.SupplyEnd || tVal == Maze.KeyEnd || tVal == Maze.NoteEnd;
        }

        if (item == Note && this.player.reading)
            return true;

        if (item == Key)
            return this.maze.getTileValue(this.player.x, this.player.y) == Maze.PuzzelEnd;

        // if (item == Strobe) {
        //     return this.game.Thing.vulnerable;
        // }
    }


    game = null;
    constructor(player, maze, game) {
        this.player = player;
        this.maze = maze;
        this.game = game;
    }
};