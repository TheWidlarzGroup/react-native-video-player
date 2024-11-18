import Svg, { Path, type SvgProps } from 'react-native-svg';

interface FullscreenSvgProps extends SvgProps {
  size?: number;
}

const FullscreenSvg = ({
  size = 24,
  fill = '#fff',
  ...props
}: FullscreenSvgProps) => {
  return (
    <Svg
      {...props}
      width={size}
      height={size}
      viewBox="0 -960 960 960"
      fill={fill}
    >
      <Path d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z" />
    </Svg>
  );
};

export default FullscreenSvg;
