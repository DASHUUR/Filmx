
import axios from 'axios';

const TMDB_TOKEN =
  process.env.EXPO_PUBLIC_TMDB_TOKEN?.trim();

export const tmdbClient = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 15000,
  headers: {
    accept: 'application/json',
    ...(TMDB_TOKEN
      ? { Authorization: `Bearer ${TMDB_TOKEN}` }
      : {}),
  },
});

export const IMAGE_BASE_URL =
  'https://image.tmdb.org/t/p/';

export const getPosterUrl = (path: string | null) => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}w500${path}`;
};

export const getBackdropUrl = (path: string | null) => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}w1280${path}`;
};
