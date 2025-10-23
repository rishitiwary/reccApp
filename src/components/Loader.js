import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import COLORS from '../config/colors';

export const Loader = props => {
  const [isLoading, setLoading] = useState();
  useEffect(() => {
    setLoading(props.status);
  });

  return (
    <Spinner
      animation="fade"
      color={COLORS.primary}
      textStyle={styles.spinnerTextStyle}
      textContent="Loading..."
      visible={isLoading}
    />
  );
};

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
