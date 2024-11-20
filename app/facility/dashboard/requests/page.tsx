"use client"
import React, { useState } from 'react'
import FacilityHeader from '@/src/reuseable/components/FacilityHeader'
import FacilityMenu from '@/src/reuseable/components/FacilityMenu'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import NewRequestTable from '@/src/partials/tables/NewRequesTable'
import { TableData } from '@/src/types/TableData.type'
const sampleNewData: TableData[] = [
    {
        patients: [null, 'John Doe', 'egeregav@gmail.com'],
        test: 'Covid 19',
        amount: 30000,
        phlebotomist: ['female.jpg', 'John Doe', 'egeregav@gmail.com'],
        date: "2024-10-12 18:11:57.866863+00",
        package: 'single',
        sample_status: 'pending'
    },
    {
        patients: ['male.jpg', 'Jane Smith', 'janesmith@example.com'],
        test: 'Malaria',
        amount: 20000,
        phlebotomist: ['male.jpg', 'David Clark', 'davidclark@example.com'],
        date: "2024-10-12 18:11:57.866863+00",
        package: 'single',
        sample_status: 'received'
    },
    {
        patients: ['female.jpg', 'Robert Brown', 'robertbrown@example.com'],
        test: 'Typhoid',
        amount: 15000,
        phlebotomist: ['female.jpg', 'Emily White', 'emilywhite@example.com'],
        date: "2024-10-12 18:11:57.866863+00",
        package: 'single',
        sample_status: 'completed'
    },
    {
        patients: ['male.jpg', 'Alice Green', 'alicegreen@example.com'],
        test: 'Blood Test',
        amount: 25000,
        phlebotomist: ['male.jpg', 'Michael Scott', 'michaelscott@example.com'],
        date: "2024-10-12 18:11:57.866863+00",
        package: 'single',
        sample_status: 'completed'
    },
    {
        patients: ['female.jpg', 'Mark Johnson', 'markjohnson@example.com'],
        test: 'HIV Test',
        amount: 10000,
        phlebotomist: ['female.jpg', 'Sophia Turner', 'sophiaturner@example.com'],
        date: "2024-10-12 18:11:57.866863+00",
        package: 'single',
        sample_status: 'completed'
    },
    // {
    // 	patients: ['male.jpg', 'Linda Thomas', 'lindathomas@example.com'],
    // 	test: 'Cholesterol',
    // 	amount: 18000,
    // 	phlebotomist: ['male.jpg', 'James Parker', 'jamesparker@example.com'],
    // 	sample_status: '222-444-6666'
    // },
    // {
    // 	patients: ['female.jpg', 'Steve Martin', 'stevemartin@example.com'],
    // 	test: 'Blood Sugar',
    // 	amount: 22000,
    // 	phlebotomist: ['female.jpg', 'Isabella Lewis', 'isabellalewis@example.com'],
    // 	sample_status: '777-888-9999'
    // },
    // {
    // 	patients: ['male.jpg', 'Emily Davis', 'emilydavis@example.com'],
    // 	test: 'Urine Test',
    // 	amount: 12000,
    // 	phlebotomist: ['male.jpg', 'Ryan Phillips', 'ryanphillips@example.com'],
    // 	sample_status: '333-555-7777'
    // },
    // {
    // 	patients: ['female.jpg', 'Daniel Taylor', 'danieltaylor@example.com'],
    // 	test: 'DNA Test',
    // 	amount: 50000,
    // 	phlebotomist: ['female.jpg', 'Emma Wilson', 'emmawilson@example.com'],
    // 	sample_status: '888-999-0000'
    // },
    // {
    // 	patients: ['male.jpg', 'Sarah King', 'sarahking@example.com'],
    // 	test: 'Pregnancy Test',
    // 	amount: 8000,
    // 	phlebotomist: ['male.jpg', 'Jacob Walker', 'jacobwalker@example.com'],
    // 	sample_status: '666-777-8888'
    // }
];

