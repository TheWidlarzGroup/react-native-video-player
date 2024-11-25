import Svg, { Path, type SvgProps } from 'react-native-svg';

interface VolumeUpSvgProps extends SvgProps {
  size?: number;
}

const VolumeUpSvg = ({
  size = 24,
  fill = '#fff',
  ...props
}: VolumeUpSvgProps) => {
  return (
    <Svg
      {...props}
      width={size}
      height={size}
      viewBox="0 -960 960 960"
      fill={fill}
    >
      <Path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z" />
    </Svg>
  );
};

export default VolumeUpSvg;
