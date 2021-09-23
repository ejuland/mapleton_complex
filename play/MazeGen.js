export const North = "N";
export const South = "S";
export const East = "E";
export const West = "W";
export const Directions = [North, South, East, West];

export const Destination = 1;
export const Straight = 2;
export const Traveled = 3;
export const Corner = 4;
export const Left = 5;
export const Fork = 6;
export const Intersection = 7;
export const Barrier = 8;
export const Solution = 9;
export const Deadend = 10;

export const OpenDoorEnd = 20;
export const ClosedDoorEnd = 21;
export const KeyEnd = 22;
export const NoteEnd = 23;
export const SupplyEnd = 24;
export const OpenSupplyEnd = 25;
export const PuzzelEnd = 26;
export const EmptyKeyEnd = 27;
export const LevelStart = 28;
export const LevelLoading = 29;
export const PlayerStart = 30;

export const getRandomNumber = (max) => {
    return Math.floor(Math.random() * max)
}
export const N = (y) => {
    let newY = y - 1;
    return newY;
}

export const S = (y) => {
    let newY = y + 1;

    return newY;
}
export const E = (x) => {
    let newX = x + 1;

    return newX;
}
export const W = (x) => {
    let newX = x - 1;

    return newX;
}

export const DirMap = (function () {
    let directions = {};
    directions[North] = N;
    directions[South] = S;
    directions[East] = E;
    directions[West] = W;
    return directions;
}());

export const Orientations = [North, South, East, West];
export const getOrientation = direction => {
    return Orientations.indexOf(direction);
}

export const isAdjacentDirection = (directions) => {
    return (directions[North] && directions[West]) ||
        (directions[South] && directions[East]) ||
        (directions[South] && directions[West]) ||
        (directions[North] && directions[East]);
}

export const Paths = [Traveled, Straight, Fork, Corner, Intersection];
export const Ends = [OpenDoorEnd, ClosedDoorEnd, KeyEnd, PuzzelEnd, NoteEnd, SupplyEnd, Deadend, EmptyKeyEnd, PlayerStart]
export const Blocking = [Barrier].concat(...Paths);
export const Destinations = [KeyEnd, EmptyKeyEnd, SupplyEnd, OpenDoorEnd, ClosedDoorEnd, PuzzelEnd, OpenSupplyEnd]

export class MazeGenerator {

    /*
     * CONFIG FILE:
     * Paths
     * Puzzels
     * MaxDistance
     */

    maze = [];
    maze_perimiter = 0;
    solutionPath = [];

    generateEmptyMatrix(max_distance) {
        this.maze_perimiter = max_distance * 4 + 1;
        this.maze = new Array(this.maze_perimiter);
        for (let i = 0; i < this.maze.length; i++) {
            this.maze[i] = new Array(this.maze_perimiter);
            for (let col = 0; col < this.maze[i].length; col++)
                this.maze[i][col] = 0;
        }
        this.center_x = (this.maze_perimiter - 1) / 2 //getRandomNumber(this.maze_perimiter - 1);
        this.center_y = (this.maze_perimiter - 1) / 2//getRandomNumber(this.maze_perimiter - 1);
        this.maze[this.center_y][this.center_x] = ClosedDoorEnd;
        this.solutionPath = [];
    };

    generateBarriers(complexity = 5) {
        let maxBarries = Math.floor(Math.pow(this.maze_perimiter, 2) * (complexity / 100));
        let max_attempts = Math.pow(this.maze_perimiter, 2);
        let attempt = 0;
        let barriers = [];
        while (barriers.length < maxBarries && ++attempt < max_attempts) {
            let X = getRandomNumber(this.maze_perimiter)
            let Y = getRandomNumber(this.maze_perimiter)
            if (this.getTileValue(X, Y) == 0 && this.neighbouringType(X, Y, (x, y) => {
                return this.getTileValue(x, y) == Barrier || this.isPath(this.getTileValue(x, y)) || this.isEnd(this.getTileValue(x, y))
            }) == 0 && this.cornerType(X, Y, (x, y) => {
                return this.getTileValue(x, y) == Barrier || this.isPath(this.getTileValue(x, y)) || this.isEnd(this.getTileValue(x, y))
            }) == 0) {
                barriers.push({ x: X, y: Y });
                this.maze[Y][X] = Barrier;
            }
        }
        if (attempt >= max_attempts) {
        }

        for (let i in barriers) {
            let b = barriers[i];
            this.maze[b.y][b.x] = Barrier;
        }

    }

