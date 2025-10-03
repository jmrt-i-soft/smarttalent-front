import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../../Constants/colors";

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
  error: {
    color: 'red',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 16,
    textAlign: 'left',
    color: 'white',
  },
  addBtn: {
    marginVertical: 10,
    width: '24%',
    alignSelf: 'flex-end',
    borderRadius: 5,
    backgroundColor: '#E60E81'
  },
  BtnText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 4,
  },
  nextButton: {
    position: 'absolute',  // Fixes the button's position in the container
    bottom: 20,
    left: 20,
    right: 20,
  },
  dropdownContainer: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 16,
    backgroundColor: colors.backgroundColor,
    color: 'white',
  },
  dropdown: {
    color: 'white',
  },
  workMode: {
    marginTop: 8,
    textAlign: 'left',
    color: 'white',
    fontSize: 16,
  },
  selectedImage: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: colors.backgroundColor,
    flex: 1,
    color: 'white',
    textAlignVertical: 'center',
    paddingStart: 16,
    marginEnd: 16
  },
  BtnStyle: {
    height: height * 0.065,
    borderRadius: 10,
    // marginTop: height * 0.028,
    backgroundColor: '#E60E81',
    justifyContent: 'center',
    alignItems: "center",
    flex: 1,
    marginStart: 16
  },
  searchError: {
    color: 'red',
    marginBottom: 8,
    fontSize: 12
  },
});

export default styles