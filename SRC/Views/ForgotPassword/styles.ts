import { StyleSheet } from "react-native";
import { colors } from "../../Constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 32,
    textAlign: 'left',
    color: 'white',
    fontWeight:'500'
  },
  gradientTitle: {
    fontSize: 32,
    textAlign: 'left',
    color: 'white',
    fontWeight:'500',
    marginTop: -5
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
    marginVertical: 24,
    textAlign: 'left',
    color: 'white',
    letterSpacing: 1
  },
  roleTitle: {
    marginVertical: 4,
    textAlign: 'left',
    color: 'white',
  },
});

export default styles