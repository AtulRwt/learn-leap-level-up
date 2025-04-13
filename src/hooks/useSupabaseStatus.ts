
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseStatus = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log("Checking Supabase connection...");
        
        // Try to query something that doesn't involve the profiles table's problematic policy
        const { data, error } = await supabase
          .from('resources')
          .select('count')
          .limit(1);
        
        if (error) {
          console.error("Supabase connection error:", error);
          setStatus('error');
          setError(error.message);
        } else {
          console.log("Successfully connected to Supabase");
          setStatus('connected');
          setError(null);
        }
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
