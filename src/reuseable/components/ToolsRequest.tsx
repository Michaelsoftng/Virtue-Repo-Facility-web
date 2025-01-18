import React from 'react'
import { ImInfo } from 'react-icons/im'

export interface AccountApproval {
    setIsOpenToolsModal:(arg:boolean) => void
}
const ToolsRequest: React.FC<AccountApproval> = ({ setIsOpenToolsModal }) => {
    return (
        <div className="bg-yellow-50 border-2 border-yellow-400 w-full flex justify-between px-6 py-2">
            <div className="flex gap-x-4 py-2">
                <div className="flex h-full items-center justify-center">
                    <ImInfo className="text-yellow-400 font-bold" style={{ color: '#facc15', fontSize: '24px', fontWeight: 'bold' }} />
                </div>

                <div className="text-yellow-400">
                    <h2 className="font-semibold text-[18px]">Phlebotomist is requesting tools</h2>
                    <p className="text-[14px] mt-2">THis phlebotomist has a pending tools request</p>
                </div>
            </div>
            <div className="flex h-full items-center justify-center py-3">
                <button onClick={() => setIsOpenToolsModal(true)} className="font-semibold bg-yellow-100 border-2 border-yellow-500 px-4 py-2 rounded text-yellow-600">Approve request</button>
            </div>
        </div>
    )
}

export default ToolsRequest
