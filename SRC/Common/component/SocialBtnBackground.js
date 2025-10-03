import React from 'react';
import { Text, StyleSheet, View, Image, Dimensions, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

// Define sizes based on screen dimensions
const buttonSize = width * 0.14; // Adjust as needed (15% of screen width)
const logoSize = buttonSize * 0.50; // Adjust for inner logo image

const SocialBtnBackground = ({ color, image, onPress }) => {
  return (
    // <View style={styles.socialBtnBg}>
    <TouchableOpacity onPress={() => { onPress() }}>
      <View style={[styles.socialBtnBg, { backgroundColor: color }]}>
        <Image style={styles.logo} source={image} />
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  socialBtnBg: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: buttonSize / 2, // Makes it a circle
    width: buttonSize,            // Responsive width
    height: buttonSize,           // Responsive height
    marginHorizontal: 8,
  },
  logo: {
    width: logoSize,              // Responsive logo width
    height: logoSize,             // Responsive logo height
    resizeMode: 'contain',
  },
});

export default SocialBtnBackground;
