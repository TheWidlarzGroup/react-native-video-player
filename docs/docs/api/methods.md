# API - Methods

The `react-native-video-player` component exposes some methods through a ref. These methods provide direct control over video playback, allowing you to customize and manage the player programmatically.

---

## Using Ref Methods

To access the methods, you need to create a ref for the `VideoPlayer` component. Here's an example of how to set up a ref and use the available methods:

```tsx
import React, {useRef} from 'react';
import VideoPlayer, {type VideoPlayerRef} from 'react-native-video-player';

const App = () => {
  const playerRef = useRef<VideoPlayerRef>(null);

  const handlePause = () => {
      playerRef.current?.pause();
  };

  return (
    <VideoPlayer
      ref={playerRef}
      source={{ uri: 'https://example.com/video.mp4' }}
    />
  );
};
```

---

## Available Methods

### `seek(time)`
- **Description**: Moves the video playback to the specified `time` (in seconds).
- **Parameters**:
  - `time` (number): The time in seconds to which the player should seek.
- **Example**:
  ```ts
  playerRef.current?.seek(30); // Seeks to the 30th second
  ```

---

### `pause()`
- **Description**: Pauses the video playback.
- **Example**:
  ```ts
  playerRef.current?.pause();
  ```

---

### `resume()`
- **Description**: Resumes video playback from the current position.
- **Example**:
  ```ts
  playerRef.current?.resume();
  ```

---

### `stop()`
- **Description**: Stops the video playback and resets it to the beginning.
- **Example**:
  ```ts
  playerRef.current?.stop();
  ```

---

The `react-native-video-player` component also supports all methods from the underlying [react-native-video](https://github.com/TheWidlarzGroup.com/react-native-video) library. These include methods like `save`, `setFullScreen`, and more.

For a full list of methods and how to use them, refer to the [react-native-video methods documentation](https://docs.thewidlarzgroup.com/react-native-video/component/methods).
