!function () {
    const SCREEN = document.querySelector("#screen");
    const CTX = SCREEN.getContext("2d");
    let WIDTH, HEIGHT;
    let BLOCK_SIZE = 50;


    const STADIUM_SIZE = {
        w: 15,
        h: 15
    };
    let OFFSET = 0;
    function resize() {
        HEIGHT = document.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
        HEIGHT *= .95;
        WIDTH = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
        WIDTH *= .95;
        SCREEN.setAttribute("width", WIDTH);
        SCREEN.setAttribute("height", HEIGHT);
        BLOCK_SIZE = HEIGHT / STADIUM_SIZE.h;
        OFFSET = (WIDTH - BLOCK_SIZE * STADIUM_SIZE.w) / 2;
        console.log(HEIGHT);
    }
    
    
    let resources = [];
    const ResourceObjects = loadImageResources();
    function loadImageResources() {
        let resourceObjects = resources.map(r => {
            let img = document.createElement("img");
            img.setAttribute("src", r);
            return img;
        });
        resourceObjects.forEach(img => {
            document.getElementById("resources").appendChild(img);
        });
        
        return resourceObjects;
    }
    
    let GAMESTATE = {
        running: true
    }
    
    
    
    function renderImageAsset(image, x, y, w, h) {
        CTX.drawImage(image, x, y, w, h);
    }
    
    
    function pointInBox(px, py, x, y, w, h) {
        let inz = (px >= x && px <= x + w) && (py >= y && py <= y + h);
        return inz;
    }
    
    
    
    /* MAIN GAME LOOP*/
    function GLOOP(time) {
        
    }
    
    function shouldKillGame() {
        return !GAMESTATE.running;
    }
    
    function logKeyDown(e) {
        
        console.log(e.code);
        
    }
    function logKeyUp(e) {
        console.log(e.code);
    }
    
    
    function render(action, shouldTerminate, framesPassed = 0, FPS = 60) {
        let startTime = new Date().getTime();
        
        if (shouldTerminate()) return;
        
        action(framesPassed);
        
        setTimeout(function () {
            let old = startTime;
            let newT = new Date().getTime();
            let diff = newT - old;
            render(action, shouldTerminate, diff % (1000 / FPS));
        }, 10);
    }
    
    // init
    let maze;
    return function(){
        maze = new MazeGenerator({
            paths: 1,
            puzzels: 2,
            difficulty: 10,
            max_distance: 10
        });
        resize();
        render(GLOOP, shouldKillGame);
        document.addEventListener("keydown", logKeyDown);
        document.addEventListener("keyup", logKeyUp);
        window.onresize = resize;
        
    }
}();