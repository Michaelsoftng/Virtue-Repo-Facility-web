import React from 'react'
import UnverifiedUserIcon from '../icons/UnverifiedUserIcon'
import VerifiedUseIcon from '../icons/VerifiedUseIcon'
import NewUserIcon from '../icons/NewUserIcon'
import UserIcon from '../icons/UserIcon'
import NumberPreloader from '@/src/preLoaders/NumberPreloader'

export interface TotalsPatientProps {
  loading: boolean,
  totalusers: number,
  newUsers: number,
  verifiedUsers: number,
  unverifedPatients: number,
  type?: string
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TotalPatients: React.FC<TotalsPatientProps> = ({ loading, totalusers, newUsers, verifiedUsers, unverifedPatients, type }) => {
  return (
    <div className='grid grid-cols-4 gap-4'>
        <div className="grid grid-cols-[30%_70%] gap-4 px-6 py-4 bg-white shadow-md rounded-lg">
              <div><div className='bg-[#D3E5FE80] px-2 py-4 h-[60px] flex justify-center items-center'><UserIcon /></div></div>
              
            <div>
          <h2 className="text-[#8C93A3] text-[16px] capitalize">Total {type ? type : "Users"}</h2>
                {
                  loading 
                  ?
                  <NumberPreloader/>
                  :
                  <p className="mt-2 text-black text-2xl font-bold">{totalusers}</p>
                }
                
            </div>
        </div>
        <div className="grid grid-cols-[30%_70%] gap-4 px-6 py-4 bg-white shadow-md rounded-lg">
              <div><div className="bg-[#EFCFFA80] px-2 py-4 h-[60px] flex justify-center items-center"><NewUserIcon /></div></div>
              
            <div>
            <h2 className="text-[#8C93A3] text-[16px] ">New {type ? type : "Users"}</h2>
                {
                  loading 
                  ?
                  <NumberPreloader/>
                  :
                  <p className="mt-2 text-black text-2xl font-bold">{newUsers}</p>
                }
            </div>
        </div>
        <div className="grid grid-cols-[30%_70%] gap-4 px-6 py-4 bg-white shadow-md rounded-lg">
              <div className="pt-2"><div className="bg-[#CAFBEF80] px-2 py-4 h-[60px] flex justify-center items-center"><VerifiedUseIcon /></div></div>
              
            <div>
                <h2 className="text-[#8C93A3] text-[16px] ">Verified {type ? type : "Users"}</h2>
                {
                  loading 
                  ?
                  <NumberPreloader/>
                  :
                  <p className="mt-2 text-black text-2xl font-bold">{verifiedUsers}</p>
                }
            </div>
        </div>
        <div className="grid grid-cols-[30%_70%] gap-4 px-6 py-4 bg-white shadow-md rounded-lg">
              <div className="pt-2"><div className="bg-[#F9CEE880] px-4 py-4 h-[60px] flex justify-center items-center"><UnverifiedUserIcon /></div></div>
              
            <div>
                <h2 className="text-[#8C93A3] text-[16px] ">Unverified {type ? type : "Users"}</h2>
                {
                  loading 
                  ?
                  <NumberPreloader/>
                  :
                  <p className="mt-2 text-black text-2xl font-bold">{unverifedPatients}</p>
                }
            </div>
        </div>
    </div>
  )
}

export default TotalPatients
