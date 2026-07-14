import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import COLORS from '../../config/colors';

const LiveClassCard = ({liveClass, onJoin}) => {
  const [timer, setTimer] = useState({hrs: 0, min: 0, sec: 0});

  useEffect(() => {
    // Calculate time difference if start_time is provided
    if (liveClass.start_time) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const startTime = new Date(liveClass.start_time).getTime();
        const diff = Math.max(0, startTime - now);
        
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const min = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const sec = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimer({hrs, min, sec});
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [liveClass.start_time]);

  return (
    <View style={styles.card}>
      {/* Left: Instructor Image with LIVE badge */}
      <View style={styles.imageContainer}>
        {liveClass.instructor_image ? (
          <Image
            source={{uri: liveClass.instructor_image}}
            style={styles.instructorImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.instructorImage, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>
              {liveClass.instructor_name?.charAt(0) || 'I'}
            </Text>
          </View>
        )}
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>● LIVE</Text>
        </View>
      </View>

      {/* Middle: Class Details */}
      <View style={styles.details}>
        <Text style={styles.classTitle} numberOfLines={1}>
          {liveClass.title || 'Live Class'}
        </Text>
        <Text style={styles.classSubtitle} numberOfLines={1}>
          {liveClass.subtitle || 'Top 1000 Questions Series'}
        </Text>
        <Text style={styles.instructorName} numberOfLines={1}>
          By {liveClass.instructor_name || 'Instructor'}
        </Text>
      </View>

      {/* Right: Timer and Join Button */}
      <View style={styles.rightSection}>
        <View style={styles.timer}>
          <View style={styles.timerUnit}>
            <Text style={styles.timerValue}>{String(timer.hrs).padStart(2, '0')}</Text>
            <Text style={styles.timerLabel}>HRS</Text>
          </View>
          <Text style={styles.timerSeparator}>:</Text>
          <View style={styles.timerUnit}>
            <Text style={styles.timerValue}>{String(timer.min).padStart(2, '0')}</Text>
            <Text style={styles.timerLabel}>MIN</Text>
          </View>
          <Text style={styles.timerSeparator}>:</Text>
          <View style={styles.timerUnit}>
            <Text style={styles.timerValue}>{String(timer.sec).padStart(2, '0')}</Text>
            <Text style={styles.timerLabel}>SEC</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => onJoin && onJoin(liveClass)}
          activeOpacity={0.8}
        >
          <Text style={styles.joinButtonText}>Join Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  instructorImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  placeholderImage: {
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#9ca3af',
  },
  liveBadge: {
    position: 'absolute',
    top: -4,
    left: -4,
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  details: {
    flex: 1,
    marginRight: 12,
  },
  classTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  classSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  instructorName: {
    fontSize: 11,
    color: '#9ca3af',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timerUnit: {
    alignItems: 'center',
  },
  timerValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  timerLabel: {
    fontSize: 8,
    color: '#9ca3af',
    marginTop: 2,
  },
  timerSeparator: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginHorizontal: 4,
  },
  joinButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default LiveClassCard;
