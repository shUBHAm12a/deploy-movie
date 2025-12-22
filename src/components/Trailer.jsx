import { useEffect, useState } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const Trailer = ({ movie }) => {
  const [key, setKey] = useState(null);

  useEffect(() => {
    const fetchTrailer = async () => {
      const type = movie.media_type === "tv" ? "tv" : "movie";

      const res = await fetch(
        `https://api.themoviedb.org/3/${type}/${movie.id}/videos`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      const data = await res.json();

      const trailer = data.results?.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );

      setKey(trailer?.key || null);
    };

    fetchTrailer();
  }, [movie]);

  if (!key) return <p>No trailer available</p>;

  return (
    <iframe
      className="w-full h-[400px] rounded-xl mt-4"
      src={`https://www.youtube.com/embed/${key}`}
      allowFullScreen
    />
  );
};

export default Trailer;
