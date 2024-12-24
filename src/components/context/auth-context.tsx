"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/functions/firebase";
import { Category, IncomeType } from "@/lib/definitions";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  income: any;  // Add total Income here
  setIncome: (income: any) => void;  // Add setter for totalIncome
  userInfos: any;
  setUserInfos: (userInfos: any) => void;
  categories: any;
  setCategories: (categories: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState<IncomeType | null>(null);  // Initialize totalIncome
  const [categories, setCategories] = useState<Category | null>(null);  // Initialize totalIncome
  const [userInfos, setUserInfos] = useState<any>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, income, setIncome, userInfos, setUserInfos, categories, setCategories }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
