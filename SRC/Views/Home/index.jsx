import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
  Share
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import Video from "react-native-video";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Swiper } from 'rn-swiper-list';
import Slider from "@react-native-community/slider";
import Loader from '../../Common/component/Loader';
import Api from '../../Common/Apicall'
import { getdata } from '../../Common/localdata';
import { ASYNC_STORAGES } from '../../Common/Storage';
import { navigateParams } from '../../Common/navigate';

import { useIsFocused } from '@react-navigation/native';
import LANGUAGE_DATA from '../../Constants/language';
import LinearGradient from 'react-native-linear-gradient';
const { width, height } = Dimensions.get("window");

const ICON_SIZE = 24;
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
const MatchBadge = (match) => {
  return (
    <View style={styles.outerContainer}>
    <LinearGradient
      colors={['#FF7E00', '#E4007C']} // Orange to Pink gradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.containerScore}
    >
      <Text style={styles.textScore}>{`${match} Match`}</Text>
    </LinearGradient>
    </View>
  );
};
const HOME = ({ navigation, route }) => {
  console.log(route)
  const { id } = route?.params || {};
  console.log(id)
  const [currentCard, setCurrentCard] = useState(0);
  const ref = useRef();
  const videoRefs = React.useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentIndex2, setCurrentIndex2] = useState(0);
  const [recuiter_applicant, setRecuiter_applicant] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // For play/pause
  const [showswiper, setshowswiper] = useState(false); // For play/pause
  const [currentTime, setCurrentTime] = useState(0); // Current playback position
  const [videoDuration, setVideoDuration] = useState(0); // Total video duration
    const [loading, setLoading] = useState(false);
  const [videodata, setvideodata] = useState([]);
  const [roledata, setroledata] = useState('');
  const [notificationData, setNotificationData] = useState(id);
  const [apiCalled, setApiCalled] = useState(false)
  var role;
  useEffect(() => {
 nextprocess();
   
  }, []);
  useEffect(() => {
    if(apiCalled){

      focusOnSelectedProfile();
    }
  }, [apiCalled]);

  const focusOnSelectedProfile = ()=>{
    let videodataCopy = [...videodata]
    
    if(notificationData && roledata === 'recruiter'){
      // console.log('12..............................121221212',roledata,notificationData);
      // videodataCopy.forEach((data)=>console.log('323232323',data?.candidateData?.id));
        const selected = videodataCopy.find(data => data?.candidateData?.id == notificationData);
        if (selected) {
         // Filter out the selected item and put it at the beginning
         videodataCopy = [selected, ...videodataCopy.filter(data => data.candidateData.id !== notificationData)];
       }
        setvideodata(videodataCopy)
       }
       else if(notificationData){
        const selected = videodataCopy.find(data => data?.JobDetail?.id == notificationData);
       // Alert.alert(selected);
        if (selected) {
         // Filter out the selected item and put it at the beginning
         videodataCopy = [selected, ...videodataCopy.filter(data => data.JobDetail.id !== notificationData)];
       }
        setvideodata(videodataCopy)
       }
       else {
        setvideodata(videodataCopy)
       }
  }

