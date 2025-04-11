import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/lib/toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "@/contexts/AuthContext";
import { User, UserRole } from "@/types/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);

        if (event === "SIGNED_IN" && session) {
          try {
            // Fetch profile created by trigger
            const { data: profile, error } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (error) {
              console.error("Error fetching profile:", error);
              setUser(null);
              return;
            }

            setUser({
              id: profile.id,
              name: profile.name || "User",
              email: profile.email || session.user.email || "",
              role: profile.role as UserRole,
              isPremium: false, // Default if not in DB
              points: profile.points || 0,
              avatar_url: profile.avatar_url,
            });
          } catch (err) {
            console.error("Auth state error:", err);
            setUser(null);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;

        if (session) {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (error) {
            console.error("Session profile error:", error);
            setUser(null);
          } else {
            setUser({
              id: profile.id,
              name: profile.name || "User",
              email: profile.email || session.user.email || "",
              role: profile.role as UserRole,
              isPremium: false,
              points: profile.points || 0,
              avatar_url: profile.avatar_url,
            });
          }
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid credentials");
        return;
      }

      if (!data.user) {
        toast.error("Login failed");
        return;
      }

      toast.success("Welcome back!");
      navigate(data.user.user_metadata?.role === "admin" ? "/admin" : "/home");
    } catch (error) {
      toast.error("Login failed");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role: "student" },
        },
      });

      if (error) {
        toast.error(error.message || "Registration failed");
        return;
      }

      if (!data.user) {
        toast.error("Registration failed");
        return;
      }

      toast.success(
        "Registration successful! Check your email to confirm your account."
      );
    } catch (error) {
      toast.error("Registration failed");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
