import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import GradientText from './GradientText';

const Hyperlink = ({ message, linkText, onLinkPress, containerStyle}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={styles.text}>{message}</Text>
            <TouchableOpacity onPress={onLinkPress}>
                <GradientText gradientType={'purpleGradient'} style={styles.linkText}>{linkText}</GradientText>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flexDirection: 'row'
    },
    text: {
        fontSize: 14,
        marginTop: 6,
        textAlign: 'center',
        color: 'white',
    },
    linkText: {
        fontSize: 14,
        marginTop: 6,
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold'
    },
});

export default Hyperlink;