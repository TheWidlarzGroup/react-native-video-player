import Svg, { G, Polygon, type SvgProps } from 'react-native-svg';

interface PlaySvgProps extends SvgProps {
  size?: number;
}

const PlaySvg = ({ size = 24, fill = '#fff', ...props }: PlaySvgProps) => {
  return (
    <Svg {...props} width={size} height={size} viewBox="-0.5 0 8 8">
      <G fill="none">
        <G transform="translate(-427 -3765)" fill={fill}>
          <G transform="translate(56 160)">
            <Polygon points="371 3605 371 3613 378 3609" />
          </G>
        </G>
      </G>
    </Svg>
  );
};

export default PlaySvg;
