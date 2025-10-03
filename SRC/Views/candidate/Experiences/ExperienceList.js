import React, { useEffect, useState } from 'react';
import styles from './styles'
import { View, Text, FlatList, TouchableOpacity, Alert ,Image} from 'react-native';
import GradientBackground from '../../../Common/component/GradientBackground';
import GradientButton from '../../../Common/component/GradientButton';
import ActionBar from '../../../Common/component/ActionBar';
import Progressbar from '../../../Common/component/Progressbar';
import { navigate, navigateParams } from '../../../Common/navigate';
import { useLoader } from '../../../Common/component/LoaderContext';
import { getdata } from '../../../Common/localdata';
import { ASYNC_STORAGES } from '../../../Common/Storage';
import Apicall from '../../../Common/Apicall';
import API_ENDPOINTS from '../../../Constants/apiEndpoints';
import CONST_UTILS from '../../../Constants/ConstUtils';
import LANGUAGE_DATA from '../../../Constants/language';
import Icon from "react-native-vector-icons/MaterialIcons";
const ExperienceList = ({ navigation, route }) => {
    const {candidateProfile} = route?.params || {}
    const [dataCandidateProfile] = useState(candidateProfile)
    const selectedExperience = candidateProfile?.length > 0 ? JSON.parse(candidateProfile[0]?.experience) : []
    const [experiences, setExperiences] = useState(selectedExperience);
    const { showLoader, hideLoader } = useLoader();
    const [errorMessage, setErrorMessage] = useState('');
    
    // Listen for updates when navigating back from Experiences
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const newExperience = navigation.getState().routes[navigation.getState().index].params?.newExperience;
            const expListIndex = navigation.getState().routes[navigation.getState().index].params?.expListIndex;
            console.log(expListIndex)
            if (newExperience && !expListIndex && expListIndex !== 0) {
                setExperiences((prevExperiences) => {
                    // Prevent duplicates by checking if the experience already exists
                    if (!prevExperiences.some(experience => experience.jobTitle === newExperience.jobTitle && experience.company === newExperience.company)) {
                        return [...prevExperiences, newExperience];
                    }
                    return prevExperiences;
                });
                setErrorMessage('');
            }
            if(expListIndex || expListIndex === 0){
                const expriencesCopy = [...experiences]
                console.log(expriencesCopy)
                expriencesCopy[expListIndex] = newExperience
               
                setExperiences(expriencesCopy)
            }
        });

        return unsubscribe;
    }, [navigation]);


    const handleAddExperience = () => {
        navigation.navigate('Experiences');
    };
    const handleEditExperience = (item, index)=>{
       navigation.navigate('Experiences',{
        setExp: item,
        expListIndex:index,
       });
    }

    const renderExperienceItem = ({ item, index }) => (
        <View style={styles.listView}>
            <View style={styles.viewStyle}><Text style={styles.labelStyle}>{item?.jobTitle}</Text>{dataCandidateProfile && <TouchableOpacity onPress={()=>handleEditExperience(item, index)}><Icon name="edit" size={24} color="#fff" /></TouchableOpacity>}</View>
            <Text style={styles.inputStyle}>{item?.company}</Text>
        </View>
    );
    const handleBackPress = () => {
        navigation.goBack();
    };

    const validateExperiences = () => {
        if (experiences.length === 0) {
           // setErrorMessage('Please add at least one experience.');
            //return false;
        }
        setErrorMessage(''); // Clear error if validation passes
        return true;
    };

    const nextprocess = async () => {
        if (!validateExperiences()) {
            return;
        }

        showLoader();
        var data = await getdata(ASYNC_STORAGES.email)
        var param = {
            "email": data,
            // "email": "amits6383@gmail.com",
            "availabledate": [],
            "position": [],
            "sector": [],
            "location": [],
            "workmode": {},
            "selectedskill": [],
            "experience": experiences,
            "degree": [],
            "stage": CONST_UTILS.SCREEN_EXPERIENCE
        }

        console.log('param',param)

        Apicall.post(API_ENDPOINTS.CANDIDATE_CREATE_PROFILE, param, {}).then((res) => {
            hideLoader();
           console.log('res.data',dataCandidateProfile)
           navigateParams(navigation, 'DegreeList', {
            candidateProfile: dataCandidateProfile
        })
        }).catch((err) => {
            hideLoader();
            //console.log(err.data)
            Alert.alert(err.data.message)
        })
        setErrorMessage('');
    }

    return (
        <GradientBackground>
            <ActionBar title={LANGUAGE_DATA.EXPERIENCE.experience} onBackPress={handleBackPress} />
            {/* <Progressbar progress={60} /> */}
            <Image source={require('../../../assets/png/exprience.png')} style={{alignSelf:'center'}}/>

            <View style={styles.container}>
                <Text style={styles.subtitle}>{LANGUAGE_DATA.EXPERIENCE.title}</Text>

                <TouchableOpacity style={styles.addBtn} onPress={handleAddExperience}>
                    <Text style={styles.BtnText}>{LANGUAGE_DATA.EXPERIENCE.add}</Text>
                </TouchableOpacity>

                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

                <FlatList
                    data={experiences}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderExperienceItem}
                />

                <View style={styles.nextButton}>
                    <GradientButton title={LANGUAGE_DATA.EXPERIENCE.button2} onPress={nextprocess} />
                </View>
            </View>
        </GradientBackground>
    );
};

export default ExperienceList;