// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://tuslxlmwvemqgtbfovlv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1c2x4bG13dmVtcWd0YmZvdmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNjY3OTUsImV4cCI6MjA1OTg0Mjc5NX0.F3WlQaOp1x2rYIOfSbvfKTLqAgQ70591MDfbC8lQEIk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);