import { memo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

interface OverlayProps {
  renderOverlayComponent?: () => ReactNode;
}

export const Overlay = memo(({ renderOverlayComponent }: OverlayProps) => {
  if (!renderOverlayComponent) return null;
  return (
    <View style={styles.overlayContainer}>{renderOverlayComponent()}</View>
  );
});

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
});
