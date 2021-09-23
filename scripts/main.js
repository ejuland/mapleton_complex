
import { DBManager } from "./DataManager.js";
import { GameDatabase } from "./GameDatabaseManager.js";

const submit = function () {

    let name = "";
    let session = "";
    let sessionLock = false;
    const DataManager = new GameDatabase();
    function updateQuote() {
        if (!sessionLock)
            return;
        let quote = document.getElementById("quote").value;
        document.getElementById("quote").value = "";
        console.log(players[name], players, name)
        if (players[name].messages == undefined) {
            players[name].messages = [];
        }
        console.log(players[name], players, name)
        players[name].messages.push({
            time: Date.now(),
            message: quote,
            user: name,
        });
        DataManager.updatePlayer(name, players[name]).then(() => {
            console.log(quote);
        }, console.log);
    }

    let players = {};

    document.getElementById("quote").addEventListener("change", updateQuote)
    // document.getElementById("quote").addEventListener("keydown", updateQuote)

    let joiningSession = false;
    window.onbeforeunload = function () {
        DataManager.stopSessionStream(session).then(() => {
            DataManager.removePlayer(name).then(() => {
                sessionLock = false;
                name = "";
                session = "";
                document.getElementById("submit").innerText = "Join Session";
                document.getElementById("text").classList.add("hidden");
            })
        });
        return 'Are you sure you want to leave?';

    };

    let messages = [];
    function update() {
        

    }

    function updateCharacter(character) {
        console.log(character);
        return (update) => {
            console.log(update)
            players[character] = update;
            update();
        };
    }

    function getSessionUpdates(update) {
        console.log(update);
        let messages = [];
        if (update.players) {
            for (let name in update.players)
                if (players[update.players[name]] == undefined) {
                    players[update.players[name]] = {};
                    DataManager.getPlayerDataStream(update.players[name], updateCharacter(update.players[name]));
                }
            for (let name in players)
                if (update.players.indexOf(name) < 0) {
                    delete players[name];
                    DataManager.stopPlayerStream(name);
                }
        }



        console.log(players);

    }

    return () => {

        if (!sessionLock) {
            sessionLock = true;
            name = document.getElementById("name").value;
            session = document.getElementById("session").value;
            let joined = Date.now()
            joiningSession = true;
            DataManager.createPlayer(name, { joined: joined, session: session, messages: [] }).then((d) => { console.log(d); return DataManager.addPlayerToSession(name, session) }).then(() => {
                DataManager.getSessionDataStream(session, getSessionUpdates).catch(console.log)
                document.getElementById("submit").innerText = "Leave Session";
                document.getElementById("text").classList.remove("hidden");
                console.log(name, session);
                joiningSession = false;
            }).catch(e => {
                joiningSession = false;
                sessionLock = false;
                console.log(e);
            });
        } else if (!joiningSession) {
            DataManager.stopSessionStream(session).then(() => {
                DataManager.removePlayer(name).then(() => {
                    sessionLock = false;
                    name = "";
                    session = "";
                    document.getElementById("submit").innerText = "Join Session";
                    document.getElementById("text").classList.add("hidden");
                })

            }).catch(e => {
                console.log(e);
            });
        }
    }



}();

document.getElementById("submit").addEventListener("click", submit);