import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

export default function SeatSelector({ movie }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedScreen, setSelectedScreen] = useState("");
  const [screens, setScreens] = useState([]);
  const [screensData, setScreensData] = useState([]);
  const [seatLayout, setSeatLayout] = useState({ rows: 5, cols: 8 });
  const [rowLetters, setRowLetters] = useState(["A", "B", "C", "D", "E"]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  const availableTimes = ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"];
  const rowPrices = { A: 200, B: 200, C: 300, D: 300, E: 500 };

  // Fetch screens
  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const res = await fetch("http://localhost:5000/screens/list");
        const data = await res.json();
        if (data.success) {
          const movieScreens = data.screens.slice(0, 7);
          setScreensData(movieScreens);
          setScreens(movieScreens.map((s) => s.screen_name));
        }
      } catch (err) {
        console.error("Error fetching screens:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScreens();
  }, []);

  // Update seat layout when screen changes
  useEffect(() => {
    if (!selectedScreen) return;
    const screenObj = screensData.find((s) => s.screen_name === selectedScreen);
    if (!screenObj) return;

    const cols = 8;
    const rows = Math.ceil(screenObj.capacity / cols);

    setSeatLayout({ rows, cols });
    setRowLetters("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").slice(0, rows));
    setSelected([]);
  }, [selectedScreen, screensData]);

  // Fetch already booked seats whenever screen or time changes
  useEffect(() => {
    const fetchBookedSeats = async () => {
      if (!selectedScreen || !selectedTime) return;
      try {
        const screenObj = screensData.find((s) => s.screen_name === selectedScreen);
        if (!screenObj) return;

        const [hourMin, meridian] = selectedTime.split(" ");
        let [hour, minute] = hourMin.split(":").map(Number);
        if (meridian === "PM" && hour !== 12) hour += 12;
        if (meridian === "AM" && hour === 12) hour = 0;

        const now = new Date();
        const pad = (n) => n.toString().padStart(2, "0");
        const show_datetime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
          now.getDate()
        )} ${pad(hour)}:${pad(minute)}:00`;

        const res = await fetch("http://localhost:5000/booked_seats/list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            movie_id: movie.movie_id,
            screen_id: screenObj.screen_id,
            show_datetime,
          }),
        });

        const data = await res.json();
        if (data.success) {
          setBookedSeats(data.bookedSeats || []);
        } else {
          setBookedSeats([]);
        }
      } catch (err) {
        console.error("Error fetching booked seats:", err);
      }
    };

    fetchBookedSeats();
  }, [selectedScreen, selectedTime, movie.movie_id, screensData]);

  const toggleSeat = (seat) => {
    if (!selectedTime || !selectedScreen) return;
    if (bookedSeats.includes(seat)) return; // prevent selecting booked seat

    setSelected((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const seatPrice = (seat) => rowPrices[seat[0]] || 0;
  const totalAmount = selected.reduce((sum, seat) => sum + seatPrice(seat), 0);

  const formatMySQLDateTime = (hour, minute) => {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate()
    )} ${pad(hour)}:${pad(minute)}:00`;
  };

  const confirmBooking = async () => {
    if (!selectedTime || !selectedScreen || selected.length === 0) {
      return alert("Please select seats, timing and screen!");
    }

    const userId = 2;
    const [hourMin, meridian] = selectedTime.split(" ");
    let [hour, minute] = hourMin.split(":").map(Number);
    if (meridian === "PM" && hour !== 12) hour += 12;
    if (meridian === "AM" && hour === 12) hour = 0;

    const show_datetime = formatMySQLDateTime(hour, minute);
    const screenObj = screensData.find((s) => s.screen_name === selectedScreen);
    if (!screenObj) return alert("Invalid screen selected");
    const screenId = screenObj.screen_id;

    const pricePerSeat = totalAmount / selected.length;

    try {
      const showRes = await fetch("http://localhost:5000/showtimes/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movie_id: movie.movie_id,
          screen_id: screenId,
          show_datetime,
          price_per_seat: pricePerSeat,
        }),
      });

      const showData = await showRes.json();

      if (!showData.success) {
        alert("Showtime creation failed: " + (showData.error || "Unknown error"));
        return;
      }

      const bookingRes = await fetch("http://localhost:5000/bookings/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          movie_id: movie.movie_id,
          screen_id: screenId,
          show_datetime,
          number_of_tickets: selected.length,
          total_amount: totalAmount,
          seats: selected,
          booking_status: "Confirmed",
        }),
      });
      const bookingData = await bookingRes.json();

      if (bookingData.success) {
        alert(`Booking confirmed for ${movie.title}!`);
        navigate("/mybookings");
      } else {
        alert("Booking failed: " + (bookingData.error || "Unknown reason"));
      }
    } catch (err) {
      console.error("Network/Server error:", err);
      alert("Network or server error!");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-white flex justify-center items-start p-6">
      <div className="max-w-7xl w-full flex flex-col md:flex-row gap-6">
        <div className="flex-1">
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
                    <span
                      key={i}
                      className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs"
                    >
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
                    className={`px-3 py-1 rounded ${
                      selectedTime === t ? "bg-purple-600 text-white" : "bg-gray-200"
                    }`}
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
                    className={`px-3 py-1 rounded ${
                      selectedScreen === s ? "bg-pink-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            {rowLetters.map((row) => {
              const seatsInRow = Array.from({ length: seatLayout.cols }, (_, c) => `${row}${c + 1}`);
              const mid = Math.floor(seatLayout.cols / 2);

              return (
                <div key={row} className="flex justify-center gap-2">
                  {seatsInRow.map((seat, idx) => {
                    const isSelected = selected.includes(seat);
                    const isBooked = bookedSeats.includes(seat);
                    const aisleClass = idx === mid ? "ml-6" : "";
                    return (
                      <button
                        key={seat}
                        onClick={() => toggleSeat(seat)}
                        disabled={isBooked}
                        className={`p-2 rounded ${
                          isBooked
                            ? "bg-red-500 text-white cursor-not-allowed"
                            : isSelected
                            ? "bg-green-500 text-white"
                            : "bg-gray-200"
                        } ${aisleClass}`}
                      >
                        {seat}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-80 p-4 bg-gray-50 rounded-lg shadow-md flex-shrink-0">
          <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
          <div className="mb-2">
            <strong>Movie:</strong> {movie.title}
          </div>
          <div className="mb-2">
            <strong>Screen:</strong> {selectedScreen || "Not selected"}
          </div>
          <div className="mb-2">
            <strong>Time:</strong> {selectedTime || "Not selected"}
          </div>
          <div className="mb-2">
            <strong>Seats:</strong>{" "}
            {selected.length > 0 ? selected.join(", ") : "None"}
          </div>
          {selected.length > 0 && (
            <div className="mb-2">
              <strong>Seat Prices:</strong>
              <ul className="list-disc list-inside">
                {selected.map((seat) => (
                  <li key={seat}>
                    {seat}: ₹{rowPrices[seat[0]]}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-4 font-semibold text-lg">Total: ₹{totalAmount}</div>
          <button
            onClick={confirmBooking}
            disabled={selected.length === 0 || !selectedTime || !selectedScreen}
            className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
