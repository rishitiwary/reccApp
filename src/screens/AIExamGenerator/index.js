import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Picker } from 'react-native-element-dropdown';
import axios from 'axios';
import { BASE_URL, GEMINI_API_KEY } from '../../config/config';
import { AuthContext } from '../../components/AuthContext';
import Ionicons from '@react-native-vector-icons/ionicons';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import { LinearGradient } from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

const AIExamGenerator = ({ navigation }) => {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState('10');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionType, setQuestionType] = useState('mcq');
  const [language, setLanguage] = useState('english');
  const [syllabus, setSyllabus] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Dropdowns data
  const [tradeGroups, setTradeGroups] = useState([]);
  const [trades, setTrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [chapters, setChapters] = useState([]);
  
  // Selected values
  const [selectedTradeGroup, setSelectedTradeGroup] = useState(null);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  
  const { userInfo } = React.useContext(AuthContext);
  const insets = useSafeAreaInsets();

  const difficultyOptions = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
  ];

  const questionTypeOptions = [
    { label: 'Multiple Choice (MCQ)', value: 'mcq' },
    { label: 'True/False', value: 'truefalse' },
    { label: 'Mixed', value: 'mixed' },
  ];

  const languageOptions = [
    { label: 'English', value: 'english' },
    { label: 'Hindi (हिंदी)', value: 'hindi' },
    { label: 'Hinglish (Hindi + English)', value: 'hinglish' },
  ];

  useEffect(() => {
    loadTradeGroups();
  }, []);

  const loadTradeGroups = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tradegroup`);
      const formatted = response.data.map(item => ({
        label: item.name,
        value: item.id.toString(),
      }));
      setTradeGroups(formatted);
    } catch (error) {
      console.log('Error loading trade groups:', error);
    }
  };

  const loadTrades = async (tradegroupId) => {
    try {
      const response = await axios.get(`${BASE_URL}/trade/${tradegroupId}`);
      const formatted = response.data.map(item => ({
        label: item.name,
        value: item.id.toString(),
      }));
      setTrades(formatted);
    } catch (error) {
      console.log('Error loading trades:', error);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.plainText],
      });
      
      // Read file content (for text files)
      if (result[0].type === 'text/plain') {
        const content = await RNFS.readFile(result[0].uri, 'utf8');
        setSyllabus(content.substring(0, 5000)); // Limit to 5000 chars
        Alert.alert('Success', 'Document content loaded successfully!');
      } else {
        Alert.alert('Info', 'PDF uploaded. Please also provide topic description.');
        setSyllabus(`[PDF Document: ${result[0].name}]`);
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Failed to pick document');
      }
    }
  };

  const generateExam = async () => {
    if (!topic.trim() && !syllabus.trim()) {
      Alert.alert('Error', 'Please provide a topic or upload syllabus');
      return;
    }

    if (!selectedTradeGroup || !selectedTrade) {
      Alert.alert('Error', 'Please select Trade Group and Trade');
      return;
    }

    setIsGenerating(true);
    setGeneratedQuestions([]);

    try {
      const response = await axios.post(`${BASE_URL}/ai/generate-exam`, {
        topic: topic,
        syllabus: syllabus,
        num_questions: parseInt(numQuestions),
        language: language,
        difficulty: difficulty,
        question_type: questionType,
        tradegroup: selectedTradeGroup,
        trade: selectedTrade,
        subject: selectedSubject || '',
        chapter: selectedChapter || '',
      });

      if (response.data.success) {
        setGeneratedQuestions(response.data.questions);
        Alert.alert('Success', `Generated ${response.data.questions.length} questions!`);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to generate questions');
      }
    } catch (error) {
      console.error('Generation error:', error);
      Alert.alert('Error', 'Failed to generate exam. Please check your internet connection.');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveQuestionsToDatabase = async () => {
    if (generatedQuestions.length === 0) {
      Alert.alert('Error', 'No questions to save');
      return;
    }

    Alert.alert(
      'Confirm Save',
      `Save ${generatedQuestions.length} questions to question bank?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: async () => {
            setIsSaving(true);
            try {
              const response = await axios.post(`${BASE_URL}/ai/save-questions`, {
                questions: generatedQuestions,
                tradegroup: selectedTradeGroup,
                trade: selectedTrade,
                subject: selectedSubject || '',
                chapter: selectedChapter || '',
              });

              if (response.data.success) {
                Alert.alert('Success', 'Questions saved successfully!', [
                  { text: 'OK', onPress: () => navigation.goBack() }
                ]);
              } else {
                Alert.alert('Error', 'Failed to save questions');
              }
            } catch (error) {
              console.error('Save error:', error);
              Alert.alert('Error', 'Failed to save questions');
            } finally {
              setIsSaving(false);
            }
          }
        }
      ]
    );
  };

  const renderQuestion = (question, index) => {
    return (
      <View key={index} style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>Q{index + 1}</Text>
          {question.difficulty && (
            <View style={[
              styles.difficultyBadge,
              { backgroundColor: 
                question.difficulty === 'easy' ? '#22c55e' : 
                question.difficulty === 'hard' ? '#ef4444' : '#f59e0b' 
              }
            ]}>
              <Text style={styles.difficultyText}>{question.difficulty}</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.questionText}>{question.question}</Text>
        
        {question.options && (
          <View style={styles.optionsContainer}>
            {question.options.map((option, idx) => (
              <View key={idx} style={[
                styles.optionItem,
                option.isCorrect && styles.correctOption
              ]}>
                <Text style={styles.optionLabel}>{String.fromCharCode(65 + idx)}.</Text>
                <Text style={[
                  styles.optionText,
                  option.isCorrect && styles.correctOptionText
                ]}>
                  {option.text}
                </Text>
                {option.isCorrect && (
                  <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                )}
              </View>
            ))}
          </View>
        )}
        
        {question.explanation && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationLabel}>💡 Explanation:</Text>
            <Text style={styles.explanationText}>{question.explanation}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb', paddingBottom: insets.bottom }}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#2563eb', '#1d4ed8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <FontAwesome5 name="magic" size={24} color="#fff" />
            <Text style={styles.headerTitle}>AI Exam Generator</Text>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {generatedQuestions.length === 0 ? (
            <>
              {/* Input Form */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>📚 Exam Details</Text>
                
                {/* Trade Group */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Trade Group *</Text>
                  <Picker
                    data={tradeGroups}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Trade Group"
                    value={selectedTradeGroup}
                    onChange={item => {
                      setSelectedTradeGroup(item.value);
                      loadTrades(item.value);
                    }}
                    style={styles.picker}
                  />
                </View>

                {/* Trade */}
                {selectedTradeGroup && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Trade *</Text>
                    <Picker
                      data={trades}
                      labelField="label"
                      valueField="value"
                      placeholder="Select Trade"
                      value={selectedTrade}
                      onChange={item => setSelectedTrade(item.value)}
                      style={styles.picker}
                    />
                  </View>
                )}

                {/* Topic */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Topic / Chapter Name *</Text>
                  <TextInput
                    style={styles.input}
                    value={topic}
                    onChangeText={setTopic}
                    placeholder="e.g., Supply and Demand, Microeconomics..."
                    placeholderTextColor="#9ca3af"
                    multiline
                  />
                </View>

                {/* Syllabus */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Detailed Syllabus (Optional)</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={syllabus}
                    onChangeText={setSyllabus}
                    placeholder="Paste chapter content or key points here..."
                    placeholderTextColor="#9ca3af"
                    multiline
                    numberOfLines={4}
                  />
                  <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                    <Ionicons name="document-attach" size={20} color="#2563eb" />
                    <Text style={styles.uploadButtonText}>Upload PDF/Text</Text>
                  </TouchableOpacity>
                </View>

                {/* Number of Questions */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Number of Questions</Text>
                  <TextInput
                    style={styles.input}
                    value={numQuestions}
                    onChangeText={setNumQuestions}
                    keyboardType="number-pad"
                    placeholder="10"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                {/* Language */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Language</Text>
                  <Picker
                    data={languageOptions}
                    labelField="label"
                    valueField="value"
                    value={language}
                    onChange={item => setLanguage(item.value)}
                    style={styles.picker}
                  />
                </View>

                {/* Difficulty */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Difficulty Level</Text>
                  <Picker
                    data={difficultyOptions}
                    labelField="label"
                    valueField="value"
                    value={difficulty}
                    onChange={item => setDifficulty(item.value)}
                    style={styles.picker}
                  />
                </View>

                {/* Question Type */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Question Type</Text>
                  <Picker
                    data={questionTypeOptions}
                    labelField="label"
                    valueField="value"
                    value={questionType}
                    onChange={item => setQuestionType(item.value)}
                    style={styles.picker}
                  />
                </View>
              </View>

              {/* Info Card */}
              <View style={styles.infoCard}>
                <Ionicons name="information-circle" size={24} color="#2563eb" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>How it works</Text>
                  <Text style={styles.infoText}>
                    AI will generate professional exam questions based on your topic and syllabus.
                    Review and edit before saving to question bank.
                  </Text>
                </View>
              </View>

              {/* Generate Button */}
              <TouchableOpacity
                style={styles.generateButton}
                onPress={generateExam}
                disabled={isGenerating}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={isGenerating ? ['#9ca3af', '#6b7280'] : ['#2563eb', '#1d4ed8']}
                  style={styles.generateButtonGradient}
                >
                  {isGenerating ? (
                    <>
                      <ActivityIndicator size="small" color="#fff" />
                      <Text style={styles.generateButtonText}>Generating...</Text>
                    </>
                  ) : (
                    <>
                      <FontAwesome5 name="magic" size={20} color="#fff" />
                      <Text style={styles.generateButtonText}>Generate Exam</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Generated Questions */}
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsTitle}>
                  ✅ Generated {generatedQuestions.length} Questions
                </Text>
                <Text style={styles.resultsSubtitle}>
                  Review and save to question bank
                </Text>
              </View>

              {generatedQuestions.map((q, idx) => renderQuestion(q, idx))}

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.regenerateButton]}
                  onPress={() => {
                    setGeneratedQuestions([]);
                  }}
                >
                  <Ionicons name="refresh" size={20} color="#6b7280" />
                  <Text style={styles.regenerateButtonText}>Generate New</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={saveQuestionsToDatabase}
                  disabled={isSaving}
                >
                  <LinearGradient
                    colors={isSaving ? ['#9ca3af', '#6b7280'] : ['#22c55e', '#16a34a']}
                    style={styles.saveButtonGradient}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    )}
                    <Text style={styles.saveButtonText}>
                      {isSaving ? 'Saving...' : 'Save to Question Bank'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
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
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  picker: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 18,
  },
  generateButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  generateButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  generateButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  resultsHeader: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  resultsSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
  },
  questionText: {
    fontSize: 15,
    color: '#111827',
    lineHeight: 22,
    marginBottom: 12,
    fontWeight: '500',
  },
  optionsContainer: {
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  correctOption: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6b7280',
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  correctOptionText: {
    color: '#15803d',
    fontWeight: '600',
  },
  explanationContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
  },
  explanationLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
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
  },
  regenerateButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  regenerateButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6b7280',
  },
  saveButton: {
    flex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  saveButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});

export default AIExamGenerator;

