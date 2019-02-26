## 0.9.1
 - Fixed video repeating when loop turned off (thanks @mattvot)

## 0.9.0
 - Added `stop` method.
 - Added `pause` method.
 - Added `resume` method.
 - Fixed seekbar not resetting after replaying video.

## 0.8.6
 - Added `seek` method.

## 0.8.2
 - Fixed error in more Android versions

## 0.8.1
 - Added `disableSeek`, `pauseOnPress`, `fullScreenOnLongPress` (thanks @mateofd).
 - Bumped react-native-video version (thanks @ndcollins).

## 0.8.0
 - Updated to react native 0.46.4 and fixed PropTypes (thanks @Traviskn).
 - Added `onStart` property (thanks @gvillenave).
 - Added `onPlayPress`, `onHideControls`, `onShowControls` callbacks.
 - Added `disableFullscreen` prop.

## 0.7.0
 - Fixed actually using `seekBarBackground` from custom style.
 - Fixed a setState after unmount
 - Added `videoWrapper` custom style.
 - Added `disableControlsAutoHide` prop that stops the controls from hiding after the timeout.

## 0.6.1
 - Added a hitSlop to the seek bar knob.
 - Fixed the seek bar on android.
 - Changed the way the seek bar is build up. There are new customStyles called `seekBarFullWidth`
   and `seekBarBackground`. A part of the script needs the width of the seek bar. The padding is
   added to this width by by reading paddingHorizontal or paddingLeft and paddingRight from the
   custom `seekBar` styles.

## 0.6.0
 - The seekBar is now seek-able.
 - Added `seekBarKnob` to `customStyles` to style the seek bar knob.

## 0.2.0

 - `resizeMode` prop added, now defaults to `contain`
 - `customStyles` prop added, allows for customization of the player.
