import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Switch, TextInput,Image } from 'react-native';
import styles from './styles'
import { navigate } from '../../../Common/navigate';
import Api from '../../../Common/Apicall'
import GradientBackground from '../../../Common/component/GradientBackground';
import GradientButton from '../../../Common/component/GradientButton';
import ActionBar from '../../../Common/component/ActionBar';
import { colors } from '../../../Constants/colors';
import Progressbar from '../../../Common/component/Progressbar';
import TextInputWithLabel from '../../../Common/component/TextInputWithLabel';
import LANGUAGE_DATA from '../../../Constants/language';
import TextInputDatePickerWithLabel from '../../../Common/component/TextInputDatePickerWithLabel'
const DegreeForm = ({ navigation, route }) => {
    const {setDegree, degreeListIndex} = route?.params || {}
    console.log("degreeListIndex",degreeListIndex)
    const setdegree = setDegree?.degreeName || ''
    const setDesc = setDegree?.degreeDescription || ''
    const setSchoolCollege = setDegree?.schoolOrCollege || ''
    const locationOfferObject = {}
    const [degreeName, setDegreeName] = useState(setdegree);
    const [schoolOrCollege, setSchoolOrCollege] = useState(setSchoolCollege);
    const [degreeStartDate, setDegreeStartDate] = useState(setDegree? new Date(setDegree?.degreeStartDate) : new Date());
    const [degreeEndDate, setDegreeEndDate] = useState(setDegree ? new Date(setDegree?.degreeEndDate) : new Date());
    const [degreeDescription, setDegreeDescription] = useState(setDesc);
    const [isOnSiteEnabled, setIsOnSiteEnabled] = useState(setDegree?.currentlyLearning || false);
    const [errors, setErrors] = useState({ degreeName: '' });

    const validateFields = () => {
        let isValid = true;
        const newErrors = { degreeName: '',schoolname:'' };

        if (!degreeName.trim()) {
            newErrors.degreeName = 'Degree/Diploma name is required.';
            isValid = false;
        }
         if (!schoolOrCollege.trim()) {
            newErrors.schoolname = 'School/College name is required.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const toggleOnSiteSwitch = () => {
        setIsOnSiteEnabled((prevState) => !prevState);

        // If switch is turned on, clear the end date
        // if (!isOnSiteEnabled) {
        //     setDegreeEndDate('');
        // }
    };

    const handleSave = () => {
        if (validateFields()) {
            const newDegree = {
                degreeName,
                degreeStartDate,
                degreeEndDate,
                degreeDescription,
                schoolOrCollege,
                currentlyLearning:isOnSiteEnabled
            };
            // Pass new degree data back to the previous screen
            navigation.navigate('DegreeList', { newDegree, degreeListIndex:degreeListIndex });
        }
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const formatDate = (text) => {
        const cleanedText = text.replace(/[^0-9]/g, ''); // Allow only digits

        if (cleanedText.length > 2 && cleanedText.length <= 4) {
            return `${cleanedText.slice(0, 2)}/${cleanedText.slice(2)}`;
        } else if (cleanedText.length > 4) {
            return `${cleanedText.slice(0, 2)}/${cleanedText.slice(2, 4)}/${cleanedText.slice(4, 8)}`;
        }

        return cleanedText; // Return as is if length <= 2
    };

    const handleDateChange = (text, setter) => {
        const formattedText = formatDate(text);
        setter(formattedText.slice(0, 10)); // Limit to DD/MM/YYYY format

        // Automatically turn off the "currently studying" switch if the end date is entered
        if (setter === setDegreeEndDate && formattedText.trim() !== '') {
            setIsOnSiteEnabled(false);
        }
    };


    return (
        <>
            <GradientBackground>
                <ActionBar title={LANGUAGE_DATA.DEGREE.degree} onBackPress={handleBackPress} />
                {/* <Progressbar progress={70} /> */}
                <Image source={require('../../../assets/png/degree.png')} style={{alignSelf:'center'}}/>

                <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView style={{ flexGrow: 1 }}>
                        <Text style={styles.subtitle}>{LANGUAGE_DATA.DEGREE.title}</Text>

                        <TextInputWithLabel
                            // label="Degree / Diploma Name"
                            placeholder={LANGUAGE_DATA.DEGREE.degreename}
                            value={degreeName}
                            onTextChange={setDegreeName}
                        />
                        {errors.degreeName && <Text style={styles.leftError}>{errors.degreeName}</Text>}

                        <TextInputWithLabel
                            // label="School/College"
                            placeholder={LANGUAGE_DATA.DEGREE.schoolname}
                            value={schoolOrCollege}
                            onTextChange={setSchoolOrCollege}
                        />
                    {errors.schoolname && <Text style={styles.leftError}>{errors.schoolname}</Text>}
                         <TextInputDatePickerWithLabel 
                                                 placeholder={LANGUAGE_DATA.DEGREE.startdate}
                                                 value={degreeStartDate.toISOString().split('T')[0]}
                                                 setStartDate={setDegreeStartDate}
                                                 startDate={degreeStartDate}
                                                 />

                                                {!isOnSiteEnabled && <TextInputDatePickerWithLabel 
                                                 placeholder={LANGUAGE_DATA.DEGREE.enddate}
                                                 value={degreeEndDate.toISOString().split('T')[0]}
                                                 setStartDate={setDegreeEndDate}
                                                 startDate={degreeEndDate}
                                                 />}


                        {/* <TextInputWithLabel
                            // label="Start Date"
                            placeholder={LANGUAGE_DATA.DEGREE.startdate}
                            value={degreeStartDate}
                            onTextChange={(text) => handleDateChange(text, setDegreeStartDate)}
                            keyboardType="numeric"
                        />

                        <TextInputWithLabel
                            // label="End Date"
                            placeholder={LANGUAGE_DATA.DEGREE.enddate}
                            value={degreeEndDate}
                            onTextChange={(text) => handleDateChange(text, setDegreeEndDate)}
                            keyboardType="numeric"
                        /> */}

                        <View style={styles.switchContainer}>
                            <Switch
                                value={isOnSiteEnabled}
                                onValueChange={toggleOnSiteSwitch}
                                trackColor={{ false: 'grey', true: colors.buttonGradientEnd }}
                                thumbColor={'white'}
                            />
                            <Text style={styles.label}>{LANGUAGE_DATA.DEGREE.currently}</Text>
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder={LANGUAGE_DATA.DEGREE.startwriting}
                            value={degreeDescription}
                            onChangeText={setDegreeDescription}
                            placeholderTextColor="white"
                        />

                    </ScrollView>
                    <GradientButton title={setDegree ? LANGUAGE_DATA.EXPERIENCE.buttonEdit  : LANGUAGE_DATA.DEGREE.button} onPress={handleSave} />
                </KeyboardAvoidingView>
            </GradientBackground>
        </>
    );
};

export default DegreeForm;