import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, onValue, get, remove, off } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyCsEd31K3Ic22Th1z_NcMQ6BaAyJ1mdC7c",
    authDomain: "project-somkiad.firebaseapp.com",
    projectId: "project-somkiad",
    storageBucket: "project-somkiad.appspot.com",
    messagingSenderId: "89292702707",
    appId: "1:89292702707:web:ce36e343b6b7da0d0ec886",
    measurementId: "G-6C87FRWDP4"
};
const app = initializeApp(firebaseConfig);
const database = getDatabase();
export class DBManager {


    writeValue(ref, data) {
        return set(ref, data);
    }

    getReference(path) {
        return ref(database, path)
    }

    removeValue(ref) {
        return remove(ref);
    }

    pathExists(path) {
        return new Promise((res, rej) => {
            get(this.getReference(path)).then((snapshot) => {
                if (snapshot.exists()) {
                    res(snapshot.val());
                } else {
                    rej("the path " + path + "does not exist");
                }
            }).catch((error) => {
                console.error(error);
            });
        });
    }


    getValue(path) {
        return new Promise((res, rej) => {
            get(this.getReference(path)).then((snapshot) => {
                console.log(snapshot.val(), path);
                res(snapshot.val())
            }).catch(rej);
        });
    }

    getUpdates(ref, action) {
        return onValue(ref, (snapshot) => {
            const data = snapshot.val();
            action(data);
        });
    }

    stopUpdates(ref) {
        try{
            off(ref);
            return Promise.resolve();
        }catch(e){
            return Promise.reject(e);
        }
    }

    constructor() {
        // Get a reference to the database service
    }
};