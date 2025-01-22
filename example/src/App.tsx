import { useRef } from 'react';
import {
  View,
  Text,
  Button,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import VideoPlayer, { type VideoPlayerRef } from 'react-native-video-player';
import { ReactScan } from 'react-scan/native';

const App = () => {
  const playerRef = useRef<VideoPlayerRef>(null);
  const progress = useRef(0);

  return (
    <SafeAreaView>
      <ReactScan
        options={{
          enabled: Platform.OS === 'ios',
        }}
      >
        <Text style={{ fontSize: 22, marginTop: 22 }}>
          React Native Video Player
        </Text>
        <VideoPlayer
          endWithThumbnail
          thumbnail={{
            uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
          }}
          // pauseOnPress={true}
          // autoplay={true}
          // repeat={true}
          source={{
            uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          }}
          renderLoader={() => (
            <View
              style={{
                flex: 1,
                backgroundColor: 'black',
                justifyContent: 'center',
              }}
            >
              <ActivityIndicator size={'large'} />
            </View>
          )}
          controlsTimeout={2000}
          onProgress={({ currentTime }) => {
            progress.current = currentTime;
          }}
          onError={(e) => console.log(e)}
          showDuration={true}
          ref={playerRef}
        />
        <View style={styles.btnContainer}>
          <Button onPress={() => playerRef.current?.stop()} title="Stop" />
          <Button onPress={() => playerRef.current?.pause()} title="Pause" />
          <Button onPress={() => playerRef.current?.resume()} title="Resume" />
          <Button
            onPress={() => playerRef.current?.seek(progress.current + 10)}
            title="Seek"
          />
          <Button
            onPress={() => playerRef.current?.setFullScreen(true)}
            title="Open fullscreen"
          />
        </View>
      </ReactScan>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  btnContainer: {
    gap: 10,
    margin: 20,
  },
});
