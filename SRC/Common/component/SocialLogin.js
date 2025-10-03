import React,{useEffect} from 'react';
import { Text, StyleSheet, View, Image, Dimensions, Alert } from 'react-native';
import { images } from '../../../assets/images';
import { colors } from '../../Constants/colors';
import SocialBtn from '../../Common/component/SocialBtnBackground';
import LANGUAGE_DATA from '../../Constants/language';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AppleLoginButton from './AppleSignIN'
const { width, height } = Dimensions.get('window');

const SocialLogin = ({googleSingUP, appleLogin}) => {
     useEffect(()=>{
      GoogleSignin.configure({
        webClientId: '162801726700-iiu2m1j8gpbm3l9uhcnrdddqt4i8rrsp.apps.googleusercontent.com', // Get from Firebase Console
        offlineAccess: true,
  forceCodeForRefreshToken: true,
      });
  },[])
    return (
        <View>
            <View style={{ flexDirection: 'row', marginTop: 24, justifyContent: 'space-between', }}>
                <Image style={styles.logo} source={images.lineBlueLeft} />
                <Text style={styles.continueWith}>{LANGUAGE_DATA.LOGIN.continuewith}</Text>
                <Image style={styles.logo} source={images.lineBlueRight} />
            </View>

            <View style={{ flexDirection: 'row', marginVertical: height * 0.025, alignSelf: 'center' }}>
                <SocialBtn
                    color={colors.darkGray}
                    image={images.google}
                    onPress={()=>googleSingUP()} />
                <AppleLoginButton appleLogin={appleLogin}/>
                {/* <SocialBtn
                    color={colors.facebookBlue}
                    image={images.facebook}
                    onPress={handleSocialLogin} /> */}
                
            </View>
        </View>
    );
};

const handleSocialLogin = () => {
    Alert.alert('Social login click.')
};

const styles = StyleSheet.create({
    logo: {
        alignSelf: 'center',
        width: width * 0.3, // Set width as 20% of screen width for responsive sizing
     
    },
    continueWith: {
        fontSize: 12,
        color: 'white',
    },
});

export default SocialLogin;