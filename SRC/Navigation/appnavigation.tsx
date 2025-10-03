import React, {useEffect,useRef} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from '../Views/Login'
import SignupPage from '../Views/Signup'
import SplashPage from '../Views/Splash'
import ActionBar from '../Common/component/ActionBar'
import ForgotPasswordPage from '../Views/ForgotPassword';
import ChooseProfile from '../Views/ChooseProfile/ChooseProfile';
import AddCompanyDetails from '../Views/Recruiter/AddCompanyDetails';
import VerifyOtp from '../Views/Otp/VerifyOtp';
import CreatePassword from '../Views/CreatePassword';
import Dashboard from '../Views/Dashboard';
import Availability from '../Views/candidate/Availability';
import SearchInformation from '../Views/candidate/SearchInformation';
import Skills from '../Views/candidate/Skills';
import Experiences from '../Views/candidate/Experiences';
import ExperienceList from '../Views/candidate/Experiences/ExperienceList';
import DegreeList from '../Views/candidate/Experiences/DegreeList';
import DegreeForm from '../Views/candidate/Experiences/DegreeForm';
import VideoCheckList from '../Views/Video/VideoCheckList';
import RecordVideo from '../Views/Video/RecordVideo';
import PlaybackScreen from '../Views/Video/PlaybackScreen';
// import Profile from '../Views/Profile';
import CreateJobOffer from '../Views/Recruiter/CreateJobOffer';
// import messaging from '@react-native-firebase/messaging';
import BottomTabNavigator from '../Views/bottomTabNavigator';
// import Messages from '../Views/Messages';
import ChatScreen from '../Views/Chats/ChatScreen'
import ChatListScreen from '../Views/Chats/ChatListScreen';
import Home from '../Views/Home/index';
import Viewprofile from '../Views/ViewProfile';
const Stack = createNativeStackNavigator();
import { Linking } from 'react-native';

const MyStack = ({navigation}) => {
const linking = {
  prefixes: ['https://smarttalent.augmentedresourcing.com'],
  config: {
    screens: {
      bottomTabNavigator: {
        path: 'user/:id', // Matches /user/1234
        screens: {
          Home: '', // This matches the Home tab
        },
      },
    },
  },
};

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Splash'>
        <Stack.Screen name="Splash" component={SplashPage} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Signup" component={SignupPage} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
        <Stack.Screen name="ChooseProfile" component={ChooseProfile} />
        <Stack.Screen name="Home2" component={Home} />
        <Stack.Screen name="AddCompanyDetails" component={AddCompanyDetails} />
        <Stack.Screen name="CreateJobOffer" component={CreateJobOffer} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="ChatList" component={ChatListScreen} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
        <Stack.Screen name="CreatePassword" component={CreatePassword} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Availability" component={Availability} />
        <Stack.Screen name="SearchInformation" component={SearchInformation} />
        <Stack.Screen name="Skills" component={Skills} />
        <Stack.Screen name="Experiences" component={Experiences} />
        <Stack.Screen name="ExperienceList" component={ExperienceList} />
        <Stack.Screen name="DegreeList" component={DegreeList} />
        <Stack.Screen name="DegreeForm" component={DegreeForm} />
        <Stack.Screen name="VideoCheckList" component={VideoCheckList} />
        <Stack.Screen name="RecordVideo" component={RecordVideo} />
        <Stack.Screen name="PlaybackScreen" component={PlaybackScreen} />

        {/* <Stack.Screen name="Messages" component={Messages} />
        <Stack.Screen name="Profile" component={Profile} /> */}
        <Stack.Screen name="Viewprofile" component={Viewprofile} />

        <Stack.Screen name="bottomTabNavigator" component={BottomTabNavigator} />


      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;