/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useEffect, useState } from 'react'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import LogoIcon from '@/src/reuseable/icons/LogoIcon'
import Link from 'next/link'
import * as Form from '@radix-ui/react-form';
import { IoIosWarning } from 'react-icons/io'
import { AiOutlineClose } from "react-icons/ai";
import { useGetResultTemplateById } from '@/src/hooks/useGetResultTemplateById'
import { SectionWithRows } from '@/src/interface'
import Loading from '@/app/admin/dashboard/loading'

const NewTemplate = ({ params }: { params: { ID: string } }) => {
    const { ID: requestID, ID: templateID } = params;
    const { data, error, loading: templatesDataLoading } = useGetResultTemplateById(templateID)
    const [showRename, setShowRename] = useState(false)
    // const template = data?.getResultTemplateById;
    // const { __typename, id, name, templateFields, ...rest } = template
    // const updatedtemplate = JSON.parse(templateFields)
    // const parsedTempate: SectionWithRows[] = JSON.parse(updatedtemplate) 
    // if (templatesDataLoading || !template) {
    //     return <Loading />;
    // }
    
    if (templatesDataLoading) {
        return <Loading />;
    }

    const template = data?.getResultTemplateById;

    if (!template) {
        return <p>Error: No template found</p>;
    }

    const { __typename, id, name, templateFields, ...rest } = template;

    let parsedTemplate: SectionWithRows[] = [];
    try {
        if (templateFields) {
            const updatedtemplate = JSON.parse(templateFields)
            parsedTemplate = JSON.parse(updatedtemplate) 
        }
    } catch (error) {
        console.error("Error parsing templateFields JSON:", error);
    }
    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageWrapper="Dashboard &nbsp;&nbsp;/&nbsp;&nbsp;Templates" pageTitle={name} showExportRecord={false} />
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
                                                <p className="text-[12px] font-[600] text-black text-center mt-2 uppercase">
                                                    LABORATORY REPORT FORM - {name}
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
                                        <div>
                                            <ul>
                                                {
                                                    parsedTemplate.map((section, sectionIndex) => (
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
                                                                                                field === "___" ? (
                                                                                                    <input
                                                                                                        className={`w-full pl-2 ${columnIndex === 0 ? "mt-0" : "mt-1"}`}
                                                                                                        key={idx}
                                                                                                        type="text"
                                                                                                        placeholder="result here..."
                                                                                                    />
                                                                                                ) : (
                                                                                                    <p key={idx} className={` ${idx === 0 ? "mt-0" : ""} ${(idx === column.section_fields.length - 1 && columnIndex == 0) ? "border-b-4 border-dotted border-black pb-1 mb-3" : ""
                                                                                                        }`}>{field}</p>
                                                                                                )


                                                                                            ))
                                                                                        }
                                                                                    </div>
                                                                                    :
                                                                                    column.section_fields[0] === "___" ? (
                                                                                        <input
                                                                                            className={`w-full pl-2  ${columnIndex === 0 ? "mt-0" : "mt-1"}`}
                                                                                            key={columnIndex}
                                                                                            type="text"
                                                                                            placeholder="result here..."
                                                                                        />
                                                                                    ) : (
                                                                                        <p key={columnIndex} className={`${columnIndex === 0 ? "flex justify-start" : "flex justify-center"}`} >{column.section_fields[0]}</p>
                                                                                    )
                                                                            ))
                                                                        }

                                                                    </li>
                                                                ))
                                                            }

                                                        </section>
                                                    ))
                                                }
                                                

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
                            <div>
                                <div className="grid grid-cols-3 gap-x-2 h-[40px] text-white">
                                    {/* <div><button onClick={() => { }}>Download</button></div> */}
                                    <div className="bg-gray-500 flex justify-center text-center items-center rounded-sm"><button className="" onClick={() => setShowRename(true)}>Rename</button></div>
                                    <div className="bg-blue-500 flex justify-center text-center items-center rounded-sm"><Link href='#'>Edit template</Link></div>
                                    <div className="bg-red-500 flex justify-center text-center items-center rounded-sm"><button>Delete</button></div>


                                </div>
                                {
                                    showRename &&
                                    <div className="mt-6 bg-white shadow-lg py-3 px-4">
                                        <Form.Root className="w-full mx-auto " method='post' onSubmit={() => { }}>
                                            <div className="grid grid-cols-[80%_20%]">
                                                <h3 className="text-black font-bold text-[20px] lg:text-[24px] text-center">Rename Template</h3>
                                                    <div className="text-gray-500 flex justify-end text-center items-center "><button className="" onClick={() => setShowRename(false)}><AiOutlineClose/></button></div>

                                            </div>
                                            


                                            <Form.Field name="first_name" className="block my-4">
                                                <Form.Label className="block font-semibold text-[14px] ">Rename Template</Form.Label>
                                                <Form.Control
                                                    onChange={() => { }}
                                                    required
                                                    type="text"
                                                    placeholder='template name'
                                                    className="focus:outline focus:outline-offset-0 focus:outline-[#09CFA0] px-[15px] py-[10px] text-[14px] font-medium text-black border-solid block border-[1.5px] rounded-sm border-gray-300 w-[100%] mx-auto" />
                                                <Form.Message
                                                    className="text-sm text-red-500 grid grid-cols-[25px_calc(100%-25px)] mt-1 font-semibold"
                                                    match={(error) => error === "typeMismatch" || error === "valueMissing"}
                                                >
                                                    <IoIosWarning className="text-[19px]" /> <span>Enter a name for this template</span>
                                                </Form.Message>
                                            </Form.Field>

                                            <Form.Submit
                                                className="mt-2 w-full bg-[#08AC85] px-4 py-2 text-lg text-white rounded-sm disabled:bg-[#08ac865b]"
                                                disabled={true}
                                            >
                                                {true ? "Renaming..." : "Rename"}
                                            </Form.Submit>


                                            {/* disabled={disableSubmitBtn()} */}
                                        </Form.Root>
                                    </div>
                                }
                                
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}


export default NewTemplate