const sampleCompletedData: TableData[] = [
    {
        patients: [null, 'John Doe', 'egeregav@gmail.com'],
        test: 'Covid 19',
        amount: 30000,
        phlebotomist: ['female.jpg', 'John Doe', 'egeregav@gmail.com'],
        date: "2024-10-12 18:11:57.866863+00",
        package: 'single',
        result_status: 'sent'
    },
    {
        patients: ['male.jpg', 'Jane Smith', 'janesmith@example.com'],
        test: 'Malaria',
        amount: 20000,
        phlebotomist: ['male.jpg', 'David Clark', 'davidclark@example.com'],
        date: "2024-10-12 18:11:57.866863+00",
        package: 'coperate (12)',
        result_status: 'pending'
    },
    {
        patients: ['female.jpg', 'Robert Brown', 'robertbrown@example.com'],
        test: 'Typhoid',
        amount: 15000,
        phlebotomist: ['female.jpg', 'Emily White', 'emilywhite@example.com'],
        date: "2024-10-12 18:11:57.866863+00",
        package: 'single',
        result_status: 'sent'
    },
    {
        patients: ['male.jpg', 'Alice Green', 'alicegreen@example.com'],
        test: 'Blood Test',
        amount: 25000,
        phlebotomist: ['male.jpg', 'Michael Scott', 'michaelscott@example.com'],
        date: "2024-10-11 18:11:57.866863+00",
        package: 'single',
        result_status: 'pending'
    },
    {
        patients: ['female.jpg', 'Mark Johnson', 'markjohnson@example.com'],
        test: 'HIV Test',
        amount: 10000,
        phlebotomist: ['female.jpg', 'Sophia Turner', 'sophiaturner@example.com'],
        date: "2024-10-14 18:11:57.866863+00",
        package: 'single',
        result_status: 'pending'
    },
    // {
    // 	patients: ['male.jpg', 'Linda Thomas', 'lindathomas@example.com'],
    // 	test: 'Cholesterol',
    // 	amount: 18000,
    // 	phlebotomist: ['male.jpg', 'James Parker', 'jamesparker@example.com'],
    // 	sample_status: '222-444-6666'
    // },
    // {
    // 	patients: ['female.jpg', 'Steve Martin', 'stevemartin@example.com'],
    // 	test: 'Blood Sugar',
    // 	amount: 22000,
    // 	phlebotomist: ['female.jpg', 'Isabella Lewis', 'isabellalewis@example.com'],
    // 	sample_status: '777-888-9999'
    // },
    // {
    // 	patients: ['male.jpg', 'Emily Davis', 'emilydavis@example.com'],
    // 	test: 'Urine Test',
    // 	amount: 12000,
    // 	phlebotomist: ['male.jpg', 'Ryan Phillips', 'ryanphillips@example.com'],
    // 	sample_status: '333-555-7777'
    // },
    // {
    // 	patients: ['female.jpg', 'Daniel Taylor', 'danieltaylor@example.com'],
    // 	test: 'DNA Test',
    // 	amount: 50000,
    // 	phlebotomist: ['female.jpg', 'Emma Wilson', 'emmawilson@example.com'],
    // 	sample_status: '888-999-0000'
    // },
    // {
    // 	patients: ['male.jpg', 'Sarah King', 'sarahking@example.com'],
    // 	test: 'Pregnancy Test',
    // 	amount: 8000,
    // 	phlebotomist: ['male.jpg', 'Jacob Walker', 'jacobwalker@example.com'],
    // 	sample_status: '666-777-8888'
    // }
];
const Requests = () => {
    const [activeTab, setActiveTab] = useState<string>('newRequest')
    return (
        <div>
            <FacilityHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <FacilityMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageTitle="requests" showExportRecord={false }  />
                    <div className="px-8 py-4">
                        <div>
                            <button className="px-4 py-2 bg-[#B2B7C2] w-[200px] mr-2" onClick={() => setActiveTab('newRequest')}>New request</button>
                            <button className="px-4 py-2 bg-[#b5b5b67c] w-[200px]" onClick={() => setActiveTab('completedRequest')}>Completed request</button>
                        </div>
                        <div>
                            {
                                activeTab === 'newRequest'
                                    ? (
                                        <NewRequestTable activeTab={activeTab} setActiveTab={setActiveTab} tableData={sampleNewData} searchBoxPosition='justify-end' showTableHeadDetails={false} showActions={false} />

                                        
                                    )
                                    : (
                                        <NewRequestTable activeTab={activeTab} setActiveTab={setActiveTab}  tableData={sampleCompletedData} searchBoxPosition='justify-end' showTableHeadDetails={false} showActions={false} />
                                    
                                    )
                            }
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Requests
