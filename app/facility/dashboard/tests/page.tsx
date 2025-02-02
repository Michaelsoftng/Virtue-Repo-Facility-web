/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import FacilityHeader from '@/src/reuseable/components/FacilityHeader'
import FacilityMenu from '@/src/reuseable/components/FacilityMenu'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import NewRequestTable from '@/src/partials/tables/NewRequesTable'
import { TableData } from '@/src/types/TableData.type'
import { useAuth } from '@/src/context/AuthContext'
import { GetAllTest } from '@/src/graphql/queries'
import { getFacilityTests } from '@/src/hooks/useGetAvailableTestByFacility'
import client from '@/lib/apolloClient';
import TablePreloader from '@/src/preLoaders/TablePreloader'
import { decodeJwtEncodedId } from '@/src/utils/decode'
import { IFacilityTest } from '@/src/interface'
import { CreateFacilityTest } from '@/src/graphql/mutations'
import { useMutation } from '@apollo/client'
import { toast } from 'react-toastify'
import { getAllTests } from '@/src/hooks/useGetAllTest'

const Requests = () => {
    const [pageLoadingFromClick, setPageLoadingFromClick] = useState(false)
    const limit = 10;  
    const { user } = useAuth()
    const [currentFacilityTestPage, setFacilityTestCurrentPage] = useState<number>(1);
    const [currentAvailablePage, setAvailableCurrentPage] = useState<number>(1);
    const [activeTab, setActiveTab] = useState<string>('facilityTest')
    const [loading, setLoading] = useState(true)
    const [offsets, setOffsets] = useState<{ [key: string]: number }>({
        test: 0,
        facilityTest: 0,
    });

    const [dataCount, setDataCount] = useState<{ [key: string]: number }>({
        test: 0,
        facilityTest: 0
    });

    const data = useRef<{ [key: string]: TableData[] }>({
        test: [],
        facilityTest: []
    });

    const fetchFacilityTests = useCallback(async (limit: number, offset: number) => {
        try {
            setLoading(true)
            const { data: testData, error, loading: testsDataLoading } = await getFacilityTests(user?.facilityAdmin?.id as string, limit, offset);
            if (error) {
                toast.error('Error fetching tests from api');
                return;
            }
            if (testData && testData.getAvailableTestByFacility?.facilityTests) {
                // Update the ref instead of state
                const facilitytests = testData.getAvailableTestByFacility?.facilityTests as TableData[]
                const updateFacilityTestsData = facilitytests.map((facilitTest) => {
                    const {
                        id,
                        __typename,
                        test,
                        facility,
                        duration,
                        price,
                        ...rest
                    } = facilitTest;

                    return {
                        id,
                        test: test.name,
                        duration: `up to ${duration ? duration : 5} days`,
                        amount: price,
                        ...rest,
                        status: 'published',
                    };
                }) || [];
                const allTests = [...updateFacilityTestsData];
                data.current = {
                    ...data.current,
                    facilityTest: Array.from(
                        new Map(
                            [...data.current.facilityTest, ...allTests].map(item => [item.id, item])
                        ).values()
                    ),
                };
               
                setDataCount((prevData) => ({
                    ...prevData,
                    facilityTest: testData.getAvailableTestByFacility.facilityTestCount,
                }));
                
                setOffsets((prevOffsets) => ({
                    ...prevOffsets,
                    facilityTest: prevOffsets.facilityTest + limit, // Update the key you want
                }));
            }

        } catch (err) {
            toast.error('A server error occurred! contact technical support')
        } finally {
            setLoading(false)
        }
    }, [user]);


    const fetchAvailableTests = useCallback(async (limit: number, offset: number) => {
        try {
            setLoading(true)
            const { data:testData, error, loading: testsDataLoading } = await getAllTests(limit, offset);
            if (error) {
                toast.error('Error fetching tests from api');
                return;
            }
            if (testData && testData.getAllTest?.tests) {
                // Update the ref instead of state
                const tests = testData.getAllTest?.tests as TableData[] 
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
                data.current = {
                    ...data.current,
                    test: Array.from(
                        new Map(
                            [...data.current.test, ...allTests].map(item => [item.id, item]) // Use `id` to ensure uniqueness
                        ).values()
                    ),
                };
                setDataCount((prevData) => ({
                    ...prevData,
                    test: testData.getAllTest.testCount,
                }));
                setOffsets((prevOffsets) => ({
                    ...prevOffsets,
                    test: prevOffsets.test + limit, // Update the key you want
                }));
                
                console.log("available test", data.current.test)
                
            }

        } catch (err) {
            toast.error('A server error occurred! contact technical support')
        } finally {
            setLoading(false)
        }
    }, []);
    
    const handleFetchNextPage = () => {
        if (data.current.test.length < (limit * (currentAvailablePage + 1))) {
            fetchAvailableTests(limit, offsets.test); 
        }
        return;
    }
    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        if (tab === 'availableTest') {
            if (data.current.test.length < (limit * (currentAvailablePage))) {
                fetchAvailableTests(limit, offsets.test); 
            }
            return;
            
        } else {
            if (data.current.facilityTest.length < (limit * (currentAvailablePage))) {
                fetchFacilityTests(limit, offsets.facilityTest);
            }
            return;
        }

    };

    const handleFetchNextPageFacilityTest = () => {
        if (data.current.facilityTest.length < (limit * (currentAvailablePage + 1))) {
            fetchFacilityTests(limit, offsets.facilityTest);
        }
        return;
    }


    const [addFacilityTest] = useMutation(CreateFacilityTest, {
        client,
    });

    const handleAddFacilityTest = async (formData: IFacilityTest) => {
        setPageLoadingFromClick(true);
        try {
            await addFacilityTest({
                variables: {
                    ...formData
                },
                onCompleted(data) {
                if (data.CreateFacilityTestManual.error) {
                    toast.error(data.CreateFacilityTestManual.error.message);   
                } else {
                    toast.success('Test added to facility successfully'); 
                }
    
                },
                onError(error) {
                    toast.error(error.message);
                },
            });
        } catch (err) {
            console.error('Error adding test to facility:', err);
        } finally {
            setPageLoadingFromClick(false);

        }
    };

    useEffect(() => {
        if (user) {
            fetchFacilityTests(10, 0);
        }
        
    }, [fetchFacilityTests, user]); // Empty dependency array ensures this runs only once

    return (
        <div>
            <FacilityHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <FacilityMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageTitle="Tests" showExportRecord={true} />

                    <div className="px-8 py-4">
                        <div className="mb-4">
                            <button className={`px-4 py-2 ${activeTab === 'facilityTest' ? "bg-[#B2B7C2]" : "bg-[#b5b5b646] "}  w-[200px] mr-2 rounded`} onClick={() => handleTabClick('facilityTest')}>Facility Tests</button>
                            <button className={`px-4 py-2 ${activeTab === 'availableTest' ? "bg-[#B2B7C2]" : "bg-[#b5b5b646] "}  w-[200px] mr-2 rounded`} onClick={() => handleTabClick('availableTest')}>Available Tests</button>

                        </div>
                        <div>
                            {activeTab === 'facilityTest' ? (
                                loading ? (
                                    <TablePreloader />
                                ) : (
                                    <NewRequestTable
                                        tableHeadText={`Facility Tests (${dataCount.facilityTest})`}
                                        approveAction={() => { }}
                                        tableData={data.current.facilityTest}
                                        searchBoxPosition='justify-start'
                                        showTableHeadDetails={true}
                                        showActions={true}
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                        testPage='facilityTest'
                                        dataCount={dataCount.facilityTest}
                                        currentPage={currentFacilityTestPage}
                                        setCurrentPage={setFacilityTestCurrentPage}
                                        changePage={handleFetchNextPageFacilityTest}    
                                            
                                         
                                    />
                                ))

                                :
                                (
                                    loading ? (
                                        <TablePreloader />
                                    ) : (

                                        <NewRequestTable
                                            tableHeadText={`Tests (${dataCount.test})`}
                                            approveAction={handleAddFacilityTest}
                                            facilityId={decodeJwtEncodedId(user?.id)}
                                            tableData={data.current.test}
                                            searchBoxPosition='justify-start mt-3'
                                            showTableHeadDetails={true}
                                            showActions={true}
                                            activeTab={activeTab}
                                            setActiveTab={setActiveTab}
                                            testPage='availableTest'
                                            dataCount={dataCount['test']}
                                            currentPage={currentAvailablePage}
                                            setCurrentPage={setAvailableCurrentPage}
                                            changePage={handleFetchNextPage} 
                                        />
                                    ))
                            }
                        </div>

                    </div>
                </div>
            </div>
            {
                pageLoadingFromClick &&
                <div className="flex items-center justify-center min-h-screen fixed w-full bg-[#ffffff54] top-0 left-0">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-green-500 border-green-200 rounded-full"></div>
                </div>
            }
        </div>
    )
}

export default Requests
