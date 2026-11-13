import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import CategoryChip from '../components/CategoryChip';

import { searchMovies } from '../services/api/tmdbApi';
import { Movie } from '../types/movie';
import { GENRES } from '../constants/config';
import { COLORS } from '../constants/colors';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        search();
      } else {
        setMovies([]);
        setSearched(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const search = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await searchMovies(query.trim());
      setMovies(data.results);
      setSearched(true);
    } catch {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = selectedGenre
    ? movies.filter((movie) =>
        movie.genre_ids?.includes(selectedGenre)
      )
    : movies;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Discover</Text>

      <SearchBar
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={GENRES}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.genres}
        renderItem={({ item }) => (
          <CategoryChip
            title={item.name}
            selected={selectedGenre === item.id}
            onPress={() =>
              setSelectedGenre(
                selectedGenre === item.id ? null : item.id
              )
            }
          />
        )}
      />

      <Text style={styles.resultTitle}>
        {query ? 'Search Results' : 'Find your movie'}
      </Text>

      {loading ? (
        <ActivityIndicator
          color={COLORS.primary}
          size="large"
          style={{ marginTop: 40 }}
        />
      ) : error ? (
        <Text style={styles.empty}>{error}</Text>
      ) : (
        <FlatList
          data={filteredMovies}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.results}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <MovieCard movie={item} />
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {searched
                ? 'No movies found.'
                : 'Search for your favorite movies.'}
            </Text>
          }
        />
      )}
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
    marginBottom: 20,
  },
  genres: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  resultTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  results: {
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
    marginTop: 40,
  },
});