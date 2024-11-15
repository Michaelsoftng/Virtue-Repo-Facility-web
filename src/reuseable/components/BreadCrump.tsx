import Link from 'next/link'
import React from 'react'

interface BredCrumpsProps{
    pageTitle: string,
     pageWrapper?: string,
    showExportRecord: boolean
}
const BreadCrump: React.FC<BredCrumpsProps> = ({ pageTitle, pageWrapper, showExportRecord }) => {
    return (
        <div className="flex justify-between bg-white px-4 py-4 border-l-2 border-b-2">
            <p className="capitalize text-[14px]"><Link href='' className="text-[#08AC85] font-bold">{pageWrapper ? pageWrapper :'Dashboard' } &nbsp;&nbsp;/&nbsp;&nbsp;</Link>  <span className="text-[#8C93A3]">{pageTitle}</span></p>
            {
                showExportRecord && 

                <button className="px-5 py-1 border-2 border-[#CACDD5] text-[#525C76] font-bold text-sm ">Export Records</button>

            }
        </div>
    )
}

export default BreadCrump
