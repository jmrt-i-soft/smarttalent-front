import React, { useState } from 'react';
import { View, Text, Alert, Image, ImageBackground } from 'react-native';
import styles from './styles'
import Api from '../../../Common/Apicall'
import GradientBackground from '../../../Common/component/GradientBackground';
import GradientButton from '../../../Common/component/GradientButton';
import ActionBar from '../../../Common/component/ActionBar';
import { useUser } from '../../../Common/Utils/UserProvider';
import { useLoader } from '../../../Common/component/LoaderContext';
import { images } from '../../../../assets/images';
import CalendarPicker, { ChangedDate } from 'react-native-calendar-picker';
import Progressbar from '../../../Common/component/Progressbar';
import { goBack, navigate, navigateParams } from '../../../Common/navigate';
import { getdata } from '../../../Common/localdata';
import { ASYNC_STORAGES } from '../../../Common/Storage';
import API_ENDPOINTS from '../../../Constants/apiEndpoints';
import CONST_UTILS from '../../../Constants/ConstUtils';
import LANGUAGE_DATA from '../../../Constants/language';

const frenchMonths = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const frenchWeekdays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];


const Availability = ({ navigation, route }) => {
    const {candidateProfile} = route?.params || {}
    const dateOfAvaiblity = candidateProfile?.length > 0 && JSON.parse(candidateProfile[0]?.availabledate)[0] || ""
    
    const { userRole } = useUser();
    const [email, setEmail] = useState('');
    const { showLoader, hideLoader } = useLoader();
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedAvai, setSelectedAvai] =  useState(dateOfAvaiblity)
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
    const onDateChange = (date: Date, type: ChangedDate) => {
       // console.log('date format :', date);
       // console.log('date type :', type);
        if (type == 'START_DATE') {
            setSelectedAvai(date)
            setSelectedStartDate(date);
        } else {
            setSelectedEndDate(date);
        }
    };

    const handleBackPress = () => {
         if (navigation.canGoBack()) {
  navigation.goBack();
} else {
  // fallback behavior, like navigating to a default screen
  navigation.navigate('ChooseProfile');
}
    };
    const nextprocess = async () => {
        if (!validateDates()) {
            return; // Exit if validation fails
        }
        showLoader();
        var data = await getdata(ASYNC_STORAGES.email)
        var param = {
            "email": data,
            // "email": "amits6383@gmail.com",
            "availabledate": [selectedStartDate],
            // "availabledate": [selectedStartDate, selectedEndDate],
            "position": [],
            "sector": [],
            "location": [],
            "workmode": {},
            "selectedskill": [],
            "experience": [],
            "degree": [],
            "stage": CONST_UTILS.SCREEN_AVAILABILITY
        }

        Api.post(API_ENDPOINTS.CANDIDATE_CREATE_PROFILE, param, {}).then((res) => {
            hideLoader();
           // console.log(res.data)
            navigateParams(navigation, 'SearchInformation', {
                email: email,
                candidateProfile: candidateProfile
            })
        }).catch((err: any) => {
            hideLoader();
            //console.log(err.data)
            Alert.alert(err.data.message)
        })
        setErrorMessage('');
    }

    const validateDates = () => {
        if (!selectedStartDate ) {
            setErrorMessage('sélectionner ma date de disponibilité');
            return false;
        }

        // if (selectedEndDate < selectedStartDate) {
        //     setErrorMessage('End date cannot be earlier than start date.');
        //     return false;
        // }

        setErrorMessage(''); // Clear any previous error message
        return true;
    };

    const isSameDay = (date1: Date, date2: Date) => {
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    };

    const getFormatedDate = ()=>{
        const date = new Date(selectedAvai);
        
        return date.toLocaleDateString();
            }

    return (
        <>
            <GradientBackground>
                <ActionBar title={LANGUAGE_DATA.AVAILABILITY.availability} onBackPress={handleBackPress} />
                {/* <Progressbar progress={30} /> */}
                <Image source={require('../../../assets/png/availabity.png')} style={{alignSelf:'center'}}/>

                <View style={styles.container}>
                    <Image style={styles.image} source={images.bgAvailability} />

                    {errorMessage ? (<Text style={styles.error}>{errorMessage}</Text>) : null}

                    <View style={styles.calendarContainer}>
                        <ImageBackground
                            source={images.bgBlur} // Your background image
                            style={styles.blurBg}
                            imageStyle={styles.blurBgImage} >
                        {dateOfAvaiblity && <Text style={{color:'#fff'}}>{`Selected Date: ${getFormatedDate()}`}</Text> }
                            <CalendarPicker
                                onDateChange={(date, type) => { onDateChange(date, type) }}
                                previousTitle="<"
                                nextTitle=">"
                                // todayBackgroundColor="#FF4081"
                                selectedDayColor="#FF4081"
                                selectedDayTextColor="#FFFFFF"
                                textStyle={{ color: '#FFFFFF' }}
                                monthTitleStyle={styles.monthTitle}
                                yearTitleStyle={styles.yearTitle}
                                headerWrapperStyle={styles.calendarHeader}
                                months={frenchMonths}
                                weekdays={frenchWeekdays}
                                // allowRangeSelection={true}
                                // allowBackwardRangeSelect={true}
                            />

                            <View style={styles.buttonContainer}>
                                <GradientButton title={LANGUAGE_DATA.AVAILABILITY.button} onPress={nextprocess} />
                            </View>

                        </ImageBackground>
                    </View>

                </View>
            </GradientBackground>
        </>
    );
};

export default Availability;