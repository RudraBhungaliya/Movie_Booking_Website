import { useEffect, useState } from "react";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("myBookings") || "[]");
    setBookings(saved);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((b, i) => (
            <li key={i} className="bg-white shadow rounded-lg p-4">
              <h2 className="text-xl font-semibold">{b.title}</h2>
              <p className="text-gray-600">Seats: {b.seats.join(", ")}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
