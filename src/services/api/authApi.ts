import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  reload,
  User,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../../config/firebase";

const API_URL = "https://identitytoolkit.googleapis.com/v1";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
};

export type LoginResponse = AuthUser & {
  accessToken: string;
};

// Firebase хэрэглэгчийн мэдээллийг хөрвүүлэх
const mapUser = (user: User): AuthUser => {
  const names = (user.displayName || "").trim().split(/\s+/);

  return {
    id: user.uid,
    username: user.email?.split("@")[0] || "",
    email: user.email || "",
    firstName: names[0] || "",
    lastName: names.slice(1).join(" "),
    image: user.photoURL || undefined,
  };
};

// LOGIN
export const loginUser = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  console.log("========== LOGIN REQUEST ==========");
  console.log("METHOD: POST");
  console.log("SERVER:", API_URL);
  console.log("ENDPOINT: /accounts:signInWithPassword");
  console.log("EMAIL:", email.trim());
  console.log("PASSWORD: [HIDDEN]");

  const response = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  const accessToken = await response.user.getIdToken();

  console.log("========== LOGIN RESPONSE ==========");
  console.log("STATUS: SUCCESS");
  console.log("USER UID:", response.user.uid);
  console.log("EMAIL:", response.user.email);
  console.log("ID TOKEN RECEIVED:", Boolean(accessToken));

  return {
    ...mapUser(response.user),
    accessToken,
  };
};

// REGISTER
export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Promise<AuthUser> => {
  console.log("========== REGISTER REQUEST ==========");
  console.log("METHOD: POST");
  console.log("SERVER:", API_URL);
  console.log("ENDPOINT: /accounts:signUp");
  console.log("EMAIL:", email.trim());
  console.log("PASSWORD: [HIDDEN]");

  const response = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  await updateProfile(response.user, {
    displayName: `${firstName.trim()} ${lastName.trim()}`,
  });

  const user = mapUser(response.user);

  console.log("========== REGISTER RESPONSE ==========");
  console.log("STATUS: SUCCESS");
  console.log("USER UID:", user.id);
  console.log("EMAIL:", user.email);

  // Бүртгүүлсний дараа Login screen рүү шилжихэд
  // зориулж Firebase session-ийг хаана.
  await signOut(auth);

  return user;
};

// GET AUTH USER
export const getAuthUser = async (): Promise<AuthUser> => {
  await auth.authStateReady();

  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not logged in.");
  }

  await reload(user);

  console.log("========== AUTH USER ==========");
  console.log("USER UID:", user.uid);
  console.log("EMAIL:", user.email);
  console.log("STATUS: SUCCESS");

  return mapUser(user);
};

// GET TOKEN
export const getAuthToken = async (): Promise<string> => {
  await auth.authStateReady();

  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not logged in.");
  }

  const token = await user.getIdToken();

  console.log("ID TOKEN AVAILABLE:", Boolean(token));

  return token;
};

// REFRESH TOKEN
export const refreshAuthToken = async (): Promise<{
  accessToken: string;
}> => {
  await auth.authStateReady();

  const user = auth.currentUser;

  if (!user) {
    throw new Error("User is not logged in.");
  }

  const accessToken = await user.getIdToken(true);

  console.log("========== TOKEN REFRESH ==========");
  console.log("TOKEN REFRESHED:", Boolean(accessToken));

  return { accessToken };
};

// LOGOUT
export const logoutUser = async (): Promise<void> => {
  await signOut(auth);

  console.log("========== LOGOUT ==========");
  console.log("STATUS: SUCCESS");
  console.log("CURRENT USER:", auth.currentUser);
};

export const resetPassword = async (
  email: string
): Promise<void> => {
  const cleanEmail = email.trim();

  if (!cleanEmail) {
    throw new Error("Email is required.");
  }

  console.log("========== PASSWORD RESET ==========");
  console.log("METHOD: POST");
  console.log("ENDPOINT: /accounts:sendOobCode");

  await sendPasswordResetEmail(auth, cleanEmail);

  console.log("STATUS: SUCCESS");
};