
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseStatus = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log("Checking Supabase connection...");
        
        // First try resources table which might not have the same RLS issues
        let data, error;
        
        try {
          ({ data, error } = await supabase
            .from('resources')
            .select('count')
            .limit(1));
            
          if (!error) {
            console.log("Successfully connected to Supabase using resources table");
            setStatus('connected');
            setError(null);
            return;
          }
        } catch (err) {
          console.log("Failed with resources table, trying with auth session");
        }
        
        // If that fails, try checking auth session which usually works even if RLS has issues
        try {
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          if (!sessionError) {
            console.log("Successfully checked Supabase auth connection");
            setStatus('connected');
            setError(null);
            return;
          }
        } catch (err) {
          console.log("Both connection checks failed");
        }
        
        // If we get here, connection truly failed
        console.error("Supabase connection error:", error);
        setStatus('error');
        setError(error ? error.message : "Unknown connection error");
      } catch (err: any) {
        console.error("Unexpected Supabase error:", err);
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
  }, []);

  return { status, error };
};
