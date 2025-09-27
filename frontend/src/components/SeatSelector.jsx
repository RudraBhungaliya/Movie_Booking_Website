import { useState } from "react";

export default function SeatSelector() {
  const rows = 5;
  const cols = 8;
  const [selected, setSelected] = useState([]);

  const toggleSeat = (seat) => {
    setSelected((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  return (
    <div>
      <div className="grid gap-2">
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} className="flex gap-2 justify-center">
            {Array.from({ length: cols }, (_, c) => {
              const seat = `${r + 1}-${c + 1}`;
              const isSelected = selected.includes(seat);
              return (
                <button
                  key={seat}
                  onClick={() => toggleSeat(seat)}
                  className={`w-10 h-10 rounded-md ${
                    isSelected ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  {c + 1}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-6">
        <h3 className="font-semibold">Selected Seats:</h3>
        <p>{selected.length ? selected.join(", ") : "None"}</p>
        <button className="mt-4 bg-purple-700 text-white px-6 py-2 rounded-lg">
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
