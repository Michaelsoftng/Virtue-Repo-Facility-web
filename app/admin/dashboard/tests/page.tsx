/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState } from 'react'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import { PlusIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useGetAllTest } from '@/src/hooks/useGetAllTest'
import { useMutation } from '@apollo/client'
import client from '@/lib/apolloClient';
import { DeleteTest } from '@/src/graphql/mutations';
import { toast } from 'react-toastify';


const sampleMedicalTests = [
    {
        id: 1,
        name: "Complete Blood Count",
        code: "CBC",
        testType: "Hematology",
        group: "Blood Test",
        description: "Measures various components of the blood, such as red and white blood cells, hemoglobin, and platelets.",
        price: 5000,
    },
    {
        id: 2,
        name: "Liver Function Test",
        code: "LFT",
        testType: "Biochemistry",
        group: "Organ Function",
        description: "Assesses the health of the liver by measuring enzymes, proteins, and substances in the blood.",
        price: 7000,
    },
    {
        id: 3,
        name: "Thyroid Stimulating Hormone",
        code: "TSH",
        testType: "Endocrinology",
        group: "Hormone Test",
        description: "Tests the levels of thyroid-stimulating hormone to assess thyroid function.",
        price: 3000,
    },
    {
        id: 4,
        name: "Fasting Blood Sugar",
        code: "FBS",
        testType: "Diabetes",
        group: "Blood Sugar",
        description: "Measures blood sugar levels after a period of fasting to diagnose diabetes.",
        price: 2500,
    },
    {
        id: 5,
        name: "Kidney Function Test",
        code: "KFT",
        testType: "Biochemistry",
        group: "Organ Function",
        description: "Assesses kidney health by measuring waste products and electrolytes in the blood.",
        price: 6000,
    },
    {
        id: 6,
        name: "Urine Culture and Sensitivity",
        code: "UCS",
        testType: "Microbiology",
        group: "Urine Test",
        description: "Detects infections in the urinary tract and identifies the best treatment.",
        price: 4000,
    },
    {
        id: 7,
        name: "Electrolyte Panel",
        code: "EP",
        testType: "Biochemistry",
        group: "Electrolyte Test",
        description: "Measures the levels of essential electrolytes like sodium, potassium, and chloride.",
        price: 3500,
    },
    {
        id: 8,
        name: "Lipid Profile",
        code: "LP",
        testType: "Cardiology",
        group: "Cholesterol Test",
        description: "Measures cholesterol levels to assess heart disease risk.",
        price: 4500,
    },
    {
        id: 9,
        name: "HIV Antibody Test",
        code: "HAT",
        testType: "Immunology",
        group: "Infectious Disease",
        description: "Detects the presence of antibodies to HIV in the blood.",
        price: 5000,
    },
    {
        id: 10,
        name: "Chest X-Ray",
        code: "CX",
        testType: "Radiology",
        group: "Imaging Test",
        description: "Provides an image of the chest to check for lung and heart conditions.",
        price: 8000,
    }
];


const sampleCompletedData: TableData[] = [
    {
        patients: [null, 'John Doe', 'egeregav@gmail.com'],
        test: 'Covid 19',
        facility: 'MRS specialist/GARKI',
        date: "2024-10-12 18:11:57.866863+00",
        package: 'single',
        result_status: 'sent'
    },
    {
        patients: ['male.jpg', 'Jane Smith', 'janesmith@example.com'],
        test: 'Malaria',
        facility: 'MRS specialist/GARKI',
        date: "2024-10-12 18:11:57.866863+00",
        package: 'coperate (12)',
        result_status: 'pending'
    },
    {
        patients: ['female.jpg', 'Robert Brown', 'robertbrown@example.com'],
        test: 'Typhoid',
        facility: 'MRS specialist/GARKI',
        date: "2024-10-12 18:11:57.866863+00",
        package: 'single',
        result_status: 'sent'
    },
    {
        patients: ['male.jpg', 'Alice Green', 'alicegreen@example.com'],
        test: 'Blood Test',
        facility: 'MRS specialist/GARKI',
        date: "2024-10-11 18:11:57.866863+00",
        package: 'single',
        result_status: 'pending'
    },
    {
        patients: ['female.jpg', 'Mark Johnson', 'markjohnson@example.com'],
        test: 'HIV Test',
        facility: 'MRS specialist/GARKI',
        date: "2024-10-14 18:11:57.866863+00",
        package: 'single',
        result_status: 'pending'
    },
    {
        patients: ['male.jpg', 'Alice Green', 'alicegreen@example.com'],
        test: 'Blood Test',
        facility: 'MRS specialist/GARKI',
        date: "2024-10-11 18:11:57.866863+00",
        package: 'single',
        result_status: 'pending'
    },
    {
        patients: ['female.jpg', 'Mark Johnson', 'markjohnson@example.com'],
        test: 'HIV Test',
        facility: 'MRS specialist/GARKI',
        date: "2024-10-14 18:11:57.866863+00",
        package: 'single',
        result_status: 'pending'
    },

];

