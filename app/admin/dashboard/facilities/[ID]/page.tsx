/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import { CiLocationOn, CiClock2, CiPhone } from "react-icons/ci";
import { BiSolidStar } from "react-icons/bi";
import RequestIcon from '@/src/reuseable/icons/RequestIcon'
import { PieChartAnalytics } from '@/src/partials/tables/PieChartAnalytics'
import Link from 'next/link'
import PlusIcon from '@/src/reuseable/icons/PlusIcon'
import { useGetAllTest } from '@/src/hooks/useGetAllTest'
import client from '@/lib/apolloClient';
import { GetUserById } from '@/src/graphql/queries';
import { getFacilityTests, useGetAvailableTestByFacility } from '@/src/hooks/useGetAvailableTestByFacility'
import { toast } from 'react-toastify';
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/navigation';
import Approval from '@/src/reuseable/components/Approval'
import Loading from '../../loading'
import TablePreloader from '@/src/preLoaders/TablePreloader'
import NumberPreloader from '@/src/preLoaders/NumberPreloader'

const sampleCompletedData: TableData[] = [
    {
        facility: 'MRS specialist',
        location: '15 jumble street, Garki',
        available_test: 300,
        rating: 5,
    },
    {
        facility: 'MRS specialist',
        location: '15 jumble street, Garki',
        available_test: 300,
        rating: 5,
    },
    {

        facility: 'MRS specialist',
        location: '15 jumble street, Garki',
        available_test: 300,
        rating: 5,
    },
    {

        facility: 'MRS specialist',
        location: '15 jumble street, Garki',
        available_test: 300,
        rating: 5,
    },
    {

        facility: 'MRS specialist',
        location: '15 jumble street, Garki',
        available_test: 300,
        rating: 5,
    }
];

const chartData = [
    { test: "Covid", visitors: 275, fill: "red" },
    { test: "Malaria", visitors: 200, fill: "green" },
    { test: "RVS", visitors: 187, fill: "purple" },
    { test: "Hyperloric A.", visitors: 173, fill: "blue" },
    { test: "others", visitors: 90, fill: "#44AC21" },
]


