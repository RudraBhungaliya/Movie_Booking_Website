import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SeatSelector({ movie }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedScreen, setSelectedScreen] = useState("");

  const availableTimes = ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"];
  const screens = ["Screen 1", "Screen 2", "Screen 3"];
  const rowPrices = { A: 200, B: 200, C: 300, D: 300, E: 500 };
  const rows = 5, cols = 8;
  const rowLetters = ["A", "B", "C", "D", "E"];

  const toggleSeat = (seat) => {
    if (!selectedTime || !selectedScreen) return;
    setSelected((prev) => prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]);
  };

  const totalAmount = selected.reduce((sum, seat) => sum + (rowPrices[seat[0]] || 0), 0);

  const confirmBooking = async () => {
    if (!selectedTime || !selectedScreen || selected.length === 0) {
      return alert("Please select seats, timing and screen!");
    }

    const userId = 2;

    const today = new Date();
    const [hourMin, meridian] = selectedTime.split(" ");
    let [hour, minute] = hourMin.split(":").map(Number);
    if (meridian === "PM" && hour !== 12) hour += 12;
    if (meridian === "AM" && hour === 12) hour = 0;
    const show_datetime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour, minute).toISOString().slice(0, 19).replace("T", " ");

    const bookingData = {
      user_id: userId,
      movie_id: movie.movie_id,
      screen_id: screens.indexOf(selectedScreen) + 1,
      show_datetime,
      number_of_tickets: selected.length,
      total_amount: totalAmount,
      seats: selected,
      booking_status: 'Confirmed'
    };

    console.log("Sending this data:", bookingData);

    try {
      const res = await fetch("http://localhost:5000/bookings/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Booking confirmed for ${movie.title}!`);
        navigate('/mybookings');
      } else {
        alert(`Booking failed! ${data.details || data.error}`);
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error!");
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-start p-6">
      <div className="max-w-5xl w-full">
        <div className="flex flex-col md:flex-row gap-6 mb-6 items-center md:items-start">
          <img
            src={`/assets/${movie.poster_image_url}`}
            alt={movie.title}
            className="w-48 h-64 object-cover rounded-lg shadow-md"
          />
          <div>
            <h1 className="text-2xl font-bold mb-2">{movie.title}</h1>
            {movie.genre && (
              <div className="flex flex-wrap gap-2 mb-2">
                {movie.genre.split(",").map((g, i) => (
                  <span key={i} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                    {g.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <h3 className="font-semibold mb-1">Timing:</h3>
            <div className="flex flex-wrap gap-2">
              {availableTimes.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`px-3 py-1 rounded ${selectedTime === t ? "bg-purple-600 text-white" : "bg-gray-200"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Screen:</h3>
            <div className="flex flex-wrap gap-2">
              {screens.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedScreen(s)}
                  className={`px-3 py-1 rounded ${selectedScreen === s ? "bg-pink-600 text-white" : "bg-gray-200"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-8 gap-2 mb-4">
          {rowLetters.map((row) =>
            Array.from({ length: cols }, (_, c) => {
              const seat = `${row}${c + 1}`;
              const isSelected = selected.includes(seat);
              return (
                <button
                  key={seat}
                  onClick={() => toggleSeat(seat)}
                  className={`p-2 rounded ${isSelected ? "bg-green-500 text-white" : "bg-gray-200"}`}
                >
                  {seat}
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold text-lg">Total: ₹{totalAmount}</div>
          <button
            onClick={confirmBooking}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
            disabled={selected.length === 0 || !selectedTime || !selectedScreen}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}