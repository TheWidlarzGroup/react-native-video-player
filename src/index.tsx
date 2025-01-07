import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useMemo,
} from 'react';
import {
  ImageBackground,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  type LayoutChangeEvent,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
  Image,
  type ImageStyle,
  Animated,
} from 'react-native';
import Video, {
  ResizeMode,
  type OnProgressData,
  type OnLoadData,
  type VideoRef,
  type ReactVideoProps,
  type ReactVideoSource,
  type OnPlaybackStateChangedData,
} from 'react-native-video';
import { Controls, type ControlsRef } from './Controls';

export type VideoPlayerRef = VideoRef & { stop: () => void };

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

export interface VideoPlayerComponentProps extends ReactVideoProps {
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

const VideoPlayerComponent = forwardRef(
  (props: VideoPlayerComponentProps, ref) => {
    const {
      animationDuration = 100,
      autoplay = false,
      controlsTimeout = 2000,
      customStyles = {},
      defaultMuted,
      disableControlsAutoHide,
      disableFullscreen,
      disableSeek,
      endThumbnail,
      endWithThumbnail,
      fullScreenOnLongPress,
      hideControlsOnStart = false,
      muted,
      onEnd,
      onHideControls,
      onLoad,
      onMutePress,
      onPlayPress,
      onProgress,
      onShowControls,
      onStart,
      pauseOnPress,
      paused,
      repeat = false,
      resizeMode = 'contain',
      showDuration = false,
      source,
      style,
      thumbnail,
      videoHeight = 1080,
      videoWidth = 1920,
    } = props;

    const [isStarted, setIsStarted] = useState(autoplay);
    const [isPlaying, setIsPlaying] = useState(autoplay);
    const [hasEnded, setHasEnded] = useState(false);
    const [width, setWidth] = useState(200);
    const [isMuted, setIsMuted] = useState(defaultMuted ?? false);
    const [isControlsVisible, setIsControlsVisible] = useState(false);
    const [duration, setDuration] = useState(0);

    const videoRef = useRef<VideoRef>(null);
    // ref to keeps progress to avoid re-rendering
    const progressRef = useRef<number>(0);
    // ref to pass progress to controls (in ref to avoid re-rendering)
    const controlsRef = useRef<ControlsRef>(null);
    // ref to keep timeout id to clear it on unmount
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const animationValue = useRef(new Animated.Value(0)).current;

    const getSizeStyles = useMemo(() => {
      const ratio = videoHeight / videoWidth;
      return { height: width * ratio, width: width };
    }, [videoWidth, videoHeight, width]);

    const runControlsAnimation = useCallback(
      (toValue: number, callback?: () => void) => {
        Animated.timing(animationValue, {
          toValue,
          duration: animationDuration,
          useNativeDriver: true,
        }).start(callback);
      },
      [animationDuration, animationValue]
    );

    const setProgress = useCallback((progress: number) => {
      progressRef.current = progress;
      controlsRef.current?.onProgress(progress);
    }, []);

    useImperativeHandle(ref, () => ({
      ...videoRef.current,
      resume: () => {
        setIsPlaying(true);
        if (!isStarted) setIsStarted(true);
        videoRef.current?.resume();
      },
      pause: () => {
        setIsPlaying(false);
        videoRef.current?.pause();
      },
      stop: () => {
        setIsStarted(false);
        setHasEnded(true);
        setProgress(0);
        videoRef.current?.dismissFullscreenPlayer();
      },
    }));

    const _hideControls = useCallback(() => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);

      controlsTimeoutRef.current = setTimeout(() => {
        if (onHideControls) onHideControls();
        if (disableControlsAutoHide) return;

        runControlsAnimation(0.1, () => {
          setIsControlsVisible(false);
        });
      }, controlsTimeout);
    }, [
      controlsTimeout,
      onHideControls,
      disableControlsAutoHide,
      runControlsAnimation,
    ]);

    const _showControls = useCallback(() => {
      if (onShowControls && !isControlsVisible) onShowControls();
      setIsControlsVisible(true);

      runControlsAnimation(1);

      _hideControls();

      // force re-render to update progress, because setProgress was called when controls are hidden
      setTimeout(() => {
        setProgress(progressRef.current);
      }, 0);
    }, [
      onShowControls,
      isControlsVisible,
      runControlsAnimation,
      _hideControls,
      setProgress,
    ]);

