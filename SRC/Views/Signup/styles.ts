import { StyleSheet, Dimensions} from "react-native";
import { colors } from "../../Constants/colors";
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    title: {
      fontSize: 32,
      textAlign: 'left',
      color: 'white',
      fontWeight:'500',
      includeFontPadding: false
    },
    gradientTitle:{
      fontSize: 32,
      marginBottom: height * 0.021,
      textAlign: 'left',
      color: 'white',
      fontWeight:'500',
      marginTop: -5,
      includeFontPadding: false
    },
    input: {
      height: height * 0.064,
      borderColor: 'gray',
      borderWidth: 1,
      marginVertical: height * 0.01,
      paddingHorizontal: 10,
      borderRadius: 8,
      backgroundColor: colors.backgroundColor,
      color: 'white',
    },
    error: {
      fontSize:10,
      color: 'red',
      textAlign: 'center',
    },
    createAccount: {
      fontSize: 14,
      marginTop: 4,
      textAlign: 'center',
      color: 'white',
    },
    clickableText: {
      fontSize: 14,
      marginTop: 4,
      textAlign: 'center',
      color: 'white',
      fontWeight: 'bold'
    },
    userType: {
      color: 'white',
      marginBottom: 4,
      textAlign: 'center',
    },
    eyeButton: {
      padding: 10,
    },
    eyeText: {
      fontSize: 18,
    },
    passwordContainer: {
      flexDirection: 'row',
      height: height * 0.064,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 12,
      paddingHorizontal: 10,
      borderRadius: 8,
      marginTop: height * 0.01,
      backgroundColor: colors.backgroundColor,
      color: 'white',
    },
    passwordInput: {
      flex: 1,
      color: 'white',
    },
  });
  export default styles