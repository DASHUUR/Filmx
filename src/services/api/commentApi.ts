import {
  ref,
  push,
  set,
  onValue,
  update,
  remove,
  serverTimestamp,
} from "firebase/database";

import { auth, rtdb } from "../../config/firebase";
import { Comment } from "../../types/comment";

// Нэвтэрсэн хэрэглэгч шалгах
const requireUser = async () => {
  await auth.authStateReady();

  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please login first.");
  }

  return user;
};

// Сэтгэгдлийн текст шалгах
const validateText = (text: string): string => {
  const value = text.trim();

  if (!value || value.length > 500) {
    throw new Error(
      "Comment must contain 1-500 characters."
    );
  }

  return value;
};

// CREATE - Сэтгэгдэл нэмэх
export const addComment = async (
  movieId: number,
  text: string
): Promise<void> => {
  const user = await requireUser();
  const value = validateText(text);

  const commentsRef = ref(
    rtdb,
    `comments/${movieId}`
  );

  const newCommentRef = push(commentsRef);

  const comment = {
    userId: user.uid,
    userName: (
      user.displayName?.trim() || "User"
    ).slice(0, 100),
    text: value,
    createdAt: serverTimestamp(),
  };

  console.log("========== COMMENT CREATE ==========");
  console.log("DATABASE: Firebase Realtime Database");
  console.log("MOVIE ID:", movieId);
  console.log("USER UID:", user.uid);
  console.log("COMMENT ID:", newCommentRef.key);

  await set(newCommentRef, comment);

  console.log("STATUS: SUCCESS");
};

// READ + REALTIME - Сэтгэгдэл сонсох
export const subscribeToComments = (
  movieId: number,
  callback: (comments: Comment[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const commentsRef = ref(
    rtdb,
    `comments/${movieId}`
  );

  console.log("========== REALTIME LISTENER ==========");
  console.log("MOVIE ID:", movieId);

  return onValue(
    commentsRef,
    (snapshot) => {
      const comments: Comment[] = [];

      snapshot.forEach((child) => {
        const data = child.val();

        comments.push({
          id: child.key!,
          userId: data.userId,
          userName: data.userName,
          text: data.text,
          createdAt: data.createdAt,
        });
      });

      comments.sort(
        (a, b) => b.createdAt - a.createdAt
      );

      console.log("========== COMMENTS UPDATED ==========");
      console.log("MOVIE ID:", movieId);
      console.log("TOTAL COMMENTS:", comments.length);
      console.log("STATUS: SUCCESS");

      callback(comments);
    },
    (error) => {
      console.log("COMMENT READ ERROR:", error);
      onError?.(error);
    }
  );
};

// UPDATE - Сэтгэгдэл засах
export const updateComment = async (
  movieId: number,
  commentId: string,
  text: string
): Promise<void> => {
  await requireUser();

  const value = validateText(text);

  const commentRef = ref(
    rtdb,
    `comments/${movieId}/${commentId}`
  );

  console.log("========== COMMENT UPDATE ==========");
  console.log("MOVIE ID:", movieId);
  console.log("COMMENT ID:", commentId);

  await update(commentRef, {
    text: value,
  });

  console.log("STATUS: SUCCESS");
};

// DELETE - Сэтгэгдэл устгах
export const deleteComment = async (
  movieId: number,
  commentId: string
): Promise<void> => {
  await requireUser();

  const commentRef = ref(
    rtdb,
    `comments/${movieId}/${commentId}`
  );

  console.log("========== COMMENT DELETE ==========");
  console.log("MOVIE ID:", movieId);
  console.log("COMMENT ID:", commentId);

  await remove(commentRef);

  console.log("STATUS: SUCCESS");
};