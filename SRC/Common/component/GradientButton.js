import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from "../../Constants/colors";

const { width, height } = Dimensions.get('window');

const GradientButton = ({ title, onPress }) => {
    return (
        <LinearGradient
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            colors={[colors.buttonGradientStart, colors.buttonGradientEnd]}
            style={styles.linearGradient} >

            <TouchableOpacity onPress={onPress} >
                <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    linearGradient: {
        marginTop: height * 0.04,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 16,
        textAlign: 'center',
        color: 'white',
        padding: 10
    },
});

export default GradientButton;