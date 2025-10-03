import React, { useEffect, useState } from 'react';
import styles from './styles'
import { View, Text, Alert, Image } from 'react-native';
import GradientBackground from '../../../Common/component/GradientBackground'; 
import GradientButton from '../../../Common/component/GradientButton';
import ActionBar from '../../../Common/component/ActionBar';
import Progressbar from '../../../Common/component/Progressbar';
import CheckboxItem from '../../../Common/component/CheckboxItem';
import LANGUAGE_DATA from '../../../Constants/language';
import { ASYNC_STORAGES } from '../../../Common/Storage';
import { getdata } from '../../../Common/localdata';
import {pickAndUploadVideo} from '../selectVideo'
const VideoCheckList = ({ navigation }) => {
    const [checkboxStates, setCheckboxStates] = React.useState({
        oneMinute: true,
        nameSurname: true,
        companyRole: true,
        activity: true,
        values: true,
    });

    const toggleCheckbox = (key) => {
        setCheckboxStates((prevState) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    const handleNext = () => {
          navigation.navigate('RecordVideo');
        // Alert.alert('Next Step', 'Work in progress...');
    };

    const handleBackPress = () => {
        navigation.goBack();
    };
    const [checkPointvideo, setCheckPointvideo] = useState('')
    const [checkPoint3, setCheckPoint3] = useState('')
    const [checkPointPoint4, setCheckPointPoint4] = useState('')
   const getData = async()=>{
     const role = await getdata(ASYNC_STORAGES.role)
     if(role === 'applicant'){
        setCheckPointvideo(LANGUAGE_DATA?.VIDEO_INSTRUCTION.video)
     }
     else{
        setCheckPointvideo(LANGUAGE_DATA?.VIDEO_INSTRUCTION.video1)
      
     }
   }
   const getPoint3 = async()=>{
    const role = await getdata(ASYNC_STORAGES.role)
     if(role === 'applicant'){
        setCheckPoint3(LANGUAGE_DATA?.VIDEO_INSTRUCTION?.point3)
     }
     else{
        setCheckPoint3(LANGUAGE_DATA?.VIDEO_INSTRUCTION?.point6)
     }
   }

   const getPoint4 = async()=>{
    const role = await getdata(ASYNC_STORAGES.role)
     if(role === 'applicant'){
        setCheckPointPoint4(LANGUAGE_DATA?.VIDEO_INSTRUCTION?.point4)
     }
     else{
        setCheckPointPoint4(LANGUAGE_DATA?.VIDEO_INSTRUCTION?.point7)
     }
   }

   useEffect(()=>{
    getData()
    getPoint3()
    getPoint4()
   },[])
    return (
        <>
            <GradientBackground>
                <ActionBar title={checkPointvideo} onBackPress={handleBackPress} />
                <Image source={require('../../../assets/png/video.png')} style={{alignSelf:'center'}}/>

                <View style={styles.container}>
                    <Text style={styles.subtitle}>{LANGUAGE_DATA.VIDEO_INSTRUCTION.title}</Text>

                    <View style={styles.checkboxContainer}>
                        <CheckboxItem
                            value={checkboxStates.oneMinute}
                            // onValueChange={() => toggleCheckbox("oneMinute")}
                            label={LANGUAGE_DATA.VIDEO_INSTRUCTION.point1}
                        />
                        <CheckboxItem
                            value={checkboxStates.nameSurname}
                            // onValueChange={() => toggleCheckbox("nameSurname")}
                            label={LANGUAGE_DATA.VIDEO_INSTRUCTION.point2}
                        />
                        <CheckboxItem
                            value={checkboxStates.companyRole}
                            // onValueChange={() => toggleCheckbox("companyRole")}
                            label={checkPoint3}
                        />
                        <CheckboxItem
                            value={checkboxStates.activity}
                            // onValueChange={() => toggleCheckbox("activity")}
                            label={checkPointPoint4}
                        />
                        <CheckboxItem
                            value={checkboxStates.values}
                            // onValueChange={() => toggleCheckbox("values")}
                            label={LANGUAGE_DATA.VIDEO_INSTRUCTION.point5}
                        />
                    </View>

                    <Text style={styles.footerText}>
                       {LANGUAGE_DATA.VIDEO_INSTRUCTION.title2}
                    </Text>

                    <View style={styles.startButton}>
                         <GradientButton title={LANGUAGE_DATA.VIDEO_INSTRUCTION.buttonUpload} onPress={()=>pickAndUploadVideo(navigation)} />
                        <GradientButton title={LANGUAGE_DATA.VIDEO_INSTRUCTION.button} onPress={handleNext} />
                    </View>
                </View>
            </GradientBackground>
        </>
    );
};

export default VideoCheckList;