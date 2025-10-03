// Item service
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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
