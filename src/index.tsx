import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type LayoutChangeEvent,
  type GestureResponderEvent,
  type ImageSourcePropType,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
  type DimensionValue,
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

export type VideoPlayerRef = VideoRef & { stop: () => void };

interface CustomStyles {
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

interface VideoPlayerComponentProps extends ReactVideoProps {
  source: ReactVideoSource;
  thumbnail?: ImageSourcePropType;
  endThumbnail?: ImageSourcePropType;
  videoWidth?: number;
  videoHeight?: number;
  duration?: number;
  autoplay?: boolean;
  paused?: boolean;
  defaultMuted?: boolean;
  muted?: boolean;
  style?: StyleProp<ViewStyle>;
  controlsTimeout?: number;
  disableControlsAutoHide?: boolean;
  disableFullscreen?: boolean;
  loop?: boolean;
  resizeMode?: ResizeMode;
  hideControlsOnStart?: boolean;
  endWithThumbnail?: boolean;
  disableSeek?: boolean;
  pauseOnPress?: boolean;
  fullScreenOnLongPress?: boolean;
  customStyles?: CustomStyles;
  onEnd?: () => void;
  onProgress?: (event: OnProgressData) => void;
  onLoad?: (event: OnLoadData) => void;
  onStart?: () => void;
  onPlayPress?: () => void;
  onHideControls?: () => void;
  onShowControls?: () => void;
  onMutePress?: (isMuted: boolean) => void;
  showDuration?: boolean;
  animationDuration?: number;
}

const getDurationTime = (duration: number): string => {
  const padTimeValueString = (value: number): string =>
    value.toString().padStart(2, '0');

  if (!Number.isFinite(duration)) return '';

  const seconds = Math.floor(duration % 60),
    minutes = Math.floor((duration / 60) % 60),
    hours = Math.floor((duration / 3600) % 24);

  return hours
    ? `${padTimeValueString(hours)}:${padTimeValueString(minutes)}:${padTimeValueString(seconds)}`
    : `${padTimeValueString(minutes)}:${padTimeValueString(seconds)}`;
};

const parsePadding = (value: DimensionValue, layoutWidth: number) => {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string' && value.endsWith('%')) {
    const percent = parseFloat(value) / 100;
    return layoutWidth * percent;
  }

  return 0;
};

