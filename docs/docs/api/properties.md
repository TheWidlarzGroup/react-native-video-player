# API - Properties

The `react-native-video-player` component exposes a wide range of properties to give you full control over video playback and UI customization. Below, you’ll find a comprehensive list of supported props, their descriptions, and how to use them. Additionally, this component supports all props from the underlying [react-native-video](https://docs.thewidlarzgroup.com/react-native-video/component/props) library.

---

## Component Props

### `autoplay`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Automatically starts video playback when the component is loaded.

---

### `controlsTimeout`
- **Type**: `number`
- **Default**: `3000` (ms)
- **Description**: The time (in milliseconds) before the controls are hidden automatically when inactive.

---

### `defaultMuted`
- **Type**: `boolean`
- **Description**: Starts the video muted but allows toggling sound.

---

### `disableControlsAutoHide`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Prevents the controls from being hidden automatically, keeping them visible at all times.

---

### `disableFullscreen`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Disables the fullscreen toggle button in the player.

---

### `disableSeek`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Disables seeking within the video.

---

### `duration`
- **Type**: `number`
- **Description**: The duration of the video in seconds. If not provided, the player attempts to fetch it automatically.

---

### `endThumbnail`
- **Type**: `object`
- **Description**: An image source displayed after the video ends. If not provided, the `thumbnail` is reused.
- **Example**:
  ```
  endThumbnail={{
    uri: 'https://example.com/end-thumbnail.jpg',
  }}
  ```

---

### `endWithThumbnail`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: After the video ends, the player returns to displaying the thumbnail. If `endThumbnail` is not provided, the `thumbnail` is reused.

---

### `fullScreenOnLongPress`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Enables entering fullscreen mode with a long press gesture.

---

### `hideControlsOnStart`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Hides controls when the video starts playing.

---

### `muted`
- **Type**: `boolean`
- **Description**: Starts the video muted and hides the mute toggle.

---

### `pauseOnPress`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Pauses or resumes playback when the player is tapped.

---

### `repeat`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Loops the video playback continuously when enabled.

---

### `resizeMode`
- **Type**: `string`
- **Default**: `'contain'`
- **Description**: Defines how the video should be resized within the player. Options include `'contain'`, `'cover'`, and `'stretch'`.

---

### `showDuration`
- **Type**: `boolean`
- **Default**: `false`
- **Description**: If `true`, displays the video’s duration on the seek bar.

---

### `source`
- **Type**: `object`
- **Description**: The video source object passed to the underlying `react-native-video` component. This is a required property to define the video file or stream.
- **Example**:
  ```
  source={{
    uri: 'https://example.com/video.mp4',
  }}
  ```

---

### `thumbnail`
- **Type**: `object`
- **Description**: An image source to display as a thumbnail before the video starts. This is useful for showing a preview or placeholder.
- **Example**:
  ```
  thumbnail={{
    uri: 'https://example.com/thumbnail.jpg',
  }}
  ```

---

### `videoHeight`
- **Type**: `number`
- **Description**: Height of the video to calculate the player’s aspect ratio.

---

### `videoWidth`
- **Type**: `number`
- **Description**: Width of the video to calculate the player’s aspect ratio.

---

## Additional Props

The `react-native-video-player` component supports **all props available in the `react-native-video` library**. You can refer to the [react-native-video documentation](https://docs.thewidlarzgroup.com/react-native-video/component/props) for a detailed list of these additional props.
