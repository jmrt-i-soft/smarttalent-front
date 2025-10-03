import { StyleSheet } from "react-native";
import { colors } from "../../../Constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  error: {
    color: 'red',
    marginBottom: 4,
    fontSize: 12
  },
  workMode: {
    marginTop: 16,
    textAlign: 'left',
    color: 'white',
    fontSize: 16,
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
  switchContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 10,
  },
  label: {
    color: 'white',
  },
  selectedSkills: {
    color: 'white',
    fontWeight:'700',
    marginVertical: 8,
    textAlign: 'left',
  },
});

export default styles