const Requests = () => {

    const [pageLoading, setPageLoading] = useState(false)
    const [offset, setSet] = useState(0)
    const { data, error, loading: testDataLoading } = useGetAllTest(10, offset)
    const testCount = data?.getAllTest.testCount
    const testData = data?.getAllTest.tests as TableData[] 
    const [deleteTestWithId, setDeleteTestWithId] = useState <string | null>(null) // id of test to delete

    const [deleteTest, { loading: deleteTestLoading }] = useMutation(DeleteTest, {
        variables: {
            id: deleteTestWithId,

        },
        client,
    });

    const handleDeleteTest = async () => {
        setPageLoading(true)
        try {
            const { data } = await deleteTest({
                async onCompleted(data) {
                    console.log(data)
                    if (data.DeleteTest.test.deletedStatus) {
                        toast.success(data?.DeleteTest?.test?.message);
                        window.location.reload();
                    } else {
                        toast.error(data?.DeleteTest?.test?.message);
                    }

                },
                onError(e) {
                    toast.error(e.message);

                },
            }); 

        } catch (err) {
            console.error('Error deleting test:', err);
        } finally {
            setPageLoading(false)

        }
       
    }
    // Check if patientData is available before mapping
    const updatedTestData = testData?.map((test) => {
        const {
            __typename,
            createdAt,
            ...rest
        } = test;

        const newTestData = {
            ...rest,
            
        };

        return newTestData
    }) || []; // Default to an empty array if patientData is undefined

    const [activeTab, setActiveTab] = useState<string>('newRequest')
    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageTitle="Tests" showExportRecord={false }  />
                    <div className="px-8 py-4">
                        <div className="flex justify-between">
                            <div>
                                <button className="px-4 py-2 bg-[#B2B7C2] w-[200px] mr-2" onClick={() => setActiveTab('newRequest')}>Tests</button>
                                <button className="px-4 py-2 bg-[#b5b5b67c] w-[200px]" onClick={() => setActiveTab('completedRequest')}>Results</button>
                            </div>

                            <Link href='tests/new' className="bg-[#08AC85] text-white py-2 px-3 flex justify-around text-[14px] rounded">
                                <PlusIcon />
                                <span >Add Test</span>
                            </Link>
                        </div>
                        
                        <div>
                            {
                                activeTab === 'newRequest'
                                    ? (

                                        <AdminFacilitiesTable
                                            currentPage={1}
                                            setCurrentPage={() => { }}
                                            approveAction={() => { }} 
                                            deleteAction={handleDeleteTest}
                                            setItemToDelete={setDeleteTestWithId}
                                            tableHeadText='Tests'
                                            dataCount={testCount}
                                            tableData={updatedTestData} 
                                            changePage={() => { }}
                                            showActions={true}

                                            showPagination={true}
                                            
                                            testPage='tests'
                                            marginTop='mt-4'
                                        />
                                        
                                    )
                                    : (

                                        <AdminFacilitiesTable
                                            currentPage={1}
                                            setCurrentPage={() => { }}
                                            setItemToDelete={setDeleteTestWithId}
                                            deleteAction={() => { }}
                                            approveAction={() => { }} 
                                            tableHeadText='Results'
                                            tableData={sampleCompletedData}
                                            showActions={false}
                                            showPagination={true}
                                            testPage='results'
                                            marginTop='mt-4'
                                            changePage={() => { }}
                                        />
                                    
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
