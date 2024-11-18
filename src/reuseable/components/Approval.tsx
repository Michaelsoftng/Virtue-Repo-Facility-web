import React from 'react'
import { ImInfo } from 'react-icons/im'

const Approval = () => {
  return (
      <div className="bg-[#D3E5FE] border-2 border-[#1B4ACB] w-full flex justify-between px-6 py-2">
          <div className="flex gap-x-4 py-2">
              <div className="flex h-full items-center justify-center">
                  <ImInfo className="text-[#1B4ACB] font-bold" style={{ color: '#1B4ACB', fontSize: '24px', fontWeight: 'bold' }} />
              </div>

              <div className="text-[#1B4ACB]">
                  <h2 className="font-semibold text-[18px]">Account needs approval</h2>
                  <p className="text-[14px] mt-2">Approval is still pending on this account</p>
              </div>
          </div>
          <div className="flex h-full items-center justify-center py-3">
              <button className="font-semibold bg-white border-2 border-gray-400 px-4 py-2 rounded text-[#525C76]">Approve account</button>
          </div>
      </div>
  )
}

export default Approval
