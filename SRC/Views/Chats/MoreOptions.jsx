import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Icon from "react-native-vector-icons/MaterialIcons"; // Feather includes "more-vertical"
import LANGUAGE_DATA from '../../Constants/language';
export default function MoreOptions({showProfile, showVideoProfile,ConfirmBeforeCloseChat}) {
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    console.log(isModalVisible);
    setModalVisible(!isModalVisible);
  };


  return (
    <View style={styles.container}>
      
      <TouchableOpacity onPress={toggleModal}>
        <Icon name="more-vert" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        backdropOpacity={0.3}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={() => { toggleModal(); showProfile(); }}>
            <Text style={styles.optionText}>{LANGUAGE_DATA.Profile}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => { toggleModal(); showVideoProfile(); }}>
            <Text style={styles.optionText}>{LANGUAGE_DATA.videoProfile}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { toggleModal(); ConfirmBeforeCloseChat(); }}>
            <Text style={styles.optionText}>{LANGUAGE_DATA.end_chat}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end', 
    padding: 10
  },
  modalContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    margin: 10, // Fullscreen transparent background
    paddingTop: 100,
    paddingRight: 15,
  },
  modalContent: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  optionText: {
    padding: 12,
    fontSize: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
});
