import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Upload, Clock, BookOpen, Brain } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';

export default function StudyScreen() {
  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/*'],
      });
      
      if (result.assets && result.assets[0]) {
        // Handle the uploaded file
        console.log('File uploaded:', result.assets[0].name);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Study Materials</Text>
        <Text style={styles.subtitle}>Upload and organize your study content</Text>
      </View>

      <Pressable style={styles.uploadCard} onPress={handleUpload}>
        <Upload color="#007AFF" size={32} />
        <Text style={styles.uploadText}>Upload Syllabus or Study Material</Text>
        <Text style={styles.uploadSubtext}>PDF, Word, or Text files</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Recent Materials</Text>
      <View style={styles.materialsContainer}>
        <View style={styles.materialCard}>
          <View style={styles.materialIcon}>
            <BookOpen color="#007AFF" size={24} />
          </View>
          <View style={styles.materialInfo}>
            <Text style={styles.materialTitle}>Advanced Calculus</Text>
            <Text style={styles.materialSubtext}>PDF • 2.3 MB</Text>
          </View>
          <Text style={styles.materialDate}>2h ago</Text>
        </View>

        <View style={styles.materialCard}>
          <View style={styles.materialIcon}>
            <Brain color="#007AFF" size={24} />
          </View>
          <View style={styles.materialInfo}>
            <Text style={styles.materialTitle}>Physics Notes</Text>
            <Text style={styles.materialSubtext}>DOC • 1.1 MB</Text>
          </View>
          <Text style={styles.materialDate}>Yesterday</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Study Sessions</Text>
      <View style={styles.sessionsContainer}>
        <View style={styles.sessionCard}>
          <Clock color="#007AFF" size={20} />
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionTitle}>Morning Study</Text>
            <Text style={styles.sessionSubtext}>Calculus • 2.5 hours</Text>
          </View>
        </View>

        <View style={styles.sessionCard}>
          <Clock color="#007AFF" size={20} />
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionTitle}>Evening Review</Text>
            <Text style={styles.sessionSubtext}>Physics • 1.5 hours</Text>
          </View>
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
  title: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 24,
    color: '#000000',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
  },
  uploadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  uploadText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#007AFF',
    marginTop: 12,
    marginBottom: 4,
  },
  uploadSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  sectionTitle: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 18,
    color: '#000000',
    marginBottom: 16,
  },
  materialsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  materialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  materialIcon: {
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    padding: 8,
  },
  materialInfo: {
    flex: 1,
    marginLeft: 12,
  },
  materialTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000000',
  },
  materialSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  materialDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  sessionsContainer: {
    gap: 12,
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sessionInfo: {
    marginLeft: 12,
  },
  sessionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#000000',
  },
  sessionSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
});