/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useCallback, useEffect, useState } from 'react'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import LogoIcon from '@/src/reuseable/icons/LogoIcon'
import Link from 'next/link'
import * as Form from '@radix-ui/react-form';
import { IoIosWarning } from 'react-icons/io'
import { AiOutlineClose } from "react-icons/ai";
import { getResultTemplateById, useGetResultTemplateById } from '@/src/hooks/useGetResultTemplateById'
import { SectionWithRows } from '@/src/interface'
import Loading from '@/app/admin/dashboard/loading'
import { useAuth } from '@/src/context/AuthContext'
import { CreateResult } from '@/src/graphql/mutations'
import { useMutation } from '@apollo/client'
import client from '@/lib/apolloClient';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NewTemplate: React.FC<any> = ({ params }: { params: { ID: string, templateID: string } }) => {
    const [pageLoading, setPageLoading] = useState(false)
    const [resultBody, setResultBody] = useState<SectionWithRows[]>([]);
    const [templateName, setTemplateName] = useState<string>('');
    const { ID, templateID } = params;
    const router = useRouter();
    const { user } = useAuth();
    const testRequestData = localStorage.getItem("testRequestForResult");
    const testRequest = (JSON.parse(testRequestData as string) )
    


    const handleFieldChange = (
        sectionIndex: number,
        rowIndex: number,
        columnIndex: number,
        fieldIndex: number,
        value: string
    ) => {
        console.log(resultBody)
        setResultBody((prev) => {
            const newResult = [...prev]; // Shallow copy of the main array
            const section = { ...newResult[sectionIndex] }; // Copy only the modified section
            const row = { ...section.section_fields[rowIndex] }; // Copy only the modified row
            const column = { ...row.section_fields[columnIndex] }; // Copy only the modified column

            // Update the specific field
            const updatedFields = [...column.section_fields];
            updatedFields[fieldIndex] = value;

            // Assign updated data back
            column.section_fields = updatedFields;
            row.section_fields[columnIndex] = column;
            section.section_fields[rowIndex] = row;
            newResult[sectionIndex] = section;

            return newResult;
        });
    };

     function formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    const fetchTemplate = useCallback(async () => {
        try {
            setPageLoading(true)
            const { data, error, loading: templatesDataLoading } = await getResultTemplateById(templateID)
            const { __typename, id, name, templateFields, ...rest } = data?.getResultTemplateById;
            const parsedTemplate = JSON.parse(JSON.parse(templateFields));
            setResultBody(JSON.parse(JSON.parse(templateFields)));
            setTemplateName(name);  
        } catch (error) {
            console
        } finally {
            setPageLoading(false)  
        }
        

    }, [templateID]);
    
    const [createResult, { loading: createResultLoading }] = useMutation(CreateResult, {
        
        client,
    });

    const createandsendResult = async (e: React.FormEvent) => {
        setPageLoading(true)
        try {
            const { data } = await createResult({
                variables: {
                    patient: testRequest.request.patient.user.id,
                    testRequest: testRequest.id,
                    result_fields: JSON.stringify(resultBody),

                },
                async onCompleted(data) {
                    if (data.CreateResult.result) {
                        toast.success("created test result successfully");
                       router.push(`/facility/dashboard/requests/${ID}/results`);
                    } else {
                        toast.success(data?.CreateResult?.errors?.message);
                    }

                },
                onError(e) {
                    toast.error(e.message);

                },
            }); // Execute the mutation

        } catch (err) {
            console.error('Error creating user:', err);
        } finally {
            setPageLoading(false)
        }
    };
    useEffect(() => {
        fetchTemplate()
    }, [fetchTemplate]);

    if (pageLoading) {
        return <Loading />;
    }
    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageWrapper="Dashboard &nbsp;&nbsp;/&nbsp;&nbsp;Templates" pageTitle={templateName} showExportRecord={false} />
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
                                                    {user?.facilityAdmin?.facilityName}, Abuja
                                                </h1>
                                                <p className="text-[12px] font-[600] text-black text-center mt-2 uppercase">
                                                    LABORATORY REPORT FORM - {templateName}
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
                                            <p className="py-[6px] text-[12px]">{formatDate(new Date())}</p>
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
                                                <li className="mt-1 grid grid-cols-2"><span>Date Entered</span><span>{formatDate(new Date())}</span></li>
                                                <li className="mt-1 grid grid-cols-2"><span>Date Printed</span><span>{formatDate(new Date())}</span></li>
                                                <li className="mt-1 grid grid-cols-2"><span>Collection Date</span><span>{formatDate(new Date())}</span></li>
                                            </ul>

                                            <div className="mt-7 text-[10px]"><p>Thank you for your request. We are reporting the following results:</p></div>
                                        </div>
                                        <div className="ml-4">
                                            <ul>
                                                <li className="mt-2 grid grid-cols-[35%_65%]"><b>Patient Information</b><span></span></li>
                                                <li className="mt-1 grid grid-cols-[35%_65%]"><b>Patient</b><span>{testRequest?.patientName}</span></li>
                                                <li className="mt-1 grid grid-cols-[35%_65%]"><b>Email</b><span>{testRequest?.request.patient.user.email}</span></li>
                                                <li className="mt-1 grid grid-cols-[35%_65%]"><b>Age</b><span>{testRequest?.patientAge} years</span></li>
                                                <li className="mt-1 grid grid-cols-[35%_65%]"><b>Gender</b><span>{testRequest?.request.patient.gender}</span></li>
                                                <li className="mt-1 grid grid-cols-[35%_65%]"><b>Phone No</b><span>{testRequest?.request.patient.user.phoneNumber}</span></li>
                                                <li className="mt-1 grid grid-cols-[35%_65%]"><b>Address</b><span>{testRequest?.request.samplePickUpAddress}</span></li>
                                                <li className="mt-1 grid grid-cols-[35%_65%]"><b>Specimen Type</b><span>SST</span></li>
                                                <li className="mt-1 grid grid-cols-[35%_65%]"><b>Clinical Data</b><span>NA</span></li>
                                            </ul>
                                        </div>

                                    </div>
                                    
                                    <div>
                                        <div>
                                            <ul>
                                                {
                                                    resultBody.map((section, sectionIndex) => (
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
                                                                                                field === "___" || typeof field === "string" && field.startsWith("input:") ? (
                                                                                                    <input
                                                                                                        className={`w-full pl-2 ${columnIndex === 0 ? "mt-0" : "mt-1"}`}
                                                                                                        key={idx}
                                                                                                        type="text"
                                                                                                        placeholder="result here..."
                                                                                                        value={field === "___" ? "" : field.replace("input:", "")}
                                                                                                        onChange={(e) => handleFieldChange(sectionIndex, rowIndex, columnIndex, idx, `input:${e.target.value}`)}
                                                                                                    />
                                                                                                ) : (
                                                                                                    <p key={idx} className={` ${idx === 0 ? "mt-0" : ""} ${(idx === column.section_fields.length - 1 && columnIndex == 0) ? "border-b-4 border-dotted border-black pb-1 mb-3" : ""
                                                                                                        }`}>{field}</p>
                                                                                                )


                                                                                            ))
                                                                                        }
                                                                                    </div>
                                                                                    :

                                                                                    column.section_fields[0] === "___" || typeof column.section_fields[0] === "string" && column.section_fields[0].startsWith("input:") ? (
                                                                                        <input
                                                                                            className={`w-full pl-2  ${columnIndex === 0 ? "mt-0" : "mt-1"}`}
                                                                                            key={columnIndex}
                                                                                            type="text"
                                                                                            placeholder="result here..."
                                                                                            onChange={(e) => handleFieldChange(sectionIndex, rowIndex, columnIndex, 0, `input:${e.target.value}`)}
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
                            <div className="grid grid-cols-6 gap-3">
                                <button className="bg-gray-600 font-600 py-2 px-3 text-[14px] block mt-2 rounded-md text-white " onClick={createandsendResult}>Send Result</button>
                                
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}


export default NewTemplate
