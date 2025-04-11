
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/lib/toast";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "student" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isPremium: boolean; // We'll keep this but derive it from other data
  points: number;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Set up auth state listener and check for existing session
  useEffect(() => {
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          // Fetch the user profile
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching user profile:', error);
            
            // If the profile doesn't exist yet (new user), create one
            if (error.code === 'PGRST116') {
              const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert([
                  {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata?.name || 'User',
                    role: 'student',
                    points: 0
                  }
                ])
                .select()
                .single();
                
              if (createError) {
                console.error('Error creating new profile:', createError);
                setUser(null);
                return;
              }
              
              if (newProfile) {
                setUser({
                  id: newProfile.id,
                  name: newProfile.name,
                  email: newProfile.email || session.user.email || '',
                  role: newProfile.role as UserRole,
                  isPremium: false, // Default since we don't have is_premium column
                  points: newProfile.points || 0,
                  avatar_url: newProfile.avatar_url
                });
                console.log("New user profile created:", newProfile);
                return;
              }
            }
            
            setUser(null);
            return;
          }
          
          if (profile) {
            setUser({
              id: profile.id,
              name: profile.name || 'User',
              email: profile.email || session.user.email || '',
              role: profile.role as UserRole,
              isPremium: false, // We don't have is_premium in the database, so default to false
              points: profile.points || 0,
              avatar_url: profile.avatar_url
            });
            console.log("User profile set:", profile);
          }
        } catch (err) {
          console.error('Error in auth state change handler:', err);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        console.log("User signed out");
      }
    });

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile from session:', error);
            setUser(null);
          } else if (profile) {
            setUser({
              id: profile.id,
              name: profile.name || 'User',
              email: profile.email || session.user.email || '',
              role: profile.role as UserRole,
              isPremium: false, // We don't have is_premium in the database
              points: profile.points || 0,
              avatar_url: profile.avatar_url
            });
            console.log("User session found:", profile);
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
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
      console.log('Attempting login with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error details:', error);
        toast.error(error.message || 'Invalid login credentials');
        return;
      }
      
      if (!data.user) {
        toast.error('No user returned from login');
        return;
      }

      toast.success(`Welcome back!`);
      navigate(data.user.user_metadata?.role === 'admin' ? '/admin' : '/home');
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
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
          data: {
            name,
            role: 'student'
          },
        },
      });
      
      if (error) {
        console.error('Registration error:', error);
        toast.error(error.message || 'Failed to register');
        return;
      }
      
      if (!data.user) {
        toast.error('Registration failed');
        return;
      }
      
      // Create a profile for the new user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            name: name,
            role: 'student',
            points: 0
          }
        ]);
        
      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Continue anyway as the auth trigger should handle this
      }

      toast.success('Registration successful! Check your email to confirm your account.');
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration');
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
      
      // User will be set to null by the onAuthStateChange listener
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
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
