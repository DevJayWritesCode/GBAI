import { initializeApp } from "firebase/app";
import { equalTo, getDatabase } from "firebase/database"
import { ref, update, get, query, orderByChild } from "firebase/database";
import { createUserWithEmailAndPassword, getAuth, signOut, signInWithEmailAndPassword } from "firebase/auth"
import { firebaseConfig_prod } from "./firebaseConfig";
import { pipeline } from "@xenova/transformers"

/**
 * DEV TEST CONFIG
 */


// Initialize Firebase
const app = initializeApp(firebaseConfig_prod);
export const db = getDatabase(app)
export const auth = getAuth(app)




/**
 * Signin function
 * @param {String} email 
 * @param {String} password 
 * @param {Function} callBack 
 */
export async function signIn(email, password) {
    return await signInWithEmailAndPassword(auth, email, password)
}

export async function signOutUser() {
    return signOut(auth)
}

export async function createUser(email, password) {
    return await createUserWithEmailAndPassword(auth, email, password)
}

// export async function getUserByHandle(handle) {
//     const data = await get(query(ref(db, `/users/${handle}`)))
//     return { val: data, twitterHandle: handle }
// }
// export async function createUser(handle, password) {
//     return await createUserWithEmailAndPassword(auth, `${handle}@gmail.com`, password)
// }

export async function updateCredentials(data) {
    return await update(ref(db, `users/${data.ID}`), { email: data.email })
}

export async function logConversation(data, currentChatID) {
    return await update(ref(db, `users/${data.ID}/logs/${currentChatID}`), {
        [new Date().toTimeString()]: data.log
    })
}

export function getUserByEmail(email) {
    return get(query(ref(db, 'users/'), orderByChild('email'), equalTo(email)))
}

export async function getChatTitleSummary(id) {
    let chats;
    return get(query(ref(db, `users/${id}/logs`)))
    // const pipe = await pipeline("summarization")
    // return await pipe(input, { max_length: 30 })
}


export async function getCurrentChat(id, date) {
    return get(query(ref(db, `users/${id}/logs/${date}`)))
}

export async function getSummary(input) {
    const pipe = await pipeline("summarization")
    return await pipe(input, { max_length: 30 })
}


// export async function updateStars(data, entries = 0, quotaData) {
//     return await update(ref(db, `users/${data}`), { entries, quota: quotaData })
// }

// export async function getGlobalStars() {
//     return await get(query(ref(db, "/users"), orderByChild("entries")))
// }