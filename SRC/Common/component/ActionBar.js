import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions} from 'react-native';
import { images } from '../../../assets/images';

const { height: screenHeight } = Dimensions.get('window');

const ActionBar = ({ title, onBackPress }) => {
  return (
    <View style={styles.container}>
      {onBackPress && (
            <TouchableOpacity onPress={() => { 
              onBackPress();
            }} style={styles.leftIcon} activeOpacity={0.8}>
        
           <Image
            source={images.backBtn}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
       <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: screenHeight * 0.07,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    fontWeight:'500',
    textAlign: 'center',
  },
  leftIcon: {
    position: 'absolute',
    left: 16,
    paddingVertical: 16,
    zIndex: 1, // Ensure the back button is above the title
  },
  icon: {
    height: 32,
    width: 32,
    resizeMode: 'contain',
  }
});

export default ActionBar;