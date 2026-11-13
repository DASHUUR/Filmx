import { tmdbClient } from './apiClient';

import { MovieResponse } from '../../types/movie';

export const getPopularMovies = async (): Promise<MovieResponse> => {
  const response = await tmdbClient.get('/movie/popular');

  return response.data;
};

export const getTrendingMovies = async (): Promise<MovieResponse> => {
  const response = await tmdbClient.get('/trending/movie/week');

  return response.data;
};

export const getTopRatedMovies = async (): Promise<MovieResponse> => {
  const response = await tmdbClient.get('/movie/top_rated');

  return response.data;
};

export const getUpcomingMovies = async (): Promise<MovieResponse> => {
  const response = await tmdbClient.get('/movie/upcoming');

  return response.data;
};

export const searchMovies = async (
  query: string
): Promise<MovieResponse> => {
  const response = await tmdbClient.get('/search/movie', {
    params: {
      query,
    },
  });

  return response.data;
};

export const getMovieDetails = async (id: number) => {
  const response = await tmdbClient.get(`/movie/${id}`);

  return response.data;
};

export const getMovieCredits = async (id: number) => {
  const response = await tmdbClient.get(`/movie/${id}/credits`);
  return response.data;
};