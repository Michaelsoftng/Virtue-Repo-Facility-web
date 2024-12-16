/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useCallback, useEffect, useState } from 'react'
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
    const [loading, setLoading] = useState(true)
    const [offsets, setOffsets] = useState<{ [key: string]: number }>({
        test: 0,
        facilityTest: 0,
    });

    const [dataCount, setDataCount] = useState<{ [key: string]: number }>({
        test: 0,
        facilityTest: 0
    });

    const [data, setData] = useState<{ [key: string]: TableData[] }>({
        test: [],
        facilityTest: []
    });

    const { user } = useAuth()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformFacilityTest = useCallback((facilitTest: any) => {
        const {
            __typename,
            test,
            facility,
            duration,
            price,
            ...rest
        } = facilitTest;

        return {
            test: test.name,
            duration: `up to ${duration ? duration : 5} days`,
            amount: price,
            ...rest,
            status: 'published',
        };
    }, [])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformTest = useCallback((test: any) => {
        const {
            __typename,

            ...rest
        } = test;
        return {
            ...rest,
        };
    }, [])


    const fetchData = useCallback(async (offset: number, tab: string) => {
        setLoading(true);
        try {
            const isFacilityTest = tab === 'facilityTest';

            const response = isFacilityTest
                ? await getFacilityTests(decodeJwtEncodedId(user?.id), 10, offset)
                : await client.query({
                    query: GetAllTest,
                    variables: { limit: 10, offset },
                    fetchPolicy: 'network-only',
                });

            const dataKey = isFacilityTest ? 'getAvailableTestByFacility' : 'getAllTest';
            const fetchedData = response.data?.[dataKey];
            if (!fetchedData) {
                console.log(`Error fetching ${tab} data:`, response.error || 'No data found.');
                return;
            }

            const items = isFacilityTest ? fetchedData.facilityTests : fetchedData.tests;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const transformedData = items.map((item: any) =>
                isFacilityTest ? transformFacilityTest(item) : transformTest(item)
            );

            setData((prevData) => {
                const existingIds = new Set((prevData[tab] || []).map((item) => item.id));
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const filteredData = transformedData.filter((item: any) => !existingIds.has(item.id));

                return {
                    ...prevData,
                    [tab]: [...(prevData[tab] || []), ...filteredData],
                };
            });

            setDataCount((prevData) => ({
                ...prevData,
                [tab]: isFacilityTest ? fetchedData.facilityTestCount : fetchedData.testCount,
            }));

        } catch (error) {
            console.error(`Error fetching ${tab} data:`, error);
        } finally {
            setLoading(false);
        }
    }, [user, transformFacilityTest, transformTest])

        ;

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        fetchData(offsets[tab], tab);

    };

    const handlePagination = () => {
        const currentOffset = offsets[activeTab] + 10;
        setOffsets((prevOffsets) => ({
            ...prevOffsets,
            [activeTab]: currentOffset,
        }));
        let filterStatus: string
        if (activeTab == '') {
            filterStatus = ''
        } else if (activeTab == '') {
            filterStatus = ''
        } else if (activeTab == '') {
            filterStatus = ''
        } else {
            filterStatus = ''
        }
        fetchData(currentOffset, activeTab);
    };

    const [addFacilityTest] = useMutation(CreateFacilityTest, {
        client,
    });

    const handleAddFacilityTest = async (formData: IFacilityTest) => {
        console.log(formData)
        // setPageLoading(true);
        try {
            await addFacilityTest({
                variables: {
                    ...formData
                },
                onCompleted(data) {
                    console.log(data)
                    // toast.success('Test added to facility successfully');

                },
                onError(error) {
                    toast.error(error.message);
                },
            });
        } catch (err) {
            console.error('Error adding test to facility:', err);
        } finally {


        }
    };

    useEffect(() => {
        fetchData(0, 'facilityTest');
    }, [fetchData]); // Empty dependency array ensures this runs only once
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
                                        approveAction={() => { }}
                                        tableData={data['facilityTest']}
                                        searchBoxPosition='justify-start'
                                        showTableHeadDetails={true}
                                        showActions={true}
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                        testPage='facilityTest'
                                    />
                                ))

                                :
                                (
                                    loading ? (
                                        <TablePreloader />
                                    ) : (

                                        <NewRequestTable
                                            approveAction={handleAddFacilityTest}
                                            facilityId={decodeJwtEncodedId(user?.id)}
                                            tableData={data['availableTest']}
                                            searchBoxPosition='justify-start mt-3'
                                            showTableHeadDetails={true}
                                            showActions={true}
                                            activeTab={activeTab}
                                            setActiveTab={setActiveTab}
                                            testPage='availableTest'
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

export default Requests
