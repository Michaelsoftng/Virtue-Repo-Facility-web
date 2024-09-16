import React from 'react'
import Link from 'next/link'
const FacilityMenu = () => {
  return (
    <div>
        <ul className="">
              
            <div>
               <li>
                    <Link href='#'>Dashboard</Link>
                </li>
                <li>
                    <Link href='#'>Request</Link>
                </li>
                <li>
                    <Link href='#'>Test</Link>
                </li>
                <li>
                    <Link href='#'>Results</Link>
                </li> 
            </div>
            
            
            <li>
                <Link href='#'>Settings</Link>
            </li>
            <li>
                <Link href='#'></Link>
            </li>
        </ul>
    </div>
  )
}

export default FacilityMenu
