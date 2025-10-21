import React, {useRef, useState, useCallback, useEffect} from 'react';
import {StyleSheet, SafeAreaView, BackHandler} from 'react-native';
import {WebView} from 'react-native-webview';
import {MAIN_URL} from '../../config/config';
import {Loader} from '../../components/Loader';

const WebUrl = ({route}) => {
  const webView = useRef();
  const page = `${MAIN_URL}${route.name}?type=webview`;
 
  const [spinner, setSpinner] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const handleBack = useCallback(() => {
    if (canGoBack && webView.current) {
      webView.current.goBack();
      return true;
    }
    return false;
  }, [canGoBack]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBack);
    };
  }, [handleBack]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Loader status={spinner} />
      <WebView
        onLoadStart={() => setSpinner(true)}
        onLoad={() => setSpinner(false)}
        source={{
          uri: page,
        }}
        onLoadProgress={event => setCanGoBack(event.nativeEvent.canGoBack)}
      />
    </SafeAreaView>
  );
};
export default WebUrl;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
});
