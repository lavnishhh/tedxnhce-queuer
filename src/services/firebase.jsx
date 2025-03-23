import React, { createContext, useContext, useState, useEffect } from "react";
import { 
    getFirestore, collection, onSnapshot, doc, deleteDoc, getDocs, query, orderBy, addDoc, serverTimestamp, 
    updateDoc,
    where,
    limit
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAq5jNwwzisB3BNjwUrZmi5rUNEObAmUXw",
    authDomain: "tedxnhce-queuer.firebaseapp.com",
    projectId: "tedxnhce-queuer",
    storageBucket: "tedxnhce-queuer.firebasestorage.app",
    messagingSenderId: "977802517337",
    appId: "1:977802517337:web:db2b785d4c037b66260a48"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
    const [queue, setQueue] = useState([]);
    const [playing, setPlaying] = useState([]);
    const [registered, setRegistered] = useState(false);
    const collectionRef = collection(db, "queue");

    useEffect(() => {

        const data = JSON.parse(localStorage.getItem('registered'))
        if(data && data.time){
            setRegistered(true)
        }

    }, []);
    
    const listen = ()=>{

        const unsubscribe = onSnapshot(query(collectionRef, where("completed", "!=", true), orderBy("timestamp", "asc")), (snapshot) => {
            const updatedQueue = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setQueue(updatedQueue);
        });

        return unsubscribe;
    };

    const listenCurrentlyPlaying = () => {
        const q = query(
            collectionRef, 
            where("completed", "!=", true),    
            orderBy("timestamp", "asc"),   
            limit(4)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPlaying(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return unsubscribe; // Return unsubscribe function
    };

    const addToQueue = async (person, team_id, team_name) => {

        const last = JSON.parse(localStorage.getItem('registered'))
        if(last && ((Date.now() - last.time) < 30 * 60 * 1000)){
            throw Error("try_again")
        }

        try{
            await addDoc(collectionRef, { ...person, team_id, team_name: team_name ?? "", timestamp: serverTimestamp(), completed: false });
            localStorage.setItem('registered', JSON.stringify({
                time: Date.now(),
                id: team_id,
                name: person.name
            }))
            setRegistered(true)
        }
        catch (err){
            throw Error(err)
        }
    };

    const popTeam = async () => {
        const toRemove = queue.slice(0, 4);
        for (let item of toRemove) {
            await updateDoc(doc(db, collectionRef.path, item.id), {completed: true, completedAt: serverTimestamp()});
        }
    };

    const removePerson = async (id) => {
        console.log(id, typeof id);
        await deleteDoc(doc(db, "queue", id))
    }

    return (
        <QueueContext.Provider value={{ queue, addToQueue, popTeam, listenCurrentlyPlaying, listen, playing, removePerson, registered }}>
            {children}
        </QueueContext.Provider>
    );
};

export const useQueue = () => useContext(QueueContext);