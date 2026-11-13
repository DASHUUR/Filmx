import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Movie } from '../types/movie';

interface FavoriteState {
  favorites: Movie[];
  watchlist: Movie[];
  hydrated: boolean;

  loadData: () => Promise<void>;
  toggleFavorite: (movie: Movie) => Promise<void>;
  toggleWatchlist: (movie: Movie) => Promise<void>;
  isFavorite: (id: number) => boolean;
  isWatchlisted: (id: number) => boolean;
}

export const useFavoriteStore = create<FavoriteState>(
  (set, get) => ({
    favorites: [],
    watchlist: [],
    hydrated: false,

    loadData: async () => {
      try {
        const favorites = await AsyncStorage.getItem('favorites');
        const watchlist = await AsyncStorage.getItem('watchlist');

        set({
          favorites: favorites ? JSON.parse(favorites) : [],
          watchlist: watchlist ? JSON.parse(watchlist) : [],
          hydrated: true,
        });
      } catch (error) {
        console.log('Storage error:', error);
        set({ hydrated: true });
      }
    },

    toggleFavorite: async (movie) => {
      const current = get().favorites;

      const updated = current.some((item) => item.id === movie.id)
        ? current.filter((item) => item.id !== movie.id)
        : [...current, movie];

      set({ favorites: updated });

      await AsyncStorage.setItem(
        'favorites',
        JSON.stringify(updated)
      );
    },

    toggleWatchlist: async (movie) => {
      const current = get().watchlist;

      const updated = current.some((item) => item.id === movie.id)
        ? current.filter((item) => item.id !== movie.id)
        : [...current, movie];

      set({ watchlist: updated });

      await AsyncStorage.setItem(
        'watchlist',
        JSON.stringify(updated)
      );
    },

    isFavorite: (id) =>
      get().favorites.some((movie) => movie.id === id),

    isWatchlisted: (id) =>
      get().watchlist.some((movie) => movie.id === id),
  })
);