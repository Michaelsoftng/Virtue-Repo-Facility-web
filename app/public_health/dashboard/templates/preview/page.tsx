/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useEffect, useState } from 'react'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import LogoIcon from '@/src/reuseable/icons/LogoIcon'
// import { PlusIcon } from '@radix-ui/react-icons'
// import { RiDeleteBinFill } from "react-icons/ri";
// import { SectionWithRows } from '@/src/interface'
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
const NewTemplate = () => {
    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageTitle="Tests" showExportRecord={false} />
                    <div className="px-8 py-4">
                        <div className="w-full grid grid-cols-[70%_30%] pt-6">
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
                                                <section className="py-4 border-t-2 border-black pt-1 mt-1">
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
                            <button onClick={()=>{}}>Download PDF</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}


export default NewTemplate
