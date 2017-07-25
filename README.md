# React Native Video Player

A React Native video player with a few controls. This player uses
react-native-video for the video playback.


![demo gif](https://raw.githubusercontent.com/cornedor/react-native-video-player/master/demo.gif "Demo GIF")

## Installation

```
npm install --save react-native-video-player react-native-video react-native-vector-icons
react-native link react-native-video
react-native link react-native-vector-icons
```

## Props

| Prop                    | Description                                                                                 |
|-------------------------|---------------------------------------------------------------------------------------------|
| video                   | The video source to pass to react-native-video.                                             |
| thumbnail               | An Image source to use as thumbnail before the video gets loaded.                           |
| videoWidth              | Width of the video to calculate the player size.                                            |
| videoHeight             | Height of the video to calculate the player size.                                           |
| duration                | Duration can not always be figured out (e.g. when using hls), this can be used as fallback. |
| autoplay                | Start the video automatically.                                                              |
| defaultMuted            | Start the video muted, but allow toggling.                                                  |
| muted                   | Start the video muted and hide the mute toggle button.                                      |
| controlsTimeout         | Timeout when to hide the controls.                                                          |
| disableControlsAutoHide | Disable auto hiding the controls.                                                           |
| disableFullscreen       | Disable the fullscreen button.                                                              |
| loop                    | Loop the video after playback is done.                                                      |
| resizeMode              | The video's resizeMode. defaults to contain and is passed to react-native-video.            |
| hideControlsOnStart     | Hides the controls on start video.                                                          |
| endWithThumbnail        | Returns to the thumbnail after the video ends.                                              |
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

## Future features

- [X] Make seek bar seekable.
- [x] Make player customizable.
- [ ] Add volume control
- [X] Add fullscreen button
  - [X] Add fullscreen button for android
- [ ] Add loader

## Setting up fullscreen on Android

Step 1:

Go to your ```android\app\src\main\java\your\package\directory``` folder where you can find ```MainActivity.java```. Copy the java files from the repo's  ```android\app\src\main\java``` folder and paste them there. Open those files in any editor(Android Studio recommended) and change the package names according to your project. After that, go to your ```MainApplication.java``` file 
and under the ```new MainReactPackage()```, copy and paste this: ```new BridgePackage()``` and it should look similar to the code below if you do not have other packages.
```
@Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new BridgePackage()
          );
     }
```
Step 2: 

Make a folder in your ```android\app\src\main\res``` directory and name it ```layout```, then copy the player_fullscreen.xml from the repo's ```android\app\src\main\res\layout``` directory and paste it into your directory and then go to your ```AndroidManifest.xml``` and add this before the ending application tag: 
            ```
            <activity android:name=".VideoActivity"
               android:screenOrientation="sensorLandscape"
               android:configChanges="orientation|screenSize"
            />
            ```
            
           
If you want to remove the action bar, change your theme or change the theme for your activity from the manifest     

And then your fullscreen should be working and ready to go!

