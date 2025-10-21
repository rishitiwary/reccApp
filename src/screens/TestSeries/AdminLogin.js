import React, {useRef, useState, useCallback, useEffect} from 'react';
import {BackHandler, SafeAreaView} from 'react-native';
import {WebView} from 'react-native-webview';
import {Loader} from '../../components/Loader';
import { MAIN_URL } from '../../config/config';
export default function AdminLogin() {
  const webView = useRef();
  const [loadingStatus, setLoadingStatus] = useState(true);
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
      <Loader status={loadingStatus} />
      <WebView
        ref={webView}
        onLoadStart={() => setLoadingStatus(true)}
        onLoad={() => setLoadingStatus(false)}
        source={{uri: `${MAIN_URL}admin/login`}}
        onLoadProgress={event => setCanGoBack(event.nativeEvent.canGoBack)}
      />
    </SafeAreaView>
  );
}
