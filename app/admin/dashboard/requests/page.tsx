"use client"
import React from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'

const sampleCompletedData: TableData[] = [
    {
        patients: [null, 'John Doe', 'egeregav@gmail.com'],
        test: 'Covid 19',
        amount: 30000,
        phlebotomist: ['female.jpg', 'John Doe', 'egeregav@gmail.com'],
        facility: 'MRS specialist/GARKI',
        date: "2024-10-12 18:11:57.866863+00",
        payment: 'cash',
        package: 'single',
        result_status: 'sent'
    },
    {
        patients: ['male.jpg', 'Jane Smith', 'janesmith@example.com'],
        test: 'Malaria',
        amount: 20000,
        phlebotomist: ['male.jpg', 'David Clark', 'davidclark@example.com'],
        facility: 'MRS specialist/GARKI',
        date: "2024-10-12 18:11:57.866863+00",
        payment: 'online',
        package: 'coperate (12)',
        result_status: 'pending'
    },
    {
        patients: ['female.jpg', 'Robert Brown', 'robertbrown@example.com'],
        test: 'Typhoid',
        amount: 15000,
        phlebotomist: ['female.jpg', 'Emily White', 'emilywhite@example.com'],
        facility: 'MRS specialist/GARKI',
        date: "2024-10-12 18:11:57.866863+00",
        payment: 'cash',
        package: 'single',
        result_status: 'sent'
    },
    {
        patients: ['male.jpg', 'Alice Green', 'alicegreen@example.com'],
        test: 'Blood Test',
        amount: 25000,
        phlebotomist: ['male.jpg', 'Michael Scott', 'michaelscott@example.com'],
        facility: 'MRS specialist/GARKI',
        date: "2024-10-11 18:11:57.866863+00",
        payment: 'cash',
        package: 'single',
        result_status: 'pending'
    },
    {
        patients: ['female.jpg', 'Mark Johnson', 'markjohnson@example.com'],
        test: 'HIV Test',
        amount: 10000,
        phlebotomist: ['female.jpg', 'Sophia Turner', 'sophiaturner@example.com'],
        facility: 'MRS specialist/GARKI',
        date: "2024-10-14 18:11:57.866863+00",
        payment: 'cash',
        package: 'single',
        result_status: 'pending'
    },
    
];


const Facilities = () => {

    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageTitle="Facilities" showExportRecord={true} />
                    <div className="px-8 py-4">

                        <AdminFacilitiesTable
                            tableHeadText='Requests'
                            tableData={sampleCompletedData}
                            searchBoxPosition='justify-start'
                            showTableHeadDetails={true}
                            showActions={false}
                            deleteAction={() => { }}
                            setItemToDelete={() => { }}
                            showPagination={true}
                            testPage='facilityTest'
                        />

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Facilities
