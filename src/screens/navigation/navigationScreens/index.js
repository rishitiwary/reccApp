import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthContext} from '../../../components/AuthContext';
import Course from '../../Course';
import HomeScreen from '../../Home';
import Category from '../../Category';
import COLORS from '../../../config/colors';
import Description from '../../Description';
import Live from '../../Description/Live';
import Fullscreen from '../../Description/fullscreen';
import Subject from '../../Subject';
import SubjectCategory from '../../SubjectCategory';
import SubjectSubCategory from '../../SubjectSubCategory';
import Videobysubject from '../../Videobysubject';
import MyPurchase from '../../MyPurchase';
import ViewPdf from '../../ViewPdf';
import TestSeries from '../../TestSeries';
import Books from '../../Books';
import Jobs from '../../Jobs';
import Chat from '../../Chat';
import Teachers from '../../Chat/Teachers';
import CourseDetails from '../../Course/details';
import Contents from '../../Course/contents';
import AdmissionPayment from '../../AdmissionPayment';
import Pages from '../../Pages';
import DetailsRelated from '../../Pages/DetailsRelated';
import Downloads from '../../Description/Downloads';
import VideoPlayer from '../../../components/VideoPlayer';
import LiveVideoList from '../../Description/LiveVideoList';
import DiscussionGroup from '../../Description/DiscussionGroup';
const Stack = createNativeStackNavigator();
const NavigationScreens = () => {
  const {userInfo} = React.useContext(AuthContext);
  const payStatus = JSON.parse(userInfo).data.pay_status;
  const loginType = JSON.parse(userInfo).data.type;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.bgColor,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <>
        {loginType === 0 && payStatus === 0 && (
          <Stack.Screen
            name="AdmissionPayment"
            component={AdmissionPayment}
            options={{headerShown: true}}
          />
        )}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: true}}
        />

        <Stack.Screen name="Category" component={Category} />
        <Stack.Screen name="Course" component={Course} />
        <Stack.Screen
          name="My Purchased"
          component={MyPurchase}
          options={{headerShown: true}}
        />
        <Stack.Screen name="Description" component={Description} />
        <Stack.Screen name="Subject" component={Subject} />
        <Stack.Screen name="SubjectCategory" component={SubjectCategory} />
        <Stack.Screen
          name="SubjectSubCategory"
          component={SubjectSubCategory}
        />
        <Stack.Screen name="Videobysubject" component={Videobysubject} />
        <Stack.Screen
          name="FullScreen"
          component={Fullscreen}
          options={{headerShown: false, orientation: 'landscape'}}
        />
        <Stack.Screen
          name="ViewPdf"
          component={ViewPdf}
          options={{headerShown: false}}
        />
        <Stack.Screen name="FreeVideos" component={Videobysubject} />
        <Stack.Screen name="Test Series" component={TestSeries} />
        <Stack.Screen name="Books" component={Books} />
        <Stack.Screen name="Jobs" component={Jobs} />
        <Stack.Screen name="Live" component={Live} />
        <Stack.Screen name="Teachers List" component={Teachers} 
           options={{headerShown: true}}
        />
        <Stack.Screen name="LiveVideoList" component={LiveVideoList} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Course Details" component={CourseDetails} />
        <Stack.Screen name="Contents" component={Contents} />
        <Stack.Screen name="Pages" component={Pages} />
        <Stack.Screen name="DetailsRelated" component={DetailsRelated} />
        <Stack.Screen name="Downloads" component={Downloads} />
        <Stack.Screen name='Discussion Group' component={DiscussionGroup}/>
        
        <Stack.Screen
          name="VideoPlayer"
          options={{headerShown: false}}
          component={VideoPlayer}
        />
      </>
    </Stack.Navigator>
  );
};
export default NavigationScreens;
