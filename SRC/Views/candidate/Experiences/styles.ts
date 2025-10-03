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
  listView: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.backgroundColor,
  },
  labelStyle: {
    fontSize: 12,
    color: colors.greyText,
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
  leftError: {
    color: 'red',
    marginBottom: 8,
    fontSize: 12
  },
  viewStyle:{
   display: 'flex',
   flexDirection:'row',
   justifyContent: 'space-between'
  }
});

export default styles