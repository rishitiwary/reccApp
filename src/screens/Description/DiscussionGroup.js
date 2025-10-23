import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Loader} from '../../components/Loader';
import {View, BackHandler, SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../components/AuthContext';
import {WebView} from 'react-native-webview';
import {DIS_GRP_URL} from '../../config/config';
import styles from './style';

const DiscussionGroup = ({route}) => {
  const {userInfo} = React.useContext(AuthContext);
  const navigation = useNavigation();
  const courseId = route.params.courseId;
  const courseTitle = route.params.courseTitle;
  const user_id = JSON.parse(userInfo).data.id;
  const [loadingStatus, setLoadingStatus] = useState(true);
  const webView = useRef();
  const page = `${DIS_GRP_URL}${user_id}/${courseId}`;
 
  //end forword and backword 10 seconds
  useEffect(() => {
    setLoadingStatus(true);
    setTimeout(() => {
      setLoadingStatus(false);
    }, 4000);
    navigation.setOptions({title: courseTitle + '(GD)'});
  }, []);

  const [canGoBack, setCanGoBack] = useState(false);
  const handleBack = useCallback(() => {
    if (canGoBack && webView.current) {
      webView.current.goBack();
      return true;
    }
    return false;
  }, [canGoBack]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => {
      backHandler.remove();
    };
  }, [handleBack]);
  return (
    <SafeAreaView style={{flex: 1}}>
      <Loader status={loadingStatus} />
      <View style={styles.chatScreen}>
        <WebView
          onLoadStart={() => setLoadingStatus(true)}
          onLoad={() => setLoadingStatus(false)}
          source={{
            uri: page,
          }}
          onLoadProgress={event => setCanGoBack(event.nativeEvent.canGoBack)}
        />
      </View>
    </SafeAreaView>
  );
};

export default DiscussionGroup;
