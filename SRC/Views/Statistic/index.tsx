import { View, Text, Image, Alert, ScrollView, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import GradientBackground from '../../Common/component/GradientBackground';
import { useUser } from '../../Common/Utils/UserProvider';
import { deletedata, getdata } from '../../Common/localdata';
import { ASYNC_STORAGES } from '../../Common/Storage';
import API_ENDPOINTS from '../../Constants/apiEndpoints';
import { useLoader } from '../../Common/component/LoaderContext';
import CONST_UTILS from '../../Constants/ConstUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { images } from '../../../assets/images';
import { navigateReset } from '../../Common/navigate';

const Statistic = ({ navigation, route }) => {
    // const { userRole } = useUser();
    const { showLoader, hideLoader } = useLoader();
    const [userRole, setRole] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { profileData } = route.params || {};
    // console.log("Received profileData:", profileData);

    // Parse JSON strings from the profileData if necessary


    const handleBackPress = () => {
        navigation.goBack();
    };



    return (
        <>
            <GradientBackground>
                {/* <ActionBar title="Profile" onBackPress={handleBackPress} /> */}

                {/* <ScrollView style={styles.container}>
                   <Text style={{color:'white'}}>fggfgfgf</Text>
                </ScrollView> */}
                <View style={{ justifyContent: 'center', alignSelf: 'center', height: '100%' }}>
                    <Text style={{ color: 'white', alignSelf: 'center' }}>{'À venir'}</Text>
                </View>
            </GradientBackground>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#14172A',
        padding: 16,
    },
    profileHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    match: {
        fontSize: 16,
        color: '#FF6C00',
        fontWeight: 'bold',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#FF6C0033',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    skillTag: {
        backgroundColor: '#282C40',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginRight: 10,
    },
    skillText: {
        color: '#fff',
        fontSize: 14,
    },
    experienceCard: {
        backgroundColor: '#282C40',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    company: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    jobTitle: {
        fontSize: 14,
        color: '#A0A3BD',
    },
    location: {
        fontSize: 14,
        color: '#A0A3BD',
    },
    degreeName: {
        fontSize: 14,
        color: '#fff',
    },
    dateText: {
        fontSize: 14,
        color: '#A0A3BD',
        marginBottom: 5,
    },
    itemText: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 5,
    },
});

export default Statistic;