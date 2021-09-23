const Strobe = 1;
const Salt = 2;
const Key = 3;
const Note = 4;
const MapItem = 5;
const FreeHand = 0;


let ItemsManager = class {
    maze = null;
    player = null;

    /*Item Management*/

    inSupplyMenu = false;
    supplyItem = 0;
    openSupplyScreen(itemIndex, CTX) {
        this.player.canMove = false;
        this.player.inMenu = true;
        this.player.maze.setTileValue(this.player.x, this.player.y, OpenSupplyEnd);
        this.inSupplyMenu = true;
        this.supplyItem = itemIndex;
        document.getElementById("item-1").src = RenderEngine.assets.strobe_item.src;
        document.getElementById("item-2").src = RenderEngine.assets.map_item.src;

    }

    closeSupplyScreen() {
        this.player.inMenu = false;
        this.player.canMove = true;
        this.inSupplyMenu = false;
        this.player.maze.setTileValue(this.player.x, this.player.y, SupplyEnd);
    }

    setPlayerItem(index, val) {
        if (index == 1) {
            this.player.item1 = val;
        } else {
            this.player.item2 = val;
        }
    }

    usingItem = false;
    useItem(item, itemIndex, CTX) {
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
                case SupplyEnd:
                    this.game.openChoiceMenu([{ id: Strobe, des: RenderEngine.assets.strobe_item.src }, { id: MapItem, des: RenderEngine.assets.map_item.src }], true, (res) => {
                        let val = parseInt(res[0]);
                        if (val == MapItem)
                            if (getRandomNumber(100) == 66 && this.player.superMaps < 5) {
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
                case KeyEnd:
                    this.setPlayerItem(itemIndex, Key);
                    this.maze.setTileValue(this.player.x, this.player.y, EmptyKeyEnd)
                    break;
                case NoteEnd:
                    this.setPlayerItem(itemIndex, Note);
                    this.maze.setTileValue(this.player.x, this.player.y, Deadend)
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
                let coord = this.maze.getTilesWithValue(Deadend)[0];
                this.maze.setTileValue(coord.x, coord.y, NoteEnd);
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
            }, getRandomNumber(10) * 100)

            this.player.strobed = true;
            AudioMixer.playStrobe(() => {
                this.player.strobed = false;
                this.usingItem = false;
                this.setPlayerItem(itemIndex, FreeHand);
            });
        }

        if (item == Key && tVal == PuzzelEnd) {
            this.game.puzzelManager.getPuzzel(this.player.x, this.player.y).beginPuzzel(() => {
                this.usingItem = false;
                this.setPlayerItem(itemIndex, FreeHand);
                let coord = this.maze.getTilesWithValue(Deadend)[0];
                this.maze.setTileValue(coord.x, coord.y, KeyEnd);
            }, () => {
                this.setPlayerItem(itemIndex, FreeHand);
                let coord = this.maze.getTilesWithValue(EmptyKeyEnd)[0];
                this.maze.setTileValue(coord.x, coord.y, KeyEnd);
            });
        }
    }

    canUseItem(item) {
        let tVal = this.maze.getTileValue(this.player.x, this.player.y);
        if (item == FreeHand) {
            return tVal == SupplyEnd || tVal == KeyEnd || tVal == NoteEnd;
        }

        if (item == Note && this.player.reading)
            return true;

        if (item == Key)
            return this.maze.getTileValue(this.player.x, this.player.y) == PuzzelEnd;

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