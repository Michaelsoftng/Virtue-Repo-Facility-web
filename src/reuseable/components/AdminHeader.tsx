import React from 'react'
import Image from 'next/image'
import UserImage from '@/public/images/userdefault.png'
import { useAuth } from '@/src/context/AuthContext'
import LogoIcon from '../icons/LogoIcon'

const AdminHeader = () => {
    const { user } = useAuth();
    return (
        <div className="border-solid border-[1px] border-gray-300 grid grid-cols-[250px_calc(100%-250px)]">
            <div className="py-1 w-full grid grid-cols-[140px] place-content-center items-center border-r-[1px] border-r-solid border-r-gray-300">
                <LogoIcon />
            </div>
            <div className="grid grid-cols-[calc(100%-300px)_300px] py-1 px-5">
                <div>
                    <h2 className="font-medium flex items-center h-full">Dashboard</h2>
                </div>

                <div className="flex justify-end gap-4 ">
                    <p className="font-[600] flex items-center h-full captialize">{user?.staff?.role} | {user?.firstName} {user?.lastName}</p>
                    <Image src={UserImage} alt='facility image' className="rounded w-[50px] h-[50px]" />
                </div>
            </div>
        </div>
    )
}

export default AdminHeader
