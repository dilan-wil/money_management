import { db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";

export const getASubCollection = (
  collectionName: string,
  documentId: string,
  subCollectionName: string,
  onDataUpdate: (data: any[]) => void
) => {
  try {
    // Reference to the subcollection
    const collectionRef = collection(db, collectionName, documentId, subCollectionName);

    // Set up real-time listener
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      if (!snapshot.empty) {
        const datas = snapshot.docs.map((doc) => {
          const data = { id: doc.id, updatedAt: doc.data().updatedAt , ...doc.data() };

          // Check if updatedAt exists and format it as a string
          if (data.updatedAt) {
            data.updatedAt = data.updatedAt.toDate().toLocaleDateString('en-GB'); // Convert to string (ISO format)
          }

          return data;
        });
        onDataUpdate(datas); // Pass updated data to the callback
      } else {
        onDataUpdate([]); // If no data, pass an empty array
      }
    });

    // Return unsubscribe function to allow cleanup
    return unsubscribe;
  } catch (error) {
    console.error("Error getting subcollection:", error);
    onDataUpdate([]); // Return an empty array in case of error
  }
};
