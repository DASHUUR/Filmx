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

// 1. Категориудын жагсаалт
const CATEGORIES = ['Бүгд', 'Аクション', 'Драма', 'Комеди', 'Анимашн'];

// 2. Киноны өгөгдөл (category талбар бүрт нь тодорхой заагдсан)
const MOVIES = [
  {
    id: '1',
    title: 'Авалга: Нууцлаг ертөнц',
    category: 'Аクション',
    rating: '8.5',
    duration: '1h 58m',
    banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
    description: 'Ирээдүйн ертөнцөд болох адал явдалт, шинжлэх ухааны уран сэтгэмжит кино.',
  },
  {
    id: '2',
    title: 'Сүүлчийн тулаан',
    category: 'Аクション',
    rating: '7.9',
    duration: '2h 10m',
    banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
    description: 'Эх орныхоо төлөө эцсээ хүртэл тэмцэх баатруудын түүх.',
  },
  {
    id: '3',
    title: 'Инээдмийн Үдэш',
    category: 'Комеди',
    rating: '9.0',
    duration: '1h 35m',
    banner: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop',
    description: 'Таныг өдөржин инээлгэх хөгжилтэй явдлууд.',
  },
  {
    id: '4',
    title: 'Амьдралын Зөрөг',
    category: 'Драма',
    rating: '8.2',
    duration: '2h 05m',
    banner: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop',
    description: 'Хүний амьдралын ээдрээтэй бөгөөд сэтгэл хөдөлгөм түүх.',
  },
  {
    id: '5',
    title: 'Үүлэн дундах ертөнц',
    category: 'Анимашн',
    rating: '9.3',
    duration: '1h 40m',
    banner: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    description: 'Хүүхэд багачууд болон гэр бүлд зориулсан гайхамшигт хүүхэлдэйн кино.',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState('Бүгд');

  // 💡 Сонгосон категориос хамаарч кинонуудыг шүүх логик
  const filteredMovies = selectedCat === 'Бүгд'
    ? MOVIES
    : MOVIES.filter((movie) => movie.category === selectedCat);

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

      {/* Categories Buttons */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catContainer}>
        {CATEGORIES.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.catChip, selectedCat === cat && styles.catChipActive]}
            onPress={() => setSelectedCat(cat)}
          >
            <Text style={[styles.catText, selectedCat === cat && styles.catTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Movie List Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {selectedCat === 'Бүгд' ? 'Трэнд болж буй контент' : `${selectedCat} кинонууд`}
        </Text>
      </View>

      {/* 💡 Шүүгдсэн кинонуудыг харуулах хэсэг */}
      {filteredMovies.length > 0 ? (
        <FlatList
          data={filteredMovies}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingLeft: 16, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.movieCard} onPress={() => handleOpenMovie(item)}>
              <Image source={{ uri: item.banner }} style={styles.moviePoster} />
              <Text style={styles.movieCardTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.movieCardSub}>⭐ {item.rating} • {item.category}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Энэ категорид одоогоор кино байхгүй байна.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F12' },
  featuredContainer: { width: width, height: 400, position: 'relative' },
  featuredImage: { width: '100%', height: '100%' },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(15, 15, 18, 0.8)',
  },
  badge: { color: '#E50914', fontWeight: 'bold', fontSize: 12, marginBottom: 4 },
  featuredTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  featuredSub: { color: '#AAA', fontSize: 14, marginVertical: 6 },
  playButton: {
    backgroundColor: '#E50914',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  playText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
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
  emptyContainer: { padding: 20, alignItems: 'center' },
  emptyText: { color: '#666', fontSize: 14 },
});