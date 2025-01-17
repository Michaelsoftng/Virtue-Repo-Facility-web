/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import { PlusIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { getAllTests } from '@/src/hooks/useGetAllTest'
import { useMutation } from '@apollo/client'
import client from '@/lib/apolloClient';
import { DeleteTest } from '@/src/graphql/mutations';
import { toast } from 'react-toastify';
import TablePreloader from '@/src/preLoaders/TablePreloader'

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

const Tests = () => {
    const [activeTab, setActiveTab] = useState<string>('tests')
    const [pageLoading, setPageLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const offsets = useRef<{ [key: string]: number }>({
        tests: 0,
        results: 0,
    });
        
    const dataCount = useRef<{ [key: string]: number}>({
        tests: 0,
        results: 0,
        });
    
    const testdata = useRef<{ [key: string]: TableData[]  }>({
        tests: [],
        results: [],
    });
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
    const fetchTests = useCallback(async (limit: number, offset: number) => {
        try {
            setPageLoading(true)
            const { data, error, loading: testsDataLoading } = await getAllTests(limit, offset);
            if (error) {
                console.log('Error fetching tests from api:', error);
                return;
            }
            if (!testdata.current) {
                console.log("invalid ref for data.current")
            }
            if (data && data.getAllTest?.tests) {
                // Update the ref instead of state
                const tests = data.getAllTest?.tests as TableData[] 
                const updateTestsData = tests.map((test) => {
                    const {
                        __typename,
                        id,
                        percentageIncrease,
                        minimumIncrease,
                        createdAt,
                        ...rest
                    } = test;

                    const newTestData = {
                        id,
                        ...rest,
                        percentage_increase: `${percentageIncrease}%`,
                        minimum_increase: minimumIncrease

                    };
                    return newTestData
                }) || [];

                const allTests = [...updateTestsData];
                testdata.current = {
                    ...testdata.current,
                    tests: Array.from(
                        new Map(
                            [...testdata.current.tests, ...allTests].map(item => [item.id, item]) // Use `id` to ensure uniqueness
                        ).values()
                    ),
                };
                dataCount.current = {
                    ...dataCount.current,
                    tests: data.getAllTest.testCount,
                };
                offsets.current = {
                    ...dataCount.current,
                    tests: limit + offsets.current.tests,
                };
            }

        } catch (err) {
            console.log('error fetching tests catch error', err);
        } finally {
            setPageLoading(false)
            console.log("finally")
        }
    }, []);
    
    const handleTabChange = (tab: string) => {
        switch (tab) {
            case 'tests':
                setActiveTab('tests')
                fetchTests(10, offsets.current.tests)
                break;
            case 'results':
                setActiveTab('results')
                // fetchTests(10, offsets.current.tests)
                break;
            default:
                break;
        }
        
    }

    const handleFetchNextPage = () => {
        offsets.current = {
            ...dataCount.current,
            tests: 10 + offsets.current.tests,
        };
    }
    useEffect(() => {
        fetchTests(10, 0);
    }, [fetchTests]);

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
                                <p className="font-bold text-xl px-4 py-2 mr-2" >{dataCount.current.tests } Available Tests</p>
                            </div>

                            <Link href='tests/new' className="bg-[#08AC85] text-white py-2 px-3 flex justify-around text-[14px] rounded">
                                <PlusIcon />
                                <span >Add Test</span>
                            </Link>
                        </div>
                        
                        <div>
                            {
                                pageLoading
                                    ? 
                                    <TablePreloader />
                                    :
                                    (activeTab === 'tests'
                                    ? (

                                        <AdminFacilitiesTable
                                            currentPage={currentPage}
                                            setCurrentPage={setCurrentPage}
                                            approveAction={() => { }} 
                                            deleteAction={handleDeleteTest}
                                            setItemToDelete={setDeleteTestWithId}
                                            tableHeadText='Tests'
                                            dataCount={dataCount.current.tests}
                                            tableData={testdata.current.tests} 
                                            changePage={handleFetchNextPage}
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
                                    
                                    ))
                            }
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tests