const Facilities = ({ params }: { params: { ID: string } }) => {
    const [testDataLoading, setIsLoading] = useState<boolean>(false);
    const updatedTestData = useRef<TableData[]>([]);
    const testCount = useRef<number>(0);
    const { ID } = params;

    const { data: facilityData, loading: pageLoading } = useQuery(GetUserById, {
        variables: {
            id: ID
        },
        client,
    });
    const facilityId = facilityData?.getUserById?.facilityAdmin.id;
   
    const fetchFacilityTests = useCallback(async (facilityId: string, limit: number) => {
        console.log(facilityData)
        setIsLoading(true);
        try {
            const { data, error, loading: testDataLoading } = await getFacilityTests(facilityId, limit);
            if (error) {
                console.log('Error fetching available test jobs:', error);
                return;
            }
            if (data && data.getAvailableTestByFacility?.facilityTests) {
                // Update the ref instead of state
                const facilityTestsData = data.getAvailableTestByFacility.facilityTests as TableData[] 
                const updateTestData = facilityTestsData.map((singleFacilityTest) => {
               
                    const {
                        __typename,
                        test,
                        facility,
                        duration,
                        createdAt,
                        price,
                        preparation,
                        ...rest
                    } = singleFacilityTest;

                    const newTestData = {
                        test: test.name,
                        duration: `up to ${duration ? duration : 5} days`,
                        amount: price,
                        ...rest,
                        status: 'published',
                    };
                    
                    return newTestData
                }) || [];


                const allFacilityTests = [...updateTestData];
                testCount.current = data.getAvailableTestByFacility.facilityTestCount;

                updatedTestData.current = allFacilityTests;
            }
        } catch (err) {
            console.log('Error fetching cachedSavedJobsRef.current saved jobs:', err);
        } finally {
            // istanbul ignore next
            setIsLoading(false);
            console.log("finally")
        }
    }, [facilityData]);

    useEffect(() => {
        if (facilityId) {
            fetchFacilityTests(facilityId as string, 10);
        }
    }, [fetchFacilityTests, facilityId]);


    if (pageLoading ) {
        return <Loading />;
    }

    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageTitle="Facilities" showExportRecord={true} />
                    {
                        !facilityData?.getUserById.approvedAt && <Approval />
                    }
                    
                    <div className="px-8 py-4">
                        <div className="flex justify-between">
                            <div>
                                <h2 className="text-lg font-bold">{facilityData.getUserById.facilityAdmin.facilityName}</h2>
                                <p className="flex gap-2 text-[#8C93A3] text-[16px] mt-2"><CiLocationOn style={{ width: '25px', height: '25px' }} /><span>{facilityData.getUserById.streetAddress} {facilityData.getUserById.city}, {facilityData.getUserById.state}</span></p>
                                <p className="flex gap-2 text-[#8C93A3] text-[16px] mt-2"><CiClock2 style={{ width: '25px', height: '25px' }} /><span>Opening hours : MON-SAT 6:00 AM , SUN 8:00 AM</span></p>
                                <p className="flex gap-2 text-[#8C93A3] text-[16px] mt-2"><CiPhone style={{ width: '25px', height: '25px' }} /><span>Contact line : {facilityData.getUserById.phoneNumber}</span></p>
                            </div>
                            <div className="shadow-md bg-white px-8 py-4 flex gap-6 rounded-md">
                                <div className="bg-green-100 h-[50px] px-4 py-4 flex items-center justify-center mt-5">
                                    <RequestIcon fill='#08AD85' stroke='#08AD85' />
                                </div>
                                <div className="">
                                    <h2 className="text-[#8C93A3] mt-3">Total Available Tests</h2>
                                    {
                                        testDataLoading ? 
                                            <NumberPreloader/>
                                        :
                                            <p className="font-bold text-3xl  mt-3">{testCount.current}</p>
                                    
                                    }
                                </div>
                            </div>

                            <div className="shadow-md bg-white px-4 py-4 gap-14 w-[23rem]  rounded-md">
                                <h2 className="text-[#8C93A3] font-[600] text-lg text-center mt-2">Current Rating</h2>
                                <p className="flex justify-center text-center w-full mt-4 space-x-1"> <span className="text-black font-bold text-[36px] leading-none ">4.5</span> <BiSolidStar className="text-[#F9CB57] text-4xl" /></p>
                            </div>
                        </div>

                        <div className="grid grid-cols-[calc(100%-25rem)_23rem] gap-x-8 mt-8">
                            <AdminFacilitiesTable
                                tableHeadText='53 Facilities'
                                tableData={sampleCompletedData}
                                searchBoxPosition='hidden'
                                showTableHeadDetails={false}
                                showActions={false}
                                deleteAction={() => { }}
                                setItemToDelete={() => { }}
                                showPagination={false}
                                testPage='Request'
                            >

                                <div className="mx-4 mt-5">
                                    <h2 className="text-[#0F1D40] font-bold text-xl">Recent tests made</h2>
                                </div>
                            </AdminFacilitiesTable>
                            <div className="mt-2 px-6 py-2  rounded-md bg-white shadow-md box-shadow: 0 4px 6px -1px rgb(34 0 0 / 0.1), 0 2px 4px -2px rgb(34 0 0 / 0.1);">
                                <h2 className="text-[20px] font-bold text-black">Top Test</h2>
                                <div className="">

                                    <div>
                                        <PieChartAnalytics chartData={chartData} />
                                    </div>


                                    <div className="grid grid-cols-4">

                                        {chartData.map((entry, index) => (
                                            <div key={index} className="" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                <span className="rounded-full p-[1.5]"
                                                    style={{
                                                        backgroundColor: entry.fill,
                                                        display: 'inline-block',
                                                        width: '12px',
                                                        height: '12px',
                                                        marginRight: '8px'
                                                    }}
                                                ></span>
                                                <span className="text-[#555555] text-[10px] poppins leading-5">{entry.test}</span>
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            testDataLoading
                                 
                                ?
                                <TablePreloader /> :
                               
                                <AdminFacilitiesTable
                                marginTop={'mt-6'}
                                tableHeadText='53 Facilities'
                                tableData={updatedTestData.current}
                                searchBoxPosition='justify-start'
                                showTableHeadDetails={false}
                                showActions={true}
                                deleteAction={() => { }}
                                setItemToDelete={() => { }}
                                showPagination={false}
                                testPage='singleFacility'
                                >


                                    <div className="mx-4 mt-6 flex justify-between">
                                        <h2 className="text-[#0F1D40] font-bold text-xl">Available tests</h2>

                                        <Link href='tests/new' className="bg-[#08AC85] text-white py-2 px-3 flex justify-around text-[14px] rounded">
                                            <PlusIcon />
                                            <span >Add Test</span>
                                        </Link>
                                    </div>
                                </AdminFacilitiesTable>
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Facilities