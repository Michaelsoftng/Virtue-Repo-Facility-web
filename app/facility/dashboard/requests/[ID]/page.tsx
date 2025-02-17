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
import LogoIcon from '@/src/reuseable/icons/LogoIcon'
import FacilityHeader from '@/src/reuseable/components/FacilityHeader'
import FacilityMenu from '@/src/reuseable/components/FacilityMenu'

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


const TestRequest = ({ params }: { params: { ID: string } }) => {
    // const data.getTestRequestById = useRef<TableData[]>([]);
    const { ID } = params;
    const { data, error, loading: testDataLoading } = useGetTestRequestById(ID)
    // const data.getTestRequestById = data.getTestRequestById as TableData[]

    if (testDataLoading ) {
        return <Loading />;
    }

    if (data.getTestRequestById) {
        if (localStorage.getItem("testRequestForResult")) {
            localStorage.removeItem("testRequestForResult");
        }
        localStorage.setItem("testRequestForResult", JSON.stringify(data.getTestRequestById)); // Store in localStorage
        // console.log("request", data.getTestRequestById)
    }

    return (
        <div>
            <FacilityHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <FacilityMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageWrapper="Dashboard  / Requests"  pageTitle="Single Test" showExportRecord={true} />

                    
                    <div className="px-8 py-4">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="bg-white shadow-md px-4 py-4 rounded-md">
                                <h2 className="text-lg font-bold mb-3"> Patient </h2>

                                <div className="grid grid-cols-[50px_calc(100%-50px)] gap-1">
                                    <div>
                                        {data.getTestRequestById.request.patient.user.image ? (
                                            <RoundedImage userimage={data.getTestRequestById.request.patient.user.image} classes="rounded-full w-[40px] h-[40px]" width={30} height={30} />
                                        ) : (
                                            <RoundedNoImage
                                                    text={`${data.getTestRequestById.request.patient.user.firstName.trim()} ${data.getTestRequestById.request.patient.user.lastName.trim()}`
                                                    .split(' ')
                                                    .map((word: string) => word[0].toUpperCase())
                                                    .join('')}
                                                    classes={`rounded-full w-[40px] h-[40px] bg-red-500 text-white text-center flex items-center justify-center`}
                                            />
                                        )}
                                    </div>
                                    <div className="text-[#231935bd]">
                                        <span className="block test-black">
                                            {data.getTestRequestById.request.patient.user.firstName ? `${data.getTestRequestById.request.patient.user.firstName} ${data.getTestRequestById.request.patient.user.lastName}` : "Not Set"}

                                        </span>
                                        <span className="text-[#8C93A3] block mt-[-2px]">{data.getTestRequestById.request.patient.user.email}</span>
                                    </div>
                                </div>

                                <p className="flex gap-2 text-[#8C93A3] text-[14px] mt-2 ml-2"><GrLocationPin className="text-red-500" style={{ width: '30px', height: '30px' }} />
                                    <span className="text-black">
                                        {/* {facilityData.getUserById.streetAddress ? `${facilityData.getUserById.streetAddress} ${facilityData.getUserById.city}, ${facilityData.getUserById.state}` : 'Not set'} */}
                                        {data.getTestRequestById.request.samplePickUpAddress}
                                    </span>
                                </p>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><MdPhoneIphone style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Contact line: {data.getTestRequestById.request.patient.user.phoneNumber}</span></p>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><FaCalendarCheck style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Request Date:  {formatDateTime(data.getTestRequestById.createdAt)}</span></p>
                            </div>
                            
                            {/* phlebotomist */}

                            <div className="bg-white shadow-md px-4 py-4 rounded-md">
                                <div className="flex justify-between ">
                                    <h2 className="text-lg font-bold mb-3"> Phlebotomist </h2>
                                   
                                </div>
                                
                                {
                                    data.getTestRequestById.request.phlebotomist ? (
                                        <>
                                            <div className="grid grid-cols-[50px_calc(100%-50px)] gap-1">
                                                <div>
                                                    {data.getTestRequestById.request.phlebotomist.user.image ? (
                                                        <RoundedImage userimage={data.getTestRequestById.request.phlebotomist.user.image} classes="rounded-full w-[40px] h-[40px]" width={30} height={30} />
                                                            ) : (
                                                        <RoundedNoImage
                                                                text={`${data.getTestRequestById.request.phlebotomist.user.firstName.trim()} ${data.getTestRequestById.request.phlebotomist.user.lastName.trim()}`
                                                                .split(' ')
                                                                .map((word: string) => word[0].toUpperCase())
                                                                .join('')}
                                                            classes={`rounded-full w-[40px] h-[40px] bg-green-600 text-white text-center flex items-center justify-center`}
                                                        />
                                                    )}
                                                </div>
                                                <div className="text-[#231935bd]">
                                                    <span className="block test-black">
                                                        {data.getTestRequestById.request.phlebotomist.user.firstName ? `${data.getTestRequestById.request.phlebotomist.user.firstName} ${data.getTestRequestById.request.phlebotomist.user.lastName}` : "Not Set"}

                                                    </span>
                                                    <span className="text-[#8C93A3] block mt-[-2px]">{data.getTestRequestById.request.phlebotomist.user.email}</span>
                                                </div>
                                            </div>
                                            <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><FaCalendarCheck style={{ width: '25px', height: '25px' }} className="text-green-600" /><span className="mt-1">Status:  {data.getTestRequestById.request.sampleStatus}</span></p>

                                            <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><FaCalendarCheck style={{ width: '25px', height: '25px' }} className="text-green-600" /><span className="mt-1">Pick up date:  {formatDateTime(data.getTestRequestById.request.sampleCollectionDate)}</span></p>

                                            <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><MdPhoneIphone style={{ width: '25px', height: '25px' }} className="text-green-600" /><span className="mt-1">Contact line: {data.getTestRequestById.request.phlebotomist.user.phoneNumber}</span></p>
                                            <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><FaCalendarCheck style={{ width: '25px', height: '25px' }} className="text-green-600" /><span className="mt-1">Drop Off date: {formatDateTime(data.getTestRequestById.request.samepleDropOffDate)}</span></p>
                                        </>
                                        )
                                        : 
                                        (<div></div>)
                                    
                                }
                            </div>


                            {/* facility */}
                            <div className="bg-white shadow-md px-4 py-4 rounded-md">
                                <h2 className="text-lg font-bold mb-3">Other Information </h2>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><TbSum style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Package: {data.getTestRequestById.package ? data.getTestRequestById.package.packageName : "single test"}</span></p>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><FaMoneyCheckDollar style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Amount: {formatMoney(data.getTestRequestById.facilityEarning)}</span></p>
                                
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><FaCalendarCheck style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Result Date: {formatDateTime(data.getTestRequestById.resultDate)}</span></p>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><TbStatusChange style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Sample Status: {data.getTestRequestById.request.sampleStatus}</span></p>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><TbStatusChange style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Result Status: {data.getTestRequestById.status }</span></p>

                            </div>
                        </div>
                        <div className="grid grid-cols-[70%_30%] mt-6">
                            <div>
                                <div className="text-center font-bold text-xl mb-2">Test Result</div>
                                <div className="bg-[#EEFEF4] w-[776px] py-[21px] px-[35px]" id="pdf-content">
                                    <header className="" id="header">
                                        <div className="grid grid-cols-[62px_calc(100%-62px)]">
                                            <div className="flex items-center justify-center rounded-full">
                                                <LogoIcon />
                                            </div>
                                            <div className="flex justify-center">
                                                <div className="ml-[-60px]">
                                                    <h1 className="text-xl font-[600] text-black uppercase">
                                                        Wuse District Hospital, Abuja
                                                    </h1>
                                                    <p className="text-[12px] font-[600] text-black text-center mt-2">
                                                        LABORATORY REPORT FORM - CHEMICAL PATHOLOGY
                                                    </p>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="border-2 border-[#121E3F] grid grid-cols-2 mt-[27px]">
                                            <div>
                                                <p className="py-[5px] bg-[#121E3F] pl-4 text-white font-[600] text-[13.32px]">Requisition Number</p>
                                                <p className="py-[6px]">&nbsp;</p>
                                            </div>
                                            <div>
                                                <p className="py-[5px] bg-[#121E3F] pl-8 text-white font-[600] text-[13.32px]">Report Date</p>
                                                <p className="py-[6px]"></p>
                                            </div>
                                        </div>

                                    </header>

                                    {/* Main container */}
                                    <main className="mt-4 pb-4" id="content">
                                        <div className="grid grid-cols-2 text-[12px] mt-4">
                                            <div className="ml-4">
                                                <ul>
                                                    <li className="mt-2 flex gap-4"><b>Doctor</b><span>SELF REFERRAL</span></li>
                                                </ul>
                                                <ul className="mt-11">
                                                    <li className="mt-1 grid grid-cols-2"><span>Date Entered</span><span>10/02/2024 09:18:57</span></li>
                                                    <li className="mt-1 grid grid-cols-2"><span>Date Printed</span><span>10/02/2024 09:18:57</span></li>
                                                    <li className="mt-1 grid grid-cols-2"><span>Collection Date</span><span>10/02/2024 09:18:57</span></li>
                                                </ul>

                                                <div className="mt-7 text-[10px]"><p>Thank you for your request. We are reporting the following results:</p></div>
                                            </div>
                                            <div className="ml-4">
                                                <ul>
                                                    <li className="mt-2 grid grid-cols-[35%_65%]"><b>Patient Information</b><span></span></li>
                                                    <li className="mt-1 grid grid-cols-[35%_65%]"><b>Patient</b><span>JOHN DOE</span></li>
                                                    <li className="mt-1 grid grid-cols-[35%_65%]"><b>Email</b><span>info@labtraca.com</span></li>
                                                    <li className="mt-1 grid grid-cols-[35%_65%]"><b>Age</b><span>27 years</span></li>
                                                    <li className="mt-1 grid grid-cols-[35%_65%]"><b>Gender</b><span>Male</span></li>
                                                    <li className="mt-1 grid grid-cols-[35%_65%]"><b>Phone No</b><span>+23490000000000</span></li>
                                                    <li className="mt-1 grid grid-cols-[35%_65%]"><b>Address</b><span>No. 5 Gana street maitama, abuja</span></li>
                                                    <li className="mt-1 grid grid-cols-[35%_65%]"><b>Specimen Type</b><span>SST</span></li>
                                                    <li className="mt-1 grid grid-cols-[35%_65%]"><b>Clinical Data</b><span>NA</span></li>
                                                </ul>
                                            </div>

                                        </div>
                                        <div>
                                            <div className="text-[12px] border-b-2 border-black pb-1">
                                                <b>Chemistry - </b>
                                                <b>Lipogram - </b>
                                                <span> Validated</span>
                                            </div>
                                            <div className="text-[12px] border-b-2 border-black pb-1 mt-1">
                                                <b>Total Cholesterol</b>
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <ul>
                                                    <section className="text-[12px] border-b-2 border-black pb-1 mt-1" >
                                                        <li className="font-[700] text-[12px] grid grid-cols-3">
                                                            <p className="flex justify-center">TEST NAME</p>
                                                            <p className="flex justify-center">RESULT</p>
                                                            <p className="flex justify-center">REFERENCE RANGE / (UNITS)</p>
                                                        </li>
                                                    </section>
                                                    <section className="py-4">
                                                        <li className="text-[12px] grid grid-cols-3">
                                                            <div >
                                                                <p>Total Cholesterol</p>
                                                                <p className="border-b-4 border-dotted border-black pb-2">Comment</p>
                                                            </div>
                                                            <p className="flex justify-center">5.73</p>
                                                            <p className="flex justify-center">mmcl/L</p>
                                                        </li>

                                                        <li className="text-[12px] grid grid-cols-3 mt-4">
                                                            <div >
                                                                <p>Desirable:&gt;5.2 mmol/l</p>
                                                                <p>Borderline :5.2 - 6.2 mmol/l</p>
                                                                <p className="border-b-4 border-dotted border-black pb-2">High :&gt; 6.2 mmol/l</p>
                                                            </div>
                                                            <p className="flex justify-center">5.73</p>
                                                            <p className="flex justify-center">mmcl/L</p>
                                                        </li>
                                                        <li className="text-[12px] grid grid-cols-3">
                                                            <div >
                                                                <p>Total Cholesterol</p>
                                                                <p className="border-b-4 border-dotted border-black pb-2">Comment</p>
                                                            </div>
                                                            <p className="flex justify-center">221</p>
                                                            <p className="flex justify-center">mg/dL</p>
                                                        </li>
                                                    </section>
                                                    
                                                    <section className="py-4  border-t-2 border-black pt-1 mt-1">
                                                        <li className="text-[12px] grid grid-cols-3">
                                                            <div >
                                                                <b>Cholesterol HDL</b>
                                                            </div>
                                                            <p className="flex justify-center">&nbsp;</p>
                                                            <p className="flex justify-center">&nbsp;</p>
                                                        </li>
                                                        <li className="text-[12px] grid grid-cols-3 mt-4">
                                                            <div >
                                                                <p>Total Cholesterol</p>
                                                                <p className="border-b-4 border-dotted border-black pb-2">Comment</p>
                                                            </div>
                                                            <p className="flex justify-center">5.73</p>
                                                            <p className="flex justify-center">mmcl/L</p>
                                                        </li>

                                                        <li className="text-[12px] grid grid-cols-3 mt-4">
                                                            <div >
                                                                <p>Desirable:&gt;5.2 mmol/l</p>
                                                                <p>Borderline :5.2 - 6.2 mmol/l</p>
                                                                <p className="border-b-4 border-dotted border-black pb-2">High :&gt; 6.2 mmol/l</p>
                                                            </div>
                                                            <p className="flex justify-center">5.73</p>
                                                            <p className="flex justify-center">mmcl/L</p>
                                                        </li>
                                                        <li className="text-[12px] grid grid-cols-3">
                                                            <div >
                                                                <p>Total Cholesterol</p>
                                                                <p className="border-b-4 border-dotted border-black pb-2">Comment</p>
                                                            </div>
                                                            <p className="flex justify-center">221</p>
                                                            <p className="flex justify-center">mg/dL</p>
                                                        </li>
                                                    </section>

                                                </ul>
                                            </div>

                                        </div>
                                    </main>
                                    <footer id="footer" >
                                        <div className="grid grid-cols-[65%_35%] gap-3">
                                            <div className="bg-[#121E3F] px-3 py-2 text-white text-[10px]"><p>Thank you for choosing Labtraca. If you have any questions or comments, please email help@labtraca.com or call 0900 000 0000</p></div>
                                            <div className="bg-[#121E3F] px-3 py-2 text-white text-center text-[14px] flex justify-center items-center" ><p>+234 9000 000 0000</p></div>
                                        </div>
                                        <div className="text-[11px] mt-2"><i>RC Number:&nbsp;489766</i></div>
                                    </footer>
                                </div>
                            </div>
                           
                            <div className="">
                                <div className=""><Link href={`${ID}/templates`} className="rounded px-4 py-2 text-white bg-green-600">Send result</Link></div>

                                <div className="mt-2"><button className="rounded px-4 py-2 text-white bg-gray-800">Contact Patient</button></div>
                                <div className="mt-2"><button className="rounded px-4 py-2 text-white bg-red-500">Cancel Request</button></div>
                                <div className="mt-2"><button className="rounded px-4 py-2 text-white bg-blue-500">Sample Recieved</button></div>

                            </div>
                        </div>
                   </div>
                </div>
            </div>
        </div>
    )
}

export default TestRequest
