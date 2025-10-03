import React, { useEffect, useState } from 'react';
import styles from './styles'
import { View, Text, FlatList, TouchableOpacity, Alert,Image } from 'react-native';
import GradientBackground from '../../../Common/component/GradientBackground'; // Custom component
import GradientButton from '../../../Common/component/GradientButton'; // Custom component
import ActionBar from '../../../Common/component/ActionBar';
import Progressbar from '../../../Common/component/Progressbar';
import { useLoader } from '../../../Common/component/LoaderContext';
import { getdata } from '../../../Common/localdata';
import { ASYNC_STORAGES } from '../../../Common/Storage';
import Apicall from '../../../Common/Apicall';
import API_ENDPOINTS from '../../../Constants/apiEndpoints';
import CONST_UTILS from '../../../Constants/ConstUtils';
import { navigate, navigateResetParam } from '../../../Common/navigate';
import LANGUAGE_DATA from '../../../Constants/language';
import Icon from "react-native-vector-icons/MaterialIcons";
const DegreeList = ({ navigation, route }) => {
    const {candidateProfile} = route?.params || {}
    const [dataCandidateProfile] = useState(candidateProfile)
    
    const selectedDegree = candidateProfile?.length > 0 ? JSON.parse(candidateProfile[0]?.degree) : []
    const [degree, setDegree] = useState(selectedDegree);
    const { showLoader, hideLoader } = useLoader();
    const [errorMessage, setErrorMessage] = useState('');

    // Listen for updates when navigating back from DegreeForm
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const newDegree = navigation.getState().routes[navigation.getState().index].params?.newDegree;
            const degreeListIndex = navigation.getState().routes[navigation.getState().index].params?.degreeListIndex;
            console.log("degreeListIndex",degreeListIndex)
            if (newDegree && !degreeListIndex && degreeListIndex !== 0) {
                setDegree((prevDegree) => {
                    // Prevent duplicates by checking if the Degree already exists
                    if (!prevDegree.some(degree => degree.degreeName === newDegree.degreeName)) {
                        return [...prevDegree, newDegree];
                    }
                    return prevDegree;
                });
                setErrorMessage('');
            }

            if(degreeListIndex || degreeListIndex === 0){
                const degreeCopy = [...degree]
                degreeCopy[degreeListIndex] = newDegree
               
                setDegree(degreeCopy)
            }
        });

        return unsubscribe;
    }, [navigation]);

    const handleAddExperience = () => {
        navigation.navigate('DegreeForm');
    };

    const handleNext = async () => {
        if (!validateDegree()) {
            return;
        }
        
        showLoader();
        var data = await getdata(ASYNC_STORAGES.email)
        var param = {
            "email": data,
            "availabledate": [],
            "position": [],
            "sector": [],
            "location": [],
            "workmode": {},
            "selectedskill": [],
            "experience": [],
            "degree": degree,
            "stage": CONST_UTILS.SCREEN_DEGREE
        }

        Apicall.post(API_ENDPOINTS.CANDIDATE_CREATE_PROFILE, param, {}).then((res) => {
            hideLoader();

            dataCandidateProfile?.length > 0 ? navigateResetParam(navigation, 'PlaybackScreen', {candidateProfile: dataCandidateProfile, updating: true, videoUri: `https://smarttalent.augmentedresourcing.com/video/uploads${dataCandidateProfile[0]?.video}` }) : navigate(navigation, 'VideoCheckList');
           // console.log(res.data)
            
        }).catch((err) => {
            hideLoader();
           // console.log(err.data)
            Alert.alert(err.data.message)
        })
    };

    const validateDegree = () => {
        if (degree.length === 0) {
            //setErrorMessage('Please add at least one degree/diploma.');
            //return false;
        }
        setErrorMessage(''); // Clear error if validation passes
        return true;
    };

      const handleEditDegree = (item, index)=>{
           navigation.navigate('DegreeForm',{
            setDegree: item,
            degreeListIndex:index,
           });
        }

    const renderDegreeItem = ({ item, index }) => (
        <View style={styles.listView}>
            <View style={styles.viewStyle}><Text style={styles.labelStyle}>Name of Degree / Diploma</Text>{dataCandidateProfile && <TouchableOpacity onPress={()=>handleEditDegree(item, index)}><Icon name="edit" size={24} color="#fff" /></TouchableOpacity>}</View>
            <Text style={styles.inputStyle}>{item.degreeName}</Text>
        </View>
    );
    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <GradientBackground>
            <ActionBar title={LANGUAGE_DATA.DEGREE.degree} onBackPress={handleBackPress} />
            {/* <Progressbar progress={70} /> */}
            <Image source={require('../../../assets/png/degree.png')} style={{alignSelf:'center'}}/>

            <View style={styles.container}>
                <Text style={styles.subtitle}>{LANGUAGE_DATA.DEGREE.title}</Text>

                <TouchableOpacity style={styles.addBtn} onPress={handleAddExperience}>
                    <Text style={styles.BtnText}>{LANGUAGE_DATA.DEGREE.add}</Text>
                </TouchableOpacity>

                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

                <FlatList
                    data={degree}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderDegreeItem}
                />

                <View style={styles.nextButton}>
                    <GradientButton title={LANGUAGE_DATA.DEGREE.button2} onPress={handleNext} />
                </View>
            </View>
        </GradientBackground>
    );
};

export default DegreeList;