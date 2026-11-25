
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

import { auth, db } from "../../config/firebase";
import { Movie } from "../../types/movie";

export type MovieList = "favorites" | "watchlist";

// Хэрэглэгчийн эрхийг шалгах
const checkUser = (userId: string) => {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    throw new Error("Unauthorized user.");
  }
};

// Firestore collection-ийн зам
const getMovieCollection = (
  userId: string,
  list: MovieList
) => {
  checkUser(userId);

  return collection(
    db,
    "users",
    userId,
    list
  );
};

// Undefined утгуудыг цэвэрлэх
const cleanMovie = (movie: Movie): Movie => {
  return JSON.parse(JSON.stringify(movie)) as Movie;
};

// READ — Хадгалсан кинонуудыг татах
export const getSavedMovies = async (
  userId: string,
  list: MovieList
): Promise<Movie[]> => {
  console.log("========== FIRESTORE READ ==========");
  console.log("USER UID:", userId);
  console.log("COLLECTION:", list);

  const snapshot = await getDocs(
    getMovieCollection(userId, list)
  );

  const movies = snapshot.docs.map(
    (document) => document.data() as Movie
  );

  console.log("STATUS: SUCCESS");
  console.log("TOTAL MOVIES:", movies.length);

  return movies;
};

// CREATE / UPDATE — Кино хадгалах
export const saveMovie = async (
  userId: string,
  list: MovieList,
  movie: Movie
): Promise<void> => {
  const movieRef = doc(
    getMovieCollection(userId, list),
    String(movie.id)
  );

  console.log("========== FIRESTORE SAVE ==========");
  console.log("USER UID:", userId);
  console.log("COLLECTION:", list);
  console.log("MOVIE ID:", movie.id);
  console.log("MOVIE TITLE:", movie.title);

  await setDoc(movieRef, cleanMovie(movie));

  console.log("STATUS: SUCCESS");
};

// DELETE — Хадгалсан кино устгах
export const removeMovie = async (
  userId: string,
  list: MovieList,
  movieId: number
): Promise<void> => {
  const movieRef = doc(
    getMovieCollection(userId, list),
    String(movieId)
  );

  console.log("========== FIRESTORE DELETE ==========");
  console.log("USER UID:", userId);
  console.log("COLLECTION:", list);
  console.log("MOVIE ID:", movieId);

  await deleteDoc(movieRef);

  console.log("STATUS: SUCCESS");
};
