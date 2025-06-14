"use client";

import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import Loading from "./Loading";

interface MovieListProps {
  intialMovies: any[]; // Replace 'any' with your movie type if available
  genres: string;
  sortMethod: string;
}

function MovieList({ intialMovies, genres, sortMethod }: MovieListProps) {
  const [movies, setMovies] = useState(intialMovies);
  const [loading, setLoading] = useState(false);
  let page = 1;

  const loadMoreMovies = async () => {
    const nextPage = page + 1;

    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${nextPage}&${
        genres != "" ? `with_genres=${genres}&` : ""
      }sort_by=${sortMethod}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      setLoading(false);
    }
    setMovies((prevMovies: any) => [...prevMovies, ...data.results]);
    page = nextPage;
  };

  useEffect(() => {
    setMovies(intialMovies);
    page = 1;
  }, [intialMovies]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoading(true);
          loadMoreMovies();
        }
      },
      { threshold: 1.0 }
    );
    const footer = document.querySelector("#footer");
    if (footer) {
      observer.observe(footer);
    }

    return () => observer.disconnect();
  }, []);
  return (
    <div>
      {loading && <Loading />}
      <div className="mt-4 md:grid md:grid-cols-4 md:gap-4 lg:gap-5 lg:grid-cols-5 xl:gap-6 xl:grid-cols-6">
        {movies.map((movie: any) => (
          <div key={movie.id}>
            <MovieCard
              movieID={movie.id}
              movieTitle={movie.title}
              moviePosterPath={movie.poster_path}
              movieReleaseDate={movie.release_date}
              movieOverview={movie.overview}
              movieVoteAvg={movie.vote_average}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieList;
