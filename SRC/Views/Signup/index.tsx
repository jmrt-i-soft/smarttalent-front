import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import GradientBackground from '../../Common/component/GradientBackground';
import styles from './styles'
import GradientButton from '../../Common/component/GradientButton';
import SocialLogin from '../../Common/component/SocialLogin';
import ActionBar from '../../Common/component/ActionBar';
import { navigate, navigateReset,navigateResetParam } from '../../Common/navigate';
import Api from '../../Common/Apicall'
import { useUser } from '../../Common/Utils/UserProvider';
import { useLoader } from '../../Common/component/LoaderContext';
import Hyperlink from '../../Common/component/Hyperlink';
import GradientText from '../../Common/component/GradientText';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import LANGUAGE_DATA from '../../Constants/language';
import { savedata } from '../../Common/localdata';
import { ASYNC_STORAGES } from '../../Common/Storage';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import API_ENDPOINTS from '../../Constants/apiEndpoints';
const SignupPage = ({ navigation }) => {
  const { userRole } = useUser();
  const { showLoader, hideLoader } = useLoader();
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSocialLogin, setIsSocialLogin] = useState(false);
  // useEffect(()=>{
  //     GoogleSignin.configure({
  //       webClientId: '162801726700-k8lrgn4630cdnd3skaafgbbd8dpkhu0b.apps.googleusercontent.com', // Get from Firebase Console
  //       offlineAccess: true,
  //     });
  // },[])
const signOut = async () => {
  try {
    await GoogleSignin.revokeAccess(); // optional, to revoke access
    await GoogleSignin.signOut();      // remove user from device
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out: ', error);
  }
};

