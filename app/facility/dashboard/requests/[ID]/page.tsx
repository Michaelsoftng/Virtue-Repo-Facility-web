/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, {  useCallback, useEffect,  useState } from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { formatDateTime } from '@/src/partials/tables/AdminFacilitiesTable'
import { GrLocationPin } from "react-icons/gr";
import Link from 'next/link'
import Loading from '@/app/admin/dashboard/loading'
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
import { getResultByTestRequestId } from '@/src/hooks/useGetResultTemplateById'
import { Result, SectionWithRows } from '@/src/interface'


const TestRequest = ({ params }: { params: { ID: string } }) => {
    const { ID } = params;
    const { data, error, loading: testDataLoading } = useGetTestRequestById(ID)
    // const { data: testresultData,  loading: testresultDataLoading } = useGetResultByTestRequestId(ID)
    const [resultLoading, setResultLoading] = useState(false)
    const [result, setResult] = useState<Result| null>(null);
    const [resultFields, setResultFields] = useState<SectionWithRows[]>([]);
    function formatISODate(isoDateString: string) {
        const date = new Date(isoDateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }
    const fetchResult = useCallback(async () => {
        try {
            setResultLoading(true)
            const { data: resultdata, error, loading: testresultDataLoading } = await getResultByTestRequestId(ID)
            const testresultData = resultdata?.getResultByTestRequest;
            setResult(testresultData);
            const parsedResultFields = JSON.parse(JSON.parse(testresultData.resultFields));
            console.log(parsedResultFields)
            setResultFields(parsedResultFields)
        } catch (error) {
            console.log(error)
        } finally {
            setResultLoading(false)  
        }
    }, [ID]);




    
    useEffect(() => {
        fetchResult()
    }, [fetchResult]);

    if (testDataLoading || resultLoading) {
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
                                {result?.id &&
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
                                                        <li className="mt-1 grid grid-cols-2"><span>Date Entered</span><span>{formatISODate(result?.createdAt)}</span></li>
                                                        <li className="mt-1 grid grid-cols-2"><span>Date Printed</span><span>{formatISODate(result?.createdAt)}</span></li>
                                                        <li className="mt-1 grid grid-cols-2"><span>Collection Date</span><span>{formatISODate(result?.createdAt)}</span></li>
                                                    </ul>

                                                    <div className="mt-7 text-[10px]"><p>Thank you for your request. We are reporting the following results:</p></div>
                                                </div>
                                                <div className="ml-4">
                                                    
                                                    <ul>
                                                        <li className="mt-2 grid grid-cols-[35%_65%]"><b>Patient Information</b><span></span></li>
                                                        <li className="mt-1 grid grid-cols-[35%_65%]"><b>Patient</b><span>{result?.testRequest?.patientName}</span></li>
                                                        <li className="mt-1 grid grid-cols-[35%_65%]"><b>Email</b><span>{result?.patient.email}</span></li>
                                                        <li className="mt-1 grid grid-cols-[35%_65%]"><b>Age</b><span>{result?.testRequest?.patientAge} years</span></li>
                                                        <li className="mt-1 grid grid-cols-[35%_65%]"><b>Gender</b><span>{result?.patient.patient.gender}</span></li>
                                                        <li className="mt-1 grid grid-cols-[35%_65%]"><b>Phone No</b><span>{result?.patient.phoneNumber}</span></li>
                                                        <li className="mt-1 grid grid-cols-[35%_65%]"><b>Address</b><span>{result?.testRequest?.request.samplePickUpAddress}</span></li>
                                                        <li className="mt-1 grid grid-cols-[35%_65%]"><b>Specimen Type</b><span>SST</span></li>
                                                        <li className="mt-1 grid grid-cols-[35%_65%]"><b>Clinical Data</b><span>NA</span></li>
                                                    </ul>
                                                </div>

                                            </div>
                                            
                                            <div>
                                                <div>
                                                    {
                                                        resultFields.map((section, sectionIndex) => (
                                                            <section key={sectionIndex} className={`${section.section_style} ${(sectionIndex == 0) ? "" : "border-t-2 pt-1"
                                                                }`} >
                                                                {
                                                                    section.section_fields.map((row, rowIndex) => (
                                                                        <li key={rowIndex} className={`text-[12px] grid grid-cols-3 ${rowIndex === 0 ? "font-[700]" : "font-[500] mt-2"}`} >
                                                                            {
                                                                                row.section_fields.map((column, columnIndex) => (
                                                                                    column.section_fields.length > 1
                                                                                        ?
                                                                                        <div key={columnIndex}>
                                                                                            {
                                                                                                column.section_fields.map((field, idx) => (
                                                                                                    <p key={idx} className={` ${idx === 0 ? "mt-0" : ""} ${(idx === column.section_fields.length - 1 && columnIndex == 0) ? "border-b-4 border-dotted border-black pb-1 mb-3" : ""
                                                                                                        }`}>{field.startsWith("input:") ? field.replace("input:", "") : field }</p>
                                                                                                    )
                                                                                                )
                                                                                            }
                                                                                        </div>
                                                                                        :
                                                                                        <p key={columnIndex} className={`${columnIndex === 0 ? "flex justify-start" : "flex justify-center"}`} >{column.section_fields[0].startsWith("input:") ? column.section_fields[0].replace("input:", "") : column.section_fields[0]}</p>
                                                                                        )
                                                                                )
                                                                            }

                                                                        </li>
                                                                    ))
                                                                }

                                                            </section>
                                                        ))
                                                    }
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
                                }
                            </div>
                           
                            <div className="">
                                <div className=""><Link href={`${ID}/templates`} className="rounded px-4 py-2 text-white bg-green-600">Send result</Link></div>
                                {result?.id && <div className="mt-2"><Link href={`../results/${result?.id}`} className="rounded px-4 py-2 mt-2 text-white bg-green-600">Edit result</Link></div>}
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
