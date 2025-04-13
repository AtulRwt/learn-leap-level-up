
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseStatus = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log("Checking Supabase connection...");
        
        // First check: try to get public access without auth
        try {
          const { data, error } = await supabase
            .from('resources')
            .select('count')
            .eq('is_approved', true)
            .limit(1)
            .maybeSingle();
            
          if (!error) {
            console.log("Successfully connected to Supabase using public resources");
            setStatus('connected');
            setError(null);
            return;
          }
        } catch (err) {
          console.log("Public resources check failed, trying another method");
        }
        
        // Second check: try auth session which doesn't hit RLS directly
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
        
        // Final check: try direct database health check
        // This special check avoids RLS policies completely
        try {
          const { data, error } = await supabase.rpc('get_user_role', { 
            user_id: '00000000-0000-0000-0000-000000000000' 
          });
          
          // Even if no data returned, if no error then connection is OK
          if (!error) {
            console.log("Successfully verified Supabase connection with RPC");
            setStatus('connected');
            setError(null);
            return;
          }
        } catch (err) {
          console.log("RPC check failed");
        }
        
        // If we get here, connection truly failed
        throw new Error("All connection attempts failed - database may be unavailable");
      } catch (err: any) {
        console.error("Supabase connection error:", err);
        setStatus('error');
        setError(err.message || 'Unknown error connecting to database');
      }
    };

    checkConnection();

    // Add a timeout to retry the connection check if it's still in 'checking' state after 3 seconds
    // Shorter timeout for better UX
    const timeoutId = setTimeout(() => {
      if (status === 'checking') {
        console.log("Connection check timed out, retrying...");
        checkConnection();
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [status]);

  return { status, error };
};
