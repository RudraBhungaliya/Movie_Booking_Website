import { useState, useEffect } from "react";
import supabase from "./supabase";
import { Session } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function AuthWrapper() {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth
            .getSession()
            .then(({ data: { session } }) => setSession(session));
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        return () => subscription.unsubscribe();
    }, []);

    if (!session) {
        return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
    }

    return <h2>Welcome, {session?.user?.email}</h2>;
}
