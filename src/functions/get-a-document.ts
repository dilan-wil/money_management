import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export const getADocument = (
  id: string,
  collection: string,
  onDataUpdate: (data: any) => void
) => {
  try {
    // Reference to the document
    const docRef = doc(db, collection, id);

    // Get the document once
    const fetchDocument = async () => {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Document data
        onDataUpdate({ id: id, ...docSnap.data() });
      } else {
        // Document does not exist
        onDataUpdate(null); // Or handle the absence of the document
      }
    };

    fetchDocument(); // Fetch the document immediately

    // Listen for real-time updates
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        // Document data has changed
        console.log(docSnap.data())
        onDataUpdate({ id: id, ...docSnap.data() });
      } else {
        // Document no longer exists
        onDataUpdate(null);
      }
    });

    // Return the unsubscribe function to stop listening
    return unsubscribe;
  } catch (error) {
    console.error("Error getting document:", error);
    return null; // Handle error if necessary
  }
};
