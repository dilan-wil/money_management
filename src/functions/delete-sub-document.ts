import { deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

export const deleteASubDocument = async (parentCollection: string, parentDocId: string, subCollection: string, docId: string) => {
  try{
    const docRef = doc(db, parentCollection, parentDocId, subCollection, docId);
    await deleteDoc(docRef);
    return true
  } catch(error){
    console.log(error)
  } 
};