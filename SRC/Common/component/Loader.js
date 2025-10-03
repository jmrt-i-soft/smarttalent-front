// Loader.js
import React from 'react';
import { View, ActivityIndicator, Modal, StyleSheet} from 'react-native';
import { colors } from '../../Constants/colors';

const Loader = ({ visible }) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.modalBackground}>
        <ActivityIndicator size="large" color={colors.buttonGradientStart} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
});

export default Loader;