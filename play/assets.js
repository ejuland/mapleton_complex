const AssetsFolder = "./assets";
const RESOURCESCONTAINER = resources;
let ResourceLoader = class {

    resources = {};
    loadImageResources = () => {
        for (let assetName in this.resources) {
            let img = document.createElement("img");
            img.setAttribute("src",  this.resources[assetName] );
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
                let imgz =  this.getBase64Image(img);
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

    constructor(resourceList) {
        this.resources = resourceList;

        this.loadImageResources();
        //this.cacheImageResources();
    }

}