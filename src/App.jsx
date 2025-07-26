import React, { useState, useEffect } from 'react'
import { Search } from './components/Search'
// import { Spinner } from './components/Spinner'
import Spinner from './components/Spinner'
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { updateSearchCount, getTrendingMovies } from './appwrite.js';

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`

  }
}

const App = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState('');

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      console.log(query);
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      // alert(response);
      if (!response.ok) {
        throw new Error('Error fetching movies');
      }
      const data = await response.json();
      // console.log(data);

      if (data.Response == 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      // updateSearchCount();
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }


    } catch (error) {
      console.error(`Error Fetching Movies ${error}`);
      setErrorMessage("Error fetching moveies please try again later")
    } finally {
      setIsLoading(false);
    }

  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className='pattern' />
      <div className='wrapper'>
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className='text-gradient'>Movies</span> you will enjoy without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) =>
                <li key={movie.$id}>
                  <p>
                    {index + 1}
                  </p>
                  <img src={movie.poster_url} alt={movie.title} />

                </li>

              )}
            </ul>
          </section>
        )}

        <section className='all-movies'>
          <h2> All movies </h2>
          {/* {errorMessage && <p className='text-red-500'> {errorMessage} </p>} */}

          {isLoading ? (<Spinner />) : errorMessage ?
            (errorMessage && <p className='text-red-500'> {errorMessage} </p>) :
            <ul>
              {movieList.map((movie) => (
                // <p key={movie.id} className='text-white'>{movie.title}</p>
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          }
        </section>
      </div>
      <h6 className="text-white text-xl text-center mt-4">{searchTerm}</h6>
    </main >
  )
}
export default App













// old code

// // import { Component, useState } from 'react'
// // import reactLogo from './assets/react.svg'
// // import viteLogo from '/vite.svg'
// import { useState, useEffect } from 'react'  // to use use State (in react whatever starts with 'use' is usually a hook)
// import './App.css'



// // function App() {
// // }

// // const stateVariable = 0;
// // const hasLiked = true;

// const Card = ({ title }) => {
//   const [count, setCount] = useState(0);
//   const [hasLiked, setHasLiked] = useState(false);

//   useEffect(() => {
//     console.log(`${title} has been liked ${hasLiked} this many times ${count}`);
//   }, [hasLiked]);

//   // useEffect(() => { console.log('Card Rendered') }), [];


//   return (
//     <div className='card' onClick={() => setCount(count + 1)}>
//       <h2>{title} <br /> {count}</h2>

//       <button onClick={() => setHasLiked(!hasLiked)} >{hasLiked ? '🧡' : '🤍'} </button>
//     </div >
//   )
// }

// const App = () => {
//   //defining state
//   //here hasLiked is the name of the variable (boolean variable here), 
//   //setter function to update thas 
//   // const [hasLiked, setHasLiked] = useState(initialState: false);


//   return (
//     <div className='card-container'>
//       {/* <h2>Functional arrow components</h2> */}
//       <Card title="Star Wars" rating={5} isCool={true} /*rating={5} isCool={true} action={[{ name: 'Actors' }]}*/ />
//       <Card title="Avatar" />
//       <Card title="The lion king" />
//     </div>
//   )
// }


// export default App
