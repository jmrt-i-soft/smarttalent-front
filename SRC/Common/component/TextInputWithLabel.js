import React from 'react';
import { Text, StyleSheet, View, Image, Dimensions, TextInput } from 'react-native';
import { images } from '../../../assets/images';
import { colors } from '../../Constants/colors';

const { width, height } = Dimensions.get('window');

const TextInputWithLabel = ({ label, placeholder, value, onTextChange, keyboardType = 'default', secureEntry = false, style }) => {

    return (
        <View style={[styles.container, style]}>
            <Text style={styles.labelStyle}>{label}</Text>
            <TextInput
                style={[styles.inputStyle, style]}
                placeholder={placeholder}
                value={value}
                onChangeText={onTextChange}
                placeholderTextColor={"#FFF"}
                secureTextEntry={secureEntry}
                keyboardType={keyboardType}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    labelStyle: {
        fontSize: 10,
        color: colors.greyText,
    },
    container: {
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: colors.backgroundColor,
    },
    inputStyle: {
        paddingVertical: 4,
        paddingHorizontal: 1,
        color: 'white',
        fontSize: 16,
        textAlignVertical:'top'
    }
});

export default TextInputWithLabel;