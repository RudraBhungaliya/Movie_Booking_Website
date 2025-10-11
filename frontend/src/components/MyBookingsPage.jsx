import { useEffect, useState } from "react";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("http://localhost:5000/bookings/list");
        if (!res.ok) throw new Error("Failed to fetch bookings.");
        
        const data = await res.json();
        if (data.success) {
          setBookings(data.bookings);
        } else {
          throw new Error(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">My Bookings</h1>
        {bookings.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-gray-600">You have no bookings yet.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {bookings.map((b) => (
              <li key={b.booking_id} className="bg-white p-5 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-purple-700">{b.movie_title}</h2>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <p><strong>Show Time:</strong> {new Date(b.show_datetime).toLocaleString()}</p>
                  <p><strong>Tickets:</strong> {b.number_of_tickets}</p>
                  <p><strong>Amount Paid:</strong> ₹{b.total_amount}</p>
                  <p><strong>Status:</strong> <span className="font-semibold text-green-700">{b.booking_status}</span></p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}