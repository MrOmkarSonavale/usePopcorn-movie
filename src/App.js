import { useEffect, useReducer, useRef, useState } from "react";
import StarRating from "./StarRating";


const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const apiKey = "5f29cd88";


export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, isLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setselectedId] = useState("");

  // const [watched, setWatched] = useState([]);
  const [watched, setWatched] = useState(() => {
    const storesValue = localStorage.getItem('watched')
    return JSON.parse(storesValue);
  });

  function handelSelectMovie(id) {
    setselectedId(id);
  }

  function handelCloseMovie() {
    setselectedId("");
  }


  function addWatchMovie(movie) {
    setWatched((watched) => [...watched, movie])

  }

  useEffect(function () {
    localStorage.setItem('watched', JSON.stringify(watched));
  }, [watched])

  const controller = new AbortController();
  useEffect(function () {
    async function fetchMovies() {
      try {
        setError("");
        isLoading(true);

        const res = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`,
          {
            signal: controller.signal
          });

        if (!res.ok) throw new Error('something went wrong!');

        const data = await res.json();
        console.log(data);
        if (data.Response === 'False') throw new Error(data.Error);

        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        isLoading(false);
      }
    };

    if (query.length < 3) {
      setMovies([]);
      setError(false);
      return
    }


    handelCloseMovie();
    fetchMovies();

    return function () {
      controller.abort();
    }
  }, [query])



  return (
    <>
      <Navbar>
        <SearchBar
          query={query}
          setQuery={setQuery}

        />
        <NumResult movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {
            loading && <Loader />
          }
          {
            !loading && !error && <MoviesList movies={movies} onSelectMovie={handelSelectMovie} />
          }
          {
            error && <ErrorMessage message={error} />
          }
        </Box>
        <Box>
          {
            selectedId ?
              <MovieDetails
                selectedId={selectedId}
                onCloseMoive={handelCloseMovie}
                onWatchMovie={addWatchMovie}
                watched={watched}
              /> :
              <>
                <WatchSummary watched={watched} />
                <WatchList watched={watched}
                />
              </>
          }
        </Box>
      </Main>
    </>
  );
}

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function Loader() {
  return <p className="loader">loading...</p>
}


function ErrorMessage({ message }) {
  return <p className="error">
    <span>❌</span>{message}
  </p>
}



function MovieDetails({ selectedId, onCloseMoive, onWatchMovie, watched }) {
  const [movie, setMovies] = useState({});
  const [loading, setloading] = useState(false);
  const [userRating, setuserRating] = useState("");
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const isUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

  const {
    Actors: actors,
    Awards: awards,
    Countru: country,
    Director: director,
    Genre: genre,
    imdbRating,
    imdbID,
    Title: title,
    Language: language,
    Poster: poster,
    Rated: rated,
    Runtime: runtime,
    Released: released,
    Plot: plot
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      rated,
      runtime: Number(runtime.split(' ').at(0)),
      poster,
      imdbRating: Number(imdbRating),
      userRating
    }

    onWatchMovie(newWatchedMovie);
    onCloseMoive();
  }



  useEffect(function () {
    async function getMoviesDetail() {
      setloading(true);

      const res = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${selectedId}`);

      const data = await res.json();

      setMovies(data);
      // console.log(data)
      setloading(false);
    }

    getMoviesDetail();
  }, [selectedId])


  useEffect(function () {
    function callback(e) {
      if (e.code === 'Escape') {
        onCloseMoive();
      }
    }

    document.addEventListener('keydown', callback);


    return function () {
      document.removeEventListener('keydown', callback);
    }

  }, [onCloseMoive]);

  useEffect(function () {
    if (!title) return;

    document.title = `Moive | ${title}`;

    return function () {
      document.title = 'usePopcorn';
    }

  }, [title]);

  return (
    <div className="details">
      {loading ? <Loader /> :
        <>
          <header>
            <button className="btn-back" onClick={onCloseMoive}>
              &larr;
            </button>

            <img src={poster} alt={title} />

            <div className="details-overview">
              <h2>{title}</h2>
              <p>{released} <span>⌛</span>{runtime}</p>
              <p>{genre}</p>
              <p> <span>⭐</span>{rated} IMDb rating</p>
            </div>
          </header>
          <section>
            <div className="rating">

              {
                !isWatched ? (
                  <>
                    <StarRating
                      color="yellow"
                      size={24} maxRating="10"
                      onSetRating={setuserRating}

                    />
                    {
                      userRating > 0 && (
                        <button
                          className="btn-add"
                          onClick={handleAdd}>+ Add to list
                        </button>
                      )
                    }
                  </>
                ) : (
                  <p>You rated this movie {isUserRating} <span>⭐</span></p>
                )
              }

            </div>
            <em>{plot}</em>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      }
    </div>
  );
}

function SearchBar({ query, setQuery }) {

  const inputEl = useRef(null);

  function callback(e) {

    if (document.activeElement === inputEl.current) return;

    if (e.code === 'Enter') {
      inputEl.current.focus();
      setQuery("");
    }
  }

  useEffect(function () {

    document.addEventListener('keydown', callback)

    return () => document.removeEventListener('keydown', callback);

  })

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  )
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}

function NumResult({ movies }) {
  return (<p className="num-results ">
    Found <strong>{movies.length}</strong> results
  </p>
  )
}

function Navbar({ children }) {

  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  )
}

function Main({ children }) {

  return (
    <main className="main">
      {children}
    </main>
  )
}

/***************************/
// all component of all movies
/*************************/




function MovieListItem({ movie, onSelectMovie }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>📅</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}

function MoviesList({ movies, onSelectMovie }) {

  return (
    <ul className="list">
      {
        movies?.map((movie) =>
          <MovieListItem
            movie={movie}
            key={movie.imdbID}
            onSelectMovie={onSelectMovie}
          />

        )
      }
    </ul>
  )
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}

    </div>
  )
}


/***************************/
// all component of watch movies
/*************************/
function WatchMovieItem({ movie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  )
}

function WatchList({ watched }) {

  return (
    <ul className="list">
      {watched.map(movie => <WatchMovieItem movie={movie} key={movie.imdbID} />)}
    </ul>
  )
}



function WatchSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie?.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  )
}