    getTileValue(x, y) {
        if (!this.isValidCoord(x, y))
            return -1;
        return this.maze[y][x];
    }

    setTileValue(x, y, value) {
        if (!this.isValidCoord(x, y))
            return -1;
        this.maze[y][x] = value;
    }

    center_x = 0;
    center_y = 0;

    get center() {
        return { x: this.center_x, y: this.center_y };
    }

    isValidCoord(x, y) {
        if (x < 0 || x >= this.maze_perimiter)
            return false;
        if (y < 0 || y >= this.maze_perimiter)
            return false;
        return true;
    }

    isBlocking(type) {
        return Blocking.indexOf(type) >= 0;
    }
    isEnd(type) {
        return Ends.indexOf(type) >= 0;
    }

    isPath(type) {
        return Paths.indexOf(type) >= 0;
    }

    connectPoint(point1, point2) {

    }

    spawns = [];

    neighbouringType(x, y, filter) {

        let spacesUsed = 0;
        for (let direction = 0; direction < 4; direction++) {
            let dirPoint = this.pointFromIndex(direction, { x: x, y: y });
            if (filter(dirPoint.x, dirPoint.y))
                spacesUsed++;
        }
        return spacesUsed;
    }

    cornerType(x, y, filter) {

        let spacesUsed = 0;
        for (let direction = 0; direction < 2; direction++) {
            for (let directionx = 0; directionx < 2; directionx++) {
                let dirPoint = this.pointFromIndex(directionx + 2, this.pointFromIndex(direction, { x: x, y: y }));
                // this.setTileValue(dirPoint.x, dirPoint.y, KeyEnd);
                if (filter(dirPoint.x, dirPoint.y))
                    spacesUsed++;
            }
        }
        return spacesUsed;
    }

    getCorners(x, y) {

        let spacesUsed = 0;
        let index = [];
        for (let direction = 0; direction < 2; direction++) {
            for (let directionx = 0; directionx < 2; directionx++) {
                let dirPoint = this.pointFromIndex(directionx + 2, this.pointFromIndex(direction, { x: x, y: y }));
                // this.setTileValue(dirPoint.x, dirPoint.y, KeyEnd);
                if (this.isPath(this.getTileValue(dirPoint.x, dirPoint.y)) || this.isEnd(this.getTileValue(dirPoint.x, dirPoint.y)))
                    index.push(spacesUsed);
                spacesUsed++;
            }
        }
        return index;
    }

    getNeighbours(x, y) {
        let spacesUsed = 0;
        for (let direction = 0; direction < 4; direction++) {
            let dirPoint = this.pointFromIndex(direction, { x: x, y: y });
            if (this.isPath(this.getTileValue(dirPoint.x, dirPoint.y)))
                spacesUsed++;
        }
        return spacesUsed;
    }
    spaceFree(x, y, tolerance = 6) {
        let spacesUsed = this.getNeighbours(x, y);
        let neighboursUsed = 0;
        for (let direction = 0; direction < 2; direction++) {
            for (let directionx = 0; directionx < 2; directionx++) {
                let dirPoint = this.pointFromIndex(directionx + 2, this.pointFromIndex(direction, { x: x, y: y }));
                // this.setTileValue(dirPoint.x, dirPoint.y, KeyEnd);
                if (this.isPath(this.getTileValue(dirPoint.x, dirPoint.y)))
                    neighboursUsed++;
            }
        }
        if (spacesUsed >= 2 && neighboursUsed > 1)
            return false;
        if (spacesUsed == 4 && neighboursUsed > 0)
            return false;
        if ((spacesUsed + neighboursUsed) > tolerance)
            return false;
        return true;
    }

