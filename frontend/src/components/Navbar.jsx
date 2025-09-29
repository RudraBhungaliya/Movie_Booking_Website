import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-purple-700 text-white px-6 py-4 shadow-md flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold tracking-wide">
        🎬 Moviex
      </Link>
      <div className="flex gap-6 items-center text-lg">
        <Link to="/mybookings" className="hover:text-yellow-200 font-semibold">
          My Bookings
        </Link>
        

        <button className="hover:text-yellow-200 transition-colors" title="Login / Profile">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-7 h-7"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}