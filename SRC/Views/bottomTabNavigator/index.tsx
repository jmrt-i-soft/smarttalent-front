import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, StyleSheet, View } from 'react-native';
import Availability from '../candidate/Availability';
import { images } from '../../../assets/images';
import Dashboard from '../Dashboard';
import Profile from '../Profile';
import Messages from '../Messages';
import Home from '../Home';
import Viewprofile from '../ViewProfile';
import Location from '../Location';
import Statistic from '../Statistic';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// Placeholder components for bottom tabs
// const Statistics = () => <></>;

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MyStack2 = () => {
    return (
    
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Home2'>
          
          <Stack.Screen name="Viewprofile" component={Viewprofile} />
          <Stack.Screen name="Home2" component={Home} />
  
  
        </Stack.Navigator>
    
    );
  };
  


const BottomTabNavigator = ({route}) => {
     const id = route?.params?.id || -1;
     console.log('Dataididididdddiidi1212121212ididi',id)
    return (
        <View style={{ flex: 1 }}>
            <Image
                source={images.wave}
                style={styles.waveImage} />

            <Tab.Navigator
            initialRouteName='Home'
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: 'black', // Bottom tab background color
                        height: '12%', // Custom height
                        borderTopWidth: 0, // Remove border line

                    },
                    tabBarLabelStyle: { fontSize: 12, marginBottom: 8}, // Label text style
                    tabBarActiveTintColor: 'white',
                    tabBarInactiveTintColor: 'white',
                    headerShown: false
                }} >

                <Tab.Screen
                    name="Home"
                    component={Home}
                    initialParams={{ id }}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Image
                                source={focused ? images.home : images.home}
                                style={styles.icon}
                            />
                        ),
                    }}
                />

                {/* Messages Tab */}
                <Tab.Screen
                    name="Messages"
                    component={Messages}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Image
                                source={focused ? images.chat : images.chat}
                                style={styles.icon}
                            />
                        ),
                    }}
                />

                <Tab.Screen
                    name="Compte"
                    component={Profile}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Image
                                source={focused ? images.profile : images.profile}
                                style={styles.icon}
                            />
                        ),
                    }}
                />
            </Tab.Navigator>
        </View>
    );
};

const styles = StyleSheet.create({
    icon: {
        width: 24, // Custom width for the icons
        height: 24, // Custom height for the icons
        resizeMode: 'contain', // Ensures the image fits properly
        marginBottom: -8,
    },
    menuIcon: {
        width: 64, // Custom width for the icons
        height: 64, // Custom height for the icons
        resizeMode: 'contain', // Ensures the image fits properly
        marginBottom: 4,
    },
    waveImage: {
        position: 'absolute',
        bottom: '12%', // Position the wave image just above the tab bar
        width: '100%', // Full width
        height: 18, // Adjust height of the wave image
        resizeMode: 'cover', // Ensure the image fits well
        zIndex: 1, // Ensure the wave image is above the tab bar
    }
});

export default BottomTabNavigator;