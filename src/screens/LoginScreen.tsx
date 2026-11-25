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

import { FirebaseError } from 'firebase/app';
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        'Error',
        'Please enter email and password.'
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert(
        'Error',
        'Please enter a valid email address.'
      );
      return;
    }

    try {
      setLoading(true);

      console.log('========== MOBILE LOGIN ==========');
      console.log('Login button pressed');
      console.log('Email:', email.trim());
      console.log('Password: [HIDDEN]');
      console.log('AUTH PROVIDER: Firebase');

      // authStore -> authApi -> Firebase
      await loginWithPassword(
        email.trim(),
        password
      );

      console.log('LOGIN SUCCESS');
      console.log('Firebase authentication successful');
      console.log('Navigating to MainTabs');

      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });

    } catch (error) {
      let message = 'Please try again.';

      if (error instanceof FirebaseError) {
        console.log('FIREBASE ERROR CODE:', error.code);

        switch (error.code) {
          case 'auth/invalid-email':
            message = 'Invalid email address.';
            break;

          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            message = 'Incorrect email or password.';
            break;

          case 'auth/user-disabled':
            message = 'This account has been disabled.';
            break;

          case 'auth/too-many-requests':
            message = 'Too many attempts. Try again later.';
            break;

          case 'auth/network-request-failed':
            message = 'Please check your internet connection.';
            break;

          case 'auth/operation-not-allowed':
            message = 'Email sign-in is not enabled.';
            break;

          default:
            message = 'Unable to sign in. Please try again.';
        }
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
        placeholder="Email"
        placeholderTextColor={COLORS.secondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={COLORS.secondary}
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="current-password"
        secureTextEntry
        editable={!loading}
      />

      {/* FORGOT PASSWORD */}
      <Pressable
        style={styles.forgotPasswordButton}
        disabled={loading}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text style={styles.forgotPasswordText}>
          Forgot Password?
        </Text>
      </Pressable>

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
        disabled={loading}
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

  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 5,
    paddingVertical: 8,
    minHeight: 44,
    justifyContent: 'center',
  },

  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
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