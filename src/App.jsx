import { useEffect, useState, useRef } from "react";
import { useDebounce } from "react-use";
import Trailer from "./components/Trailer.jsx";
import Search from "./components/Search.jsx";
import Loader from "./components/Loader.jsx";
import MovieCard from "./components/Moviecard.jsx";
import { Routes, Route } from "react-router-dom";
import MoviePage from "./components/MoviePage.jsx";

import { getTrendingMovies, updateSearchCount } from "./components/appwrite.js";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const Home = () => {
  const topRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  // Debounce search input
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 700, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/multi?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/trending/all/day?language=en-US`;

      const response = await fetch(endpoint, API_OPTIONS);
      const data = await response.json();

      if (!data.results) {
        setErrorMessage("Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setErrorMessage("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    getTrendingMovies().then(setTrendingMovies);
  }, []);

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="Hero" />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>

            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

      

          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2>TRENDING MOVIES</h2>

              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={`trending-${index}`}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url}></img>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="all-movies">
            <h2>ALL MOVIES</h2>

            {isLoading ? (
              <Loader />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onSelect={setSelectedMovie}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/movie/:id" element={<MoviePage />} />
    </Routes>
  );
};

export default App;
