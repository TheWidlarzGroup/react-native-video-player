

# What do you need from the video UI controls library?

As we approach the end of 2024, we've started working on the roadmap for this project. This means it's not dead—it was just waiting for the perfect moment! Please share your enthusiasm and feedback here: [https://github.com/TheWidlarzGroup/react-native-video-player/discussions/186](https://github.com/TheWidlarzGroup/react-native-video-player/discussions/186)

# react-native-video-player

🎥 `<VideoPlayer />` component for React Native with a few controls. This player uses
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

## Future features

Check out our [Roadmap](https://github.com/TheWidlarzGroup/react-native-video-player/discussions/186) for what's coming up next! We're always working on new features and improvements, so stay tuned!

## Community support
We have a discord server where you can ask questions and get help. [Join the discord server](https://discord.gg/WXuM4Tgb9X)

## Enterprise Support
<p>
  📱 <i>react-native-video-player</i> is provided <i>as it is</i>. For enterprise support or other business inquiries, <a href="https://www.thewidlarzgroup.com/?utm_source=rnv&utm_medium=readme#Contact">please contact us 🤝</a>. We can help you with the integration, customization and maintenance. We are providing both free and commercial support for this project. let's build something awesome together! 🚀
</p>
