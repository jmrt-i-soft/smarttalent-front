import React, { useState ,useEffect} from 'react';
import { View, Text, Alert, ScrollView, Switch,
     Image, TouchableOpacity, StyleSheet,
     KeyboardAvoidingView,Platform,
     ActivityIndicator,InteractionManager
     } from 'react-native';
     import { Thread } from 'react-native-threads';
import styles from './styles';
import {  navigateParams } from '../../../Common/navigate';
import Api from '../../../Common/Apicall';
import GradientBackground from '../../../Common/component/GradientBackground';
import GradientButton from '../../../Common/component/GradientButton';
import ActionBar from '../../../Common/component/ActionBar';
import CustomDropdown from '../../../Common/component/CustomDropdown';
import Chips from '../../../Common/component/Chips';
import { colors } from '../../../Constants/colors';
import { getdata } from '../../../Common/localdata';
import { ASYNC_STORAGES } from '../../../Common/Storage';
import { useLoader } from '../../../Common/component/LoaderContext';
import API_ENDPOINTS from '../../../Constants/apiEndpoints';
import CONST_UTILS from '../../../Constants/ConstUtils';
import LANGUAGE_DATA from '../../../Constants/language';
import TextInputWithLabel from '../../../Common/component/TextInputWithLabel';
import StateCityModal from '../../../Common/Reason_State_Selection';
import DepartmentModal from '../../../Common/departmentModal';
import cityData from '../../../Constants/department_city.json';
 
