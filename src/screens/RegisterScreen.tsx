
import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable,
  StyleSheet, Alert, ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '../store/authStore';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../constants/colors';

export default function RegisterScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const register = useAuthStore((state) => state.register);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !firstName.trim() || !lastName.trim() ||
      !email.trim() || !password || !confirmPassword
    ) {
      Alert.alert('Missing fields', 'Please complete all fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert('Invalid email', 'Enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Weak password', 'Use at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await register(firstName, lastName, email, password);

      Alert.alert(
        'Account created',
        'Your account is ready. Please sign in.',
        [{ text: 'Login', onPress: () => navigation.replace('Login') }]
      );
    } catch (error) {
      Alert.alert(
        'Registration failed',
        error instanceof Error ? error.message : 'Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.logo}>FILMX</Text>
      <Text style={styles.heading}>Create Account</Text>
      <Text style={styles.subtitle}>Join the Filmx community</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor={COLORS.secondary}
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor={COLORS.secondary}
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={COLORS.secondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={COLORS.secondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor={COLORS.secondary}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Pressable
        style={[styles.button, loading && { opacity: 0.6 }]}
        disabled={loading}
        onPress={handleRegister}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 25,
    paddingVertical: 45,
  },
  logo: {
    color: COLORS.primary,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 5,
    textAlign: 'center',
    marginBottom: 35,
  },
  heading: {
    color: COLORS.white,
    fontSize: 27,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.secondary,
    marginTop: 8,
    marginBottom: 25,
  },
  input: {
    backgroundColor: COLORS.surface,
    color: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 13,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 17,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  link: {
    color: COLORS.secondary,
    textAlign: 'center',
    marginTop: 25,
  },
});
