
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Movie } from '../types/movie';
import { COLORS } from '../constants/colors';
import {
  getPosterUrl,
  getBackdropUrl,
} from '../services/api/apiClient';
import { RootStackParamList } from '../navigation/types';

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [imageError, setImageError] = useState(false);

  const posterUrl = getPosterUrl(movie.poster_path);
  const backdropUrl = getBackdropUrl(movie.backdrop_path);

  const imageUrl = imageError
    ? null
    : posterUrl || backdropUrl;

  const title = movie.title || movie.name || 'Unknown Movie';

  const year = movie.release_date
    ? movie.release_date.slice(0, 4)
    : 'Unknown';

  const rating =
    typeof movie.vote_average === 'number'
      ? movie.vote_average.toFixed(1)
      : 'N/A';

  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        navigation.navigate('MovieDetails', { movie })
      }
    >
      <View style={styles.posterContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.poster}
            resizeMode="cover"
            onError={() => {
              if (imageUrl === posterUrl && backdropUrl) {
                // Poster failed, try backdrop next
                setImageError(true);
              } else {
                setImageError(true);
              }
            }}
          />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons
              name="film-outline"
              size={38}
              color={COLORS.secondary}
            />
            <Text style={styles.placeholderText}>
              No Image
            </Text>
          </View>
        )}

        <View style={styles.ratingBox}>
          <Ionicons
            name="star"
            size={12}
            color="#FACC15"
          />
          <Text style={styles.rating}>
            {rating}
          </Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>

      <View style={styles.detailsRow}>
        <Text style={styles.year}>
          {year}
        </Text>

        <Ionicons
          name="ellipse"
          size={4}
          color={COLORS.secondary}
        />

        <Text style={styles.detailsLabel}>
          Details
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 145,
    marginRight: 14,
  },
  posterContainer: {
    width: 145,
    height: 215,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  placeholderText: {
    color: COLORS.secondary,
    fontSize: 11,
  },
  ratingBox: {
    position: 'absolute',
    bottom: 9,
    left: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#000000CC',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rating: {
    color: '#FACC15',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
    lineHeight: 19,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 5,
  },
  year: {
    color: COLORS.secondary,
    fontSize: 12,
  },
  detailsLabel: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});
