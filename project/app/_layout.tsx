import React, { useContext, useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans';
import * as SplashScreen from 'expo-splash-screen';
import { AuthContext } from '@/context/AuthProvider';
import { ActivityIndicator, View, Text } from 'react-native';

// Prevent auto hide
SplashScreen.preventAutoHideAsync().catch(err => 
  console.log("Error preventing splash screen auto hide:", err)
);

export default function RootLayout() {
  useFrameworkReady();
  const { isAuthenticated, loading } = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();
  const [appReady, setAppReady] = useState(false);

  // Load fonts
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
  });

  // Debug logs
  console.log('RootLayout render:');
  console.log('- fontsLoaded:', fontsLoaded);
  console.log('- fontError:', fontError);
  console.log('- loading:', loading);
  console.log('- isAuthenticated:', isAuthenticated);

  // Navigate once auth is determined
  useEffect(() => {
    if (loading || isAuthenticated === null) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [loading, isAuthenticated, segments]);

  // Force app ready after timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('FORCING APP READY after timeout');
      setAppReady(true);
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, []);

  // Hide splash screen once fonts are loaded and auth check is complete
  // OR when appReady is forced true by timeout
  useEffect(() => {
    const conditions = fontsLoaded && !loading && isAuthenticated !== null;
    console.log('Hide splash conditions met?', conditions);
    
    if (conditions || appReady) {
      console.log('ATTEMPTING TO HIDE SPLASH SCREEN');
      SplashScreen.hideAsync()
        .then(() => console.log('Splash screen hidden successfully'))
        .catch(err => console.error('Error hiding splash screen:', err));
    }
  }, [fontsLoaded, fontError, loading, isAuthenticated, appReady]);

  // Always render the app after a certain time, even if conditions aren't met
  if (((!fontsLoaded || loading || isAuthenticated === null) && !appReady)) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Loading your app...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
