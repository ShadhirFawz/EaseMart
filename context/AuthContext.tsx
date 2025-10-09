// context/AuthContext.tsx
import * as SecureStore from "expo-secure-store";
import { onAuthStateChanged, signInWithEmailAndPassword, User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../api/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Attempt auto-login if auth.currentUser is null
  useEffect(() => {
    const tryAutoLogin = async () => {
      if (auth.currentUser) return;
      const creds = await SecureStore.getItemAsync("easemart_credentials");
      if (!creds) return;
      try {
        const { email, password } = JSON.parse(creds);
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        console.warn("Auto-login failed:", err);
      }
    };
    tryAutoLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
