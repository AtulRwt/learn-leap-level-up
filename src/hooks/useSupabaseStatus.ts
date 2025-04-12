
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseStatus = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log("Checking Supabase connection...");
        // Simple query to check if we can connect to Supabase
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        
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
    }, 5000); // Reduced timeout from 10 seconds to 5 seconds

    return () => clearTimeout(timeoutId);
  }, []);  // Removed status dependency to prevent infinite loops

  return { status, error };
};