useEffect(() => {
    // Foreground
    // const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
    //   console.log('Notification in foreground:', remoteMessage);
    // });

    // Background / Quit
   const unsubscribeOnMessage = messaging().onNotificationOpenedApp(remoteMessage => {
       if (remoteMessage) {
          console.log('Opened from quit state:', remoteMessage);
          const {data} = remoteMessage;
         
         // Alert.alert('id'+notificationData);
          if(data && Object.keys(data).length > 0){
            // Alert.alert('id'+data.id);
 setNotificationData(data.id);
           //Alert.alert('id'+JSON.stringify(data));
          }
         
         
        }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Opened from quit state:', remoteMessage);
          const {data} = remoteMessage;
         
         // Alert.alert('id'+notificationData);
          if(data && Object.keys(data).length > 0){
 setNotificationData(data.id);
           //Alert.alert('id'+JSON.stringify(data));
          }
         
         
        }
      });

    return unsubscribeOnMessage;
  }, []);


  const nextprocess = async () => {

    try{
      setLoading(true);
    var emailId = await getdata(ASYNC_STORAGES.email)
    if(!emailId){
      navigation.replace('Login');
      setLoading(false);
    }
    console.log('ididididdddiidi1212121212ididi',id);
    role = await getdata(ASYNC_STORAGES.role);
    setroledata(role);
    var url = '';
    var raw;
    // console.log('param dashboard 1: ', emailId)
   console.log('param dashboard 1: ', role);
    if (role === 'recruiter') {
    var jobPosted = await getdata(ASYNC_STORAGES.postedJob);
    console.log('jobPosted........',jobPosted);
      raw = {'recuiterEmail': emailId,'jobId': JSON.parse(jobPosted)[0].id};
      console.log('...........................',raw);
    //  http://192.168.1.14:3000
      url = 'https://smarttalent.augmentedresourcing.com/cvConverter/compare_RecuiterProfile_with_CandidateProfile'
    } else {
      raw = {
        'candidateEmail': emailId,
      };
      url = 'https://smarttalent.augmentedresourcing.com/cvConverter/compare_candiateProfile_with_JobProfile'
    }



    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");



    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(raw),
      redirect: "follow"
    };
   // console.log('requestOptions dash', requestOptions)
    //console.log('url dash', url)

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setLoading(false);
        var resultdata = []
        result?.matchedJobs?.map((item, index) => {
          if (role == 'recruiter') {
            if (item.candidateData.video) {
              resultdata.push(item)
            }
          } else {
            if (item.JobDetail.jobVideoURl) {
              resultdata.push(item)
            }
          }

        })
      // console.log('dsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsds', resultdata )
      // console.log('dsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsds...........................................' )
    //Alert.alert('id'+notificationData);
      if(notificationData && role === 'recruiter'){
       
        console.log('dsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsds...........................................',id )
        const selected = resultdata.find(data => data?.candidateData?.id == notificationData);
        if (selected) {
         // Filter out the selected item and put it at the beginning
         resultdata = [selected, ...resultdata.filter(data => data.candidateData.id !== notificationData)];
       }
        setvideodata(resultdata)
       }
       else if(notificationData){
        const selected = resultdata.find(data => data?.JobDetail?.id == notificationData);
       // Alert.alert(selected);
        if (selected) {
         // Filter out the selected item and put it at the beginning
         resultdata = [selected, ...resultdata.filter(data => data.JobDetail.id !== notificationData)];
       }
        setvideodata(resultdata)
       }
       else {
        setvideodata(resultdata)
       }
      
        setshowswiper(true)
       setApiCalled(true)
      })
      .catch((error) => {
        setLoading(false);
        console.error('err dash', error)
      });
    }
    catch(e){
      setLoading(false);
      
    }
  };



  const OverlayLabelRight = useCallback(() => {
   // console.log('.............', 'OverlayLabelRight')
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: 'red',
          },
        ]}
      />
    );
  }, []);
  const OverlayLabelLeft = useCallback(() => {
  //  console.log('.............', 'OverlayLabelLeft')
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: 'green',
          },
        ]}
      />
    );
  }, []);
  const OverlayLabelTop = useCallback(() => {
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: 'blue',
          },
        ]}
      />
    );
  }, []);
  const OverlayLabelBottom = useCallback(() => {
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: 'orange',
          },
        ]}
      />
    );
  }, []);

  const togglePlayPause = () => {
    // const videoRef = videoRefs.current[index];
    const videoRef = videoRefs.current;
   // console.log('.......', videoRef)
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.resume();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(()=>{
   
    return ()=> {
      const videoRef = videoRefs.current;
      if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.pause();
      }
      setIsPlaying(!isPlaying);
    }}
  },[])
 const isFocused = useIsFocused();
  useEffect(()=>{
   
 if(!isFocused){
      const videoRef = videoRefs.current;
      if (videoRef) {
      
        videoRef.pause();
    
      setIsPlaying(!isPlaying);
    }}
    if(isFocused){
      const videoRef = videoRefs.current;
      if (videoRef) {
      
        videoRef.resume();
    
      setIsPlaying(!isPlaying);
    }}
  },[isFocused])

  const handleSeek = (value) => {
    console.log(value)
    const videoRef = videoRefs.current;
    console.log(videoRef)
    if (videoRef) {
      videoRef.seek(value);
      setCurrentTime(value);
    }
  };

  const handleProgress = ({ currentTime }) => {
    setCurrentTime(currentTime);
  };

  const handleLoad = ({ duration }) => {
    setVideoDuration(duration);
  };
  const share = async (currentIndex) => {
    let masg = roledata === 'recruiter' ? 'Check this Candidate' : 'Check this Job Post'
    try {
      const result = await Share.share({
        message:
          `${masg}. https://smarttalent.augmentedresourcing.com/user/${recuiter_applicant}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const callApi = async (data,selection_status) => {
var jobPosted = await getdata(ASYNC_STORAGES.postedJob);
   const role = await getdata(ASYNC_STORAGES.role)
   console.log('calling api data1 ',data);
   console.log('calling api typeq ',role);
  

    var param;
    var emailId = await getdata(ASYNC_STORAGES.email)

    if(role=='recruiter'){
       param = {
        "recruiterEmail": emailId,
        "candidateEmail": data.candidateData.email, 
        "totalScore": data.total_score, 
        "indivisualScore": data.individual_scores.Competences,
        "selection_status":selection_status,
        "jobId":JSON.parse(jobPosted)[0].id,
        "role": 'recruiter',
        "shareId":recuiter_applicant,
      }
    }else{
      param = {
        "recruiterEmail": data.JobDetail.companyEmail,
        "candidateEmail": emailId, 
        "totalScore": data.total_score, 
        "indivisualScore": data.individual_scores.Task_de_ProfessionalExperience,
        "selection_status":selection_status,
        "jobId":data.JobDetail.id,
        "role": 'candidate',
        "shareId":recuiter_applicant,
      }
    }
    console.log('calling api data saveMatchedDetails',data);
    
    console.log('calling api param saveMatchedDetails',param);
    Api.post('match/saveMatchedDetails', param,{}).then((result) => {
    //  console.log('calling api saveMatchedDetails ', result.data);
      // var data2 = []
      // var data3 = []
     // console.log('res dash', result)
      // console.log('res dash',typeof(result.matchedJobs))
      // result.data.masters.salaryRang.map((item: any, index: any) => {
      //   if (item.salaryRange != null)
      //     data3.push({ label: item.salaryRange, value: item.salaryRange })
      // })
      // //   setsectordata(data2)
      // setsalarydata(data3)
    })
  }

  const Avatar = ( name, size = 50 ) => {
    console.log('name',name)
    // Function to generate initials
    const getInitials = (name) => {
      if (!name) return "";
      const words = name;
      return words.length > 1
        ? `${words[0][0]}${words[1][0]}`
        : `${words[0][0]}`.toUpperCase();
    };
  
    return (
      <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={[styles.text, { fontSize: size / 2.5 }]}>{getInitials(name)}</Text>
      </View>
    );
  };
  

  return (
     <>
     <Loader visible={loading} />
    <GestureHandlerRootView style={styles.container}>
      
      <View style={styles.subContainer}>
       
        {showswiper && <Swiper
           direction="horizontal"
           disableTopSwipe={true}
           disableBottomSwipe={true}
           translateYRange={0} // prevents vertical dragging altogether
           swipeBackCard={false} 
          ref={ref}
          cardStyle={styles.cardStyle}
          data={videodata}
          // data={videos}
          renderCard={(card,index) => {
            console.log('card', card)
              if(currentCard !== index) return
            if (!card) return null;
            return (
              <View style={styles.videoContainer}>
                <Video
                  ref={(ref) => (videoRefs.current = ref)}
                  source={{ uri: roledata === 'recruiter' ? 'https://smarttalent.augmentedresourcing.com/video/uploads' + card.candidateData.video : 'https://smarttalent.augmentedresourcing.com/video/uploads' + card.JobDetail.jobVideoURl }}

                  style={styles.video}
                  resizeMode="cover"
                  repeat
                  onProgress={handleProgress} // Tracks current time
                  onLoad={handleLoad} // Fetch total duration
                  paused={currentCard!==index}
                  player="exoPlayer"
                />
                
              </View>
            );
          }}
          onIndexChange={(index) => {
            console.log('Current Active index', index);
            setCurrentIndex2(index)
          //  console.log(`videodata[index]${roledata}`,videodata[index]?.candidateData.id)
            setRecuiter_applicant(roledata === 'recruiter' ? videodata[index]?.candidateData.id : videodata[index]?.JobDetail.id )
          }}
          onSwipeRight={(cardIndex) => {
            setCurrentCard(cardIndex + 1);
            console.log('cardIndex right', cardIndex);
            setCurrentIndex(cardIndex + 1)
            callApi(videodata[currentIndex2],1)
          }}
          onSwipeLeft={(cardIndex) => {
            setCurrentCard(cardIndex + 1);
           // console.log('onSwipeLeft left', cardIndex);
            setCurrentIndex(cardIndex + 1)
            callApi(videodata[currentIndex2],2)
          }}
          OverlayLabelRight={OverlayLabelLeft}
          OverlayLabelLeft={OverlayLabelRight}
          OverlayLabelTop={OverlayLabelTop}
          OverlayLabelBottom={OverlayLabelBottom}
          onSwipeActive={() => {
            console.log('onSwipeActive');
          }}
          onSwipeStart={() => {
            console.log('onSwipeStart');
          }}
          onSwipeEnd={() => {
            console.log('onSwipeEnd');
          }}
          loop={true}
          // disableBottomSwipe ={true}
        />}
      </View>
      {(currentIndex2 > (videodata.length - 1)) && <View style={{ position: 'absolute', bottom: '50%' }}>
        <Text style={{ color: 'red' }}>{roledata === 'recruiter' ? LANGUAGE_DATA.noListMasgRecuiter : LANGUAGE_DATA.noListMasgCandidate}</Text>
      </View>}

      {/* Overlaid UI elements */}
      {!(currentIndex2 > (videodata.length - 1)) && <View style={styles.overlayContainer}>
        {!isPlaying && <TouchableOpacity style={styles.playPauseButton} onPress={togglePlayPause}>
          <Image
            source={
              { uri: "https://via.placeholder.com/60?text=Play" }
            }
            style={styles.playPauseIcon}
          />
        </TouchableOpacity>}

        <View style={styles.seekBarContainer2}>
          {/* <TouchableOpacity style={{ marginBottom: 30 }} onPress={() => { share() }}>
            <Image style={{ height: 30, width: 30 }} source={require('../../../assets/ic_bookmark.png')} />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => { share(currentCard) }} style={{ marginBottom: 80 }} >
            <Image style={{ height: 30, width: 30 }} source={require('../../../assets/ic_share.png')} />
          </TouchableOpacity>
        </View>

        {/* Seekbar */}
        <View style={styles.seekBarContainer}>
          <View style={{display: 'flex',justifyContent:'center',marginLeft:'18%',marginTop:'-140%', position:'absolute'}}>
           {videodata[currentIndex]?.isSelected && <View style={styles.containerSelected}>
      <TouchableOpacity style={styles.buttonSelected}>
        <Text style={styles.textSelected}>Ce profil à postuler à cet offre !</Text>
      </TouchableOpacity>
    </View>}</View>
         {/* <View style={{backposition:'absolute'}}>
        {videodata[currentIndex]?.isSelected && <Text style={styles.selection}>{`Ce profil a postulé à cette offre d'emploi.`}</Text>}
          </View> */}
          <View style={styles.profileContainer}>
          {Avatar(roledata === 'recruiter' ? videodata[currentIndex]?.candidateName.firstname : videodata[currentIndex]?.userDetail.firstname)}
        
          {/* {console.log("videodata[currentIndex]", videodata[currentIndex], roledata)} */}
            <Text style={styles.username}>{`@${roledata === 'recruiter' ? videodata[currentIndex]?.candidateName.firstname : videodata[currentIndex]?.userDetail.firstname}`}</Text>
            <TouchableOpacity
              onPress={() => { navigateParams(navigation, 'Viewprofile', { profile: videodata[currentIndex], role: roledata }) }}
              style={styles.profileButton}>
              <Text style={styles.profileButtonText}>{roledata === 'recruiter' ? videodata[currentIndex]?.candidateData.email : videodata[currentIndex]?.CompanyDetails.companyName}</Text>
            </TouchableOpacity>
          
          </View>
          <View style={{marginTop:5}}>
              {MatchBadge(videodata[currentIndex2].total_score)}
          </View>

          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={videoDuration}
            value={currentTime}
            minimumTrackTintColor="#ffffff"
            maximumTrackTintColor="#ff007f"
            thumbTintColor="#fff"
            thumbImage={require('../../assets/png/thumb.png')}
            onValueChange={handleSeek}
          />
          {/* <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {formatTime(currentTime)} / {formatTime(videoDuration)}
            </Text>
          </View> */}
        </View>


      </View>}


    </GestureHandlerRootView>
    </>
  );
};

