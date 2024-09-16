import React from 'react'
import Link from 'next/link'
const FooterNav = () => {
  return (
    <div className="w-full grid grid-cols-4">
        <Link href={'#'} className="text-[14px] font-medium">About</Link>
        <Link href={'#'} className="text-[14px] font-medium">Privacy</Link> 
          <Link href={'#'} className="text-[14px] font-medium">Terms of use</Link> 
          <Link href={'#'} className="text-[14px] font-medium text-right">FAQ</Link> 

    </div>
  )
}

export default FooterNav
