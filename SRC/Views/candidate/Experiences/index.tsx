import React, { useState,useEffect } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Image,StyleSheet } from 'react-native';
import styles from './styles'
import GradientBackground from '../../../Common/component/GradientBackground';
import GradientButton from '../../../Common/component/GradientButton';
import ActionBar from '../../../Common/component/ActionBar';
import TextInputWithLabel from '../../../Common/component/TextInputWithLabel';
import LANGUAGE_DATA from '../../../Constants/language';
import TextInputDatePickerWithLabel from '../../../Common/component/TextInputDatePickerWithLabel';
import Api from '../../../Common/Apicall'
import { colors } from '../../../Constants/colors';
const Experiences = ({ navigation, route }) => {
    const {setExp, expListIndex} = route?.params || {}
    console.log(`${expListIndex}expListIndex`,setExp)
    const companyName = setExp?.company || ''
    const setDesc = setExp?.description || ''
    const setTitle = setExp?.jobTitle || ''
    const locationOfferObject = {}
    setExp?.location.forEach((d)=>{
        locationOfferObject[d] = true
    })
    const [jobTitle, setJobTitle] = useState(setTitle);
    const [location, setLocation] = useState<any>([]);
    const [company, setCompany] = useState(companyName);
    const [startDate, setStartDate] = useState(setExp ? new Date(setExp?.startDate) : new Date());
    const [endDate, setEndDate] = useState(setExp? new Date(setExp?.endDate) : new Date());
    const [description, setDescription] = useState(setDesc);
    const [modalVisible, setModalVisible] = useState(false);
    const [locationArray, setLocationArray] = useState(locationOfferObject);
    const [regionsCity, setRegionsCity] = useState({});
    const [errors, setErrors] = useState<Errors>({
        jobTitle: '',
        company: '',
        startDate: '',
        endDate: '',
        description: '',
    });

    const callApi = () => {
           // console.log('calling api');
            Api.get('selectionMaster/getMasterData?reasonCity=true',{}).then((result)=>{
              
            console.log('res dash', result)
            const regions:any =[]
                  result.data?.masters?.reasonCity.forEach((region_city:any)=>{
                    if(regions.indexOf(region_city.region) === -1){
                        regions.push(region_city.region)
                    }
                  })
                 
                  const finalRegionCity:any = {}
                  regions.forEach((reason:any)=>{
                    const tempCityArr:any = []
                    result.data?.masters?.reasonCity.forEach((region_city:any)=>{
                        if(region_city.region === reason){
                            tempCityArr.push(region_city.city)
                        }
                    })
                    finalRegionCity[reason] = tempCityArr
                  })
                  setRegionsCity(finalRegionCity)
            })
        }

         useEffect(() => {
                callApi();
            },[])

    // Validation function for all fields
    const validateFields = (selectedCities) => {
        let isValid = true;
        const newErrors = { jobTitle: '', company: '',location:'', startDate: '', endDate: '', description: '' };

        if (!jobTitle.trim()) {
            newErrors.jobTitle = 'Job title is required.';
            isValid = false;
        }

        if (!company.trim()) {
            newErrors.company = 'Company name is required.';
            isValid = false;
        }

        if (selectedCities.length === 0) {
            newErrors.location = 'location is required.';
            isValid = false;
        }

        // if (!startDate.trim()) {
        //     newErrors.startDate = 'Start date is required.';
        //     isValid = false;
        // }

        // if (!endDate.trim()) {
        //     newErrors.endDate = 'End date is required.';
        //     isValid = false;
        // }

        // if (!description.trim()) {
        //     newErrors.description = 'Description is required.';
        //     isValid = false;
        // }

        setErrors(newErrors); // Set error messages for all fields
        return isValid;
    };

    const handleSave = async() => {
        const selectedCities = Object.keys(locationArray).filter((key:any) => locationArray[key]);
        console.log('selectedCitiesselectedCitiesselectedCitiesselectedCities',selectedCities)
         setTimeout(()=>{
            console.log("ddsdsdsdsdsdsdsdsdds",location)
            if (validateFields(location)) {
                const newExperience = {
                    jobTitle,
                    location:location,
                    company,
                    startDate,
                    endDate,
                    description,
                };
                 console.log('newExperience',newExperience)
                // Pass new experience data back to the previous screen
                navigation.navigate('ExperienceList', { newExperience, expListIndex: expListIndex });
                // navigation.replace('ExperienceList', { newExperience });
            }
         },1000)
      
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
    };

    // Clear error message for a field when the user starts typing
    const handleTextChange = (field: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
        return (text: string) => {
            setter(text);
            setErrors(prevErrors => ({
                ...prevErrors,
                [field]: '', // Clear the error message for the specific field
            }));
        };
    };

    const renderSelectedLocation = ()=>{
       
        const selectedCities = Object.keys(locationArray).filter((key:any) => locationArray[key]);
        
        return selectedCities.length > 0 ? <View style={styles1.chipsContainer}>
              {selectedCities.map((item) => (
                <View key={item} style={styles1.chip}>
                  <Text style={styles1.chipText}>{item}</Text>
                 
                </View>
              ))}
            </View> : <View><Text  style={styles1.chipText}>{LANGUAGE_DATA.EXPERIENCE.location}</Text></View>
    }

    return (
        <>
            <GradientBackground>
                <ActionBar title={LANGUAGE_DATA.EXPERIENCE.experience} onBackPress={handleBackPress} />
                {/* <Progressbar progress={60} /> */}
                <Image source={require('../../../assets/png/exprience.png')} style={{alignSelf:'center'}}/>

                <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    <ScrollView style={{ flexGrow: 1 }}>
                        <Text style={styles.subtitle}>{LANGUAGE_DATA.EXPERIENCE.title}</Text>

                        <TextInputWithLabel
                            // label={"Job title"}
                            placeholder={LANGUAGE_DATA.EXPERIENCE.jobtitle}
                            value={jobTitle}
                            onTextChange={handleTextChange('jobTitle', setJobTitle)} />
                        {errors.jobTitle && <Text style={styles.leftError}>{errors.jobTitle}</Text>}

                        {/* <TextInputWithLabel
                            // label={"Location"}
                            placeholder={LANGUAGE_DATA.EXPERIENCE.location}
                            value={location}
                            onTextChange={handleTextChange('location', setLocation)} /> */}

                        <TextInputWithLabel
                            // label={"Company"}
                            placeholder={LANGUAGE_DATA.EXPERIENCE.category}
                            value={company}
                            onTextChange={handleTextChange('company', setCompany)} />
                        {errors.company && <Text style={styles.leftError}>{errors.company}</Text>}

                        <TextInputWithLabel
                            // label={"Company"}
                            placeholder={LANGUAGE_DATA.EXPERIENCE.location}
                            value={location}
                            onTextChange={(text)=>setLocation(text)} />
                        
                        {/* <TouchableOpacity onPress={() => {
                            setModalVisible(true)
                             setErrors(prevErrors => ({
                ...prevErrors,
                location: '', // Clear the error message for the specific field
            }));
                            }}>  
                        <View style={styles1.selectLocation}  > 
                        <Text style={styles1.labelStyle}>{LANGUAGE_DATA.EXPERIENCE.location}</Text>    
                        <StateCityModal visible={modalVisible} setLocationArray={setLocationArray} region_City={regionsCity} onClose={() => setModalVisible(false)} />
                            {renderSelectedLocation()}
                        </View>
                        </TouchableOpacity> */}
                         {errors.location && <Text style={styles.leftError}>{errors.location}</Text>}   

                        <TextInputDatePickerWithLabel 
                         placeholder={LANGUAGE_DATA.EXPERIENCE.startdate}
                         value={startDate.toISOString().split('T')[0]}
                         setStartDate={setStartDate}
                         startDate={startDate}
                         />
                    
                        {errors.startDate && <Text style={styles.leftError}>{errors.startDate}</Text>}

                        <TextInputDatePickerWithLabel 
                         placeholder={LANGUAGE_DATA.EXPERIENCE.enddate}
                         value={endDate.toISOString().split('T')[0]}
                         setStartDate={setEndDate}
                         startDate={endDate}
                         />
                    
                    {errors.endDate && <Text style={styles.leftError}>{errors.endDate}</Text>}
                        {/* <TextInputWithLabel
                            // label={"End date"}
                            placeholder={LANGUAGE_DATA.EXPERIENCE.enddate}
                            value={endDate}
                            onTextChange={(text) => handleDateChange(text, setEndDate)}
                            keyboardType="numeric" />
                        {errors.endDate && <Text style={styles.leftError}>{errors.endDate}</Text>} */}
                        <TextInputWithLabel
                            // label={"Description"}
                            placeholder={LANGUAGE_DATA.EXPERIENCE.descrition}
                            value={description}
                            onTextChange={handleTextChange('description', setDescription)} />
                        {errors.description && <Text style={styles.leftError}>{errors.description}</Text>}

                    </ScrollView>
                    <GradientButton title={setExp ? LANGUAGE_DATA.EXPERIENCE.buttonEdit : LANGUAGE_DATA.EXPERIENCE.button} onPress={handleSave} />
                </KeyboardAvoidingView>
            </GradientBackground>
        </>
    );
};

const styles1 = StyleSheet.create({
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  chipText: {
    color: 'white',
    fontSize: 12,
    marginRight: 5,
  },
  crossIcon: {
    marginLeft: 5,
  },
  closeImage: {
    width: 12,
    height: 12,
    tintColor: 'grey',
  },
  selectLocation:{
    marginTop: 20,
    marginBottom:20,
    minHeight: 60,
    backgroundColor: 'transparent',
    borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
  },
  labelStyle: {
    fontSize: 10,
    marginTop: 10,
    marginLeft: 5,
    color: '#757575',
}
});

export default Experiences;