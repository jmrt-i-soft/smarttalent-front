import React, {useState, useEffect} from 'react';
import { Modal as ProfileModal, View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from "react-native-video";
import { useIsFocused } from '@react-navigation/native';
const ProfileScreenModal = ({modalVisible, setModalVisible,userRole,name = '',email = '',recuiterPData = {},candidateProfileData = [], profile_VideoProfile}) => {
    const videoRefs = React.useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);
     const [isPlaying, setIsPlaying] = useState(true);
  console.log(`1212121212sasas12121212121212${userRole}`,recuiterPData);
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
    },[isFocused]);

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

   const getFormatedDate = (isoString)=>{
const date = new Date(isoString);

return date.toLocaleDateString();
    };
    const handleProgress = ({ currentTime }) => {
    setCurrentTime(currentTime);
  };

  const handleLoad = ({ duration }) => {
    setVideoDuration(duration);
  };
  return (
    <View style={styles.container}>

      <ProfileModal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          
          <TouchableOpacity style={styles.closeIcon} onPress={() => setModalVisible(false)}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>

            {profile_VideoProfile === 'profile' ? <LinearGradient colors={['#0f0029', '#220044']} style={styles.container}>
                {userRole === 'applicant' ? <ScrollView contentContainerStyle={styles.scrollContainer}>
                  {/* Header */}
                  <View style={styles.header}>
                    <Image
                       source={require('../../../assets/profileImage.jpeg')}
                      style={styles.avatar}
                    />
                    <View style={styles.nameRow1}>
                    <View style={styles.nameRow}>
                      <Text style={styles.name}>{name}</Text>
                      <Text style={{color:'#ffff'}}>{email}</Text>
                    </View>
                    {/* <View style={styles.nameRow}>
                      <Text style={styles.name}></Text>
                      <TouchableOpacity style={styles.logOut} onPress={()=>{logout()}}>
                        <Text style={styles.editText}>Logout</Text>
                      </TouchableOpacity>
                    </View> */}
                    </View>
                  </View>
          
                  {/* Sections */}
                  <View style={styles.section}>
                    <Label title="Disponibilité" value={candidateProfileData.length > 0 && getFormatedDate(JSON.parse(candidateProfileData[0]?.availabledate)[0])} icon="calendar" />
                    <Label title="Type de contrat" value={candidateProfileData.length > 0 && candidateProfileData[0]?.position?.replaceAll('"',"")} />
                    <Label title="Secteur d'activité" tags={candidateProfileData.length > 0 && candidateProfileData[0]?.sector && JSON.parse(candidateProfileData[0]?.sector)} />
                    <Label title="Secteur géographique" tags={candidateProfileData.length > 0 && candidateProfileData[0]?.location && JSON.parse(candidateProfileData[0]?.location)} />
                    {/* <Label title="Type de contrat" value="Présentiel!" />
                    <Label title="Type de poste recherché" tags={['Chief technical Officer']} /> */}
                    <Label title="Compétences" tags={candidateProfileData.length > 0 && candidateProfileData[0]?.selectedskill && JSON.parse(candidateProfileData[0]?.selectedskill)} />
                  </View>
          
                  {/* Experience */}
                  <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Expériences</Text>
                    {candidateProfileData.length > 0 && candidateProfileData[0]?.experience && JSON.parse(candidateProfileData[0]?.experience).map(exp=>{
                      return <Experience
                      company={exp.company}
                      title={exp.jobTitle}
                      period={`${getFormatedDate(exp.startDate)} - ${getFormatedDate(exp.endDate)}`}
                      desc={exp.description}
                      location={exp.location}
                    />
                    })}
                  </View>
          
                  {/* Diplomas */}
                  <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Diplômes</Text>
                    {candidateProfileData.length > 0 && candidateProfileData[0]?.degree && JSON.parse(candidateProfileData[0]?.degree).map(degr=>{
                    return <Diploma title={degr.degreeName} school={degr.schoolOrCollege} period={`${getFormatedDate(degr.degreeStartDate)} - ${getFormatedDate(degr.degreeEndDate)}`} />
                  })}
                  </View>
                </ScrollView> : <ScrollView contentContainerStyle={styles.scrollContainer}>
                  {/* Header */}
                  <View style={styles.header}>
                    <Image
                       source={recuiterPData.companyDetails && recuiterPData.companyDetails.length > 0 && recuiterPData.companyDetails[0].companyVideoURl && recuiterPData.companyDetails[0].companyVideoURl.split('data:image/jpeg;base64,')[1] ? { uri: recuiterPData.companyDetails[0].companyVideoURl} : require('../../../assets/profileImage.jpeg')}
                      style={styles.avatar}
                    />
                    <View style={styles.nameRow1}>
                    <View style={styles.nameRow}>
                      <Text style={styles.name}>{name}</Text>
                      <Text style={{color:'#ffff'}}>{`${email}`}</Text>
                    </View>
                    {/* <View style={styles.nameRow}>
                      <Text style={styles.name}></Text>
                      <TouchableOpacity style={styles.logOut} onPress={()=>{logout()}}>
                        <Text style={styles.editText}>Logout</Text>
                      </TouchableOpacity>
                    </View> */}
                    </View>
                  </View>
          
                   {/* Sections */}
                   <View style={styles.section}>
                    <Label title="Entreprise" value={recuiterPData.companyDetails && recuiterPData.companyDetails.length > 0 && recuiterPData.companyDetails[0].companyName}  />
                    <Label title="Site internet" value={recuiterPData.companyDetails && recuiterPData.companyDetails.length > 0 && recuiterPData.companyDetails[0].companyWebsite} /> 
                    <Label title="Taille de l'effectif" value={recuiterPData.companyDetails && recuiterPData.companyDetails.length > 0 && recuiterPData.companyDetails[0].compayEmployeeCount} /> 
                    
                    <Text style={styles.sectionTitle}>Description de l'entreprise</Text>
                    <View style={styles.card}>
                    
                   <View style={styles.expItem}>
                  <Text style={styles.expSubtitle}>{recuiterPData.companyDetails && recuiterPData.companyDetails.length > 0 && recuiterPData.companyDetails[0].companyDescription}</Text>
                 </View>
                
                  </View>
                  <Label title="Secteur d'activité" tags={recuiterPData.companyDetails && recuiterPData.companyDetails.length > 0 && JSON.parse(recuiterPData.companyDetails[0].companyServiceType)} />
                  <Label title="Secteur géographique" tags={recuiterPData.allPostedJob && recuiterPData.allPostedJob.length > 0 && recuiterPData.allPostedJob[0].location.split(',')} />
                  <Label title="Titre du poste" tags={recuiterPData.allPostedJob && recuiterPData.allPostedJob.length > 0 && recuiterPData.allPostedJob[0].category.split(',')} /> 
                  <Label title="Expérience" value={recuiterPData.allPostedJob && recuiterPData.allPostedJob.length > 0 && recuiterPData.allPostedJob[0].experience} />
                  <Label title="Langue souhaitée" tags={recuiterPData.allPostedJob && recuiterPData.allPostedJob.length > 0 && JSON.parse(recuiterPData.allPostedJob[0].jobDescription).language.split(',')} />     
                  <Label title="Diplôme" tags={recuiterPData.allPostedJob && recuiterPData.allPostedJob.length > 0 && JSON.parse(recuiterPData.allPostedJob[0].jobDescription).certificate.split(',')} /> 
                  <Label title="Salaire" value={recuiterPData.allPostedJob && recuiterPData.allPostedJob.length > 0 && recuiterPData.allPostedJob[0].salary} />
                  <Label title="Type de contrat" tags={recuiterPData.allPostedJob && recuiterPData.allPostedJob.length > 0 && recuiterPData.allPostedJob[0].employmentType.split(',')} />
                  <Label title="Compétences requises" tags={recuiterPData.allPostedJob && recuiterPData.allPostedJob.length > 0 && recuiterPData.allPostedJob[0].requiredSkills.split(',')} /> 
                         </View>
                </ScrollView> }
          
              
              </LinearGradient> : <LinearGradient colors={['#0f0029', '#220044']} style={styles.container}>
                <View style={styles.videoContainer}>
                {(Object.keys(recuiterPData).length > 0 || candidateProfileData.length > 0) && <Video
                  ref={(ref) => (videoRefs.current = ref)}
                  source={{ uri: userRole === 'recruiter' ? 'https://smarttalent.augmentedresourcing.com/video/uploads' + recuiterPData?.allPostedJob[0]?.jobVideoURl : 'https://smarttalent.augmentedresourcing.com/video/uploads' +  candidateProfileData[0]?.video }}

                  style={styles.video}
                  resizeMode="cover"
                  repeat
                  onProgress={handleProgress} // Tracks current time
                  onLoad={handleLoad} // Fetch total duration
                  player="exoPlayer"
                />}
                
              </View>
                </LinearGradient>}

        </View>
      </ProfileModal>

    </View>
  );
};
const Label = ({ title, value, tags = [], icon }) => {
  console.log("tags", tags)
  return(
 
  <View style={{...styles.labelStyle, flexDirection: tags.length === 0 ? 'row' : 'column'}}>
    <Text style={styles.label}>{title}</Text>
    {value && (
      <View style={styles.chip}>
        {icon && <Icon name={icon} size={14} color="#fff" style={{ marginRight: 5 }} />}
        <Text style={styles.chipText}>{value}</Text>
      </View>
    )}
    {console.log("typeof(tags) === 'string'", typeof tags === "string")}
    { typeof(tags) === "string" && JSON.parse(tags)}
    {tags.length > 0 && (
      <View style={styles.tagContainer}>
        {tags.map((tag, i) => {
          if(i === 5){
                              return <View key={i} style={styles.tag}>
            <Text style={styles.tagText}>{`${tags.length - 5} more`}</Text>
          </View>
                          }
                          if(i > 5){
                              return null
                          }
          return(
          <View key={i} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        )})}
      </View>
    )}
  </View>
)};

