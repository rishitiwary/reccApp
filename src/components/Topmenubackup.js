import React from 'react';
import styles from '../config/style';
import {ScrollView,View,Text,TouchableOpacity,StyleSheet} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();

export  const Topmenu=()=>{
    return(
<ScrollView
        style={styles.scrollview}
        horizontal={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}      
      >
        <TouchableOpacity>
        <View style={styles.view}>
          <Text style={styles.text1}>Home</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity>
        <View style={styles.view}>
          <Text style={styles.text1}>All Course</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity>
        <View style={styles.view}>
          <Text style={styles.text1}>Free Videos</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity>
        <View style={styles.view}>
          <Text style={styles.text1}>Test Series</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity> 
        <View style={styles.view}>
          <Text style={styles.text1}>Books</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity>

 
        <View style={styles.view}>
          <Text style={styles.text1}>Jobs & Vancacies</Text>
        </View>
        </TouchableOpacity>
      </ScrollView>
    )

}
 