export default HOME;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    bottom: 34,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  button: {
    height: 50,
    borderRadius: 40,
    aspectRatio: 1,
    backgroundColor: '#3A3D45',
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardStyle: {
    width,
    height,
    borderRadius: 15,
    marginVertical: 20,
  },
  renderCardContainer: {
    flex: 1,
    borderRadius: 15,
    height: '75%',
    width: '100%',
  },
  renderCardImage: {
    height: '100%',
    width: '100%',
    borderRadius: 15,
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayLabelContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  videoContainer: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  video: {
    width,
    height,
    position: "absolute",
  },
 
  loader: {
    position: "absolute",
    top: height / 2 - 20,
    left: width / 2 - 20,
  },
  overlayContainer: {
    position: "absolute",
    // backgroundColor:'red',
    // top: 0,
    // left: 0,
    width,
    height: height/4,
    bottom:0,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 10,
    marginLeft: 0
  },
  username: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft:15
  },
  profileButton: {
    backgroundColor: "#ff007f",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 15,
    marginLeft: 15,
  },
  profileButtonText: {
    color: "#fff",
    fontSize: 14,
    flexWrap: "wrap"
  },
  actionsContainer: {
    position: "absolute",
    right: 16,
    bottom: 200,
    alignItems: "center",
  },
  actionButton: {
    marginBottom: 10,
  },
  actionIcon: {
    width: 32,
    height: 32,
  },
  actionCount: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 10,
  },
  captionContainer: {
    position: "absolute",
    bottom: 60,
    left: 16,
  },
  captionText: {
    color: "#fff",
    fontSize: 14,
  },
  playPauseButton: {
    position: "absolute",
    top: "45%",
    left: "45%",
    zIndex: 10,
  },
  playPauseIcon: {
    width: 60,
    height: 60,
  },
  seekBarContainer: {
    position: "absolute",
    bottom: -10,
    left: 10,
    right: 0,
    flexDirection: "column",
    // backgroundColor:'red'
    // alignItems: "center",
  },
  seekBarContainer2: {
    position: "absolute",
    bottom: '90%',
    left: '92%',
    // right: 0,
    flexDirection: "column",
    // backgroundColor:'red'
    // alignItems: "center",
  },
  slider: {
    width: "100%",
    height: 10,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
    alignSelf: 'flex-end',
    // backgroundColor:'red'
    // marginTop: -10,
  },
  timeText: {
    color: "#fff",
    fontSize: 12,
  },
  selection:{
    color: "#000",
    textAlign:'center',
    fontSize: 12,
  },
  avatar: {
    backgroundColor: "#4CAF50", // Change color as needed
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
  outerContainer: {
    padding: 1.5, // Thickness of the white border
    borderRadius: 22,
    backgroundColor: '#fff', // White border color
    alignSelf: 'flex-start',
  },
  containerScore: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  textScore: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
   containerSelected: {
    alignItems: 'center',
  },
  buttonSelected: {
    backgroundColor: '#2E2E2E', // Dark background
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  textSelected: {
    color: '#FFFFFF', // White text
    fontSize: 14,
    fontWeight: '500',
  },
});
