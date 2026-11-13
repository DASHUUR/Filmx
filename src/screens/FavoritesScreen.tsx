import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';

import MovieCard from '../components/MovieCard';
import { useFavoriteStore } from '../store/favoriteStore';
import { COLORS } from '../constants/colors';

export default function FavoritesScreen() {
  const [tab, setTab] = useState<'favorites' | 'watchlist'>('favorites');

  const favorites = useFavoriteStore((state) => state.favorites);
  const watchlist = useFavoriteStore((state) => state.watchlist);

  const data = tab === 'favorites' ? favorites : watchlist;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Library</Text>

      <View style={styles.tabs}>
        <Pressable
          onPress={() => setTab('favorites')}
          style={[styles.tab, tab === 'favorites' && styles.activeTab]}
        >
          <Text style={styles.tabText}>Favorites</Text>
        </Pressable>

        <Pressable
          onPress={() => setTab('watchlist')}
          style={[styles.tab, tab === 'watchlist' && styles.activeTab]}
        >
          <Text style={styles.tabText}>Watchlist</Text>
        </Pressable>
      </View>

      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <MovieCard movie={item} />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {tab === 'favorites'
              ? 'No favorite movies yet.'
              : 'Your watchlist is empty.'}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 55,
  },
  heading: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 25,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 5,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 9,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  empty: {
    color: COLORS.secondary,
    textAlign: 'center',
    marginTop: 70,
  },
});