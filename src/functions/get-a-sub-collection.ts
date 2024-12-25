import { db } from "./firebase";
import { collection, onSnapshot } from "firebase/firestore";

export const getASubCollection = (
  collectionName: string,
  documentId: string,
  subCollectionName: string,
  onDataUpdate: (data: any[]) => void,
  totalIncome?: number
) => {
  try {
    // Reference to the subcollection
    const collectionRef = collection(db, collectionName, documentId, subCollectionName);

    // Set up real-time listener
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map((doc) => {
          const item = { id: doc.id, updatedAt: doc.data().updatedAt, ...doc.data() };

          // Format updatedAt if it exists
          if (item.updatedAt) {
            item.updatedAt = item.updatedAt.toDate().toLocaleDateString("en-GB"); // Convert to string (ISO format)
          }

          return item;
        });

        // Check if data has fields relevant for totalAmount calculation
        if (data.some((item: any) => item.percentage !== undefined && item.parent !== undefined)) {
          // Create a map for easier parent lookup and initialize totalAmount to 0
          const dataMap = new Map(
            data.map((item) => [item.id, { ...item, totalAmount: 0 }])
          );
        
          let hasUnresolved = true; // Flag to check if there are unresolved totalAmounts
          while (hasUnresolved) {
            hasUnresolved = false;
        
            data.forEach((item: any) => {
              const currentItem = dataMap.get(item.id);
        
              if (!currentItem) return;
        
              if (item.parent === "none") {
                // Top-level: calculate as percentage of totalIncome
                if (currentItem.totalAmount === 0) {
                  console.log(totalIncome)
                  currentItem.totalAmount = (item.percentage / 100) * (totalIncome ?? 50000);
                  hasUnresolved = true;
                }
              } else if (dataMap.has(item.parent)) {
                // Child: calculate as percentage of parent's totalAmount
                const parent = dataMap.get(item.parent);
        
                if (parent && parent.totalAmount && currentItem.totalAmount === 0) {
                  currentItem.totalAmount = (item.percentage / 100) * parent.totalAmount;
                  hasUnresolved = true;
                }
              }
            });
          }
        
          console.log(Array.from(dataMap.values()));
        
          // Update with calculated totalAmount
          onDataUpdate(Array.from(dataMap.values()));
        }
         else {
          console.log(data)
          // If no relevant fields for calculation, just return the data
          onDataUpdate(data);
        }
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
