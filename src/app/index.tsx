import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// Мок өгөгдөл
const CATEGORIES = ['Бүгд', 'Аクション', 'Драма', 'Комеди', 'Анимашн'];

const MOVIES = [
  {
    id: '1',
    title: 'Авалга: Нууцлаг ертөнц',
    category: 'Аクション',
    rating: '8.5',
    duration: '1h 58m',
    banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
    description: 'Ирээдүйн ертөнцөд болох адал явдалт, шинжлэх ухааны уран сэтгэмжит кино.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    id: '2',
    title: 'Сүүлчийн тулаан',
    category: 'Аクション',
    rating: '7.9',
    duration: '2h 10m',
    banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
    description: 'Эх орныхоо төлөө эцсээ хүртэл тэмцэх баатруудын түүх.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
  {
    id: '3',
    title: 'Инээдмийн Үдэш',
    category: 'Комеди',
    rating: '9.0',
    duration: '1h 35m',
    banner: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop',
    description: 'Таныг өдөржин инээлгэх хөгжилтэй явдлууд.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState('Бүгд');

  const featuredMovie = MOVIES[0];

  const handleOpenMovie = (movie: typeof MOVIES[0]) => {
    router.push({
      pathname: '/movie',
      params: {
        id: movie.id,
        title: movie.title,
        banner: movie.banner,
        description: movie.description,
        rating: movie.rating,
        duration: movie.duration,
        videoUrl: movie.videoUrl,
      },
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" />

      {/* Featured Banner */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleOpenMovie(featuredMovie)}
        style={styles.featuredContainer}
      >
        <Image source={{ uri: featuredMovie.banner }} style={styles.featuredImage} />
        <View style={styles.featuredGradient}>
          <Text style={styles.badge}>ОНЦЛОХ КИНО</Text>
          <Text style={styles.featuredTitle}>{featuredMovie.title}</Text>
          <Text style={styles.featuredSub}>{featuredMovie.category} • ⭐ {featuredMovie.rating}</Text>
          <View style={styles.playButton}>
            <Text style={styles.playText}>▶ Шууд үзэх</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catContainer}>
        {CATEGORIES.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.catChip, selectedCat === cat && styles.catChipActive]}
            onPress={() => setSelectedCat(cat)}
          >
            <Text style={[styles.catText, selectedCat === cat && styles.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Movie List Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Трэнд болж буй контент</Text>
      </View>

      <FlatList
        data={MOVIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingLeft: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.movieCard} onPress={() => handleOpenMovie(item)}>
            <Image source={{ uri: item.banner }} style={styles.moviePoster} />
            <Text style={styles.movieCardTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.movieCardSub}>⭐ {item.rating}</Text>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F12' },
  featuredContainer: { width: width, height: 420, position: 'relative' },
  featuredImage: { width: '100%', height: '100%' },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(15, 15, 18, 0.75)',
  },
  badge: { color: '#E50914', fontWeight: 'bold', fontSize: 12, marginBottom: 4 },
  featuredTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  featuredSub: { color: '#AAA', fontSize: 14, marginVertical: 6 },
  playButton: {
    backgroundColor: '#E50914',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  playText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  catContainer: { marginVertical: 16, paddingLeft: 16 },
  catChip: {
    backgroundColor: '#1F1F24',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  catChipActive: { backgroundColor: '#E50914' },
  catText: { color: '#888', fontWeight: '600' },
  catTextActive: { color: '#FFF' },
  sectionHeader: { paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  movieCard: { width: 140, marginRight: 12 },
  moviePoster: { width: 140, height: 200, borderRadius: 10, marginBottom: 6 },
  movieCardTitle: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  movieCardSub: { color: '#888', fontSize: 12 },
});