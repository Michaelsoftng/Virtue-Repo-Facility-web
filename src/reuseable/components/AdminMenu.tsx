"use client"
import React from 'react'
import Link from 'next/link'
import DashboardIcon from '../icons/DashboardIcon'
import LogoutIcon from '../icons/LogoutIcon'
import RequestIcon from '../icons/RequestIcon'
import SettingsIcon from '../icons/SettingIcon'
import ResultsIcon from '../icons/ResultsIcon'
// import TestIcon from '../icons/TestIcon'
import { usePathname } from 'next/navigation';
import { useAuth } from '@/src/context/AuthContext'

const AdminMenu = () => {
    const currentRoute = usePathname(); // Path without query parameters
    const { logout } = useAuth()
    // handleLogout = () => {

    // }
    return (
        <div className="pl-8">
            <ul className="">
                <div className="mt-4">
                    <li className="mt-8">

                        <Link href='/admin/dashboard/home' className="flex gap-4 ">
                            <DashboardIcon
                                stroke={currentRoute === '/admin/dashboard/home' ? '#08AD85' : '#4F475E'}
                            />
                            <span className={`font-semibold ${currentRoute === '/admin/dashboard/home' ? 'text-[#08AD85]' : 'text-[#8C93A3]'}`}>
                                Dashboard
                            </span>

                        </Link>
                    </li>
                    <li className="mt-8">

                        <Link href='/admin/dashboard/staffs' className="flex gap-4 ">
                            <DashboardIcon
                                stroke={currentRoute === '/admin/dashboard/staffs' ? '#08AD85' : '#4F475E'}
                            />
                            <span className={`font-semibold ${currentRoute === '/admin/dashboard/staffs' ? 'text-[#08AD85]' : 'text-[#8C93A3]'}`}>
                                Staffs
                            </span>

                        </Link>
                    </li>
                    <li className="mt-8">

                        <Link href='/admin/dashboard/doctors' className="flex gap-4 ">
                            <DashboardIcon
                                stroke={currentRoute === '/admin/dashboard/doctors' ? '#08AD85' : '#4F475E'}
                            />
                            <span className={`font-semibold ${currentRoute === '/admin/dashboard/doctors' ? 'text-[#08AD85]' : 'text-[#8C93A3]'}`}>
                                Doctors
                            </span>

                        </Link>
                    </li>
                   
                    <li className="mt-8">

                        <Link href='/admin/dashboard/patients' className="flex gap-4 ">
                            <DashboardIcon
                                stroke={currentRoute === '/admin/dashboard/patients' ? '#08AD85' : '#4F475E'}
                            />
                            <span className={`font-semibold ${currentRoute === '/admin/dashboard/patients' ? 'text-[#08AD85]' : 'text-[#8C93A3]'}`}>
                                Patients
                            </span>

                        </Link>
                    </li>
                    <li className="mt-8">

                        <Link href='/admin/dashboard/phlebotomies' className="flex gap-4 ">
                            <DashboardIcon
                                stroke={currentRoute === '/admin/dashboard/phlebotomies' ? '#08AD85' : '#4F475E'}
                            />
                            <span className={`font-semibold ${currentRoute === '/admin/dashboard/phlebotomies' ? 'text-[#08AD85]' : 'text-[#8C93A3]'}`}>
                                Phlebotomists
                            </span>

                        </Link>
                    </li>
                    <li className="mt-8">

                        <Link href='/admin/dashboard/payments' className="flex gap-4 ">
                            <DashboardIcon
                                stroke={currentRoute === '/admin/dashboard/payments' ? '#08AD85' : '#4F475E'}
                            />
                            <span className={`font-semibold ${currentRoute === '/admin/dashboard/payments' ? 'text-[#08AD85]' : 'text-[#8C93A3]'}`}>
                                Payments
                            </span>

                        </Link>
                    </li>
                    <li className="flex gap-4 mt-8">
                        <Link href='/admin/dashboard/requests' className="flex gap-4 ">
                            <RequestIcon
                                stroke={currentRoute === '/admin/dashboard/requests' ? '#08AD85' : '#4F475E'}
                            />
                            <span className={`font-semibold ${currentRoute === '/admin/dashboard/requests' ? 'text-[#08AD85]' : 'text-[#8C93A3]'}`}>Requests</span>
                        </Link>
                    </li>
                    <li className="flex gap-4 mt-8">
                        <Link href='/admin/dashboard/facilities' className="flex gap-4 ">
                            <RequestIcon
                                stroke={currentRoute === '/admin/dashboard/facilities' ? '#08AD85' : '#4F475E'}
                            />
                            <span className={`font-semibold ${currentRoute === '/admin/dashboard/facilities' ? 'text-[#08AD85]' : 'text-[#8C93A3]'}`}>Facilities</span>
                        </Link>
                    </li>
                    <li className="mt-8">

                        <Link href='/admin/dashboard/consultations' className="flex gap-4 ">
                            <DashboardIcon
                                stroke={currentRoute === '/admin/dashboard/consultations' ? '#08AD85' : '#4F475E'}
                            />
                            <span className={`font-semibold ${currentRoute === '/admin/dashboard/consultations' ? 'text-[#08AD85]' : 'text-[#8C93A3]'}`}>
                                Consultations
                            </span>

                        </Link>
                    </li>
                    <li className="flex gap-4 mt-8">
                        <Link href='/admin/dashboard/packages' className="flex gap-4 ">
                            <ResultsIcon
                                stroke={currentRoute === '/admin/dashboard/packages' ? '#08AD85' : '#4F475E'}
                            />
                            <span className={`font-semibold ${currentRoute === '/admin/dashboard/packages' ? 'text-[#08AD85]' : 'text-[#8C93A3]'}`}>Test Packages</span>
                        </Link>
                    </li>
                    <li className="flex gap-4 mt-8">
                        <Link href='/admin/dashboard/tests' className="flex gap-4 ">
                            <ResultsIcon
                                stroke={currentRoute === '/admin/dashboard/tests' ? '#08AD85' : '#4F475E'}
                            />
                            <span className={`font-semibold ${currentRoute === '/admin/dashboard/tests' ? 'text-[#08AD85]' : 'text-[#8C93A3]'}`}>Tests/Results</span>
                        </Link>
                    </li>
                    <li className="flex gap-4 mt-8">
                        <Link href='/admin/dashboard/referrals' className="flex gap-4 ">
                            <ResultsIcon
                                stroke={currentRoute === '/admin/dashboard/referrals' ? '#08AD85' : '#4F475E'}
                            />
                            <span className={`font-semibold ${currentRoute === '/admin/dashboard/referrals' ? 'text-[#08AD85]' : 'text-[#8C93A3]'}`}>Referrals</span>

                        </Link>
                    </li>
                </div>

                <div className="mt-16 border-t-solid border-t-[1px] border-t-[#E9E8EC]">
                    <li className="flex gap-4 mt-10">
                        <Link href='/admin/dashboard/setting' className="flex gap-4">
                            <SettingsIcon
                                stroke={currentRoute === '/admin/dashboard/setting' ? '#08AD85' : '#4F475E'}
                            />
                            <span className={`font-semibold ${currentRoute === '/admin/dashboard/setting' ? 'text-[#08AD85]' : 'text-[#8C93A3]'}`}>Settings</span>

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

export default AdminMenu
