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
    fontWeight: '500'
  },
  gradientTitle: {
    fontSize: 32,
    textAlign: 'left',
    color: 'white',
    fontWeight:'500',
    marginTop: -5
  },
  otpInput: {
    flex: 1,
    height: height * 0.09,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    textAlign: 'center',
    backgroundColor: colors.backgroundColor,
    color: 'white',
    marginHorizontal: 12,
    fontWeight:'bold',
    fontSize:18
  },
  error: {
    color: 'red',
    marginTop: 16,
    marginBottom: -16,
    textAlign: 'center',
  },
  resendotp: {
    fontSize: 14,
    marginTop: 24,
    textAlign: 'center',
    color: 'white',
  },
  codeContainer: {
    flexDirection: 'row',
    marginVertical: 48,
    justifyContent: 'space-between',
  }
});

export default styles