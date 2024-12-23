'use client'
import { db } from "./firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

interface AddData {
    name?: string
    amount?: number
    percentage?: number
}

export async function addToSubCollection(addData: AddData, userId: string, table: string) {
    try {
        console.log(userId)
        // Reference the Firestore collection
        const collectionRef = collection(db, "users", userId, table)
        
        // Add the document to the collection with auto-generated ID
        await addDoc(collectionRef, {
            ...addData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        })

        return true // indicate success
    } catch (error) {
        console.error("Error adding document:", error); // Log detailed error for debugging
        return false; // Indicate failure
    }
}
