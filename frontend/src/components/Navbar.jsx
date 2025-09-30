import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../supabase/supabase";
import { useMemo } from "react";
import defaultAvatar from "/assets/default-avatar.jpeg";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    async function fetchUser() {
      setLoading(true);
      try {
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!mounted) return;
        setUser(currentUser ?? null);
      } catch (err) {
        if (!mounted) return;
        console.error("Failed to fetch user:", err);
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        setUser(session?.user ?? null);
        setMenuOpen(false);
      }
    );

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    localStorage.setItem("returnTo", location.pathname);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });

    if (error) console.error("Google login error:", error.message);
    else {
      // After redirect back, fetch the updated user
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
    navigate("/"); // optionally go home
  };

  const handleProfile = () => {
    navigate("/profile");
    setMenuOpen(false);
  };

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    fetchSession();
  }, []);

  const avatarUrl = useMemo(() => {
    return (
      user?.user_metadata?.picture ||
      user?.user_metadata?.avatar_url || // sometimes supabase puts photo here
      defaultAvatar
    );
  }, [user]);

  return (
    <nav className="bg-purple-700 text-white px-6 py-4 shadow-md flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold tracking-wide">
        🎬 Moviex
      </Link>

      <div className="flex gap-6 items-center text-lg relative">
        <Link to="/mybookings" className="hover:text-yellow-200 font-semibold">
          My Bookings
        </Link>

        <button
          onClick={() => (user ? setMenuOpen(!menuOpen) : handleLogin())}
          className="w-10 h-10 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center hover:ring-2 hover:ring-yellow-300 transition"
          title={user ? "Profile menu" : "Login with Google"}
        >
          {loading ? (
            <div className="w-6 h-6 rounded-full bg-gray-400 animate-pulse" />
          ) : (
            <img
              src={avatarUrl}
              alt={user?.email ?? "Default avatar"}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultAvatar; // fallback if broken
              }}
            />
          )}
        </button>

        {menuOpen && user && (
          <div className="absolute right-0 mt-12 bg-white text-black rounded shadow-lg flex flex-col">
            <button
              onClick={handleProfile}
              className="px-4 py-2 hover:bg-gray-200 text-left"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 hover:bg-gray-200 text-left"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
