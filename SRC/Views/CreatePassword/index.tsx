import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import styles from '../../Common/CommonStyle/styles'
import { navigateReset, navigateResetParam } from '../../Common/navigate';
import Api from '../../Common/Apicall'
import GradientBackground from '../../Common/component/GradientBackground';
import GradientButton from '../../Common/component/GradientButton';
import ActionBar from '../../Common/component/ActionBar';
import TextInputWithLabel from '../../Common/component/TextInputWithLabel';
import { useLoader } from '../../Common/component/LoaderContext';
import { useUser } from '../../Common/Utils/UserProvider';
import GradientText from '../../Common/component/GradientText';
import LANGUAGE_DATA from '../../Constants/language';

const CreatePassword = ({ navigation, route }) => {
    const {  comeFrom } = route.params;
    const { userRole } = useUser();
    const { email } = route.params;
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { showLoader, hideLoader } = useLoader();

    const handleBackPress = () => {
        navigation.goBack();
    };

    const navigateToLogin = () => {
        // Check if password length is at least 6 characters
        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters.');
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        setErrorMessage(''); // Clear error message

        var param = {
            "email": email,
            "password": password
        }

        showLoader();

        // Choose API endpoint based on the user role
        const apiEndpoint = userRole === 'recruiter' ? 'recuiter/createpassword' : 'candidate/createpassword';

        Api.post(apiEndpoint, param, {}).then((res) => {
            hideLoader();
           // console.log(res.data)
            Alert.alert(
                "Success",
                "Your password has been successfully created. You can now log in using your new password.",
                [
                    {
                        text: comeFrom == 'Signup' ? 'Alert' : "Go to Login",
                        onPress: () => {
                            if(comeFrom == 'Signup'){
                                if (userRole === 'recruiter') {
                                                        navigateReset(navigation, 'AddCompanyDetails');
                                                    } else {
                                                        navigateResetParam(navigation, 'Availability', { email: email });
                                                    }
                            }
                            else{
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        }
                        }
                    }
                ]
            );
        }).catch((err: any) => {
            hideLoader();
           // console.log(err.data)
            setErrorMessage('');
            Alert.alert(err.data.message)
        })
    };

    return (
        <GradientBackground>
            <ActionBar title="" onBackPress={handleBackPress} />
            <View style={styles.container}>
                <Text style={styles.title}>{LANGUAGE_DATA.CREATE_PASSWORD.heading}</Text>
                <GradientText style={styles.gradientTitle}>{LANGUAGE_DATA.CREATE_PASSWORD.password}</GradientText>

                <Text style={styles.subtitle}>{LANGUAGE_DATA.CREATE_PASSWORD.title}</Text>

                <TextInputWithLabel
                    // label={"Password"}
                    placeholder={LANGUAGE_DATA.CREATE_PASSWORD.enterpassword}
                    value={password}
                    onTextChange={setPassword}
                    secureEntry={true}
                    
                    
                />

                <TextInputWithLabel
                    // label={"Confirm Password"}
                    placeholder={LANGUAGE_DATA.CREATE_PASSWORD.confirmpassword}
                    value={confirmPassword}
                    onTextChange={setConfirmPassword}
                    secureEntry={true}
                />

                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

                <GradientButton title={LANGUAGE_DATA.CREATE_PASSWORD.button} onPress={navigateToLogin} />

            </View>
        </GradientBackground>
    );
};

export default CreatePassword;