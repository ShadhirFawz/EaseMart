// Auth service
import * as SecureStore from "expo-secure-store";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../api/firebase";
import { User } from "../models/UserModel";

export const register = async (email: string, password: string, displayName: string) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCred.user;

  await updateProfile(user, { displayName });

  const newUser: User = {
    uid: user.uid,
    email: user.email!,
    displayName,
    createdAt: Date.now(),
  };

  await setDoc(doc(db, "users", user.uid), newUser);
  return newUser;
};


export async function login(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  // Store for persistence
  await SecureStore.setItemAsync("easemart_credentials", JSON.stringify({ email, password }));
  return cred;
}

export async function logout() {
  await SecureStore.deleteItemAsync("easemart_credentials");
  await auth.signOut();
}

export async function updateUserPhoto(photoUrl: string) {
  const user = getAuth().currentUser;
  if (!user) throw new Error("No authenticated user found");

  await updateProfile(user, { photoURL: photoUrl });
  console.log("Profile photo updated:", photoUrl);
}
