
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { User } from "../types/user";

import {
  loginUser,
  getAuthUser,
  refreshAuthToken,
  registerUser,
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
    username: string,
    password: string
  ) => Promise<void>;

  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

const SESSION_KEY = "filmx_session";
const ACCESS_KEY = "filmx_access_token";
const REFRESH_KEY = "filmx_refresh_token";

const saveSession = async (
  user: User,
  accessToken: string,
  refreshToken: string
) => {
  console.log("========== SAVE SESSION ==========");

  await SecureStore.setItemAsync(
    ACCESS_KEY,
    accessToken
  );

  console.log("ACCESS TOKEN SAVED");

  await SecureStore.setItemAsync(
    REFRESH_KEY,
    refreshToken
  );

  console.log("REFRESH TOKEN SAVED");

  await AsyncStorage.setItem(
    SESSION_KEY,
    JSON.stringify(user)
  );

  console.log("USER SESSION SAVED");

  const savedToken =
    await SecureStore.getItemAsync(ACCESS_KEY);

  console.log(
    "TOKEN READ FROM MOBILE:",
    savedToken ? "SUCCESS" : "FAILED"
  );

  console.log(
    "SAVED TOKEN MATCH:",
    savedToken === accessToken
  );
};

const clearSession = async () => {
  await SecureStore.deleteItemAsync(ACCESS_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
  await AsyncStorage.removeItem(SESSION_KEY);
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,

  register: async (
    firstName,
    lastName,
    email,
    password
  ) => {
    console.log("REGISTER REQUEST -> DummyJSON");

    await registerUser(
      firstName,
      lastName,
      email,
      password
    );

    console.log("REGISTER RESPONSE RECEIVED");
  },

  loginWithPassword: async (username, password) => {
    console.log("========== MOBILE LOGIN ==========");
    console.log("USERNAME:", username);
    console.log(
      "REQUEST URL: https://dummyjson.com/auth/login"
    );

    const result = await loginUser(
      username,
      password
    );

    const user: User = {
      id: result.id,
      username: result.username,
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
    };

    if (!result.accessToken || !result.refreshToken) {
      throw new Error("Server did not return tokens.");
    }

    await saveSession(
      user,
      result.accessToken,
      result.refreshToken
    );

    set({
      user,
      isLoggedIn: true,
    });

    console.log("LOGIN SUCCESS");
  },

  login: async (user) => {
    await AsyncStorage.setItem(
      SESSION_KEY,
      JSON.stringify(user)
    );

    set({
      user,
      isLoggedIn: true,
    });
  },

  logout: async () => {
    await clearSession();

    set({
      user: null,
      isLoggedIn: false,
    });

    console.log("LOGOUT SUCCESS");
  },

  loadUser: async () => {
    try {
      console.log("========== RESTORE SESSION ==========");

      let accessToken =
        await SecureStore.getItemAsync(ACCESS_KEY);

      const refreshToken =
        await SecureStore.getItemAsync(REFRESH_KEY);

      if (!accessToken && !refreshToken) {
        set({ user: null, isLoggedIn: false });
        return;
      }

      let serverUser;

      try {
        if (!accessToken) {
          throw new Error("Missing access token");
        }

        serverUser = await getAuthUser(accessToken);
      } catch (error) {
        if (!refreshToken) {
          throw error;
        }

        const tokens =
          await refreshAuthToken(refreshToken);

        accessToken = tokens.accessToken;

        serverUser = await getAuthUser(accessToken);

        await SecureStore.setItemAsync(
          ACCESS_KEY,
          tokens.accessToken
        );

        await SecureStore.setItemAsync(
          REFRESH_KEY,
          tokens.refreshToken
        );
      }

      const user: User = {
        id: serverUser.id,
        username: serverUser.username,
        email: serverUser.email,
        firstName: serverUser.firstName,
        lastName: serverUser.lastName,
      };

      await AsyncStorage.setItem(
        SESSION_KEY,
        JSON.stringify(user)
      );

      set({
        user,
        isLoggedIn: true,
      });

      console.log("TOKEN VERIFIED BY SERVER");
      console.log("USER:", user.username);

    } catch (error) {
      console.log("SESSION RESTORE ERROR:", error);

      set({
        user: null,
        isLoggedIn: false,
      });
    }
  },
}));
