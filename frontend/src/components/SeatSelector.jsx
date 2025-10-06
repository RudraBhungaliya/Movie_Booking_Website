import { useState } from "react";

export default function SeatSelector({ movie }) {
  const rows = 5;
  const cols = 8;
  const rowLetters = ["A", "B", "C", "D", "E"];

  const rowPrices = {
    A: 200,
    B: 200,
    C: 300,
    D: 300,
    E: 500,
  };

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
    const newBooking = {
      title: movie.title,
      seats: selected,
      amount: totalAmount,
      poster: movie.filename,
      timestamp: new Date().toISOString(),
    };

    // ✅ Save to localStorage (same key MyBookingsPage uses)
    const existing = JSON.parse(localStorage.getItem("myBookings") || "[]");
    localStorage.setItem(
      "myBookings",
      JSON.stringify([...existing, newBooking])
    );

    // reset UI
    setSelected([]);

    alert(
      `Booking confirmed!\nMovie: ${movie.title}\nSeats: ${selected.join(", ")}`
    );
  };

  const totalAmount = selected.reduce((sum, seat) => {
    const row = seat[0];
    return sum + (rowPrices[row] || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-white flex justify-center items-start">
      <div className="max-w-6xl w-full px-4 py-6">
        {/* Main Content - Two Column Layout */}
        <div className="flex gap-8 justify-center items-start">
          {/* Left Column - Poster + Info + Seats */}
          <div className="flex-1 max-w-3xl">
            {/* Movie Poster */}
            <div className="mb-4 flex justify-center">
              <img
                src={`/assets/${movie.filename}`}
                alt={movie.title}
                className="w-52 h-72 object-cover rounded-lg shadow-xl"
              />
            </div>

            {/* Movie Info moved to middle */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {movie.title}
              </h1>
              <div className="flex justify-center flex-wrap gap-2 mt-2">
                {movie.genre &&
                  movie.genre.split(",").map((g, i) => (
                    <span
                      key={i}
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {g.trim()}
                    </span>
                  ))}
              </div>
              {movie.rating && (
                <div className="flex justify-center items-center gap-1 mt-2">
                  <span className="text-yellow-500 text-base">★</span>
                  <span className="text-gray-700 font-medium">
                    {movie.rating}/10
                  </span>
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
              Select Your Seats
            </h2>

            {/* Screen */}
            <div className="w-full mb-6 text-center">
              <div className="mx-auto w-2/3 h-6 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded-t-lg flex items-center justify-center text-white text-xs font-bold shadow-md">
                SCREEN
              </div>
            </div>

            {/* Seating Area */}
            <div className="grid gap-4 mb-6">
              {Array.from({ length: rows }, (_, r) => {
                const row = rowLetters[r];
                return (
                  <div
                    key={r}
                    className="flex gap-2 justify-center items-center"
                  >
                    <span className="w-6 text-gray-600 font-semibold text-sm">
                      {row}
                    </span>
                    {Array.from({ length: cols }, (_, c) => {
                      const seat = `${row}${c + 1}`;
                      const isBooked = bookedSeats.some(
                        (b) => b.name === movie.title && b.seat === seat
                      );
                      const isSelected = selected.includes(seat);

                      return (
                        <button
                          key={seat}
                          onClick={() => toggleSeat(seat)}
                          disabled={isBooked}
                          className={`w-9 h-9 rounded-md text-xs transition-all shadow-sm ${isBooked
                              ? "bg-red-400 cursor-not-allowed opacity-60"
                              : isSelected
                                ? "bg-green-500 hover:bg-green-600 text-white shadow-md"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                            }`}
                        >
                          {seat}
                        </button>
                      );
                    })}
                    <span className="ml-2 text-xs font-semibold text-purple-700">
                      ₹{rowPrices[row]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex gap-6 justify-center flex-wrap text-xs">
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 bg-gray-200 rounded-md shadow-sm"></div>
                <span className="text-gray-700">Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 bg-green-500 rounded-md shadow-sm"></div>
                <span className="text-gray-700">Selected</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 bg-red-400 rounded-md shadow-sm opacity-60"></div>
                <span className="text-gray-700">Booked</span>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="w-80">
            <div className="sticky top-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-lg border border-purple-100">
                <h3 className="font-bold mb-3 text-xl text-gray-800">
                  Booking Summary
                </h3>

                <div className="bg-white rounded-lg p-3 mb-4 min-h-20 flex items-center justify-center">
                  <p className="text-green-600 font-bold text-sm text-center">
                    {selected.length
                      ? selected.join(", ")
                      : "No seats selected"}
                  </p>
                </div>

                <div className="space-y-3 mb-4 text-sm">
                  <div className="flex justify-between items-center text-gray-700 border-b border-purple-100 pb-2">
                    <span className="font-medium">Movie:</span>
                    <span className="font-semibold text-gray-900">
                      {movie.title}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="font-medium">Total Seats:</span>
                    <span className="font-bold text-lg text-purple-700">
                      {selected.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700">
                    <span className="font-medium">Amount:</span>
                    <span className="font-bold text-lg text-green-600">
                      ₹{totalAmount}
                    </span>
                  </div>
                </div>

                <button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all w-full shadow-md hover:shadow-lg text-sm"
                  disabled={selected.length === 0}
                  onClick={confirmBooking}
                >
                  {selected.length > 0
                    ? `Confirm Booking`
                    : "Select Seats to Continue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
