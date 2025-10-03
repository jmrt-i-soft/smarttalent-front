import { StyleSheet, Dimensions} from "react-native";
import { colors } from "../../Constants/colors";

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 36,
    marginBottom: 45,
    textAlign: 'center',
    color: 'white',
    // fontWeight: '500',
    marginTop: 16,
    width: '100%',
    fontFamily:'inter_28pt-SemiBold'
  },
  appName: {
    fontSize: 52,
    marginBottom: 60,
    textAlign: 'center',
    color: 'white',
    // fontWeight: '500',
    fontFamily:'Inter_ExtraBoldItalic',
    marginTop: 16,
    width: '100%'
  },
  continueWith: {
    fontSize: 12,
    color: 'white',
  },
  input: {
    height: 48,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 16,
    backgroundColor: colors.backgroundColor,
    color: 'white',
  },
  error: {
    color: 'red',
    marginBottom: 4,
    textAlign: 'center',
  },
  logo: {
    alignSelf: 'center',
    width: width * 0.3,   // 50% of the screen width
    height: width * 0.3,  // 50% of the screen width for a square image
    resizeMode: 'contain',
  },
  BtnStyle: {
    height: height * 0.065,
    borderRadius: 10,
    marginTop: height * 0.028,
    backgroundColor: '#E60E81',
    justifyContent:'center',
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 12, // Space between icon and text
  },
  icon: {
    width: 24, // Adjust size based on your design
    height: 24,
    tintColor: "white", // Optional: to make the icon white
  },
  text: {
    color: "white",
    fontSize: 16,
    fontFamily:'Inter_ExtraBoldItalic'
  },
});

export default styles