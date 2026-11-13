import React from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface Props {
  title: string;
  selected: boolean;
  onPress: () => void;
}

export default function CategoryChip({
  title,
  selected,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        selected && styles.active,
      ]}
    >
      <Text style={[
        styles.text,
        selected && styles.activeText,
      ]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    marginRight: 10,
  },
  active: {
    backgroundColor: COLORS.primary,
  },
  text: {
    color: COLORS.secondary,
    fontWeight: '600',
  },
  activeText: {
    color: COLORS.white,
  },
});