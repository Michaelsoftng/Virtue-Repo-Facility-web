
import React from 'react';

interface IconProps {
    fill?: string; // Fill color for the paths
    height?: number; // Height of the icon
    width?: number; // Width of the icon
    stroke?: string; // Stroke color
    strokeWidth?: number; // Stroke width
}

const ResultsIcon: React.FC<IconProps> = ({
    fill = 'none',
    height = 24,
    width = 24,
    stroke = '#4F475E', // Default stroke color
    strokeWidth = 1.5, // Default stroke width
}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg">
            <path d="M21.66 10.44L20.68 14.62C19.84 18.23 18.18 19.69 15.06 19.39C14.56 19.35 14.02 19.26 13.44 19.12L11.76 18.72C7.59 17.73 6.3 15.67 7.28 11.49L8.26 7.30001C8.46 6.45001 8.7 5.71001 9 5.10001C10.17 2.68001 12.16 2.03001 15.5 2.82001L17.17 3.21001C21.36 4.19001 22.64 6.26001 21.66 10.44Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.06 19.3901C14.44 19.8101 13.66 20.1601 12.71 20.4701L11.13 20.9901C7.15998 22.2701 5.06997 21.2001 3.77997 17.2301L2.49997 13.2801C1.21997 9.3101 2.27997 7.2101 6.24997 5.9301L7.82997 5.4101C8.23997 5.2801 8.62997 5.1701 8.99997 5.1001C8.69997 5.7101 8.45997 6.4501 8.25997 7.3001L7.27997 11.4901C6.29997 15.6701 7.58998 17.7301 11.76 18.7201L13.44 19.1201C14.02 19.2601 14.56 19.3501 15.06 19.3901Z" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12.64 8.53003L17.49 9.76003" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11.66 12.3999L14.56 13.1399" stroke="#292D32" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    );
};

export default ResultsIcon;