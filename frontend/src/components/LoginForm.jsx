// src/components/LoginForm.jsx

import { useState, useEffect } from "react";
import { signInWithProvider, getUser } from "../supabase/auth";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // fetch current user on mount
  useEffect(() => {
    async function fetchUser() {
      const { data } = await getUser();
      setUser(data?.user || null);
    }
    fetchUser();
  }, []);

  const refreshUser = async () => {
    const { data } = await getUser();
    setUser(data?.user || null);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const { error } = await signInWithProvider("google");
      if (error) {
        setError(error.message);
      } else {
        await refreshUser();
        navigate("/"); // redirect after login
      }
    } catch (err) {
      setError("Google login failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg">
      {/* Avatar section */}
      <div className="flex flex-col items-center">
        {!user ? (
          <img
            src="/default-avatar.png" // put your default image in /public
            alt="Default Avatar"
            className="w-16 h-16 rounded-full mb-4"
          />
        ) : (
          <img
            src={user.user_metadata.avatar_url}
            alt="Profile"
            className="w-16 h-16 rounded-full mb-4"
          />
        )}
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center">
        {user ? "Welcome!" : "Login"}
      </h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {!user && (
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-600 transition"
        >
          {loading ? "Signing in..." : "Continue with Google"}
        </button>
      )}
    </div>
  );
}
