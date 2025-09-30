import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUser } from "../supabase/auth"; // adjust path if necessary

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function fetchUser() {
      setLoading(true);
      try {
        const result = await getUser();
        if (!mounted) return;
        // normalize: result may be { user } or the user object itself
        const resolvedUser = result?.user ?? result ?? null;
        setUser(resolvedUser);
      } catch (err) {
        if (!mounted) return;
        console.error("Failed to fetch user:", err);
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  const handleAuthClick = () => {
    navigate(user ? "/profile" : "/login");
  };

  return (
    <nav className="bg-purple-700 text-white px-6 py-4 shadow-md flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold tracking-wide">
        🎬 Moviex
      </Link>

      <div className="flex gap-6 items-center text-lg">
        <Link to="/mybookings" className="hover:text-yellow-200 font-semibold">
          My Bookings
        </Link>

        <button
          onClick={handleAuthClick}
          className="w-10 h-10 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center hover:ring-2 hover:ring-yellow-300 transition"
          title="Login / Profile"
          aria-label="Login or open profile"
        >
          {loading ? (
            // simple loading placeholder
            <div className="w-6 h-6 rounded-full bg-gray-400 animate-pulse" />
          ) : user ? (
            user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt={user?.email ?? "User avatar"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://via.placeholder.com/150?text=avatar";
                }}
              />
            ) : (
              // fallback SVG avatar when user exists but no avatar_url
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7 text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )
          ) : (
            // not logged in: generic icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 13.5a3 3 0 11-6 0 3 3 0 016 0zM6.75 19.5a8.25 8.25 0 0110.5 0"
              />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}
