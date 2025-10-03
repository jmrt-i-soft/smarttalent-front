import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../../Constants/colors";

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  error: {
    color: 'red',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    marginVertical: 24,
    textAlign: 'left',
    color: 'white',
  },
  addBtn: {
    marginBottom: 16,
    // width: '24%',
    alignSelf: 'flex-end',
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 2,
    backgroundColor: '#E60E81'
  },
  BtnText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 4,
  },
  inputStyle: {
    paddingVertical: 4,
    paddingHorizontal: 1,
    color: 'white',
    fontSize: 16
  },
  switchContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 10,
  },
  label: {
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
  footerText: {
    fontSize: 12.5,
    color: "#d0cde1",
    marginVertical: 20,
    textAlign:'center'
  },
  startButton: {
    width: "100%",
    position: "absolute", // Makes the button fixed to the bottom
    bottom: 20, // Space from the bottom
    alignSelf: "center", // Centers the button horizontally
    display: 'flex',
  }
});

export default styles