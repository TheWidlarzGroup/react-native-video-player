import {
  type DimensionValue,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  StyleSheet,
  View,
} from 'react-native';
import type {
  CustomStyles,
  VideoPlayerComponentProps,
} from 'react-native-video-player';
import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { ProgressRef } from '../Controls';

const parsePadding = (value: DimensionValue, layoutWidth: number) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.endsWith('%')) {
    return (parseFloat(value) / 100) * layoutWidth;
  }
  return 0;
};

export interface SeekbarProps {
  autoplay: VideoPlayerComponentProps['autoplay'];
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  fullWidth?: boolean;
  disableSeek: VideoPlayerComponentProps['disableSeek'];
  showControls: () => void;
  onSeek: (progress: number) => void;
  controlsTimeoutId: NodeJS.Timeout | null;
  duration: number;
  // custom styles
  seekBarCustomStyles?: CustomStyles['seekBar'];
  seekBarFullWidthCustomStyles?: CustomStyles['seekBarFullWidth'];
  seekBarProgressCustomStyles?: CustomStyles['seekBarProgress'];
  seekBarKnobCustomStyles?: CustomStyles['seekBarKnob'];
  seekBarKnobSeekingCustomStyles?: CustomStyles['seekBarKnobSeeking'];
  seekBarBackgroundCustomStyles?: CustomStyles['seekBarBackground'];
}

export const Seekbar = memo(
  forwardRef<ProgressRef, SeekbarProps>(
    (
      {
        fullWidth,
        autoplay,
        isPlaying,
        setIsPlaying,
        disableSeek,
        showControls,
        controlsTimeoutId,
        onSeek,
        duration,
        seekBarCustomStyles,
        seekBarFullWidthCustomStyles,
        seekBarKnobCustomStyles,
        seekBarKnobSeekingCustomStyles,
        seekBarProgressCustomStyles,
        seekBarBackgroundCustomStyles,
      },
      ref
    ) => {
      const [tmpProgress, setTmpProgress] = useState<number | null>(null);
      const [progress, setProgress] = useState(0);
      const [isSeeking, setIsSeeking] = useState(false);

      useImperativeHandle(ref, () => ({
        onProgress: setProgress,
        isSeeking,
      }));

      const seekBarWidth = useRef<number>(200);
      const seekTouchStart = useRef<number>(0);
      const seekProgressStart = useRef<number>(0);
      const wasPlayingBeforeSeek = useRef<boolean>(autoplay || isPlaying);

      const _onSeekBarLayout = useCallback(
        ({ nativeEvent }: LayoutChangeEvent) => {
          const layoutWidth = nativeEvent.layout.width;
          const customStyle = seekBarCustomStyles;
          const paddingHorizontal = customStyle?.paddingHorizontal
            ? parsePadding(customStyle.paddingHorizontal, layoutWidth) * 2
            : 0;
          const paddingLeft = customStyle?.paddingLeft
            ? parsePadding(customStyle.paddingLeft, layoutWidth)
            : 0;
          const paddingRight = customStyle?.paddingRight
            ? parsePadding(customStyle.paddingRight, layoutWidth)
            : 0;

          const totalPadding = paddingHorizontal || paddingLeft + paddingRight;
          seekBarWidth.current = layoutWidth - totalPadding;
        },
        [seekBarCustomStyles]
      );

      const _onSeekGrant = useCallback(
        (e: GestureResponderEvent) => {
          seekTouchStart.current = e.nativeEvent.pageX;
          seekProgressStart.current = progress;
          wasPlayingBeforeSeek.current = isPlaying;
          setIsSeeking(true);
          setIsPlaying(false);
          if (controlsTimeoutId) clearTimeout(controlsTimeoutId);
        },
        [controlsTimeoutId, isPlaying, progress, setIsPlaying]
      );

      const _onSeekRelease = useCallback(() => {
        setIsSeeking(false);
        setIsPlaying(wasPlayingBeforeSeek.current);
        showControls();
        setTmpProgress(null);
      }, [showControls, setIsPlaying]);

      const _onSeek = useCallback(
        (e: GestureResponderEvent) => {
          const diff = e.nativeEvent.pageX - seekTouchStart.current;
          const ratio = 100 / seekBarWidth.current;
          const newProgress = seekProgressStart.current + (ratio * diff) / 100;
          const fixedProgress = Math.min(Math.max(newProgress, 0), 1);

          setProgress(fixedProgress);
          onSeek(newProgress * duration);
          setTmpProgress(newProgress);
        },
        [duration, onSeek]
      );

      return (
        <View
          style={[
            styles.seekBar,
            seekBarCustomStyles,
            fullWidth && styles.seekBarFullWidth,
            fullWidth && seekBarFullWidthCustomStyles,
          ]}
          onLayout={_onSeekBarLayout}
        >
          <View
            style={[
              !isNaN(progress) ? { flexGrow: tmpProgress ?? progress } : null,
              styles.seekBarProgress,
              seekBarProgressCustomStyles,
            ]}
          />
          {!fullWidth && !disableSeek && (
            <View
              style={[
                styles.seekBarKnob,
                seekBarKnobCustomStyles,
                isSeeking && styles.seekBarKnobSeeking,
                isSeeking && seekBarKnobSeekingCustomStyles,
              ]}
              hitSlop={{ top: 20, bottom: 20, left: 10, right: 20 }}
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderGrant={_onSeekGrant}
              onResponderMove={_onSeek}
              onResponderRelease={_onSeekRelease}
              onResponderTerminate={_onSeekRelease}
            />
          )}
          <View
            style={[
              styles.seekBarBackground,
              !isNaN(progress) ? { flexGrow: 1 - progress } : null,
              seekBarBackgroundCustomStyles,
            ]}
          />
        </View>
      );
    }
  )
);

const styles = StyleSheet.create({
  seekBar: {
    alignItems: 'center',
    height: 30,
    flexGrow: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginLeft: -10,
    marginRight: -5,
  },
  seekBarFullWidth: {
    marginLeft: 0,
    marginRight: 0,
    paddingHorizontal: 0,
    marginTop: -3,
    height: 3,
  },
  seekBarProgress: {
    height: 3,
    backgroundColor: '#F00',
  },
  seekBarKnob: {
    width: 20,
    height: 20,
    marginHorizontal: -8,
    marginVertical: -10,
    borderRadius: 10,
    backgroundColor: '#F00',
    transform: [{ scale: 0.8 }],
    zIndex: 1,
  },
  seekBarKnobSeeking: {
    transform: [{ scale: 1 }],
  },
  seekBarBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    height: 3,
  },
});
