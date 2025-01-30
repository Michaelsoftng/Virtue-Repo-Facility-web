/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable, { colorCombination, formatDateTime } from '@/src/partials/tables/AdminFacilitiesTable'
import { GrMoney } from "react-icons/gr";
import { GrLocationPin } from "react-icons/gr";
import { PieChartAnalytics } from '@/src/partials/tables/PieChartAnalytics'
import Link from 'next/link'
import PlusIcon from '@/src/reuseable/icons/PlusIcon'
import client from '@/lib/apolloClient';
import { GetRequest } from '@/src/graphql/queries';
import { getFacilityTests, useGetAvailableTestByFacility } from '@/src/hooks/useGetAvailableTestByFacility'
import { toast } from 'react-toastify';
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/navigation';
import Approval from '@/src/reuseable/components/Approval'
import Loading from '@/app/admin/dashboard/loading'
import TablePreloader from '@/src/preLoaders/TablePreloader'
import NumberPreloader from '@/src/preLoaders/NumberPreloader'
import '@/public/assets/css/custom.css';
import RoundedImage from '@/src/partials/RoundedImage'
import RoundedNoImage from '@/src/partials/RoundedNoImage'
import { FaCalendarCheck } from "react-icons/fa6";
import { MdPhoneIphone } from "react-icons/md";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { TbSum, TbStatusChange } from "react-icons/tb";
import { formatMoney } from '@/src/partials/tables/NewRequesTable'
import { useGetTestRequestById } from '@/src/hooks/useGetTestRequestById'

const sampleCompletedData: TableData[] = [
    {
        facility: 'MRS specialist',
        location: '15 jumble street, Garki',
        available_test: 300,
        rating: 5,
    },
    {
        facility: 'MRS specialist',
        location: '15 jumble street, Garki',
        available_test: 300,
        rating: 5,
    },
    {

        facility: 'MRS specialist',
        location: '15 jumble street, Garki',
        available_test: 300,
        rating: 5,
    },
    {

        facility: 'MRS specialist',
        location: '15 jumble street, Garki',
        available_test: 300,
        rating: 5,
    },
    {

        facility: 'MRS specialist',
        location: '15 jumble street, Garki',
        available_test: 300,
        rating: 5,
    }
];

const chartData = [
    { test: "Covid", visitors: 275, fill: "red" },
    { test: "Malaria", visitors: 200, fill: "green" },
    { test: "RVS", visitors: 187, fill: "purple" },
    { test: "Hyperloric A.", visitors: 173, fill: "blue" },
    { test: "others", visitors: 90, fill: "#44AC21" },
]


