import type { CustomStyles } from 'react-native-video-player';
import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { Animated, StyleSheet } from 'react-native';

export interface AnimationRef {
  runControlsAnimation: (toValue: number, callback?: () => void) => void;
}

interface AnimatedWrapperProps {
  animationDuration: number;
  children: React.ReactNode;
  customStylesControls: CustomStyles['controls'];
}

export const AnimatedWrapper = memo(
  forwardRef<AnimationRef, AnimatedWrapperProps>(
    ({ animationDuration, children, customStylesControls }, ref) => {
      const animationValue = useRef(new Animated.Value(0)).current;

      const runControlsAnimation = useCallback(
        (toValue: number, callback?: () => void) => {
          Animated.timing(animationValue, {
            toValue,
            duration: animationDuration,
            useNativeDriver: true,
          }).start(callback);
        },
        [animationDuration, animationValue]
      );

      useImperativeHandle(ref, () => ({
        runControlsAnimation,
      }));

      const controlsTranslateY = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [48, 0],
      });

      return (
        <Animated.View
          style={[
            styles.controls,
            customStylesControls,
            { transform: [{ translateY: controlsTranslateY }] },
          ]}
        >
          {children}
        </Animated.View>
      );
    }
  )
);

const styles = StyleSheet.create({
  controls: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    height: 48,
    marginTop: -48,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
