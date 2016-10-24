import React, { Component, PropTypes } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video'; // eslint-disable-line

const styles = StyleSheet.create({
  preloadingPlaceholder: {
    backgroundColor: 'black',
  },
  thumbnail: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playArrow: {
    color: 'white',
  },
  video: {
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    height: 3,
    flex: 1,
    flexDirection: 'row',
  },
  seekBarProgress: {
    backgroundColor: '#F00',
  },
  overlayButton: {
    flex: 1,
  },
});

export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isStarted: props.autoplay,
      isPlaying: props.autoplay,
      width: 200,
      progress: 0,
      isMuted: props.defaultMuted,
      isControlsVisible: !props.hideControlsOnStart,
      duration: 0,
    };

    this.onLayout = this.onLayout.bind(this);
    this.onStartPress = this.onStartPress.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onPlayPress = this.onPlayPress.bind(this);
    this.onMutePress = this.onMutePress.bind(this);
    this.showControls = this.showControls.bind(this);
  }

  componentDidMount() {
    if (this.props.autoplay) {
      this.hideControls();
    }
  }

  onLayout(event) {
    const { width } = event.nativeEvent.layout;
    this.setState({
      width,
    });
  }

  onStartPress() {
    this.setState({
      isPlaying: true,
      isStarted: true,
    });

    this.hideControls();
  }

  onProgress(event) {
    this.setState({
      progress: event.currentTime / (this.props.duration || this.state.duration),
    });
  }

  onEnd() {
    if (this.props.endWithThumbnail) {
      this.setState({ isStarted: false });
    }

    this.player.seek(0);
    if (!this.props.loop) {
      this.setState({
        isPlaying: false,
      });
    }
  }

  onLoad(event) {
    const { duration } = event;
    this.setState({ duration });
  }

  onPlayPress() {
    this.setState({
      isPlaying: !this.state.isPlaying,
    });
    this.showControls();
  }

  onMutePress() {
    this.setState({
      isMuted: !this.state.isMuted,
    });
    this.showControls();
  }

  getSizeStyles() {
    const { videoWidth, videoHeight } = this.props;
    const { width } = this.state;
    const ratio = videoHeight / videoWidth;
    return {
      height: width * ratio,
      width,
    };
  }

  getThumbnail() {
    const { thumbnail, style, customStyles, ...props } = this.props;
    return (
      <Image
        {...props}
        style={[
          styles.thumbnail,
          this.getSizeStyles(),
          style,
          customStyles.thumbnail,
        ]}
        source={thumbnail}
      >
        <TouchableOpacity
          style={[styles.playButton, customStyles.playButton]}
          onPress={this.onStartPress}
        >
          <Icon style={[styles.playArrow, customStyles.playArrow]} name="play-arrow" size={42} />
        </TouchableOpacity>
      </Image>
    );
  }

  getSeekBar(fullWidth) {
    const { customStyles } = this.props;
    return (
      <View
        style={[
          styles.seekBar, {
            marginHorizontal: fullWidth ? 0 : 10,
            marginTop: fullWidth ? -3 : 0,
          },
          customStyles.seekBar,
        ]}
      >
        <View
          style={[
            { flex: this.state.progress },
            styles.seekBarProgress,
            customStyles.seekBarProgress,
          ]}
        />
        <View style={{ flex: 1 - this.state.progress }} />
      </View>
    );
  }

  getControls() {
    const { customStyles } = this.props;
    return (
      <View style={[styles.controls, customStyles.controls]}>
        <TouchableOpacity
          onPress={this.onPlayPress}
          style={[customStyles.controlButton, customStyles.playControl]}
        >
          <Icon
            style={[styles.playControl, customStyles.controlIcon, customStyles.playIcon]}
            name={this.state.isPlaying ? 'pause' : 'play-arrow'}
            size={32}
          />
        </TouchableOpacity>
        {this.getSeekBar()}
        {this.props.muted ? null : (
          <TouchableOpacity onPress={this.onMutePress} style={customStyles.controlButton}>
            <Icon
              style={[styles.extraControl, customStyles.controlIcon]}
              name={this.state.isMuted ? 'volume-off' : 'volume-up'}
              size={24}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  getVideo() {
    const {
      video,
      style,
      resizeMode,
      customStyles,
      ...props
    } = this.props;
    return (
      <View>
        <Video
          {...props}
          style={[
            styles.video,
            this.getSizeStyles(),
            style,
            customStyles.video,
          ]}
          ref={p => { this.player = p; }}
          muted={this.props.muted || this.state.isMuted}
          paused={!this.state.isPlaying}
          onProgress={this.onProgress}
          onEnd={this.onEnd}
          onLoad={this.onLoad}
          source={video}
          resizeMode={resizeMode}
        />
        <View
          style={[
            this.getSizeStyles(),
            { marginTop: -this.getSizeStyles().height },
          ]}
        >
          <TouchableOpacity style={styles.overlayButton} onPress={this.showControls} />
        </View>
        {((!this.state.isPlaying) || this.state.isControlsVisible)
          ? this.getControls() : this.getSeekBar(true)}
      </View>
    );
  }

  getContent() {
    const { thumbnail, style } = this.props;
    const { isStarted } = this.state;

    if (!isStarted && thumbnail) {
      return this.getThumbnail();
    } else if (!isStarted) {
      return <View style={[styles.preloadingPlaceholder, this.getSizeStyles(), style]} />;
    }
    return this.getVideo();
  }

  hideControls() {
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
      this.controlsTimeout = null;
    }
    this.controlsTimeout = setTimeout(() => {
      this.setState({ isControlsVisible: false });
    }, this.props.controlsTimeout);
  }

  showControls() {
    this.setState({
      isControlsVisible: true,
    });
    this.hideControls();
  }

  render() {
    return (
      <View onLayout={this.onLayout} style={this.props.customStyles.wrapper}>
        {this.getContent()}
      </View>
    );
  }
}

VideoPlayer.propTypes = {
  video: Video.propTypes.source,
  thumbnail: Image.propTypes.source,
  videoWidth: PropTypes.number,
  videoHeight: PropTypes.number,
  duration: PropTypes.number,
  autoplay: PropTypes.bool,
  defaultMuted: PropTypes.bool,
  muted: PropTypes.bool,
  style: View.propTypes.style,
  controlsTimeout: PropTypes.number,
  loop: PropTypes.bool,
  resizeMode: Video.propTypes.resizeMode,
  hideControlsOnStart: PropTypes.bool,
  endWithThumbnail: PropTypes.bool,
  customStyles: PropTypes.shape({
    wrapper: View.propTypes.style,
    video: Video.propTypes.style,
    controls: View.propTypes.style,
    playControl: TouchableOpacity.propTypes.style,
    controlButton: TouchableOpacity.propTypes.style,
    controlIcon: Icon.propTypes.style,
    playIcon: Icon.propTypes.style,
    seekBar: View.propTypes.style,
    seekBarProgress: View.propTypes.style,
    thumbnail: Image.propTypes.style,
    playButton: TouchableOpacity.propTypes.style,
    playArrow: Icon.propTypes.style,
  }),
};

VideoPlayer.defaultProps = {
  videoWidth: 1280,
  videoHeight: 720,
  autoplay: false,
  controlsTimeout: 2000,
  loop: false,
  resizeMode: 'contain',
  customStyles: {},
};
