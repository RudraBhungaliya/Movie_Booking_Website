import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  const poster = `/assets/${movie.filename}`;

  return (
    <Link
      to={`/book/${movie.id}`}
      className="block relative aspect-[2/3] rounded-xl overflow-hidden shadow-xl group transition-transform duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl">
      <img
        src={poster}
        alt={movie.title}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <div className="flex items-center text-sm font-semibold" />
        <h3 className="text-xl font-bold mt-1 truncate">{movie.title}</h3>
        <p className="text-sm text-gray-300">{movie.genre}</p>
      </div>
    </Link>
  );
}