const VideoPlayerComponent = forwardRef(
  (props: VideoPlayerComponentProps, ref) => {
    const {
      source,
      thumbnail,
      endThumbnail,
      videoWidth = 1920,
      videoHeight = 1080,
      autoplay = false,
      paused,
      defaultMuted,
      muted,
      style,
      controlsTimeout = 2000,
      disableControlsAutoHide,
      disableFullscreen,
      repeat = false,
      resizeMode = 'contain',
      hideControlsOnStart = false,
      endWithThumbnail,
      disableSeek,
      pauseOnPress,
      fullScreenOnLongPress,
      customStyles = {},
      onEnd,
      onProgress,
      onLoad,
      onStart,
      onPlayPress,
      onHideControls,
      onShowControls,
      onMutePress,
      showDuration = false,
      animationDuration = 100,
    } = props;

    const [isStarted, setIsStarted] = useState(autoplay);
    const [isPlaying, setIsPlaying] = useState(autoplay);
    const [hasEnded, setHasEnded] = useState(false);
    const [width, setWidth] = useState(200);
    const [progress, setProgress] = useState(0);
    const [isMuted, setIsMuted] = useState(defaultMuted ?? false);
    const [isControlsVisible, setIsControlsVisible] = useState(false);
    const [duration, setDuration] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);

    const videoRef = useRef<VideoRef>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const seekBarWidth = useRef<number>(200);
    const seekTouchStart = useRef<number>(0);
    const seekProgressStart = useRef<number>(0);
    const wasPlayingBeforeSeek = useRef<boolean>(autoplay);

    const animationValue = useRef(new Animated.Value(0)).current;

    const controlsTranslateY = animationValue.interpolate({
      inputRange: [0, 1],
      outputRange: [48, 0],
    });

    const getSizeStyles = useCallback(() => {
      const ratio = videoHeight / videoWidth;
      return { height: width * ratio, width: width };
    }, [videoWidth, videoHeight, width]);

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

        Animated.timing(animationValue, {
          toValue: 0.1,
          duration: animationDuration,
          useNativeDriver: true,
        }).start(() => {
          setIsControlsVisible(false);
        });
      }, controlsTimeout);
    }, [
      controlsTimeout,
      onHideControls,
      disableControlsAutoHide,
      animationValue,
      animationDuration,
    ]);

    const _showControls = useCallback(() => {
      if (onShowControls && !isControlsVisible) onShowControls();
      setIsControlsVisible(true);

      Animated.timing(animationValue, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();

      _hideControls();
    }, [
      onShowControls,
      isControlsVisible,
      animationValue,
      animationDuration,
      _hideControls,
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

    const onLayout = useCallback((event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      setWidth(width);
    }, []);

    const _onStart = useCallback(() => {
      if (onStart) onStart();
      setIsPlaying(true);
      setIsStarted(true);
      setHasEnded(false);
      setProgress((prev) => (prev >= 1 ? 0 : prev));
      hideControlsOnStart ? _hideControls() : _showControls();
    }, [_hideControls, _showControls, hideControlsOnStart, onStart]);

    const _onProgress = useCallback(
      (event: OnProgressData) => {
        if (isSeeking) return;
        if (onProgress) onProgress(event);

        if (isNaN(props?.duration || 0) && isNaN(duration)) {
          throw new Error(
            'Could not load video duration correctly, please add `duration` props'
          );
        }

        setProgress(event.currentTime / (props.duration || duration));
      },
      [isSeeking, onProgress, duration, props.duration]
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
    }, [onEnd, endWithThumbnail, endThumbnail, repeat]);

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

      if (progress >= 1) {
        videoRef.current?.seek(0);
      }

      _showControls();
    }, [_showControls, onPlayPress, progress]);

    const _onMutePress = useCallback(() => {
      const newMutedState = !isMuted;
      if (onMutePress) onMutePress(newMutedState);
      setIsMuted(newMutedState);
      _showControls();
    }, [isMuted, onMutePress, _showControls]);

    const onToggleFullScreen = useCallback(() => {
      videoRef.current?.presentFullscreenPlayer();
    }, []);

    const onSeekBarLayout = useCallback(
      ({ nativeEvent }: LayoutChangeEvent) => {
        const layoutWidth = nativeEvent.layout.width;
        const customStyle = customStyles.seekBar;

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
      [customStyles.seekBar]
    );

    const onSeekGrant = useCallback(
      (e: GestureResponderEvent) => {
        seekTouchStart.current = e.nativeEvent.pageX;
        seekProgressStart.current = progress;
        wasPlayingBeforeSeek.current = isPlaying;
        setIsSeeking(true);
        setIsPlaying(false);

        if (controlsTimeoutRef.current)
          clearTimeout(controlsTimeoutRef.current);
      },
      [progress, isPlaying]
    );

    const onSeekRelease = useCallback(() => {
      setIsSeeking(false);
      setIsPlaying(wasPlayingBeforeSeek.current);
      _showControls();
    }, [_showControls]);

    const onSeek = useCallback(
      (e: GestureResponderEvent) => {
        const diff = e.nativeEvent.pageX - seekTouchStart.current;
        const ratio = 100 / seekBarWidth.current;
        const newProgress = seekProgressStart.current + (ratio * diff) / 100;

        const fixedProgress =
          newProgress < 0 ? 0 : newProgress > 1 ? 1 : newProgress;

        setProgress(fixedProgress);
        videoRef.current?.seek(newProgress * duration);
      },
      [duration]
    );

    const _onPlaybackStateChanged = useCallback(
      (data: OnPlaybackStateChangedData) => {
        if (data.isPlaying !== isPlaying) setIsPlaying(data.isPlaying);
      },
      [isPlaying]
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
            getSizeStyles(),
            style,
            customStyles.thumbnail,
          ]}
        >
          {renderStartButton()}
        </ImageBackground>
      ),
      [getSizeStyles, renderStartButton, style, customStyles.thumbnail]
    );

    const renderSeekBar = useCallback(
      (fullWidth?: boolean) => (
        <View
          style={[
            styles.seekBar,
            customStyles.seekBar,
            fullWidth && styles.seekBarFullWidth,
            fullWidth && customStyles.seekBarFullWidth,
          ]}
          onLayout={onSeekBarLayout}
        >
          <View
            style={[
              !isNaN(progress) ? { flexGrow: progress } : null,
              styles.seekBarProgress,
              customStyles.seekBarProgress,
            ]}
          />
          {!fullWidth && !disableSeek && (
            <View
              style={[
                styles.seekBarKnob,
                customStyles.seekBarKnob,
                isSeeking && styles.seekBarKnobSeeking,
                isSeeking && customStyles.seekBarKnobSeeking,
              ]}
              hitSlop={{ top: 20, bottom: 20, left: 10, right: 20 }}
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderGrant={onSeekGrant}
              onResponderMove={onSeek}
              onResponderRelease={onSeekRelease}
              onResponderTerminate={onSeekRelease}
            />
          )}
          <View
            style={[
              styles.seekBarBackground,
              !isNaN(progress) ? { flexGrow: 1 - progress } : null,
              customStyles.seekBarBackground,
            ]}
          />
        </View>
      ),
      [
        customStyles.seekBar,
        customStyles.seekBarFullWidth,
        customStyles.seekBarProgress,
        customStyles.seekBarKnob,
        customStyles.seekBarKnobSeeking,
        customStyles.seekBarBackground,
        onSeekBarLayout,
        progress,
        disableSeek,
        isSeeking,
        onSeekGrant,
        onSeek,
        onSeekRelease,
      ]
    );

    const renderControls = useCallback(
      () => (
        <Animated.View
          style={[
            styles.controls,
            customStyles.controls,
            { transform: [{ translateY: controlsTranslateY }] },
          ]}
        >
          <TouchableOpacity
            onPress={_onPlayPress}
            style={[
              styles.playControl,
              customStyles.controlButton,
              customStyles.playControl,
            ]}
          >
            <Image
              source={
                isPlaying
                  ? require('./img/pause.png')
                  : require('./img/play.png')
              }
            />
          </TouchableOpacity>
          {renderSeekBar()}
          {showDuration && (
            <>
              <TextInput
                style={[styles.durationText, customStyles.durationText]}
                editable={false}
                value={getDurationTime(progress * (props.duration || duration))}
              />
              <Text style={[styles.durationText, customStyles.durationText]}>
                {` / ${getDurationTime(props.duration || duration)}`}
              </Text>
            </>
          )}
          <TouchableOpacity
            onPress={_onMutePress}
            style={[styles.extraControl, customStyles.controlButton]}
          >
            <Image
              style={customStyles.controlIcon}
              source={
                isMuted
                  ? require('./img/volume_off.png')
                  : require('./img/volume_on.png')
              }
            />
          </TouchableOpacity>
          {!disableFullscreen && (
            <TouchableOpacity
              onPress={onToggleFullScreen}
              style={[styles.extraControl, customStyles.controlButton]}
            >
              <Image
                style={customStyles.controlIcon}
                source={require('./img/fullscreen.png')}
              />
            </TouchableOpacity>
          )}
        </Animated.View>
      ),
      [
        customStyles.controls,
        customStyles.controlButton,
        customStyles.playControl,
        customStyles.durationText,
        customStyles.controlIcon,
        controlsTranslateY,
        _onPlayPress,
        isPlaying,
        renderSeekBar,
        showDuration,
        progress,
        props.duration,
        duration,
        _onMutePress,
        isMuted,
        disableFullscreen,
        onToggleFullScreen,
      ]
    );

    const renderVideo = useCallback(
      () => (
        <View style={[{ overflow: 'hidden' }, customStyles.videoWrapper]}>
          <Video
            {...props}
            ref={videoRef}
            style={[styles.video, getSizeStyles(), style, customStyles.video]}
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
          {isControlsVisible ? renderControls() : renderSeekBar(true)}
        </View>
      ),
      [
        customStyles.videoWrapper,
        customStyles.video,
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
        isControlsVisible,
        renderControls,
        renderSeekBar,
        _showControls,
        pauseOnPress,
        _onPlayPress,
        fullScreenOnLongPress,
        onToggleFullScreen,
      ]
    );

    const renderContent = useCallback(() => {
      if (hasEnded && endThumbnail) return renderThumbnail(endThumbnail);
      if (!isStarted && thumbnail) return renderThumbnail(thumbnail);
      if (!isStarted)
        return (
          <View style={[styles.preloadingPlaceholder, getSizeStyles(), style]}>
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
  playControl: {
    color: 'white',
    padding: 8,
  },
  extraControl: {
    color: 'white',
    padding: 8,
  },
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
  overlayButton: {
    ...StyleSheet.absoluteFillObject,
  },
  activeDurationText: {
    paddingLeft: 8,
    paddingRight: 0,
    paddingBottom: 0,
    paddingTop: 0,
  },
  durationText: {
    color: 'white',
  },
});
