// Auth service
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
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

export const login = async (email: string, password: string) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, "users", userCred.user.uid));
  return userDoc.data();
};

export const logout = async () => await signOut(auth);
