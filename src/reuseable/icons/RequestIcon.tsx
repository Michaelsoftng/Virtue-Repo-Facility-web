
import React from 'react';

interface IconProps {
    fill?: string; // Fill color for the paths
    height?: number; // Height of the icon
    width?: number; // Width of the icon
    stroke?: string; // Stroke color
    strokeWidth?: number; // Stroke width
}

const RequestIcon: React.FC<IconProps> = ({
    fill = 'none',
    height = 24,
    width = 24,
    stroke = '#4F475E', // Default stroke color
    strokeWidth = 1.5, // Default stroke width
}) => {
    return (

        <svg width={width} height={height} viewBox="0 0 24 24" fill={fill} xmlns="http://www.w3.org/2000/svg">
            <path d="M15.59 12.26C18.4232 12.26 20.72 9.96323 20.72 7.13C20.72 4.29678 18.4232 2 15.59 2C12.7567 2 10.46 4.29678 10.46 7.13C10.46 9.96323 12.7567 12.26 15.59 12.26Z" stroke={stroke} strokeWidth={strokeWidth} strokeMiterlimit="10" />
            <path d="M6.36002 19.44C8.06105 19.44 9.44003 18.0611 9.44003 16.36C9.44003 14.659 8.06105 13.28 6.36002 13.28C4.65898 13.28 3.28003 14.659 3.28003 16.36C3.28003 18.0611 4.65898 19.44 6.36002 19.44Z" stroke={stroke} strokeWidth={strokeWidth} strokeMiterlimit="10" />
            <path d="M16.62 21.9999C18.0338 21.9999 19.18 20.8537 19.18 19.4399C19.18 18.026 18.0338 16.8799 16.62 16.8799C15.2061 16.8799 14.06 18.026 14.06 19.4399C14.06 20.8537 15.2061 21.9999 16.62 21.9999Z" stroke={stroke} strokeWidth={strokeWidth} strokeMiterlimit="10" />
        </svg>
    );
};

export default RequestIcon;