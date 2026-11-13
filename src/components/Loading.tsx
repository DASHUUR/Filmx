import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function Loading() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>FILMX</Text>
      <ActivityIndicator color={COLORS.primary} size="large" />
      <Text style={styles.text}>Loading movies...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  logo: {
    color: COLORS.primary,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 5,
  },
  text: {
    color: COLORS.secondary,
  },
});