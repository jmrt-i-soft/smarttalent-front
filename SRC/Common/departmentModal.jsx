import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, ScrollView, Alert, StyleSheet } from "react-native";
import CheckBox from "react-native-check-box";
import Icon from "react-native-vector-icons/MaterialIcons";
import LANGUAGE_DATA from '../Constants/language';
// const STATES_CITIES = {
//   "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
//   "Karnataka": ["Bangalore", "Mysore", "Mangalore", "Hubli"],
//   "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
//   "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi"],
//   "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
// };

const DepartmentModal = ({ visible, onClose, departments, setSelectedDepatment, selectedDepatment }) => {
   // console.log(departments)
  const Departments = departments 
  const [search, setSearch] = useState("");
  const [selectedData, setSelectedData] = useState(selectedDepatment);
  
  useEffect(()=>{},[visible])

  // Function to toggle a state's selection
  const toggleState = (state) => {
    const exists = selectedData.some(item => item.id === state.id);
  
    if (exists) {
      // Remove the item
      const filtered = selectedData.filter(item => item.id !== state.id);
      setSelectedData(filtered);
    } else {
        console.log(selectedData.length)
        if(selectedData.length > 8){
            Alert.alert("Vous pouvez sélectionner jusqu'à 8 départements uniquement.")
            return
        }
      // Add the item
      setSelectedData([
        ...selectedData,
        { id: state.id, department: state.department }
      ]);
    }
  };
  const filteredStates = Departments.filter(
    state => state.department.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" }}>
        <View style={{ width: "90%", backgroundColor: "white", borderRadius: 10, padding: 20, maxHeight: "80%" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>{LANGUAGE_DATA.ADD_JOB.Select_Department}</Text>
          
          {/* Search Bar */}
          <TextInput
            placeholder={LANGUAGE_DATA.ADD_JOB.department}
            value={search}
            onChangeText={setSearch}
            style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 10 }}
          />
          
          {/* Scrollable List */}
          <ScrollView style={{ maxHeight: 400 }}>
            {filteredStates && filteredStates.map((state,idx) => {
                const isSelected = selectedData ? selectedData.some(seleData => state.id === seleData.id) : false
              return (
                <View key={`${state}_${idx}`}>
                  {/* State Checkbox */}
                  <TouchableOpacity 
                    onPress={() => toggleState(state)} 
                    style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}
                  >
                    <CheckBox
                      isChecked={isSelected}
                      onClick={() => toggleState(state)}
                      checkBoxColor={isSelected ? 'blue' : "black"}
                    />
                    <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: "bold" }}>{state.department}</Text>
                  </TouchableOpacity>

                </View>
              );
            })}
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity onPress={()=>{
            setSelectedDepatment(selectedData)
            onClose()
          }} style={{ marginTop: 10, alignSelf: "flex-end" }}>
            <Text style={styles.saveStyle}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  saveStyle:{
    color: 'blue'
  }
})
export default DepartmentModal;