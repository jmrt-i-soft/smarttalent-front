import Api from '../../Common/Apicall';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, Animated } from 'react-native';
import { PanGestureHandler,State } from 'react-native-gesture-handler';
import styles from '../../Common/CommonStyle/styles';
import React, { useEffect, useState } from 'react';
import GradientBackground from '../../Common/component/GradientBackground';
import { getdata } from '../../Common/localdata';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { ASYNC_STORAGES } from '../../Common/Storage';
import API_ENDPOINTS from '../../Constants/apiEndpoints';
import { useLoader } from '../../Common/component/LoaderContext';
import LANGUAGE_DATA from '../../Constants/language';
import { useIsFocused } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const Messages = ({ navigation }) => {
  const isFocused = useIsFocused();
  const { showLoader, hideLoader } = useLoader();
  // const [email, setEmail] = useState('');
  const [userRole, setRole] = useState('');
  const [unReadMsgCount, setUnReadMsgCount] = useState({});
  const [masgCount, setMasgCount] = useState({});
  const [chatList, setChatlist] = useState([]);

  const getProfileStatus = async () => {
    var emailId = await getdata(ASYNC_STORAGES.email);
    const role = await getdata(ASYNC_STORAGES.role);
    // console.log("role",role)
    await setRole(role);
    //showLoader();
    var param = {
      'userEmail': emailId,
    };

    // console.log('param',param)

    Api.post(API_ENDPOINTS.get_Candiate_Recuiter_Matched, param, {}).then((res) => {
      if (res.data?.success) {
       // console.log('res.data?.MatchedDataDetails11',res.data?.MatchedDataDetails);
        setChatlist(res.data?.MatchedDataDetails);
        getUnreadMessage(res.data?.MatchedDataDetails, role);
      }

    }).catch((err) => {
      hideLoader();
      console.log('err.data232323', err);
      //Alert.alert(err.data.message)
    });
  };

  useEffect(() => {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    // Handle the notification here
    getProfileStatus();
    // Alert.alert(
    //   remoteMessage.notification?.title || 'New Notification',
    //   remoteMessage.notification?.body || ''
    // );
   // console.log('Foreground notification:', remoteMessage);
  });

  return unsubscribe;
}, []);

