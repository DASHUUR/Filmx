import React from 'react';

import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
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
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();

          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Profile</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.username?.charAt(0).toUpperCase() || 'G'}
          </Text>
        </View>

        <Text style={styles.name}>
          {user?.firstName
            ? `${user.firstName} ${user.lastName || ''}`
            : 'Guest User'}
        </Text>

        <Text style={styles.email}>
          {user?.email || 'Not signed in'}
        </Text>
      </View>

      {!user ? (
        <>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </Pressable>
        </>
      ) : (
        <Pressable style={styles.logout} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
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