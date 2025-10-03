import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ScrollView,KeyboardAvoidingView, Platform } from 'react-native';
import styles from './styles'
import { navigateParams } from '../../../Common/navigate';
import Api from '../../../Common/Apicall'
import GradientBackground from '../../../Common/component/GradientBackground';
import GradientButton from '../../../Common/component/GradientButton';
import ActionBar from '../../../Common/component/ActionBar';
import TextInputWithLabel from '../../../Common/component/TextInputWithLabel';
import CustomDropdown from '../../../Common/component/CustomDropdown';
import Chips from '../../../Common/component/Chips';
import { launchImageLibrary } from 'react-native-image-picker';
import { getdata } from '../../../Common/localdata';
import { ASYNC_STORAGES } from '../../../Common/Storage';
import API_ENDPOINTS from '../../../Constants/apiEndpoints';
import CONST_UTILS from '../../../Constants/ConstUtils';
import { useLoader } from '../../../Common/component/LoaderContext';
import LANGUAGE_DATA from '../../../Constants/language';

const AddCompanyDetails = ({ navigation, route }) => {
  const {recuiterProfile} = route?.params || {}

  const companyDetails = recuiterProfile?.companyDetails[0] || {companyVideoURl: '', companyName:'', companyDescription:'', companyWebsite : '',companyServiceType: "[]", compayEmployeeCount: []  }
  console.log("recuiterProfile", recuiterProfile)
  const videoData = companyDetails.companyVideoURl ? companyDetails.companyVideoURl.split('data:image/jpeg;base64,') : ['', '']
  const { showLoader, hideLoader } = useLoader();
  const [imageUri, setImageUri] = React.useState(videoData[1]);
  const [imageName, setImageName] = React.useState(LANGUAGE_DATA.ADD_COMPANY.logo);
  const [companyName, setCompanyName] = useState(companyDetails?.companyName);
  const [description, setDescription] = useState(companyDetails?.companyDescription);
  const [website, setWebsite] = useState(companyDetails?.companyWebsite);
  const [dropDownKey, setDropDownKey] = useState(0); 
  const [sectorValue, setSectorValue] = useState<string[]>(JSON.parse(companyDetails?.companyServiceType));

  const [companySize, setCompanySize] = useState<string[]>(companyDetails?.compayEmployeeCount);
  

  
  // Error states
  const [companyNameError, setCompanyNameError] = useState('');
  const [sectorError, setSectorError] = useState<string>('');
  const [companyError, setCompanyError] = useState<string>('');
  const [descriptionError, setDescriptionError] = useState('');
  const [websiteError, setWebsiteError] = useState('');
  const [sectordata, setsectordata] = useState([]);
  const [comsizedata, setcomsizedata] = useState([]);



  useEffect(() => {
          callApi();
      },[])
      
  
      const callApi = () => {
          console.log('calling api');
          Api.get('selectionMaster/getMasterData?reasonCity=true&jobType=true&companySize=true&salaryRang=true&jobSector=true&skills=true',{}).then((result)=>{
              console.log('calling api response ',result.data.masters.jobSector);
              var data2 = []
              var data3 = []
          console.log('res dash', result)
          // console.log('res dash',typeof(result.matchedJobs))
          result.data.masters.jobSector.map((item:any, index:any) => {
                data2.push({ label: item.subsectors, value: item.subsectors })
          })
          result.data.masters.companySize.map((item:any, index:any) => {
              data3.push({ label: item.companySize, value: item.companySize })
        })
          setsectordata(data2)
          setcomsizedata(data3)
          })
      }

  const handleBackPress = () => {
   if (navigation.canGoBack()) {
  navigation.goBack();
} else {
  // fallback behavior, like navigating to a default screen
  navigation.navigate('ChooseProfile');
}
  };

  const handleInputChange = (setter, setError, value) => {
    setter(value);
    if (value.trim()) {
      setError('');
    }
  };
  //let timeout:any= null

  const handleSectorChange = (value: string[]) => {
    
    value.map((item,index)=>{
      console.log('item map ',item);
      if(sectordata.some(e => e.value === item)){
          console.log('true');
      }else{
        sectordata.push({"label":item , "value": item})
        setDropDownKey(prev => prev + 1)
      }
      // timeout =  setTimeout(()=>{
      //   setDropDownKey(prev => prev + 1)
      // },1000)
      
  })
  setsectordata(sectordata)
    setSectorValue(value);
    if (value.length > 0) setSectorError('');
  };
  const handleCompanySize = (value: string[]) => {
    console.log('gtgtgtgt ',value);
    
    setCompanySize(value);
    if (value.length > 0) setCompanyError('');
  };

  const handleRemoveChip = (value: string, type: string) => {
    if (type === 'sector') {
      setSectorValue((prev) => prev.filter((item) => item !== value));
    }
  };

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
  includeBase64: true,       // Needed if you want to get base64 to setImageUri
  maxWidth: 300,             // Reduce width, adjust based on requirement
  maxHeight: 300,            // Reduce height
  quality: 0.5,        // Image quality (1 is the highest)
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        console.log('logo ',response.assets[0].fileSize);

        if(response.assets[0].fileSize<=1000000){
          const selectedImage = response.assets[0];
          setImageUri(selectedImage.base64);
          setImageName(selectedImage.fileName || 'Unknown');
        }else{
          setImageUri('');
          setImageName('');
          Alert.alert('Please Select 1mb size logo')
        }
        
        
      }
    });
  };


  const validateForm = () => {
    let isValid = true;

    if (!companyName.trim()) {
      setCompanyNameError('Company name is required');
      isValid = false;
    } else {
      setCompanyNameError('');
    }

    if (!description.trim()) {
      setDescriptionError('Description is required');
      isValid = false;
    } else {
      setDescriptionError('');
    }

    if (!website.trim()) {
      setWebsiteError('Website is required');
      isValid = false;
    } else {
      setWebsiteError('');
    }

    if (sectorValue.length === 0) {
      setSectorError('At least one sector must be selected');
      isValid = false;
    } else {
      setSectorError('');
    }

    if (companySize.length === 0) {
      setCompanyError('Company size is required');
      isValid = false;
    } else {
      setCompanyError('');
    }

    return isValid;
  };

  const nextprocess = async () => {
    if (!validateForm()) {
      return;
    }

    showLoader();

    var emailId = await getdata(ASYNC_STORAGES.email)
    const param = {
      email: emailId,
      companyinfo: {
        companyName: companyName,
        description: description,
        sectors: sectorValue,
        website: website,
        companySize: companySize,
        companyLogo:'data:image/jpeg;base64,'+imageUri,
      },
      jobdetail: {
        category: "",
        experience: "",
        location: "",
        salary: "",
        employmentType: [],
        requiredSkills: [],
        recommendedSkills: []
      },
      stage: CONST_UTILS.SCREEN_COMPANY_INFO
    };

    console.log('param',param)

    Api.post(API_ENDPOINTS.RECRUITER_CREATE_PROFILE, param, {}).then((res) => {
      hideLoader();
      console.log(res.data)
      navigateParams(navigation, 'CreateJobOffer', {recuiterProfile: recuiterProfile})
      // navigateParams(navigation, 'Skills', {
      //   email: data,
      // })
    }).catch((err: any) => {
      hideLoader();
      console.log(err.data)
      Alert.alert(err.data.message)
    })
  }

  return (
    <>
      <GradientBackground>
        <ActionBar title={LANGUAGE_DATA.ADD_COMPANY.recuiter} onBackPress={handleBackPress} />
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
  
        <View style={styles.container}>
        <ScrollView>

            {/* <Text style={styles.subtitle}>{LANGUAGE_DATA.ADD_COMPANY.title}</Text> */}

            <TextInputWithLabel
              label={LANGUAGE_DATA.ADD_COMPANY.companyname}
              placeholder={LANGUAGE_DATA.ADD_COMPANY.companyname}
              value={companyName}
              onTextChange={(value) => handleInputChange(setCompanyName, setCompanyNameError, value)}
            />
            {companyNameError ? <Text style={styles.searchError}>{companyNameError}</Text> : null}

            <TextInputWithLabel
              label={LANGUAGE_DATA.ADD_COMPANY.description}
              placeholder={LANGUAGE_DATA.ADD_COMPANY.description}
              value={description}
              onTextChange={(value) => handleInputChange(setDescription, setDescriptionError, value)}
              style={{ height: 120 }}
            />
            {descriptionError ? <Text style={styles.searchError}>{descriptionError}</Text> : null}

            <Text style={styles.workMode}>{LANGUAGE_DATA.ADD_COMPANY.selectsector}</Text>
            <CustomDropdown
            // multiple={false}
              items={sectordata}
              // items={sectorItems}
              value={sectorValue}
              onChange={handleSectorChange}
              placeholder={LANGUAGE_DATA.ADD_COMPANY.sector}
              style={{ marginVertical: 8 }} 
              dropDownKey={dropDownKey}
              />

            <Chips
              items={sectordata.filter((item) => sectorValue.includes(item.value))}
              onRemove={(value) => handleRemoveChip(value, 'sector')} />

            {sectorError ? <Text style={styles.searchError}>{sectorError}</Text> : null}


            <View style={{ flex: 1, flexDirection: 'row', marginVertical: 10 }}>
              <Text style={styles.selectedImage}>{imageName}</Text>

              <TouchableOpacity style={styles.BtnStyle}
                onPress={pickImage}
                activeOpacity={0.8}>
                <Text style={styles.BtnText}>{LANGUAGE_DATA.ADD_COMPANY.import}</Text>
              </TouchableOpacity>
            </View>

            <TextInputWithLabel
              label={LANGUAGE_DATA.ADD_COMPANY.website}
              placeholder={LANGUAGE_DATA.ADD_COMPANY.website}
              value={website}
              onTextChange={(value) => handleInputChange(setWebsite, setWebsiteError, value)}
            />
            {websiteError ? <Text style={styles.searchError}>{websiteError}</Text> : null}

            <Text style={styles.workMode}>{LANGUAGE_DATA.ADD_COMPANY.companysize}</Text>
            <CustomDropdown
              items={comsizedata}
              dropdownPosition={'top'}
              // items={companyItems}
              value={companySize}
              onChange={handleCompanySize}
              placeholder={LANGUAGE_DATA.ADD_COMPANY.companysize}
              style={{ marginVertical: 8 }}
              multiple={false} />
            {companyError ? <Text style={styles.searchError}>{companyError}</Text> : null}

          </ScrollView>

          <GradientButton title={LANGUAGE_DATA.ADD_COMPANY.button} onPress={nextprocess} />
        </View>
        </KeyboardAvoidingView>
      </GradientBackground>
    </>
  );
};

export default AddCompanyDetails;