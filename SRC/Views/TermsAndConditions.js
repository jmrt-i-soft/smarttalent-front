import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Markdown from 'react-native-markdown-display'; // npm i react-native-markdown-display

const TermsAgreement = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [termsData, setTermsData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch Terms from API
  const fetchTerms = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://yourapi.com/api/terms');
      const data = await res.json();
      setTermsData(data);
    } catch (error) {
      console.error('Error fetching terms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Open modal and load terms
  const openTerms = () => {
    setModalVisible(true);
    if (!termsData) fetchTerms();
  };

  const handleSubmit = () => {
    if (isChecked) {
      alert('✅ Form submitted successfully!');
    } else {
      alert('⚠️ Please agree to the Terms & Conditions first.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Checkbox Row */}
      <View style={styles.checkboxRow}>
        <CheckBox
          value={isChecked}
          onValueChange={setIsChecked}
          tintColors={{ true: '#007AFF', false: '#999' }}
        />
        <Text style={styles.checkboxText}>
          I agree to{' '}
          <Text style={styles.linkText} onPress={openTerms}>
            Terms & Conditions
          </Text>
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitBtn, !isChecked && styles.disabledBtn]}
        onPress={handleSubmit}
        disabled={!isChecked}
      >
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>

      {/* Terms Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
          ) : termsData ? (
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <Text style={styles.modalDate}>
                Last updated: {termsData.lastUpdated}
              </Text>
              <Markdown>{termsData.content}</Markdown>
              <View style={{ height: 40 }} />
            </ScrollView>
          ) : (
            <Text style={{ padding: 20, color: 'red' }}>
              Failed to load Terms & Conditions.
            </Text>
          )}

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxText: {
    fontSize: 16,
    color: '#333',
  },
  linkText: {
    color: '#007AFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  submitBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#ccc',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalScroll: {
    padding: 20,
    paddingBottom: 60,
  },
  modalDate: {
    fontSize: 14,
    color: '#777',
    marginBottom: 16,
  },
  closeBtn: {
    backgroundColor: '#007AFF',
    padding: 14,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TermsAgreement;