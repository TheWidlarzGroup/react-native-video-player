import {
  useState,
  useCallback,
  forwardRef,
  useMemo,
  useRef,
  useImperativeHandle,
} from 'react';
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
  type ImageStyle,
} from 'react-native';
import {
  ResizeMode,
  type OnProgressData,
  type OnLoadData,
  type VideoRef,
  type ReactVideoProps,
  type ReactVideoSource,
} from 'react-native-video';
import { StartButton, Thumbnail } from './Thumbnail';
import { RenderVideo, type VideoInternalRef } from './Video';

export interface VideoPlayerRef extends VideoRef {
  stop: () => void;
}

export interface CustomStyles {
  wrapper?: StyleProp<ViewStyle>;
  video?: StyleProp<ViewStyle>;
  videoWrapper?: StyleProp<ViewStyle>;
  controls?: StyleProp<ViewStyle>;
  playControl?: StyleProp<ViewStyle>;
  controlButton?: StyleProp<ViewStyle>;
  controlIcon?: StyleProp<ImageStyle>;
  playIcon?: StyleProp<ViewStyle>;
  seekBar?: ViewStyle;
  seekBarFullWidth?: StyleProp<ViewStyle>;
  seekBarProgress?: StyleProp<ViewStyle>;
  seekBarKnob?: StyleProp<ViewStyle>;
  seekBarKnobSeeking?: StyleProp<ViewStyle>;
  seekBarBackground?: StyleProp<ViewStyle>;
  thumbnail?: StyleProp<ViewStyle>;
  playButton?: StyleProp<ViewStyle>;
  playArrow?: StyleProp<ImageStyle>;
  durationText?: StyleProp<TextStyle>;
}

export interface VideoPlayerProps extends ReactVideoProps {
  animationDuration?: number;
  autoplay?: boolean;
  controlsTimeout?: number;
  customStyles?: CustomStyles;
  defaultMuted?: boolean;
  disableControlsAutoHide?: boolean;
  disableFullscreen?: boolean;
  disableSeek?: boolean;
  duration?: number;
  endThumbnail?: ImageSourcePropType;
  endWithThumbnail?: boolean;
  fullScreenOnLongPress?: boolean;
  hideControlsOnStart?: boolean;
  loop?: boolean;
  muted?: boolean;
  onEnd?: () => void;
  onHideControls?: () => void;
  onLoad?: (event: OnLoadData) => void;
  onMutePress?: (isMuted: boolean) => void;
  onPlayPress?: () => void;
  onProgress?: (event: OnProgressData) => void;
  onShowControls?: () => void;
  onStart?: () => void;
  pauseOnPress?: boolean;
  paused?: boolean;
  resizeMode?: ResizeMode;
  showDuration?: boolean;
  source: ReactVideoSource;
  style?: StyleProp<ViewStyle>;
  thumbnail?: ImageSourcePropType;
  videoHeight?: number;
  videoWidth?: number;
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  (props, ref) => {
    const {
      autoplay = false,
      customStyles = {},
      endThumbnail,
      endWithThumbnail,
      onStart,
      onEnd,
      style,
      thumbnail,
      videoHeight = 1080,
      videoWidth = 1920,
      ...rest
    } = props;

    const videoRef = useRef<VideoInternalRef>(null);

    useImperativeHandle(ref, () => ({
      ...videoRef.current!,
      resume: () => {
        if (!isStarted) setIsStarted(true);
        videoRef.current?.resume();
      },
      stop: () => {
        setIsStarted(false);
        setHasEnded(true);
        videoRef.current?.dismissFullscreenPlayer();
      },
    }));

    const [isStarted, setIsStarted] = useState(autoplay);
    const [hasEnded, setHasEnded] = useState(false);
    const [width, setWidth] = useState(200);

    const sizeStyles = useMemo(() => {
      const ratio = videoHeight / videoWidth;
      return { height: width * ratio, width: width };
    }, [videoWidth, videoHeight, width]);

    const _onStart = useCallback(() => {
      if (onStart) onStart();
      setIsStarted(true);
      setHasEnded(false);

      // force re-render to make sure video is already mounted and videoRef is available
      setTimeout(() => videoRef.current?.onStart(), 0);
    }, [onStart]);

    const _onEnd = useCallback(() => {
      if (onEnd) onEnd();
      if (endWithThumbnail || endThumbnail) {
        setIsStarted(false);
        setHasEnded(true);
        videoRef.current?.dismissFullscreenPlayer();
      }
    }, [onEnd, endWithThumbnail, endThumbnail, setIsStarted, setHasEnded]);

    const onLayout = useCallback((event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      setWidth(width);
    }, []);

    const renderContent = useCallback(() => {
      if ((hasEnded && endThumbnail) || (!isStarted && thumbnail))
        return (
          <Thumbnail
            thumbnailSource={
              hasEnded && endThumbnail ? endThumbnail : thumbnail!
            }
            style={style}
            sizeStyles={sizeStyles}
            onStart={_onStart}
            customStylesThumbnail={customStyles.thumbnail}
            customStylesPlayButton={customStyles.playButton}
            customStylesPlayArrow={customStyles.playArrow}
          />
        );
      if (!isStarted)
        return (
          <View style={[styles.preloadingPlaceholder, sizeStyles, style]}>
            <StartButton
              onStart={_onStart}
              customStylesPlayButton={customStyles.playButton}
              customStylesPlayArrow={customStyles.playArrow}
            />
          </View>
        );
      return (
        <RenderVideo
          ref={videoRef}
          {...rest}
          style={style}
          customStyles={customStyles}
          autoplay={autoplay}
          onEnd={_onEnd}
          sizeStyle={sizeStyles}
        />
      );
    }, [
      hasEnded,
      endThumbnail,
      isStarted,
      thumbnail,
      style,
      sizeStyles,
      _onStart,
      customStyles,
      rest,
      autoplay,
      _onEnd,
    ]);

    return (
      <View onLayout={onLayout} style={customStyles.wrapper}>
        {renderContent()}
      </View>
    );
  }
);

export default VideoPlayer;

const styles = StyleSheet.create({
  preloadingPlaceholder: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
