import React, { useEffect, useState } from 'react';
import Api from '../../Common/Apicall'
import { deletedata, getdata } from '../../Common/localdata';
import { ASYNC_STORAGES } from '../../Common/Storage';
import API_ENDPOINTS from '../../Constants/apiEndpoints';
import { useLoader } from '../../Common/component/LoaderContext';
import { navigateReset, navigateResetParam } from '../../Common/navigate';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { GoogleSignin } from '@react-native-google-signin/google-signin'
export default function ProfileScreen({navigation}) {
  const { showLoader, hideLoader } = useLoader();
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [userRole, setRole] = useState('');
  const [recuiterPData,setRecuiterPData] = useState({});
  const [candidateProfileData, setCandidatePData] =  useState([]);
  const getProfileData = async()=>{
    const emailId = await getdata(ASYNC_STORAGES.email);
    const Name = await getdata(ASYNC_STORAGES.firstName);
   const role = await getdata(ASYNC_STORAGES.role);
    setName(Name);
    setEmail(emailId);
    setRole(role);
   let api = "";
    if (role === 'recruiter') {
      api = API_ENDPOINTS.RECRUITER_GET_PROFILE;
    }
    else {
      api = API_ENDPOINTS.CANDIDATE_GET_PROFILE;
    }
    var param2 = {
      "email": emailId
    }
   showLoader()
    Api.post(api, param2, {}).then((res2) => {
      hideLoader()
      if (role === 'recruiter') {
        console.log('asaasasasasasas',res2?.data)
        setRecuiterPData(res2?.data)
      }
      else{
      setCandidatePData(res2?.data?.result)
      }
    }).catch(e=>{
      console.log(e)
      hideLoader()
    })
}
const signOut = async () => {
  try {
    await GoogleSignin.revokeAccess(); // optional, to revoke access
    await GoogleSignin.signOut();      // remove user from device
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Error signing out: ', error);
  }
};
const logout = async () => {
  await deletedata();
  await signOut();
  navigateReset(navigation, 'ChooseProfile')
};

const updateCandidateProfile = async () => {
    navigateResetParam(navigation,'Availability', { email: email,candidateProfile:candidateProfileData  });
};

const updateRecuiterProfile = async()=>{
  navigateResetParam(navigation,'AddCompanyDetails', { email: email, recuiterProfile: recuiterPData });
}

    useEffect(()=>{
      getProfileData()
    },[])

    const getFormatedDate = (isoString)=>{
const date = new Date(isoString);

return date.toLocaleDateString();
    }

  return (
    <LinearGradient colors={['#0f0029', '#220044']} style={styles.container}>
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
            <View style={{display:'flex', flexDirection: 'row', gap: 20}}>
            <TouchableOpacity style={styles.editBtn} onPress={()=>{updateCandidateProfile()}}>
              <Text style={styles.editText}>Modifier le profil</Text>
            </TouchableOpacity>
             <TouchableOpacity style={styles.logOut} onPress={()=>{logout()}}>
              <Text style={styles.editText}>Logout</Text>
            </TouchableOpacity>
            </View>
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
            <View style={{display:'flex', flexDirection: 'row', gap: 20}}>
            <TouchableOpacity style={styles.editBtn} onPress={()=>{updateRecuiterProfile()}}>
              <Text style={styles.editText}>Modifier le profil</Text>
            </TouchableOpacity>
             <TouchableOpacity style={styles.logOut} onPress={()=>{logout()}}>
              <Text style={styles.editText}>Logout</Text>
            </TouchableOpacity>
            </View>
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

    
    </LinearGradient>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  }
});