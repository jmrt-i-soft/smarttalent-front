import Api from '../../Common/Apicall'
import { View, Text, TouchableOpacity, Image, Alert, ToastAndroid, BackHandler } from 'react-native';
import styles from '../../Common/CommonStyle/styles'
import { navigate, navigateReset } from '../../Common/navigate';
import React, { useEffect, useState } from 'react';
import GradientBackground from '../../Common/component/GradientBackground';
import { useUser } from '../../Common/Utils/UserProvider';
import { getdata } from '../../Common/localdata';
import { ASYNC_STORAGES } from '../../Common/Storage';
import API_ENDPOINTS from '../../Constants/apiEndpoints';
import { useLoader } from '../../Common/component/LoaderContext';
import CONST_UTILS from '../../Constants/ConstUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { images } from '../../../assets/images';

const Dashboard = ({ navigation, route }) => {
  // const { userRole } = useUser();
  const [backPressCount, setBackPressCount] = useState(0);
  // const { email, name } = route.params;
  const { showLoader, hideLoader } = useLoader();
  const [email, setEmail] = useState('');
  const [userRole, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profileData, setProfileData] = useState(null); // State to store the profile data


  useEffect(() => {
    const handleBackPress = () => {
      if (backPressCount === 0) {
        setBackPressCount(1);
        ToastAndroid.show("Press again to exit the app", ToastAndroid.SHORT);

        // Reset backPressCount after 2 seconds
        setTimeout(() => {
          setBackPressCount(0);
        }, 2000);

        return true; // Prevent default back button behavior
      } else {
        BackHandler.exitApp(); // Exit the app
        return false; // Allow default behavior
      }
    };

    // Add back press event listener
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      // Clean up the event listener
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [backPressCount]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Logout cancelled'),
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            await AsyncStorage.clear(); // Clear AsyncStorage
            navigateReset(navigation, "ChooseProfile"); // Navigate to ChooseProfile
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getProfileStatus = async (emailData) => {
    showLoader();
    var param = {
      "email": emailData,
    }

    Api.post(API_ENDPOINTS.CANDIDATE_GET_PROFILE, param, {}).then((res) => {
      hideLoader();
     // console.log(res.data)

      // Ensure res.data.result exists and is an array
      if (Array.isArray(res.data.result) && res.data.result.length > 0) {
        // Access the first element safely
        setProfileData(res.data.result[0]);
        navigateUser(res.data.result[0].stage);
      } else {
        // If the result array is empty or undefined
        navigation.navigate("Availability");
      }
    }).catch((err) => {
      hideLoader();
      // console.log(err.data)
      Alert.alert(err.data.message)
    })
  }

  const navigateUser = (status) => {
    if (status) {
      switch (status) {
        case CONST_UTILS.SCREEN_AVAILABILITY:
          navigation.navigate("SearchInformation");
          break;
        case CONST_UTILS.SCREEN_SEARCH:
          navigation.navigate("Skills");
          break;
        case CONST_UTILS.SCREEN_SKILL:
          navigation.navigate("ExperienceList");
          break;
        case CONST_UTILS.SCREEN_EXPERIENCE:
          navigation.navigate("DegreeList");
          break;
        case CONST_UTILS.SCREEN_DEGREE:
          // navigation.navigate("VideoCheckList");
          break;
        default:
          navigation.navigate("VideoCheckList");
          break;
      }
    }
  };

  // Fetch email and role from AsyncStorage and call getProfileStatus when component loads
  useEffect(() => {
    const fetchEmailAndStatus = async () => {
      try {
        const emailData = await getdata(ASYNC_STORAGES.email);
        const roleData = await getdata(ASYNC_STORAGES.role);
        setEmail(emailData);
        setRole(roleData);

        if (roleData == 'applicant') {
          await getProfileStatus(emailData);
        } else {
         // console.log("-----------");
        }
      } catch (error) {
        console.error("Error fetching email or profile status:", error);
      }
    };

    fetchEmailAndStatus(); // Call the function
  }, []); // Empty dependency array ensures it runs only once

  const openProfile = () => {
    // navigation.navigate('Profile');
    if (profileData) {
    //  console.log("Navigating with profileData:", profileData);
      navigation.navigate('Profile', { profileData }); // Pass the profile data to the Profile screen
    } else {
      Alert.alert("Profile data is not available. Please try again.");
    }
  };

  return (
    <>
      <GradientBackground>
        <View style={styles.container}>
          <Text style={styles.title}>Hi,</Text>

          {/* <Text style={styles.subtitle}>{userRole === 'recruiter' ? 'Recruiter' : 'Applicant'} : {name}</Text> */}
          <Text style={styles.subtitle}>{userRole === 'recruiter' ? 'Recruiter' : 'Applicant'}</Text>
          <Text style={styles.subtitle}>Email Id : {email}</Text>
        </View>

        <TouchableOpacity style={styles.profileIcon} onPress={openProfile}>
          <Image style={styles.logo} source={images.ic_profile} />
          <Text style={styles.logoutText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </GradientBackground>
    </>
  );
};

export default Dashboard;