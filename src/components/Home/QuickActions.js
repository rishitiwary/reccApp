import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import {useNavigation} from '@react-navigation/native';
import COLORS from '../../config/colors';

const QuickActions = () => {
  const navigation = useNavigation();

  const actions = [
    {
      id: 1,
      label: 'Courses',
      icon: 'book',
      color: '#2563eb',
      bgColor: '#dbeafe',
      onPress: () => navigation.navigate('Course', {type: 'all', name: 'All Courses'}),
    },
    {
      id: 2,
      label: 'Test Series',
      icon: 'file-text-o',
      color: '#16a34a',
      bgColor: '#dcfce7',
      onPress: () => console.log('Test Series'),
    },
    {
      id: 3,
      label: 'Free Classes',
      icon: 'play-circle',
      color: '#dc2626',
      bgColor: '#fee2e2',
      onPress: () => console.log('Free Classes'),
    },
    {
      id: 4,
      label: 'PDF Notes',
      icon: 'file-pdf-o',
      color: '#9333ea',
      bgColor: '#f3e8ff',
      onPress: () => console.log('PDF Notes'),
    },
    {
      id: 5,
      label: 'Results',
      icon: 'trophy',
      color: '#ea580c',
      bgColor: '#ffedd5',
      onPress: () => console.log('Results'),
    },
    {
      id: 6,
      label: 'Live Class',
      icon: 'video-camera',
      color: '#0891b2',
      bgColor: '#cffafe',
      onPress: () => console.log('Live Class'),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {actions.map(action => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionItem}
            onPress={action.onPress}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, {backgroundColor: action.bgColor}]}>
              <FontAwesome name={action.icon} size={24} color={action.color} />
            </View>
            <Text style={styles.label}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: '#f8f9fa',
    marginBottom: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 24,
  },
  actionItem: {
    alignItems: 'center',
    width: 80,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
});

export default QuickActions;
