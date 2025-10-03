// Item service
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "../api/firebase";
import { Item } from "../models/ItemModel";

export async function addItem(item: Omit<Item, "id" | "createdAt">) {
  try {
    const docRef = await addDoc(collection(db, "items"), {
      ...item,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding item: ", error);
    throw error;
  }
}

export const fetchItems = async (): Promise<Item[]> => {
  const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Item));
};
