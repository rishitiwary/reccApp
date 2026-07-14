import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Image,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import api from '../../services/api';
import {institute_id} from '../../config/config';

const {width} = Dimensions.get('window');
const BANNER_HEIGHT = 180;

const HeroBanner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % banners.length;
        setCurrentIndex(nextIndex);
        scrollViewRef.current?.scrollTo({
          x: nextIndex * width,
          animated: true,
        });
      }, 5000); // Auto-slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [currentIndex, banners.length]);

  const fetchBanners = async () => {
    try {
      const response = await api.get(`/banners?institute_id=${institute_id}`);
      if (response.data.success && response.data.data) {
        setBanners(response.data.data);
      }
    } catch (error) {
      console.log('Error fetching banners:', error);
    }
  };

  const handleScroll = event => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / width,
    );
    setCurrentIndex(slideIndex);
  };

  if (banners.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {banners.map((banner, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            onPress={() => console.log('Banner clicked:', banner)}
          >
            <Image
              source={{uri: banner.image}}
              style={styles.banner}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      {banners.length > 1 && (
        <View style={styles.pagination}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: BANNER_HEIGHT,
    marginBottom: 0,
    backgroundColor: '#f8f9fa',
  },
  banner: {
    width: width,
    height: BANNER_HEIGHT,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 20,
  },
});

export default HeroBanner;
