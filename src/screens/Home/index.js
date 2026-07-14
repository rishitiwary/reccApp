import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { BASE_URL, IMG_URL, institute_id } from '../../config/config';
import { useNavigation } from '@react-navigation/native';
import { BottomNavigation } from '../../components/BottomNavigation';
import { AuthContext } from '../../components/AuthContext';
import { Loader } from '../../components/Loader';
import { Payment } from '../../components/Payment';
import VersionCheck from 'react-native-version-check';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { LinearGradient } from 'react-native-linear-gradient';

// New components
import AppHeader from '../../components/Header/AppHeader';
import HeroBanner from '../../components/Home/HeroBanner';
import QuickActions from '../../components/Home/QuickActions';
import SectionHeader from '../../components/Home/SectionHeader';
import CourseCard from '../../components/Home/CourseCard';
import LiveClassCard from '../../components/Home/LiveClassCard';
import COLORS from '../../config/colors';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [spinner, setSpinner] = useState(true);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { userInfo } = React.useContext(AuthContext);
  const email = JSON.parse(userInfo).data.email;
  const userName = JSON.parse(userInfo).data.firstname;
  const [getData, setData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [liveClasses, setLiveClasses] = useState([]);
  const [settings, setSettings] = useState(null);

  // Check android version and send for auto update
  const checkForUpdate = () => {
    VersionCheck.needUpdate().then(async res => {
      console.log('Check for update', res.isNeeded);
      if (res.isNeeded) {
        Linking.openURL(res.storeUrl);
      }
    });
  };

  const handleClick = async item => {
    await navigation.navigate('Course Details', {
      item,
      paid: 1,
    });
  };

  const handleDetails = async item => {
    await navigation.navigate('Course Details', {
      item,
      paid: 0,
    });
  };

  const coursesByCategory = async type => {
    await navigation.navigate('Course', {
      type: type.type,
      name: type.name,
    });
  };

  let purchaseVal = {
    name: JSON.parse(userInfo).data.firstname,
    email: JSON.parse(userInfo).data.email,
    mobile: JSON.parse(userInfo).data.mobileno,
    uid: JSON.parse(userInfo).data.id,
  };

  const handleFetchData = async () => {
    try {
      setSpinner(true);
      let result = await api.get(`/coursecategory?institute_id=${institute_id}`);
      setData(result.data);
      setSpinner(false);
    } catch (error) {
      console.log(error);
      setSpinner(false);
    }
  };

  const popularCourses = async () => {
    try {
      let result = await api.get(`/popularcourse?email=${email}&institute_id=${institute_id}`);
      setCourses(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLiveClasses = async () => {
    try {
      let result = await api.get(`/liveVideos/${email}`);
      console.log('Live classes response:', result.data);
      if (result.data && Array.isArray(result.data)) {
        setLiveClasses(result.data);
      } else if (result.data) {
        // If it's an object with data property
        setLiveClasses(result.data.data || []);
      }
    } catch (error) {
      console.log('Error fetching live classes:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const cachedSettings = await AsyncStorage.getItem('settings');
      if (cachedSettings) {
        const settingsData = JSON.parse(cachedSettings);
        setSettings(settingsData);
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  useEffect(() => {
    // Hide the navigation header since we have custom AppHeader
    navigation.setOptions({ headerShown: false });
    
    checkForUpdate();
    loadSettings();
    handleFetchData();
    popularCourses();
    fetchLiveClasses();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#1d6bde' ,paddingBottom: insets.bottom}}>
      <Loader status={spinner} />

      {/* New App Header */}
      <AppHeader />

      <ScrollView 
        keyboardShouldPersistTaps="always" 
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, backgroundColor: '#f8f9fa' }}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      >
        {/* Hero Banner Carousel */}
        <HeroBanner />

        {/* Quick Actions */}
        <QuickActions />

        {/* Popular Courses Section */}
        <View style={{ marginBottom: 16, backgroundColor: '#fff' }}>
          <SectionHeader
            title="Trending Courses"
            icon="fire"
            onViewAll={() => coursesByCategory({ type: 'popular', name: 'Popular Courses' })}
          />

          <FlatList
            data={Array.isArray(courses.data) ? courses.data : []}
            horizontal
            keyExtractor={item => String(item.id)}
            removeClippedSubviews
            initialNumToRender={3}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}
            renderItem={({ item }) => (
              <CourseCard
                course={item}
                onPress={() => handleDetails(item)}
                onBuyNow={(course, purchaseData) => Payment([{ purchaseVal, item: course }])}
                onContinueLearning={(course) => handleClick(course)}
                purchaseVal={purchaseVal}
                width={200}
              />
            )}
          />
        </View>

        {/* Live Classes Section */}
        <View style={{ marginTop: 0, marginBottom: 16, backgroundColor: '#fff' }}>
          <SectionHeader
            title="Live Classes"
            icon="video-camera"
            onViewAll={() => console.log('View All Live Classes')}
          />
          <View style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
            {liveClasses.length > 0 ? (
              liveClasses.map((liveClass, index) => (
                <LiveClassCard
                  key={index}
                  liveClass={liveClass}
                  onJoin={(cls) => console.log('Join live class:', cls)}
                />
              ))
            ) : (
              <LiveClassCard
                liveClass={{
                  title: 'Jharkhand GK Marathon',
                  subtitle: 'Top 1000 Questions Series',
                  instructor_name: 'Sandeep Sir',
                  start_time: new Date(Date.now() + 2745000).toISOString(), // 45 mins 45 secs from now
                }}
                onJoin={(cls) => console.log('Join live class:', cls)}
              />
            )}
          </View>
        </View>

        {/* Course Category Section */}
        <View style={{ marginTop: 16, paddingBottom: 100 }}>
          <SectionHeader
            title="Course Categories"
            icon="th-large"
            onViewAll={() => coursesByCategory({ type: 'allCourses', name: 'All Courses' })}
          />

          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingHorizontal: 16,
          }}>
            {Array.isArray(getData.data) &&
              getData.data.map(item => {
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() =>
                      coursesByCategory({ type: item.id, name: item.type })
                    }
                    activeOpacity={0.8}
                    style={{ width: '50%', padding: 4 }}
                  >
                    <View style={{
                      backgroundColor: '#fff',
                      borderRadius: 14,
                      overflow: 'hidden',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.06,
                      shadowRadius: 8,
                      elevation: 2,
                      borderWidth: 1,
                      borderColor: '#f0f0f0',
                    }}>
                      <Image
                        source={{ uri: `${item.feature_image}` }}
                        style={{
                          width: '100%',
                          height: 110,
                          resizeMode: 'cover',
                        }}
                      />
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.5)']}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 110,
                          justifyContent: 'flex-end',
                          padding: 10,
                        }}
                      >
                        <Text
                          numberOfLines={2}
                          style={{
                            fontSize: 14,
                            fontWeight: '700',
                            color: '#fff',
                            textShadowColor: 'rgba(0, 0, 0, 0.5)',
                            textShadowOffset: { width: 0, height: 1 },
                            textShadowRadius: 3,
                          }}
                        >
                          {item.type}
                        </Text>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
};

export default HomeScreen;
