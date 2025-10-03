import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity, Image } from 'react-native';
import Video from 'react-native-video';
import Api from '../../../Common/Apicall'
import GradientBackground from '../../../Common/component/GradientBackground';
import GradientButton from '../../../Common/component/GradientButton';
import ActionBar from '../../../Common/component/ActionBar';
import Progressbar from '../../../Common/component/Progressbar';
import CONST_UTILS from '../../../Constants/ConstUtils';
import { useLoader } from '../../../Common/component/LoaderContext';
import API_ENDPOINTS from '../../../Constants/apiEndpoints';
import { navigate, navigateReset } from '../../../Common/navigate';
import { getdata } from '../../../Common/localdata';
import { ASYNC_STORAGES } from '../../../Common/Storage';
import LANGUAGE_DATA from '../../../Constants/language';

const PlaybackScreen = ({ navigation, route }) => {
  const { showLoader, hideLoader } = useLoader();
  const { videoUri,updating } = route.params;
  console.log('videoUri',route.params)
  const [role2, setrole2] = useState('');
  
  useEffect(() => {
    
    setrole()
   
  }, [])

  const setrole=async ()=>{
    var role = await getdata(ASYNC_STORAGES.role)
    setrole2(role?role:'')
  }
  

  const handleBackPress = () => {
    navigation.goBack();
  };

  const retryVideoRecording = () => {
    navigation.replace("RecordVideo");
  };

  const nextprocess = async () => {
    if(updating){
      var emailId = await getdata(ASYNC_STORAGES.email)
      const formdata = new FormData();
      formdata.append("email", emailId);
    formdata.append("stage", 'updated');
      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
      };
      fetch('https://smarttalent.augmentedresourcing.com/recuiter/SkipvideoRecording', requestOptions)
      .then((response) => {
        hideLoader();
        // if (!response.ok) {
        //   throw new Error('Network response was not ok');
        // }
        return response.text();
      })
      .then((result) => {
        hideLoader();
        console.log(result);
       navigateReset(navigation,'bottomTabNavigator');
      })
      .catch((error) => {
        hideLoader();
        console.error('Error:', error);
      });
      return
    }
    showLoader();

    console.log(videoUri)
    var emailId = await getdata(ASYNC_STORAGES.email)
    const formdata = new FormData();
    formdata.append("profileimage", {
      uri: videoUri,
      name: videoUri.split('/')[videoUri.split('/').length - 1],
      type: "video/mp4'"
      });
    formdata.append("email", emailId);
    formdata.append("stage", 'updated');

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };
    var role = await getdata(ASYNC_STORAGES.role)
    const url = role == 'recruiter'?'https://smarttalent.augmentedresourcing.com/recuiter/savevideo':'https://smarttalent.augmentedresourcing.com/candidate/savevideo'
console.log('video url ',JSON.stringify(formdata));

    fetch(url, requestOptions)
      .then((response) => {
        hideLoader();
        // if (!response.ok) {
        //   throw new Error('Network response was not ok');
        // }
        return response.text();
      })
      .then((result) => {
        hideLoader();
        console.log(result);
       navigateReset(navigation,'bottomTabNavigator');
      })
      .catch((error) => {
        hideLoader();
        console.error('Error:', error);
      });

    // fetch("https://smarttalent.augmentedresourcing.com/candidate/savevideo", requestOptions)
    //   .then((response) => response.text())
    //   .then((result) => console.log(result))
    //   .catch((error) => console.error(error));
  }

  return (
    <>
      <GradientBackground>
        <ActionBar title={LANGUAGE_DATA.VIDEO_PLAYBACK.video} onBackPress={handleBackPress} />
        <Image source={require('../../../assets/png/video.png')} style={{alignSelf:'center'}}/>

        <View style={styles.container}>
          <Text style={styles.subtitle}>{LANGUAGE_DATA.VIDEO_PLAYBACK.title}</Text>

          <View style={styles.videoContainer}>
            <Video
              source={{ uri: videoUri }}
              style={styles.video}
              controls={true}
              resizeMode="cover"
            />
          </View>

          <TouchableOpacity onPress={retryVideoRecording} >
            <Text style={styles.retry}>{LANGUAGE_DATA.VIDEO_PLAYBACK.retry}</Text>
          </TouchableOpacity>

          <View style={styles.Button}>
            {updating &&  <View style={{marginRight: 10}}><GradientButton title={LANGUAGE_DATA.VIDEO_PLAYBACK.recordNew} onPress={()=>navigateReset(navigation, 'VideoCheckList')} /></View>}
            <GradientButton title={role2=='recruiter'?LANGUAGE_DATA.VIDEO_PLAYBACK.recuiterbutton:LANGUAGE_DATA.VIDEO_PLAYBACK.button} onPress={nextprocess} />
          </View>
        </View>
      </GradientBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  videoContainer: {
    height: '65%',
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden', // Ensures the video respects the rounded corners
    width: '80%',
    alignSelf: 'center'
  },
  video: {
    flex: 1, // Ensures the video fills the container
  },
  subtitle: {
    marginVertical: 24,
    textAlign: 'left',
    color: 'white',
  },
  Button: {
    display: 'flex',
    flexDirection: 'row',
    position: "absolute", // Makes the button fixed to the bottom
    bottom: 20, // Space from the bottom
    alignSelf: "center", // Centers the button horizontally
  },
  retry: {
    marginTop: 24,
    textAlign: 'center',
    color: 'white',
    textDecorationLine: 'underline',
    fontSize: 16
  }
});

export default PlaybackScreen;