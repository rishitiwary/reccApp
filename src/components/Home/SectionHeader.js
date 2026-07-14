import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import COLORS from '../../config/colors';

const SectionHeader = ({title, icon, onViewAll, showViewAll = true}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {icon && (
          <View style={styles.iconContainer}>
            <FontAwesome name={icon} size={18} color="#F59E0B" />
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      
      {showViewAll && onViewAll && (
        <TouchableOpacity
          onPress={onViewAll}
          style={styles.viewAllButton}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <FontAwesome name="chevron-right" size={12} color={COLORS.coursesBlue} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1f2937',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
  },
});

export default SectionHeader;
