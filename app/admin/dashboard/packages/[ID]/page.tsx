/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import { CiLocationOn, CiClock2, CiPhone } from "react-icons/ci";
import { BiSolidStar } from "react-icons/bi";
import RequestIcon from '@/src/reuseable/icons/RequestIcon'
import { PieChartAnalytics } from '@/src/partials/tables/PieChartAnalytics'
import Link from 'next/link'
import PlusIcon from '@/src/reuseable/icons/PlusIcon'
import client from '@/lib/apolloClient';
import { GetPackageById } from '@/src/graphql/queries';
import { getFacilityTests, useGetAvailableTestByFacility } from '@/src/hooks/useGetAvailableTestByFacility'
import { toast } from 'react-toastify';
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/navigation';
import Approval from '@/src/reuseable/components/Approval'
import Loading from '../../loading'
import TablePreloader from '@/src/preLoaders/TablePreloader'
import NumberPreloader from '@/src/preLoaders/NumberPreloader'
import { useGetRecentTests } from '@/src/hooks/useGetRecentTests'

const chartData = [
    { test: "Covid", visitors: 275, fill: "red" },
    { test: "Malaria", visitors: 200, fill: "green" },
    { test: "RVS", visitors: 187, fill: "purple" },
    { test: "Hyperloric A.", visitors: 173, fill: "blue" },
    { test: "others", visitors: 90, fill: "#44AC21" },
]


const Package = ({ params }: { params: { ID: string } }) => {
    const { ID } = params;
    const { data: packageData, loading: pageLoading } = useQuery(GetPackageById, {
        variables: {
            id: ID
        },
        client,
    });
    const facilities = packageData?.getPackageById?.facilityPackages?.facility as TableData[]
    const updatedFacilityData = facilities?.map((singleFacility) => {

        const {
            __typename,
            id,
            facilityName,
            facilityType,
            user,
            createdAt,
            deletedAt,
            ...rest
        } = singleFacility;


        const facilityCity = user.city ? user.city : ''
        const facilityAddress = user.streetAddress ? `${user.streetAddress} ${facilityCity}` : 'Not set'

        const facilityState = user.state ? user.state : 'Not set'


        const newFacilityData = {
            facility_name: facilityName,
            type: facilityType.toLowerCase(),
            email: user.email,
            ...rest,
            address: facilityAddress,
            state: facilityState,
        };

        return newFacilityData
    }) || []; // Default to an empty array if patientData is undefined


    if (pageLoading) {
        return <Loading />;
    }
    
    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageTitle="Facilities" showExportRecord={true} />
                    <div className="px-8 py-4">
                        <div className="flex justify-between">
                            <div className="shadow-md bg-white px-8 py-4 flex gap-6 rounded-md">
                                <div className="bg-green-100 h-[50px] px-4 py-4 flex items-center justify-center mt-5">
                                    <RequestIcon fill='#08AD85' stroke='#08AD85' />
                                </div>
                                <div className="">
                                    <h2 className="text-[#8C93A3] mt-3">Total Available Facilities </h2>
                                    {
                                        pageLoading ?
                                        <NumberPreloader />
                                        :
                                            <p className="font-bold text-3xl  mt-3">{packageData.getPackageById.facilitesCount}</p>

                                    }
                                </div>
                            </div>
                            <div className="shadow-md bg-white px-8 py-4 flex gap-6 rounded-md">
                                <div className="bg-green-100 h-[50px] px-4 py-4 flex items-center justify-center mt-5">
                                    <RequestIcon fill='#08AD85' stroke='#08AD85' />
                                </div>
                                <div className="">
                                    <h2 className="text-[#8C93A3] mt-3">Total Available Tests</h2>
                                    {
                                        pageLoading ?
                                            <NumberPreloader />
                                            :
                                            <p className="font-bold text-3xl  mt-3">{packageData.getPackageById.testCount}</p>

                                    }
                                </div>
                            </div>

                            <div className="shadow-md bg-white px-4 py-4 gap-14 w-[23rem]  rounded-md">
                                <h2 className="text-[#8C93A3] font-[600] text-lg text-center mt-2">Current Rating</h2>
                                <p className="flex justify-center text-center w-full mt-4 space-x-1"> <span className="text-black font-bold text-[36px] leading-none ">4.5</span> <BiSolidStar className="text-[#F9CB57] text-4xl" /></p>
                            </div>
                        </div>

                        <div className="grid grid-cols-[calc(100%-25rem)_23rem] gap-x-8 mt-8">
                            <AdminFacilitiesTable
                                currentPage={1}
                                setCurrentPage={() => { }}
                                approveAction={() => { }}
                                changePage={() => { }}
                                tableHeadText='53 Facilities'
                                tableData={packageData.getPackageById.tests}
                                searchBoxPosition='hidden'
                                showTableHeadDetails={false}
                                showActions={false}
                                deleteAction={() => { }}
                                setItemToDelete={() => { }}
                                showPagination={false}
                                testPage='Request'
                            >

                                <div className="mx-4 mt-5">
                                    <h2 className="text-[#0F1D40] font-bold text-xl">All Test in this package</h2>
                                </div>
                            </AdminFacilitiesTable>
                            {/* <div className="mt-2 px-6 py-2  rounded-md bg-white shadow-md box-shadow: 0 4px 6px -1px rgb(34 0 0 / 0.1), 0 2px 4px -2px rgb(34 0 0 / 0.1);">
                                <h2 className="text-[20px] font-bold text-black">Top Test</h2>
                                <div className="">

                                    <div>
                                        <PieChartAnalytics chartData={chartData} />
                                    </div>


                                    <div className="grid grid-cols-4">

                                        {chartData.map((entry, index) => (
                                            <div key={index} className="" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <span className="rounded-full p-[1.5]"
                                                    style={{
                                                        backgroundColor: entry.fill,
                                                        display: 'inline-block',
                                                        width: '12px',
                                                        height: '12px',
                                                        marginRight: '8px'
                                                    }}
                                                ></span>
                                                <span className="text-[#555555] text-[10px] poppins leading-5">{entry.test}</span>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div> */}
                        </div>
                        {
                            pageLoading

                                ?
                                <TablePreloader />
                                :
                                <AdminFacilitiesTable
                                    currentPage={1}
                                    setCurrentPage={() => { }}
                                    marginTop={'mt-6'}
                                    approveAction={() => { }}
                                    changePage={() => { }}
                                    tableHeadText='53 Facilities'
                                    tableData={updatedFacilityData}
                                    searchBoxPosition='justify-start'
                                    showTableHeadDetails={false}
                                    showActions={true}
                                    deleteAction={() => { }}
                                    setItemToDelete={() => { }}
                                    showPagination={false}
                                    testPage='singleFacility'
                                >


                                    <div className="mx-4 mt-6 pt-4 flex justify-between">
                                        <h2 className="text-[#0F1D40] font-bold text-xl">Available Facilities</h2>
                                    </div>
                                </AdminFacilitiesTable>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Package
