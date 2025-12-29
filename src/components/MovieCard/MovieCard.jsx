import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie, onSelect }) => {
  const navigate = useNavigate();
  const {
    original_title,
    original_name,
    title,
    vote_average,
    poster_path,
    release_date,
    original_language,
  } = movie;

  const handleClick = () => {
    if (onSelect) onSelect(movie);
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  return (
    <div className="movie-card cursor-pointer" onClick={handleClick}>
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500${poster_path}`
            : "/no-movie.png"
        }
        alt={title}
      />
      <div className="p-[10px] mt-2">
        <h2> {original_name || original_title}</h2>

        <div className="content">
          <div className="rating">
            <img src="star.svg"></img>
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
          </div>
          <span>●</span>
          <div className="lang">{original_language}</div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
