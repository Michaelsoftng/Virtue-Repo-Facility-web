/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState } from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import TotalPatients from '@/src/reuseable/components/TotalPatients'

const sampleCompletedData: TableData[] = [
    {
        patients: [null, 'John Doe', 'egeregav@gmail.com'],
        requests_completed: 24, 
        date_of_birth: "2024-10-12",
        gender: 'female',
        address: '25 seapark eastwest road, Abuja ',
        status: 'verified'
    },
    {
        patients: ['male.jpg', 'Jane Smith', 'janesmith@example.com'],
        requests_completed: 24, 
        date_of_birth: "2024-10-12",
        gender: 'female',
        address: '25 seapark eastwest road, Abuja ',
        status: 'unverified'
    },
    {
        patients: ['female.jpg', 'Robert Brown', 'robertbrown@example.com'],
        requests_completed: 24, 
        date_of_birth: "2024-10-12",
        gender: 'female',
        address: '25 seapark eastwest road, Abuja ',
        status: 'verified'
    },
    {
        patients: ['male.jpg', 'Alice Green', 'alicegreen@example.com'],
        requests_completed: 24, 
        date_of_birth: "2024-10-11",
        gender: 'female',
        address: '25 seapark eastwest road, Abuja ',
        status: 'verified'
    },
    {
        patients: ['female.jpg', 'Mark Johnson', 'markjohnson@example.com'],
        requests_completed: 24, 
        date_of_birth: "2024-10-14",
        gender: 'female',
        address: '25 seapark eastwest road, Abuja ',
        status: 'verified'
    },

];


const Patients = () => {
    const [activeTab, setActiveTab] = useState<string>("phlebotomist")
    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageWrapper="Dashboard" pageTitle="Phlebotomies" showExportRecord={true} />

                    <div className="px-8 py-4">
                        <div className="mb-4">
                            <button className="px-4 py-2 bg-[#B2B7C2] w-[200px] mr-2 rounded" onClick={() => setActiveTab('phlebotomist')}>Phlebotomist</button>
                            <button className="px-4 py-2 bg-[#b5b5b646] w-[200px] mr-2 rounded" onClick={() => setActiveTab('audit')}>Audit</button>
                            <button className="px-4 py-2 bg-[#b5b5b646] w-[200px] rounded" onClick={() => setActiveTab('assignment')}>assignment</button>

                        </div>
                        <div className="">
                            <TotalPatients
                                loading={false}
                                totalusers={13}
                                newUsers={14}
                                verifiedUsers={10}
                                unverifedPatients={90}
                           

                            />
                            <AdminFacilitiesTable
                                deleteAction={() => { }}
                                approveAction={() => { }} 
                                setItemToDelete={() => { }}
                                tableHeadText=''
                                tableData={sampleCompletedData}
                                searchBoxPosition='justify-start'
                                showTableHeadDetails={true}
                                showActions={true}
                                showPagination={false}
                                testPage='phlebotomies'
                                marginTop='mt-4'
                            />

                        </div>

                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Patients
