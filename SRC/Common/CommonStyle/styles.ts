import { Dimensions, StyleSheet } from "react-native";
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
    fontWeight: '500',
  },
  gradientTitle: {
    fontSize: 32,
    textAlign: 'left',
    color: 'white',
    fontWeight:'500',
    marginTop: -5,
    paddingBottom: 16,
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
  subtitle: {
    textAlign: 'left',
    color: 'white',
    letterSpacing: 1,
    paddingBottom: 16,
  },
  fontSizeStyle:{
    fontSize: 25,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 48,
    padding: 10,
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    justifyContent: 'space-around',
  },
  logoutText: {
    color: '#fff',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  profileIcon: {
    position: 'absolute',
    top: 36,
    right: 16,
    // flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    alignSelf: 'center',
    width: width * 0.1,
    height: width * 0.1,
    resizeMode: 'contain',
    marginTop: 16,
    marginBottom: 4
  },
  backgroudView: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.backgroundColor,
  },
  noChatContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
    color: '#fff',
  },
  chatViewStyle:{ width: '100%', flexDirection: 'row' },
  marginTop15:{marginTop:15},
});

export default styles