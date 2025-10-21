import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  StatusBar,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AuthContext} from '../../components/AuthContext';
import LoginCheck from '../../components/LoginCheck';
import {BASE_URL, IMG_URL} from '../../config/config';
import axios from 'axios';
import styles from './enhancedStyle';

const CourseDetails = ({route}) => {
  const insets = useSafeAreaInsets();
  const {userInfo} = React.useContext(AuthContext);
  const userId = JSON.parse(userInfo).data.id;
  const email = JSON.parse(userInfo).data.email;

  const paid = route.params.paid;
  const [type, setType] = useState(1);
  const [getData, setData] = useState([]);
  const course = route.params.item;
  const courseId = route.params.item.id;
  const courseTitle = route.params.item.title;

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.95));

  const navigation = useNavigation();

  const courseViewCounts = async () => {
    let formData = {
      userId,
      courseId,
      email,
    };
    await axios({
      method: 'POST',
      url: `${BASE_URL}/courseViewCounts`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(function (response) {
        let success = JSON.stringify(response.data.success);
        if (success == 'true') {
          console.log('inserted successfully');
        } else {
          console.log('Some error occured');
        }
      })
      .catch(function (error) {
        console.log('error', error);
      });
  };

  const playVideo = videoId => {
    navigation.navigate('Description', {
      videoId,
    });
  };

  const demoVideos = async () => {
    try {
      let result = await axios({
        method: 'GET',
        url: `${BASE_URL}/demovideos/${course.id}`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const ViewContents = () => {
    navigation.navigate('Contents', {
      courseId,
      courseTitle,
      folderId: 0,
      paid,
    });
  };

  const regex = /(&nbsp|amp|quot|lt|gt|;|<([^>]+)>)/gi;

  useEffect(() => {
    courseViewCounts();
    demoVideos();
    navigation.setOptions({title: route.params.item.title});

    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const TabButton = ({title, onPress, isActive}) => (
    <TouchableOpacity onPress={onPress} style={styles.tabButton}>
      <Animated.View
        style={[
          styles.tabButtonInner,
          isActive && styles.activeTabButton,
          {
            transform: [{scale: isActive ? 1 : 0.95}],
          },
        ]}>
        <Text style={[styles.tabText, isActive && styles.activeTabText]}>
          {title}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );

  const VideoCard = ({item}) => (
    <TouchableOpacity
      onPress={() => playVideo(item.video_id)}
      activeOpacity={0.9}>
      <View style={styles.videoCard}>
        <View style={styles.thumbnailContainer}>
          <Image
            source={{
              uri: `http://img.youtube.com/vi/${item.video_id}/hqdefault.jpg`,
            }}
            style={styles.videoThumbnail}
            resizeMode="cover"
          />
          <View style={styles.playIconOverlay}>
            <View style={styles.playIcon}>
              <Text style={styles.playIconText}>▶</Text>
            </View>
          </View>
        </View>
        <View style={styles.videoInfo}>
          <Text numberOfLines={2} style={styles.videoTitle}>
            {item.title}
          </Text>
          <Text numberOfLines={2} style={styles.videoDescription}>
            {item.description.replace(regex, '')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.mainContainer, {paddingBottom: insets.bottom}]}>
      {/* <StatusBar barStyle="dark-content" backgroundColor="#fff" /> */}
      <LoginCheck />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{translateY: slideAnim}],
          }}>
          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TabButton
              title="Overview"
              onPress={() => setType(1)}
              isActive={type === 1}
            />
            <TabButton
              title="Content"
              onPress={ViewContents}
              isActive={false}
            />
          </View>

          {/* Course Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.courseTitle}>{course.title}</Text>
          </View>

          {/* Main Course Image with Enhanced Shadow */}
          <Animated.View
            style={[
              styles.heroImageContainer,
              {
                transform: [{scale: scaleAnim}],
              },
            ]}>
            <Image
              key={course.id}
              source={{uri: `${IMG_URL + course.course_thumbnail}`}}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <View style={styles.imageGradient} />
          </Animated.View>

          {/* About Section with Card Design */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Text style={styles.sectionIcon}>📚</Text>
              </View>
              <Text style={styles.sectionTitle}>About This Course</Text>
            </View>
            <Text style={styles.descriptionText}>
              {course.description.replace(regex, '')}
            </Text>
          </View>

          {/* Course Preview Video */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconContainer}>
                <Text style={styles.sectionIcon}>🎥</Text>
              </View>
              <Text style={styles.sectionTitle}>Course Preview</Text>
            </View>
            <TouchableOpacity
              onPress={() => playVideo(course.course_url)}
              activeOpacity={0.9}
              style={styles.previewContainer}>
              <Image
                key={course.id}
                source={{
                  uri: `http://img.youtube.com/vi/${course.course_url}/hqdefault.jpg`,
                }}
                style={styles.previewImage}
                resizeMode="cover"
              />
              <View style={styles.playButtonOverlay}>
                <View style={styles.playButton}>
                  <Text style={styles.playButtonText}>▶</Text>
                </View>
                <Text style={styles.playButtonLabel}>Watch Preview</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Related Videos Section */}
          {getData.data && getData.data.length > 0 && (
            <View style={styles.relatedSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconContainer}>
                  <Text style={styles.sectionIcon}>🎬</Text>
                </View>
                <Text style={styles.sectionTitle}>Free Related Videos</Text>
              </View>
              <FlatList
                data={getData.data}
                horizontal
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => <VideoCard item={item} />}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.videoList}
                snapToInterval={310}
                decelerationRate="fast"
              />
            </View>
          )}

          {/* Bottom Padding */}
          <View style={{height: 30}} />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default CourseDetails;