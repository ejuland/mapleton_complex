
import Game from "./Game.js"

// if('serviceWorker' in navigator)
//     navigator.serviceWorker.unregister('./service.js');

// navigator.serviceWorker.getRegistrations().then(function (registrations) {
//     for (let registration of registrations) {
//         registration.unregister()
//     }
// })

let oldSession = null;
function startLevel(num = 1) {
    let session = new Game([], num, () => {
        startLevel(num + 1);
    }, () => {
        setTimeout(() => {
            startLevel();
        }, 2000);
    });

    oldSession = session;
}
startLevel();



//This is a huge change