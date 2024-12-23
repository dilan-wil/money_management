import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const updateASubDocument = async (collection: string, docId: string, updatedValues: any) => {
  try{
    const userDocRef = doc(db, collection, docId);
    await updateDoc(userDocRef, {
      ...updatedValues,
      updatedAt: serverTimestamp()
    });
    return true
  }
  catch(error){
    console.log(error)
  }
  // Update the local userDoc state
};