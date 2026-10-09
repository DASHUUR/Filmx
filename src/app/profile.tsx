import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header Profile Info */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={styles.userName}>Зочин Хэрэглэгч</Text>
        <Text style={styles.userStatus}>Үнэгүй эрхтэй (No Auth)</Text>
      </View>

      {/* Settings Menu */}
      <View style={styles.menuGroup}>
        <Text style={styles.groupTitle}>СҮЛЖЭЭ & ТОХИРГОО</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>🎬 Үзсэн түүх</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>❤️ Хадгалсан кинонууд</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>⚡ Видеоны чанар (Auto / HD)</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuGroup}>
        <Text style={styles.groupTitle}>АПП МЭДЭЭЛЭЛ</Text>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>ℹ️ Апп-ын тухай</Text>
          <Text style={styles.arrow}>v1.0.0</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F12', padding: 16 },
  header: { alignItems: 'center', marginVertical: 30 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1F1F24',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 36 },
  userName: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  userStatus: { color: '#00C853', fontSize: 13, marginTop: 4 },
  menuGroup: { marginBottom: 24 },
  groupTitle: { color: '#666', fontSize: 12, fontWeight: 'bold', marginBottom: 8, marginLeft: 4 },
  menuItem: {
    backgroundColor: '#1F1F24',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 10,
    marginBottom: 8,
  },
  menuText: { color: '#FFF', fontSize: 15, fontWeight: '500' },
  arrow: { color: '#666', fontSize: 18 },
});