import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CheckBox from "@react-native-community/checkbox";

const CheckboxItem = ({ value, onValueChange, label }) => {
  return (
    <View style={styles.checkboxRow}>
      <CheckBox 
      value={value} 
      onValueChange={onValueChange}
      tintColors={{
        true: "#f84c27", // Checked color
        false: "#d0cde1", // Unchecked color
      }}
      onCheckColor="white" // Inner checkmark color (Android)
      onTintColor="#f84c27" // Border and fill color when checked (iOS)
      boxType="square" // Use square or circle for iOS
      // style={Platform.OS === "ios" ? styles.checkboxIOS : styles.checkboxAndroid} // Add platform-specific styling
   
      />
      <Text style={styles.checkboxText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  checkboxText: {
    fontSize: 14,
    color: "white",
    marginLeft: 10,
  },
});

export default CheckboxItem;