useEffect(()=>{
  if(isSocialLogin){
    handleSignup();
  }
},[isSocialLogin]);
const appleLogin = async(loginData)=>{
  try{
    console.log(loginData)
    setFirstName(loginData?.fullName?.givenName);
      setLastname(loginData?.fullName?.familyName);
      setEmail(loginData?.email);
      setPassword('123456');
      setPhoneNumber('1234567890');
      setIsSocialLogin(true);
  }
  catch(e){

  }
}
    const googleSingUP = async()=>{
    try {
      await signOut()
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('...................................User Info:', userInfo);
      setFirstName(userInfo?.data?.user?.givenName);
      setLastname(userInfo?.data?.user?.familyName);
      setEmail(userInfo?.data?.user?.email);
      setPassword('123456');
      setPhoneNumber('1234567890');
      setIsSocialLogin(true);
     // Alert.alert('Login Success', userInfo.data.user.email);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Already in progress');
      } else {
        console.log('Error1', error.message)
        Alert.alert('Error1', error.message);
      }
    }
  };
   const checkUserExist = ()=>{
    setIsSocialLogin(false);
    if(!email){
      setErrorMessage('All fields are required.');
      return 
    }
    const apiEndpoint = userRole === 'recruiter' ? API_ENDPOINTS.RECRUITER_GET_PROFILE : API_ENDPOINTS.CANDIDATE_GET_PROFILE;
   showLoader();
    Api.post(apiEndpoint, {email:email}, {}).then((res) => {
            console.log('..............',res.data.result.length)
            if(res?.data?.result?.length === 0){
              handleSignup()
            }
            else if(res?.data?.result?.length > 0){
              hideLoader()
              Alert.alert(LANGUAGE_DATA.signupError);
            }
            else{
              hideLoader()
            }
   }).catch((err)=>{
        hideLoader()
   })
  }

  const handleSignup = async() => {

    if (!firstname.trim() || !lastname.trim() || !email.trim() || !phoneNumber.trim() || !password.trim()) {
      setErrorMessage('All fields are required.');
      hideLoader()
    } else if (phoneNumber.length !== 10) {
      setErrorMessage('Phone number must be 10 digits.');
      hideLoader()
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMessage('Invalid email address.');
      hideLoader()
    } else if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      hideLoader()
    }
    else {
      var param = {
        "firstname": firstname,
        "lastname": lastname,
        "email": email,
        "mobile": phoneNumber,
        "password": password,
        socialLogin: isSocialLogin,
      }
savedata(ASYNC_STORAGES.firstName, firstname)
      //showLoader();
   
      // Choose API endpoint based on the user role
      const apiEndpoint = userRole === 'recruiter' ? 'recuiter/registration' : 'candidate/registration';
      messaging()
  .getToken()
  .then(token => {
    console.log('Firebase Token:', token);
    param.deviceToken = token
      auth().createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        console.log('User signed in:', userCredential.user)
        param.uid =  userCredential.user.uid
        Api.post(apiEndpoint, param, {}).then((res) => {
          hideLoader();
          messaging()
    .subscribeToTopic(userCredential.user.uid)
    .then(() => {
      console.log(`Subscribed to topic: ${userCredential.user.uid}`);
    });
          // navigate(navigation, 'VerifyOtp', { email, screenName })
          if(isSocialLogin){
            savedata(ASYNC_STORAGES.email, email)
                                savedata(ASYNC_STORAGES.role, userRole)
                                // if (userRole === 'recruiter') {
                                //     navigateReset(navigation, 'AddCompanyDetails');
                                // } else {
                                //     navigateResetParam(navigation, 'Availability', { email: email });
                                // }
                                savedata(ASYNC_STORAGES.email, email)
                                savedata(ASYNC_STORAGES.role, userRole)
                                savedata(ASYNC_STORAGES.role, userRole)
                                navigation.navigate('CreatePassword', {
            email: email,
            comeFrom: 'Signup',
            name: firstname
          });
          }
          else{
          navigation.navigate('VerifyOtp', {
            email: email,
            comeFrom: 'Signup',
            name: firstname
          });
        }
        }).catch((err: any) => {
          hideLoader();
          console.log(err.data)
          Alert.alert(err.data.message)
        })
        setErrorMessage('');
      }).catch((err)=>{
        // console.log('firebase error ',err.message);
        hideLoader();
        Alert.alert('The email address is already in use by another account.') 
      })
    }).catch(err=>{
      hideLoader();
      console.log(err);
    })
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };
  const navigateToVerifyOtp = () => {
    navigate(navigation, 'VerifyOtp')
  };

  return (
    <>
      <GradientBackground>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >

          <ScrollView >
            <ActionBar title="" onBackPress={handleBackPress} />

            <View style={styles.container}>
              <Text style={styles.title}>{LANGUAGE_DATA.CREATE_ACCOUNT.createyour}</Text>
              <GradientText style={styles.gradientTitle}>{LANGUAGE_DATA.CREATE_ACCOUNT.account}</GradientText>

              {/* <Text style={styles.userType}>Welcome, {userRole === 'recruiter' ? 'Recruiter' : 'Applicant'}</Text> */}

              <TextInput
                style={styles.input}
                placeholder={LANGUAGE_DATA.CREATE_ACCOUNT.firstname}
                value={firstname}
                onChangeText={setFirstName}
                placeholderTextColor={"white"}
              />
              <TextInput
                style={styles.input}
                placeholder={LANGUAGE_DATA.CREATE_ACCOUNT.lastname}
                value={lastname}
                onChangeText={setLastname}
                placeholderTextColor={"white"}
              />
              <TextInput
                style={styles.input}
                placeholder={LANGUAGE_DATA.CREATE_ACCOUNT.email}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholderTextColor={"white"}
              />
              <TextInput
                style={styles.input}
                placeholder={LANGUAGE_DATA.CREATE_ACCOUNT.phonenumber}
                value={phoneNumber}
                keyboardType="number-pad"
                placeholderTextColor={"white"}
                onChangeText={(text) => {
                  if (text.length <= 10) {
                    setPhoneNumber(text.replace(/[^0-9]/g, '')); // Allow only numeric input
                  }
                }}
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={LANGUAGE_DATA.CREATE_ACCOUNT.password}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  placeholderTextColor="white"
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible((prev) => !prev)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeText}>{isPasswordVisible ? '👁️' : '👁‍🗨'}</Text>
                </TouchableOpacity>
              </View>

              {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

              <GradientButton title={LANGUAGE_DATA.CREATE_ACCOUNT.signupbutton} onPress={checkUserExist} />

              <SocialLogin
              googleSingUP={googleSingUP} appleLogin={appleLogin}/>

              <Hyperlink
                message={LANGUAGE_DATA.CREATE_ACCOUNT.alreadyaccount}
                linkText={LANGUAGE_DATA.CREATE_ACCOUNT.login}
                onLinkPress={handleBackPress} />

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </GradientBackground>
    </>
  );
};

export default SignupPage;