import React, { useEffect, useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RootNavigator from './src/navigation/RootNavigator';
import Loading from './src/components/Loading';

import { useFavoriteStore } from './src/store/favoriteStore';
import { useAuthStore } from './src/store/authStore';

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
      await Promise.all([
        loadFavorites(),
        loadUser(),
      ]);

      setReady(true);
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