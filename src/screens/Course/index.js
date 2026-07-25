import React, {useState, useEffect, useContext, useCallback, useMemo} from 'react';
import api from '../../services/api';
import {BASE_URL, IMG_URL, institute_id} from '../../config/config';
import {AuthContext} from '../../components/AuthContext';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Payment, verifyPayment} from '../../components/Payment';
import {Loader} from '../../components/Loader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import COLORS from '../../config/colors';
import AppHeader from '../../components/Header/AppHeader';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import LinearGradient from 'react-native-linear-gradient';
import {BottomNavigation} from '../../components/BottomNavigation';

const debounce = (func, delay) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

const Course = ({route}) => {
  const insets = useSafeAreaInsets();
  const [payStatus, setPayStatus] = useState(false);
  const [payResponse, setPayResponse] = useState(null);
  const [spinner, setSpinner] = useState(true);
  const {userInfo} = useContext(AuthContext);
  const email = JSON.parse(userInfo).data.email;
  const navigation = useNavigation();
  const [getData, setData] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [latestCourses, setLatestCourses] = useState([]);
  const [showAllLatest, setShowAllLatest] = useState(false);
  const [bannerImage, setBannerImage] = useState(null);
  const [sortBy, setSortBy] = useState('Popular');
  const [language, setLanguage] = useState('All');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [showSortModal, setShowSortModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const type = route.params.type;
  let url;
  let purchaseVal = {
    name: JSON.parse(userInfo).data.firstname,
    email: JSON.parse(userInfo).data.email,
    mobile: JSON.parse(userInfo).data.mobileno,
    uid: JSON.parse(userInfo).data.id,
  };
  if (type === 'popular') {
    url = `${BASE_URL}/popularcourse?type=all&email=${email}&keyword=${keyword}&institute_id=${institute_id}`;
  } else if (type === 'allCourses') {
    url = `${BASE_URL}/popularcourse?type=allCourses&email=${email}&keyword=${keyword}&institute_id=${institute_id}`;
  } else {
    url = `${BASE_URL}/coursebycategory/${type}?email=${email}&keyword=${keyword}&institute_id=${institute_id}`;
  }

  const fetchData = useCallback(async () => {
    try {
      setSpinner(true);
      const result = await api.get(url, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(result.data);
      setFilteredData(result.data?.data || []);
      setSpinner(false);
    } catch (error) {
      // console.log(error);
      setSpinner(false);
    }
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...(getData.data || [])];

    // Apply language filter
    if (language !== 'All') {
      filtered = filtered.filter(course => 
        course.language?.toLowerCase() === language.toLowerCase()
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'Popular':
        filtered.sort((a, b) => (b.student_count || 0) - (a.student_count || 0));
        break;
      case 'Price: Low to High':
        filtered.sort((a, b) => {
          const priceA = a.price - a.price * (a.discount / 100);
          const priceB = b.price - b.price * (b.discount / 100);
          return priceA - priceB;
        });
        break;
      case 'Price: High to Low':
        filtered.sort((a, b) => {
          const priceA = a.price - a.price * (a.discount / 100);
          const priceB = b.price - b.price * (b.discount / 100);
          return priceB - priceA;
        });
        break;
      case 'Rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'Newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    setFilteredData(filtered);
  }, [getData.data, language, sortBy]);

  useEffect(() => {
    if (getData.data) {
      applyFilters();
    }
  }, [sortBy, language, getData.data, applyFilters]);
  const fetchLatestCourses = useCallback(async () => {
    try {
      const result = await api.get(
        `${BASE_URL}/popularcourse?type=latest&email=${email}&limit=5&institute_id=${institute_id}`,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      setLatestCourses(result.data?.data || []);
    } catch (error) {
      console.log('Error fetching latest courses:', error);
    }
  }, [email]);

  const fetchBanner = useCallback(async () => {
    try {
      const result = await api.get(`${BASE_URL}/course-banner?institute_id=${institute_id}`);
      if (result.data?.data) {
        setBannerImage(result.data.data);
      }
    } catch (error) {
      console.log('Error fetching banner:', error);
    }
  }, []);

  useEffect(() => {
    // verifyPayment(payResponse);
    if (payStatus == true) {
      navigation.push('My Purchased');
    }
  }, [payStatus]);

  useEffect(() => {
    navigation.setOptions({headerShown: false});
    fetchData();
    fetchLatestCourses();
    fetchBanner();
  }, [fetchData, fetchLatestCourses, fetchBanner, payStatus]);

  const searchData = async () => {
    try {
      setSpinner(true);
      const result = await api.get(url, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(result.data);
      setFilteredData(result.data?.data || []);
      setSpinner(false);
    } catch (error) {
      setSpinner(false);
    }
  };

  // Memoize the debounced function to prevent recreating on every render
  const debouncedSearch = useMemo(
    () => debounce(searchData, 1000),
    [url]
  );

  const search = text => {
    setKeyword(text);
    debouncedSearch();
  };
  const handleClick = item => {
    navigation.navigate('Course Details', {
      item,
    });
  };
  const startLesson = item => {
    navigation.navigate('Course Details', {
      item,
      paid: 1,
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: '#1d6bde'}}>
      <Loader status={spinner} />
      <AppHeader />

      <ScrollView
        style={{flex: 1, backgroundColor: '#f8f9fa'}}
        contentContainerStyle={{paddingBottom: 100 + insets.bottom}}
        showsVerticalScrollIndicator={false}>
        
        {/* Latest Courses Section */}
        <View style={localStyles.latestSection}>
          <View style={localStyles.latestHeader}>
            <Text style={localStyles.latestTitle}>All Courses</Text>
            <TouchableOpacity
              onPress={() => setShowAllLatest(!showAllLatest)}
              style={localStyles.moreButton}>
              <Text style={localStyles.moreText}>
                {showAllLatest ? 'Show Less' : 'More'}
              </Text>
              <FontAwesome
                name={showAllLatest ? 'angle-up' : 'angle-right'}
                size={16}
                color="#2563eb"
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={localStyles.latestScroll}>
            {(showAllLatest ? latestCourses : latestCourses.slice(0, 5)).map(
              (course, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleClick(course)}
                  style={localStyles.latestCard}>
                  {course.course_thumbnail ? (
                    <Image
                      source={{uri:course.course_thumbnail}}
                      style={localStyles.latestImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[
                        localStyles.latestImage,
                        {backgroundColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center'},
                      ]}>
                      <FontAwesome name="book" size={24} color="#9ca3af" />
                    </View>
                  )}
                  <Text style={localStyles.latestCourseTitle} numberOfLines={2}>
                    {course.title}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </ScrollView>
        </View>

        {/* Banner Section */}
        {bannerImage && (
          <TouchableOpacity
            onPress={handleBannerClick}
            activeOpacity={0.9}
            style={localStyles.bannerContainer}>
            <Image
              source={{uri: bannerImage.image}}
              style={localStyles.bannerImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}

        {/* Filter Section */}
        <View style={localStyles.filterSection}>
          <View style={localStyles.filterRow}>
            <TouchableOpacity 
              style={localStyles.filterButton}
              onPress={() => {
                setSortBy('Popular');
                setLanguage('All');
              }}>
              <FontAwesome name="filter" size={14} color="#6b7280" />
              <Text style={localStyles.filterText}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={localStyles.filterButton}
              onPress={() => setShowSortModal(true)}>
              <Text style={localStyles.filterText}>Sort: {sortBy}</Text>
              <FontAwesome name="angle-down" size={14} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={localStyles.filterButton}
              onPress={() => setShowLanguageModal(true)}>
              <Text style={localStyles.filterText}>Lang: {language}</Text>
              <FontAwesome name="angle-down" size={14} color="#6b7280" />
            </TouchableOpacity>

            <View style={localStyles.viewToggle}>
              <TouchableOpacity
                onPress={() => setViewMode('grid')}
                style={[
                  localStyles.viewButton,
                  viewMode === 'grid' && localStyles.viewButtonActive,
                ]}>
                <FontAwesome
                  name="th"
                  size={14}
                  color={viewMode === 'grid' ? '#2563eb' : '#6b7280'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setViewMode('list')}
                style={[
                  localStyles.viewButton,
                  viewMode === 'list' && localStyles.viewButtonActive,
                ]}>
                <FontAwesome
                  name="list"
                  size={14}
                  color={viewMode === 'list' ? '#2563eb' : '#6b7280'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={localStyles.searchContainer}>
            <FontAwesome
              name="search"
              size={16}
              color="#9ca3af"
              style={localStyles.searchIcon}
            />
            <TextInput
              placeholder="Search courses..."
              placeholderTextColor="#9ca3af"
              style={localStyles.searchInput}
              onChangeText={search}
              value={keyword}
            />
          </View>
        </View>

        {/* Courses List */}
        <View style={{paddingHorizontal: 16}}>
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()}
            removeClippedSubviews
            initialNumToRender={4}
            scrollEnabled={false}
            renderItem={({item}) => (
              <View style={localStyles.card}>
                <View style={localStyles.cardRow}>
                  <View style={localStyles.imageContainer}>
                    <Image
                      source={{uri: item.course_thumbnail}}
                      style={localStyles.cardImage}
                      resizeMode="stretch"
                    />
                  </View>

                  <View style={localStyles.cardContent}>
                    <Text numberOfLines={2} style={localStyles.cardTitle}>
                      {item.title}
                    </Text>
                    <View style={localStyles.description}>
                      <Text style={localStyles.descriptionText}>
                        Course: {item.tradeName}
                      </Text>
                      <View>
                        <Text style={localStyles.price}>
                          ₹{' '}
                          {(
                            item.price -
                            item.price * (item.discount / 100)
                          ).toFixed(2)}{' '}
                          ,{' '}
                          <Text style={localStyles.oldPrice}>
                            {item.price.toFixed(2)}
                          </Text>
                        </Text>
                      </View>
                    </View>
                    <View style={localStyles.buttonRow}>
                      {item.purchased ? (
                        <TouchableOpacity onPress={() => startLesson(item)}>
                          <View style={localStyles.buynow}>
                            <Text style={localStyles.buttonText}>Start Lesson</Text>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={() =>
                            Payment([
                              {purchaseVal, item, setPayStatus, setPayResponse},
                            ])
                          }>
                          <View style={localStyles.buynow}>
                            <Text style={localStyles.buttonText}>Buy Now</Text>
                          </View>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity onPress={() => handleClick(item)}>
                        <View style={localStyles.detailsBtn}>
                          <Text style={localStyles.detailsBtnText}>Details</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
};

const localStyles = StyleSheet.create({
  latestSection: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    marginBottom: 8,
  },
  latestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  latestTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  moreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  latestScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  latestCard: {
    width: 100,
  },
  latestImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginBottom: 6,
  },
  latestCourseTitle: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 14,
  },
  bannerContainer: {
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  bannerImage: {
    width: '100%',
    height: 140,
    borderRadius: 12,
  },
  filterSection: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  filterText: {
    fontSize: 12,
    color: '#6b7280',
  },
  viewToggle: {
    flexDirection: 'row',
    marginLeft: 'auto',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
  },
  viewButton: {
    padding: 6,
    paddingHorizontal: 10,
  },
  viewButtonActive: {
    backgroundColor: '#eff6ff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardRow: {
    flexDirection: 'row',
  },
  imageContainer: {
    width: 100,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
  },
  oldPrice: {
    fontSize: 13,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 8,
  },
  buynow: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  detailsBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  detailsBtnText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  modalOptionActive: {
    backgroundColor: '#eff6ff',
  },
  modalOptionText: {
    fontSize: 15,
    color: '#374151',
  },
  modalOptionTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
});

export default Course;
