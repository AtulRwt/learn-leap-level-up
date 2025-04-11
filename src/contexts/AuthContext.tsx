
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
  isPremium: boolean;
  points: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
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

  // Check if user is already logged in and fetch profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session }} = await supabase.auth.getSession();
        
        if (session) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error('Error fetching profile:', error);
            setUser(null);
          } else if (profile) {
            setUser({
              id: profile.id,
              name: profile.name || 'User',
              email: profile.email || session.user.email || '',
              role: profile.role as UserRole,
              isPremium: false, // You could add this to profile table if needed
              points: profile.points || 0
            });
          }
        }
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (!error && profile) {
            setUser({
              id: profile.id,
              name: profile.name || 'User',
              email: profile.email || session.user.email || '',
              role: profile.role as UserRole,
              isPremium: false,
              points: profile.points || 0
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
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
      
      if (data.user) {
        // Check if this user has a profile already
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching user profile:', profileError);
          // If profile doesn't exist, create one (this might happen for new users)
          if (profileError.code === 'PGRST116') {
            const { error: createError } = await supabase
              .from('profiles')
              .insert([{ 
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata.full_name || 'User',
                role: 'student'
              }]);
              
            if (createError) {
              console.error('Error creating profile:', createError);
              toast.error('Error setting up user profile');
              return;
            }
            
            // Fetch the newly created profile
            const { data: newProfile, error: newProfileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();
              
            if (newProfileError || !newProfile) {
              toast.error('Error fetching new profile');
              return;
            }
            
            setUser({
              id: newProfile.id,
              name: newProfile.name || 'User',
              email: newProfile.email || data.user.email || '',
              role: newProfile.role as UserRole,
              isPremium: false,
              points: newProfile.points || 0
            });
          } else {
            toast.error('Error fetching user profile');
            return;
          }
        } else if (profile) {
          setUser({
            id: profile.id,
            name: profile.name || 'User',
            email: profile.email || data.user.email || '',
            role: profile.role as UserRole,
            isPremium: false,
            points: profile.points || 0
          });
        }
        
        toast.success(`Welcome back, ${user?.name || 'User'}!`);
        
        // Redirect based on role
        if (user?.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return;
      }
      
      setUser(null);
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An error occurred during logout');
    }
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
