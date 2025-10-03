import React, { useState, useRef } from 'react';
import { View, TextInput, Text, Image, Alert } from 'react-native';
import styles from './styles'
import { navigate, navigateReset, navigateResetParam } from '../../Common/navigate';
import Api from '../../Common/Apicall'
import GradientBackground from '../../Common/component/GradientBackground';
import GradientButton from '../../Common/component/GradientButton';
import ActionBar from '../../Common/component/ActionBar';
import GradientText from '../../Common/component/GradientText';
import Hyperlink from '../../Common/component/Hyperlink';
import { useLoader } from '../../Common/component/LoaderContext';
import { useUser } from '../../Common/Utils/UserProvider';
import { savedata } from '../../Common/localdata';
import { ASYNC_STORAGES } from '../../Common/Storage';
import LANGUAGE_DATA from '../../Constants/language';

const VerifyOtp = ({ navigation, route }) => {
    const { userRole } = useUser();
    const { email, comeFrom, name } = route.params;
    const { showLoader, hideLoader } = useLoader();
    const [errorMessage, setErrorMessage] = useState('');
    const [code, setCode] = useState(["", "", "", ""]);
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    const handleBackPress = () => {
        navigation.goBack();
    };

    const navigateToDashboard = () => {
        // OTP Validation
        if (code.includes("") || code.length < 4) {
            setErrorMessage('Please enter the complete OTP.');
            return;
        }

        // Clear error message and proceed
        setErrorMessage('');

        const otp = code.join("");
        var param = { "email": email, "otp": otp }
        console.log(param)
        showLoader();

        // Choose API endpoint based on the user role
        const apiEndpoint = userRole === 'recruiter' ? 'recuiter/validateotp' : 'candidate/validateotp';

        Api.post(apiEndpoint, param, {}).then((res) => {
            hideLoader();
            // console.log(res.data)
            if (res.data.success) {
                if (comeFrom == 'Signup') {
                    savedata(ASYNC_STORAGES.email, email)
                    savedata(ASYNC_STORAGES.role, userRole)
                    if (userRole === 'recruiter') {
                        navigateReset(navigation, 'AddCompanyDetails');
                    } else {
                        navigateResetParam(navigation, 'Availability', { email: email });
                    }
                    savedata(ASYNC_STORAGES.email, email)
                    savedata(ASYNC_STORAGES.role, userRole)
                } else {
                    navigateResetParam(navigation, 'CreatePassword', { email: email });
                }
            } else {
                Alert.alert("Something went wrong")
            }
        }).catch((err: any) => {
            hideLoader();
            // console.log("Error during API call:", err);
            Alert.alert(err.data.message)
        })
    };

    const handleCodeChange = (text, index) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        // Automatically move to the next input if a digit is entered
        if (text && index < inputRefs.length - 1) {
            inputRefs[index + 1].current.focus();
        }

        // If the input is cleared, move back to the previous input
        if (!text && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handleResendOtp = () => {
        var param = { "email": email }

        showLoader();

        // Choose API endpoint based on the user role
        const apiEndpoint = userRole === 'recruiter' ? 'recuiter/resendotp' : 'candidate/resendotp';

        Api.post(apiEndpoint, param, {}).then((res) => {
            hideLoader();
            console.log(res.data)
            if (res.data.success) {
                Alert.alert("OTP sent successfully")
            } else {
                Alert.alert("Something went wrong")
            }
        }).catch((err: any) => {
            hideLoader();
            console.log(err.data)
            Alert.alert(err.data.message)
        })
    };

    return (
        <GradientBackground>
            <ActionBar title="" onBackPress={handleBackPress} />
            <View style={styles.container}>
                <Text style={styles.title}>{LANGUAGE_DATA.OTP_PAGE.heading}</Text>
                <GradientText style={styles.gradientTitle}>{LANGUAGE_DATA.OTP_PAGE.heading2}</GradientText>

                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

                <View style={styles.codeContainer}>
                    {code.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={inputRefs[index]}
                            style={styles.otpInput}
                            value={digit}
                            onChangeText={(text) => handleCodeChange(text, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                        />
                    ))}
                </View>

                <GradientButton title={LANGUAGE_DATA.OTP_PAGE.button1} onPress={navigateToDashboard} />

                <Hyperlink
                    containerStyle={{ marginTop: 24 }}
                    message={LANGUAGE_DATA.OTP_PAGE.resendtitle}
                    linkText={LANGUAGE_DATA.OTP_PAGE.resendlink}
                    onLinkPress={handleResendOtp} />

            </View>
        </GradientBackground>
    );
};

export default VerifyOtp;