
import React from 'react';

interface IconProps {
    fill?: string; // Fill color for the paths
    height?: number; // Height of the icon
    width?: number; // Width of the icon
    stroke?: string; // Stroke color
    strokeWidth?: number; // Stroke width
}

const LogoutIcon: React.FC<IconProps> = ({
    fill = 'none',
    height = 24,
    width = 24,
    stroke = '#4F475E', // Default stroke color
    strokeWidth = 1.5, // Default stroke width
}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg">
            <path d="M8.90002 7.56023C9.21002 3.96023 11.06 2.49023 15.11 2.49023H15.24C19.71 2.49023 21.5 4.28023 21.5 8.75023V15.2702C21.5 19.7402 19.71 21.5302 15.24 21.5302H15.11C11.09 21.5302 9.24002 20.0802 8.91002 16.5402" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 12H3.62" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.85 8.6499L2.5 11.9999L5.85 15.3499" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    );
};

export default LogoutIcon;