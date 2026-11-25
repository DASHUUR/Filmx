
import React, { useState } from 'react';

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuthStore } from '../store/authStore';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../constants/colors';

export default function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);

  const [loading, setLoading] = useState(false);

  const fullName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
      || user.username
      || 'User'
    : 'Guest User';

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);

              console.log('========== MOBILE LOGOUT ==========');
              console.log('AUTH PROVIDER: Firebase');

              await logout();

              console.log('LOGOUT SUCCESS');
              console.log('USER SESSION CLEARED');

              navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
              });

            } catch (error) {
              console.log('LOGOUT FAILED:', error);

              Alert.alert(
                'Logout failed',
                'Please try again.'
              );

            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Profile</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {fullName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.name}>
          {fullName}
        </Text>

        <Text style={styles.email}>
          {user?.email || 'Not signed in'}
        </Text>
      </View>

      {!isLoggedIn || !user ? (
        <>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>
              Login
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.buttonText}>
              Create Account
            </Text>
          </Pressable>
        </>
      ) : (
        <Pressable
          style={[
            styles.logout,
            loading && { opacity: 0.6 },
          ]}
          disabled={loading}
          onPress={handleLogout}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>
              Logout
            </Text>
          )}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    paddingTop: 60,
  },
  heading: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 35,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    padding: 25,
    borderRadius: 18,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: 'bold',
  },
  name: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
  email: {
    color: COLORS.secondary,
    marginTop: 7,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 25,
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  logout: {
    backgroundColor: '#7F1D1D',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 25,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});
