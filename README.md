# React Native Video Player [![npm][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/react-native-video-player.svg
[npm-url]: https://www.npmjs.com/package/react-native-video-player

A React Native video player with a few controls. This player uses
react-native-video for the video playback.

**Looking for maintainers! This project is currently no longer maintained. Please respond to issue #157 to become the new maintainer.**


![demo gif](https://raw.githubusercontent.com/cornedor/react-native-video-player/master/demo.gif "Demo GIF")

## Installation

```
yarn add react-native-video-player react-native-video react-native-vector-icons
```

or
```
npm install --save react-native-video-player react-native-video react-native-vector-icons
```

Then, for React Native >= 0.60:
```
cd ios
pod install
```

Add the following at the beginning of `./android/app/build.gradle` on Android (required for `react-native-vector-icons` to work):
```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

Add the following in your `Info.plist` file on iOS (required for `react-native-vector-icons` to work):

```xml
<key>UIAppFonts</key>
<array>
	<string>MaterialIcons.ttf</string>
</array>
```

For React Native < 0.60
```
react-native link react-native-video
react-native link react-native-vector-icons
```
## Important Note
To avoid **Build Error** "Could not find com.yqritc:android-scalablevideoview:1.0.4."
Add jcenter() to your build.gradle file present at the android folder (add it under **allprojects**).
after the adding the changes, code would look like

For more info please refer to [LINK](https://stackoverflow.com/questions/68835157/error-when-trying-to-run-my-react-native-app-on-android)
```
allprojects {
    repositories {
        mavenCentral()
        mavenLocal()
        jcenter()
  }
}

```

## Example

```jsx
<VideoPlayer
    video={{ uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
    videoWidth={1600}
    videoHeight={900}
    thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
/>
```

## Props

| Prop                    | Description                                                                                 |
|-------------------------|---------------------------------------------------------------------------------------------|
| video                   | The video source to pass to react-native-video.                                             |
| thumbnail               | An Image source to use as thumbnail before the video gets loaded.                           |
| endThumbnail            | An Image source to use as thumbnail after the video has ended.                              |
| videoWidth              | Width of the video to calculate the player size.                                            |
| videoHeight             | Height of the video to calculate the player size.                                           |
| duration                | Duration can not always be figured out (e.g. when using hls), this can be used as fallback. |
| showDuration            | Show duration in seek bar.                                                                  |
| autoplay                | Start the video automatically.                                                              |
| defaultMuted            | Start the video muted, but allow toggling.                                                  |
| muted                   | Start the video muted and hide the mute toggle button.                                      |
| controlsTimeout         | Timeout when to hide the controls.                                                          |
| disableControlsAutoHide | Disable auto hiding the controls.                                                           |
| disableFullscreen       | Disable the fullscreen button.                                                              |
| loop                    | Loop the video after playback is done.                                                      |
| resizeMode              | The video's resizeMode. defaults to contain and is passed to react-native-video.            |
| hideControlsOnStart     | Hides the controls on start video.                                                          |
| endWithThumbnail        | Returns to the thumbnail after the video ends. If an `endThumbnail` image is not specified then the image specified in `thumbnail` is shown.                                              |
| disableSeek             | Disable video seeking.                                                                      |
| pauseOnPress            | Automatically pause/play when pressing the video player anywhere.                           |
| fullScreenOnLongPress   | Automatically show video on fullscreen when doing a long press.                             |
| onStart                 | Callback for when the start button is pressed.                                              |
| onPlayPress             | Callback for when the play button is pressed.                                               |
| onHideControls          | Callback for when the controls are being hide.                                              |
| onShowControls          | Callback for when the controls are being shown.                                             |
| customStyles            | The player can be customized in this object, see customStyles for the options.              |

All other props are passed to the react-native-video component.

### customStyles

 - wrapper
 - video
 - controls
 - playControl
 - controlButton
 - controlIcon
 - playIcon
 - seekBar
 - seekBarFullWidth
 - seekBarProgress
 - seekBarKnob
 - seekBarBackground
 - thumbnail
 - playButton
 - playArrow
 - videoWrapper

## Methods

| Method                  | Props           | Description                                                               |
|-------------------------|-----------------|---------------------------------------------------------------------------|
| seek                    | time: float     | Seek the player to the given time.                                        |
| stop                    |                 | Stop the playback and reset back to 0:00.                                 |
| pause                   |                 | Pause the playback.                                                       |
| resume                  |                 | Resume the playback.                                                      |

## Future features

- [X] Make seek bar seekable.
- [x] Make player customizable.
- [ ] Add volume control
- [X] Add fullscreen button
  - [ ] Add fullscreen button for Android (See PR #38 if you need fullscreen in Android)
- [ ] Add loader
- [ ] Add video duration/play time
