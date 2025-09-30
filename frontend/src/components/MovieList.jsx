import MovieCard from "./MovieCard";
import movies from "../data/movies";

export default function MovieList() {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Now Showing</h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
