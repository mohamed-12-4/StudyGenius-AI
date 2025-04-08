import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { Chrome as Home, BookOpen, Trophy, User, Brain } from 'lucide-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="study"
        options={{
          title: 'Study',
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ai-tutor"
        options={{
          title: 'AI Tutor',
          tabBarIcon: ({ color, size }) => <Brain size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size }) => <Trophy size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Platform.select({
      ios: '#FFFFFF',
      android: '#FFFFFF',
      default: '#FFFFFF',
    }),
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingBottom: Platform.select({ ios: 20, android: 10, default: 10 }),
    paddingTop: 10,
    height: Platform.select({ ios: 85, android: 65, default: 65 }),
  },
  tabBarLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 2,
  },
});