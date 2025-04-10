import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/lib/toast";

export type UserRole = "student" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isPremium: boolean;
  points: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as UserRole,
    isPremium: true,
    points: 1000,
  },
  {
    id: "2",
    name: "Student User",
    email: "student@example.com",
    password: "student123",
    role: "student" as UserRole,
    isPremium: false,
    points: 150,
  },
  {
    id: "3",
    name: "Premium Student",
    email: "premium@example.com",
    password: "premium123",
    role: "student" as UserRole,
    isPremium: true,
    points: 500,
  },
];

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string) => {
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      // Remove password from saved user
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      toast.success(`Welcome back, ${userWithoutPassword.name}!`);
      
      // Redirect based on role
      if (userWithoutPassword.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } else {
      toast.error("Invalid email or password");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
