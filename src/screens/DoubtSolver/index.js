import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../../config/config';
import { AuthContext } from '../../components/AuthContext';
import Ionicons from '@react-native-vector-icons/ionicons';
import { LinearGradient } from 'react-native-linear-gradient';
import ImageCropPicker from 'react-native-image-crop-picker';

const DoubtSolver = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [solveCount, setSolveCount] = useState(0);
  const { userInfo } = React.useContext(AuthContext);
  const userName = JSON.parse(userInfo).data.firstname;

  const pickImage = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        includeBase64: true,
        cropping: false,
      });

      setSelectedImage({
        uri: image.path,
        base64: image.data,
        mime: image.mime,
      });
      setSolution(''); // Clear previous solution
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Error', 'Failed to pick image. Please try again.');
      }
    }
  };

  const takePhoto = async () => {
    try {
      const image = await ImageCropPicker.openCamera({
        mediaType: 'photo',
        includeBase64: true,
        cropping: false,
      });

      setSelectedImage({
        uri: image.path,
        base64: image.data,
        mime: image.mime,
      });
      setSolution(''); // Clear previous solution
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Error', 'Failed to open camera. Please try again.');
      }
    }
  };

  const solveDoubt = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select or capture an image first.');
      return;
    }

    // Free tier limit: 5 solves per session
    if (solveCount >= 5) {
      Alert.alert(
        'Free Limit Reached',
        'You have used 5 free solutions today. Upgrade to Premium for unlimited access!',
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Upgrade', onPress: () => console.log('Navigate to premium') },
        ]
      );
      return;
    }

    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      const prompt = `You are an expert teacher helping a student named ${userName}.

Analyze this image carefully and:
1. Identify the subject (Math, Physics, Chemistry, Economics, etc.)
2. Understand the problem/question shown
3. Provide a detailed step-by-step solution
4. Explain concepts clearly
5. Add helpful tips or formulas if relevant

If the image is unclear or not a valid question, politely ask for a clearer image.

Format your response in a clear, student-friendly way with:
📚 Subject:
❓ Problem:
✍️ Solution:
💡 Key Concept:`;

      const imagePart = {
        inlineData: {
          data: selectedImage.base64,
          mimeType: selectedImage.mime,
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      setSolution(text);
      setSolveCount(solveCount + 1);
    } catch (error) {
      console.error('AI Error:', error);
      Alert.alert(
        'Error',
        'Failed to solve the problem. Please check your internet connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setSelectedImage(null);
    setSolution('');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#2563eb', '#1d4ed8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIconContainer}>
              <Ionicons name="bulb" size={24} color="#fff" />
            </View>
            <View>
              <Text style={styles.headerTitle}>AI Doubt Solver</Text>
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>
                  {5 - solveCount} free solutions left today
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Welcome Card */}
        {!selectedImage && !solution && (
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeIconContainer}>
              <Ionicons name="camera" size={48} color="#2563eb" />
            </View>
            <Text style={styles.welcomeTitle}>
              Hello {userName}! 👋
            </Text>
            <Text style={styles.welcomeText}>
              Take a photo of any problem or upload an image, and I'll solve it step-by-step for you!
            </Text>
            
            {/* Features List */}
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                <Text style={styles.featureText}>Math, Physics, Chemistry</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                <Text style={styles.featureText}>Economics & Commerce</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                <Text style={styles.featureText}>Step-by-step solutions</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                <Text style={styles.featureText}>Detailed explanations</Text>
              </View>
            </View>
          </View>
        )}

        {/* Image Preview */}
        {selectedImage && (
          <View style={styles.imagePreviewCard}>
            <View style={styles.imagePreviewHeader}>
              <Text style={styles.cardTitle}>Your Question</Text>
              <TouchableOpacity onPress={clearAll} style={styles.clearButton}>
                <Ionicons name="close-circle" size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>
            <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
          </View>
        )}

        {/* Solution Card */}
        {solution && (
          <View style={styles.solutionCard}>
            <View style={styles.solutionHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              <Text style={styles.solutionTitle}>Solution</Text>
            </View>
            <Text style={styles.solutionText}>{solution}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={takePhoto}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#2563eb', '#1d4ed8']}
              style={styles.actionButtonGradient}>
              <Ionicons name="camera" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Take Photo</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={pickImage}
            activeOpacity={0.8}>
            <LinearGradient
              colors={['#7c3aed', '#6d28d9']}
              style={styles.actionButtonGradient}>
              <Ionicons name="images" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Pick Image</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Solve Button */}
        {selectedImage && (
          <TouchableOpacity
            style={styles.solveButton}
            onPress={solveDoubt}
            disabled={isLoading}
            activeOpacity={0.8}>
            <LinearGradient
              colors={isLoading ? ['#9ca3af', '#6b7280'] : ['#10b981', '#059669']}
              style={styles.solveButtonGradient}>
              {isLoading ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.solveButtonText}>AI is solving...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="sparkles" size={20} color="#fff" />
                  <Text style={styles.solveButtonText}>Solve with AI</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Premium Banner */}
        <TouchableOpacity style={styles.premiumBanner} activeOpacity={0.8}>
          <LinearGradient
            colors={['#f59e0b', '#d97706']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.premiumGradient}>
            <View style={styles.premiumContent}>
              <Ionicons name="trophy" size={24} color="#fff" />
              <View style={styles.premiumTextContainer}>
                <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                <Text style={styles.premiumSubtitle}>
                  Unlimited AI solutions • Priority support
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* How it Works */}
        <View style={styles.howItWorksCard}>
          <Text style={styles.howItWorksTitle}>📖 How It Works</Text>
          <View style={styles.stepsList}>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Take a photo or upload image of your problem</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>Tap "Solve with AI" button</Text>
            </View>
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Get instant step-by-step solution!</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  statusContainer: {
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  welcomeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  featuresList: {
    width: '100%',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  imagePreviewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  imagePreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  clearButton: {
    padding: 4,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    resizeMode: 'contain',
    backgroundColor: '#f3f4f6',
  },
  solutionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  solutionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  solutionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  solutionText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  solveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  solveButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  solveButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  premiumBanner: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  premiumGradient: {
    padding: 16,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  howItWorksCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  howItWorksTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    paddingTop: 4,
  },
});

export default DoubtSolver;

