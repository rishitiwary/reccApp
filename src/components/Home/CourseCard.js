import React from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import COLORS from '../../config/colors';
import {IMG_URL} from '../../config/config';

const CourseCard = ({
  course,
  onPress,
  onBuyNow,
  onContinueLearning,
  purchaseVal,
  width = 180,
}) => {
  // Determine card background color based on course
  const getCardColor = () => {
    const title = course.title?.toLowerCase() || '';
    if (title.includes('inter level') || title.includes('combined')) {
      return '#1e3a8a'; // Dark blue
    } else if (title.includes('field worker')) {
      return '#059669'; // Green
    } else if (title.includes('jtet') || title.includes('paper')) {
      return '#6b21a8'; // Purple
    }
    return '#1e3a8a'; // Default dark blue
  };

  // Determine badge text
  const getBadgeText = () => {
    const title = course.title?.toLowerCase() || '';
    if (title.includes('live') || course.is_live) {
      return 'LIVE BATCH';
    }
    return 'NEW BATCH';
  };

  return (
    <View style={[styles.card, {width}]}>
      <TouchableOpacity
        onPress={() => {
          // If purchased, go to continue learning, else go to details
          if (course.purchased) {
            onContinueLearning && onContinueLearning(course);
          } else {
            onPress && onPress();
          }
        }}
        activeOpacity={0.9}
      >
        {/* Course Image with Overlay */}
        <View style={styles.imageContainer}>
          {course.course_thumbnail ? (
            <Image
              source={{uri:course.course_thumbnail}}
              style={styles.courseImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.courseImage, {backgroundColor: getCardColor()}]} />
          )}
          
          {/* Gradient Overlay */}
          <View style={styles.overlay} />
          
          {/* Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{getBadgeText()}</Text>
          </View>

          {/* Course Title */}
          <View style={styles.titleOverlay}>
            <Text style={styles.courseTitle} numberOfLines={2}>
              {course.title}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* White Details Section */}
      <View style={styles.details}>
        {/* Course Info */}
        <Text style={styles.courseSubtitle} numberOfLines={1}>
          {course.tradeName || 'Combined Batch'}
        </Text>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <FontAwesome name="user" size={10} color="#6b7280" />
            <Text style={styles.statText}>
              {course.student_count ? `${course.student_count.toLocaleString()} Students` : '1,245 Students'}
            </Text>
          </View>
          
          <View style={styles.stat}>
            <FontAwesome name="star" size={10} color="#fbbf24" />
            <Text style={styles.statText}>{course.rating || '4.8'}</Text>
          </View>
        </View>

        {/* Action Button */}
        {course.purchased ? (
          <TouchableOpacity
            onPress={() => {
              onContinueLearning && onContinueLearning(course);
            }}
            style={[styles.enrollButton, styles.continueLearningButton]}
            activeOpacity={0.8}
          >
            <Text style={styles.enrollText}>Continue Learning</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              onPress && onPress();
            }}
            style={styles.enrollButton}
            activeOpacity={0.8}
          >
            <Text style={styles.enrollText}>Enroll Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  courseImage: {
    width: '100%',
    height: 120,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#fbbf24',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 0.5,
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 20,
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 3,
  },
  details: {
    padding: 12,
    backgroundColor: '#fff',
  },
  courseSubtitle: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 11,
    color: '#6b7280',
  },
  enrollButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueLearningButton: {
    backgroundColor: '#059669',
  },
  enrollText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default CourseCard;
