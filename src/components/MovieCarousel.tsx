import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { Movie } from '../types/movie';
import MovieCard from './MovieCard';
import { COLORS } from '../constants/colors';

interface Props {
  title: string;
  movies: Movie[];
}

export default function MovieCarousel({ title, movies }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <FlatList
        horizontal
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieCard movie={item} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  list: {
    paddingHorizontal: 20,
  },
});