import React, {useState, useEffect} from 'react';
import api from '../../services/api';
import {BASE_URL} from '../../config/config';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import {AuthContext} from '../../components/AuthContext';
import {useNavigation} from '@react-navigation/native';
import {BottomNavigation} from '../../components/BottomNavigation';
import {Loader} from '../../components/Loader';
import ImagePlaceHolder from '../../../assets/images/placeholder.jpeg';
import BlinkingText from '../../components/BlinkingText';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import COLORS from '../../config/colors';
const LiveVideoList = () => {
  const insets = useSafeAreaInsets();
  const [loadingStatus, setLoadingStatus] = useState(true);
  const {userInfo} = React.useContext(AuthContext);
  const navigation = useNavigation();
  const [getData, setData] = useState([]);
  let id = JSON.parse(userInfo).data.email;
  const [keyword, setKeyword] = useState('');

  let url = `${BASE_URL}/liveVideos/${id}?keyword=${keyword}`;

  const Search = async val => {
    setKeyword(val);
    try {
      // setSpinner(true);
      let result = await api({
        method: 'GET',
        url: url,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setData(result.data);
      // setSpinner(false);
    } catch (e) {
      console.log(e);
    }
  };

  const playLiveVideo = async item => {
    navigation.push('Live', {
      user_id: id,
      videoId: item.video_id,
    });
  };
  const handleFetchData = async () => {
    try {
      setLoadingStatus(true);
      let result = await api({
        method: 'GET',
        url: `${BASE_URL}/liveVideos/${id}`,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (result.status === 200) {
        setData(result.data);
        setLoadingStatus(false);
      } else {
        Alert.alert('Server Error', result.status);
        setLoadingStatus(false);
      }
    } catch (error) {
      Alert.alert('Error', error);
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({title: 'Live Classes'});
    handleFetchData();
    setTimeout(() => {
      setLoadingStatus(false);
    }, 4000);
  }, []);

  const EmptyState = () => (
    <View style={localStyles.emptyContainer}>
      <View style={localStyles.emptyIcon}>
        <FontAwesome name="video-camera" color="#2563eb" size={50} />
      </View>
      <Text style={localStyles.emptyTitle}>No Live Classes</Text>
      <Text style={localStyles.emptyText}>
        There are no live classes scheduled at the moment. Check back later!
      </Text>
    </View>
  );

  return (
    <View style={[localStyles.container, {paddingBottom: insets.bottom}]}>
      <Loader status={loadingStatus} />

      <View style={{flex: 1}}>
        {!loadingStatus && getData.data && getData.data.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={getData.data}
            keyExtractor={item => String(item.id)}
            removeClippedSubviews
            initialNumToRender={4}
            scrollEnabled={true}
            contentContainerStyle={localStyles.listContainer}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => playLiveVideo(item)}
                activeOpacity={0.8}
                style={localStyles.card}>
                <View style={localStyles.cardContent}>
                  {/* Thumbnail Section */}
                  <View style={localStyles.thumbnailContainer}>
                    <Image
                      source={ImagePlaceHolder}
                      style={localStyles.thumbnail}
                      resizeMode="cover"
                    />
                    {/* Live Badge */}
                    <View style={localStyles.liveBadge}>
                      <View style={localStyles.liveDot} />
                      <Text style={localStyles.liveText}>LIVE</Text>
                    </View>
                  </View>

                  {/* Content Section */}
                  <View style={localStyles.contentSection}>
                    <Text style={localStyles.title} numberOfLines={2}>
                      {item.title}
                    </Text>

                    {/* Date & Time */}
                    <View style={localStyles.infoRow}>
                      <FontAwesome name="calendar" size={12} color="#6b7280" />
                      <Text style={localStyles.infoText}>
                        {item.live_date || 'Schedule not available'}
                      </Text>
                    </View>

                    {/* Join Button */}
                    <TouchableOpacity
                      onPress={() => playLiveVideo(item)}
                      style={localStyles.joinButton}
                      activeOpacity={0.8}>
                      <FontAwesome name="play-circle" size={14} color="#fff" />
                      <Text style={localStyles.joinButtonText}>Join Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <BottomNavigation />
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  thumbnailContainer: {
    position: 'relative',
    marginRight: 12,
  },
  thumbnail: {
    width: 120,
    height: 100,
    borderRadius: 10,
  },
  liveBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(220, 38, 38, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  liveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  contentSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 12,
    color: '#6b7280',
  },
  joinButton: {
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
    shadowColor: '#dc2626',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default React.memo(LiveVideoList);
