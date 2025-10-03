import React from 'react';
import { View, StyleSheet } from 'react-native';

const Progressbar = ({ progress = 0, barStyle, progressStyle }) => {
    return (
        <View style={[styles.progressBar, barStyle]}>
            <View style={[styles.progress, { width: `${progress}%` }, progressStyle]} />
        </View>
    );
};

const styles = StyleSheet.create({
    progressBar: {
        height: 5,
        width: '42%',
        backgroundColor: '#6C3EB8',
        borderRadius: 5,
        overflow: 'hidden',
        alignSelf: 'center'
    },
    progress: {
        height: '100%',
        backgroundColor: '#FF7500', // Default progress color
        borderRadius: 5,
    },
});

export default Progressbar;
