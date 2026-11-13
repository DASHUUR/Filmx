import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export default function SearchBar({ value, onChangeText }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search movies..."
        placeholderTextColor={COLORS.secondary}
        style={styles.input}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginHorizontal: 20,
  },
  input: {
    height: 50,
    color: COLORS.white,
    fontSize: 15,
  },
});