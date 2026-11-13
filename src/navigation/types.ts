import { Movie } from '../types/movie';

export type RootStackParamList = {
  MainTabs: undefined;

  MovieDetails: {
    movie: Movie;
  };

  Login: undefined;

  Register: undefined;
};

export type TabParamList = {
  Home: undefined;

  Search: undefined;

  Favorites: undefined;

  Profile: undefined;
};