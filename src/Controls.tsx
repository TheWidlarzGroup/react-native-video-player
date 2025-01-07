import { Animated, StyleSheet } from 'react-native';
import type { VideoPlayerComponentProps } from './index';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { DurationText } from './controls/Duration';
import { Seekbar, type SeekbarProps } from './controls/Seekbar';
import { PlayButton } from './controls/PlayButton';
import { Mute } from './controls/Mute';
import { Fullscreen } from './controls/Fullscreen';

interface ControlsProps extends Omit<SeekbarProps, 'customStyles'> {
  customStyles: VideoPlayerComponentProps['customStyles'];
  showDuration: VideoPlayerComponentProps['showDuration'];
  disableFullscreen: VideoPlayerComponentProps['disableFullscreen'];
  animationValue: Animated.Value;
  duration: number;
  isPlaying: boolean;
  isMuted: boolean;
  onPlayPress: () => void;
  onMutePress: () => void;
  onToggleFullScreen: () => void;
  isControlsVisible: boolean;
}

export interface ProgressRef {
  onProgress: (progress: number) => void;
}

export interface ControlsRef extends ProgressRef {
  isSeeking: boolean;
}

export const Controls = forwardRef<ProgressRef, ControlsProps>(
  (
    {
      customStyles,
      onPlayPress,
      isPlaying,
      showDuration,
      onToggleFullScreen,
      duration,
      disableFullscreen,
      onMutePress,
      isMuted,
      animationValue,
      controlsTimeoutId,
      isControlsVisible,
      ...seekbarProps
    },
    ref
  ) => {
    const durationRef = useRef<ProgressRef>(null);
    const seekbarRef = useRef<ControlsRef>(null);

    useImperativeHandle(ref, () => ({
      onProgress: (progress) => {
        durationRef.current?.onProgress(progress);
        seekbarRef.current?.onProgress(progress);
      },
      isSeeking: seekbarRef.current?.isSeeking,
    }));

    const controlsTranslateY = animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [48, 0],
    });

    if (!isControlsVisible) {
      return (
        <Seekbar
          fullWidth={true}
          ref={seekbarRef}
          {...seekbarProps}
          isPlaying={isPlaying}
          controlsTimeoutId={controlsTimeoutId}
          duration={duration}
          seekBarBackgroundCustomStyles={customStyles?.seekBarBackground}
          seekBarCustomStyles={customStyles?.seekBar}
          seekBarFullWidthCustomStyles={customStyles?.seekBarFullWidth}
          seekBarKnobCustomStyles={customStyles?.seekBarKnob}
          seekBarKnobSeekingCustomStyles={customStyles?.seekBarKnobSeeking}
          seekBarProgressCustomStyles={customStyles?.seekBarProgress}
        />
      );
    }

    return (
      <Animated.View
        style={[
          styles.controls,
          customStyles?.controls,
          { transform: [{ translateY: controlsTranslateY }] },
        ]}
      >
        <PlayButton
          controlButtonCustomStyles={customStyles?.controlButton}
          playControlCustomStyles={customStyles?.playControl}
          isPlaying={isPlaying}
          onPlayPress={onPlayPress}
        />
        <Seekbar
          ref={seekbarRef}
          {...seekbarProps}
          isPlaying={isPlaying}
          controlsTimeoutId={controlsTimeoutId}
          duration={duration}
          seekBarBackgroundCustomStyles={customStyles?.seekBarBackground}
          seekBarCustomStyles={customStyles?.seekBar}
          seekBarFullWidthCustomStyles={customStyles?.seekBarFullWidth}
          seekBarKnobCustomStyles={customStyles?.seekBarKnob}
          seekBarKnobSeekingCustomStyles={customStyles?.seekBarKnobSeeking}
          seekBarProgressCustomStyles={customStyles?.seekBarProgress}
        />
        {showDuration && (
          <DurationText
            ref={durationRef}
            duration={duration}
            durationTextCustomStyles={customStyles?.durationText}
          />
        )}
        <Mute
          controlButtonCustomStyles={customStyles?.controlButton}
          controlIconCustomStyles={customStyles?.controlIcon}
          isMuted={isMuted}
          onMutePress={onMutePress}
        />
        {!disableFullscreen && (
          <Fullscreen
            onToggleFullScreen={onToggleFullScreen}
            controlButtonCustomStyles={customStyles?.controlButton}
            controlIconCustomStyles={customStyles?.controlIcon}
          />
        )}
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  controls: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    height: 48,
    marginTop: -48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  extraControl: {
    color: 'white',
    padding: 8,
  },
});
