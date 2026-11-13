
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '../store/authStore';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../constants/colors';

export default function LoginScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const loginWithPassword = useAuthStore(
    (state) => state.loginWithPassword
  );

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      Alert.alert(
        'Error',
        'Please enter username and password.'
      );
      return;
    }

    try {
      setLoading(true);

      console.log('========== MOBILE LOGIN ==========');
      console.log('Login button pressed');
      console.log('Username:', username.trim());
      console.log('Password: [HIDDEN]');

      // 1. authStore -> authApi -> DummyJSON
      await loginWithPassword(username.trim(), password);

      // 2. authStore token болон user хадгалсан
      console.log('LOGIN SUCCESS');
      console.log('Token saved by authStore');
      console.log('Navigating to MainTabs');

      // 3. HomeScreen рүү шилжих
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });

    } catch (error) {
      let message = 'Please try again.';

      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ||
          error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      console.log('LOGIN FAILED:', message);

      Alert.alert('Login failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>FILMX</Text>

      <Text style={styles.heading}>
        Welcome Back
      </Text>

      <Text style={styles.subtitle}>
        Sign in to continue
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor={COLORS.secondary}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="username"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={COLORS.secondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable
        style={[
          styles.button,
          loading && { opacity: 0.6 },
        ]}
        disabled={loading}
        onPress={handleLogin}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>
            Login
          </Text>
        )}
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.link}>
          Don't have an account? Register
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: 25,
  },
  logo: {
    color: COLORS.primary,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 5,
    textAlign: 'center',
    marginBottom: 40,
  },
  heading: {
    color: COLORS.white,
    fontSize: 27,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.secondary,
    marginTop: 8,
    marginBottom: 30,
  },
  input: {
    backgroundColor: COLORS.surface,
    color: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
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