    getAvaliablePaths(x, y) {
        let paths = {};

        let point = this.pointFromIndex(0, { x: x, y: y });
        paths[North] = this.isPath(this.getTileValue(point.x, point.y)) || this.isEnd(this.getTileValue(point.x, point.y));

        point = this.pointFromIndex(1, { x: x, y: y });
        paths[South] = this.isPath(this.getTileValue(point.x, point.y)) || this.isEnd(this.getTileValue(point.x, point.y));

        point = this.pointFromIndex(2, { x: x, y: y });
        paths[East] = this.isPath(this.getTileValue(point.x, point.y)) || this.isEnd(this.getTileValue(point.x, point.y));

        point = this.pointFromIndex(3, { x: x, y: y });
        paths[West] = this.isPath(this.getTileValue(point.x, point.y)) || this.isEnd(this.getTileValue(point.x, point.y));

        return paths;
    }

    getUnavaliablePaths(x, y) {
        let paths = {};

        let point = this.pointFromIndex(0, { x: x, y: y });
        paths[North] = !(this.isPath(this.getTileValue(point.x, point.y)) || this.isEnd(this.getTileValue(point.x, point.y)));

        point = this.pointFromIndex(1, { x: x, y: y });
        paths[South] = !(this.isPath(this.getTileValue(point.x, point.y)) || this.isEnd(this.getTileValue(point.x, point.y)));

        point = this.pointFromIndex(2, { x: x, y: y });
        paths[East] = !(this.isPath(this.getTileValue(point.x, point.y)) || this.isEnd(this.getTileValue(point.x, point.y)));

        point = this.pointFromIndex(3, { x: x, y: y });
        paths[West] = !(this.isPath(this.getTileValue(point.x, point.y)) || this.isEnd(this.getTileValue(point.x, point.y)));

        return paths;
    }

    fillSpawn(index, center) {
        let point = this.pointFromIndex(index, center);
        switch (index) {
            case 0:
                this.maze[point.y][point.x] = SupplyEnd;
                this.maze[N(point.y)][point.x] = Traveled;
                this.spawns.push({ orientation: North, coord: { x: point.x, y: point.y } })
                break;
            case 1:
                this.maze[point.y][point.x] = SupplyEnd;
                this.maze[S(point.y)][point.x] = Traveled;
                this.spawns.push({ orientation: South, coord: { x: point.x, y: point.y } })
                break;
            case 2:
                this.maze[point.y][point.x] = SupplyEnd;
                this.maze[point.y][E(point.x)] = Traveled;
                this.spawns.push({ orientation: East, coord: { x: point.x, y: point.y } })
                break;
            case 3:
                this.maze[point.y][point.x] = SupplyEnd;
                this.maze[point.y][W(point.x)] = Traveled;
                this.spawns.push({ orientation: West, coord: { x: point.x, y: point.y } })
                break;
        }
    }

    buildSpawnsAroundPoint(point, spots) {
        for (let i = 0; i < spots; i++)
            this.fillSpawn(i, point);
    }

    pointFromIndex(index, center) {
        let point = { x: center.x, y: center.y };
        switch (index) {
            case 0:
                point.y = N(point.y);
                break;
            case 1:
                point.y = S(point.y);
                break;
            case 2:
                point.x = E(point.x);
                break;
            case 3:
                point.x = W(point.x);
                break;
        }
        return point;
    }

    setupSpawns(players) {
        if (players <= 4)
            this.buildSpawnsAroundPoint({ x: this.center_x, y: this.center_y }, players);
        else
            for (let i = 0; i < Math.ceil(players / 4); i++) {
                this.buildSpawnsAroundPoint({ x: (this.center_x + (Math.ceil(players / 4) * 4) / 2) - (i * 4), y: this.center_y }, (players - i * 4) % 4 == 0 ? players : players - i * 4);
            }
    }

    getTopSpawnY() {
        return this.spawns.reduce((res, spawn) => {
            if (spawn.coord.y < res)
                return spawn.coord.y;
            return res;
        }, this.maze_perimiter);
    }
    getBottomSpawnY() {
        return this.spawns.reduce((res, spawn) => {
            if (spawn.coord.y > res)
                return spawn.coord.y;
            return res;
        }, 0);
    }
    getLeftSpawn() {
        return this.spawns.reduce((res, spawn) => {
            if (spawn.coord.x < res)
                return spawn.coord.x;
            return res;
        }, this.maze_perimiter);
    }
    getRightSpawn() {
        return this.spawns.reduce((res, spawn) => {
            if (spawn.coord.x > res)
                return spawn.coord.x;
            return res;
        }, 0);
    }

