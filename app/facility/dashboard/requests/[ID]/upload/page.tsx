/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { ChangeEvent, useState } from 'react'
import FacilityHeader from '@/src/reuseable/components/FacilityHeader'
import FacilityMenu from '@/src/reuseable/components/FacilityMenu'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import * as Form from '@radix-ui/react-form'
import FileTable from '@/src/partials/tables/FilesTable'
import { FiUpload } from "react-icons/fi";
const sampleCompletedData: TableData[] = [
    {
        file: ['female.png', 'document.pdf'],
        size: '127mb',
        date: "2024-10-12 18:11:57.866863+00",
    },
    {
        file: ['male.jpg', 'document.pdf'],
        size: '127mb',
        date: "2024-10-12 18:11:57.866863+00",
    },
    {
        file: ['female.jpg', 'document.pdf'],
        size: '127mb',
        date: "2024-10-12 18:11:57.866863+00",
    }
    
];

const Requests = () => {
    // const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
    const [newPatientFormData, setNewPatientFormData] = useState<{ referralSource?: string}>()


    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewPatientFormData({ ...newPatientFormData, [name]: value });

    }

    return (
        <div>
            <FacilityHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <FacilityMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageTitle="requests" showExportRecord={false} />
                    
                    <div className="px-8 py-4">
                        <div className="flex justify-between">
                            <div>
                                <h2 className="text-lg font-bold">Upload result </h2>
                            </div>
                            {/* <div className={`flex justify-end `}>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-inset focus:ring-[#1b6d9c]"
                                />

                            </div> */}

                        </div>
                        <div className={` mt-4`}>
                            <Form.Root >
                                {/* todo add bread crump for smaller screen */}
                                <div className="w-full ">
                                    <div className=" bg-white grid grid-cols-[50%_50%]  gap-x-3 rounded-lg px-4 py-3">
                        
                                        <div className="">
                                            
                                            <Form.Field name='referralSource' className="mt-2">
                                                <Form.Label><span className="text-sm font-bold text-[#525C76] capitalize">Name</span></Form.Label>
                                                <Form.Control
                                                    required={true}
                                                    value={'none'}
                                                    type='text'
                                                    className="mt-2 font-semibold text-sm block text-black border-solid border-2 border-gray-300 rounded w-full px-3 py-3" />
                                            </Form.Field>
                                            
                                            <Form.Field name='referralSource' className="mt-2">
                                                <Form.Label><span className="text-sm font-bold text-[#525C76] capitalize">Email</span></Form.Label>
                                                <Form.Control
                                                    required={true}
                                                    value={'none'}
                                                    type='text'
                                                    className="mt-2 font-semibold text-sm block text-black border-solid border-2 border-gray-300 rounded w-full px-3 py-3" />
                                            </Form.Field>
                                            <Form.Field name='referralSource' className="mt-2">
                                                <Form.Label><span className="text-sm font-bold text-[#525C76] capitalize">Test</span></Form.Label>
                                                <Form.Control
                                                    required={true}
                                                    value={'none'}
                                                    type='text'
                                                    className="mt-2 font-semibold text-sm block text-black  border-solid border-2 border-gray-300 rounded w-full px-3 py-3" />
                                            </Form.Field>
                                            
                                        </div>
                                        <div>
                                            <Form.Field name='allergies' className="">
                                                <Form.Label><span className="text-sm font-bold text-[#525C76]  capitalize">Description</span></Form.Label>

                                                <Form.Control asChild className="mt-2 py-1 px-2 text-sm text-black  border-solid block border-2 rounded border-gray-300 w-[100%] mx-auto">
                                                    <textarea className="Textarea" placeholder='enter your allergies here' rows={11} />
                                                </Form.Control>
                                            </Form.Field>
                                        </div>
                                    </div>
                                    <div className={`mt-6 border-2 border-dashed bg-[#08ac8611] rounded-lg p-8  border-gray-300 `}
                                            
                                        >
                                        <div className="w-full flex justify-center">
                                            <p className="text-[#08AC85] w-[250px] text-sm font-medium mb-4 text-center">
                                                Click or Drag and drop your file or photo here to start uploading
                                            </p>
                                        </div> 
                                        <div className="w-full flex justify-center">
                                            <label
                                                htmlFor="file-upload"
                                                className="cursor-pointer inline-flex gap-2 items-center bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 rounded-md shadow-sm hover:bg-gray-100"
                                            >
                                                <FiUpload />
                                                <span>Browse Files</span>
                                                
                                            </label>
                                            <input
                                                id="file-upload"
                                                type="file"

                                                className="hidden"
                                            />
                                        </div>

                                    </div>

                                    <div className="mt-8">
                                        <h2 className="font-bold text-md text-black">Files</h2>
                                        {/* <p className="text-sm text-[#525C76] mt-2">No files uploaded</p> */}
                                        <FileTable tableData={sampleCompletedData} />
                                    </div>
                                </div>

                                <div className="flex justify-end w-full pr-20 pt-5">
                                    <Form.Submit className="bg-[#294e7b] px-10 py-1 text-sm text-white rounded hover:bg-slate-800">Save Patient</Form.Submit>
                                </div>
                            </Form.Root>
                        </div>
                    
                    </div>
                       
                </div>
            </div>
        </div>
    )
}

export default Requests