const Experience = ({ company, title, period, desc, location = [] }) => (
  <View style={styles.expItem}>
    <Text style={styles.expTitle}>{company}</Text>
    <Text style={styles.expSubtitle}>{title}</Text>
    <Text style={styles.expPeriod}>{period}</Text>
    {desc && <Text style={styles.expDesc}>{desc}</Text>}
    {location && <Text style={styles.expDesc}>{location}</Text>}
    {/* <View style={styles.tagContainer}>
      {tags.map((tag, i) => (
        <View key={i} style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      ))}
    </View> */}
  </View>
);

const Diploma = ({ title, school, period }) => (
  <View style={styles.expItem}>
    <Text style={styles.expSubtitle}>{title}</Text>
    <Text style={styles.expDesc}>{school}</Text>
    <Text style={styles.expPeriod}>{period}</Text>
  </View>
);
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    width,
    height,
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
  },
   scrollContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    display:'flex',
    flexDirection:'row',
    marginTop: 40,
    width:'100%',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
  },
  nameRow: {
    alignItems: 'center',
    display:'flex',
    justifyContent: 'space-around',
  },
  nameRow1: {
    alignItems: 'center',
    display:'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
    width:'80%',
    marginTop: 20,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editBtn: {
    backgroundColor: '#ff007f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 6,
  },
  logOut:{
    backgroundColor: 'blue',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 6,
  },
  editText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    color: '#aaa',
    marginBottom: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  chipText: {
    color: '#fff',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  tag: {
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  expItem: {
    marginBottom: 16,
  },
  expTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  expSubtitle: {
    color: '#ddd',
    fontSize: 14,
  },
  expPeriod: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 4,
  },
  expDesc: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 4,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#0d0d0d',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  activeNav: {
    backgroundColor: '#ff007f',
    padding: 10,
    borderRadius: 50,
  },
  labelStyle:{
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-between'
  },
  videoContainer: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    width,
    height,
    position: 'absolute',
  },
});

export default ProfileScreenModal;