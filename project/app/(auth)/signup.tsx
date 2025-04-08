import React, { useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { Link, router } from 'expo-router';
import { account } from '../../lib/appwrite';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await account.create('unique()', email, password, name);
      await account.createEmailPasswordSession(email, password);
      const session = await account.getSession('current');
      if (session) {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      setError(err.message);
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
        <Text variant="headlineMedium" style={styles.title}>Create Account</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>Join StudyGenius today</Text>
        
        <TextInput
          label="Full Name"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

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

        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          mode="outlined"
          style={styles.input}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={handleSignup}
          style={styles.button}
          loading={loading}
        >
          Sign Up
        </Button>

        <View style={styles.footer}>
          <Text variant="bodyMedium">Already have an account? </Text>
          <Link href="/login" asChild>
            <Button mode="text" compact>Sign In</Button>
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