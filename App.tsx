/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler'
import React, { useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import MyStack from './SRC/Navigation/appnavigation'
import { LoaderProvider } from './SRC/Common/component/LoaderContext';
import { UserProvider } from './SRC/Common/Utils/UserProvider';
import messaging from '@react-native-firebase/messaging';
import { initializeApp } from '@react-native-firebase/app';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
type SectionProps = PropsWithChildren<{
  title: string;
}>;



function Section({ children, title }: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  // messaging()
  // .getToken()
  // .then(token => {
  //   //console.log('Firebase Token:', token);
  // });
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        //console.log('Authorization status:', authStatus);
    }
}

useEffect(() => {
    GoogleSignin.configure({
    webClientId: '162801726700-k8lrgn4630cdnd3skaafgbbd8dpkhu0b.apps.googleusercontent.com', // Get from Firebase Console
    offlineAccess: true,
  });
  // Initialize Firebase
  const firebaseConfig = {
    // Your Firebase config object
  };
  initializeApp(firebaseConfig);
  // Handle incoming Dynamic Links
  const handleDynamicLink = async () => {
    const initialLink = await dynamicLinks().getInitialLink();
    console.log('Initial Dynamic Link:', initialLink);
    const unsubscribe = dynamicLinks().onLink((link) => {
      console.log('Dynamic Link:', link);
    });
    return () => unsubscribe();
  };
  handleDynamicLink();
}, []);

requestUserPermission();
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <LoaderProvider>
      <UserProvider>
        <MyStack />
      </UserProvider>
    </LoaderProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
