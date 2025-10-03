import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '../../Constants/colors';

const Chips = ({ items, onRemove }) => {
  return (
    <View style={styles.chipsContainer}>
      {items.map((item) => (
        <View key={item.value} style={styles.chip}>
          <Text style={styles.chipText}>{item.label}</Text>
          <TouchableOpacity onPress={() => onRemove(item.value)} style={styles.crossIcon}>
            <Image
              source={require('../../../assets/ic_close.png')} // Replace with your cross icon image
              style={styles.closeImage}
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  chipText: {
    color: 'white',
    fontSize: 12,
    marginRight: 5,
  },
  crossIcon: {
    marginLeft: 5,
  },
  closeImage: {
    width: 12,
    height: 12,
    tintColor: 'grey',
  },
});

export default Chips;