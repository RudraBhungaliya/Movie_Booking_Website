import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SeatSelector from './SeatSelector'; // Using your component folder structure

export default function BookingPage() {
  const { id } = useParams(); // FIX: Use 'id' to match your router path "/book/:id"
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMovieData() {
      try {
        const res = await fetch(`http://localhost:5000/movies/${id}`); // FIX: Use 'id' in the fetch URL
        if (!res.ok) {
          throw new Error('Movie not found in the database.');
        }
        const data = await res.json();
        if (data.success) {
          setMovie(data.movie);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to load movie data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
        fetchMovieData();
    }
  }, [id]); // FIX: Use 'id' in the dependency array

  if (loading) {
    return <div className="p-8 text-center">Loading Movie...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }
  
  return (
    <div>
      {movie ? (
        <SeatSelector movie={movie} />
      ) : (
        <div className="p-8 text-center">The movie could not be loaded.</div>
      )}
    </div>
  );
}