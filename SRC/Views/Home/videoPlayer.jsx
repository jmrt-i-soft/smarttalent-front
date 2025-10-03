import React,{useState} from 'react'
import Video from "react-native-video";
import Slider from "@react-native-community/slider";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  const { width, height } = Dimensions.get("window");

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
export const VideoComponent = React.memo(({ item, index, currentIndex, setBufferingStates, bufferingStates }) => {
 const videoRefs = React.useRef([]);
  //  console.log('item.....',item)
//console.log('item.....',videoRefs)
    const [isPlaying, setIsPlaying] = useState(true); // For play/pause
    const [currentTime, setCurrentTime] = useState(0); // Current playback position
    const [videoDuration, setVideoDuration] = useState(0); // Total video duration
  
    const togglePlayPause = () => {
      const videoRef = videoRefs.current[index];
     // console.log('.......',videoRef)
      if (videoRef) {
        if (isPlaying) {
          videoRef.pause();
        } else {
          videoRef.resume();
        }
        setIsPlaying(!isPlaying);
      }
    };
  
    const handleSeek = (value) => {
      const videoRef = videoRefs.current[index];
      if (videoRef) {
        videoRef.seek(value);
        setCurrentTime(value);
      }
    };
  
    const handleProgress = ({ currentTime }) => {
      setCurrentTime(currentTime);
    };
  
    const handleLoad = ({ duration }) => {
      setVideoDuration(duration);
    };
  
    return (
      <View style={styles.videoContainer} key={item.id}>
        <Video
          ref={(ref) => (videoRefs.current[index] = ref)}
          source={{ uri: item.uri }}
          // source={{ uri: item.uri }}
          style={styles.video}
          resizeMode="cover"
          repeat
          paused={currentIndex !== index || !isPlaying} // Pause if not in focus
          controls={false}
          onProgress={handleProgress} // Tracks current time
          onLoad={handleLoad} // Fetch total duration
          onBuffer={({ isBuffering }) => {
            setBufferingStates((prev) => {
              const newStates = [...prev];
              newStates[index] = isBuffering;
              return newStates;
            });
          }}
          onError={(error) =>
            console.error(`Video playback error on item ${item.id}:`, error)
          }
        />
        {/* Show loader if buffering */}
        {bufferingStates[index] && currentIndex === index && (
          <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        )}
  
        {/* Overlaid UI elements */}
        <View style={styles.overlayContainer}>
          {/* Profile section */}
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: "https://via.placeholder.com/50" }}
              style={styles.profileImage}
            />
            <Text style={styles.username}>@Karenne</Text>
            <TouchableOpacity style={styles.profileButton}>
              <Text style={styles.profileButtonText}>Voir le profil</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.playPauseButton} onPress={togglePlayPause}>
            <Image
              source={
                isPlaying
                  ? { uri: "https://via.placeholder.com/60?text=Pause" } // Replace with play/pause icons
                  : { uri: "https://via.placeholder.com/60?text=Play" }
              }
              style={styles.playPauseIcon}
            />
          </TouchableOpacity>
  
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {formatTime(currentTime)} / {formatTime(videoDuration)}
            </Text>
          </View>
  
          {/* Seekbar */}
          <View style={styles.seekBarContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={videoDuration}
              value={currentTime}
              minimumTrackTintColor="#ff007f"
              maximumTrackTintColor="#ffffff"
              thumbTintColor="#ff007f"
              onValueChange={handleSeek}
            />
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>
                {formatTime(currentTime)} / {formatTime(videoDuration)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  });


const styles = StyleSheet.create({
    videoContainer: {
      width,
      height,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#000",
    },
    video: {
      width,
      height,
      position: "absolute",
    },
    loader: {
      position: "absolute",
      top: height / 2 - 20,
      left: width / 2 - 20,
    },
    overlayContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      width,
      height,
      justifyContent: "space-between",
      padding: 16,
    },
    profileContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 10,
    },
    username: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    profileButton: {
      backgroundColor: "#ff007f",
      borderRadius: 20,
      paddingVertical: 4,
      paddingHorizontal: 10,
      marginLeft: 10,
    },
    profileButtonText: {
      color: "#fff",
      fontSize: 14,
    },
    actionsContainer: {
      position: "absolute",
      right: 16,
      bottom: 200,
      alignItems: "center",
    },
    actionButton: {
      marginBottom: 10,
    },
    actionIcon: {
      width: 32,
      height: 32,
    },
    actionCount: {
      color: "#fff",
      fontSize: 14,
      marginBottom: 10,
    },
    captionContainer: {
      position: "absolute",
      bottom: 60,
      left: 16,
    },
    captionText: {
      color: "#fff",
      fontSize: 14,
    },
    playPauseButton: {
      position: "absolute",
      top: "45%",
      left: "45%",
      zIndex: 10,
    },
    playPauseIcon: {
      width: 60,
      height: 60,
    },
    seekBarContainer: {
      position: "absolute",
      bottom: 100,
      left: 0,
      right: 0,
      flexDirection: "column",
      alignItems: "center",
    },
    slider: {
      width: "95%",
      height: 40,
    },
    timeContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "88%",
      marginTop: -10,
    },
    timeText: {
      color: "#fff",
      fontSize: 12,
    },
  });
  