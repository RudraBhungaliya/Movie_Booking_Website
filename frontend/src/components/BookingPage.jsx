import { useParams } from "react-router-dom";
import movies from "../data/movies";
import SeatSelector from "./SeatSelector";

export default function BookingPage() {
  const { id } = useParams();
  const movie = movies.find((m) => m.id === parseInt(id));

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-col items-center md:items-start">
          <h1 className="text-4xl font-bold mb-4 text-center md:text-left">{movie.title}</h1>
          <img
            src={`/assets/${movie.filename}`}
            alt={movie.title}
            className="w-full h-96 object-contain rounded-xl shadow-lg mb-4"
          />
          <p className="text-lg text-gray-500 text-center md:text-left">{movie.genre}</p>
        </div>

        <div className="md:w-2/3 flex flex-col items-center md:items-start">
          <SeatSelector movie={movie} />
        </div>
      </div>
    </div>
  );
}
