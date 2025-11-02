import {createClient} from '@supabase/supabase-js';

const SupabaseUrl = "https://mggfrvyrcnzvtvfaozqi.supabase.co";
const SupabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nZ2ZydnlyY256dnR2ZmFvenFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNTY1ODMsImV4cCI6MjA3NDczMjU4M30.XdMHES183IJTKP6IU5qN3dk6RYQjAjm5lh5U1GQGowE";

const supabase = createClient(SupabaseUrl, SupabaseAnonKey, {
    auth : {
        persistSession: true, 
        autoRefreshToken: true,    
        detectSessionInUrl: true, 
    },
});
export default supabase;