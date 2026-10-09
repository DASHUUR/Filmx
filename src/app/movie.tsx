import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function MovieDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    title: string;
    banner: string;
    description: string;
    rating: string;
    duration: string;
  }>();

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>‹ Буцах</Text>
      </TouchableOpacity>

      {/* Poster / Player */}
      <Image source={{ uri: params.banner }} style={styles.poster} />

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{params.title}</Text>
        <View style={styles.row}>
          <Text style={styles.meta}>⭐ {params.rating || '8.0'}</Text>
          <Text style={styles.meta}>• {params.duration || '2h 00m'}</Text>
          <Text style={styles.freeBadge}>ҮНЭГҮЙ</Text>
        </View>

        {/* Watch Now Button */}
        <TouchableOpacity style={styles.playBtn} activeOpacity={0.8}>
          <Text style={styles.playBtnText}>▶ Одоо Үзэх</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Агуулга</Text>
        <Text style={styles.description}>
          {params.description || 'Энэхүү контент нь бүх насны хүмүүст зориулагдсан бөгөөд ямар нэгэн бүртгэлгүйгээр шууд үзэх боломжтой.'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F12' },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  backText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  poster: { width: width, height: 300 },
  infoContainer: { padding: 16 },
  title: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  meta: { color: '#AAA', fontSize: 14 },
  freeBadge: {
    backgroundColor: '#00C853',
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  playBtn: {
    backgroundColor: '#E50914',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  playBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  description: { color: '#BBB', fontSize: 14, lineHeight: 22 },
});