import axios from "axios"
const SearchInformation = ({ navigation, route }) => {
    const {candidateProfile} = route?.params || {};
    const selectedPosition = candidateProfile?.length > 0 && candidateProfile[0]?.position.replaceAll('"','') || '';
    const selectedDepartments = candidateProfile?.length > 0 && candidateProfile[0]?.selectedDepartment && JSON.parse(candidateProfile[0].selectedDepartment) || []
   
    const locationOffer =  candidateProfile?.length > 0 && candidateProfile[0]?.location ? JSON.parse(candidateProfile[0]?.location) : [];
    const locationOfferObject = {};
    locationOffer.forEach((d)=>{
        locationOfferObject[d] = true;
    });
    console.log("locationOfferObject",locationOfferObject)
    const sectorArray = candidateProfile?.length > 0 && candidateProfile[0]?.sector ? JSON.parse(candidateProfile[0]?.sector) : [];
    const { showLoader, hideLoader } = useLoader();
    const [modalVisible, setModalVisible] = useState(false);
    const [posteValue, setPosteValue] = useState(selectedPosition);
    const [posteItems, setPosteItems] = useState([]);
    const [sectorValue, setSectorValue] = useState(sectorArray);
const [loading, setLoading] = useState(false);
    const [locationValue, setLocationValue] = useState([]);
    const workmodeObject = candidateProfile?.length > 0 && candidateProfile[0]?.workmode ?  JSON.parse(candidateProfile[0]?.workmode) : {
        isOnSiteEnabled: false,
        isPartialRemoteEnabled: false,
        isFullRemoteEnabled: false,
    };
    const [workModes, setWorkModes] = useState(workmodeObject);
    const setJobtitle = candidateProfile?.length > 0 && candidateProfile[0]?.jobtitle ?  candidateProfile[0]?.jobtitle : '';
    // Error states
    const [positionError, setPositionError] = useState('');
    const [sectorError, setSectorError] = useState('');
    const [jobtitleError, setjobtitleError] = useState('');
    const [locationError, setLocationError] = useState('');
    const [depError, setDepError] = useState('');
    const [selectedDepatment, setSelectedDepatment] = useState(selectedDepartments);
    const [workmodeError, setWorkmodeError] = useState('');
    const [jobTitle, setJobTitle] = useState(setJobtitle);
    const [sectordata, setsectordata] = useState([]);
    const [locationdata, setlocationdata] = useState([]);
     const [regionsCity, setRegionsCity] = useState({});
     const [selectedDept, setSelectedDept] = useState({});
    const [locationArray, setLocationArray] = useState(locationOfferObject);
    const [departmentData, setDepartmentData] = useState([]);
     const [departmentModalVisible, setDepartmentModalVisible] =  useState(false);
 const [dropDownKey, setDropDownKey] = useState(0);
    const handleRemoveChip = (value, type) => {
        if (type === 'Position') {
            setPosteValue((prev) => prev.filter((item) => item !== value));
        } else if (type === 'sector') {
            setSectorValue((prev) => prev.filter((item) => item !== value));
        } else if (type === 'location') {
            setLocationValue((prev) => prev.filter((item) => item !== value));
        }
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    useEffect(() => {
        callApi();
    },[]);

    const callApi = () => {
       // console.log('calling api');
        Api.get('selectionMaster/getMasterData?reasonCity=true&jobType=true&companySize=true&salaryRang=true&jobSector=true&skills=true',{}).then((result)=>{
           // console.log('calling api response ',result.data.masters.jobSector);
            var data2 = [];
            var data3 = [];
        console.log('res dash', result);

        const tempJobType = [];
        result.data.masters.jobType.forEach(d=>{
          tempJobType.push({label: d.jobType, value: d.jobType});
        })
        setPosteItems(tempJobType)
        // console.log('res dash',typeof(result.matchedJobs))
        result.data.masters.jobSector.map((item, index) => {
              data2.push({ label: item.subsectors, value: item.subsectors });
        })
        result.data.masters.reasonCity.map((item, index) => {
            data3.push({ label: item.city, value: item.city });
      })
        setsectordata(data2);
        setlocationdata(data3);

        const regions =[];
              result.data?.masters?.reasonCity.forEach((region_city)=>{
                if(regions.indexOf(region_city.region) === -1){
                    regions.push(region_city.region);
                }
              });
              const finalRegionCity = {};
              regions.forEach((reason)=>{
                const tempCityArr = [];
                result.data?.masters?.reasonCity.forEach((region_city)=>{
                    if(region_city.region === reason){
                        tempCityArr.push(region_city.city);
                    }
                })
                finalRegionCity[reason] = tempCityArr;
              })
             // setRegionsCity(finalRegionCity)
              callDepatmentApi();
        });
    };

      const callDepatmentApi = () => {
                Api.get('selectionMaster/getDepartmentData',{}).then((result)=>{
                    //console.log("result.......................",result.data.DepartmentMaster)
                    if(result?.data?.DepartmentMaster){
setDepartmentData(result?.data?.DepartmentMaster);
                    }
                });
              };

    const nextprocess = async () => {
        const copySelectedDepatment = [...selectedDepatment]
        console.log("selectedDepatment111",selectedDepatment)
        const selectedCities = Object.keys(locationArray).filter((key) => locationArray[key]);
        await setLocationValue(selectedCities);
        if (!validateForm(selectedCities)) {
            return;
        }

        showLoader();

        var data = await getdata(ASYNC_STORAGES.email);
        var param = {
            email: data,
            // "email": "amits6383@gmail.com",
            availabledate: [],
            position: posteValue,
            sector: sectorValue,
            location: selectedCities,
            selectedDepatment:JSON.stringify(copySelectedDepatment),
            workmode: workModes,
            jobtitle: jobTitle,
            selectedskill: [],
            experience: [],
            degree: [],
            stage: CONST_UTILS.SCREEN_SEARCH,
        }

        Api.post(API_ENDPOINTS.CANDIDATE_CREATE_PROFILE, param, {}).then((res) => {
            hideLoader();
           // console.log(res.data)
            navigateParams(navigation, 'Skills', {
                email: data,
                candidateProfile: candidateProfile,
            });
        }).catch((err) => {
            hideLoader();
           // console.log(err.data)
            Alert.alert(err.data.message);
        });
    };


    const handlePositionChange = (value) => {
        setPosteValue(value);
        if (value.length > 0) {setPositionError('');}
    };

    const handleSectorChange = (value) => {
        // console.log('filter value data :',value);
        // sectordata.filter((item) => sectorValue.includes(item.value))
        // var data = sectordata.filter((item) => value.includes(item.value))
        value.map((item,index)=>{
            // console.log('item map ',item);
            if(sectordata.some(e => e.value === item)){
                console.log('true');
            }else{
                sectordata.push({'label':item , 'value': item});
                setDropDownKey(prev => prev + 1);
            }
        });
        setsectordata(sectordata);
        setSectorValue(value);
        if (value.length > 0) {setSectorError('');}
    };

    const handleLocationChange = (value) => {
       // console.log('location check',value);

       value.map((item,index)=>{
        // console.log('item map ',item);
        if(locationdata.some(e => e.value === item)){
            console.log('true');
        }else{
            locationdata.push({"label":item , "value": item})
            setDropDownKey(prev => prev + 1)
        }
    })
    setlocationdata(locationdata)
        
        setLocationValue(value);
        if (value.length > 0) setLocationError('');
    };

    const handleWorkModeToggle = (key) => {
        setWorkModes((prev) => {
            const updatedModes = { ...prev, [key]: !prev[key] };

            // Clear error if at least one mode is selected
            if (Object.values(updatedModes).some((value) => value)) {
                setWorkmodeError('');
            }
            return updatedModes;
        });
    };

    const validateForm = (selectedCities) => {
        let valid = true;

        // Validate position
        if (posteValue.length === 0) {
            setPositionError('Please select at least one position.');
            valid = false;
        } else {
            setPositionError('');
        }

        // Validate sector
        if (sectorValue.length === 0) {
            setSectorError('Please select at least one sector.');
            valid = false;
        } else {
            setSectorError('');
        }
        if (selectedDepatment.length === 0) {
            setDepError('Please select at least one Department.');
            valid = false;
        } else {
            setDepError('');
        }
        if (selectedCities.length === 0 ) {
            setLocationError('Please select at least one location.');
            valid = false;
        } else {
            setLocationError('');
        }

        // Validate Work Mode
        if (!Object.values(workModes).some((value) => value)) {
            setWorkmodeError('Please select at least one work mode.');
            valid = false;
        } else {
            setWorkmodeError('');
        }

        if (jobTitle.trim() === '') {
            setjobtitleError('Please enter job title.');
            valid = false;
        } else {
            setjobtitleError('');
        }

        return valid;
    };
    const handleTextChange = (field, setter) => {
        return (text) => {
            setter(text);
            // setErrors(prevErrors => ({
            //     ...prevErrors,
            //     [field]: '', // Clear the error message for the specific field
            // }));
        };
    };

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

    const renderSelectedLocation = ()=>{
        console.log("locationArray",locationArray)
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
                  )})}
                </View> : <View><Text  style={styles1.chipText}>{LANGUAGE_DATA.SEARCH.location}</Text></View>
        };

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

   if (filtered?.length > 0) {
      filtered.forEach((d) => {
        const departmentName = selectedObj[d.depId] || `Dep-${d.depId}`; // fallback if no match
        if (!departmentCity[departmentName]) {
          departmentCity[departmentName] = [];
        }
        departmentCity[departmentName].push(d.city);
      });
  console.log('departmentCity...........',departmentCity);
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
                  
                <ActionBar title={LANGUAGE_DATA.SEARCH.search} onBackPress={handleBackPress} />
                {/* <Progressbar progress={40} /> */}
                <Image source={require('../../../assets/png/search.png')} style={{ alignSelf: 'center' }} />
<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
  keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0} // Adjust based on header height
