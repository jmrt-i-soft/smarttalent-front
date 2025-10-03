import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import styles from './styles'
import { navigate, navigateReset, navigateResetParam } from '../../Common/navigate';
import Api from '../../Common/Apicall'
import GradientBackground from '../../Common/component/GradientBackground';
import GradientButton from '../../Common/component/GradientButton';
import { images } from '../../../assets/images';
import SocialLogin from '../../Common/component/SocialLogin';
import { useLoader } from '../../Common/component/LoaderContext';
import { useUser } from '../../Common/Utils/UserProvider';
import Hyperlink from '../../Common/component/Hyperlink';
import { savedata } from '../../Common/localdata';
import { ASYNC_STORAGES } from '../../Common/Storage';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import API_ENDPOINTS from '../../Constants/apiEndpoints';
import LANGUAGE_DATA from '../../Constants/language';
import ActionBar from '../../Common/component/ActionBar';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { utils } from '@react-native-firebase/app';
import { sha256 } from 'js-sha256';
const LoginPage = ({ navigation }) => {
  const { userRole } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { showLoader, hideLoader } = useLoader();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSocialLogin, setIsSocialLogin] = useState(false);
  const [isAppleLogin,setIsAppleLogin] = useState(false)
const [socialToken, setsocialToken] = useState(null);
const [appleCredential, setAppleCredential] =useState(null)
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
 handleResonse(username,socialToken)
  }
},[isSocialLogin])
useEffect(()=>{
if(isAppleLogin){
handleAppleResonse(username,socialToken)
}
},[isAppleLogin])

