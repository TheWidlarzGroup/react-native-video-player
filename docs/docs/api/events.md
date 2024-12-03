# API - Events

The `react-native-video-player` component exposes a set of events that allow you to interact with and control the video playback. Below, you’ll find a detailed list of these events, their descriptions, and how to use them. These events give you full flexibility to customize the behavior of the video player.

---

## Component Events

### `onStart`
- **Type**: `function`
- **Description**: Callback function triggered when the start button is pressed.
- **Example**:
  ```
  onStart={() => {
    console.log('Video started!');
  }}
  ```

---

### `onPlayPress`
- **Type**: `function`
- **Description**: Callback function triggered when the play button is pressed.
- **Example**:
  ```
  onPlayPress={() => {
    console.log('Play button pressed!');
  }}
  ```

---

### `onHideControls`
- **Type**: `function`
- **Description**: Callback function triggered when the video controls are hidden.
- **Example**:
  ```
  onHideControls={() => {
    console.log('Controls are hidden.');
  }}
  ```

---

### `onShowControls`
- **Type**: `function`
- **Description**: Callback function triggered when the video controls are shown.
- **Example**:
  ```
  onShowControls={() => {
    console.log('Controls are shown.');
  }}
  ```

---

## Additional Events from `react-native-video`

The `react-native-video-player` component also supports all events from the underlying [react-native-video](https://github.com/TheWidlarzGroup.com/react-native-video) library. These include events like `onLoad`, `onError`, `onEnd`, and more.

For a full list of events and how to use them, refer to the [react-native-video events documentation](https://docs.thewidlarzgroup.com/react-native-video/component/events).
