// api/supabase.ts
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kcixwyjcpotboajlqfmz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjaXh3eWpjcG90Ym9hamxxZm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MTQwODYsImV4cCI6MjA3NTM5MDA4Nn0.qcBrxF6pJyGPA7LKFBsBK-1WrdW4jvPzWLGTHCHEYX8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
