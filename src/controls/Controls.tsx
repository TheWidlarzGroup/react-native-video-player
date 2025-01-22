import type { VideoPlayerComponentProps } from '../index';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { DurationText } from './Duration';
import { Seekbar, type SeekbarProps } from './Seekbar';
import { PlayButton } from './PlayButton';
import { Mute } from './Mute';
import { Fullscreen } from './Fullscreen';
import { AnimatedWrapper, type AnimationRef } from './ControlsAnimatedWrapper';

interface ControlsProps
  extends Omit<SeekbarProps, 'customStyles' | 'onSeeking'> {
  customStyles: VideoPlayerComponentProps['customStyles'];
  showDuration: VideoPlayerComponentProps['showDuration'];
  disableFullscreen: VideoPlayerComponentProps['disableFullscreen'];
  animationDuration: number;
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
      animationDuration,
      controlsTimeoutId,
      isControlsVisible,
      ...seekbarProps
    },
    ref
  ) => {
    const durationRef = useRef<ProgressRef>(null);
    const seekbarRef = useRef<ProgressRef>(null);
    const animationRef = useRef<AnimationRef>(null);

    useImperativeHandle(ref, () => ({
      onProgress: (progress) => {
        durationRef.current?.onProgress(progress);
        seekbarRef.current?.onProgress(progress);
      },
      runControlsAnimation: (toValue: number, callback?: () => void) => {
        animationRef.current?.runControlsAnimation(toValue, callback);
      },
    }));

    if (!isControlsVisible) {
      return (
        <Seekbar
          fullWidth={true}
          ref={seekbarRef}
          {...seekbarProps}
          onSeeking={(progress) => durationRef.current?.onProgress(progress)}
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
      <AnimatedWrapper
        ref={animationRef}
        animationDuration={animationDuration}
        customStylesControls={customStyles?.controls}
      >
        <PlayButton
          controlButtonCustomStyles={customStyles?.controlButton}
          playControlCustomStyles={customStyles?.playControl}
          isPlaying={isPlaying}
          onPlayPress={onPlayPress}
        />
        <Seekbar
          fullWidth={!isControlsVisible}
          ref={seekbarRef}
          {...seekbarProps}
          onSeeking={(progress) => durationRef.current?.onProgress(progress)}
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
      </AnimatedWrapper>
    );
  }
);
