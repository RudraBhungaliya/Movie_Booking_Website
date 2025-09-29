import { useState } from "react";

export default function SeatSelector({ movie }) {
  const rows = 5;
  const cols = 8;
  const rowLetters = ["A", "B", "C", "D", "E"];

  // Example of already booked seats
  const bookedSeats = [
    { name: movie.title, seat: "A3" },
    { name: movie.title, seat: "B5" },
    { name: movie.title, seat: "C2" },
  ]; 

  const [selected, setSelected] = useState([]);

  const toggleSeat = (seat) => {
    const isBooked = bookedSeats.some(
      (b) => b.name === movie.title && b.seat === seat
    );
    if (isBooked) return;

    setSelected((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const confirmBooking = () => {
    const saved = JSON.parse(localStorage.getItem("myBookings") || "[]");
    const newBooking = {
      title: movie.title,
      seats: selected,
    };
    localStorage.setItem("myBookings", JSON.stringify([...saved, newBooking]));
    setSelected([]);
    alert("Booking confirmed!");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full mb-4 text-center">
        <div className="mx-auto w-3/4 h-6 bg-gray-400 rounded-t-lg">SCREEN</div>
      </div>

      <div className="grid gap-2">
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} className="flex gap-2 justify-center">
            {Array.from({ length: cols }, (_, c) => {
              const seat = `${rowLetters[r]}${c + 1}`;
              const isBooked = bookedSeats.some(
                (b) => b.name === movie.title && b.seat === seat
              );
              const isSelected = selected.includes(seat);

              return (
                <button
                  key={seat}
                  onClick={() => toggleSeat(seat)}
                  disabled={isBooked}
                  className={`w-10 h-10 rounded-md font-semibold ${
                    isBooked
                      ? "bg-red-500 cursor-not-allowed"
                      : isSelected
                      ? "bg-green-500"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                >
                  {seat}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-6 w-full text-center">
        <h3 className="font-semibold mb-2">Selected Seats:</h3>
        <p>{selected.length ? selected.join(", ") : "None"}</p>
        <button
          className="mt-4 bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
          disabled={selected.length === 0}
          onClick={confirmBooking}
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
