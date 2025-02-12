import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import type { VideoPlayerProps } from './index';
import Video, {
  type OnLoadData,
  type OnPlaybackStateChangedData,
  type OnProgressData,
  type VideoRef,
} from 'react-native-video';
import { Controls, type ProgressRef } from './controls/Controls';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import type { AnimationRef } from './controls/ControlsAnimatedWrapper';

export interface VideoInternalRef extends VideoRef {
  onStart: () => void;
}

type RenderVideoProps = Pick<
  VideoPlayerProps,
  | 'animationDuration'
  | 'autoplay'
  | 'controlsTimeout'
  | 'customStyles'
  | 'defaultMuted'
  | 'disableControlsAutoHide'
  | 'disableFullscreen'
  | 'disableSeek'
  | 'duration'
  | 'fullScreenOnLongPress'
  | 'hideControlsOnStart'
  | 'muted'
  | 'onEnd'
  | 'onHideControls'
  | 'onLoad'
  | 'onMutePress'
  | 'onPlayPress'
  | 'onProgress'
  | 'onShowControls'
  | 'pauseOnPress'
  | 'paused'
  | 'repeat'
  | 'resizeMode'
  | 'showDuration'
  | 'source'
  | 'style'
> & { sizeStyle: { width: number; height: number } };

export const RenderVideo = memo(
  forwardRef<VideoInternalRef, RenderVideoProps>((props, ref) => {
    const {
      animationDuration = 100,
      autoplay = false,
      controlsTimeout = 2000,
      customStyles = {},
      defaultMuted,
      disableControlsAutoHide,
      disableFullscreen,
      disableSeek,
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
      pauseOnPress,
      paused,
      repeat = false,
      resizeMode = 'contain',
      showDuration = false,
      source,
      style,
      sizeStyle,
    } = props;

    const [isPlaying, setIsPlaying] = useState(autoplay);
    const [isMuted, setIsMuted] = useState(defaultMuted ?? false);
    const [isControlsVisible, setIsControlsVisible] = useState(false);
    const [duration, setDuration] = useState(0);

    const videoRef = useRef<VideoRef>(null);
    // ref to keeps progress to avoid re-rendering
    const progressRef = useRef<number>(0);
    // ref to pass progress to controls (in ref to avoid re-rendering) and to pass when controls wrapper should animate
    const controlsRef = useRef<ProgressRef & AnimationRef>(null);
    // ref to keep timeout id to clear it on unmount
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const setProgress = useCallback((progress: number) => {
      if (!isFinite(progress)) return;

      progressRef.current = progress;
      controlsRef.current?.onProgress(progress);
    }, []);

    useImperativeHandle(ref, () => ({
      ...videoRef.current!,
      resume: () => {
        setIsPlaying(true);
        videoRef.current?.resume();
      },
      pause: () => {
        setIsPlaying(false);
        videoRef.current?.pause();
      },
      stop: () => {
        setProgress(0);
        videoRef.current?.dismissFullscreenPlayer();
      },
      onStart: () => {
        setIsPlaying(true);
        setProgress(progressRef.current >= 1 ? 0 : progressRef.current);
        hideControlsOnStart ? _hideControls() : _showControls();
      },
    }));

    const _hideControls = useCallback(() => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);

      controlsTimeoutRef.current = setTimeout(() => {
        if (onHideControls) onHideControls();
        if (disableControlsAutoHide) return;

        controlsRef.current?.runControlsAnimation(0.1, () => {
          setIsControlsVisible(false);
          setProgress(progressRef.current);
        });
      }, controlsTimeout);
    }, [controlsTimeout, onHideControls, disableControlsAutoHide, setProgress]);

    const _showControls = useCallback(() => {
      if (onShowControls && !isControlsVisible) onShowControls();
      setIsControlsVisible(true);

      _hideControls();

      // force re-renders to make sure controls are mounted. ControlsRef is then available and setProgress is called correctly (It fixes the moment when controls are hidden during paused video. After clicking on the screen, controls are shown, but the current duration shows 00)
      setTimeout(() => {
        setProgress(progressRef.current);
        controlsRef.current?.runControlsAnimation(1);
      }, 0);
    }, [onShowControls, isControlsVisible, _hideControls, setProgress]);

    useEffect(() => {
      if (autoplay) _hideControls();

      return () => {
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
          controlsTimeoutRef.current = null;
        }
      };
    }, [_hideControls, autoplay]);

    const _onProgress = useCallback(
      (event: OnProgressData) => {
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
      setProgress(1);
      if (repeat) videoRef.current?.seek(0);
      setIsPlaying(repeat);
    }, [onEnd, setProgress, repeat]);

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

    const seek = useCallback(
      (progress: number) => {
        videoRef.current?.seek(progress);
        setProgress(progress / (props.duration || duration));
      },
      [duration, props.duration, setProgress]
    );

    return (
      <View style={[{ overflow: 'hidden' }, customStyles.videoWrapper]}>
        <Video
          {...props}
          ref={videoRef}
          style={[styles.video, sizeStyle, style, customStyles.video]}
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
          animationDuration={animationDuration}
          showControls={_showControls}
          autoplay={autoplay}
          disableSeek={disableSeek}
          setIsPlaying={setIsPlaying}
          onSeek={seek}
          controlsTimeoutId={controlsTimeoutRef.current}
          isControlsVisible={isControlsVisible}
        />
      </View>
    );
  })
);

const styles = StyleSheet.create({
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