const Facilities = ({ params }: { params: { ID: string } }) => {
    // const testRequestData = useRef<TableData[]>([]);
    const { ID } = params;
    const { data: testRequestData, error, loading: testDataLoading } = useGetTestRequestById(ID)

    if (testDataLoading ) {
        return <Loading />;
    }
    // if (requestData) {
    //     testRequestData.current = requestData.getTestRequestById
    // }
    // const testRequestData = testData?.getRequest[0]?.testRequest as TableData[]
    // const updatedTestRequestData = testRequestData?.map((request) => {
    //     const {
    //         __typename,
    //         test,
    //         facility,
    //         patientName,
    //         patientAge,
    //         testResult,
    //         resultDate,
    //         package: testpackage,
    //         ...rest
    //     } = request;
        
    //     const newRequestData = {
    //         test: test.name,
    //         package:  testpackage ? testpackage.package_name: "single test",
    //         patient_name: patientName,
    //         patient_age: patientAge,
    //         test_result: testResult,
    //         resultDate: resultDate,
    //         ...rest,

    //     };

    //     return newRequestData
    // }) || []; // Default to an empty array if patientData is undefined

    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageWrapper="Dashboard  / Requests"  pageTitle="Single Test" showExportRecord={true} />

                    
                    <div className="px-8 py-4">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="bg-white shadow-md px-4 py-4 rounded-md">
                                <h2 className="text-lg font-bold mb-3"> Patient </h2>

                                <div className="grid grid-cols-[50px_calc(100%-50px)] gap-1">
                                    <div>
                                        {testRequestData.patient.user.image ? (
                                            <RoundedImage userimage={testRequestData.patient.user.image} classes="rounded-full w-[40px] h-[40px]" width={30} height={30} />
                                        ) : (
                                            <RoundedNoImage
                                                    text={`${testRequestData.patient.user.firstName.trim()} ${testRequestData.patient.user.lastName.trim()}`
                                                    .split(' ')
                                                    .map((word: string) => word[0].toUpperCase())
                                                    .join('')}
                                                    classes={`rounded-full w-[40px] h-[40px] bg-red-500 text-white text-center flex items-center justify-center`}
                                            />
                                        )}
                                    </div>
                                    <div className="text-[#231935bd]">
                                        <span className="block test-black">
                                            {testRequestData.patient.user.firstName ? `${testRequestData.patient.user.firstName} ${testRequestData.patient.user.lastName}` : "Not Set"}

                                        </span>
                                        <span className="text-[#8C93A3] block mt-[-2px]">{testRequestData.patient.user.email}</span>
                                    </div>
                                </div>

                                <p className="flex gap-2 text-[#8C93A3] text-[14px] mt-2 ml-2"><GrLocationPin className="text-red-500" style={{ width: '30px', height: '30px' }} />
                                    <span className="text-black">
                                        {/* {facilityData.getUserById.streetAddress ? `${facilityData.getUserById.streetAddress} ${facilityData.getUserById.city}, ${facilityData.getUserById.state}` : 'Not set'} */}
                                        {testRequestData.request.samplePickUpAddress}
                                    </span>
                                </p>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><MdPhoneIphone style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Contact line: {testRequestData.patient.user.phoneNumber}</span></p>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><FaCalendarCheck style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Request Date:  {formatDateTime(testRequestData.createdAt)}</span></p>
                            </div>
                            
                            {/* phlebotomist */}

                            <div className="bg-white shadow-md px-4 py-4 rounded-md">
                                <div className="flex justify-between ">
                                    <h2 className="text-lg font-bold mb-3"> Phlebotomist </h2>
                                   
                                </div>
                                
                                {
                                    testRequestData.request.phlebotomist ? (
                                        <>
                                            <div className="grid grid-cols-[50px_calc(100%-50px)] gap-1">
                                                <div>
                                                    {testRequestData.request.phlebotomist.user.image ? (
                                                        <RoundedImage userimage={testRequestData.request.phlebotomist.user.image} classes="rounded-full w-[40px] h-[40px]" width={30} height={30} />
                                                            ) : (
                                                        <RoundedNoImage
                                                                text={`${testRequestData.request.phlebotomist.user.firstName.trim()} ${testRequestData.request.phlebotomist.user.lastName.trim()}`
                                                                .split(' ')
                                                                .map((word: string) => word[0].toUpperCase())
                                                                .join('')}
                                                            classes={`rounded-full w-[40px] h-[40px] bg-green-600 text-white text-center flex items-center justify-center`}
                                                        />
                                                    )}
                                                </div>
                                                <div className="text-[#231935bd]">
                                                    <span className="block test-black">
                                                        {testRequestData.request.phlebotomist.user.firstName ? `${testRequestData.request.phlebotomist.user.firstName} ${testRequestData.request.phlebotomist.user.lastName}` : "Not Set"}

                                                    </span>
                                                    <span className="text-[#8C93A3] block mt-[-2px]">{testRequestData.request.phlebotomist.user.email}</span>
                                                </div>
                                            </div>
                                            <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><FaCalendarCheck style={{ width: '25px', height: '25px' }} className="text-green-600" /><span className="mt-1">Status:  {testRequestData.request.sampleStatus}</span></p>

                                            <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><FaCalendarCheck style={{ width: '25px', height: '25px' }} className="text-green-600" /><span className="mt-1">Pick up date:  {formatDateTime(testRequestData.request.sampleCollectionDate)}</span></p>

                                            <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><MdPhoneIphone style={{ width: '25px', height: '25px' }} className="text-green-600" /><span className="mt-1">Contact line: {testRequestData.request.phlebotomist.user.phoneNumber}</span></p>
                                            <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><FaCalendarCheck style={{ width: '25px', height: '25px' }} className="text-green-600" /><span className="mt-1">Drop Off date: {formatDateTime(testRequestData.request.samepleDropOffDate)}</span></p>
                                        </>
                                        )
                                        : 
                                        (<div></div>)
                                    
                                }
                            </div>


                            {/* facility */}
                            <div className="bg-white shadow-md px-4 py-4 rounded-md">
                                <h2 className="text-lg font-bold mb-3">Other Information </h2>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><TbSum style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Package: {testRequestData.package ? testRequestData.package.packageName : "single test"}</span></p>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><FaMoneyCheckDollar style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Amount: {formatMoney(testRequestData.facilityEarning)}</span></p>
                                
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><FaCalendarCheck style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Result Date: {formatDateTime(testRequestData.resultDate)}</span></p>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><TbStatusChange style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Sample Status: {testRequestData.request.sampleStatus}</span></p>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><TbStatusChange style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Result Status: {testRequestData.status }</span></p>

                            </div>
                        </div>
{/* to do, get bundle test and show the rest test in the bundle belonging to this facility for easy navigation */}
                        {/* {
                            testDataLoading
                                 
                                ?
                                <TablePreloader /> : */}
                               
                       
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Facilities
