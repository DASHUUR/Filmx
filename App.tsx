
import React, { useEffect, useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import RootNavigator from "./src/navigation/RootNavigator";
import Loading from "./src/components/Loading";

import { useFavoriteStore } from "./src/store/favoriteStore";
import { useAuthStore } from "./src/store/authStore";

export default function App() {
  const [ready, setReady] = useState(false);

  const loadFavorites = useFavoriteStore(
    (state) => state.loadData
  );

  const loadUser = useAuthStore(
    (state) => state.loadUser
  );

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log("========== APP INITIALIZATION ==========");

        // 1. Firebase Authentication session сэргээх
        await loadUser();

        console.log("AUTH INITIALIZATION COMPLETE");

        // 2. Favorites болон Watchlist татах
        await loadFavorites();

        console.log(
          "MOVIE DATA LOADED:",
          useFavoriteStore.getState().hydrated
        );

        console.log("APP INITIALIZATION COMPLETE");

      } catch (error) {
        console.log("APP INITIALIZATION ERROR:", error);

      } finally {
        setReady(true);
      }
    };

    initialize();
  }, [loadFavorites, loadUser]);

  if (!ready) {
    return <Loading />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
