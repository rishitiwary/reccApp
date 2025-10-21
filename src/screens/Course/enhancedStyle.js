import {StyleSheet, Dimensions, Platform} from 'react-native';
import COLORS from '../../config/colors';
import {moderateScale} from '../../config/Metrics';

const {width, height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },

  // Tab Navigation
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: moderateScale(15),
    paddingTop: moderateScale(15),
    paddingBottom: moderateScale(10),
    backgroundColor: '#fff',
    gap: moderateScale(10),
  },
  tabButton: {
    flex: 1,
  },
  tabButtonInner: {
    height: moderateScale(44),
    backgroundColor: '#F0F0F0',
    borderRadius: moderateScale(22),
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  activeTabButton: {
    backgroundColor: COLORS.primary || '#007AFF',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary || '#007AFF',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  tabText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '700',
  },

  // Title Section
  titleSection: {
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(20),
    paddingBottom: moderateScale(15),
    backgroundColor: '#fff',
  },
  courseTitle: {
    fontSize: moderateScale(24),
    fontWeight: '800',
    color: '#1A1A1A',
    lineHeight: moderateScale(32),
  },

  // Hero Image
  heroImageContainer: {
    marginHorizontal: moderateScale(15),
    marginVertical: moderateScale(15),
    borderRadius: moderateScale(20),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  heroImage: {
    width: '100%',
    height: moderateScale(220),
    backgroundColor: '#E0E0E0',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: moderateScale(80),
    backgroundColor: 'transparent',
  },

  // Section Card
  sectionCard: {
    backgroundColor: '#fff',
    marginHorizontal: moderateScale(15),
    marginBottom: moderateScale(15),
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(15),
  },
  sectionIconContainer: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(10),
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
  },
  sectionIcon: {
    fontSize: moderateScale(18),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#1A1A1A',
  },
  descriptionText: {
    fontSize: moderateScale(15),
    lineHeight: moderateScale(24),
    color: '#4A4A4A',
  },

  // Preview Video
  previewContainer: {
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  previewImage: {
    width: '100%',
    height: moderateScale(200),
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: moderateScale(70),
    height: moderateScale(70),
    borderRadius: moderateScale(35),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  playButtonText: {
    fontSize: moderateScale(24),
    color: COLORS.primary || '#007AFF',
    marginLeft: moderateScale(4),
  },
  playButtonLabel: {
    marginTop: moderateScale(12),
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#fff',
  },

  // Related Videos
  relatedSection: {
    marginTop: moderateScale(5),
    marginBottom: moderateScale(10),
  },
  videoList: {
    paddingLeft: moderateScale(15),
    paddingRight: moderateScale(15),
    paddingTop: moderateScale(10),
  },
  videoCard: {
    width: moderateScale(290),
    marginRight: moderateScale(15),
    backgroundColor: '#fff',
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  thumbnailContainer: {
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: moderateScale(160),
    backgroundColor: '#E0E0E0',
  },
  playIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  playIcon: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconText: {
    fontSize: moderateScale(18),
    color: COLORS.primary || '#007AFF',
    marginLeft: moderateScale(3),
  },
  videoInfo: {
    padding: moderateScale(15),
  },
  videoTitle: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: moderateScale(8),
    lineHeight: moderateScale(20),
  },
  videoDescription: {
    fontSize: moderateScale(13),
    color: '#666',
    lineHeight: moderateScale(18),
  },
});

export default styles;