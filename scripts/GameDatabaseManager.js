import { DBManager } from "./DataManager.js"
export class GameDatabase {

    dManager = new DBManager();
    openGameSession(name, sessionData) {
        return new Promise((res, rej) => {
            this.dManager.pathExists("/sessions/" + name)
                .then(() => {
                    rej("Session already exists!");
                }, () => {
                    this.dManager.writeValue(this.dManager.getReference("/sessions/" + name), sessionData);
                    res("Session created under the name: " + name);
                });
        });
    }

    closeGameSession(name) {
        this.dManager.removeValue(this.dManager.getReference("/sessions/" + name))
    }

    createPlayer(name, properties) {
        return new Promise((res, rej) => {
            this.dManager.pathExists("/players/" + name).then(() => {
                rej("A user with the name " + name + "already exists");
            }, () => {
                this.dManager.writeValue(this.dManager.getReference("/players/" + name), properties).then(() => {
                    res("User created sucessfully!");
                }, rej)

            });
        });
    }
    updatePlayer(name, properties) {
        return this.dManager.writeValue(this.dManager.getReference("/players/" + name), properties);
    }
    kickPlayerFromSession(name, session) {
        return Promise.all([
            this.dManager.getValue("/sessions/" + session).then((data) => {
                if (!data.players)
                    return Promise.resolve("Session has no players");
                data.players = data.players.filter(player => player !== name);
                if (data.players.length <= 0)
                    return this.closeGameSession(session);
                else
                    return this.dManager.writeValue(this.dManager.getReference("/sessions/" + session), data);
            }), this.dManager.getValue("/players/" + name).then((data) => {
                if (!data.session)
                    return Promise.resolve("Player has no session")
                data.session = null;
                return this.dManager.writeValue(this.dManager.getReference("/players/" + name), data);
            })]);
    }

    addPlayerToSession(name, session) {
        return new Promise((res, rej) => {
            this.dManager.getValue("/sessions/" + session).then((data) => {
                if (!data) {
                    return this.openGameSession(session, { name: session, players: [name] }).then(() => {
                        return this.dManager.getValue("/sessions/" + session).then((data) => {
                            data.session = session;
                            return this.dManager.writeValue(this.dManager.getReference("/sessions/" + session), data)
                        });
                    });
                } else if (!data.players)
                    data.players = [];
                if (data.open) {
                    data.players.push(name);
                    return this.dManager.writeValue(this.dManager.getReference("/sessions/" + session), data);
                } else
                    return Promise.reject("Session closed");
            }).then(() => {
                this.dManager.getValue("/players/" + name).then((data) => {
                    data.session = session;
                    return this.dManager.writeValue(this.dManager.getReference("/players/" + name), data);
                })
            }).then(res, rej);
        });
    }

    removePlayer(name) {
        return new Promise((res, rej) => {
            this.dManager.getValue("/players/" + name).then((data) => {
                if (data.session != undefined) {
                    this.kickPlayerFromSession(name, data.session).catch(console.error).then(() => {
                        this.dManager.removeValue(this.dManager.getReference("/players/" + name)).then(res, rej);
                    });
                } else {
                    this.dManager.removeValue(this.dManager.getReference("/players/" + name)).then(res, rej);
                }
            })
        })
    }

    getPlayerDataStream(name, callback) {
        return new Promise((res, rej) => {
            this.dManager.pathExists("players/" + name).then(() => {
                this.dManager.getUpdates(this.dManager.getReference("/players/" + name), callback);
                console.log("opening...");
            }).then(res, rej);
        });
    }

    getSessionDataStream(session, callback) {
        console.log("DUDE!!!");
        return new Promise((res, rej) => {
            this.dManager.pathExists("sessions/" + session).then(() => {
                this.dManager.getUpdates(this.dManager.getReference("/sessions/" + session), callback);
                console.log("opening...");
            }).then(res, rej);
        });
    }

    stopSessionStream(session) {
        return this.dManager.stopUpdates(this.dManager.getReference("/sessions/" + session));
    }

    stopPlayerStream(player) {
        return this.dManager.stopUpdates(this.dManager.getReference("/players/" + player));
    }

    // getOtherPlayersDataStream(players){
    //     return Promise.all(players.map((player)=>{
    //         return new Promise((res,rej)=>{
    //             this.dManager.getValue()
    //         });
    //     }));
    // }

    constructor() {
    }

};



