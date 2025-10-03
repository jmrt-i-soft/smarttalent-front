import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView, Button, StyleSheet, TouchableOpacity } from 'react-native';
import styles from './styles'
import { navigateResetParam, navigateReset } from '../../../Common/navigate';
import Api from '../../../Common/Apicall'
import GradientBackground from '../../../Common/component/GradientBackground';
import GradientButton from '../../../Common/component/GradientButton';
import ActionBar from '../../../Common/component/ActionBar';
import TextInputWithLabel from '../../../Common/component/TextInputWithLabel';
import CustomDropdown from '../../../Common/component/CustomDropdown';
import Chips from '../../../Common/component/Chips';
import { useLoader } from '../../../Common/component/LoaderContext';
import CONST_UTILS from '../../../Constants/ConstUtils';
import API_ENDPOINTS from '../../../Constants/apiEndpoints';
import { getdata } from '../../../Common/localdata';
import { ASYNC_STORAGES } from '../../../Common/Storage';
import LANGUAGE_DATA from '../../../Constants/language';
import { savedata } from '../../../Common/localdata';
import StateCityModal from "../../../Common/Reason_State_Selection"
import { colors } from '../../../Constants/colors';
import DepartmentModal from '../../../Common/departmentModal';
import cityData from '../../../Constants/department_city.json';
const CreateJobOffer = ({ navigation, route }) => {
    const {recuiterProfile} = route?.params || {}
    const jobOfferData = recuiterProfile?.allPostedJob[0] || {
        "category":"",
        "companyEmail":"",
        "employmentType":"",
        "experience":"",
        "jobLocationAddress":null,
        "jobName":null,
        "jobVideoURl":null,
        "location":"",
        "recommendedSkills":"",
        "requiredSkills":[],
        "salary":"",
        "selectedDepartment":'[]',
        jobDescription:"{\"category\":\"\",\"experience\":\"\",\"location\":\"\",\"salary\":\"\",\"employmentType\":\"\",\"requiredSkills\":\"\",\"recommendedSkills\":[],\"language\":\"\",\"certificate\":\"\",\"skill\":[]}",
        id: -1
    }
    console.log("jobOfferData",jobOfferData)
    const locationOffer =  jobOfferData.location ? jobOfferData.location.split(',') : []
    const locationOfferObject = {}
    locationOffer.forEach((d)=>{
        locationOfferObject[d] = true
    })
    
    const jobDescriptionObject = jobOfferData.jobDescription && JSON.parse(jobOfferData.jobDescription)
   // console.log(jobDescriptionObject)
    const requiredSkillsArr = []
   !Array.isArray(jobOfferData?.requiredSkills) && jobOfferData?.requiredSkills && jobOfferData?.requiredSkills.split(',').forEach(d=>{
        requiredSkillsArr.push(d)
    })
    
    const [updating] =useState(jobOfferData.category ? true : false)
    const { showLoader, hideLoader } = useLoader();
    const [categoryName, setCategory] = useState(jobOfferData.category);
    const [location, setLocation] = useState([]);
    const [locationArray, setLocationArray] = useState(locationOfferObject);
    const [selectedDepatment, setSelectedDepatment] = useState(JSON.parse(jobOfferData.selectedDepartment));
    const [language, setlanguage] = useState(jobDescriptionObject.language);
    const [certificate, setcertificate] = useState(jobDescriptionObject.certificate);
    const [depError, setDepError] = useState('');
    const [position, setposition] = useState('');
    const [task, settasks] = useState('');
    const [skill, setskill] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [departmentModalVisible, setDepartmentModalVisible] =  useState(false)
    const [sectorValue, setSectorValue] = useState([]);
    const [skilldata, setskilldata] = useState([]);
    const [secSkilldata, setSecSkilldata] = useState([]);
    const [sectorItems, setSectorItems] = useState([
        { label: 'Designer', value: 'Designer' },
        { label: 'Web Designer', value: 'Web Designer' },
        { label: 'UX / UI Designer', value: 'UX / UI Designer' },
        { label: 'Graphic Design', value: 'Graphic Design' }
    ]);
    const [companySize, setCompanySize] = useState(jobOfferData.employmentType);
    const [companyItems, setCompanyItems] = useState([
        { label: 'CDD', value: 'CDD' },
        { label: 'CDI', value: 'CDI' },
        { label: 'etc', value: 'etc' },
    ]);
    const [experience, setExperience] = useState(jobOfferData.experience);
    const [experienceItems, setExperienceItems] = useState([
        { label: `0-1 ${LANGUAGE_DATA.exYear}`, value: `0-1 ${LANGUAGE_DATA.exYear}` },
        { label: `1-3 ${LANGUAGE_DATA.exYear}`, value: `1-3 ${LANGUAGE_DATA.exYear}` },
        { label: `3-5 ${LANGUAGE_DATA.exYear}`, value: `3-5 ${LANGUAGE_DATA.exYear}` },
        { label: `>5 ${LANGUAGE_DATA.exYear}`, value: `>5 ${LANGUAGE_DATA.exYear}` },
    ]);
    const [salary, setSalary] = useState(jobDescriptionObject.salary);
    const [regionsCity, setRegionsCity] = useState({});

    // Error states
    const [categoryError, setCategoryError] = useState('');
    const [sectorError, setSectorError] = useState('');
    const [locationError, setLocationError] = useState('');
    const [companyError, setCompanyError] = useState('');
    const [experienceError, setExperienceError] = useState('');
    const [salaryError, setSalaryError] = useState('');
    const [languageError, setlanguageError] = useState('');
    const [certificateError, setcertificateError] = useState('');
    const [positionError, setpositionError] = useState('');
    const [taskError, settaskError] = useState('');
    const [skillError, setskillError] = useState('');
    const [expdata, setexpdata] = useState([]);
    const [salarydata, setsalarydata] = useState([]);
    const [skillValue, setSkillValue] = useState(requiredSkillsArr);
    const [secondarySkillValue, setSecondarySkillValue] = useState(requiredSkillsArr);
    const [errorMessage, setErrorMessage] = useState('');
    const [departmentData, setDepartmentData] = useState([])
    let reasons = []
    let cities = []
    useEffect(() => {
              callApi();
          },[])
          
      
          const callApi = () => {
            // console.log('calling api');
              Api.get('selectionMaster/getMasterData?reasonCity=true&jobType=true&companySize=true&salaryRang=true&jobSector=true&skills=true',{}).then((result)=>{
                  //console.log('calling api response ',result.data.masters.jobType);
                  var data2 = []
                  var data3 = []
             // console.log('res dash', result)
              const tempJobType = []
              result.data.masters.jobType.forEach(d=>{
                tempJobType.push({label: d.jobType, value: d.jobType})
              })
              setCompanyItems(tempJobType)
               const regions =[]
              result.data?.masters?.reasonCity.forEach((region_city)=>{
                if(regions.indexOf(region_city.region) === -1){
                    regions.push(region_city.region)
                }
              })
             
              const finalRegionCity = {}
              regions.forEach((reason)=>{
                const tempCityArr = []
                result.data?.masters?.reasonCity.forEach((region_city)=>{
                    if(region_city.region === reason){
                        tempCityArr.push(region_city.city)
                    }
                })
                finalRegionCity[reason] = tempCityArr
              })
              console.log('finalRegionCity',finalRegionCity)
              
              result.data.masters.salaryRang.map((item, index) => {
                if(item.salaryRange!=null)
                  data3.push({ label: item.salaryRange, value: item.salaryRange })
            })
            //   setsectordata(data2)
            setsalarydata(data3)

            result.data.masters.skills.map((item, index) => {
                data2.push({ label: item.speciality, value: item.speciality })
          })
          setskilldata(data2)
          callDepatmentApi()
              })
          }

          const callDepatmentApi = () => {
            Api.get('selectionMaster/getDepartmentData',{}).then((result)=>{
                //console.log("result.......................",result.data.DepartmentMaster)
                if(result?.data?.DepartmentMaster)
                setDepartmentData(result?.data?.DepartmentMaster)
            })
          }


    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleInputChange = (setter, setError, value) => {
        setter(value);
        if (value.trim()) {
            setError('');
        }
    };
    
    const handleSkillChange = (value) => {

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

    const handleSecondarySkillChange = (value) => {

        value.map((item,index)=>{
            // console.log('item map ',item);
            if(secSkilldata.some(e => e.value === item)){
                console.log('true');
            }else{
                secSkilldata.push({"label":item , "value": item})
            }
        })
        setSecSkilldata(secSkilldata) 
        setSecondarySkillValue(value);
        if (value.length > 0) setErrorMessage('');
    };

    const handleSectorChange = (value) => {
        setSectorValue(value);
        if (value.length > 0) setSectorError('');
    };
    const handleCompanySize = (value) => {
        setCompanySize(value);
        if (value.length > 0) setCompanyError('');
    };
    const handleExperience = (value) => {
        setExperience(value);
        if (value.length > 0) setExperienceError('');
    };
    const handleSalary = (value) => {
        setSalary(value);
        if (value.length > 0) setSalaryError('');
    };

    const handleRemoveChip = (value, type) => {
        if (type === 'sector') {
            setSectorValue((prev) => prev.filter((item) => item !== value));
        }
    };

    const handleRemoveSkillChip = (value, type) => {
        if (type === 'skill') {
            setSkillValue((prev) => prev.filter((item) => item !== value));
        }
    };

    const handleRemovetypeDeContractChip = (value, type) => {
        if (type === 'jobType') {
            setCompanySize((prev) => prev.filter((item) => item !== value));
        }
    };

    const validateForm = () => {
        let isValid = true;

        // Validate each field
        if (!categoryName.trim()) {
            setCategoryError("Please enter a category name.")
            isValid = false;
        }
        const selectedCities = Object.keys(locationArray).filter((key) => locationArray[key]);
        if (selectedCities.length === 0) {
            setLocationError("Please Select a location.")
            isValid = false;
        }
        if (selectedDepatment.length === 0) {
            setDepError('Please select at least one Department.');
            isValid = false;
        } else {
            setDepError('');
        }
        if (experience.length === 0) {
            setExperienceError("Experience is required.");
            isValid = false;
        }
        if (salary.length === 0) {
            setSalaryError("Salary is required.");
            isValid = false;
        }
        if (companySize.length === 0) {
            setCompanyError("Employment type is required.");
            isValid = false;
        }
        // if (sectorValue.length === 0) {
        //     setSectorError("Required skills must be selected.");
        //     isValid = false;
        // }

        return isValid;
    };

    const nextprocess = async () => {
        console.log("selectedDepatment1",selectedDepatment)
        const copySelectedDepatment = [...selectedDepatment]
        const selectedCities = Object.keys(locationArray).filter((key) => locationArray[key]);
       if(skillValue.length === 0){
       await setskillError('Veuillez sélectionner la compétence requise.')
       }
        
        
        if (!validateForm()) {
            return;
        }
        console.log(location)
        showLoader();
      
        var emailId = await getdata(ASYNC_STORAGES.email)
        const param = {
            email: emailId,
            companyinfo: {
                companyName: "",
                description: "",
                sectors: [],
                logo: "",
                siren: "",
                website: "",
                companySize: ""
            },
            jobdetail: {
                category: categoryName,
                experience: experience,
                location: selectedCities.toString(),
                salary: salary,
                employmentType: companySize,
                requiredSkills: skillValue.toString(),
                recommendedSkills: secondarySkillValue.toString(),
                selectedDepatment:JSON.stringify(copySelectedDepatment),
                language:language,
                certificate:certificate,
                jobVideoURl: jobOfferData.jobVideoURl,
                // position:position,
                // task:task,
                skill:skillValue

            },
            stage: CONST_UTILS.SCREEN_JOB_OFFER, //'updated'//CONST_UTILS.SCREEN_JOB_OFFER
            id: jobOfferData.id,
        };

        console.log('job offer param ', param);
        

        Api.post(API_ENDPOINTS.RECRUITER_CREATE_PROFILE, param, {}).then((res) => {
            hideLoader();
            console.log(res.data)
            savedata(ASYNC_STORAGES.postedJob, JSON.stringify(res.data?.allPostedJob))
            updating ? navigateResetParam(navigation, 'PlaybackScreen', {recuiterProfile: recuiterProfile, updating: updating, videoUri: `https://smarttalent.augmentedresourcing.com/video/uploads${jobOfferData.jobVideoURl}` }) : navigateReset(navigation, 'VideoCheckList');
        }).catch((err) => {
            hideLoader();
            console.log(err.data)
            Alert.alert('kjnkjnkjn')
        })
}

    const renderSelectedLocation = ()=>{
        const selectedCities = Object.keys(locationArray).filter((key) => locationArray[key]);
        return selectedCities.length > 0 ? <View style={styles1.chipsContainer}>
              {selectedCities.map((item, idx) => {
                if(idx === 5){
                    return <View key={item} style={styles1.chip}><Text style={styles1.chipText}>{`${selectedCities.length - 5} more`}</Text></View>
                }
                if(idx > 5){
                    return null
                }
                
                return(
                <View key={item} style={styles1.chip}>
                  <Text style={styles1.chipText}>{item}</Text>
                 
                </View>
              )}
              )}
            </View> : <View><Text  style={styles1.chipText}>{LANGUAGE_DATA.ADD_JOB.location}</Text></View>
    }

    const renderSelectedDepartment = ()=>{
        return selectedDepatment && selectedDepatment.length > 0 ? <View style={styles1.chipsContainer}>
        {selectedDepatment.map((item, idx) => (
            <>
          {item.department && <View key={idx} style={styles1.chip}>
            <Text style={styles1.chipText}>{item.department}</Text>
           
          </View>}
          </>
        ))}
      </View> : <View><Text  style={styles1.chipText}>{LANGUAGE_DATA.ADD_JOB.department}</Text></View>
    }
    
 const filterLargeCityData = (cityData, selectedDepId, onFinish) => {
  const depIdSet = new Set(selectedDepId.map(Number));
  const result = [];
  let index = 0;
  const chunkSize = 100; // Adjust for performance

  function processChunk() {
    const end = Math.min(index + chunkSize, cityData.length);
    for (; index < end; index++) {
      const cData = cityData[index];
      if (depIdSet.has(parseInt(cData.depId))) {
        result.push(cData);
      }
    }

    if (index < cityData.length) {
      setTimeout(processChunk, 0); // Yield to UI thread
    } else {
      onFinish(result);
    }
  }

  processChunk();
};

    const getSelectedDepartment = ()=>{
    setLocationError('')
    if(!selectedDepatment || selectedDepatment.length === 0){
        Alert.alert("Veuillez d'abord sélectionner un département.");
        return;
    }
    showLoader();
    const selectedDepId = [];
    const selectedObj = {};
    
    selectedDepatment.forEach(d=>{
        selectedDepId.push(d.id);
        selectedObj[d.id] = d.department;
    });
     const departmentCity = {};
      filterLargeCityData(cityData, selectedDepId, filtered => {
  console.log(filtered);
   if (filtered?.length > 0) {
        
      filtered.forEach((d) => {
        const departmentName = selectedObj[d.depId] || `Dep-${d.depId}`; // fallback if no match
        if (!departmentCity[departmentName]) {
          departmentCity[departmentName] = [];
        }
        departmentCity[departmentName].push(d.city);
      });

      setRegionsCity(departmentCity);
       setTimeout(()=>{
        setModalVisible(true);
      },1000);
    } else {
      Alert.alert('No cities found for selected departments.');
    }
  hideLoader();
});
    //    const selectedCityData = [];
    //     cityData.forEach(cData=>{
    //     console.log(cData.depId,selectedDepId.includes(parseInt(cData.depId)))
    //  if(selectedDepId.includes(parseInt(cData.depId))){
    //    selectedCityData.push(cData);
    //  }
    // });
      
  
    }
    return (
        <>
            <GradientBackground>
                <ActionBar title={LANGUAGE_DATA.ADD_JOB.createjob} onBackPress={handleBackPress} />
                <View style={styles.container}>

                    <ScrollView>
                        <TextInputWithLabel
                            label={LANGUAGE_DATA.ADD_JOB.jobtitle}
                            placeholder={LANGUAGE_DATA.ADD_JOB.jobtitle}
                            value={categoryName}
                            onTextChange={(value) => handleInputChange(setCategory, setCategoryError, value)}
                        />
                        {categoryError ? <Text style={styles.error}>{categoryError}</Text> : null}

                        {/* <Text style={styles.workMode}>{LANGUAGE_DATA.ADD_JOB.selectexp}</Text> */}
                        <View style={{marginBottom:20,marginTop:10}}>
                        <CustomDropdown
                            items={experienceItems}
                            value={experience}
                            onChange={handleExperience}
                            placeholder={LANGUAGE_DATA.ADD_JOB.selectexp}
                            style={{ marginVertical: 8 }}
                            multiple={false} />
                        {experienceError ? <Text style={styles.error}>{companyError}</Text> : null}
                        </View>  
                        <TouchableOpacity onPress={() => {
                                setDepartmentModalVisible(true)
                                setDepError('')
                                }}>
                        <View style={styles1.selectLocation}  > 
                        <Text style={styles1.labelStyle}>{LANGUAGE_DATA.ADD_JOB.department}</Text>
                        <DepartmentModal visible={departmentModalVisible}
                         setSelectedDepatment={setSelectedDepatment}
                          departments={departmentData}
                          selectedDepatment={selectedDepatment}
                           onClose={() => setDepartmentModalVisible(false)} />
                        {renderSelectedDepartment()}
                        </View>
                        </TouchableOpacity>
                        <Text style={styles.error}>{depError}</Text>
                        <TouchableOpacity onPress={()=>getSelectedDepartment()}>  
                        <View style={styles1.selectLocation}  > 
                        <Text style={styles1.labelStyle}>{LANGUAGE_DATA.ADD_JOB.location}</Text>    
                        <StateCityModal visible={modalVisible} setLocationArray={setLocationArray} region_City={regionsCity} onClose={() => setModalVisible(false)} />
                            {renderSelectedLocation()}
                        </View>
                        </TouchableOpacity> 
                        {locationError ? <Text style={styles.error}>{locationError}</Text> : null}

                        <TextInputWithLabel
                            label={LANGUAGE_DATA.ADD_JOB.language}
                            placeholder={LANGUAGE_DATA.ADD_JOB.language}
                            value={language}
                            onTextChange={(value) => handleInputChange(setlanguage, setlanguageError, value)} />
                        {languageError ? <Text style={styles.error}>{languageError}</Text> : null}

                        <TextInputWithLabel
                            label={LANGUAGE_DATA.ADD_JOB.certificate}
                            placeholder={LANGUAGE_DATA.ADD_JOB.certificate}
                            value={certificate}
                            onTextChange={(value) => handleInputChange(setcertificate, setcertificateError, value)} />
                        {certificateError ? <Text style={styles.error}>{certificateError}</Text> : null}
                        <Text style={styles.workMode}>{LANGUAGE_DATA.ADD_JOB.salary}</Text>
                        <CustomDropdown
                            items={salarydata}
                            value={salary}
                            onChange={handleSalary}
                            placeholder={LANGUAGE_DATA.ADD_JOB.selectsalary}
                            style={{ marginVertical: 8 }}
                            multiple={false} />
                        {salaryError ? <Text style={styles.error}>{salaryError}</Text> : null}

                        <Text style={styles.workMode}>{LANGUAGE_DATA.ADD_JOB.emptype}</Text>
                        <CustomDropdown
                            items={companyItems}
                            value={companySize}
                            onChange={handleCompanySize}
                            placeholder={LANGUAGE_DATA.ADD_JOB.selectemptype}
                            style={{ marginVertical: 8 }}
                            multiple={true} />  
                            <Chips
                        items={companyItems.filter((item) => companySize.includes(item.value))}
                        onRemove={(value) => handleRemovetypeDeContractChip(value, 'jobType')} />
                        {companyError ? <Text style={styles.error}>{companyError}</Text> : null}

                        <Text style={styles.workMode}>{LANGUAGE_DATA.ADD_JOB.reqskill}</Text>
                        <CustomDropdown
                        items={skilldata}
                        // items={skillItems}
                        value={skillValue}
                        onChange={handleSkillChange}
                        placeholder={LANGUAGE_DATA.ADD_JOB.reqskill}
                        style={{ marginVertical: 8 }} />

                    {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
                        {skillError ? <Text style={styles.error}>{skillError}</Text> : null}
                        {skillValue.length > 0 && (
                        <Text style={styles.selectedSkills}>{LANGUAGE_DATA.ADD_JOB.reqskill}</Text>
                    )}

                    <Chips
                        items={skilldata.filter((item) => skillValue.includes(item.value))}
                        onRemove={(value) => handleRemoveSkillChip(value, 'skill')} />

                    <Text style={styles.workMode}>{LANGUAGE_DATA.ADD_JOB.secondarySkill}</Text>
                        <CustomDropdown
                        items={skilldata}
                        dropdownPosition={'top'}
                        // items={skillItems}
                        value={secondarySkillValue}
                        onChange={handleSecondarySkillChange}
                        placeholder={LANGUAGE_DATA.ADD_JOB.secondarySkill}
                        style={{ marginVertical: 8 }} />

                    {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
                        {skillError ? <Text style={styles.error}>{skillError}</Text> : null}
                        {secondarySkillValue.length > 0 && (
                        <Text style={styles.selectedSkills}>{LANGUAGE_DATA.ADD_JOB.secondarySkill}</Text>
                    )}

                    <Chips
                        items={skilldata.filter((item) => secondarySkillValue.includes(item.value))}
                        onRemove={(value) => handleRemoveSkillChip(value, 'skill')} />     
                      

                    </ScrollView>

                    <GradientButton title={LANGUAGE_DATA.ADD_JOB.button} onPress={nextprocess} />
                </View>
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
export default CreateJobOffer;