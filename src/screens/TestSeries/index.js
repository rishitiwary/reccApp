import React, {useRef, useState, useCallback, useEffect} from 'react';
import {StyleSheet, SafeAreaView, BackHandler, View} from 'react-native';
import {WebView} from 'react-native-webview';
import {AuthContext} from '../../components/AuthContext';
import {Loader} from '../../components/Loader';
import { MAIN_URL } from '../../config/config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TestSeries = ({route}) => {
  const insets = useSafeAreaInsets();
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
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => {
      backHandler.remove(); // ✅ Call remove() on the subscription
    };
  }, [handleBack]);
  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb', paddingBottom: insets.bottom }}>
      <Loader status={spinner} />
      <WebView
        onLoadStart={() => setSpinner(true)}
        onLoad={() => setSpinner(false)}
        source={{
          uri: url,
        }}
        onLoadProgress={event => setCanGoBack(event.nativeEvent.canGoBack)}
      />
    </View>
  );
};
export default TestSeries;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
});
