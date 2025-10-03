import React, { useState } from 'react';
import { View, TextInput, Text, Alert } from 'react-native';
import styles from './styles'
import Api from '../../Common/Apicall'
import GradientBackground from '../../Common/component/GradientBackground';
import GradientButton from '../../Common/component/GradientButton';
import ActionBar from '../../Common/component/ActionBar';
import { useUser } from '../../Common/Utils/UserProvider';
import { useLoader } from '../../Common/component/LoaderContext';
import GradientText from '../../Common/component/GradientText';
import LANGUAGE_DATA from '../../Constants/language';

const ForgotPasswordPage = ({ navigation }) => {
    const { userRole } = useUser();
    const [email, setEmail] = useState('');
    const { showLoader, hideLoader } = useLoader();
    const [errorMessage, setErrorMessage] = useState('');

    const handleBackPress = () => {
        navigation.goBack();
    };

    const sendOtp = () => {
        if (!email.trim()) {
            setErrorMessage('Enter Email Id');
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            setErrorMessage('Invalid email address.');
        } else {
            var param = { "email": email }

            showLoader();

            // Choose API endpoint based on the user role
            const apiEndpoint = userRole === 'recruiter' ? 'recuiter/resendotp' : 'candidate/resendotp';

            Api.post(apiEndpoint, param, {}).then((res) => {
                hideLoader();
               // console.log(res.data)
                navigation.navigate('VerifyOtp', {
                    email: email,
                    comeFrom: 'ForgotPassword',
                });
            }).catch((err: any) => {
                hideLoader();
                console.log(err.data)
                Alert.alert(err.data.message)
            })
            setErrorMessage('');
        }
    };

    return (
        <GradientBackground>
            <ActionBar title="" onBackPress={handleBackPress} />
            <View style={styles.container}>
                <Text style={styles.title}>{LANGUAGE_DATA.FORGOT.heading}</Text>
                <GradientText style={styles.gradientTitle}>{LANGUAGE_DATA.FORGOT.heading2}</GradientText>
                <Text style={styles.subtitle}>{LANGUAGE_DATA.FORGOT.candidatetitle}</Text>

                <TextInput
                    style={styles.input}
                    placeholder={LANGUAGE_DATA.FORGOT.enteremail}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                    placeholderTextColor={"#FFF"} />

                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

                <GradientButton title={LANGUAGE_DATA.FORGOT.button1} onPress={sendOtp} />

            </View>
        </GradientBackground>
    );
};

export default ForgotPasswordPage;