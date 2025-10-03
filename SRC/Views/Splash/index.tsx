import React, { useEffect, useState } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import styles from './styles'
import { navigate, navigateParams, navigateReset, navigateResetParam } from '../../Common/navigate';
import GradientBackground from '../../Common/component/GradientBackground';
import { images } from '../../../assets/images';
import { deletedata, getdata, savedata } from '../../Common/localdata';
import { ASYNC_STORAGES } from '../../Common/Storage';
import API_ENDPOINTS from '../../Constants/apiEndpoints';
import Api from '../../Common/Apicall'
import { useLoader } from '../../Common/component/LoaderContext';
const SplashPage = ({ navigation }) => {
  const { showLoader, hideLoader } = useLoader();
  const [ apicall, setapicall ] = useState(true);
  useEffect(() => {
    setTimeout(async () => {
      // await deletedata()
      var data = await getdata(ASYNC_STORAGES.email)
      var role = await getdata(ASYNC_STORAGES.role)
      // console.log('local data :', data);
      // console.log('local data 1:', role);

     if(apicall){
      setapicall(false)
      if (data) {
        if (role == 'recruiter') {
          var param = {
            "email": data
          }
          Api.post(API_ENDPOINTS.RECRUITER_GET_PROFILE, param, {}).then((res) => {
            hideLoader();
            
            // console.log('recuiter data :', res.data.result[0].stage)
            if (res.data.result.length == 0) {
              navigateReset(navigation, 'AddCompanyDetails')
            } else if (res.data.result[0].stage == 'companyinfo') {
              navigateReset(navigation, 'CreateJobOffer')
            } else if (res.data.result[0].stage == 'jobdetail') {
              const jobOfferData = res.data?.allPostedJob[0]
              console.log("jobOfferData.jobVideoURl",jobOfferData.jobVideoURl)
            
               if(!jobOfferData.jobVideoURl || jobOfferData.jobVideoURl == 'NULL'){
                navigateReset(navigation, 'VideoCheckList')
              }
            else  navigateReset(navigation, 'bottomTabNavigator')
              // navigateReset(navigation, 'VideoCheckList')
              
            } else if (res.data.result[0].stage == 'updated') {
              navigateReset(navigation, 'bottomTabNavigator')
            }
          }).catch((err: any) => {
            hideLoader();
            console.log(err.data)
            Alert.alert(err.data.message)
          })
        } else if (role == 'applicant') {
          var param = {
            "email": data
          }
          Api.post(API_ENDPOINTS.CANDIDATE_GET_PROFILE, param, {}).then((res) => {
            hideLoader();
            // console.log('applicant data :', res.data.result[0].stage)
            if (res.data.result.length == 0) {
              navigateResetParam(navigation,'Availability', { email: data });
            } else if (res.data.result[0].stage == 'availability') {
              navigateResetParam(navigation, 'SearchInformation', { email: data })
            } else if (res.data.result[0].stage == 'search') {
              navigateResetParam(navigation, 'Skills', { email: data })
            } else if (res.data.result[0].stage == 'skill') {
              navigateResetParam(navigation, 'ExperienceList', { email: data, comeFrom: 'ForgotPassword' })
            } else if (res.data.result[0].stage == 'experience') {
              // navigateReset(navigation, 'DegreeList')
              navigateResetParam(navigation,'Availability', { email: data });
            } else if (res.data.result[0].stage == 'degree') {
              // navigateReset(navigation, 'VideoCheckList')
              navigateReset(navigation, 'bottomTabNavigator')
            } else if (res.data.result[0].stage == 'updated') {
              navigateReset(navigation, 'bottomTabNavigator')
            }
          }).catch((err: any) => {
            hideLoader();
            console.log(err.data)
            Alert.alert(err.data.message)
          })
        }
      } else {
        navigateReset(navigation, 'ChooseProfile')
      }
     }

     

    }, 1500);
  });



  return (
    <>
      <GradientBackground>
        <View style={styles.container}>
          <Image style={styles.logo} source={images.logo} />
          <Text style={styles.title}>SmartTalent</Text>
        </View>
      </GradientBackground>
    </>
  );
};

export default SplashPage;