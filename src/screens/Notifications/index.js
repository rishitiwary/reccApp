import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../components/AuthContext';
import api from '../../services/api';
import {institute_id, IMG_URL} from '../../config/config';
import COLORS from '../../config/colors';
import { BASE_URL } from '../../config/config';
const NotificationsScreen = () => {
  const navigation = useNavigation();
  const {userInfo} = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, video, document, course

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      
      if (!userInfo) return;
      
      const user = JSON.parse(userInfo);
      const email = user.data?.email;
  
      if (!email) return;

      const response = await api.get(`${BASE_URL}/content-notifications`, {
        params: {
          email: email,
          institute_id: institute_id,
          limit: 100
        }
      });
      console.log('response', response.data);

      if (response.data.success) {
        let filteredData = response.data.data || [];
        
        // Apply filter
        if (filter !== 'all') {
          filteredData = filteredData.filter(item => item.content_type === filter);
        }
        
        setNotifications(filteredData);
      }
    } catch (error) {
      console.log('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications(true);
  };

  const markAsRead = async (notificationId) => {
    try {
      const user = JSON.parse(userInfo);
      const email = user.data?.email;

      await api.put(`/content-notifications/${notificationId}/read`, {
        email: email,
        institute_id: institute_id
      });

      // Update local state
      setNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif.id === notificationId ? {...notif, is_read: 1} : notif
        )
      );
    } catch (error) {
      console.log('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const user = JSON.parse(userInfo);
      const email = user.data?.email;

      await api.put('/content-notifications/mark-all-read', {
        email: email,
        institute_id: institute_id
      });

      // Update local state
      setNotifications(prevNotifications =>
        prevNotifications.map(notif => ({...notif, is_read: 1}))
      );
    } catch (error) {
      console.log('Error marking all as read:', error);
    }
  };

  const handleNotificationPress = async (notification) => {
    // Mark as read
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    try {
      // Fetch full course details before navigating
      const user = JSON.parse(userInfo);
      const email = user.data?.email;
      
      const response = await api.get(`/popularcourse?email=${email}&institute_id=${institute_id}`);
      
      if (response.data && response.data.data) {
        // Find the course in the response
        const course = response.data.data.find(c => c.id === notification.course_id);
        
        if (course) {
          // Navigate with full course object
          navigation.navigate('Course Details', {
            item: course,
            paid: notification.content_type === 'course' ? 0 : 1
          });
          return;
        }
      }
      
      // Fallback: Try to navigate with available notification data
      navigation.navigate('Course Details', {
        item: {
          id: notification.course_id,
          name: notification.course_name || 'Course',
          course_thumbnail: notification.course_thumbnail || '',
          title: notification.course_name || 'Course',
          sectionIcon: notification.course_thumbnail || ''
        },
        paid: notification.content_type === 'course' ? 0 : 1
      });
      
    } catch (error) {
      console.log('Error fetching course details:', error);
      
      // Fallback navigation with available data
      navigation.navigate('Course Details', {
        item: {
          id: notification.course_id,
          name: notification.course_name || 'Course',
          course_thumbnail: notification.course_thumbnail || '',
          title: notification.course_name || 'Course',
          sectionIcon: notification.course_thumbnail || ''
        },
        paid: notification.content_type === 'course' ? 0 : 1
      });
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'video':
        return {name: 'play-circle', color: '#3b82f6'};
      case 'document':
        return {name: 'file-text', color: '#10b981'};
      case 'course':
        return {name: 'book', color: '#f59e0b'};
      default:
        return {name: 'bell', color: '#6b7280'};
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const renderNotification = ({item}) => {
    const icon = getIconForType(item.content_type);
    
    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          !item.is_read && styles.unreadCard
        ]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.notificationContent}>
          <View style={[styles.iconContainer, {backgroundColor: icon.color + '20'}]}>
            <FontAwesome name={icon.name} size={24} color={icon.color} />
          </View>
          
          <View style={styles.textContainer}>
            <View style={styles.headerRow}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              {!item.is_read && <View style={styles.unreadDot} />}
            </View>
            
            <Text style={styles.message} numberOfLines={2}>
              {item.message}
            </Text>
            
            <View style={styles.footer}>
              <Text style={styles.courseName} numberOfLines={1}>
                {item.course_name}
              </Text>
              <Text style={styles.time}>{formatDate(item.created_at)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterButton = (filterType, label) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === filterType && styles.activeFilterButton
      ]}
      onPress={() => setFilter(filterType)}
    >
      <Text
        style={[
          styles.filterText,
          filter === filterType && styles.activeFilterText
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
          <Text style={styles.markAllText}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('video', 'Videos')}
        {renderFilterButton('document', 'Documents')}
        {renderFilterButton('course', 'Courses')}
      </View>

      {/* Notifications List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="bell-slash" size={64} color="#d1d5db" />
          <Text style={styles.emptyText}>No notifications yet</Text>
          <Text style={styles.emptySubtext}>
            You'll see notifications here when new content is added to your courses
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1d6bde',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    marginLeft: 16,
  },
  markAllButton: {
    padding: 4,
  },
  markAllText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  activeFilterButton: {
    backgroundColor: '#1d6bde',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeFilterText: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#eff6ff',
    borderLeftWidth: 4,
    borderLeftColor: '#1d6bde',
  },
  notificationContent: {
    flexDirection: 'row',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    marginTop: 4,
  },
  message: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  courseName: {
    fontSize: 12,
    color: '#9ca3af',
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default NotificationsScreen;
