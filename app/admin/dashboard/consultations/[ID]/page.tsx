/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useRef, useState } from 'react'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import  { formatDateTime } from '@/src/partials/tables/AdminFacilitiesTable'
import { GrMoney } from "react-icons/gr";
import Link from 'next/link'
import client from '@/lib/apolloClient';
import { GetConsultationById } from '@/src/graphql/queries';
import { useQuery } from '@apollo/client'
import Loading from '../../loading'
import NumberPreloader from '@/src/preLoaders/NumberPreloader'
import '@/public/assets/css/custom.css';
import RoundedImage from '@/src/partials/RoundedImage'
import RoundedNoImage from '@/src/partials/RoundedNoImage'
import { FaCalendarCheck, FaUserDoctor } from "react-icons/fa6";
import { MdPhoneIphone } from "react-icons/md";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { TbSum, TbStatusChange } from "react-icons/tb";
import { formatMoney } from '@/src/partials/tables/NewRequesTable'
import { useGetAssignmentByTaskId } from '@/src/hooks/useGetAssignmentByTaskId'
import { IoMdTimer } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import PDFImage from '@/public/assets/images/utilities/pdf.png'
import Image from 'next/image'

const Consultations = ({ params }: { params: { ID: string } }) => {
    const { ID } = params;
    const { data: assignmentData, error, loading: assignmentDataLoading } = useGetAssignmentByTaskId(ID)
    const { data: consultationData, loading: pageLoading } = useQuery(GetConsultationById, {
        variables: {
            id: ID
        },
        client,
    });
  
    const consultations = consultationData?.getConsultationById
    if (pageLoading) {
        return <Loading />;
    }
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
                                        {consultations?.patient.image ? (
                                            <RoundedImage userimage={consultations?.patient.image} classes="rounded-full w-[40px] h-[40px]" width={30} height={30} />
                                        ) : (
                                            <RoundedNoImage
                                                    text={`${consultations?.patient.user.firstName.trim()} ${consultations?.patient.user.lastName.trim()}`
                                                    .split(' ')
                                                    .map((word: string) => word[0].toUpperCase())
                                                    .join('')}
                                                    classes={`rounded-full w-[40px] h-[40px] bg-red-500 text-white text-center flex items-center justify-center`}
                                            />
                                        )}
                                    </div>
                                    <div className="text-[#231935bd]">
                                        <span className="block test-black">
                                            {consultations?.patient.user.firstName ? `${consultations?.patient.user.firstName} ${consultations?.patient.user.lastName}` : "Not Set"}

                                        </span>
                                        <span className="text-[#8C93A3] block mt-[-2px]">{consultations?.patient.user.email}</span>
                                    </div>
                                </div>

                                <p className="flex gap-2 text-[#8C93A3] text-[14px] mt-2 ml-2"><FaUserDoctor className="text-red-500" style={{ width: '25px', height: '25px' }} />
                                    <span className="text-black mt-2">
                                        {consultations?.requestedDoctorType}
                                    </span>
                                </p>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><MdPhoneIphone style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Contact line: {consultations?.patient.user.phoneNumber}</span></p>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><IoMdTimer style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Request Duration:  {consultations?.requestedDuration} mins</span></p>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><SlCalender style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">consultationTime:  {consultations?.consultationTime ? formatDateTime(consultations?.consultationTime) : ''}</span></p>

                            </div>
                            
                            {/* phlebotomist */}

                            <div className="bg-white shadow-md px-4 py-4 rounded-md">
                                <div className="flex justify-between ">
                                    <h2 className="text-lg font-bold mb-3"> Doctor </h2>
                                    
                                    {
                                    assignmentDataLoading ?
                                    <NumberPreloader />
                                    :
                                    (
                                    assignmentData?.getAssignmentByTaskId?.id
                                    ?
                                    <button className="bg-blue-600 text-white px-3 py-2 rounded-lg"> Unassign</button>
                                    : ""
                                    )

                                    }
                                        
                                    
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

                                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><FaCalendarCheck style={{ width: '25px', height: '25px' }} className="text-green-600" /><span className="mt-1">Pick up date:  {formatDateTime(consultations?.sampleCollectionDate)}</span></p>

                                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><MdPhoneIphone style={{ width: '25px', height: '25px' }} className="text-green-600" /><span className="mt-1">Contact line: {assignmentData.getAssignmentByTaskId.assigned.phoneNumber}</span></p>
                                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><FaCalendarCheck style={{ width: '25px', height: '25px' }} className="text-green-600" /><span className="mt-1">Drop Off date: {formatDateTime(consultations?.samepleDropOffDate)}</span></p>
                                    </>
                                    ) : (  <div></div> )
                                )
                                }
                            </div>

                            <div className="bg-white shadow-md px-4 py-4 rounded-md">
                                <h2 className="text-lg font-bold mb-3">Other Information </h2>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><TbSum style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Total: {formatMoney(consultations?.total)}</span></p>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><FaMoneyCheckDollar style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Paid: {consultations?.payment?.amountPaid ? formatMoney(consultations?.payment?.amountPaid) : 0}</span></p>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><GrMoney style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Labtraca Profit: {formatMoney(consultations?.labtracaProfit)}</span></p>

                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><GrMoney style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Doctor Earning: {formatMoney(consultations?.doctorEarning)}</span></p>
                                
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><FaCalendarCheck style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Request Date: {formatDateTime(consultations?.createdAt)}</span></p>
                                <p className="flex gap-2 text-black text-[14px] mt-2 ml-2"><TbStatusChange style={{ width: '25px', height: '25px' }} className="text-red-500" /><span className="mt-1">Status: {consultations?.status}  {formatDateTime(consultations?.updatedAt)}</span></p>

                            </div>
                        </div>

                        <div className="grid grid-cols-2 mt-6 gap-4">
                            <div className="w-full h-[400px] border-2 overflow-scroll px-4 py-4 bg-white"> 
                                <h4 className="text-center font-bold underline">Medical History</h4>
                                <p className="mt-2 ">{consultations.medicalhistory}</p>
                            </div>    
                            <div className="w-full h-[400px] border-2 overflow-scroll px-4 py-4 bg-white">
                                <h4 className="text-center font-bold underline">Current Symptoms</h4>
                                <p className="mt-2 ">{consultations.currentSyptoms}</p>
                            </div>   
                        </div>
                        <div className="grid grid-cols-2 mt-6 gap-4">
                            <div className="w-full h-[400px] border-2 overflow-scroll px-4 py-4 bg-white">
                                <h4 className="text-center font-bold underline">Other Details</h4>
                                <p className="mt-2 ">{consultations.otherdetails}</p>
                            </div>
                            <div className="w-full h-[400px] border-2 overflow-scroll px-4 py-4 bg-white">
                                <h4 className="text-center font-bold underline">Attachments/Files</h4>
                                <div>
                                    {
                                        JSON.parse(consultations?.attachments).map((attachment: string, index: number) => {
                                        const fileName = attachment.split("/").pop();
                                        return (<div key={index} className="flex justify-between mt-4">
                                            <Link href={attachment} target="_blank" rel="noopener noreferrer">
                                                <div className="flex gap-4">
                                                    <Image src={PDFImage} alt="PDF Icon" width={35} />
                                                    <p className="mt-1 text-[#08AC85] font-medium">{fileName}</p>
                                                </div>
                                            </Link>
                                        </div>
                                            )
                                        })
                                    }
                                </div>

                            </div>
                            
                        </div>
                        <div className="grid grid-cols-2 mt-6 gap-4">
                            <div className="w-full h-[400px] border-2 overflow-scroll px-4 py-4 bg-white">
                                <h4 className="text-center font-bold underline">Doctors Report</h4>
                                <p className="mt-2 ">{consultations.doctorsReport}</p>
                            </div>
                            <div className="w-full h-[400px] border-2 overflow-scroll px-4 py-4 bg-white">
                                <h4 className="text-center font-bold underline">Doctors Prescription</h4>
                                <p className="mt-2 ">{consultations.prescription}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Consultations
