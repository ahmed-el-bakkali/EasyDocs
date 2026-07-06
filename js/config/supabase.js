import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://qgancwdvwcxyamthqxyn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnYW5jd2R2d2N4eWFtdGhxeHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMTEyNzAsImV4cCI6MjA5Nzc4NzI3MH0.nouyhkeS1012YrNcz4cWrJ5LtH8T9burrY7VeTNdag4";

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
