import {launchImageLibrary} from 'react-native-image-picker';
import {Video} from 'react-native-compressor';
import {Alert, Platform} from 'react-native';
import {getVideoMetaData} from 'react-native-compressor';
import { navigateResetParam } from '../../Common/navigate';
export const pickAndUploadVideo = async (navigation) => {
    const getVideoDuration = async (uri) => {
  const meta = await getVideoMetaData(uri);
  return meta.duration; // in seconds
};
  launchImageLibrary(
    {
      mediaType: 'video',
      videoQuality: 'medium',
    },
    async (response) => {
      if (response.didCancel) return;
      const asset = response.assets?.[0];
      if (!asset?.uri) return;

      try {
        // Get video duration
        const duration = await getVideoDuration(asset.uri);
        console.log('............',duration)
        if (duration > 60) {
          Alert.alert('Error', 'Please select a video shorter than 1 minute.');
          return;
        }

        // Compress the video
        const compressedUri = await Video.compress(asset.uri, {
          compressionMethod: 'auto',
        });

        // Upload it
        // const formData = new FormData();
        // formData.append('video', {
        //   uri: Platform.OS === 'ios' ? compressedUri.replace('file://', '') : compressedUri,
        //   name: asset.fileName || 'upload.mp4',
        //   type: asset.type || 'video/mp4',
        // });

        const recordedUri =  Platform.OS === 'ios' ? compressedUri.replace('file://', '') : compressedUri;

        console.log('..........................',recordedUri)
       if (recordedUri) {
            // navigation.navigate("PlaybackScreen", { videoUri: recordedUri });
            navigateResetParam(navigation,"PlaybackScreen", { videoUri: recordedUri });
        }
        //Alert.alert('Success', 'Video uploaded successfully!');
      } catch (err) {
        console.error(err);
        Alert.alert('Upload failed', err.message);
      }
    }
  );
};