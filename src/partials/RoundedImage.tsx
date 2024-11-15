import React from 'react'
import Image from 'next/image'

type ImageProps = {
    width: number,
    height: number,
    classes: string,
    userimage: string
}
const RoundedImage: React.FC<ImageProps> = ({ classes, userimage, height, width }) => {
    return (
        <Image src={`/assets/images/utilities/${userimage}`} alt='user patient'
            className={classes}
            width={width} height={height} />
    )
}

export default RoundedImage
