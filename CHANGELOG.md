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
