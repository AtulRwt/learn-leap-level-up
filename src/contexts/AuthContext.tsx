
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
  login: (email: string, password: string) => Promise<boolean>; // Return boolean to indicate success/failure
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Create auth context with default empty values
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAuthenticated: false,
  loading: true,
  login: async () => false,
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
    console.log("Setting up auth listener");
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        setSession(currentSession);
        
        if (currentSession?.user) {
          try {
            // Fetch user profile from public profiles table
            const { data: profile, error } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", currentSession.user.id)
              .single();

            if (error) {
              console.error("Error fetching user profile:", error);
              setUser(null);
              toast.error("Failed to load your profile");
            } else if (profile) {
              console.log("User profile fetched:", profile);
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || "",
                name: profile.name || "User",
                role: profile.role as "admin" | "student",
                avatar_url: profile.avatar_url
              });
              
              if (event === "SIGNED_IN") {
                toast.success(`Welcome back, ${profile.name || "User"}!`);
              }
            } else {
              console.error("No profile found for user");
              setUser(null);
              toast.error("No profile found for your account");
            }
          } catch (err) {
            console.error("Error in auth state change handler:", err);
            setUser(null);
          } finally {
            setLoading(false);
          }
        } else {
          setUser(null);
          if (event === "SIGNED_OUT") {
            toast.success("You have been signed out");
          }
          setLoading(false);
        }
      }
    );

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          setLoading(false);
          return;
        }

        console.log("Initial session check:", currentSession?.user?.email);
        setSession(currentSession);

        if (currentSession?.user) {
          try {
            // Fetch user profile
            const { data: profile, error } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", currentSession.user.id)
              .single();

            if (error) {
              console.error("Error fetching user profile:", error);
              setUser(null);
            } else if (profile) {
              console.log("User profile loaded:", profile);
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || "",
                name: profile.name || "User",
                role: profile.role as "admin" | "student",
                avatar_url: profile.avatar_url
              });
            } else {
              console.error("No profile found for initial session");
            }
          } catch (err) {
            console.error("Error fetching profile in session check:", err);
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error checking session:", err);
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error("Login error:", error.message);
        toast.error(error.message || "Failed to login");
        return false;
      }
      
      console.log("Login successful:", data.user?.email);
      return true;
      // The rest will be handled by the auth state change listener
    } catch (error: any) {
      console.error("Login exception:", error.message);
      toast.error(error.message || "Failed to login");
      return false;
    }
  };

  // Register function
  const register = async (email: string, password: string, name: string) => {
    try {
      console.log("Attempting registration for:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        console.error("Registration error:", error.message);
        toast.error(error.message || "Failed to register");
        throw error;
      }

      console.log("Registration response:", data);
      
      if (data?.user) {
        toast.success("Registration successful! Please check your email for confirmation.");
      } else {
        toast.info("Registration initiated. Please check your email.");
      }
    } catch (error: any) {
      console.error("Registration exception:", error.message);
      toast.error(error.message || "Failed to register");
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log("Attempting logout");
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error.message);
        toast.error(error.message || "Failed to logout");
        throw error;
      }
      console.log("Logout successful");
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error("Logout exception:", error.message);
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
