import React from 'react'

type ImageProps = {
    text: string,
    classes: string,
}
const RoundedNoImage: React.FC<ImageProps> = ({ classes, text}) => {
    return (
        <div className={classes} >
            {text}
        </div>
    )
}

export default RoundedNoImage
