const AssetsFolder = "./assets";
const RESOURCESCONTAINER = resources;
import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js';
const manager = new THREE.LoadingManager();
let log = (stuff) => {
    // if (document.getElementById("stuff") != null)
    //     document.getElementById("stuff").innerHTML = stuff;
    // else
    //     console.log(stuff);
}
manager.onStart = function (url, itemsLoaded, itemsTotal) {

    log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

};

manager.onLoad = function () {

    log('Loading complete!');

};

manager.onProgress = function (url, itemsLoaded, itemsTotal) {

    log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

};

manager.onError = function (url) {

    log('There was an error loading ' + url);

};

const loader = new GLTFLoader(manager);
const FirstStageAssets = [
    { name: "right", location: "./assets/models/right.gltf" },
    { name: "left", location: "./assets/models/left.gltf" },
    { name: "straight", location: "./assets/models/straight.gltf" },
    { name: "t", location: "./assets/models/t.gltf" },
    { name: "t_right", location: "./assets/models/t_right.gltf" },
    { name: "t_left", location: "./assets/models/t_left.gltf" },
    { name: "4w", location: "./assets/models/4w.gltf" },
    { name: "dead", location: "./assets/models/dead.gltf" },
    { name: "puzzel_end", location: "./assets/models/puzzel_end.gltf" },
    { name: "supply_end", location: "./assets/models/supply_end.gltf" },
];

export class ResourceLoader {

    resources = {};
    loadImageResources = () => {
        for (let assetName in this.resources) {
            let img = document.createElement("img");
            img.setAttribute("src", this.resources[assetName]);
            document.getElementById(RESOURCESCONTAINER.appendChild(img));
            this.resources[assetName] = img;
        }
        return this.resources;
    }

    cacheImageResources() {
        let operations = [];
        for (let assetName in this.resources) {
            // if (window.localStorage.getItem("resources_" + assetName) === null)
            operations.push(new Promise((res, rej) => {
                let success = () => {
                    this.resources[assetName].removeEventListener("load", success);
                    res();

                };
                let fail = () => {
                    this.resources[assetName].removeEventListener('error', fail)
                    rej();

                };
                this.resources[assetName].addEventListener("load", success);
                this.resources[assetName].addEventListener('error', fail)
            }));
        }

        return Promise.all(operations).then(() => {
            console.log("Cache Images!");
            for (let assetName in this.resources) {
                let img = this.resources[assetName];
                let imgz = this.getBase64Image(img);
                img.setAttribute("src", imgz);
                // window.localStorage.setItem("resources_" + assetName, imgz);
            }
        });

    }

    getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        return dataURL//.replace(/^data:image\/(png|jpg);base64,/, "");
        // CREDIT: https://stackoverflow.com/questions/22172604/convert-image-url-to-base64
    }

    get resourceObject() {
        return this.resources;
    }

    sortAssets(assets) {
        console.log("DONE!!!")
        assets = assets.map((gltf, index) => {
            gltf.name = index + "obj";
            return gltf;
        });
        // GameAssets = [].concat(...assets);
        // console.log(assets[slot])
        // loadMazeSection(assets[slot]);
        // update();

    }
    load3DAsset(asset) {
        return new Promise((res, rej) => {
            loader.load(asset, function (gltf) {
                res(gltf)
            }, undefined, function (error) {
                console.error(error);
                rej(error);
            });

        });
    }


    loadLevelAssets(assets, callback) {
        Promise.all(assets.map(asset => {
            return new Promise((res, rej) => {
                this.load3DAsset(asset.location).then((gltf) => {
                    asset.location = gltf;
                    res(asset);
                }, rej)
            });
        })).then(results => {
            callback(results.reduce((assets, asset)=>{
                assets[asset.name] = asset.location;
                return assets;
            }, {}))
        });
    }

    getAssetsForLevel(levelNum) {
        let assets = [];
        switch (levelNum) {
            default:
                assets = [].concat(...FirstStageAssets);
        }
        return assets;
    }

    constructor(resourceList, level = 1) {
        this.resources = resourceList;
        this.loadImageResources();
        //this.cacheImageResources();
    }

}