    basePaths = [];
    getBasePaths() {
        this.basePaths = this.getTilesWithValue(Traveled);
    }
    connectSpawns() {
        let topY = this.getTopSpawnY() - 1;
        let bottomY = this.getBottomSpawnY() + 1;
        let leftX = this.getLeftSpawn();
        let rightX = this.getRightSpawn();
        let base = [];
        if (this.spawns.length <= 2) {
            if (this.spawns.length <= 1)
                bottomY += 2;
            leftX -= 2;
            rightX += 2
            for (let y = this.spawns[0].coord.y; y <= bottomY; y++) {

                this.setTileValue(leftX, y, Traveled);
            }
        }

        let middle = this.spawns.filter(spawn => spawn.coord.y != topY + 1 && spawn.coord.y != bottomY - 1).forEach(spawn => {
            let newPos = this.pointFromIndex(getOrientation(spawn.orientation), spawn.coord);
            for (let y = newPos.y; y >= topY; y--)
                this.setTileValue(newPos.x, y, Traveled);
            for (let y = newPos.y; y <= bottomY; y++)
                this.setTileValue(newPos.x, y, Traveled);
        });
        let top = this.spawns.filter(spawn => spawn.coord.y == topY + 1 && spawn.coord.y != bottomY - 1).forEach(spawn => {
            let newPos = this.pointFromIndex(getOrientation(spawn.orientation), spawn.coord);
            for (let x = newPos.x; x >= leftX; x--)
                this.setTileValue(x, newPos.y, Traveled);
            for (let x = newPos.x; x <= rightX; x++)
                this.setTileValue(x, newPos.y, Traveled);
        });
        let bottom = this.spawns.filter(spawn => spawn.coord.y != topY + 1 && spawn.coord.y == bottomY - 1).forEach(spawn => {
            let newPos = this.pointFromIndex(getOrientation(spawn.orientation), spawn.coord);
            for (let x = newPos.x; x >= leftX; x--)
                this.setTileValue(x, newPos.y, Traveled);
            for (let x = newPos.x; x <= rightX; x++)
                this.setTileValue(x, newPos.y, Traveled);
        });



    }



    makeBranch(pos, iterations = 3, iteration = 0) {
        if (iteration > iterations)
            return true;
        if (this.isPath(this.getTileValue(pos.x, pos.y)))
            return true;
    }

    avaliableToIndexes(avaliable) {
        let index = [];
        if (avaliable[North])
            index.push(0)
        if (avaliable[South])
            index.push(1)
        if (avaliable[East])
            index.push(2)
        if (avaliable[West])
            index.push(3)
        return index;
    }
    avaliableToDirections(avaliable) {
        let index = [];
        if (avaliable[North])
            index.push(North)
        if (avaliable[South])
            index.push(South)
        if (avaliable[East])
            index.push(East)
        if (avaliable[West])
            index.push(West)
        return index;
    }

    createBranches(point, iterations = this.level > 5 ? this.level * 2 : this.level, iteration = 0) {
        if (iteration > iterations)
            return true;
        let avaliable = this.avaliableToIndexes(this.getUnavaliablePaths(point.x, point.y));
        if (avaliable.length <= 0)
            return true;
        let dir, newpoint;

        do {
            let index = getRandomNumber(avaliable.length);
            dir = avaliable[index];
            avaliable.splice(index, 1);
            newpoint = this.pointFromIndex(dir, point)
        } while (!this.canPlaceTile(newpoint.x, newpoint.y) && avaliable.length > 0)
        if (this.canPlaceTile(newpoint.x, newpoint.y)) {
            this.setTileValue(newpoint.x, newpoint.y, Traveled);
            newpoint = this.createPathInDirection(newpoint, dir);
            avaliable = this.avaliableToIndexes(this.getUnavaliablePaths(point.x, point.y))
            this.setTileValue(newpoint.x, newpoint.y, Traveled);
            //setTimeout(() => {
            for (let i in avaliable) {
                let p = this.pointFromIndex(avaliable[i], newpoint);
                if (this.canPlaceTile(p.x, p.y)) {
                    this.setTileValue(p.x, p.y, Traveled);
                    this.createBranches(p, iterations, iteration + 1);
                }
            }
            //})

        } else
            return false;

    }
    players = 0;
    generateMaze(levelData) {
        // for (let i = 0; i < levelData.players; i++)
        //     this.createBranch(this.basePaths[getRandomNumber(this.basePaths.length)], levelData.level * 2);
        this.level = levelData.level;
        this.players = levelData.players;
        while (this.basePaths.length > 0) {
            let index = getRandomNumber(this.basePaths.length);
            let item = this.basePaths.splice(index, 1)[0];
            this.createBranches(item);
        }
        this.filterMaze((x, y) => {
            if (this.neighbouringType(x, y, (X, Y) => { return this.isPath(this.getTileValue(X, Y)) || this.isEnd(this.getTileValue(X, Y)); }) == 1 && this.getTileValue(x, y) == Traveled)
                this.setTileValue(x, y, Deadend);
            else if (this.getTileValue(x, y) != 0 && this.getTileValue(x, y) != Barrier)
                this.setTileValue(x, y, Traveled);
        });



    }

