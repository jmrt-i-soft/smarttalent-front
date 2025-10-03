import React, {useState} from 'react';
import { Text, StyleSheet, View, Button, Dimensions, Platform, TouchableOpacity } from 'react-native';

import { colors } from '../../Constants/colors';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width, height } = Dimensions.get('window');

const TextInputDatePickerWithLabel = ({ label, placeholder, value, onTextChange, keyboardType = 'default', secureEntry = false, style, setStartDate, startDate }) => {
    const [show, setShow] = useState(false);
    const onChange = (event, selectedDate) => {
        // Hide picker after selection
        if (selectedDate) {
            setStartDate(selectedDate);
        }
    };
    return (
        <View style={[styles.container, style]}>
            <Text style={styles.labelStyle}>{label}</Text>
            <TouchableOpacity onPress={()=>setShow(true)}>
            <Text style={[styles.inputStyle, style]}>{value}</Text>
            </TouchableOpacity>
            {/* <TextInput
                style={[styles.inputStyle, style]}
                placeholder={placeholder}
                value={value}
                onChangeText={onTextChange}
                placeholderTextColor={"#FFF"}
                secureTextEntry={secureEntry}
                onFocus={() => setShow(true)}
            /> */}
            {show && (
                <View>
                            <DateTimePicker
                                value={startDate}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                onChange={onChange}
                              themeVariant="dark" // or "light"
                              locale="fr-FR"
                            />
                             <Button
      title="Sélectionner la date"
      onPress={()=> {setShow(false)} }
    />
                            </View>
                        )}
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

export default TextInputDatePickerWithLabel;