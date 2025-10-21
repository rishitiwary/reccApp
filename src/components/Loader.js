import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
export const Loader = props => {
  const [isLoading, setLoading] = useState();
  useEffect(() => {
    setLoading(props.status);
  });

  return (
    <Spinner
      animation="fade"
      textStyle={styles.spinnerTextStyle}
      textContent="Loading..."
      visible={isLoading}
    />
  );
};

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF',
  },
});
