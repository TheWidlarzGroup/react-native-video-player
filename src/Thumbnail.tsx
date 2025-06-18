import {
  Image,
  ImageBackground,
  type ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import type { CustomStyles, VideoPlayerProps } from './index';
import { memo, type ReactNode } from 'react';
import { Overlay } from './Overlay';

interface StartButtonProps {
  onStart: () => void;
  customStylesPlayButton: CustomStyles['playButton'];
  customStylesPlayArrow: CustomStyles['playArrow'];
}

interface ThumbnailProps extends StartButtonProps {
  thumbnailSource: ImageSourcePropType;
  style: VideoPlayerProps['style'];
  sizeStyles: { height: number; width: number };
  onStart: () => void;
  customStylesThumbnail: CustomStyles['thumbnail'];
  customStylesThumbnailImage: CustomStyles['thumbnailImage'];
  customStylesPlayButton: CustomStyles['playButton'];
  customStylesPlayArrow: CustomStyles['playArrow'];
  renderOverlayComponent?: () => ReactNode;
}

export const StartButton = ({
  onStart,
  customStylesPlayButton,
  customStylesPlayArrow,
}: StartButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.playButton, customStylesPlayButton]}
      onPress={onStart}
    >
      <Image
        source={require('./img/play.png')}
        style={[styles.playArrow, customStylesPlayArrow]}
      />
    </TouchableOpacity>
  );
};

export const Thumbnail = memo(
  ({
    thumbnailSource,
    style,
    sizeStyles,
    onStart,
    customStylesThumbnail,
    customStylesThumbnailImage,
    customStylesPlayButton,
    customStylesPlayArrow,
    renderOverlayComponent,
  }: ThumbnailProps) => {
    return (
      <ImageBackground
        source={thumbnailSource}
        imageStyle={customStylesThumbnailImage}
        style={[styles.thumbnail, sizeStyles, style, customStylesThumbnail]}
      >
        <Overlay renderOverlayComponent={renderOverlayComponent} />
        <StartButton
          customStylesPlayButton={customStylesPlayButton}
          onStart={onStart}
          customStylesPlayArrow={customStylesPlayArrow}
        />
      </ImageBackground>
    );
  }
);

const styles = StyleSheet.create({
  thumbnail: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 32,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playArrow: {
    width: 28,
    height: 28,
    marginLeft: 2,
  },
});
