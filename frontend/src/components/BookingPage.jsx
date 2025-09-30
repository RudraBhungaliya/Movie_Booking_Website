import { useParams } from "react-router-dom";
import movies from "../data/movies";
import SeatSelector from "./SeatSelector";

export default function BookingPage() {
  const { id } = useParams();
  const movie = movies.find((m) => m.id === parseInt(id));

  return (
    <div className="container mx-auto p-8 justify-center">
      <div className="flex flex-col md:flex-row gap-8 justify-center">
        <div className="md:w-2/3 flex flex-col justify-center items-center md:items-start">
          <SeatSelector movie={movie} />
        </div>
      </div>
    </div>
  );
}
