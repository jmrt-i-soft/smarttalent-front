import { StyleSheet, Dimensions } from "react-native";
import { colors } from "../../Constants/colors";

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    padding: 16,
    marginTop: 8
  },
  title: {
    fontSize: 52,
    marginBottom: height * 0.06,
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
    marginTop: 16,
    width: '100%'
  },
  titleLogin: {
    fontSize: 22,
    marginBottom: height * 0.06,
    textAlign: 'center',
    color: 'white',
    fontWeight: '500',
    marginTop: 4,
    width: '100%'
  },
  forgotPassword: {
    fontSize: 12,
    marginTop: 4,
    // marginBottom: 24,
    textAlign: 'right',
    color: 'white',
  },
  forgotbutton: {
    width: '50%',
    alignSelf: 'flex-end',
    // alignItems: 'center'
  },
  continueWith: {
    fontSize: 12,
    color: 'white',
  },
  input: {
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
  error: {
    fontSize: 10,
    color: 'red',
  },
  logo: {
    alignSelf: 'center',
    width: width * 0.3,
    height: width * 0.3,
    resizeMode: 'contain'
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