import { memo } from 'react';
import type { CustomStyles } from 'react-native-video-player';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

interface MuteProps {
  controlButtonCustomStyles: CustomStyles['controlButton'];
  controlIconCustomStyles: CustomStyles['controlIcon'];
  isMuted: boolean;
  onMutePress: () => void;
}

export const Mute = memo(
  ({
    isMuted,
    onMutePress,
    controlButtonCustomStyles,
    controlIconCustomStyles,
  }: MuteProps) => {
    return (
      <TouchableOpacity
        onPress={onMutePress}
        style={[styles.extraControl, controlButtonCustomStyles]}
      >
        <Image
          style={controlIconCustomStyles}
          source={
            isMuted
              ? require('../img/volume_off.png')
              : require('../img/volume_on.png')
          }
        />
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  extraControl: {
    color: 'white',
    padding: 8,
  },
});
