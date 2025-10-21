import React, {useRef, useState, useCallback, useEffect} from 'react';
import {StyleSheet, SafeAreaView, BackHandler} from 'react-native';
import {WebView} from 'react-native-webview';
import {AuthContext} from '../../components/AuthContext';
import {Loader} from '../../components/Loader';
import { MAIN_URL } from '../../config/config';
const TestSeries = ({route}) => {
  const webView = useRef();
  const {userInfo} = React.useContext(AuthContext);
  let id = JSON.parse(userInfo).data.id;
  const url = `${MAIN_URL}onlineexam/webview/${route.params.item.exam_id}/${id}?type=webview`;
 
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
          uri: url,
        }}
        onLoadProgress={event => setCanGoBack(event.nativeEvent.canGoBack)}
      />
    </SafeAreaView>
  );
};
export default TestSeries;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
});
