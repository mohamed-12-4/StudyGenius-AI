import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Surface, Avatar } from 'react-native-paper';
import { router } from 'expo-router';
import { account, ensureSession, deleteAllSessions } from '@/lib/appwrite';
import { AppwriteException } from 'appwrite';

export default function ProfileScreen() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Root layout handles initial session check & redirect
      const user = await account.get(); 
      setUserName(user.name || 'User');
      setUserEmail(user.email || '');
    } catch (error) {
      console.error('Error fetching user data in ProfileScreen:', error);
      if (error instanceof AppwriteException && error.code === 401) {
         console.log("Session potentially invalid, root layout should handle redirect.");
      } 
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      console.log('Attempting delete current session as fallback...');
      // Attempt current session delete as well, might fail if deleteAllSessions worked
      await account.deleteSession('current'); 
    } catch (error) {
        // Log errors during deletion, but proceed to navigate
        console.error('Error during logout deletion steps:', error);
        if (error instanceof AppwriteException && error.code !== 401) { 
            // Show alert only for unexpected errors, not for 'already logged out'
             Alert.alert('Logout Issue', `Could not fully clean sessions: ${error.message}`);
        }
    } finally {
        console.log('Logout deletion attempts finished, navigating to login...');
        // ALWAYS navigate to login after attempting logout
        router.replace('/(auth)/login');
        setIsLoggingOut(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.header}>
        <Avatar.Text 
          size={80} 
          label={userName.split(' ').map(n => n[0] || '').join('').toUpperCase() || 'U'}
          style={styles.avatar}
        />
        <Text variant="headlineSmall" style={styles.name}>{userName}</Text>
        <Text variant="bodyLarge" style={styles.email}>{userEmail}</Text>
      </Surface>

      <View style={styles.content}>
        <Button 
          mode="contained" 
          onPress={handleLogout}
          style={styles.logoutButton}
          buttonColor="#d32f2f"
          loading={isLoggingOut}
          disabled={isLoggingOut}
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 20,
    elevation: 2,
  },
  avatar: {
    backgroundColor: '#1a237e',
    marginBottom: 16,
  },
  name: {
    marginBottom: 8,
    color: '#1a237e',
  },
  email: {
    color: '#666',
  },
  content: {
    padding: 20,
  },
  logoutButton: {
    marginTop: 20,
  },
}); 