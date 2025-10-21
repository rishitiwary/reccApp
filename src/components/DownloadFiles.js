// Import React native Components
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBlobUtil from 'react-native-blob-util';
import {Platform, PermissionsAndroid, ToastAndroid, Alert} from 'react-native';
import uuid from 'react-native-uuid';
import {IMG_URL} from '../config/config';

const showToast = () => {
  ToastAndroid.show(
    'Your pdf is start to download go to notification !',
    ToastAndroid.SHORT,
  );
};

const getFileExtention = fileUrl => {
  return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : ['pdf'];
};

// === Download Files (PDF or Docs) ===
export const DownloadFiles = async pdfs => {
  showToast();
  let pdfTitle = pdfs;
  let fileUrl = IMG_URL + pdfs;

  if (Platform.OS === 'ios') {
    downloadFile(fileUrl, pdfTitle);
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'App needs access to your storage to download the file',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED || Number(Platform.Version) >= 33) {
        downloadFile(fileUrl, pdfTitle);
      } else {
        Alert.alert('Error', 'Storage Permission Not Granted');
      }
    } catch (err) {
      console.log('++++' + err);
    }
  }
};

const downloadFile = async (fileUrl, pdfTitle) => {
  try {
    const ext = getFileExtention(fileUrl);
    const fileExt = '.' + ext[0];
    const timestamp = new Date().getTime();
    const fileName = `recc_${pdfTitle}_${timestamp}${fileExt}`;
    const path = `${RNBlobUtil.fs.dirs.DownloadDir}/${fileName}`;

    const configOptions = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: path,
        description: 'Downloading file...',
        title: fileName,
      },
    };

    RNBlobUtil.config(configOptions)
      .fetch('GET', fileUrl)
      .then(res => {
        ToastAndroid.show('File Downloaded Successfully.', ToastAndroid.SHORT);
        if (Platform.OS === 'android') {
          RNBlobUtil.android.actionViewIntent(res.path(), 'application/pdf');
        }
      })
      .catch(err => {
        console.log('Download error:', err);
        Alert.alert('Error', 'Download failed: ' + err.message);
      });
  } catch (error) {
    console.log('Download error:', error);
    Alert.alert('Error', 'Download failed: ' + error.message);
  }
};

// === Save Video to AsyncStorage ===
const saveVideo = async (vTitle, videoPath, courseId) => {
  try {
    let videos = await AsyncStorage.getItem('videoList');
    let data_array = [];

    let video_object = {
      title: vTitle,
      path: videoPath,
      courseId: courseId,
    };
    data_array.push(video_object);

    let allData = videos ? [...JSON.parse(videos), ...data_array] : data_array;
    await AsyncStorage.setItem('videoList', JSON.stringify(allData));
  } catch (e) {
    console.log('AsyncStorage error', e);
  }
};

// === Download YouTube Videos ===
export const DownloadYoutubeVideo = async (video, videoTitle, courseId) => {
  ToastAndroid.show(
    'Your video is start to download go to notification !',
    ToastAndroid.SHORT,
  );

  let fileUrl = video;

  if (Platform.OS === 'ios') {
    downloadVideoFile(fileUrl, videoTitle, courseId);
  } else {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'App needs access to your storage to download the video',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED || Number(Platform.Version) >= 33) {
        downloadVideoFile(fileUrl, videoTitle, courseId);
      } else {
        Alert.alert('Error', 'Storage Permission Not Granted');
      }
    } catch (err) {
      console.log('++++' + err);
    }
  }
};

const downloadVideoFile = async (fileUrl, vTitle, courseId) => {
  try {
    let randomUrl = uuid.v4();
    const fileName = `${randomUrl}.mp4`;
    const path =
      Platform.OS === 'ios'
        ? `${RNBlobUtil.fs.dirs.DocumentDir}/${fileName}`
        : `${RNBlobUtil.fs.dirs.DownloadDir}/${fileName}`;

    // Save to AsyncStorage
    await saveVideo(vTitle, path, courseId);

    const configOptions = {
      fileCache: true,
      path: path,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: path,
        description: 'Downloading video...',
        title: vTitle,
        mime: 'video/mp4',
      },
    };

    RNBlobUtil.config(configOptions)
      .fetch('GET', fileUrl)
      .progress({ count: 10 }, (received, total) => {
        const progress = (received / total) * 100;
        console.log('Video download progress:', progress.toFixed(2) + '%');
      })
      .then(res => {
        ToastAndroid.show('File Downloaded Successfully. Please check your files.', ToastAndroid.SHORT);
        if (Platform.OS === 'android') {
          RNBlobUtil.android.actionViewIntent(res.path(), 'video/mp4');
        }
      })
      .catch(error => {
        console.log('Video download error:', error);
        Alert.alert('Error', 'Video download failed: ' + error.message);
      });
  } catch (error) {
    console.log('Download setup error:', error);
    Alert.alert('Error', 'Video download failed: ' + error.message);
  }
};
