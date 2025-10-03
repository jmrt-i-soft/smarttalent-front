import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../../Constants/colors";

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: 'black',
  },
  camera: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
  },
  controls: {
      flexDirection: 'row',
      justifyContent: 'center',
      padding: 20,
  },
  button: {
      backgroundColor: 'red',
      padding: 15,
      borderRadius: 50,
  },
  buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
  },
  startButton: {
      width: "94%",
      position: "absolute", // Makes the button fixed to the bottom
      bottom: 20, // Space from the bottom
      alignSelf: "center", // Centers the button horizontally
  },
  countdownContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 10,
  },
  countdownText: {
      fontSize: 175,
      fontWeight: "bold",
      color: "rgba(255, 255, 255, 0.5)"
  },
  durationContainer: {
      position: "absolute",
      top: 24,
      left: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent black
      padding: 10,
      borderTopEndRadius: 20,
      borderBottomEndRadius: 20,
      zIndex: 11,
  },
  durationText: {
      color: 'white',
      fontSize: 18,
      fontWeight: "bold",
  },
});

export default styles