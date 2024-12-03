interface Props {
    size?: number;
    fill?: string;
    width?: number;
    height?: number;
}
export const CopyIcon = ({ fill, size, height, width, ...props }: Props) => {
    return (
        <svg
            width={size || width || 24}
            height={size || height || 24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke-linecap="round"
            stroke-linejoin="round"
            {...props}
        >
            <path stroke={'none'} d="M0 0h24v24H0z" fill={'none'} />
            <path stroke={fill} strokeWidth={1.5} d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
            <path stroke={fill} strokeWidth={1.5} d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
        </svg>
    );
};

