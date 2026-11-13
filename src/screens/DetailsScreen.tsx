
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

import { RootStackParamList } from '../navigation/types';
import { getMovieDetails, getMovieCredits } from '../services/api/tmdbApi';
import { getMovieTrailer } from '../services/api/youtubeApi';
import { useFavoriteStore } from '../store/favoriteStore';
import { COLORS } from '../constants/colors';
import { IMAGE_BASE_URL } from '../services/api/apiClient';

type DetailsRoute = RouteProp<RootStackParamList, 'MovieDetails'>;

type CastMember = {
  id: number;
  name: string;
  character?: string;
  profile_path: string | null;
};

type CrewMember = {
  id: number;
  name: string;
  job: string;
};

type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  runtime?: number;
  original_language?: string;
  tagline?: string;
  genres?: { id: number; name: string }[];
  status?: string;
  budget?: number;
  revenue?: number;
};

export default function DetailsScreen() {
  const route = useRoute<DetailsRoute>();
  const { movie } = route.params;

  const [details, setDetails] = useState<MovieDetails>(movie);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [director, setDirector] = useState('');
  const [trailer, setTrailer] = useState('');
  const [loading, setLoading] = useState(true);

  const toggleFavorite = useFavoriteStore(
    (state) => state.toggleFavorite
  );
  const toggleWatchlist = useFavoriteStore(
    (state) => state.toggleWatchlist
  );
  const isFavorite = useFavoriteStore(
    (state) => state.isFavorite(movie.id)
  );
  const isWatchlisted = useFavoriteStore(
    (state) => state.isWatchlisted(movie.id)
  );

  useEffect(() => {
    let active = true;

    const loadDetails = async () => {
      setLoading(true);
      setTrailer('');
      setCast([]);
      setDirector('');
      setDetails(movie);

      const results = await Promise.allSettled([
        getMovieDetails(movie.id),
        getMovieCredits(movie.id),
        getMovieTrailer(movie.id),
      ]);

      if (!active) return;

      const [detailsResult, creditsResult, trailerResult] = results;

      if (detailsResult.status === 'fulfilled') {
        setDetails(detailsResult.value);
      } else {
        console.log('Movie details error:', detailsResult.reason);
      }

      if (creditsResult.status === 'fulfilled') {
        const credits = creditsResult.value;

        setCast((credits.cast || []).slice(0, 12));

        const directorInfo = (credits.crew || []).find(
          (person: CrewMember) => person.job === 'Director'
        );

        setDirector(directorInfo?.name || '');
      } else {
        console.log('Credits error:', creditsResult.reason);
      }

      if (trailerResult.status === 'fulfilled') {
        const video = trailerResult.value;
        if (video?.key) setTrailer(video.key);
      } else {
        console.log('Trailer error:', trailerResult.reason);
      }

      setLoading(false);
    };

    loadDetails();

    return () => {
      active = false;
    };
  }, [movie.id]);

  const openTrailer = async () => {
    if (!trailer) return;

    try {
      await Linking.openURL(
        `https://www.youtube.com/watch?v=${trailer}`
      );
    } catch {
      Alert.alert('Error', 'Unable to open trailer.');
    }
  };

  const releaseYear = details.release_date
    ? details.release_date.slice(0, 4)
    : 'Unknown';

  const genreText = details.genres?.length
    ? details.genres.map((genre) => genre.name).join(' • ')
    : 'Genre unavailable';

  const runtimeText = details.runtime
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : 'Unknown';

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <ImageBackground
        source={
          details.backdrop_path
            ? {
                uri: `${IMAGE_BASE_URL}w1280${details.backdrop_path}`,
              }
            : undefined
        }
        style={styles.backdrop}
      >
        <View style={styles.overlay}>
          <Text style={styles.movieTitle}>
            {details.title}
          </Text>

          <Text style={styles.rating}>
            ★ {details.vote_average?.toFixed(1) || 'N/A'}
            {'   '}•{'  '}{releaseYear}
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.content}>
        <View style={styles.movieHeader}>
          {details.poster_path ? (
            <Image
              source={{
                uri: `${IMAGE_BASE_URL}w500${details.poster_path}`,
              }}
              style={styles.poster}
            />
          ) : (
            <View style={[styles.poster, styles.emptyPoster]}>
              <Text style={styles.muted}>No poster</Text>
            </View>
          )}

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>
              {details.title}
            </Text>

            <Text style={styles.meta}>
              {releaseYear} • {runtimeText}
            </Text>

            <Text style={styles.genre}>
              {genreText}
            </Text>

            <Text style={styles.score}>
              ★ {details.vote_average?.toFixed(1) || 'N/A'} / 10
            </Text>
          </View>
        </View>

        {details.tagline ? (
          <Text style={styles.tagline}>
            "{details.tagline}"
          </Text>
        ) : null}

        {loading && (
          <ActivityIndicator
            color={COLORS.primary}
            style={{ marginVertical: 18 }}
          />
        )}

        <Text style={styles.heading}>Storyline</Text>

        <Text style={styles.description}>
          {details.overview || 'No description available.'}
        </Text>

        <View style={styles.infoCard}>
          <InfoRow
            label="Release Date"
            value={details.release_date || 'Unknown'}
          />
          <InfoRow
            label="Runtime"
            value={runtimeText}
          />
          <InfoRow
            label="Language"
            value={details.original_language?.toUpperCase() || 'Unknown'}
          />
          <InfoRow
            label="Status"
            value={details.status || 'Unknown'}
          />
          {director ? (
            <InfoRow label="Director" value={director} />
          ) : null}
        </View>

        <Text style={styles.heading}>Actions</Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => toggleFavorite(movie)}
        >
          <Text style={styles.buttonText}>
            {isFavorite
              ? '♥ Remove from Favorites'
              : '♡ Add to Favorites'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => toggleWatchlist(movie)}
        >
          <Text style={styles.buttonText}>
            {isWatchlisted
              ? '✓ Remove from Watchlist'
              : '+ Add to Watchlist'}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.trailerButton,
            !trailer && styles.disabledButton,
          ]}
          disabled={!trailer}
          onPress={openTrailer}
        >
          <Text style={styles.buttonText}>
            {trailer
              ? '▶ Watch Trailer'
              : loading
                ? 'Loading trailer...'
                : 'Trailer unavailable'}
          </Text>
        </Pressable>

        {cast.length > 0 && (
          <>
            <Text style={styles.heading}>Top Cast</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.castList}
            >
              {cast.map((person) => (
                <View key={person.id} style={styles.castCard}>
                  {person.profile_path ? (
                    <Image
                      source={{
                        uri: `${IMAGE_BASE_URL}w185${person.profile_path}`,
                      }}
                      style={styles.castImage}
                    />
                  ) : (
                    <View style={[styles.castImage, styles.emptyPoster]}>
                      <Text style={styles.muted}>No image</Text>
                    </View>
                  )}

                  <Text
                    style={styles.castName}
                    numberOfLines={2}
                  >
                    {person.name}
                  </Text>

                  <Text
                    style={styles.castRole}
                    numberOfLines={2}
                  >
                    {person.character || 'Cast'}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </ScrollView>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backdrop: {
    height: 330,
    justifyContent: 'flex-end',
    backgroundColor: COLORS.surface,
  },
  overlay: {
    backgroundColor: '#000000B0',
    padding: 22,
    paddingTop: 70,
  },
  movieTitle: {
    color: COLORS.white,
    fontSize: 29,
    fontWeight: '800',
  },
  rating: {
    color: '#FACC15',
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    paddingBottom: 45,
  },
  movieHeader: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  poster: {
    width: 115,
    height: 170,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },
  emptyPoster: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  muted: {
    color: COLORS.secondary,
    fontSize: 12,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 9,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: '700',
  },
  meta: {
    color: COLORS.secondary,
    fontSize: 13,
  },
  genre: {
    color: COLORS.white,
    fontSize: 13,
    lineHeight: 20,
  },
  score: {
    color: '#FACC15',
    fontSize: 16,
    fontWeight: '700',
  },
  tagline: {
    color: COLORS.secondary,
    fontSize: 15,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 26,
  },
  heading: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 12,
  },
  description: {
    color: COLORS.secondary,
    fontSize: 15,
    lineHeight: 25,
    marginBottom: 25,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 25,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    gap: 12,
  },
  infoLabel: {
    color: COLORS.secondary,
    fontSize: 13,
  },
  infoValue: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    padding: 17,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 11,
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    padding: 17,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 11,
  },
  trailerButton: {
    backgroundColor: '#303036',
    padding: 17,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 28,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  castList: {
    marginBottom: 20,
  },
  castCard: {
    width: 105,
    marginRight: 14,
  },
  castImage: {
    width: 105,
    height: 135,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    marginBottom: 9,
  },
  castName: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  castRole: {
    color: COLORS.secondary,
    fontSize: 11,
    marginTop: 4,
  },
});
