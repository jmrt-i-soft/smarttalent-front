import React, { useEffect, useRef, useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useLoader } from '../../Common/component/LoaderContext';
import API_ENDPOINTS from '../../Constants/apiEndpoints';
import Api from '../../Common/Apicall'
import { useUser } from '../../Common/Utils/UserProvider';
import firestore from '@react-native-firebase/firestore';
export default function ChatListScreen({ navigation, route }) {
  const { userRole } = useUser();
  const ref = useRef('')
  const { userName } = route.params;
    const { showLoader, hideLoader } = useLoader();
      const [profileData, setProfileData] = useState(null); // State to store the profile data
      const [unReadMsgCount, setUnReadMsgCount ] = useState({})
  const handleLogout = () => {
    auth().signOut().then(() => navigation.replace('Login'));
  };

  useEffect(()=>{
  getuserData('appdeveloperf@gmail.com', 'users')
   //getuserData('appdeveloperf@gmail.com', userRole === 'recruiter' ? 'candidate' : 'recuiter')
  },[])
  


  const getuserData = async (emailData,table) => {
    showLoader();
    var param = {
      "email": 'cba@gmail.com',
      "table": 'user'
    }


    Api.post(API_ENDPOINTS.RECRUITER_CANDIDATE_DATA, param, {}).then((res) => {
      hideLoader();

      // Ensure res.data.result exists and is an array
      if (Array.isArray(res.data.result) && res.data.result.length > 0) {
        // Access the first element safely
        setProfileData(res.data.result[0]);
      
      } else {
        // If the result array is empty or undefined
       // navigation.navigate("Availability");
      }
    }).catch((err) => {
      hideLoader();
      // console.log(err.data)
      Alert.alert(err.data.message)
    })
  }

  useEffect(()=>{
    if(profileData){
      getUnreadMessage(auth().currentUser.uid)
    }
  }, [profileData])

const createChat = async () => {
  // const chatId = profileData.isCandidate ? `${auth().currentUser.uid}_${profileData.firebaseUID}` : `${profileData.firebaseUID}_${auth().currentUser.uid}`

  // const chatRef = firestore().collection("chats").doc(chatId);
  // try {
  //   await chatRef.set({
  //     participants: chatId.split('_'), // Array of user IDs
  //   });
  //   console.log("chatId",chatId)
  //   navigation.navigate('ChatScreen', { chatId: chatId, userName: userName })
  //   console.log("Chat created successfully!");
  // } catch (error) {
  //   console.error("Error creating chat: ", error);
  // }
};
let unreadMasgCount = 0
const getUnreadMessage = (firebaseUid)=>{
//   const chatId = profileData.isCandidate ? `${auth().currentUser.uid}_${profileData.firebaseUID}` : `${profileData.firebaseUID}_${auth().currentUser.uid}`

// //  const tempUnreadArr = []
   
//    console.log("firebaseUid",firebaseUid)
//    firestore()
//       .collection('chats')
//       .doc(chatId)
//       .collection('messages')
//       .orderBy('createdAt', 'desc')
//    .onSnapshot(snapshot => {
//     console.log("snapshot.docs",snapshot.docs)
//     snapshot.docs.map(doc => {
//     const data = doc.data();
//     console.log("data.senderId", data.senderId)
//     console.log("firebaseUid", firebaseUid)
//     if(data.senderId !== firebaseUid){
//       if(!Array.isArray(data.readBy)){
//         unreadMasgCount = unreadMasgCount+1
//       }
//       else if(Array.isArray(data.readBy) && data.readBy.indexOf(firebaseUid) === -1){
//         unreadMasgCount = unreadMasgCount+1
//       }
      
//       console.log("unreadMasgCount",unreadMasgCount)
//     }
//   });
//   const temp = {}
//   temp[chatId] = unreadMasgCount
//  console.log("temp",temp)
//  setUnReadMsgCount(temp)
//    })
  
}
  return <></>
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
});