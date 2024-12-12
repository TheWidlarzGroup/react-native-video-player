import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installation

Getting started with `react-native-video-player` is quick and easy. Follow these steps to integrate the library into your React Native project.

---

## Step 1: Install the Library

Select your package manager below to see the appropriate installation command:

<Tabs groupId="package-managers">
  <TabItem value="npm" label="NPM">
  ```bash
  npm install react-native-video-player react-native-video
  ```
  </TabItem>
  <TabItem value="yarn" label="YARN" default>
  ```bash
  yarn add react-native-video-player react-native-video
  ```
  </TabItem>
</Tabs>

---

## Step 2: Install iOS Dependencies

If you're targeting iOS, navigate to the `ios` directory and run `pod install` to install the necessary CocoaPods:

```
cd ios
pod install
```

---

## Example Usage

Here’s a simple example of how to use `react-native-video-player` in your app:

```tsx
import React from 'react';
import {View} from 'react-native';
import VideoPlayer from 'react-native-video-player';

const App = () => (
  <View style={{ flex: 1 }}>
    <VideoPlayer
      source={{ uri: 'https://example.com/video.mp4' }}
      thumbnail={{ uri: 'https://example.com/thumbnail.jpg' }}
      autoplay
    />
  </View>
);

export default App;
```

---

You're now ready to use `react-native-video-player` in your project. Happy coding! 🚀
