import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Image } from 'react-native';
import styles from './styles'
import { navigate, navigateParams } from '../../../Common/navigate';
import Api from '../../../Common/Apicall'
import GradientBackground from '../../../Common/component/GradientBackground';
import GradientButton from '../../../Common/component/GradientButton';
import ActionBar from '../../../Common/component/ActionBar';
import CustomDropdown from '../../../Common/component/CustomDropdown';
import Chips from '../../../Common/component/Chips';
import Progressbar from '../../../Common/component/Progressbar';
import { getdata } from '../../../Common/localdata';
import { ASYNC_STORAGES } from '../../../Common/Storage';
import { useLoader } from '../../../Common/component/LoaderContext';
import API_ENDPOINTS from '../../../Constants/apiEndpoints';
import CONST_UTILS from '../../../Constants/ConstUtils';
import LANGUAGE_DATA from '../../../Constants/language';

const Skills = ({ navigation, route }) => {
    const {candidateProfile} = route?.params || {}
    
    const selectedSkills = candidateProfile?.length > 0 && JSON.parse(candidateProfile[0]?.selectedskill) || []
    console.log('candidateProfile',selectedSkills)
    const [skillValue, setSkillValue] = useState<string[]>(selectedSkills);
    const [skillItems, setSkillItems] = useState([
        { label: 'Android Development', value: 'Android Development' },
        { label: 'React Native', value: 'React Native' },
        { label: 'iOS Development', value: 'iOS Development' },
        { label: 'Flutter', value: 'Flutter' },
        { label: 'Backend Development', value: 'Backend Development' },
        { label: 'Designer', value: 'Designer' },
        { label: 'Web Designer', value: 'Web Designer' },
        { label: 'UX / UI Designer', value: 'UX / UI Designer' },
        { label: 'Graphic Designer', value: 'Graphic Designer' }
    ]);
    const { showLoader, hideLoader } = useLoader();
    const [errorMessage, setErrorMessage] = useState('');
    const [skilldata, setskilldata] = useState([]);

    const handleRemoveChip = (value: string, type: string) => {
        if (type === 'skill') {
            setSkillValue((prev) => prev.filter((item) => item !== value));
        }
    };

    const handleSkillChange = (value: string[]) => {

        value.map((item,index)=>{
            // console.log('item map ',item);
            if(skilldata.some(e => e.value === item)){
                console.log('true');
            }else{
                skilldata.push({"label":item , "value": item})
            }
        })
        setskilldata(skilldata)
        setSkillValue(value);
        if (value.length > 0) setErrorMessage('');
    };

    const handleBackPress = () => {
        navigation.goBack();
    };


    const validateForm = () => {
        let valid = true;

        // Validate Skills
        if (skillValue.length === 0) {
            setErrorMessage('Please select at least one skill.');
            valid = false;
        } else {
            setErrorMessage('');
        }
        return valid;
    };

    useEffect(() => {
            callApi();
        },[])
        
    
        const callApi = () => {
            console.log('calling api');
            Api.get('selectionMaster/getMasterData?skills=true',{}).then((result)=>{
                // console.log('calling api response ',result.data.masters.jobSector);
                var data2 = []
            // console.log('res dash',typeof(result.matchedJobs))
            result.data.masters.skills.map((item:any, index:any) => {
                  data2.push({ label: item.speciality, value: item.speciality })
            })
            setskilldata(data2)
            })
        }

    const nextprocess = async () => {
        if (!validateForm()) {
            return;
        }

        showLoader()
        var data = await getdata(ASYNC_STORAGES.email)
        var param = {
            "email": data,
            // "email": "amits6383@gmail.com",
            "availabledate": [],
            "position": [],
            "sector": [],
            "location": [],
            "workmode": {},
            "selectedskill": skillValue,
            "experience": [],
            "degree": [],
            "stage": CONST_UTILS.SCREEN_SKILL
        }

        Api.post(API_ENDPOINTS.CANDIDATE_CREATE_PROFILE, param, {}).then((res) => {
            hideLoader();
           // console.log(res.data)
            navigateParams(navigation, 'ExperienceList', {
                email: data,
                comeFrom: 'ForgotPassword',
                candidateProfile: candidateProfile
            })
        }).catch((err: any) => {
            hideLoader();
            console.log(err.data)
            Alert.alert(err.data.message)
        })
        setErrorMessage('');
    }

    return (
        <>
            <GradientBackground>
                <ActionBar title={LANGUAGE_DATA.SKILL.skill} onBackPress={handleBackPress} />
                {/* <Progressbar progress={50} /> */}
                <Image source={require('../../../assets/png/skill.png')} style={{alignSelf:'center'}}/>

                <View style={styles.container}>

                    <Text style={styles.workMode}>{LANGUAGE_DATA.SKILL.title}</Text>

                    <CustomDropdown
                        items={skilldata}
                        // items={skillItems}
                        value={skillValue}
                        onChange={handleSkillChange}
                        placeholder={LANGUAGE_DATA.SKILL.slectskill}
                        style={{ marginVertical: 8 }} />

                    {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

                    {/* Conditionally render selected skills heading */}
                    {skillValue.length > 0 && (
                        <Text style={styles.selectedSkills}>{LANGUAGE_DATA.SKILL.selectedskill}</Text>
                    )}

                    <Chips
                        items={skilldata.filter((item) => skillValue.includes(item.value))}
                        onRemove={(value) => handleRemoveChip(value, 'skill')} />

                    <View style={styles.nextButton} >
                        <GradientButton title={LANGUAGE_DATA.SKILL.button} onPress={nextprocess} />
                    </View>
                </View>
            </GradientBackground>
        </>
    );
};

export default Skills;