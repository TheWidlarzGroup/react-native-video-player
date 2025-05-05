# API - Styles

The `react-native-video-player` component allows you to customize its appearance using the `customStyles` property.

---

## Custom Styles

### `wrapper`
- **Description**: Styles the main container that wraps the entire video player.

### `videoWrapper`
- **Description**: Styles the container that holds the video element and controls.

### `video`
- **Description**: Styles the video element itself. Supports properties like `backgroundColor` for older Android versions.

### `controls`
- **Description**: Styles the container for the control elements (play, pause, seek bar, etc.).

### `playControl`
- **Description**: Styles the play/pause button within the controls.

### `controlButton`
- **Description**: Styles for all buttons in the controls (e.g., mute, fullscreen).

### `controlIcon`
- **Description**: Styles for the icons inside the control buttons, such as the volume or fullscreen icons.

### `playIcon`
- **Description**: Styles specifically for the play/pause icon on the start button.

### `seekBar`
- **Description**: Styles the seek bar container, which shows the progress of the video.

### `seekBarFullWidth`
- **Description**: Styles the seek bar when it spans the full width (e.g., in fullscreen mode).

### `seekBarProgress`
- **Description**: Styles the bar indicating playback progress.

### `seekBarKnob`
- **Description**: Styles the draggable knob used to seek (move playback position).

### `seekBarKnobSeeking`
- **Description**: Styles the knob when the user is actively seeking (dragging the knob).

### `seekBarBackground`
- **Description**: Styles the background of the seek bar.

### `thumbnail`
- **Description**: Styles the video thumbnail container shown before playback starts.

### `thumbnailImage`
- **Description**: Styles the video thumbnail image shown before playback starts.

### `playButton`
- **Description**: Styles the start button overlaying the thumbnail.

### `playArrow`
- **Description**: Styles the play arrow icon inside the start button.

### `durationText`
- **Description**: Styles the text displaying the video duration.

---

## Example Usage

Here’s an example of how to apply custom styles:

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import VideoPlayer from 'react-native-video-player';

const App = () => (
  <View style={{ flex: 1 }}>
    <VideoPlayer
      source={{ uri: 'https://example.com/video.mp4' }}
      thumbnail={{ uri: 'https://example.com/thumbnail.jpg' }}
      autoplay
      customStyles={{
        wrapper: styles.wrapper,
        playControl: styles.playControl,
        seekBarKnob: styles.seekBarKnob,
        thumbnailImage: styles.thumbnailImage
      }}
    />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    // ...
  },
  playControl: {
    // ...
  },
  seekBarKnob: {
    // ...
  },
  thumbnailImage: {
    resizeMode: 'contain',
    // ...
  },
});

export default App;
```

With the `customStyles` property, you have complete control over how the player looks and feels, ensuring it integrates seamlessly into your app's design.
