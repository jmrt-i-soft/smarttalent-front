import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Api from '../../Common/Apicall'
import API_ENDPOINTS from '../../Constants/apiEndpoints';
import GradientBackground from '../../Common/component/GradientBackground';
import { Keyboard, Alert, View, TouchableOpacity, Image, Text } from 'react-native';
import styles from '../../Common/CommonStyle/styles'
import { goBack } from '../../Common/navigate';
import LANGUAGE_DATA from '../../Constants/language';
import MoreOptions from './MoreOptions';
import ProfileScreenModal from './SelectedProfile'
import { ASYNC_STORAGES } from '../../Common/Storage';
import { getdata } from '../../Common/localdata';
import { useLoader } from '../../Common/component/LoaderContext';
export default function ChatScreen({ route, navigation }) {

  const { chatId, userName,userName2, userRole, userEmail, recruiterEmail, candidateEmail,endUserChat } = route.params;
  const [messages, setMessages] = useState([]);
 const [profileModalVisible, setProfileModalVisible] = useState(false);
 const { showLoader, hideLoader } = useLoader();
 const [recuiterPData,setRecuiterPData] = useState({});
 const [candidateProfileData, setCandidatePData] =  useState([]);
 const [profile_VideoProfile, setProfile_VideoProfile] = useState('')
   console.log('userNameuserNameuserName',userName,userName2)

 const getProfileData = async()=>{
   let api = "";
   const role = await getdata(ASYNC_STORAGES.role);
    if (role === 'recruiter') {// if user role is recuiter then get cadidate profile to see
      api = API_ENDPOINTS.CANDIDATE_GET_PROFILE;
    }
    else {
      api = API_ENDPOINTS.RECRUITER_GET_PROFILE;
    }
    var param2 = {
      'email': userEmail.trim(),
    };
   showLoader();
    Api.post(api, param2, {}).then((res2) => {
     
      if (role === 'recruiter') {
       setCandidatePData(res2?.data?.result);
        
        setTimeout(()=>{
          setProfileModalVisible(true);
           hideLoader()
        },1000)
       
      }
      else{
      
     setRecuiterPData(res2?.data);
      setTimeout(()=>{
           setProfileModalVisible(true);
           hideLoader()
        },1000)
      }
    }).catch(e=>{
      console.log(e)
      hideLoader()
    })
};   

const showProfile = ()=>{
  setProfile_VideoProfile('profile');
  setTimeout(()=>{
     getProfileData();
  },500);

};

const showVideoProfile = ()=>{
  setProfile_VideoProfile('videoProfile');
  setTimeout(()=>{
     getProfileData();
  },500);
};

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {

        const messagesFirestore = snapshot.docs.map(doc => {
          const data = doc.data();
          const batch = firestore().batch();
          console.log()
          if (data.senderId !== auth().currentUser.uid) {
            batch.update(doc.ref, {
              readBy: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
            });

          }
          batch.commit();
          return {
            _id: doc.id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: {
              _id: data.senderId,
              name: data.userName,
            },
          };
        });
        console.log('messagesFirestore list ',messagesFirestore);
        
        setMessages(messagesFirestore);
      });

    return unsubscribe;
  }, [chatId]);

  const onSend = useCallback((newMessages = []) => {
    const user = auth().currentUser;
    console.log(user)
    const message = newMessages[0];
    firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add({
        text: message.text,
        createdAt: new Date(),
        senderId: user.uid,
        userName: userName,
        readBy: [],
      });
    const uid = chatId.split("_")
    const index = uid.indexOf(user.uid);
    if (index > -1) { // only splice array when item is found
      uid.splice(index, 1); // 2nd parameter means remove one item only
    }

    const param = {
      uId: uid[0],
      senderId: user.uid,
      notificationHeader: userName,
      text: message.text
    };
    console.log("paramparamparamparamparamparamparamparamparam",param);
    Api.post(API_ENDPOINTS.sendNotification, param, {}).then((res) => { })
  }, []);

    const ConfirmBeforeCloseChat = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to proceed?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {endUserChat(recruiterEmail,candidateEmail,userRole); navigation.navigate('Messages');},
        }
      ]
    );
  };




  return (
    <GradientBackground>
      <View style={{ height: '100%' }}>
        <View style={{ height: '10%' }}>
          <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
            <View style={[{ flexDirection: 'row', backgroundColor: 'transparent', alignItems: 'center' }]}>
            <TouchableOpacity onPress={() => { navigation.popToTop() }} style={{ marginRight: 10 }}>
              <View style={{ margin: 5, backgroundColor: 'transparent' }}>
                <Image source={require('../../assets/png/back.png')} resizeMode={'stretch'} style={{ width: 30, height: 30 }} />
              </View>
            </TouchableOpacity>
            <View style={{ marginRight: 10,  display:'flex', backgroundColor: 'white', height: 40, width: 40, borderRadius: 30, justifyContent:'center',alignItems: 'center', padding: 2 }}>
              <Text style={{ fontSize: 20, color: '#212121' }}>{`${userName2.split(' ')[0].split('')[0].toUpperCase()}${userName2.split(' ')[1].split('')[0].toUpperCase()}`}</Text>
            </View>
            <View>
              <Text style={[styles.title, { fontSize: 20 }]}>{userName2}</Text>
              {/* <Text style={[styles.title,{fontSize:15}]}>{'Messages'}</Text> */}
            </View>
            </View>
            <TouchableOpacity onPress={() => { goBack(navigation) }} style={{ marginRight: 0 }}>
              <View style={{ margin: 5, backgroundColor: 'transparent'}}>
                <MoreOptions
                 showProfile={showProfile}
                showVideoProfile={showVideoProfile}
                ConfirmBeforeCloseChat={ConfirmBeforeCloseChat}
                />
                <ProfileScreenModal 
                modalVisible={profileModalVisible} 
                setModalVisible={setProfileModalVisible} 
                name={userName2} email={userEmail} 
                userRole={userRole === 'recruiter' ? 'applicant' : 'recruiter' } 
                recuiterPData={recuiterPData} candidateProfileData={candidateProfileData}
                profile_VideoProfile={profile_VideoProfile}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ borderWidth: 2, width: '100%', borderColor: '#787878' ,marginTop:5}} />
        </View>
        <TouchableOpacity onPress={() => Keyboard.dismiss()} style={{ height: '90%' }}>
          <View style={{ height: '100%' }}>
            {(messages.length > 0 || userRole === 'recruiter') ? <GiftedChat
              messages={messages}
              placeholder={LANGUAGE_DATA.message}
              onSend={messages => onSend(messages)}
              user={{
                _id: auth().currentUser.uid,
                name: userName,
              }}
              isStatusBarTranslucentAndroid={true}
              keyboardShouldPersistTaps='always'
              isKeyboardInternallyHandled
              wrapperStyle={{
                right: {
                  backgroundColor: '#8F8F8F'
                },
                left: {
                  backgroundColor: "#262629"
                }
              }}
              textStyle={{
                left: {
                  color: 'white',
                }
              }}
              textInputStyle={{ color: 'white' }}
              renderInputToolbar={(props) => <InputToolbar
                {...props}
                containerStyle={{
                  backgroundColor: '#262629',
                  alignContent: "center",
                  justifyContent: "center",
                  borderWidth: 0,
                  paddingTop: 6,
                  // marginHorizontal: 6,
                  // borderRadius: 32,
                  borderTopColor: "transparent",

                }}
              />}
            />: <View style={styles.noChatContainer}><Text style={styles.logoutText}>{LANGUAGE_DATA.recuiterConversationNotStart}</Text></View>}
          </View>
        </TouchableOpacity>
      </View>
    </GradientBackground>
  );
}