

# What do you need from the video UI controls library?

As we approach the end of 2024, we've started working on the roadmap for this project. This means it's not dead—it was just waiting for the perfect moment! Please share your enthusiasm and feedback here: [https://github.com/TheWidlarzGroup/react-native-video-player/discussions/186](https://github.com/TheWidlarzGroup/react-native-video-player/discussions/186)

# react-native-video-player

🎬 `<VideoPlayer />` component for React Native with a few controls. This player uses
[react-native-video](https://github.com/TheWidlarzGroup/react-native-video) under the hood

https://github.com/user-attachments/assets/1bbec058-4f4c-4ab0-9f14-1454c901b474

## Installation

```
yarn add react-native-video-player@beta react-native-video
```

or
```
npm install --save react-native-video-player@beta react-native-video
```

Then, install pods
```
cd ios
pod install
```

## Example

```tsx
  import VideoPlayer, { type VideoPlayerRef } from 'react-native-video-player';

  const playerRef = useRef<VideoPlayerRef>(null);

  <VideoPlayer
    ref={playerRef}
    endWithThumbnail
    thumbnail={{
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    }}
    source={{
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    }}
    onError={(e) => console.log(e)}
    showDuration={true}
  />
```

## Documentation

| Prop                    | Description                                                                                                                                  |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| source                  | The video source to pass to react-native-video.                                                                                              |
| thumbnail               | An Image source to use as thumbnail before the video gets loaded.                                                                            |
| endThumbnail            | An Image source to use as thumbnail after the video has ended.                                                                               |
| videoWidth              | Width of the video to calculate the player size.                                                                                             |
| videoHeight             | Height of the video to calculate the player size.                                                                                            |
| duration                | Duration should always be set out of the box. if not, you can use this prop                                                                  |
| showDuration            | Show duration in seek bar.                                                                                                                   |
| autoplay                | Start the video automatically.                                                                                                               |
| defaultMuted            | Start the video muted, but allow toggling.                                                                                                   |
| muted                   | Start the video muted and hide the mute toggle button.                                                                                       |
| controlsTimeout         | Timeout when to hide the controls.                                                                                                           |
| disableControlsAutoHide | Disable auto hiding the controls.                                                                                                            |
| disableFullscreen       | Disable the fullscreen button.                                                                                                               |
| repeat                  | Loop the video after playback is done.                                                                                                       |
| resizeMode              | The video's resizeMode. defaults to contain and is passed to react-native-video.                                                             |
| hideControlsOnStart     | Hides the controls on start video.                                                                                                           |
| endWithThumbnail        | Returns to the thumbnail after the video ends. If an `endThumbnail` image is not specified then the image specified in `thumbnail` is shown. |
| disableSeek             | Disable video seeking.                                                                                                                       |
| pauseOnPress            | Automatically pause/play when pressing the video player anywhere.                                                                            |
| fullScreenOnLongPress   | Automatically show video on fullscreen when doing a long press.                                                                              |
| onStart                 | Callback for when the start button is pressed.                                                                                               |
| onPlayPress             | Callback for when the play button is pressed.                                                                                                |
| onHideControls          | Callback for when the controls are being hide.                                                                                               |
| onShowControls          | Callback for when the controls are being shown.                                                                                              |
| customStyles            | The player can be customized in this object, see customStyles for the options.                                                               |

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

### Ref methods

| Method                  | Props           | Description                                                               |
|-------------------------|-----------------|---------------------------------------------------------------------------|
| seek                    | time: float     | Seek the player to the given time.                                        |
| stop                    |                 | Stop the playback and reset back to 0:00.                                 |
| pause                   |                 | Pause the playback.                                                       |
| resume                  |                 | Resume the playback.                                                      |

## Future features

Check out our [Roadmap](https://github.com/TheWidlarzGroup/react-native-video-player/discussions/186) for what's coming up next! We're always working on new features and improvements, so stay tuned!

## Community support
We have an discord server where you can ask questions and get help. [Join the discord server](https://discord.gg/WXuM4Tgb9X)

## Enterprise Support
<p>
  📱 <i>react-native-video-player</i> is provided <i>as it is</i>. For enterprise support or other business inquiries, <a href="https://www.thewidlarzgroup.com/?utm_source=rnv&utm_medium=readme#Contact">please contact us 🤝</a>. We can help you with the integration, customization and maintenance. We are providing both free and commercial support for this project. let's build something awesome together! 🚀
</p>
