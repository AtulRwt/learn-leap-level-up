
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseStatus = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log("Checking Supabase connection...");
        
        // First try to check the session which is less likely to have RLS issues
        try {
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          if (!sessionError) {
            console.log("Successfully checked Supabase auth connection");
            setStatus('connected');
            setError(null);
            return;
          }
        } catch (err) {
          console.log("Auth session check failed, trying another method");
        }
        
        // Try public profiles table which should have fixed RLS now
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('count')
            .limit(1);
            
          if (!error) {
            console.log("Successfully connected to Supabase using profiles table");
            setStatus('connected');
            setError(null);
            return;
          } else {
            throw error;
          }
        } catch (err: any) {
          console.error("Profile table connection failed:", err);
          // Continue to next check if this fails
        }
        
        // Final fallback - try resources table
        try {
          const { data, error } = await supabase
            .from('resources')
            .select('count')
            .limit(1);
            
          if (!error) {
            console.log("Successfully connected to Supabase using resources table");
            setStatus('connected');
            setError(null);
            return;
          }
        } catch (err) {
          console.log("All connection checks failed");
        }
        
        // If we get here, connection truly failed
        throw new Error("All connection attempts failed");
      } catch (err: any) {
        console.error("Supabase connection error:", err);
        setStatus('error');
        setError(err.message || 'Unknown error connecting to database');
      }
    };

    checkConnection();

    // Add a timeout to retry the connection check if it's still in 'checking' state after 5 seconds
    const timeoutId = setTimeout(() => {
      if (status === 'checking') {
        console.log("Connection check timed out, retrying...");
        checkConnection();
      }
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [status]);

  return { status, error };
};
