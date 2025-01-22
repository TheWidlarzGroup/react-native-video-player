import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import type { CustomStyles } from 'react-native-video-player';
import { memo } from 'react';

interface PlayButtonProps {
  controlButtonCustomStyles?: CustomStyles['controlButton'];
  playControlCustomStyles?: CustomStyles['playControl'];
  isPlaying: boolean;
  onPlayPress: () => void;
}

export const PlayButton = memo(
  ({
    isPlaying,
    onPlayPress,
    playControlCustomStyles,
    controlButtonCustomStyles,
  }: PlayButtonProps) => {
    return (
      <TouchableOpacity
        onPress={onPlayPress}
        style={[
          styles.playControl,
          controlButtonCustomStyles,
          playControlCustomStyles,
        ]}
      >
        <Image
          source={
            isPlaying ? require('../img/pause.png') : require('../img/play.png')
          }
        />
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  playControl: {
    color: 'white',
    padding: 8,
  },
});
