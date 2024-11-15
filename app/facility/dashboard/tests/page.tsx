"use client"
import React, { useState } from 'react'
import FacilityHeader from '@/src/reuseable/components/FacilityHeader'
import FacilityMenu from '@/src/reuseable/components/FacilityMenu'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import NewRequestTable from '@/src/partials/tables/NewRequesTable'
import { TableData } from '@/src/types/TableData.type'

const sampleCompletedData: TableData[] = [
    {
        test: 'Covid 19',
        amount: 30000,
        avalability: '9:30AM to 3:30PM',
        duration: "up to 7 days",
        id: '34567809'
    },
    {

        test: 'Malaria',
        amount: 20000,
        avalability: '9:30AM to 3:30PM',
        duration: "up to 7 days",
        id: '34567809'
    },
    {

        test: 'Typhoid',
        amount: 15000,
        avalability: '9:30AM to 3:30PM',
        duration: "up to 7 days",
        id: '34567809'
    },
    {

        test: 'Blood Test',
        amount: 25000,
        avalability: '9:30AM to 3:30PM',
        duration: "up to 7 days",
        id: '34567809'
    },
    {

        test: 'HIV Test',
        amount: 10000,
        avalability: '9:30AM to 3:30PM',
        duration: "up to 7 days",
        id: '34567809'
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

const sampleAvailableData: TableData[] = [
    {
        test: 'Thyroid stimulating hormone (TSH)',
        description: 'Test description thats extremly long and needs to be truncated so it doesnt distrupt the entire page flow and is really really long so needs truncation for better user experience',
        code: 'TSH',
        type: "single test",
        id: '34567809'
    },
    {
        test: 'Covid 19',
        description: 'Test description thats extremly long and needs to be truncated so it doesnt distrupt the entire page flow and is really really long so needs truncation for better user experience',
        code: 'COV19',
        type: "single test",
        id: '34567809'
    },
    {

        test: 'Mens Health',
        description: 'Test description thats extremly long and needs to be truncated so it doesnt distrupt the entire page flow and is really really long so needs truncation for better user experience',
        code: 'TSH',
        type: "Package (7)",
        id: '34567809'
    },
    {
        test: 'Covid 19',
        description: 'Test description thats extremly long and needs to be truncated so it doesnt distrupt the entire page flow and is really really long so needs truncation for better user experience',
        code: 'TSH',
        type: "single test",
        id: '34567809'
    },
    {

        test: 'Pre Wedding Test',
        description: 'Test description thats extremly long and needs to be truncated so it doesnt distrupt the entire page flow and is really really long so needs truncation for better user experience',
        code: 'TSH',
        type: "Package (7)",
        id: '34567809'
    }
];

const Requests = () => {
    const [activeTab, setActiveTab] = useState<string>('facilityTest')
    return (
        <div>
            <FacilityHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <FacilityMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageTitle="Tests" showExportRecord={true} />
                    <div className="px-8 py-4">
                        {
                            activeTab == 'availableTest'
                                ? 
                                <NewRequestTable
                                    tableData={sampleAvailableData}
                                    searchBoxPosition='justify-start'
                                    showTableHeadDetails={true}
                                    showActions={true}
                                    activeTab={activeTab}
                                    setActiveTab={setActiveTab}
                                    testPage='availableTest'
                                />    
                            : <NewRequestTable
                                tableData={sampleCompletedData}
                                searchBoxPosition='justify-start'
                                showTableHeadDetails={true}
                                showActions={true}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                testPage='facilityTest'
                            />
                        }

                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Requests
