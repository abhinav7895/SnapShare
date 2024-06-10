"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "../../firebase.config";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { toast } from "sonner";

interface AuthContextType {
  currentUser: User | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      console.log("hello");
      
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logout successfully");
    } catch (error) {
      toast.error("Error while signing out");
    }
  };


  return (
    <AuthContext.Provider value={{ currentUser, logout }} >
      {!loading && children}
    </AuthContext.Provider>
  )
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
