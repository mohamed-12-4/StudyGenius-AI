import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Calendar, Brain, BookOpen } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { account } from '@/lib/appwrite';

export default function HomeScreen() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = await account.get();
      setUserName(user.name);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning,</Text>
        <Text style={styles.name}>{userName}</Text>
      </View>

      <View style={styles.statsContainer}>
        <LinearGradient
          colors={['#007AFF', '#00C6FF']}
          style={styles.statsCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View style={styles.statsContent}>
            <Clock color="#FFFFFF" size={24} />
            <Text style={styles.statsTitle}>Study Time</Text>
            <Text style={styles.statsValue}>2.5 hrs</Text>
            <Text style={styles.statsSubtext}>Today</Text>
          </View>
        </LinearGradient>

        <View style={[styles.statsCard, styles.whiteCard]}>
          <View style={styles.statsContent}>
            <Calendar color="#007AFF" size={24} />
            <Text style={[styles.statsTitle, styles.darkText]}>Streak</Text>
            <Text style={[styles.statsValue, styles.darkText]}>7 days</Text>
            <Text style={[styles.statsSubtext, styles.darkText]}>Keep it up!</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <Pressable style={styles.actionButton}>
          <Brain color="#007AFF" size={24} />
          <Text style={styles.actionText}>AI Tutor</Text>
        </Pressable>
        <Pressable style={styles.actionButton}>
          <BookOpen color="#007AFF" size={24} />
          <Text style={styles.actionText}>Study Plan</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Today's Schedule</Text>
      <View style={styles.scheduleContainer}>
        <View style={styles.scheduleItem}>
          <View style={[styles.scheduleTag, { backgroundColor: '#FFE4E4' }]}>
            <Text style={[styles.scheduleTagText, { color: '#FF4444' }]}>Math</Text>
          </View>
          <Text style={styles.scheduleTitle}>Calculus Review</Text>
          <Text style={styles.scheduleTime}>10:00 AM - 11:30 AM</Text>
        </View>
        <View style={styles.scheduleItem}>
          <View style={[styles.scheduleTag, { backgroundColor: '#E4F3FF' }]}>
            <Text style={[styles.scheduleTagText, { color: '#007AFF' }]}>Physics</Text>
          </View>
          <Text style={styles.scheduleTitle}>Quantum Mechanics</Text>
          <Text style={styles.scheduleTime}>2:00 PM - 3:30 PM</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
  },
  name: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 24,
    color: '#000000',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    height: 140,
  },
  whiteCard: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  statsTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
  },
  statsValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
  },
  statsSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  darkText: {
    color: '#000000',
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 18,
    color: '#000000',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#000000',
    marginTop: 8,
  },
  scheduleContainer: {
    gap: 12,
  },
  scheduleItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  scheduleTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  scheduleTagText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  scheduleTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000000',
    marginBottom: 4,
  },
  scheduleTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
});