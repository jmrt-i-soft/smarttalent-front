
import React, {useRef,useEffect} from "react"
import Video from "react-native-video";

export default VideoComponent = ({card, styles, currentCard, index})=>{
const videoRef = useRef(null)
    useEffect(()=>{
     // console.log('videoRef.current.paused',videoRef.current);

    ()=> videoRef.current.pause()
    },[])
    return  <Video
    source={{ uri: card.videoUrl }}
    style={styles.video}
    resizeMode="cover"
    repeat
    paused={currentCard !== card.id - 1} // Pause if not the current card
    key={index}
    ref={videoRef}
  />
}