    plotMaze() {
        let pathCoords = [];
        for (let y = 0; y < this.maze_perimiter; y++)
            for (let x = 0; x < this.maze_perimiter; x++) {
                if (this.getTileValue(x, y) == Traveled)
                    pathCoords.push({ x: x, y: y });
            }

        pathCoords.map(tile => {
            let x = tile.x;
            let y = tile.y;

            this.plotCoord(x, y)

        });
        return true;
    }

    plotCoord(x, y) {
        let neighbors = [];
        neighbors = (this.neighbouringType(x, y, (x, y) => {
            let tVal = this.getTileValue(x, y);
            return tVal == this.isPath(tVal) || tVal == this.isEnd(tVal);
        }));

        let avaliable = this.getAvaliablePaths(x, y);
        neighbors = this.avaliableToIndexes(avaliable).length;
        if (neighbors == 4) {
            this.setTileValue(x, y, Intersection)
        }
        else if (neighbors == 2) {
            if ((avaliable[East] && avaliable[North]) ||
                (avaliable[East] && avaliable[South]) ||
                (avaliable[West] && avaliable[North]) ||
                (avaliable[West] && avaliable[South]))
                this.setTileValue(x, y, Corner)
        }



        // detect a fork in the path
        neighbors = this.avaliableToIndexes(this.getUnavaliablePaths(x, y));
        if (neighbors.length == 1) {
            this.setTileValue(x, y, Fork);
        }
    }

    setup(levelData) {
        this.level = levelData.level;
        let xOff = 4;
        let yOff = -4;
        this.setupSpawns(Math.ceil(levelData.players / 4) * 4);
        this.connectSpawns();
        this.getBasePaths();
        if (levelData.level >= 3) {
            this.generateBarriers(50 - (levelData.level - 3) * 10);
        }
        this.generateMaze(levelData);


        let deadEnds = this.getTilesWithValue(Deadend);
        let puzzels = (levelData.level * 2);
        let limit = (levelData.level <= 3) ? deadEnds.length - levelData.level < (puzzels + 1) * 2 : deadEnds.length - levelData.players < (puzzels + 1);
        if (limit) {
            this.generateEmptyMatrix(this.max_distance, levelData.players);
            return this.setup(levelData);
        }
        this.plotMaze();

        let endings = [];
        for (let i = 0; i < puzzels; i++) {
            if (i >= puzzels / 2) {
                endings.push(PuzzelEnd);
            } else {
                endings.push(KeyEnd);
            }
        }
        for (let i = 0; i < levelData.level; i++)
            endings.push(SupplyEnd);
        endings.push(ClosedDoorEnd);
        endings.push(PlayerStart);
        endings.push(NoteEnd);
        while (endings.length > 0 && deadEnds.length > 0) {
            let index = getRandomNumber(deadEnds.length);
            let item = deadEnds[index];
            deadEnds.splice(index, 1);

            let endindex = getRandomNumber(endings.length);
            let enditem = endings[endindex];
            endings.splice(endindex, 1)[0];
            this.setTileValue(item.x, item.y, enditem);
        }

        deadEnds = this.getTilesWithValue(Deadend)
        deadEnds.forEach((end, index) => {
            if (index % this.level == 0)
                this.setTileValue(end.x, end.y, SupplyEnd);

        });


        //this.setTileValue(this.center_x + xOff, this.center_y + yOff, Intersection);
    }

