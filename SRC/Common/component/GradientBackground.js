import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { ImageBackground, Text, StyleSheet, StatusBar } from 'react-native';
import { images } from '../../../assets/images';
import { SafeAreaView } from 'react-native-safe-area-context';
import MyActionBar from './ActionBar';

const GradientBackground = ({ children}) => {
  return (
    <ImageBackground source={images.background} style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        {/* <MyActionBar onBackPress={onBackPress} />  */}
        {/* title={title} */}
        {children}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover'
  }
});


//   return (
//     <LinearGradient
//       colors={['#5200FF', '#0B0C0D', '#5200FF']} 
//       start={{ x: 0.2, y: 0.3 }} // Adjust starting position for a more dynamic look
//       end={{ x: 0.8, y: 0.8 }}     // Ending at bottom right for gradient angle
//       locations={[0.3, 0.6, 1]} // Control the transition between colors
//       style={styles.gradient}
//     >
//       {children}
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   gradient: {
//     flex: 1,
//     // justifyContent: 'center',
//     // alignItems: 'center',
//   }
// });

export default GradientBackground;
