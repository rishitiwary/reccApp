import React, {useRef, useState, useCallback, useEffect} from 'react';
import {StyleSheet, SafeAreaView, BackHandler} from 'react-native';
import {WebView} from 'react-native-webview';
import {DYNAMIC_URL} from '../../config/config';
import {useNavigation} from '@react-navigation/native';
import {Loader} from '../../components/Loader';
const DetailsRelated = ({route}) => {
  const navigation = useNavigation();
  console.log(route);
  const webView = useRef();
  const page = `${DYNAMIC_URL}${route.params.pageurl}?type=webview`;

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
    navigation.setOptions({title: route.params.title});

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => {
      backHandler.remove();
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
export default DetailsRelated;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
});
