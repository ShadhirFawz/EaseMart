// Item service
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp
} from "firebase/firestore";
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

export async function getItem(id: string): Promise<Item | null> {
  const docRef = doc(db, "items", id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Item, "id">) };
}