    constructor(dat, empty = false) {
        this.max_distance = 1 + (dat.level * 2) * Math.ceil(dat.players / 4);
        this.generateEmptyMatrix(this.max_distance, dat.players);
        if (!empty) {
            this.setup(dat);
        } else {
            this.setTileValue(this.center_x, this.center_y, 0);
        }
    }

    canPlaceTile(X, Y) {
        if (!this.isValidCoord(X, Y) || this.isPath(this.getTileValue(X, Y)) || this.isEnd(this.getTileValue(X, Y)))
            return false;
        let neighbours = this.neighbouringType(X, Y, (x, y) => {
            return this.isPath(this.getTileValue(x, y)) || this.isEnd(this.getTileValue(x, y))
        });

        let corners = this.cornerType(X, Y, (x, y) => {
            return this.isPath(this.getTileValue(x, y)) || this.isEnd(this.getTileValue(x, y))
        });

        if (neighbours >= 4 && corners > 0)
            return false;
        if (neighbours == 3 && corners > 2)
            return false;
        if (neighbours == 3 && corners >= 2) {
            let corner = this.getCorners(X, Y);
            let I = (num) => corner.indexOf(num) >= 0;
            let unavaliable = this.getUnavaliablePaths(X, Y);
            return (unavaliable[South] && I(3) && I(2)) ||
                (unavaliable[West] && I(1) && I(3)) ||
                (unavaliable[North] && I(1) && I(0)) ||
                (unavaliable[East] && I(0) && I(2))

        }
        if (neighbours == 2) {
            let corner = this.getCorners(X, Y);
            let I = (num) => corner.indexOf(num) >= 0;
            let unavaliable = this.getUnavaliablePaths(X, Y);
            let avaliable = this.getAvaliablePaths(X, Y);
            if ((unavaliable[North] && unavaliable[South]) || (unavaliable[East] && unavaliable[West]))
                return true;
            if (corners >= 3)
                return false;
            if (
                (avaliable[North] && avaliable[West] && I(1)) ||
                (avaliable[North] && avaliable[East] && I(0)) ||
                (avaliable[South] && avaliable[West] && I(3)) ||
                (avaliable[South] && avaliable[East] && I(2))) {
                return false;
            }

        }

        return true;
    }
    createPathInDirection(pos, dir) {


        let newPos = this.pointFromIndex(dir, pos);
        let length = 0;
        let maxLength = Math.floor(this.level / 5) + 3;
        let X = newPos.x;
        let Y = newPos.y;
        let oldPos = pos;
        while (this.canPlaceTile(X, Y) && ++length < maxLength) {
            this.setTileValue(X, Y, Traveled);
            oldPos = newPos;
            newPos = this.pointFromIndex(dir, newPos);
            X = newPos.x;
            Y = newPos.y;
        };
        return oldPos;
    }

    getTilesWithValue(filterValue) {
        let ends = [];
        for (let y = 0; y < this.maze.length; y++)
            for (let x = 0; x < this.maze.length; x++) {
                if (this.getTileValue(x, y) == filterValue)
                    ends.push({ x: x, y: y });
            }
        return ends.reduce((filtered, item) => {
            if (!filtered.some(filteredItem => JSON.stringify(filteredItem) == JSON.stringify(item)))
                filtered.push(item)
            return filtered
        }, [])
    }

    filterMaze(filter = () => true) {
        let ends = [];
        for (let y = 0; y < this.maze.length; y++)
            for (let x = 0; x < this.maze.length; x++) {
                if (filter(x, y))
                    ends.push({ x: x, y: y });
            }
        return ends.reduce((filtered, item) => {
            if (!filtered.some(filteredItem => JSON.stringify(filteredItem) == JSON.stringify(item)))
                filtered.push(item)
            return filtered
        }, [])
    }

    get perimiter() {
        return this.maze_perimiter;
    }
    get matrix() {
        return this.maze;
    }
};