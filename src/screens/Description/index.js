import axios from 'axios';
import { BASE_URL } from '../../config/config';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader } from '../../components/Loader';
import YoutubePlayer from 'react-native-youtube-iframe';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { DownloadYoutubeVideo } from '../../components/DownloadFiles';
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from '../../config/Metrics';

const Description = ({ route }) => {
  const { courseId, videoTitle, videoId, description } = route.params;

  console.log("description video", route.params);
  const insets = useSafeAreaInsets();
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [message, setMessage] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [fetchingVideo, setFetchingVideo] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0); // New state for playback speed
  const [showSpeedModal, setShowSpeedModal] = useState(false); // New state for speed modal
  const navigation = useNavigation();
  const controlRef = useRef();
  const { width } = useWindowDimensions();
  const regex = /(&nbsp|amp|quot|lt|gt|;|<([^>]+)>)/gi;

  // Speed options

  const onStateChange = useCallback((state) => {
    if (state === 'ended') {
      setPlaying(false);
      Alert.alert('Video has finished playing!');
    }
  }, []);

  const fullscreen = async (elapsed_sec) => {
    setPlaying(false);
    navigation.navigate('FullScreen', {
      video:videoId,
      elapsed_sec,
      videoUrl,
      playbackRate,
      videoTitle,
      courseId
    });
  };

  const stopLoader = () => setLoadingStatus(false);

  // const downloadVideos = async (videoUrl) => {

  //   if (videoUrl) {
  //     await DownloadYoutubeVideo(videoUrl, videoTitle, courseId);
  //   } else {
  //     Alert.alert('Error', 'Video URL not available for download');
  //   }
  // };

  // Handle speed selection
  const handleSpeedSelect = (speed) => {
    setPlaybackRate(speed);
    setShowSpeedModal(false);
  };

  // Fetch downloadable video URL
  // const fetchVideos = async () => {
  //   try {
  //     setLoadingStatus(true);
  //     const formData = new FormData();
  //     formData.append('videoId', video);
  //     console.log("form", formData);
  //     const result = await axios.post(
  //       `${BASE_URL}/downloadYoutubeVideos`,
  //       formData,
  //       {
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       }
  //     );

  //     if (result.data.success) {
  //       let urlPath = result.data.data;
  //       if (urlPath.startsWith('https://')) {
  //         setVideoUrl(urlPath); // set for download button
  //         await downloadVideos(urlPath);
  //         setLoadingStatus(false);
  //       } else {
  //         setLoadingStatus(false);
  //         setMessage('Invalid download link');
  //       }
  //     } else {
  //       setLoadingStatus(false);
  //       setMessage('Failed to generate download link');
  //     }
  //   } catch (error) {
  //     setLoadingStatus(false);
  //     setMessage('Error generating download link');
  //   }
  // };

  // Play video directly from YouTube
  const playYouTubeVideo = () => {
    setPlaying(true);
  };

  useEffect(() => {
    setTimeout(() => setLoadingStatus(false), 2000);
    navigation.setOptions({ title: videoTitle });
  }, []);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={{ flex: 1 }}>
        <Loader status={loadingStatus} />
        <View style={styles.row}>
          {/* YouTube Player - Direct from YouTube */}
          <YoutubePlayer
            ref={controlRef}
            height={moderateScale(230)}
            width={width}
            play={playing}
            videoId={videoId}
            onChangeState={onStateChange}
            onReady={stopLoader}
            initialPlayerParams={{
              modestbranding: true,
              preventFullScreen: true,
              start: 0,
            }}
          />
          <TouchableOpacity style={styles.hideShare} />
          {/* <TouchableOpacity style={styles.hideYoutubeLogoRight} /> */}
          <TouchableOpacity style={styles.hideYoutubeLogoLeft} />

        </View>

        <View style={styles.functionButtons}>

          <TouchableOpacity
            onPress={async () => {
              const elapsed_sec = await controlRef.current?.getCurrentTime();
              fullscreen(elapsed_sec);
            }}
            style={styles.functionButtonSpace}>
            <MaterialIcons name="fullscreen" color="black" size={25} />
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.functionButtonSpace}
            onPress={() => fetchVideos()}
          >
            <MaterialIcons
              name="file-download"
              size={25}
              color={"black"}
            />
          </TouchableOpacity> */}
        </View>

        <ScrollView style={styles.descriptionContainer}>
          {fetchingVideo && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading video data...</Text>
            </View>
          )}

          {message && (
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          )}

          {videoData && (
            <View style={styles.videoInfoContainer}>
              <Text style={styles.videoTitle}>{videoData.title}</Text>
              <Text style={styles.videoStats}>
                Views: {videoData?.viewCount} | Duration: {videoData?.duration}
              </Text>
            </View>
          )}

          <Text style={styles.descriptionText}>
            {description?.replace(regex, '')}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

export default React.memo(Description);