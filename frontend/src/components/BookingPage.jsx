import { useParams } from "react-router-dom";
import SeatSelector from "./SeatSelector";

export default function BookingPage() {
  const { id } = useParams();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Booking for Movie #{id}</h2>
      <SeatSelector />
    </div>
  );
}
