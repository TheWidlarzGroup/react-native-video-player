# React Native Video Player

A React Native video player with a few controls. This player uses
react-native-video for the video playback.


![demo gif](https://raw.githubusercontent.com/cornedor/react-native-video-player/master/demo.gif "Demo GIF")

## Installation

```
npm install --save react-native-video-player
react-native link react-native-video
react-native link react-native-vector-icons
```

## Props

| Prop                | Description                                                                                 |
|---------------------|---------------------------------------------------------------------------------------------|
| video               | The video source to pass to react-native-video.                                             |
| thumbnail           | An Image source to use as thumbnail before the video gets loaded.                           |
| videoWidth          | Width of the video to calculate the player size.                                            |
| videoHeight         | Height of the video to calculate the player size.                                           |
| duration            | Duration can not always be figured out (e.g. when using hls), this can be used as fallback. |
| autoplay            | Start the video automatically.                                                              |
| defaultMuted        | Start the video muted, but allow toggling.                                                  |
| muted               | Start the video muted and hide the mute toggle button.                                      |
| controlsTimeout     | Timeout when to hide the controls.                                                          |
| loop                | Loop the video after playback is done.                                                      |
| resizeMode          | The video's resizeMode. defaults to contain and is passed to react-native-video.            |
| hideControlsOnStart | Hides the controls on start video.                                                          |
| customStyles        | The player can be customized with these custom styles:                                      |

### customStyles

 - wrapper
 - video
 - controls
 - playControl
 - controlButton
 - controlIcon
 - playIcon
 - seekBar
 - seekBarProgress
 - thumbnail
 - playButton
 - playArrow

## Future features

- [ ] Make seek bar seekable.
- [x] Make player customizable.
- [ ] Add volume control
- [ ] Add fullscreen button
- [ ] Add loader
