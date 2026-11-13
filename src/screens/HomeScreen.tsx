
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from 'react-native';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';

import MovieCard from '../components/MovieCard';
import {
  getPopularMovies,
  getTrendingMovies,
} from '../services/api/tmdbApi';
import { Movie } from '../types/movie';
import { COLORS } from '../constants/colors';

export default function HomeScreen() {
  const [popular, setPopular] = useState<Movie[]>([]);
  const [trending, setTrending] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    setError('');

    const results = await Promise.allSettled([
      getPopularMovies(),
      getTrendingMovies(),
    ]);

    const [popularResult, trendingResult] = results;

    if (popularResult.status === 'fulfilled') {
      setPopular(popularResult.value.results || []);
    } else {
      setPopular([]);
    }

    if (trendingResult.status === 'fulfilled') {
      setTrending(trendingResult.value.results || []);
    } else {
      setTrending([]);
    }

    const failed = results.find(
      (result) => result.status === 'rejected'
    );

    if (failed && failed.status === 'rejected') {
      const err = failed.reason;

      if (axios.isAxiosError(err)) {
        console.log('TMDB STATUS:', err.response?.status);
        console.log('TMDB ERROR:', err.response?.data);

        if (err.response?.status === 401) {
          setError('TMDB API token буруу эсвэл байхгүй байна.');
        } else if (err.response?.status === 429) {
          setError('API хүсэлтийн хязгаарт хүрсэн байна.');
        } else if (!err.response) {
          setError('Интернэт эсвэл TMDB сервертэй холбогдож чадсангүй.');
        } else {
          setError(`TMDB API алдаа: ${err.response.status}`);
        }
      } else {
        console.log('HOME ERROR:', err);
        setError('Киноны мэдээлэл ачаалахад алдаа гарлаа.');
      }
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />
        <Text style={styles.loadingText}>
          Filmx ачаалж байна...
        </Text>
      </View>
    );
  }

  if (error && !popular.length && !trending.length) {
    return (
      <View style={styles.center}>
        <Ionicons
          name="cloud-offline-outline"
          size={55}
          color={COLORS.primary}
        />

        <Text style={styles.error}>{error}</Text>

        <Pressable
          style={styles.retryButton}
          onPress={loadMovies}
        >
          <Ionicons
            name="refresh"
            size={18}
            color={COLORS.white}
          />
          <Text style={styles.retryText}>
            Try Again
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>FILMX</Text>
        <Text style={styles.subtitle}>
          Discover your next movie.
        </Text>
      </View>

      {!!error && (
        <Text style={styles.warning}>
          {error}
        </Text>
      )}

      {trending.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="flame"
              size={22}
              color={COLORS.primary}
            />
            <Text style={styles.sectionTitle}>
              Trending Now
            </Text>
          </View>

          <FlatList
            horizontal
            data={trending}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <MovieCard movie={item} />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        </>
      )}

      {popular.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="star"
              size={22}
              color="#FACC15"
            />
            <Text style={styles.sectionTitle}>
              Popular Movies
            </Text>
          </View>

          <FlatList
            horizontal
            data={popular}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <MovieCard movie={item} />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.list}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 25,
  },
  logo: {
    color: COLORS.primary,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 3,
  },
  subtitle: {
    color: COLORS.secondary,
    fontSize: 13,
    marginTop: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },
  list: {
    paddingLeft: 20,
    paddingBottom: 15,
  },
  center: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  loadingText: {
    color: COLORS.white,
    marginTop: 12,
  },
  error: {
    color: COLORS.white,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 15,
    lineHeight: 23,
  },
  warning: {
    color: '#FACC15',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: '700',
  },
});
