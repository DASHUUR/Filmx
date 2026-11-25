
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Movie } from "../types/movie";
import { auth } from "../config/firebase";

import {
  getSavedMovies,
  saveMovie,
  removeMovie,
  MovieList,
} from "../services/api/firestoreApi";

interface FavoriteState {
  favorites: Movie[];
  watchlist: Movie[];
  hydrated: boolean;
  ownerId: string | null;

  loadData: () => Promise<void>;
  clearData: () => void;

  toggleFavorite: (movie: Movie) => Promise<void>;
  toggleWatchlist: (movie: Movie) => Promise<void>;

  isFavorite: (id: number) => boolean;
  isWatchlisted: (id: number) => boolean;
}

// Guest хэрэглэгчийн storage key
const GUEST_KEYS = {
  favorites: "favorites",
  watchlist: "watchlist",
};

// Хуучин request-ээс хамгаалах
let loadVersion = 0;

// Давхар хадгалах үйлдлээс хамгаалах
const pending = new Set<string>();

export const useFavoriteStore = create<FavoriteState>(
  (set, get) => {

    // Favorites болон Watchlist-ийн нэгдсэн функц
    const toggleMovie = async (
      list: MovieList,
      movie: Movie
    ): Promise<void> => {
      await auth.authStateReady();

      const userId = auth.currentUser?.uid ?? null;

      if (
        !get().hydrated ||
        get().ownerId !== userId
      ) {
        await get().loadData();
      }

      if (
        !get().hydrated ||
        get().ownerId !== userId ||
        (auth.currentUser?.uid ?? null) !== userId
      ) {
        return;
      }

      const key = JSON.stringify([userId, list]);

      if (pending.has(key)) return;

      pending.add(key);

      const version = loadVersion;
      const current = get()[list];

      const exists = current.some(
        (item) => item.id === movie.id
      );

      const updated = exists
        ? current.filter(
            (item) => item.id !== movie.id
          )
        : [...current, movie];

      // UI-г шууд шинэчлэх
      set(
        list === "favorites"
          ? { favorites: updated }
          : { watchlist: updated }
      );

      try {
        if (userId) {
          // Login хийсэн хэрэглэгч
          if (exists) {
            await removeMovie(
              userId,
              list,
              movie.id
            );
          } else {
            await saveMovie(
              userId,
              list,
              movie
            );
          }

          console.log("========== CLOUD STORAGE ==========");
          console.log("USER UID:", userId);
          console.log("COLLECTION:", list);
          console.log(
            "ACTION:",
            exists ? "DELETE" : "SAVE"
          );
          console.log("STATUS: SUCCESS");

        } else {
          // Guest хэрэглэгч
          await AsyncStorage.setItem(
            GUEST_KEYS[list],
            JSON.stringify(updated)
          );

          console.log("========== LOCAL STORAGE ==========");
          console.log("USER: GUEST");
          console.log("LIST:", list);
          console.log("STATUS: SUCCESS");
        }

      } catch (error) {
        // Алдаа гарвал өмнөх төлөвт буцаах
        if (
          version === loadVersion &&
          get().ownerId === userId &&
          (auth.currentUser?.uid ?? null) === userId
        ) {
          set(
            list === "favorites"
              ? { favorites: current }
              : { watchlist: current }
          );
        }

        console.log("SAVE MOVIE ERROR:", error);

      } finally {
        pending.delete(key);
      }
    };

    return {
      favorites: [],
      watchlist: [],
      hydrated: false,
      ownerId: null,

      // Хадгалсан кинонуудыг татах
      loadData: async () => {
        const version = ++loadVersion;

        set({
          favorites: [],
          watchlist: [],
          hydrated: false,
          ownerId: null,
        });

        try {
          await auth.authStateReady();

          const userId =
            auth.currentUser?.uid ?? null;

          let favorites: Movie[] = [];
          let watchlist: Movie[] = [];

          if (userId) {
            console.log("========== LOAD CLOUD DATA ==========");
            console.log("USER UID:", userId);

            [favorites, watchlist] =
              await Promise.all([
                getSavedMovies(userId, "favorites"),
                getSavedMovies(userId, "watchlist"),
              ]);

          } else {
            console.log("========== LOAD LOCAL DATA ==========");
            console.log("USER: GUEST");

            const [localFavorites, localWatchlist] =
              await Promise.all([
                AsyncStorage.getItem(
                  GUEST_KEYS.favorites
                ),
                AsyncStorage.getItem(
                  GUEST_KEYS.watchlist
                ),
              ]);

            favorites = localFavorites
              ? JSON.parse(localFavorites)
              : [];

            watchlist = localWatchlist
              ? JSON.parse(localWatchlist)
              : [];
          }

          // Хэрэглэгч солигдсон эсэхийг шалгах
          if (
            version !== loadVersion ||
            (auth.currentUser?.uid ?? null) !== userId
          ) {
            return;
          }

          set({
            favorites,
            watchlist,
            hydrated: true,
            ownerId: userId,
          });

          console.log("FAVORITES:", favorites.length);
          console.log("WATCHLIST:", watchlist.length);
          console.log("LOAD DATA SUCCESS");

        } catch (error) {
          console.log("LOAD DATA ERROR:", error);

          if (version === loadVersion) {
            set({
              favorites: [],
              watchlist: [],
              hydrated: false,
              ownerId: null,
            });
          }
        }
      },

      // Store-ийн мэдээллийг цэвэрлэх
      clearData: () => {
        loadVersion++;

        set({
          favorites: [],
          watchlist: [],
          hydrated: false,
          ownerId: null,
        });

        console.log("FAVORITE STORE CLEARED");
      },

      toggleFavorite: async (movie) => {
        await toggleMovie("favorites", movie);
      },

      toggleWatchlist: async (movie) => {
        await toggleMovie("watchlist", movie);
      },

      isFavorite: (id) =>
        get().favorites.some(
          (movie) => movie.id === id
        ),

      isWatchlisted: (id) =>
        get().watchlist.some(
          (movie) => movie.id === id
        ),
    };
  }
);
