import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Trailer from "../Trailer";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const MoviePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [loading, setLoading] = useState(!movie);

  useEffect(() => {
    if (movie) return;

    const fetchMovie = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
          headers: { Authorization: `Bearer ${API_KEY}` },
        });
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, movie]);

  if (loading) return <p className="p-8">Loading...</p>;
  if (!movie) return <p className="p-8">Movie not found</p>;

  return (
    <main className="p-8">
      <h1 className="text-3xl">{movie.title || movie.name}</h1>
      <p className="mt-4 text-gray-300">{movie.overview}</p>
      <Trailer movie={movie} />
    </main>
  );
};

export default MoviePage;
