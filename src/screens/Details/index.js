import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
const DetailsScreen = () => {
  const route = useRoute();

  const {name, email, password} = route.params;

  return (
    <View style={styles.container}>
      <View style={{marginBottom: 10}}>
        <Text>Name : {name}</Text>
        <Text>Email : {email}</Text>
        <Text>Password : {password}</Text>
      </View>

      <Button
        title="Go to Home  screen"
        onPress={() => useNavigation.navigate('Home')}
      />
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
