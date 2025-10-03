import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Alert, BackHandler } from 'react-native';
import { RNCamera } from 'react-native-camera';
import styles from './styles'
import GradientButton from '../../../Common/component/GradientButton';
import { useFocusEffect } from '@react-navigation/native';

const RecordVideo = ({ navigation }) => {
    const cameraRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [recording, setRecording] = useState(false);
    const [duration, setDuration] = useState(0); // Recording duration

    // Start countdown on screen load
    useEffect(() => {
        let timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(timer);
                    startRecording();
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        let durationInterval: string | number | NodeJS.Timeout | undefined;

        // Start the duration timer when recording
        if (recording) {
            durationInterval = setInterval(() => {
                setDuration((prev) => prev + 1);
            }, 1000);
        }

        // Cleanup timer when recording stops
        return () => {
            if (durationInterval) {
                clearInterval(durationInterval);
            }
        };
    }, [recording]);

    const startRecording = async () => {
        if (cameraRef.current) {
            try {
                setRecording(true); // Update recording state
                setIsRecording(true);
                const { uri } = await cameraRef.current.recordAsync({
                    maxDuration: 60, // Set max duration
                });
                // Alert.alert("Video Saved", `Saved to: ${uri}`);
                console.log("Video URI: ", uri);
                handleSave(uri); // Pass the URI to handleSave
            } catch (error) {
                console.error("Error recording video: ", error);
                setRecording(false);
            } finally {
                setIsRecording(false);
                setRecording(false);
                setDuration(0); // Reset duration
            }
        }
    };

    const stopRecording = () => {
        if (cameraRef.current && isRecording) {
            cameraRef.current.stopRecording();
        }
    };

    // Format duration into 0:00 (minutes:seconds)
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    // Navigate to video playback screen
    const handleSave = (recordedUri) => {
        if (recordedUri) {
            // navigation.navigate("PlaybackScreen", { videoUri: recordedUri });
            navigation.replace("PlaybackScreen", { videoUri: recordedUri });
        }
    };

    const handleBackPress = () => {
        Alert.alert(
            "Do you want to end the recording?",
            "",
            [
                {
                    text: "No",
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: () => {
                        stopRecording();
                        // navigation.goBack();
                    },
                },
            ],
            { cancelable: false }
        );
        return true; // Prevent default back action
    };

    // Handle hardware back button press
    useFocusEffect(
        React.useCallback(() => {
            const backHandler = BackHandler.addEventListener(
                "hardwareBackPress",
                handleBackPress
            );
            return () => backHandler.remove();
        }, [isRecording])
    );

    return (
        <View style={styles.container}>

            {/* Countdown Timer */}
            {!recording && countdown > 0 && (
                <View style={styles.countdownContainer}>
                    <Text style={styles.countdownText}>{countdown}</Text>
                </View>
            )}

            {/* Recording Duration */}
            {recording && (
                <View style={styles.durationContainer}>
                    <Text style={styles.durationText}>{formatDuration(duration)}</Text>
                </View>
            )}

            <RNCamera
                ref={cameraRef}
                style={styles.camera}
                type={RNCamera.Constants.Type.front}
                captureAudio={true}
                flashMode={RNCamera.Constants.FlashMode.auto}
                androidCameraPermissionOptions={{
                    title: "Camera Permission",
                    message: "We need access to your camera",
                    buttonPositive: "OK",
                    buttonNegative: "Cancel",
                }}
                androidRecordAudioPermissionOptions={{
                    title: "Audio Permission",
                    message: "We need access to your microphone",
                    buttonPositive: "OK",
                    buttonNegative: "Cancel",
                }}
            />

            <View style={styles.startButton}>
                <GradientButton title="Stop" onPress={stopRecording} />
            </View>
        </View>
    );
};

export default RecordVideo;