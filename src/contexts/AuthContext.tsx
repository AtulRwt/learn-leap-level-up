
import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "@/lib/toast";

// Define user type
export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "student";
  avatar_url?: string;
}

// Define auth context type
interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create auth context with default empty values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

// Create auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Fetch user profile from public profiles table
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentSession.user.id)
            .single();

          if (error) {
            console.error("Error fetching user profile:", error);
            setUser(null);
          } else if (profile) {
            setUser({
              id: currentSession.user.id,
              email: currentSession.user.email || "",
              name: profile.name || "User",
              role: profile.role as "admin" | "student",
              avatar_url: profile.avatar_url
            });
          }
        } else {
          setUser(null);
        }

        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);

      if (currentSession?.user) {
        // Fetch user profile
        supabase
          .from("profiles")
          .select("*")
          .eq("id", currentSession.user.id)
          .single()
          .then(({ data: profile, error }) => {
            if (error) {
              console.error("Error fetching user profile:", error);
              setUser(null);
            } else if (profile) {
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || "",
                name: profile.name || "User",
                role: profile.role as "admin" | "student",
                avatar_url: profile.avatar_url
              });
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
      throw error;
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) throw error;
      
      toast.success("Registration successful! Please check your email for confirmation.");
    } catch (error: any) {
      toast.error(error.message || "Failed to register");
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Failed to logout");
    }
  };

  // Create auth context value
  const value = {
    user,
    session,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