const endUserChat = async(recruiterEmail,candidateEmail, role)=>{
  console.log(recruiterEmail,candidateEmail, role);
  var param = {
      'recruiterEmail': recruiterEmail,
      'candidateEmail': candidateEmail,
      'role': role,
    };
  Api.post(API_ENDPOINTS.end_Chat, param, {}).then((res) => {
      if (res.data?.success) {
        //console.log('res.data',res.data);
        const copyChatList = [...chatList];
        const actionUser = role === 'candidate' ? '2' : '1';
        
        copyChatList?.forEach(data=>{
          if(data.matchedData.recruiterEmail === recruiterEmail &&
             data.matchedData.candidateEmail === candidateEmail &&
             data.matchedData.actionUser === actionUser){
             data.matchedData['end_chat'] = true;
             //console.log('.............121212',data.matchedData)
            }
        });
        console.log('done')
       setChatlist(copyChatList);
      }
  }).catch((err) => {
      console.log('err.data', err);
      //Alert.alert(err.data.message)
    });
  
}

  const navigateToChatScreen = async (item, matched, userEmail) => {
    if (!matched) {
      let masg = '';
      if (userRole === 'recruiter') {
        masg = LANGUAGE_DATA.masgCandidateNotMatch; //'Candidate yet not except the match!'
      }
      else {
        masg = LANGUAGE_DATA.masgRecuiterNotMatch; //'Recruiter yet not except the match!'
      }
      Alert.alert('Alert!', masg);
      return;
    }
    var firstname = await getdata(ASYNC_STORAGES?.firstName);
    const chatId = userRole === 'recruiter' ? `${auth().currentUser.uid}_${item.userData.firebaseUID}` : `${item.userData.firebaseUID}_${auth().currentUser.uid}`;
    //console.log('role', chatId);
    const unReadMsgCountData = { ...unReadMsgCount };
    unReadMsgCountData[chatId] = 0;
    setUnReadMsgCount(unReadMsgCountData);
   // console.log('dsdsdsdsdds', masgCount);
    //console.log('dsdsdsdsdds', chatId);
    // console.log('navigateToChatScreen',item.userData?.firstname.length+' '+item.userData?.lastname.length)
    // return;
    if (userRole === 'recruiter') {
      navigation.navigate('ChatScreen', { chatId: chatId, userName: firstname, userName2: `${item.userData?.firstname.trim()} ${item.userData?.lastname.trim()}`, userRole: userRole, userEmail:userEmail,endUserChat:endUserChat, recruiterEmail:item?.matchedData?.recruiterEmail,candidateEmail:item?.matchedData?.candidateEmail });
    }
    else if (userRole !== 'recruiter'){
      navigation.navigate('ChatScreen', { chatId: chatId, userName: firstname, userName2: `${item.userData?.firstname.trim()} ${item.userData?.lastname.trim()}`, userRole: userRole, userEmail:userEmail,endUserChat:endUserChat, recruiterEmail:item?.matchedData?.recruiterEmail,candidateEmail:item?.matchedData?.candidateEmail });
    }
     else {Alert.alert('Sorry!', LANGUAGE_DATA.recuiterConversationNotStart);}
  };

  let unreadMasgCount = 0;
  const getUnreadMessage = (items, role) => {
    if (!auth().currentUser) {
      hideLoader();
      return;
    }
    // console.log("userRole",userRole)
    if (!Array.isArray(items)) {
      hideLoader();
      return;
    }
    let ItemCount = items.length;
    let currentIndex = 0;

    if (ItemCount === 0) {
      hideLoader();
      return;
    }
    const tempMasg = {};
    const getUnreadMessageCount = (cID) => {
      //console.log(cID);
      //console.log(ItemCount);
      const chatId = role === 'recruiter' ? `${auth().currentUser.uid}_${items[cID]?.userData.firebaseUID}` : `${items[cID]?.userData.firebaseUID}_${auth().currentUser.uid}`;
     // console.log('..........................sdsdsdsdsdsdsdsdsdsdsdsds', chatId);
      const unsubscribe = firestore()
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
          // console.log("snapshot.docs",snapshot.docs)


          tempMasg[chatId] = snapshot.docs?.length || 0;
          setMasgCount(tempMasg)
         // console.log('...............................................qwqwwqqwqwqqw', tempMasg);
          snapshot.docs.map(doc => {
            const data = doc.data();

            if (data.senderId !== auth().currentUser.uid) {
              if (!Array.isArray(data.readBy)) {
                unreadMasgCount = unreadMasgCount + 1;
              }
              else if (Array.isArray(data.readBy) && data.readBy.indexOf(auth().currentUser.uid) === -1) {
                unreadMasgCount = unreadMasgCount + 1;
              }
              else {
                unreadMasgCount = 0;
              }

              // console.log("unreadMasgCount",unreadMasgCount)
            }
          });
          unsubscribe();

          const temp = {};
          temp[chatId] = unreadMasgCount;
          //console.log("temp",temp)

          setUnReadMsgCount(temp);
          if (cID < ItemCount - 1) {
            cID = cID + 1;
            getUnreadMessageCount(cID);
          }
          else {
            hideLoader();
          }

        });
    };

    getUnreadMessageCount(currentIndex);
  };

 const ConfirmBeforeCloseChat = (item, restorePosition) => {
     Alert.alert(
       "Confirmation",
       "Are you sure you want to proceed?",
       [
         {
           text: "Cancel",
           onPress: () => restorePosition(),
           style: "cancel"
         },
         {
           text: "Yes",
           onPress: () => {endUserChat(item?.matchedData?.recruiterEmail, item?.matchedData?.candidateEmail, userRole);},
         }
       ]
     );
   };   
  

  useEffect(() => {
    if (isFocused){
     getProfileStatus();
    }
  }, [isFocused]);

  // useEffect(() => {
  //     chatList.length > 0 &&  isFocused && reloadData()
  //   },[isFocused]);

  const reloadData = () => {
    
    // console.log('ssssss')
    return <GradientBackground>
      <View style={styles.container}>

        <Text style={[styles.subtitle, styles.fontSizeStyle]}>{'Matchs récents'}</Text>

        <View style={styles.chatViewStyle}>
          <ScrollView horizontal>
            {/* {console.log('..........',chatList)} */}
  {chatList.length > 0 && chatList.map((item, index) => {
    if (index <= 6 && !item.matchedData.end_chat && auth().currentUser.uid !== item?.userData?.firebaseUID && item.visible && !item.endChat) {
      return (
        <TouchableOpacity key={index} onPress={() => navigateToChatScreen(item, item.matched, item.userData?.email)}>
          <View style={stylesScroll.avatarContainer}>
            <Text style={stylesScroll.avatarText}>
              {`${item.userData?.firstname?.charAt(0)?.toUpperCase()}${item.userData?.lastname?.charAt(0)?.toUpperCase()}`}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
    return null;
  })}
</ScrollView>
        </View>

        <Text style={[styles.subtitle, styles.fontSizeStyle, styles.marginTop15]}>{'Messages'}</Text>

<ScrollView>
  {/* <ChatList/> */}
  {chatList.length > 0 && chatList.map((item, idx) => {
    const translateX = new Animated.Value(0);
    
        const onGestureEvent = Animated.event(
          [{ nativeEvent: { translationX: translateX } }],
          { useNativeDriver: true }
        );
      const bgColor = translateX.interpolate({
      inputRange: [-100, 0],
      outputRange: ['#d11a2a', 'transparent'], // Red to White
      extrapolate: 'clamp',
    });
     const restorePosition = () => {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    };
      const onHandlerStateChange = ({ nativeEvent }) => {
      if(nativeEvent.state === State.END){
      if (nativeEvent.translationX < -100) {
       ConfirmBeforeCloseChat(item, restorePosition);
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
    };
    return !item.matchedData.end_chat && auth().currentUser.uid !== item.userData.firebaseUID && item.visible && !item.endChat ? (
       <View style={stylesScroll.chatItem}>
       <GestureHandlerRootView>
       <PanGestureHandler
              onGestureEvent={onGestureEvent}
              onEnded={onHandlerStateChange}
            >
        <Animated.View style={[styles.chatItem, {backgroundColor: bgColor, transform: [{ translateX }] }]}>      
      <TouchableOpacity key={idx} onPress={() => navigateToChatScreen(item, item?.matched,item.userData?.email)}>
        <View style={stylesScroll.chatItem}>
          <View style={stylesScroll.initialsContainer}>
            <Text style={stylesScroll.initialsText}>
              {`${item.userData?.firstname?.charAt(0)?.toUpperCase()}${item.userData?.lastname?.charAt(0)?.toUpperCase()}`}
            </Text>
          </View>
          <View style={stylesScroll.nameContainer}>
            <Text style={stylesScroll.nameText}>
              {`${item.userData?.firstname} ${item.userData?.lastname}`}
            </Text>
            <Text numberOfLines={1} style={stylesScroll.scoreText}>
              {`Total Score ${item.matchedData?.total_score}`}
            </Text>
          </View>
          <View style={stylesScroll.unreadContainer}>
            <Text style={stylesScroll.unreadText}>
              {unReadMsgCount[
                userRole === 'recruiter' 
                  ? `${auth().currentUser.uid}_${item.userData.firebaseUID}`
                  : `${item.userData.firebaseUID}_${auth().currentUser.uid}`
              ] || ''}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      </Animated.View> 
      </PanGestureHandler>
      </GestureHandlerRootView>
      </View>
    ) : null;
  })}
</ScrollView>
      </View>

    </GradientBackground>;
  };

  return (
    <>
      {reloadData()}
    </>
  );
};

export default Messages;

const stylesScroll = StyleSheet.create({
  chatItem: {
    margin: 5,
    backgroundColor: 'transparent',
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  initialsContainer: {
    width: '20%',
    backgroundColor: 'transparent',
  },
  initialsText: {
    fontSize: 20,
    color: '#fff',
  },
  nameContainer: {
    width: '65%',
  },
  nameText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  scoreText: {
    color: '#fff',
  },
  unreadContainer: {
    width: '15%',
  },
  unreadText: {
    color: '#fff',
  },
   avatarContainer: {
    margin: 5,
    backgroundColor: 'white',
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  avatarText: {
    fontSize: 40,
    color: '#212121',
  },
});
