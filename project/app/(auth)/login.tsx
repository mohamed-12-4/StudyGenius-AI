import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { Link, router } from 'expo-router';
import { account, client } from '../../lib/appwrite';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      // Delete any existing session (if exists)
      try {
        await account.deleteSession('current');
      } catch (e) {
        // Ignore if there is no session
      }

      // Create new email/password session
      await account.createEmailPasswordSession(email, password);
      
      // Immediately create a JWT and store it
      const jwtResponse = await account.createJWT();
      const jwtToken = jwtResponse.jwt;
      // Store token in AsyncStorage
      await AsyncStorage.setItem('jwtToken', jwtToken);
      // Set JWT on the client so subsequent requests are authenticated
      client.setJWT(jwtToken);

      // Verify user data to confirm authentication
      const user = await account.get();
      if (user) {
        router.replace('/(tabs)');
      } else {
        setError('Failed to retrieve user data.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Surface style={styles.surface}>
        <Text variant="headlineMedium" style={styles.title}>
          Welcome Back!
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Sign in to continue
        </Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          style={styles.input}
          secureTextEntry
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button mode="contained" onPress={handleLogin} style={styles.button} loading={loading}>
          Sign In
        </Button>
        <View style={styles.footer}>
          <Text variant="bodyMedium">Don't have an account? </Text>
          <Link href="/(auth)/signup" asChild>
            <Button mode="text" compact>
              Sign Up
            </Button>
          </Link>
        </View>
      </Surface>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    flex: 1,
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#1a237e',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  error: {
    color: '#d32f2f',
    marginBottom: 16,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
});