import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FirebaseError } from "firebase/app";
import { useAuthStore } from "../store/authStore";
import { COLORS } from "../constants/colors";

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();

  const resetPassword = useAuthStore(
    (state) => state.resetPassword
  );

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetPassword = async () => {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      Alert.alert("Error", "Please enter a valid email.");
      return;
    }

    try {
      setLoading(true);

      await resetPassword(cleanEmail);

      setSent(true);
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
            setSent(true);
            break;

          case "auth/invalid-email":
            Alert.alert("Error", "Invalid email address.");
            break;

          case "auth/too-many-requests":
            Alert.alert(
              "Too many requests",
              "Please try again later."
            );
            break;

          case "auth/network-request-failed":
            Alert.alert(
              "Connection error",
              "Please check your internet connection."
            );
            break;

          default:
            Alert.alert(
              "Error",
              "Unable to send reset link. Please try again."
            );
        }
      } else {
        Alert.alert("Error", "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={26}
            color="#FFFFFF"
          />
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.logo}>FILMX</Text>

          <View style={styles.iconContainer}>
            <Ionicons
              name={sent ? "mail-outline" : "lock-closed-outline"}
              size={42}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.title}>
            {sent ? "Check your email" : "Forgot Password?"}
          </Text>

          <Text style={styles.description}>
            {sent
              ? "If an account exists with this email, you will receive a password reset link."
              : "Enter your email address to receive a password reset link."}
          </Text>
        </View>

        {!sent ? (
          <>
            <Text style={styles.label}>Email</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#777777"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <Pressable
              style={[
                styles.button,
                loading && styles.disabledButton,
              ]}
              onPress={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>
                  Send Reset Link
                </Text>
              )}
            </Pressable>
          </>
        ) : (
          <View style={styles.successBox}>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color="#4ADE80"
            />

            <Text style={styles.successText}>
              Check your inbox and spam folder for the reset link.
            </Text>
          </View>
        )}

        <Pressable
          style={styles.loginButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.loginText}>
            Back to Login
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101014",
  },

  content: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: 30,
    padding: 8,
  },

  header: {
    alignItems: "center",
    marginBottom: 32,
  },

  logo: {
    fontSize: 36,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 4,
    marginBottom: 36,
  },

  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#252529",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },

  description: {
    fontSize: 14,
    color: "#AAAAAA",
    textAlign: "center",
    lineHeight: 22,
  },

  label: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },

  input: {
    height: 56,
    backgroundColor: "#252529",
    borderRadius: 12,
    paddingHorizontal: 16,
    color: "#FFFFFF",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333333",
    marginBottom: 24,
  },

  button: {
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  loginButton: {
    alignItems: "center",
    padding: 16,
    marginTop: 12,
  },

  loginText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "600",
  },

  successBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#183326",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },

  successText: {
    flex: 1,
    color: "#4ADE80",
    fontSize: 14,
    lineHeight: 21,
  },
});