import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform, PermissionsAndroid, ToastAndroid, Alert} from 'react-native';
import uuid from 'react-native-uuid';
// Import RNFetchBlob for the file download
import RNFetchBlob from 'rn-fetch-blob';
import {IMG_URL} from '../config/config';
const showToast = () => {
  ToastAndroid.show(
    'Your pdf is start to download go to notification !',
    ToastAndroid.SHORT,
  );
};
//store downloaded file in asyncstorage
const saveVideo = async (vTitle, videoPath, courseId) => {
  let videos = await AsyncStorage.getItem('videoList');
  let data_array = [];

  let video_object = {};
  video_object.title = vTitle;
  video_object.path = videoPath;
  video_object.courseId = courseId;
  data_array.push(video_object);
  let allData = '';
  if (JSON.parse(videos) != null) {
    allData = [...JSON.parse(videos), ...data_array];
  } else {
    allData = data_array;
  }

  try {
    await AsyncStorage.setItem('videoList', JSON.stringify(allData));
  } catch (e) {
    console.log('error', e);
  }
};
//end function
//download video from url
export const DownloadYoutubeVideo = async (video, videoTitle, courseId) => {
  ToastAndroid.show(
    'Your video is start to download go to notification !',
    ToastAndroid.SHORT,
  );

  let fileUrl = video;
  // Function to check the platform
  // If Platform is Android then check for permissions.

  if (Platform.OS === 'ios') {
    downloadVideoFile(fileUrl, videoTitle, courseId);
  } else {
    try {
      if (Number(Platform.Version) >= 33) {
        downloadVideoFile(fileUrl, videoTitle, courseId);
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadVideoFile(fileUrl, videoTitle, courseId);
          console.log('Storage Permission Granted.');
        } else {
          // If permission denied then show alert
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      }
    } catch (err) {
      // To handle permission related exception
      console.log('++++' + err);
    }
  }
};

const downloadVideoFile = (fileUrl, vTitle, courseId) => {
  // File URL which we want to download
  let randomUrl = uuid.v4();
  let FILE_URL = fileUrl;
  console.log(FILE_URL);
  // fs: Root directory path to download
  const {config, fs} = RNFetchBlob;
  let RootDir = fs.dirs.SDCardApplicationDir;

  let videoPath = RootDir + '/' + randomUrl;
  console.log('videoPath', videoPath);
  saveVideo(vTitle, videoPath, courseId);
  let options = {
    fileCache: true,
    addAndroidDownloads: {
      path: videoPath,
      description: 'downloading file...',
      notification: true,
      // useDownloadManager works with Android only
      useDownloadManager: true,
    },
  };
  config(options)
    .fetch('GET', FILE_URL)
    .then(res => {
      // Alert after successful downloading
      console.log('res -> ', JSON.stringify(res));
      ToastAndroid.show('File Downloaded Successfully.', ToastAndroid.SHORT);
    })
    .catch((errorMessage, statusCode) => {
      console.log('error', errorMessage);
    });
};

//download pdf
export const DownloadFiles = async pdfs => {
  showToast();
  let pdfTitle = pdfs;
  let fileUrl = IMG_URL + pdfs;
  if (Platform.OS === 'ios') {
    downloadFile(fileUrl, pdfTitle);
  } else {
    try {
      if (Number(Platform.Version) >= 33) {
        downloadFile(fileUrl, pdfTitle);
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          },
        );
        if (Number(Platform.Version) >= 33) {
          downloadFile(fileUrl, pdfTitle);
        } else {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            // Start downloading
            downloadFile(fileUrl, pdfTitle);
            console.log('Storage Permission Granted.');
          } else {
            // If permission denied then show alert
            Alert.alert('Error', 'Storage Permission Not Granted');
          }
        }
      }
    } catch (err) {
      // To handle permission related exception
      console.log('++++' + err);
    }
  }
};

const downloadFile = (fileUrl, pdfTitle) => {
  // Get today's date to add the time suffix in filename
  let date = new Date();
  // File URL which we want to download
  let FILE_URL = fileUrl;
  // Function to get extention of the file url
  let file_ext = getFileExtention(FILE_URL);

  file_ext = '.' + file_ext[0];

  // config: To get response by passing the downloading related options
  // fs: Root directory path to download
  const {config, fs} = RNFetchBlob;
  let RootDir = fs.dirs.PictureDir;
  let options = {
    fileCache: true,
    addAndroidDownloads: {
      path: RootDir + '/recc Academy' + pdfTitle,
      description: 'downloading file...',
      notification: true,
      // useDownloadManager works with Android only
      useDownloadManager: true,
    },
  };
  config(options)
    .fetch('GET', FILE_URL)
    .then(res => {
      // Alert after successful downloading
      console.log('res -> ', JSON.stringify(res));
      ToastAndroid.show('File Downloaded Successfully.', ToastAndroid.SHORT);
    });
};

const getFileExtention = fileUrl => {
  // To get the file extension
  return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
};
