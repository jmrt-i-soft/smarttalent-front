import React from 'react';
import {  appleAuth } from '@invertase/react-native-apple-authentication';
import { colors } from '../../Constants/colors';
import { images } from '../../../assets/images';
import SocialBtn from '../../Common/component/SocialBtnBackground';
import auth from '@react-native-firebase/auth';
import { sha256 } from 'js-sha256';
function AppleLoginButton({appleLogin}) {
  function generateNonce(length = 32) {
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const values = new Uint32Array(length);
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }
  async function onAppleButtonPress() {
    try {

              const rawNonce = generateNonce();
    const hashedNonce = sha256(rawNonce);

    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      nonce: hashedNonce,
    });

     const { identityToken, authorizationCode } = appleAuthRequestResponse;

    if (!identityToken || !authorizationCode) {
      throw new Error('Apple Sign-In failed: Missing identity token or code');
    }
       const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      hashedNonce // Must be raw nonce here!
    );

      // const {
      //   user,
      //   email,
      //   fullName,
      //   identityToken,
      //   authorizationCode,
      // } = appleAuthRequestResponse;
         appleLogin(appleAuthRequestResponse,appleCredential);
      // Send identityToken or authorizationCode to backend for verification
   
    } catch (error) {
      console.error('Apple login error:', error);
    }
  }

  return (
    <SocialBtn
                        color={colors.white}
                        image={images.apple}
                        onPress={onAppleButtonPress} />
    // <AppleButton
    //   buttonStyle={AppleButton.Style.BLACK}
    //   buttonType={AppleButton.Type.SIGN_IN}
    //   style={{ width: 200, height: 44 }}
    //   onPress={onAppleButtonPress}
    // />
  );
}

export default AppleLoginButton;