// This edge function will create the required storage bucket for our application
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

console.log("Creating storage bucket...");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    let createBucketResult;
    
    try {
      // Create the bucket if it doesn't exist
      createBucketResult = await supabaseAdmin.storage.createBucket('resources', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'text/plain',
          'image/jpeg',
          'image/png',
          'image/gif'
        ]
      });
    } catch (error) {
      // If the error is not related to the bucket already existing, rethrow it
      if (error.message !== "The bucket already exists") {
        throw error;
      }
      // Otherwise, continue since we know the bucket exists
    }

    // Create default bucket policy (even if the bucket already exists)
    let policyResult = null;
    try {
      const { data, error } = await supabaseAdmin.storage.from('resources')
        .upload('test-policy-file', new Uint8Array([1, 2, 3, 4]), {
          upsert: true
        });
        
      if (error) throw error;
      policyResult = data;
    } catch (error) {
      console.error("Error setting bucket policy:", error);
    }

    return new Response(
      JSON.stringify({ 
        message: "Storage bucket setup complete",
        bucketData: createBucketResult,
        policyData: policyResult
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});
