import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Alert,
    FlatList
} from 'react-native';
import Video from "react-native-video";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import GradientBackground from '../../Common/component/GradientBackground';

const Viewprofile = ({ navigation, route }) => {
    const { profile, role } = route.params;

    // const [roledata, setroledata] = useState('');
    // var role ;


    useEffect(() => {

        //   nextprocess();
        console.log('route data ', route.params.role);

    });

    const nextprocess = async () => {

    }


    return (
        <GradientBackground style={styles.container}>
            {role != 'recruiter' ? <ScrollView style={styles.container}>
                {/* User Info Section */}
                <View style={styles.profileHeader}>
                    <Text style={styles.name}>{'Profile'}</Text>
                    <Text style={styles.name}>{profile.description_poste}</Text>
                    {/* <Text style={styles.match}>97% Match</Text> */}
                </View>

                {/* Skills Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Skills Required</Text>
                    <FlatList
                        data={profile.JobDetail.requiredSkills.split(",")}
                        // horizontal
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.skillTag}>
                                <Text style={styles.skillText}>{item}</Text>
                            </View>
                        )}
                    />
                </View>


                {/* Job Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Job Description</Text>

                    <View style={styles.skillTag}>
                    <Text style={[styles.sectionTitle, { color: '#99908e' }]}>{'Category'}</Text>
                        <Text style={styles.skillText}>{JSON.parse(profile.JobDetail.jobDescription).category}</Text>
                    </View>
                    <View style={styles.skillTag}>
                    <Text style={[styles.sectionTitle, { color: '#99908e' }]}>{'Experience'}</Text>
                        <Text style={styles.skillText}>{JSON.parse(profile.JobDetail.jobDescription).experience}</Text>
                    </View>
                    <View style={styles.skillTag}>
                    <Text style={[styles.sectionTitle, { color: '#99908e' }]}>{'Location'}</Text>
                        <Text style={styles.skillText}>{JSON.parse(profile.JobDetail.jobDescription).location}</Text>
                    </View>
                    <View style={styles.skillTag}>
                        <Text style={styles.skillText}>{JSON.parse(profile.JobDetail.jobDescription).salary}</Text>
                    </View>
                    <View style={styles.skillTag}>
                        <Text style={styles.skillText}>{JSON.parse(profile.JobDetail.jobDescription).category}</Text>
                    </View>
                    <View style={styles.skillTag}>
                        <Text style={styles.skillText}>{JSON.parse(profile.JobDetail.jobDescription).category}</Text>
                    </View>
                    <View style={styles.skillTag}>
                        <Text style={styles.skillText}>{JSON.parse(profile.JobDetail.jobDescription).category}</Text>
                    </View>
                    
                </View>

                {/* Experience Section */}
                {/* <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Experience</Text>
                                {data.experience.map((exp, index) => (
                                    <View key={index} style={styles.experienceCard}>
                                        <Text style={styles.company}>{exp.company}</Text>
                                        <Text style={styles.jobTitle}>{exp.jobTitle}</Text>
                                        <Text style={styles.location}>{exp.location}</Text>
                                    </View>
                                ))}
                            </View> */}

                {/* Education Section */}
                {/* <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Education</Text>
                                {data.degree.map((deg, index) => (
                                    <View key={index}>
                                        <Text style={styles.degreeName}>{deg.degreeName}</Text>
                                    </View>
                                ))}
                            </View> */}


                {/* Availability Section */}
                {/* <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Available Dates</Text>
                                {data.availabledate.map((date, index) => (
                                    <Text key={index} style={styles.dateText}>
                                        {new Date(date).toLocaleDateString()}
                                    </Text>
                                ))}
                            </View> */}

                {/* Positions Section */}
                {/* <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Positions</Text>
                                {data.position.map((pos, index) => (
                                    <Text key={index} style={styles.itemText}>
                                        {pos}
                                    </Text>
                                ))}
                            </View> */}

                {/* Sectors Section */}
                {/* <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Sectors</Text>
                                {data.sector.map((sector, index) => (
                                    <Text key={index} style={styles.itemText}>
                                        {sector}
                                    </Text>
                                ))}
                            </View> */}

                {/* Locations Section */}
                {/* <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Preferred Locations</Text>
                                {data.location.map((loc, index) => (
                                    <Text key={index} style={styles.itemText}>
                                        {loc}
                                    </Text>
                                ))}
                            </View> */}

                {/* Work Mode Section */}
                {/* <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Work Mode</Text>
                                {data.workmode.isOnSiteEnabled && (
                                    <Text style={styles.itemText}>On-Site</Text>
                                )}
                                {data.workmode.isPartialRemoteEnabled && (
                                    <Text style={styles.itemText}>Partial Remote</Text>
                                )}
                                {data.workmode.isFullRemoteEnabled && (
                                    <Text style={styles.itemText}>Full Remote</Text>
                                )}
                            </View> */}

                {/*Logout Section */}
                {/* <TouchableOpacity onPress={()=>{logout()}}>
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Log Out</Text>
                            </View>
                            </TouchableOpacity> */}
            </ScrollView> : <ScrollView style={styles.container}>
                {/* User Info Section */}
                <View style={styles.profileHeader}>
                    <Text style={styles.name}>{'Profiles'}</Text>
                    <Text style={styles.name}>{profile.candidateData.id}</Text>
                    {/* <Text style={styles.match}>97% Match</Text> */}
                </View>

                {/* Skills Section */}
                <View style={styles.section}>

                    <View style={{ backgroundColor: '#262629', padding: 10 }}>
                        <Text style={[styles.sectionTitle, { color: '#99908e' }]}>Skills</Text>
                        <FlatList
                            data={JSON.parse(profile.candidateData.selectedskill)}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                    <Text style={styles.valueTitle}>{item}</Text>
                            )}
                        />
                    </View>
                </View>

                {/* Experience Section */}
                <View style={styles.section}>

                    <View style={{ backgroundColor: '#262629', padding: 10 }}>
                        <Text style={[styles.sectionTitle, { color: '#99908e' }]}>{'Experience'}</Text>
                        <FlatList
                            data={JSON.parse(profile.candidateData.experience)}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View>
                                    <Text style={[styles.valueTitle, { fontSize: 20, fontWeight: 'bold' }]}>{item.company}</Text>
                                    <Text style={[styles.valueTitle, { fontSize: 16, fontWeight: '700' }]}>{item.location}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={require('../../assets/png/date.png')} style={{ marginBottom: 10 }} />
                                        <Text style={[styles.valueTitle, { fontSize: 16 }]}>{'  ' + item.startDate}</Text>
                                        <Text style={[styles.valueTitle, { fontSize: 16 }]}>{' - ' + item.endDate}</Text>
                                    </View>
                                    <Text style={[styles.valueTitle, { fontSize: 16 }]}>{item.jobTitle}</Text>
                                    <Text style={[styles.valueTitle, { fontSize: 16 }]}>{item.description}</Text>
                                    <View style={{ borderWidth: 1, borderColor: 'grey' }} />
                                </View>
                            )}
                        />
                    </View>
                </View>

                {/* Education Section */}
                <View style={styles.section}>

                    <View style={{ backgroundColor: '#262629', padding: 10 }}>
                        <Text style={[styles.sectionTitle, { color: '#99908e' }]}>{'Degree'}</Text>
                        <FlatList
                            data={JSON.parse(profile.candidateData.degree)}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View>
                                    <Text style={[styles.valueTitle, { fontSize: 20, fontWeight: 'bold' }]}>{item.degreeName}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={require('../../assets/png/date.png')} style={{ marginBottom: 10 }} />
                                        <Text style={[styles.valueTitle, { fontSize: 16 }]}>{'  ' + item.degreeStartDate}</Text>
                                        <Text style={[styles.valueTitle, { fontSize: 16 }]}>{' - ' + item.degreeEndDate}</Text>
                                    </View>
                                    <Text style={[styles.valueTitle, { fontSize: 16 }]}>{item.degreeDescription}</Text>
                                    <View style={{ borderWidth: 1, borderColor: 'grey' }} />
                                </View>
                            )}
                        />
                    </View>
                </View>


                {/* Availability Section */}
                {/* <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Available Dates</Text>
                                {data.availabledate.map((date, index) => (
                                    <Text key={index} style={styles.dateText}>
                                        {new Date(date).toLocaleDateString()}
                                    </Text>
                                ))}
                            </View> */}

                {/* Positions Section */}
                {/* <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Positions</Text>
                                {data.position.map((pos, index) => (
                                    <Text key={index} style={styles.itemText}>
                                        {pos}
                                    </Text>
                                ))}
                            </View> */}

                {/* Sectors Section */}
                {/* <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Sectors</Text>
                                {data.sector.map((sector, index) => (
                                    <Text key={index} style={styles.itemText}>
                                        {sector}
                                    </Text>
                                ))}
                            </View> */}

                {/* Locations Section */}
                {/* <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Preferred Locations</Text>
                                {data.location.map((loc, index) => (
                                    <Text key={index} style={styles.itemText}>
                                        {loc}
                                    </Text>
                                ))}
                            </View> */}

                {/* Work Mode Section */}
                {/* <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Work Mode</Text>
                                {data.workmode.isOnSiteEnabled && (
                                    <Text style={styles.itemText}>On-Site</Text>
                                )}
                                {data.workmode.isPartialRemoteEnabled && (
                                    <Text style={styles.itemText}>Partial Remote</Text>
                                )}
                                {data.workmode.isFullRemoteEnabled && (
                                    <Text style={styles.itemText}>Full Remote</Text>
                                )}
                            </View> */}

                {/*Logout Section */}
                {/* <TouchableOpacity onPress={()=>{logout()}}>
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Log Out</Text>
                            </View>
                            </TouchableOpacity> */}
            </ScrollView>}
        </GradientBackground>
    );
};

export default Viewprofile;

const styles = StyleSheet.create({
    //   container: {
    //     flex: 1,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //   },
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
    valueTitle: {
        fontSize: 16,
        fontWeight: '400',
        color: '#fff',
        marginBottom: 10,
    },
    skillTag: {
        backgroundColor: '#282C40',
        padding: 10,
        borderRadius: 10,
        margin: 5,
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
