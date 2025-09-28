import { useParams } from "react-router-dom";
import movies from "../data/movies";
import SeatSelector from "./SeatSelector";

export default function BookingPage() {
  const { id } = useParams();
  const movie = movies.find((m) => m.id === parseInt(id));

  if (!movie) {
    return (
      <>
        <Navbar />
        <div className="text-center p-10">
          <h2 className="text-3xl font-bold">Movie not found!</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto p-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="text-lg text-gray-500 mt-2">{movie.genre}</p>
        </div>
        <SeatSelector movie={movie} />
      </div>
    </>
  );
}