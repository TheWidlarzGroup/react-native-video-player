import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, ImageBackground, Platform, StyleSheet, TouchableOpacity, View, ViewPropTypes, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Video from 'react-native-video'; // eslint-disable-line

const BackgroundImage = ImageBackground || Image; // fall back to Image if RN < 0.46

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
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playArrow: {
    color: 'white',
  },
  video: Platform.Version >= 24 ? {} : {
    backgroundColor: 'black',
  },
  controls: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    height: 48,
    marginTop: -48,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
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
    marginRight: 0,
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
    zIndex: 2,
  },
  seekBarBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    height: 3,
  },
  overlayButton: {
    flex: 1,
  },
  timeSyle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
  },

  volReflect: {
    backgroundColor: 'rgba(255, 0, 0, 0.5)',  
    width: 100,
    height: 30,
    flexGrow: 1,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  volProgress: {
    height: 3,
    backgroundColor: '#FFF',
    alignSelf:'flex-end',    
  },
  volLeft: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    height: 3,   
    alignSelf:'flex-end',
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
      isMuted: true,
      isControlsVisible: !props.hideControlsOnStart,
      duration: 0,
      isSeeking: false,
      volume: 0,
      volBarNeedShow: false,
    };

    this.volControlBarWith = 200;
    this.volControlTouchStart = 0;
    this.seekBarWidth = 200;
    this.wasPlayingBeforeSeek = props.autoplay;
    this.seekTouchStart = 0;
    this.seekProgressStart = 0;

    this.onLayout = this.onLayout.bind(this);
    this.onStartPress = this.onStartPress.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onPlayPress = this.onPlayPress.bind(this);
    this.onMutePress = this.onMutePress.bind(this);
    this.showControls = this.showControls.bind(this);
    this.onToggleFullScreen = this.onToggleFullScreen.bind(this);
    this.onSeekBarLayout = this.onSeekBarLayout.bind(this);
    this.onSeekGrant = this.onSeekGrant.bind(this);
    this.onSeekRelease = this.onSeekRelease.bind(this);
    this.onSeek = this.onSeek.bind(this);
    this.onVolCtrlGrant = this.onVolCtrlGrant.bind(this);
    this.onVolCtrlRelease = this.onVolCtrlRelease.bind(this);
    this.onVolControl = this.onVolControl.bind(this);
    this.onBack = this.props.onBack;
  }

  componentDidMount() {
    if (this.props.autoplay) {
      this.hideControls();
    }
  }

  componentWillUnmount() {
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
      this.controlsTimeout = null;
    }
  }

  onLayout(event) {
    const { width, height } = event.nativeEvent.layout;
    this.setState({
      width,
    });
  }

  onStartPress() {
    if (this.props.onStart) {
      this.props.onStart();
    }

    this.setState(state => ({
      isPlaying: true,
      isStarted: true,
      progress: state.progress === 1 ? 0 : state.progress,
    }));

    this.hideControls();
  }

  onProgress(event) {
    if (this.state.isSeeking) {
      return;
    }
    if (this.props.onProgress) {
      this.props.onProgress(event);
    }
    this.setState({
      progress: event.currentTime / (this.props.duration || this.state.duration),
    });
  }

  onEnd(event) {
    if (this.props.onEnd) {
      this.props.onEnd(event);
    }

    if (this.props.endWithThumbnail) {
      this.setState({ isStarted: false });
      this.player.dismissFullscreenPlayer();
    }

    this.setState({ progress: 1 });

    if (!this.props.loop) {
      this.setState(
        { isPlaying: false },
        () => this.player.seek(0)
      );
    } else {
      this.player.seek(0);
    }
  }

  onLoad(event) {
    if (this.props.onLoad) {
      this.props.onLoad(event);
    }

    const { duration } = event;
    this.setState({ duration });
  }

  onPlayPress() {
    if (this.props.onPlayPress) {
      this.props.onPlayPress();
    }

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

  onToggleFullScreen() {
    this.player.presentFullscreenPlayer();
  }

  onSeekBarLayout({ nativeEvent }) {
    const customStyle = this.props.customStyles.seekBar;
    let padding = 0;
    if (customStyle && customStyle.paddingHorizontal) {
      padding = customStyle.paddingHorizontal * 2;
    } else if (customStyle) {
      padding = customStyle.paddingLeft || 0;
      padding += customStyle.paddingRight ? customStyle.paddingRight : 0;
    } else {
      padding = 20;
    }

    this.seekBarWidth = nativeEvent.layout.width - padding;
  }

  onSeekStartResponder() {
    return true;
  }

  onSeekMoveResponder() {
    return true;
  }

  onVolCtrlStartResponder() {
    return true;
  }            

  onMoveShouldSetPanResponder() {
    return true;
  }

  onSeekGrant(e) {
    this.seekTouchStart = e.nativeEvent.pageX;
    this.seekProgressStart = this.state.progress;
    this.wasPlayingBeforeSeek = this.state.isPlaying;
    this.setState({
      isSeeking: true,
      isPlaying: false,
    });
  }

  onSeekRelease() {
    this.setState({
      isSeeking: false,
      isPlaying: this.wasPlayingBeforeSeek,
    });
    this.showControls();
  }

  onVolCtrlGrant(e) {
    console.log("Test vol ctrl grant start, pos=", e.nativeEvent.pageY);
    const volBarNeedShow = true;
    this.volControlTouchStart = e.nativeEvent.pageY;
    this.showControls();
    this.setState({volBarNeedShow});
  }

  onVolCtrlRelease() {
    console.log("Test vol ctrl touch release");
    const volBarNeedShow = false;
    this.setState({volBarNeedShow});
  }

  onVolControl(e) {
    let volume = this.state.volume;
    const senseFactor = 5/4;
    const diff = this.volControlTouchStart - e.nativeEvent.pageY;
    const volChange = diff / (this.getSizeStyles().height) * senseFactor;
    volume = volume + volChange;   
    if(volume > 1) {
      volume = 1;
    }
    if(volume < 0) {
      volume = 0;
    }
    console.log("Test onVolControl,pos=", e.nativeEvent.pageY,"new vol=", volume, "vol control touch start=", this.volControlTouchStart); 
    this.volControlTouchStart = e.nativeEvent.pageY;
    let mutedChg = ((volume == 0 && this.state.volume > 0 && !this.state.isMuted) || (volume > 0 && this.state.volume == 0) 
                    || (this.state.isMuted && volChange > 0));
    const isMuted = (mutedChg ? (!this.state.isMuted) : (this.state.isMuted));
    console.log("Test mutedChg=", mutedChg, "new mute status=", isMuted);
    this.setState({
      volume,
      isMuted,
    });
  }

  onSeek(e) {
    const diff = e.nativeEvent.pageX - this.seekTouchStart;
    const ratio = 100 / this.seekBarWidth;
    const progress = this.seekProgressStart + ((ratio * diff) / 100);

    this.setState({
      progress,
    });

    this.player.seek(progress * this.state.duration);
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

  hideControls() {
    if (this.props.onHideControls) {
      this.props.onHideControls();
    }

    if (this.props.disableControlsAutoHide) {
      return;
    }

    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
      this.controlsTimeout = null;
    }
    this.controlsTimeout = setTimeout(() => {
      this.setState({ isControlsVisible: false });
    }, this.props.controlsTimeout);
  }

  showControls() {
    if (this.props.onShowControls) {
      this.props.onShowControls();
    }

    this.setState({
      isControlsVisible: true,
    });
    this.hideControls();
  }

  seek(t) {
    this.player.seek(t);
  }

  stop() {
    this.setState({
      isPlaying: false,
      progress: 0,
    });
    this.seek(0);
    this.showControls();
  }

  pause() {
    this.setState({
      isPlaying: false,
    });
    this.showControls();
  }

  resume() {
    this.setState({
      isPlaying: true,
    });
    this.showControls();
  }

  formatTime(seconds) {
    let hour = parseInt(seconds/3600);
    let minute = parseInt(seconds/60);
    let sec = parseInt(seconds%60);
    console.log("Test input sec=", seconds, "hour=", hour, "minute=", minute, "sec=", sec);
    let formatTime = 0;
    if(hour > 99) {
      console.log("Test input time out of bound, seconds=", seconds);
      return formatTime;
    }
    if(seconds === 0) {
      return '00:00';
    }
    if(hour < 10 && hour > 0) {
      hour = '0' + hour.toString();
    }
    if(minute < 10) {
      minute = '0' + minute.toString();
    }
    if(sec < 10) {
      minute = '0' + sec.toString();
    }
    if(hour > 0) {
      formatTime = hour + ':' + minute + ':' + sec;
    }
    else {
      formatTime = minute + ':' + sec;
    }
    return formatTime;
  }

  getMuteStatus() {
    this.state.isMuted = (this.state.volume === 0 ? true : false);
    console.log("Test isMuted=", this.state.isMuted, "vol=", this.state.volume);
    return this.props.muted || this.state.isMuted;
  }

  renderStartButton() {
    const { customStyles } = this.props;
    return (
      <TouchableOpacity
        style={[styles.playButton, customStyles.playButton]}
        onPress={this.onStartPress}
      >
        <Icon style={[styles.playArrow, customStyles.playArrow]} name="play-arrow" size={42} />
      </TouchableOpacity>
    );
  }

  renderThumbnail() {
    const { thumbnail, style, customStyles, ...props } = this.props;
    return (
      <BackgroundImage
        {...props}
        style={[
          styles.thumbnail,
          this.getSizeStyles(),
          style,
          customStyles.thumbnail,
        ]}
        source={thumbnail}
      >
        {this.renderStartButton()}
      </BackgroundImage>
    );
  }

  renderVolControlBar() {
    return (
      <View style={{
              backgroundColor: 'rgba(255, 0, 0, 0)',
              alignSelf: 'flex-end',
              height:this.getSizeStyles().height,
              width:100, 
              marginTop:-this.getSizeStyles().height,
              }}  
            hitSlop={{ top: 20, bottom: 20, left: 10, right: 20 }}
            onStartShouldSetResponder={this.onVolCtrlStartResponder}
            onMoveShouldSetPanResponder={this.onVolCtrlMoveResponder}
            onResponderGrant={this.onVolCtrlGrant}
            onResponderMove={this.onVolControl}
            onResponderRelease={this.onVolCtrlRelease}
            onResponderTerminate={this.onVolCtrlRelease}            
      />     
    );
  }

  renderSeekBar(fullWidth) {
    const { customStyles, disableSeek } = this.props;
    return (
      <View
        style={[
          styles.seekBar,
          fullWidth ? styles.seekBarFullWidth : {},
          customStyles.seekBar,
          fullWidth ? customStyles.seekBarFullWidth : {},
        ]}
        onLayout={this.onSeekBarLayout}
      >
        <View
          style={[
            { flexGrow: this.state.progress },
            styles.seekBarProgress,
            customStyles.seekBarProgress,
          ]}
        />
        { !fullWidth && !disableSeek ? (
          <View
            style={[
              styles.seekBarKnob,
              customStyles.seekBarKnob,
              this.state.isSeeking ? { transform: [{ scale: 1 }] } : {},
              this.state.isSeeking ? customStyles.seekBarKnobSeeking : {},
            ]}
            hitSlop={{ top: 20, bottom: 20, left: 10, right: 20 }}
            onStartShouldSetResponder={this.onSeekStartResponder}
            onMoveShouldSetPanResponder={this.onSeekMoveResponder}
            onResponderGrant={this.onSeekGrant}
            onResponderMove={this.onSeek}
            onResponderRelease={this.onSeekRelease}
            onResponderTerminate={this.onSeekRelease}
          />
        ) : null }
        <View style={[
          styles.seekBarBackground,
          { flexGrow: 1 - this.state.progress },
          customStyles.seekBarBackground,
        ]} />
      </View>
    );
  }

  renderVolReflect() {
    return (
      <View
        style={{
          backgroundColor: 'rgba(255, 0, 0, 0)',  
          width:this.getSizeStyles().width/3,
          height:60,
          alignSelf: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          marginBottom: this.getSizeStyles().height*11/25,
        }}
      >
        <Icon
          style={{
            color: 'white',
            alignSelf: 'center',
            marginBottom: 10,
          }}
          name={this.state.isMuted ? 'volume-off' : 'volume-up'}
          size={30}
        />    
        <View 
          style={{
            backgroundColor: '#F00',
            flexDirection: 'row',
          }}
        > 
          <View 
            style={[
            {    
              height: 3,
              backgroundColor: '#FFF',
            },            
            {flexGrow: this.state.volume},
            ]}
          />
          <View
            style={[
              {
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                height: 3,   
              },
              {flexGrow: 1 - this.state.volume},
            ]}
          />
        </View>
      </View>
    );
  }

  renderControls() {
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
        {this.renderSeekBar()}
        {
          <Text style={styles.timeSyle}>
            {this.formatTime(this.state.duration)}
          </Text>
        }
        {this.props.muted ? null : (
          <TouchableOpacity onPress={this.onMutePress} style={customStyles.controlButton}>
            <Icon
              style={[styles.extraControl, customStyles.controlIcon]}
              name={this.state.isMuted ? 'volume-off' : 'volume-up'}
              size={24}
            />
          </TouchableOpacity>
        )}
        {(Platform.OS === 'android' || this.props.disableFullscreen) ? null : (
          <TouchableOpacity onPress={this.onToggleFullScreen} style={customStyles.controlButton}>
            <Icon
              style={[styles.extraControl, customStyles.controlIcon]}
              name="fullscreen"
              size={32}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  renderVideo() {
    const {
      video,
      style,
      resizeMode,
      pauseOnPress,
      fullScreenOnLongPress,
      customStyles,
      ...props
    } = this.props;
    return (
      <View style={customStyles.videoWrapper}>
        <Video
          {...props}
          style={[
            styles.video,
            this.getSizeStyles(),
            style,
            customStyles.video,
          ]}
          ref={p => { this.player = p; }}
          volume={this.state.volume}          
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
          <TouchableOpacity
            style={styles.overlayButton}
            onPress={() => {
              this.showControls();
              if (pauseOnPress)
                this.onPlayPress();
            }}
            onLongPress={() => {
              if (fullScreenOnLongPress && Platform.OS !== 'android')
                this.onToggleFullScreen();
            }}
          /> 
          {this.state.volBarNeedShow
            ? this.renderVolReflect() : null}                                
        </View>     
        {((!this.state.isPlaying) || this.state.isControlsVisible)
          ? this.renderControls() : this.renderSeekBar(true)}
        {this.renderVolControlBar()}
      </View>
    );
  }

  renderContent() {
    const { thumbnail, style } = this.props;
    const { isStarted } = this.state;

    if (!isStarted && thumbnail) {
      return this.renderThumbnail();
    } else if (!isStarted) {
      return (
        <View style={[styles.preloadingPlaceholder, this.getSizeStyles(), style]}>
          {this.renderStartButton()}
        </View>
      );
    }
    return this.renderVideo();
  }

  renderHeader() {
    const {height} = this.getSizeStyles();
    const {videoTitle} = this.props;
    return (
      <View style={{marginTop: -height, marginBottom: height, flexDirection: 'row', justifyContent: 'center', }}>
        <TouchableOpacity 
          style={{flex: 1,paddingLeft: 10, justifyContent: 'center'}}
          onPress={this.onBack}
        >
          <Icon name="arrow-back" size={25} color="white" />
        </TouchableOpacity>
        <View 
          style={{flex: 5, alignItems: 'flex-start'}}
        >
          <Text 
            style={{color: 'white', backgroundColor: 'transparent', fontSize: 18}}
            numberOfLines={1}//only show one line 
            allowFontScaling={true}
          >
            {videoTitle}
          </Text>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View onLayout={this.onLayout} style={this.props.customStyles.wrapper}>
        {this.renderContent()}
        {(!this.state.isPlaying || this.state.isControlsVisible) ? this.renderHeader(): null}
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
  style: ViewPropTypes.style,
  controlsTimeout: PropTypes.number,
  disableControlsAutoHide: PropTypes.bool,
  disableFullscreen: PropTypes.bool,
  loop: PropTypes.bool,
  resizeMode: Video.propTypes.resizeMode,
  hideControlsOnStart: PropTypes.bool,
  endWithThumbnail: PropTypes.bool,
  disableSeek: PropTypes.bool,
  pauseOnPress: PropTypes.bool,
  fullScreenOnLongPress: PropTypes.bool,
  videoTitle: PropTypes.string,
  customStyles: PropTypes.shape({
    wrapper: ViewPropTypes.style,
    video: Video.propTypes.style,
    videoWrapper: ViewPropTypes.style,
    controls: ViewPropTypes.style,
    playControl: TouchableOpacity.propTypes.style,
    controlButton: TouchableOpacity.propTypes.style,
    controlIcon: Icon.propTypes.style,
    playIcon: Icon.propTypes.style,
    seekBar: ViewPropTypes.style,
    seekBarFullWidth: ViewPropTypes.style,
    seekBarProgress: ViewPropTypes.style,
    seekBarKnob: ViewPropTypes.style,
    seekBarKnobSeeking: ViewPropTypes.style,
    seekBarBackground: ViewPropTypes.style,
    thumbnail: Image.propTypes.style,
    playButton: TouchableOpacity.propTypes.style,
    playArrow: Icon.propTypes.style,
  }),
  onEnd: PropTypes.func,
  onProgress: PropTypes.func,
  onLoad: PropTypes.func,
  onStart: PropTypes.func,
  onPlayPress: PropTypes.func,
  onHideControls: PropTypes.func,
  onShowControls: PropTypes.func,
  onBack: PropTypes.func,
};

VideoPlayer.defaultProps = {
  videoWidth: 1280,
  videoHeight: 720,
  autoplay: false,
  controlsTimeout: 2000,
  loop: false,
  resizeMode: 'contain',
  disableSeek: false,
  pauseOnPress: false,
  fullScreenOnLongPress: true,
  customStyles: {},
};
