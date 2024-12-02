import { updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const updateASubDocument = async (parentCollection: string, parentDocId: string, subCollection: string, docId: string, updatedValues: any) => {
  try{
    const userDocRef = doc(db, parentCollection, parentDocId, subCollection, docId);
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