>
                <ScrollView>
                    <View style={styles.container}>

                        {/* <Text style={styles.workMode}>Select Position</Text> */}
                        <CustomDropdown
                        multiple={false}
                            items={posteItems}
                            value={posteValue}
                            onChange={handlePositionChange}
                            placeholder={LANGUAGE_DATA.SEARCH.position}
                            style={{ marginVertical: 8 }} />

                        {positionError ? <Text style={styles.searchError}>{positionError}</Text> : null}

                        {/* <Chips
                            items={posteItems.filter((item) => posteValue.includes(item.value))}
                            onRemove={(value) => handleRemoveChip(value, 'Position')} /> */}

                        {/* <Text style={styles.workMode}>Select Sector</Text> */}
                        <CustomDropdown
                            items={sectordata}
                            // items={sectorItems}
                            value={sectorValue}
                            onChange={handleSectorChange}
                            placeholder={LANGUAGE_DATA.SEARCH.sector}
                            style={{ marginVertical: 8 }} 
                            dropDownKey={dropDownKey}/>

                        {sectorError ? <Text style={styles.searchError}>{sectorError}</Text> : null}

                        <Chips
                            items={sectordata.filter((item) => sectorValue.includes(item.value))}
                            onRemove={(value) => handleRemoveChip(value, 'sector')} />

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
<Text style={styles.searchError}>{depError}</Text>
<TouchableOpacity onPress={()=>getSelectedDepartment()}>  
                        <View style={styles1.selectLocation}  > 
                        <Text style={styles1.labelStyle}>{LANGUAGE_DATA.ADD_JOB.location}</Text>    
                        <StateCityModal visible={modalVisible} setLocationArray={setLocationArray} region_City={regionsCity} onClose={() => setModalVisible(false)} />
                            {renderSelectedLocation()}
                        </View>
                        </TouchableOpacity>    
                <Text style={styles.searchError}>{locationError}</Text>

                        <Text style={styles.workMode}>{LANGUAGE_DATA.SEARCH.mode}</Text>

                        <View style={styles.switchContainer}>
                            <Switch
                                value={workModes.isOnSiteEnabled}
                                onValueChange={() => handleWorkModeToggle('isOnSiteEnabled')}
                                trackColor={{ false: 'grey', true: colors.buttonGradientEnd }}
                                thumbColor={'white'}
                            />
                            <Text style={styles.label}>{LANGUAGE_DATA.SEARCH.onsite}</Text>
                            <Switch
                                value={workModes.isPartialRemoteEnabled}
                                onValueChange={() => handleWorkModeToggle('isPartialRemoteEnabled')}
                                trackColor={{ false: 'grey', true: colors.buttonGradientEnd }}
                                thumbColor={'white'}
                            />
                            <Text style={styles.label}>{LANGUAGE_DATA.SEARCH.partialremote}</Text>
                            <Switch
                                value={workModes.isFullRemoteEnabled}
                                onValueChange={() => handleWorkModeToggle('isFullRemoteEnabled')}
                                trackColor={{ false: 'grey', true: colors.buttonGradientEnd }}
                                thumbColor={'white'}
                            />
                            <Text style={styles.label}>{LANGUAGE_DATA.SEARCH.remote}</Text>

                            {workmodeError ? <Text style={styles.searchError}>{workmodeError}</Text> : null}
                        </View>

                        <View style={{ marginTop: 20 }}>
                            <TextInputWithLabel
                                label={LANGUAGE_DATA.EXPERIENCE.jobRecuitertitle}
                                placeholder={LANGUAGE_DATA.EXPERIENCE.jobRecuitertitle}
                                value={jobTitle}
                                onTextChange={handleTextChange('jobTitle', setJobTitle)} />

                            {jobtitleError ? <Text style={styles.searchError}>{jobtitleError}</Text> : null}
                        </View>

                    </View>
                </ScrollView>
</KeyboardAvoidingView>
                <View style={styles.nextButton} >
                    <GradientButton title={LANGUAGE_DATA.SEARCH.button} onPress={nextprocess} />
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

export default SearchInformation;