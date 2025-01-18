/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useCallback, useRef, useState } from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable, { colorCombination } from '@/src/partials/tables/AdminFacilitiesTable'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import TotalPatients from '@/src/reuseable/components/TotalPatients'
import { useGetUsersByType } from '@/src/hooks/useGetUsersByType'
import { getAllAssignments } from '@/src/hooks/useGetAllAssignments'
import { PatientType } from '@/src/interface'
import NumberPreloader from '@/src/preLoaders/NumberPreloader'
import TablePreloader from '@/src/preLoaders/TablePreloader'
import { useMutation } from '@apollo/client'
import { ApproveAccount, DeleteUser } from '@/src/graphql/mutations'
import client from '@/lib/apolloClient';
import { toast } from 'react-toastify';
import { useAuth } from '@/src/context/AuthContext'
import { decodeJwtEncodedId } from '@/src/utils/decode'
import BarChartAnalytics from '@/src/partials/BarChartAnalytics'
import BarChartYaxis from '@/src/partials/BarChartYaxis'
import RoundedImage from '@/src/partials/RoundedImage'
import RoundedNoImage from '@/src/partials/RoundedNoImage'
import Link from 'next/link'



const PhlebotomistAudit = () => {
    const phlebotomist = [null, 'Annalise Haddish', 'jameshadish@gmail.com']
    const toolrequests = [1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageWrapper="Dashboard &nbsp;&nbsp;/&nbsp;&nbsp;Phlebotomies &nbsp;&nbsp;/&nbsp;&nbsp;user" pageTitle="audit" showExportRecord={true} />

                    <div className="px-8 py-4">
                        
                        <div className="">
                           <div className="grid grid-cols-2">
                                <div className="grid grid-cols-[80px_calc(100%-80px)] gap-2">
                                    <div>
                                        {phlebotomist[0] ? (
                                            <RoundedImage userimage={''} classes="rounded-full w-[80px] h-[80px]" width={30} height={30} />
                                        ) : (
                                            <RoundedNoImage
                                                text={'Analise Haddish'
                                                .split(' ')
                                                .map((word: string) => word[0].toUpperCase())
                                                .join('')}
                                                classes={`text-[40px] rounded-full w-[80px] h-[80px] ${colorCombination[Math.floor(Math.random() * 4)]} text-center flex items-center justify-center`}
                                            />
                                        )}
                                    </div>
                                    <div className="mt-2">
                                        <span className="block text-[#231935] text-[20px] font-[600] p-0">{phlebotomist[1]}</span>
                                        
                                        <span className="inline-block text-[#727A8B] underline text-[14px] mt-[-4px]">{phlebotomist[2]}</span>
                                    </div>
                                </div> 
                                <div className="flex justify-end">

                                
                                    <div className="flex gap-2">
                                        <div>
                                            <label htmlFor="" className="text-[14px] text-[#8C93A3] block mb-1">Start date</label>
                                            <input
                                                style={{ appearance: 'textfield' }}
                                                type="date"
                                                className="appearance-none border-2 border-[#8c93a382] rounded font-[600] text-[#49536E] text-[12px] py-2 px-2"
                                                defaultValue="2025-02-12"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="" className="text-[14px] text-[#8C93A3] block mb-1">End date</label>
                                            <input
                                                style={{ appearance: 'textfield' }}
                                                type="date"
                                                className="appearance-none border-2 border-[#8c93a382] rounded font-[600] text-[#49536E] text-[12px] py-2 px-2"
                                                defaultValue="2025-02-12"
                                            />
                                        </div>
                                        <div className="mt-8">
                                            <button className="font-[600] text-white px-3 py-1 bg-[#08AC85] rounded text-[14px]">Apply</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-10 ">

                                <div className="grid grid-cols-3 gap-12">
                                    {
                                        toolrequests.map((singleRequest, index) =>(
                                        <Link href='#' key={index}>
                                            <ul className="text-[12px] text-[#525C76] w-full bg-white shadow-md rounded px-4 py-4">
                                                <div className="border-b-2 border-[#B2B7C2] border-dashed pb-2">
                                                    <li className="grid grid-cols-[80%_20%]"><span className='text-[13px] text-[#0F1D40] font-[600]'>COVID 19 Qualitative Prc throat swab</span><span className='text-right text-[10px] mt-1'>16/02. 09:45</span></li>
                                                    <li className="grid grid-cols-[70%_30%] mt-2"><span>Client</span><span className='text-[#0F1D40] font-[600] text-right'>Sarah Joe</span></li>
                                                    <li className="grid grid-cols-[70%_30%] mt-1"><span>No. of persons</span><span className='text-[#0F1D40] font-[600] text-right'>2</span></li>
                                                </div>
                                                <div className="pt-3">
                                                    <li className='text-[#0F1D40] font-[600] grid grid-cols-[80%_20%]'><span>Equipment</span><span className='text-right'>Amount</span></li>
                                                    <li className="grid grid-cols-[70%_30%]  mt-2"><span>Sample bottle</span><span className='text-right'>2</span></li>
                                                    <li className="grid grid-cols-[70%_30%] mt-1"><span>needles</span><span className='text-right'>2</span></li>
                                                    <li className="grid grid-cols-[70%_30%] mt-1"><span>Hand gloves</span><span className='text-right'>2</span></li>
                                                    <li className="grid grid-cols-[70%_30%] mt-1"><span className="text-[12px] text-[#525C76]">Bolt strips</span><span className='text-right'>2</span></li>
                                                </div>

                                            </ul>
                                        </Link>
                                    ))}
                                    
                                    
                                    
                                </div>
                                <div className="flex justify-between mt-4 w-full">
                                    <button
                                        onClick={() => { }}
                                        // disabled={currentPage === 1}
                                        disabled={1 === 1}
                                        className="px-3 py-1 border border-[#b5b5b6] text-[#b5b5b6]"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => { }}
                                        // disabled={currentPage === totalPages}
                                        disabled={1 === 1}
                                        className="px-3 py-1 border rounded-lg border-[#6b6a6a] text-[#6b6a6a]"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default PhlebotomistAudit