    useEffect(() => {
      if (autoplay) _hideControls();

      return () => {
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
          controlsTimeoutRef.current = null;
        }
      };
    }, [_hideControls, autoplay]);

    const _onStart = useCallback(() => {
      if (onStart) onStart();
      setIsPlaying(true);
      setIsStarted(true);
      setHasEnded(false);

      setProgress(progressRef.current >= 1 ? 0 : progressRef.current);

      hideControlsOnStart ? _hideControls() : _showControls();
    }, [
      _hideControls,
      _showControls,
      hideControlsOnStart,
      onStart,
      setProgress,
    ]);

    const _onProgress = useCallback(
      (event: OnProgressData) => {
        if (controlsRef.current?.isSeeking) return;

        if (onProgress) onProgress(event);

        if (isNaN(props?.duration || 0) && isNaN(duration)) {
          throw new Error(
            'Could not load video duration correctly, please add `duration` props'
          );
        }

        setProgress(event.currentTime / (props.duration || duration));
      },
      [onProgress, props.duration, duration, setProgress]
    );

    const _onEnd = useCallback(() => {
      if (onEnd) onEnd();
      if (endWithThumbnail || endThumbnail) {
        setIsStarted(false);
        setHasEnded(true);
        videoRef.current?.dismissFullscreenPlayer();
      }
      setProgress(1);
      setIsPlaying(repeat);
      if (repeat) videoRef.current?.seek(0);
    }, [onEnd, endWithThumbnail, endThumbnail, setProgress, repeat]);

    const _onLoad = useCallback(
      (event: OnLoadData) => {
        if (onLoad) onLoad(event);
        setDuration(event.duration);
      },
      [onLoad]
    );

    const _onPlayPress = useCallback(() => {
      if (onPlayPress) onPlayPress();
      setIsPlaying((prev) => !prev);

      if (progressRef.current >= 1) {
        videoRef.current?.seek(0);
      }

      _showControls();
    }, [_showControls, onPlayPress]);

    const _onMutePress = useCallback(() => {
      const newMutedState = !isMuted;
      if (onMutePress) onMutePress(newMutedState);
      setIsMuted(newMutedState);
      _showControls();
    }, [isMuted, onMutePress, _showControls]);

    const _onPlaybackStateChanged = useCallback(
      (data: OnPlaybackStateChangedData) => {
        if (data.isPlaying !== isPlaying) setIsPlaying(data.isPlaying);
      },
      [isPlaying]
    );

    const onToggleFullScreen = useCallback(() => {
      videoRef.current?.presentFullscreenPlayer();
    }, []);

    const onLayout = useCallback((event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      setWidth(width);
    }, []);

    const seek = useCallback(
      (progress: number) => {
        videoRef.current?.seek(progress);
        setProgress(progress / (props.duration || duration));
      },
      [duration, props.duration, setProgress]
    );

    const renderStartButton = useCallback(
      () => (
        <TouchableOpacity
          style={[styles.playButton, customStyles.playButton]}
          onPress={_onStart}
        >
          <Image
            source={require('./img/play.png')}
            style={[styles.playArrow, customStyles.playArrow]}
          />
        </TouchableOpacity>
      ),
      [_onStart, customStyles.playArrow, customStyles.playButton]
    );

    const renderThumbnail = useCallback(
      (thumbnailSource: ImageSourcePropType) => (
        <ImageBackground
          source={thumbnailSource}
          style={[
            styles.thumbnail,
            getSizeStyles,
            style,
            customStyles.thumbnail,
          ]}
        >
          {renderStartButton()}
        </ImageBackground>
      ),
      [getSizeStyles, renderStartButton, style, customStyles.thumbnail]
    );

    const renderVideo = useCallback(
      () => (
        <View style={[{ overflow: 'hidden' }, customStyles.videoWrapper]}>
          <Video
            {...props}
            ref={videoRef}
            style={[styles.video, getSizeStyles, style, customStyles.video]}
            muted={muted || isMuted}
            paused={paused || !isPlaying}
            onProgress={_onProgress}
            onEnd={_onEnd}
            onLoad={_onLoad}
            source={source}
            resizeMode={resizeMode}
            onPlaybackStateChanged={_onPlaybackStateChanged}
          />
          <TouchableOpacity
            style={styles.overlayButton}
            onPress={() => {
              _showControls();
              if (pauseOnPress) _onPlayPress();
            }}
            onLongPress={() => {
              if (fullScreenOnLongPress) onToggleFullScreen();
            }}
          />
          <Controls
            ref={controlsRef}
            customStyles={customStyles}
            showDuration={showDuration}
            disableFullscreen={disableFullscreen}
            duration={props.duration || duration}
            isPlaying={isPlaying}
            isMuted={isMuted}
            onPlayPress={_onPlayPress}
            onMutePress={_onMutePress}
            onToggleFullScreen={onToggleFullScreen}
            animationValue={animationValue}
            showControls={_showControls}
            autoplay={autoplay}
            disableSeek={disableSeek}
            setIsPlaying={setIsPlaying}
            onSeek={seek}
            controlsTimeoutId={controlsTimeoutRef.current}
            isControlsVisible={isControlsVisible}
          />
        </View>
      ),
      [
        customStyles,
        props,
        getSizeStyles,
        style,
        muted,
        isMuted,
        paused,
        isPlaying,
        _onProgress,
        _onEnd,
        _onLoad,
        source,
        resizeMode,
        _onPlaybackStateChanged,
        showDuration,
        disableFullscreen,
        duration,
        _onPlayPress,
        _onMutePress,
        onToggleFullScreen,
        animationValue,
        _showControls,
        autoplay,
        disableSeek,
        seek,
        isControlsVisible,
        pauseOnPress,
        fullScreenOnLongPress,
      ]
    );

    const renderContent = useCallback(() => {
      if (hasEnded && endThumbnail) return renderThumbnail(endThumbnail);
      if (!isStarted && thumbnail) return renderThumbnail(thumbnail);
      if (!isStarted)
        return (
          <View style={[styles.preloadingPlaceholder, getSizeStyles, style]}>
            {renderStartButton()}
          </View>
        );
      return renderVideo();
    }, [
      hasEnded,
      endThumbnail,
      isStarted,
      thumbnail,
      renderThumbnail,
      getSizeStyles,
      style,
      renderStartButton,
      renderVideo,
    ]);

    return (
      <View onLayout={onLayout} style={customStyles.wrapper}>
        {renderContent()}
      </View>
    );
  }
);

export default VideoPlayerComponent;

const styles = StyleSheet.create({
  preloadingPlaceholder: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 32,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playArrow: {
    width: 28,
    height: 28,
    marginLeft: 2,
  },
  video:
    +Platform.Version >= 24
      ? {}
      : {
          backgroundColor: 'black',
        },
  controls: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    height: 48,
    marginTop: -48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlayButton: {
    ...StyleSheet.absoluteFillObject,
  },
});
