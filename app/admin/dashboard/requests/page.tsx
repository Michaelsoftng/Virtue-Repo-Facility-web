/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState } from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import { useGetAllRequest } from '@/src/hooks/useGetAllRequest'
import TablePreloader from '@/src/preLoaders/TablePreloader'


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
    const [pageLoading, setPageLoading] = useState(false)
    const [offset, setOffset] = useState(0)
    const { data, error, loading:requestDataLoading } = useGetAllRequest(10, offset)
    const requestCount = data?.getAllRequests.length
    const requestData = data?.getAllRequests as TableData[]
    const [deleteRequestWithId, setDeleteRequestWithId] = useState<string | null>(null)

    const updatedRequestData = requestData?.map((request) => {
        const {
            __typename,
            phlebotomist,
            patient,
            requestDate,
            facility,
            samplePickUpAddress,
            requestStatus,
            sampleStatus,
            isPaid,
            balance,
            total,
            tests,
            createdAt,
            ...rest
        } = request;
        const patientname = (patient.user.firstName) ? `${patient.user.firstName} ${patient.user.lastName}` : 'Not Set'
        const phlebotomistname = (phlebotomist && phlebotomist.user.firstName) ? `${phlebotomist.user.firstName} ${phlebotomist.user.lastName}` : 'Not Set'
        const newRequestData = {
            patients: [null, patientname, patient.user.email],
            // test: `${tests.length} tests`,
            amount: total,
            paid: 1234,
            balance: balance ? balance : 0,
            phlebotomist: phlebotomist ? [null, phlebotomistname, phlebotomist.email] : [null, phlebotomistname, "info@labtraca.com"],
            // address: samplePickUpAddress,
            requestDate: requestDate,
            sample_status: sampleStatus,
            status: requestStatus,
            
            ...rest,

        };

        return newRequestData
    }) || []; // Default to an empty array if patientData is undefined

    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageTitle="Facilities" showExportRecord={true} />
                    <div className="px-8 py-4">
                        {
                            requestDataLoading
                            ?
                                <TablePreloader />
                                
                                :
                        
                        <AdminFacilitiesTable
                            tableHeadText='Requests'
                            tableData={updatedRequestData}
                            searchBoxPosition='justify-start'
                            showTableHeadDetails={true}
                            showActions={true}
                            deleteAction={() => { }}
                            approveAction={() => { }} 
                            setItemToDelete={() => { }}
                            showPagination={true}
                            testPage='requests'
                        />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Facilities
