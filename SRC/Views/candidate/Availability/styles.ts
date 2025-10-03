import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../../Constants/colors";

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    padding: 16,
    marginTop: 8
  },
  error: {
    color: 'red',
    alignSelf:'center',
    marginTop: 16
  },
  monthTitle: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  yearTitle: {
    color: '#FFFFFF',
  },
  calendarHeader: {
    borderBottomWidth: 0,
  },
  blurBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    overflow: 'hidden', // To ensure no overflow beyond the border radius
  },
  blurBgImage: {
    // opacity: 0.5, // Optional: Adjust opacity to give a transparent effect
    resizeMode: 'cover', // Ensure the image covers the background properly
  },
  calendarContainer: {
    position: 'absolute',  // Absolute positioning to place it at the bottom
    bottom: 0,  // Ensure it's at the bottom
    left: 0,
    right: 0,
    height: '62%',
    justifyContent: 'flex-end'
  },
  linearGradient: {
    margin: height * 0.02,
    borderRadius: 8
  },
  image: {
    position: 'absolute',  // Position the image behind other content
    top: '50%',            // Vertically center the image
    left: '50%',           // Horizontally center the image
    transform: [
      { translateX: -width * 0.4 },  // Offset the width to center it correctly
      { translateY: -height * 0.22 }, // Offset the height to center it correctly
    ],
    width: width * 0.9,      // Set the image width to 80% of the screen width
    height: height * 0.4,    // Set the image height to 40% of the screen height
    resizeMode: 'contain',   // Ensure the image retains its aspect ratio
    zIndex: -1,
  },
  buttonContainer: {
    width: '100%',  // Ensure button container takes full width of the parent
    paddingHorizontal: 20, // Optional: Add padding if needed for the button container
  },
  progressBar: {
    height: 5,
    backgroundColor: '#6C3EB8',
    borderRadius: 5,
    width : '40%',
    alignSelf:'center'
  },
  progress: {
    width: '50%',
    height: '100%',
    backgroundColor: '#FF7500',
    borderRadius: 5,
  },
});

export default styles