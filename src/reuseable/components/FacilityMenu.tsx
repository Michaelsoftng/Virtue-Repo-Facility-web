"use client"
import React from 'react'
import Link from 'next/link'
import DashboardIcon from '../icons/DashboardIcon'
import LogoutIcon from '../icons/LogoutIcon'
import RequestIcon from '../icons/RequestIcon'
import SettingsIcon from '../icons/SettingIcon'
import ResultsIcon from '../icons/ResultsIcon'
import TestIcon from '../icons/TestIcon'
import { usePathname } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext'

const FacilityMenu = () => {
    const currentRoute = usePathname(); // Path without query parameters
    const { logout } = useAuth()
    return (
        <div className="pl-8">
            <ul className="">
                <div className="mt-4">
                    <li className="mt-8">
                        
                        <Link href='/facility/dashboard/home' className="flex gap-4 ">
                            <DashboardIcon
                                stroke={currentRoute === '/facility/dashboard/home' ? '#08AD85' : '#4F475E'}
                            />
                            <span>
                                Dashboard
                            </span>
                            
                        </Link>
                    </li>
                    <li className="flex gap-4 mt-8">
                        <Link href='/facility/dashboard/requests' className="flex gap-4 ">
                            <RequestIcon
                                stroke={currentRoute === '/facility/dashboard/requests' ? '#08AD85' : '#4F475E'}
                            />
                            <span className={`${currentRoute === '/facility/dashboard/requests' ? 'text-[#08AD85]' : 'text-black'}`}>Request</span>
                        </Link>
                    </li>
                    <li className="flex gap-4 mt-8">
                        <Link href='/facility/dashboard/tests' className="flex gap-4 ">
                            <TestIcon
                                stroke={currentRoute === '/facility/dashboard/tests' ? '#08AD85' : '#4F475E'}
                            />
                            <span className={`${currentRoute === '/facility/dashboard/tests' ? 'text-[#08AD85]' : 'text-black'}`}>Test</span>
                        </Link>
                    </li>
                    <li className="flex gap-4 mt-8">
                        <Link href='/facility/dashboard/packages' className="flex gap-4 ">
                            <ResultsIcon
                                stroke={currentRoute === '/facility/dashboard/packages' ? '#08AD85' : '#4F475E'}
                            />
                            <span className={`${currentRoute === '/facility/dashboard/packages' ? 'text-[#08AD85]' : 'text-black'}`}>Packages</span>

                        </Link>
                    </li> 
                    <li className="flex gap-4 mt-8">
                        <Link href='/facility/dashboard/results' className="flex gap-4 ">
                            <ResultsIcon
                                stroke={currentRoute === '/facility/dashboard/results' ? '#08AD85' : '#4F475E'}
                            />
                            <span className={`${currentRoute === '/facility/dashboard/results' ? 'text-[#08AD85]' : 'text-black'}`}>Results</span>
                            
                        </Link>
                    </li> 
                </div>
                
                <div className="mt-16 border-t-solid border-t-[1px] border-t-[#E9E8EC]">
                    <li className="flex gap-4 mt-10">
                        <Link href='/facility/dashboard/setting' className="flex gap-4">
                            <SettingsIcon
                                stroke={currentRoute === '/facility/dashboard/setting' ? '#08AD85' : '#4F475E'}
                            />
                            <span>Settings</span>
                            
                        </Link>
                    </li>
                    <li className="flex gap-4 mt-8">
                        <LogoutIcon />
                        <button onClick={logout}>Logout</button>
                    </li>
                </div>
                
            </ul>
        </div>
    )
}

export default FacilityMenu
