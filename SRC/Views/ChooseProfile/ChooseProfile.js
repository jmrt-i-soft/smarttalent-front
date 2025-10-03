import React, { useState,useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image ,Platform,PermissionsAndroid} from 'react-native';
import styles from './styles'
import { navigate } from '../../Common/navigate';
import GradientBackground from '../../Common/component/GradientBackground';
import { images } from '../../../assets/images';
import { useUser } from '../../Common/Utils/UserProvider';
import GradientText from '../../Common/component/GradientText';
import { colors } from '../../Constants/colors';
import { getdata, savedata,deletekeydata } from '../../Common/localdata';
import { ASYNC_STORAGES } from '../../Common/Storage';
import LANGUAGE_DATA from '../../Constants/language';

const ChooseProfile = ({ navigation }) => {
  const { setUserRole } = useUser();
  // const gradientColors = [colors.skyBlue, colors.blue, colors.pink];
  const gradientColors = [colors.skyBlue, colors.pink, colors.red] || ['#4c669f', '#192f6a'];
  // const gradientColors = ['blue', 'green', 'red'];


  useEffect(() => {
    console.log('requestNotificationPermission 1');
    requestNotificationPermission();
  
  
  }, []);
  const requestNotificationPermission = async () => {
    console.log('requestNotificationPermission 2');
    if(Platform.OS ==="android"){
      console.log('requestNotificationPermission 3');
      try {

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        console.log('You can use the grantedgrantedgranted : ',granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
        } else {
          console.log('Camera permission denied');
        }
        // PermissionsAndroid.check('android.permission.POST_NOTIFICATIONS').then(
        //   response => {
        //     console.log('requestNotificationPermission 4 ',response);
        //     if(response==false){
        //       PermissionsAndroid.request('android.permission.POST_NOTIFICATIONS',{
        //           title: 'Notification',
        //           message:
        //             'App needs access to your notification ' +
        //             'so you can get Updates',
        //           buttonNeutral: 'Ask Me Later',
        //           buttonNegative: 'Cancel',
        //           buttonPositive: 'OK',
        //       })
        //     }
        //   }
        // ).catch(
        //   (err) => {
        //     console.log("Notification Error=====>",err);
        //   }
        // )
      } catch (err){
        console.log(err);
      }
    }
  };

  const navigateToLogin = async (role) => {
    // console.log('dfggvdgfdgfd',role);
    
    var data = await deletekeydata(ASYNC_STORAGES.role)
    if(data)
    await savedata(ASYNC_STORAGES.role,role)
    setUserRole(role); // Set the user role
    navigation.navigate('Login');
  };

  return (
    <>
      <GradientBackground>
        <View style={styles.container}>
          <GradientText gradientType={'purpleGradient'} style={styles.title}>{LANGUAGE_DATA.CHOOSE_PROFILE.title}</GradientText>
          <Image style={styles.logo} source={images.logo} />
          <Text style={styles.appName}>{LANGUAGE_DATA.CHOOSE_PROFILE.heading}</Text>

          <TouchableOpacity style={styles.BtnStyle}
            onPress={() => navigateToLogin('recruiter')}
            activeOpacity={0.8}>
            <View style={styles.iconContainer}>
              <Image
                source={images.ic_recruit}
                style={styles.icon}
              />
            </View>
            <Text style={styles.text}>{LANGUAGE_DATA.CHOOSE_PROFILE.button1}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.BtnStyle, { backgroundColor: '#2C5DDA' }]}
            onPress={() => navigateToLogin('applicant')}
            activeOpacity={0.8}>
            <View style={styles.iconContainer}>
              <Image
                source={images.ic_apply}
                style={styles.icon}
              />
            </View>
            <Text style={styles.text}>{LANGUAGE_DATA.CHOOSE_PROFILE.button2}</Text>
          </TouchableOpacity>
        </View>
      </GradientBackground>
    </>
  );
};

export default ChooseProfile;