import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

import { User } from "../types/user";
import { auth } from "../config/firebase";
import { useFavoriteStore } from "./favoriteStore";

import {
  loginUser,
  getAuthUser,
  getAuthToken,
  registerUser,
  logoutUser,
  resetPassword as resetPasswordApi,
} from "../services/api/authApi";

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;

  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;

  loginWithPassword: (
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;
  loadUser: () => Promise<void>;

  resetPassword: (email: string) => Promise<void>;
}

// Хуучин DummyJSON session устгах
const clearLegacySession = async () => {
  await SecureStore.deleteItemAsync("filmx_access_token");
  await SecureStore.deleteItemAsync("filmx_refresh_token");
  await AsyncStorage.removeItem("filmx_session");
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,

  // REGISTER
  register: async (
    firstName,
    lastName,
    email,
    password
  ) => {
    console.log("========== REGISTER ==========");
    console.log("REGISTER REQUEST -> Firebase");

    await registerUser(
      firstName,
      lastName,
      email,
      password
    );

    console.log("REGISTER SUCCESS");
  },

  // LOGIN
  loginWithPassword: async (email, password) => {
    console.log("========== MOBILE LOGIN ==========");
    console.log("EMAIL:", email);
    console.log("AUTH PROVIDER: Firebase");

    const result = await loginUser(email, password);

    const user: User = {
      id: result.id,
      username: result.username,
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
      image: result.image,
    };

    if (!result.accessToken) {
      throw new Error("Firebase ID token not received.");
    }

    const token = await getAuthToken();

    console.log("========== AUTH SESSION ==========");
    console.log("USER UID:", user.id);
    console.log("ID TOKEN RECEIVED:", Boolean(token));
    console.log(
      "TOKEN MATCH:",
      token === result.accessToken
    );

    // Өмнөх хэрэглэгчийн мэдээллийг цэвэрлэх
    useFavoriteStore.getState().clearData();

    set({
      user,
      isLoggedIn: true,
    });

    // Firestore-оос хэрэглэгчийн кинонуудыг татах
    console.log("========== LOAD USER MOVIES ==========");

    await useFavoriteStore.getState().loadData();

    console.log(
      "MOVIE DATA LOADED:",
      useFavoriteStore.getState().hydrated
    );

    console.log("LOGIN SUCCESS");
  },

  // PASSWORD RESET
  resetPassword: async (email) => {
    console.log("========== RESET PASSWORD ==========");
    console.log("RESET REQUEST -> Firebase");

    await resetPasswordApi(email);

    console.log("RESET REQUEST SUCCESS");
  },

  // LOGOUT
  logout: async () => {
    await logoutUser();

    // Хэрэглэгчийн кинонуудыг store-оос цэвэрлэх
    useFavoriteStore.getState().clearData();

    set({
      user: null,
      isLoggedIn: false,
    });

    // Guest хэрэглэгчийн мэдээллийг сэргээх
    await useFavoriteStore.getState().loadData();

    console.log("LOGOUT SUCCESS");
    console.log("USER SESSION CLEARED");
    console.log(
      "GUEST DATA LOADED:",
      useFavoriteStore.getState().hydrated
    );
  },

  // RESTORE SESSION
  loadUser: async () => {
    try {
      console.log("========== RESTORE SESSION ==========");

      await clearLegacySession().catch((error) => {
        console.log("LEGACY CLEANUP ERROR:", error);
      });

      await auth.authStateReady();

      if (!auth.currentUser) {
        set({
          user: null,
          isLoggedIn: false,
        });

        console.log("NO ACTIVE SESSION");
        return;
      }

      const serverUser = await getAuthUser();
      const token = await getAuthToken();

      const user: User = {
        id: serverUser.id,
        username: serverUser.username,
        email: serverUser.email,
        firstName: serverUser.firstName,
        lastName: serverUser.lastName,
        image: serverUser.image,
      };

      set({
        user,
        isLoggedIn: true,
      });

      console.log("SESSION RESTORED");
      console.log("USER UID:", user.id);
      console.log("USER:", user.username);
      console.log("ID TOKEN AVAILABLE:", Boolean(token));

    } catch (error) {
      console.log("SESSION RESTORE ERROR:", error);

      set({
        user: null,
        isLoggedIn: false,
      });
    }
  },
}));