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
import Loading from '../../loading'
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
import { useGetAssignmentByTaskId } from '@/src/hooks/useGetAssignmentByTaskId'

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
    const [requestDataLoading, setIsLoading] = useState<boolean>(false);
    const updatedRequestData = useRef<TableData[]>([]);
    const testRequestCount = useRef<number>(0);
    const { ID } = params;
    const { data: assignmentData, error, loading: assignmentDataLoading } = useGetAssignmentByTaskId(ID)
    const { data: requestData, loading: pageLoading } = useQuery(GetRequest, {
        variables: {
            id: ID
        },
        client,
    });
  
    if (pageLoading ) {
        return <Loading />;
    }
    const testRequestData = requestData.getRequest[0].testRequest as TableData[]
    const updatedTestRequestData = testRequestData?.map((request) => {
        const {
            __typename,
            test,
            facility,
            patientName,
            patientAge,
            testResult,
            resultDate,
            package: testpackage,
            ...rest
        } = request;
        
        const newRequestData = {
            test: test.name,
            package:  testpackage ? testpackage.package_name: "single test",
            patient_name: patientName,
            patient_age: patientAge,
            test_result: testResult,
            resultDate: resultDate,
            ...rest,

        };

        return newRequestData
    }) || []; // Default to an empty array if patientData is undefined


    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageWrapper="Dashboard  / Requests"  pageTitle="Single Request" showExportRecord={true} />

                    
                    <div className="px-8 py-4">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="bg-white shadow-md px-4 py-4 rounded-md">
                                <h2 className="text-lg font-bold mb-3"> Patient </h2>

                                <div className="grid grid-cols-[50px_calc(100%-50px)] gap-1">
                                    <div>
                                        {requestData.getRequest[0].patient.image ? (
                                            <RoundedImage userimage={requestData.getRequest[0].patient.image} classes="rounded-full w-[40px] h-[40px]" width={30} height={30} />
                                        ) : (
                                            <RoundedNoImage
                                                    text={`${requestData.getRequest[0].patient.user.firstName.trim()} ${requestData.getRequest[0].patient.user.lastName.trim()}`
                                                    .split(' ')
                                                    .map((word: string) => word[0].toUpperCase())
                                                    .join('')}
                                                    classes={`rounded-full w-[40px] h-[40px] bg-red-500 text-white text-center flex items-center justify-center`}
                                            />
                                        )}
                                    </div>
                                    <div className="text-[#231935bd]">
                                        <span className="block test-black">
                                            {requestData.getRequest[0].patient.user.firstName ? `${requestData.getRequest[0].patient.user.firstName} ${requestData.getRequest[0].patient.user.lastName}` : "Not Set"}

                                        </span>
                                        <span className="text-[#8C93A3] block mt-[-2px]">{requestData.getRequest[0].patient.user.email}</span>
                                    </div>
                                </div>

                                <p className="flex gap-2 text-[#8C93A3] text-[14px] mt-2 ml-2"><GrLocationPin className="text-red-500" style={{ width: '30px', height: '30px' }} />
                                    <span className="text-black">
                                        {/* {facilityData.getUserById.streetAddress ? `${facilityData.getUserById.streetAddress} ${facilityData.getUserById.city}, ${facilityData.getUserById.state}` : 'Not set'} */}
                                        {requestData.getRequest[0].samplePickUpAddress}
                                    </span>
                                </p>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><MdPhoneIphone style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Contact line: {requestData.getRequest[0].patient.user.phoneNumber}</span></p>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><FaCalendarCheck style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Request Date:  {formatDateTime(requestData.getRequest[0].requestDate)}</span></p>
                            </div>
                            
                            {/* phlebotomist */}

                            <div className="bg-white shadow-md px-4 py-4 rounded-md">
                                <div className="flex justify-between ">
                                    <h2 className="text-lg font-bold mb-3"> Phlebotomist </h2>
                                    <Link href={`${ID}/assignment`} className="bg-blue-600 text-white px-3 py-2 rounded-lg">
                                        {
                                            assignmentDataLoading ?
                                                <NumberPreloader />
                                                :
                                                (
                                                    assignmentData?.getAssignmentByTaskId?.id
                                                        
                                                        ?
                                                        "Reassign" 
                                                        :
                                                        "Assign"
                                                )

                                        }
                                        
                                    </Link>
                                </div>
                                
                                {
                                    assignmentDataLoading
                                        
                                    ? 
                                        <NumberPreloader />
                                    : 
                                    ( 
                                        assignmentData?.getAssignmentByTaskId?.id ? (
                                        <>
                                            <div className="grid grid-cols-[50px_calc(100%-50px)] gap-1">
                                                <div>
                                                    {assignmentData.getAssignmentByTaskId.assigned.image ? (
                                                        <RoundedImage userimage={assignmentData.getAssignmentByTaskId.assigned.image} classes="rounded-full w-[40px] h-[40px]" width={30} height={30} />
                                                            ) : (
                                                        <RoundedNoImage
                                                                text={`${assignmentData.getAssignmentByTaskId.assigned.firstName.trim()} ${assignmentData.getAssignmentByTaskId.assigned.lastName.trim()}`
                                                                .split(' ')
                                                                .map((word: string) => word[0].toUpperCase())
                                                                .join('')}
                                                            classes={`rounded-full w-[40px] h-[40px] bg-green-600 text-white text-center flex items-center justify-center`}
                                                        />
                                                    )}
                                                </div>
                                                <div className="text-[#231935bd]">
                                                    <span className="block test-black">
                                                        {assignmentData.getAssignmentByTaskId.assigned.firstName ? `${assignmentData.getAssignmentByTaskId.assigned.firstName} ${assignmentData.getAssignmentByTaskId.assigned.lastName}` : "Not Set"}

                                                    </span>
                                                    <span className="text-[#8C93A3] block mt-[-2px]">{assignmentData.getAssignmentByTaskId.assigned.email}</span>
                                                </div>
                                            </div>
                                                    <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><FaCalendarCheck style={{ width: '25px', height: '25px' }} className="text-green-600" /><span className="mt-1">Status:  {assignmentData.getAssignmentByTaskId.isAccepted ? 'accepted' : 'pending'}</span></p>

                                                    <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><FaCalendarCheck style={{ width: '25px', height: '25px' }} className="text-green-600" /><span className="mt-1">Pick up date:  {formatDateTime(requestData.getRequest[0].sampleCollectionDate)}</span></p>

                                                    <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><MdPhoneIphone style={{ width: '25px', height: '25px' }} className="text-green-600" /><span className="mt-1">Contact line: {assignmentData.getAssignmentByTaskId.assigned.phoneNumber}</span></p>
                                                    <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><FaCalendarCheck style={{ width: '25px', height: '25px' }} className="text-green-600" /><span className="mt-1">Drop Off date: {formatDateTime(requestData.getRequest[0].samepleDropOffDate)}</span></p>
                                        </>
                                        ) : (  <div></div> )
                                    )
                                }
                            </div>


                            {/* facility */}
                            <div className="bg-white shadow-md px-4 py-4 rounded-md">
                                <h2 className="text-lg font-bold mb-3">Other Information </h2>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><TbSum style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Total: {formatMoney(requestData.getRequest[0].total)}</span></p>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><FaMoneyCheckDollar style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Paid: {formatMoney(requestData.getRequest[0].total - requestData.getRequest[0].balance)}</span></p>
                                
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><GrMoney style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Balance: {formatMoney(requestData.getRequest[0].balance)}</span></p>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><FaCalendarCheck style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Collection Date: {formatDateTime('2024-11-27T12:02:18.743198+00:00')}</span></p>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><TbStatusChange style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Sample Status: {requestData.getRequest[0].sampleStatus}</span></p>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><TbStatusChange style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Status: {requestData.getRequest[0].requestStatus } {requestData.getRequest[0].resultDate}</span></p>

                            </div>
                        </div>

                        {/* {
                            testDataLoading
                                 
                                ?
                                <TablePreloader /> : */}
                               
                        <AdminFacilitiesTable
                            currentPage={1}
                            
                                setCurrentPage={() => { }}
                                marginTop={'mt-6'}
                                approveAction={() => { }} 
                                tableHeadText='53 Facilities'
                                tableData={updatedTestRequestData}
                                searchBoxPosition='hidden'
                                showTableHeadDetails={false}
                                showActions={true}
                                changePage={() => { }}
                                deleteAction={() => { }}
                                setItemToDelete={() => { }}
                                showPagination={false}
                                testPage='singleFacility'
                                >


                                    <div className="mx-4 mt-6 flex justify-between">
                                        <h2 className="text-[#0F1D40] font-bold text-xl"> Tests Requested</h2>

                                        {/* <Link href='tests/new' className="bg-[#08AC85] text-white py-2 px-3 flex justify-around text-[14px] rounded">
                                            <PlusIcon />
                                            <span >Add Test</span>
                                        </Link> */}
                                    </div>
                                </AdminFacilitiesTable>
                        {/* } */}
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Facilities
