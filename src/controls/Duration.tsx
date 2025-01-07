import { forwardRef, memo, useImperativeHandle, useRef, useState } from 'react';
import type { CustomStyles } from 'react-native-video-player';
import { StyleSheet, Text } from 'react-native';
import type { ProgressRef } from '../Controls';

const getDurationTime = (duration: number): string => {
  const padTimeValueString = (value: number): string =>
    value.toString().padStart(2, '0');

  if (!Number.isFinite(duration)) return '';

  const seconds = Math.floor(duration % 60);
  const minutes = Math.floor((duration / 60) % 60);
  const hours = Math.floor((duration / 3600) % 24);

  return hours
    ? `${padTimeValueString(hours)}:${padTimeValueString(minutes)}:${padTimeValueString(seconds)}`
    : `${padTimeValueString(minutes)}:${padTimeValueString(seconds)}`;
};

const ProgressingDuration = forwardRef<
  ProgressRef,
  {
    duration: number;
    durationTextCustomStyles: CustomStyles['durationText'];
  }
>(({ duration, durationTextCustomStyles }, ref) => {
  const [progress, setProgress] = useState(0);

  useImperativeHandle(ref, () => ({
    onProgress: (progress) => {
      setProgress(progress);
    },
  }));
  return (
    <Text style={[styles.durationText, durationTextCustomStyles]}>
      {getDurationTime(progress * duration)}
    </Text>
  );
});

export const DurationText = memo(
  forwardRef<
    ProgressRef,
    {
      duration: number;
      durationTextCustomStyles: CustomStyles['durationText'];
    }
  >(({ duration, durationTextCustomStyles }, ref) => {
    const progressRef = useRef<ProgressRef>(null);

    useImperativeHandle(ref, () => ({
      onProgress: (progress) => {
        progressRef.current?.onProgress(progress);
      },
    }));

    return (
      <>
        <ProgressingDuration
          ref={progressRef}
          duration={duration}
          durationTextCustomStyles={durationTextCustomStyles}
        />
        <Text style={[styles.durationText, durationTextCustomStyles]}>
          {` / ${getDurationTime(duration)}`}
        </Text>
      </>
    );
  })
);

const styles = StyleSheet.create({
  durationText: {
    color: 'white',
  },
});
