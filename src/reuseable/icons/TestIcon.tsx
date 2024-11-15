
import React from 'react';

interface IconProps {
    fill?: string; // Fill color for the paths
    height?: number; // Height of the icon
    width?: number; // Width of the icon
    stroke?: string; // Stroke color
    strokeWidth?: number; // Stroke width
}

const TestIcon: React.FC<IconProps> = ({
    fill = 'none',
    height = 24,
    width = 24,
    stroke = '#4F475E', // Default stroke color
    strokeWidth = 1.5, // Default stroke width
}) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg">
            <path d="M8 2V5" stroke={stroke} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 2V5" stroke={stroke} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 13H15" stroke={stroke} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 17H12" stroke={stroke} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 3.5C19.33 3.68 21 4.95 21 9.65V15.83C21 19.95 20 22.01 15 22.01H9C4 22.01 3 19.95 3 15.83V9.65C3 4.95 4.67 3.69 8 3.5H16Z" stroke={stroke} strokeWidth={strokeWidth} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    );
};

export default TestIcon;