import React from 'react'
import Image from 'next/image'
import logo from '@/public/images/Nearestclink.png'

const SmallLogo = () => {
    return (
        <Image src={logo} alt='NearestClink Logo' />
    )
}

export default SmallLogo