const appleLogin = async(data,appleCrd)=>{
   try {
      console.log(data)
      //const decoded = jwtDecode(data?.identityToken);
      //console.log('......',decoded)
      setAppleCredential(appleCrd)
      setsocialToken(data?.identityToken)
      //setUsername(decoded?.email);
        setIsAppleLogin(true);
     
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
}

const googleSingUP = async()=>{
    try {
      await signOut()
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('...................................User Info:', userInfo);
      setsocialToken(userInfo?.data?.idToken)
      setUsername(userInfo?.data?.user?.email);
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





  const updateTokens = (email)=>{
    messaging()
      .getToken()
      .then(token => {
        console.log("tokens", token )
        const param1 = {
          deviceToken : token,
          email: email
        }
        Api.post('recuiter/updateFirebaseUId', param1, {}).then((res) => {
          console.log('dsdsdsdsdsd',res)
        })

        //navigate(navigation,'ChatList')
      })
      .catch(error => {
        console.error('Error signing in:', error)
       // handleSinIn()
      })
     
  };

   const handleAppleResonse = (email, idToken)=>{
       messaging()
        .getToken()
        .then(token => {
      var param = {
        email: email,
        deviceToken: token,
        idToken:idToken,
        isCandidate: userRole !== 'recruiter' ? true : false,
        isRecuiter: userRole === 'recruiter' ? true : false,
      };
      console.log('...........................................',param);
    
      
      console.log('.................done')
   
      showLoader();

      // Choose API endpoint based on the user role
      const apiEndpoint = userRole === 'recruiter' ? 'recuiter/appleLogin' : 'recuiter/appleLogin';
console.log('apiEndpoint',apiEndpoint)
      Api.post(apiEndpoint, param, {}).then((res) => {
       // handleAppleLoginChat(idToken);
        hideLoader();
        //alert(JSON.stringify(res.data))
         // setIsSocialLogin(false);
        console.log('jgfjgjhg6666',res.data.user[0].email)
        updateTokens(res?.data?.user[0]?.email);
        savedata(ASYNC_STORAGES.email, res.data.user[0].email)
        savedata(ASYNC_STORAGES.role, userRole)
        // if(res.data.success && res.data?.user[0].firebaseUID == "NULL"){
        //  handleSinup()
        // }
         if (userRole == 'recruiter') {
          var param2 = {
            "email": res.data.user[0].email
          }
          Api.post(API_ENDPOINTS.RECRUITER_GET_PROFILE, param2, {}).then((res2) => {
            hideLoader();
            console.log('recuiter data :', res2.data)
            // console.log('recuiter data :', res2.data.result[0].stage)
             if(res2.data.result.length > 0){
             handleAppleLoginChat(res2.data.result[0].password)
            }
            if (res2.data.result.length == 0) {
              navigateReset(navigation, 'AddCompanyDetails')
            } else if (res2.data.result[0].stage == 'companyinfo') {
              navigateReset(navigation, 'CreateJobOffer')
            } else if (res2.data.result[0].stage == 'jobdetail') {
              navigateReset(navigation, 'VideoCheckList')
            } else if (res2.data.result[0].stage == 'updated') {
              savedata(ASYNC_STORAGES.firstName, res.data.user[0].firstname)
              savedata(ASYNC_STORAGES.postedJob, JSON.stringify(res2.data.allPostedJob))
              navigation.reset({
                index: 0,
                routes: [{
                  name: 'bottomTabNavigator', params: {
                    email: res.data.user[0].email,
                    name: res.data.user[0].firstname
                  }
                }],
              });
            }
          }).catch((err) => {
            hideLoader();
            console.log(err.data)
            Alert.alert(err.data.message)
          })
        } else {
          // console.log('calling api',API_ENDPOINTS.CANDIDATE_GET_PROFILE);
          
          var param2 = {
            "email": res.data.user[0].email
          }
          Api.post(API_ENDPOINTS.CANDIDATE_GET_PROFILE, param2, {}).then((res2) => {
            hideLoader();
            console.log('applicant data :', res2.data.result)
            if (res2.data.result.length == 0) {
             navigateResetParam(navigation,'Availability', { email: res.data.user[0].email });
            } else if (res2.data.result[0].stage == 'availability') {
              navigateResetParam(navigation, 'SearchInformation', { email: res.data.user[0].email })
            } else if (res2.data.result[0].stage == 'search') {
              navigateResetParam(navigation, 'Skills', { email: res.data.user[0].email })
            } else if (res2.data.result[0].stage == 'skill') {
              navigateResetParam(navigation, 'ExperienceList', { email: res.data.user[0].email, comeFrom: 'ForgotPassword' })
            } else if (res2.data.result[0].stage == 'experience') {
              navigateReset(navigation, 'DegreeList')
            } else if (res2.data.result[0].stage == 'degree') {
              navigateReset(navigation, 'VideoCheckList');
            } else if (res2.data.result[0].stage == 'updated') {
              savedata(ASYNC_STORAGES.firstName, res.data.user[0].firstname)
              navigation.reset({
                index: 0,
                routes: [{
                  name: 'bottomTabNavigator', params: {
                    email: res.data.user[0].email,
                    name: res.data.user[0].firstname
                  }
                }],
              });
            }
          }).catch((err) => {
            hideLoader();
            console.log("err......................",err)
            Alert.alert(err.data.message)
          });
        }
      }).catch((err) => {
        hideLoader();
       console.log('jghjhgjhgj.....................',err)
        setErrorMessage('');
        Alert.alert(err.data.message)
      });
    }).catch(err=>{
      hideLoader();
      console.log(err);
    });
  };


  const handleResonse = (email, idToken)=>{
       messaging()
        .getToken()
        .then(token => {
      var param = {
        email: email,
        deviceToken: token,
        idToken:idToken,
        isCandidate: userRole !== 'recruiter' ? true : false,
        isRecuiter: userRole === 'recruiter' ? true : false,
      };
      console.log('...........................................',param);
    
      
     
      showLoader();

      // Choose API endpoint based on the user role
      const apiEndpoint = userRole === 'recruiter' ? 'recuiter/googleLogin' : 'recuiter/googleLogin';
console.log('apiEndpoint',apiEndpoint)
      Api.post(apiEndpoint, param, {}).then((res) => {
       // handleSocialLoginChat(idToken);
        hideLoader();
        //alert(JSON.stringify(res.data))
         // setIsSocialLogin(false);
        console.log('jgfjgjhg6666',res.data)
        updateTokens(email);
        savedata(ASYNC_STORAGES.email, res.data.user[0].email)
        savedata(ASYNC_STORAGES.role, userRole)
        // if(res.data.success && res.data?.user[0].firebaseUID == "NULL"){
        //  handleSinup()
        // }
         if (userRole == 'recruiter') {
          var param2 = {
            "email": email
          }
          Api.post(API_ENDPOINTS.RECRUITER_GET_PROFILE, param2, {}).then((res2) => {
            hideLoader();
            console.log('recuiter data :', res2.data)
            // console.log('recuiter data :', res2.data.result[0].stage)
            if(res2.data.result.length > 0){
              handleSocialLoginChat(res2.data.result[0].password);
           }
            if (res2.data.result.length == 0) {
              navigateReset(navigation, 'AddCompanyDetails')
            } else if (res2.data.result[0].stage == 'companyinfo') {
              navigateReset(navigation, 'CreateJobOffer')
            } else if (res2.data.result[0].stage == 'jobdetail') {
              navigateReset(navigation, 'VideoCheckList')
            } else if (res2.data.result[0].stage == 'updated') {
              savedata(ASYNC_STORAGES.firstName, res.data.user[0].firstname)
              savedata(ASYNC_STORAGES.postedJob, JSON.stringify(res2.data.allPostedJob))
              navigation.reset({
                index: 0,
                routes: [{
                  name: 'bottomTabNavigator', params: {
                    email: res.data.user[0].email,
                    name: res.data.user[0].firstname
                  }
                }],
              });
            }
          }).catch((err) => {
            hideLoader();
            console.log(err.data)
            Alert.alert(err.data.message)
          })
        } else {
          // console.log('calling api',API_ENDPOINTS.CANDIDATE_GET_PROFILE);
          
          var param2 = {
            "email": email
          }
          Api.post(API_ENDPOINTS.CANDIDATE_GET_PROFILE, param2, {}).then((res2) => {
            hideLoader();
            console.log('applicant data :', res2.data.result)
            if (res2.data.result.length == 0) {
             navigateResetParam(navigation,'Availability', { email: email });
            } else if (res2.data.result[0].stage == 'availability') {
              navigateResetParam(navigation, 'SearchInformation', { email: email })
            } else if (res2.data.result[0].stage == 'search') {
              navigateResetParam(navigation, 'Skills', { email: email })
            } else if (res2.data.result[0].stage == 'skill') {
              navigateResetParam(navigation, 'ExperienceList', { email: email, comeFrom: 'ForgotPassword' })
            } else if (res2.data.result[0].stage == 'experience') {
              navigateReset(navigation, 'DegreeList')
            } else if (res2.data.result[0].stage == 'degree') {
              navigateReset(navigation, 'VideoCheckList');
            } else if (res2.data.result[0].stage == 'updated') {
              savedata(ASYNC_STORAGES.firstName, res.data.user[0].firstname)
              navigation.reset({
                index: 0,
                routes: [{
                  name: 'bottomTabNavigator', params: {
                    email: res.data.user[0].email,
                    name: res.data.user[0].firstname
                  }
                }],
              });
            }
          }).catch((err) => {
            hideLoader();
            console.log("err......................",err)
            Alert.alert(err.data.message)
          });
        }
      }).catch((err) => {
        hideLoader();
       console.log('jghjhgjhgj.....................',err)
        setErrorMessage('');
        Alert.alert(err.data.message)
      });
    }).catch(err=>{
      hideLoader();
      console.log(err);
    });
  };

  const linkPassword = async (passwords)=>{
    const currentUser = auth().currentUser;


// Create email/password credential
const emailCredential = auth.EmailAuthProvider.credential(currentUser.email, passwords);

// Link email/password provider to Google account
try {
  await currentUser.linkWithCredential(emailCredential);
  console.log('Email/password linked to Google account!');
} catch (error) {
  if (error.code === 'auth/provider-already-linked') {
    console.log('Provider already linked');
  } else if (error.code === 'auth/credential-already-in-use') {
    console.log('This email/password is already linked with another account');
  } else {
    console.error(error);
  }
}
  }

    const handleAppleLoginChat = async(passwords)=>{
      try{
              auth()
   .signInWithCredential(appleCredential)
  .then(userCredential => {
    setIsSocialLogin(false)
    //Alert.alert(userCredential.user.uid);
    console.log('User signed in:', userCredential.user.uid)
    linkPassword(passwords)
    messaging()
    .subscribeToTopic(userCredential.user.uid)
    .then(() => {
      console.log(`Subscribed to topic: ${userCredential.user.uid}`);
    })
    .catch(error => {
      console.error('Error subscribing to topic:', error);
    });
 })
  .catch(error => console.error('Error signing in:', error));
}
catch(e){
  console.error('Error signing in1:', e);
}
  }

  const handleSocialLoginChat = async(passwords)=>{
    const { idToken } = await GoogleSignin.getTokens();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
       auth()
   .signInWithCredential(googleCredential)
  .then(userCredential => {
    setIsSocialLogin(false)
    //Alert.alert(userCredential.user.uid);
    console.log('User signed in:', userCredential.user.uid)
    linkPassword(passwords)
    messaging()
    .subscribeToTopic(userCredential.user.uid)
    .then(() => {
      console.log(`Subscribed to topic: ${userCredential.user.uid}`);
    })
    .catch(error => {
      console.error('Error subscribing to topic:', error);
    });
 })
  .catch(error => console.error('Error signing in:', error));
  }
  



  const handleSinInchat = ()=>{
   //console.log('username.trim()username.trim()username.trim()username.trim()username.trim()',username, isSocialLogin)
    auth()
   .signInWithEmailAndPassword(username.trim(), password.trim())
  .then(userCredential => {
    setIsSocialLogin(false)
    console.log('User signed in:', userCredential.user.uid)
    messaging()
    .subscribeToTopic(userCredential.user.uid)
    .then(() => {
      console.log(`Subscribed to topic: ${userCredential.user.uid}`);
    })
    .catch(error => {
      console.error('Error subscribing to topic:', error);
    });

    //navigate(navigation,'ChatList')
  })
  .catch(error => console.error('Error signing in:', error));
  }

  const navigateToDashboard = () => {
    setErrorMessage('');
   
    if (username.trim() == '' || password.trim() == '') {
      setErrorMessage('Please fill in both fields.');
    } else if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
    } else if (!/^\S+@\S+\.\S+$/.test(username)) {
      setErrorMessage('Invalid email address.');
    }
    else {
       messaging()
        .getToken()
        .then(token => {
      var param = {
        email: username,
        password: password,
        deviceToken: token,
      }
      
      showLoader();

      // Choose API endpoint based on the user role
      const apiEndpoint = userRole === 'recruiter' ? 'recuiter/login' : 'candidate/login';
console.log('apiEndpoint',apiEndpoint)
      Api.post(apiEndpoint, param, {}).then((res) => {
        handleSinInchat()
        hideLoader();
        console.log('jgfjgjhg6666',res.data)
        updateTokens(username);
        savedata(ASYNC_STORAGES.email, res.data.user[0].email)
        savedata(ASYNC_STORAGES.role, userRole)
        // if(res.data.success && res.data?.user[0].firebaseUID == "NULL"){
        //  handleSinup()
        // }
         if (userRole == 'recruiter') {
          var param2 = {
            "email": username
          }
          Api.post(API_ENDPOINTS.RECRUITER_GET_PROFILE, param2, {}).then((res2) => {
            hideLoader();
            console.log('recuiter data :', res2.data)
            // console.log('recuiter data :', res2.data.result[0].stage)
            if (res2.data.result.length == 0) {
              navigateReset(navigation, 'AddCompanyDetails')
            } else if (res2.data.result[0].stage == 'companyinfo') {
              navigateReset(navigation, 'CreateJobOffer')
            } else if (res2.data.result[0].stage == 'jobdetail') {
              navigateReset(navigation, 'VideoCheckList')
            } else if (res2.data.result[0].stage == 'updated') {
              savedata(ASYNC_STORAGES.firstName, res.data.user[0].firstname)
              savedata(ASYNC_STORAGES.postedJob, JSON.stringify(res2.data.allPostedJob))
              navigation.reset({
                index: 0,
                routes: [{
                  name: 'bottomTabNavigator', params: {
                    email: res.data.user[0].email,
                    name: res.data.user[0].firstname
                  }
                }],
              });
            }
          }).catch((err) => {
            hideLoader();
            console.log(err.data)
            Alert.alert(err.data.message)
          })
        } else {
          // console.log('calling api',API_ENDPOINTS.CANDIDATE_GET_PROFILE);
          
          var param2 = {
            "email": username
          }
          Api.post(API_ENDPOINTS.CANDIDATE_GET_PROFILE, param2, {}).then((res2) => {
            hideLoader();
            console.log('applicant data :', res2.data.result)
            if (res2.data.result.length == 0) {
             navigateResetParam(navigation,'Availability', { email: username });
            } else if (res2.data.result[0].stage == 'availability') {
              navigateResetParam(navigation, 'SearchInformation', { email: username })
            } else if (res2.data.result[0].stage == 'search') {
              navigateResetParam(navigation, 'Skills', { email: username })
            } else if (res2.data.result[0].stage == 'skill') {
              navigateResetParam(navigation, 'ExperienceList', { email: username, comeFrom: 'ForgotPassword' })
            } else if (res2.data.result[0].stage == 'experience') {
              navigateReset(navigation, 'DegreeList')
            } else if (res2.data.result[0].stage == 'degree') {
              navigateReset(navigation, 'VideoCheckList')
              
            } else if (res2.data.result[0].stage == 'updated') {
              savedata(ASYNC_STORAGES.firstName, res.data.user[0].firstname)
              navigation.reset({
                index: 0,
                routes: [{
                  name: 'bottomTabNavigator', params: {
                    email: res.data.user[0].email,
                    name: res.data.user[0].firstname
                  }
                }],
              });
            }
          }).catch((err) => {
            hideLoader();
            console.log("err......................",err)
            Alert.alert(err.data.message)
          })
        }
      }).catch((err) => {
        hideLoader();
       console.log('jghjhgjhgj.....................',err)
        setErrorMessage('');
        Alert.alert(err.data.message)
      })
    }).catch(err=>{
      hideLoader();
      console.log(err);
    })
    }
    
  };
  const navigateToForgotPassword = () => {
    navigate(navigation, 'ForgotPassword')
  };

  const navigateToSignup = () => {
    navigate(navigation, 'Signup')
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <>
      <GradientBackground>
        <ActionBar title={userRole === 'recruiter' ? LANGUAGE_DATA.ADD_COMPANY.recuiter : LANGUAGE_DATA.ADD_COMPANY.candidate} onBackPress={handleBackPress} />
        <ScrollView>
          <View style={styles.container}>
            <Image style={styles.logo} source={images.logo} />
            <Text style={styles.title}>{LANGUAGE_DATA.LOGIN.heading}</Text>

            {/* <Text style={styles.userType}>Welcome, {userRole === 'recruiter' ? 'Recruiter' : 'Applicant'}</Text> */}

            <TextInput
              style={styles.input}
              placeholder="E-mail"
              value={username}
              keyboardType="email-address"
              placeholderTextColor={"white"}
              onChangeText={setUsername}
            />
            {/* onChangeText={(text) => {
                if (text.length <= 10) {
                  setUsername(text.replace(/[^0-9]/g, '')); // Allow only numeric input
                }
              }} */}

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
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

            {/* Error view */}
            {errorMessage ? <Text style={styles.error}>{errorMessage || ' '}</Text> : null}

            <TouchableOpacity style={styles.forgotbutton} onPress={navigateToForgotPassword}>
              <Text style={styles.forgotPassword}>{LANGUAGE_DATA.LOGIN.forgot}</Text>
            </TouchableOpacity>
            
            <GradientButton title={`${userRole == 'recruiter' ? LANGUAGE_DATA.LOGIN.RoleRecuiter : LANGUAGE_DATA.LOGIN.RoleCandidate} ${LANGUAGE_DATA.LOGIN.button1}`} onPress={navigateToDashboard} />
            {/* <GradientButton title="Sign Up" onPress={handleSinup} />
            <GradientButton title="Sign In" onPress={handleSinInchat} /> */}
            <SocialLogin googleSingUP={googleSingUP} appleLogin={appleLogin}/>

            <Hyperlink
              message={LANGUAGE_DATA.LOGIN.createaccount}
              linkText={LANGUAGE_DATA.LOGIN.createaccount2}
              onLinkPress={navigateToSignup} />

          </View>
        </ScrollView>
      </GradientBackground>
    </>
  );
};

export default LoginPage;