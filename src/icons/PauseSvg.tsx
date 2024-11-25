import Svg, { G, Path, type SvgProps } from 'react-native-svg';

interface PauseSvgProps extends SvgProps {
  size?: number;
}

const PauseSvg = ({ size = 24, fill = '#fff', ...props }: PauseSvgProps) => {
  return (
    <Svg {...props} width={size} height={size} viewBox="-1 0 8 8">
      <G fill="none">
        <G transform="translate(-67 -3765)" fill={fill}>
          <G transform="translate(56 160)">
            <Path d="M11 3613 L13 3613 L13 3605 L11 3605 L11 3613 Z M15 3613 L17 3613 L17 3605 L15 3605 L15 3613 Z" />
          </G>
        </G>
      </G>
    </Svg>
  );
};

export default PauseSvg;
