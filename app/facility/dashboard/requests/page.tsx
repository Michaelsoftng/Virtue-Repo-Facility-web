/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useCallback, useEffect, useState } from 'react'
import FacilityHeader from '@/src/reuseable/components/FacilityHeader'
import FacilityMenu from '@/src/reuseable/components/FacilityMenu'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import NewRequestTable from '@/src/partials/tables/NewRequesTable'
import { TableData } from '@/src/types/TableData.type'
import { useAuth } from '@/src/context/AuthContext'
import TablePreloader from '@/src/preLoaders/TablePreloader'
import { getAllTestRequestsByFacility } from '@/src/graphql/queries'
import client from '@/lib/apolloClient';
import { decodeJwtEncodedId } from '@/src/utils/decode'


const Requests = () => {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState<string>('newRequest')
    const [loading, setLoading] = useState(true)
    const [offsets, setOffsets] = useState<number >(0);

    const [dataCount, setDataCount] = useState< number >(0);

    const [data, setData] = useState<TableData[]>([]);

    const fetchData = useCallback(async (offset: number) => {
        setLoading(true);
        try {
            // Dynamically refetch the data with updated variables
            const { data: newData, error: fetchError } = await client.query({
                query: getAllTestRequestsByFacility,
                variables: {
                    facilityId: decodeJwtEncodedId(user?.id),
                    limit: 10, // Adjust as needed
                    offset,
                },
                fetchPolicy: 'network-only', // Ensure fresh data is fetched
            });

            if (fetchError) {
                throw fetchError;
            }

            const testRequestsCount = newData.getAllRequestsByFacility?.testRequestCount
            const testRequest = newData?.getAllRequestsByFacility?.testRequests || [] as TableData[];

            
            // Check if testRequests is available before mapping
            const updatedtestRequestsData = testRequest?.map((singleTestRequest: TableData) => {

                const {
                    __typename,
                    facility,
                    test,
                    request,
                    deletedAt,
                    deletedBy,
                    createdAt,
                    total,
                    ...rest
                } = singleTestRequest;

                    const requestData = {
                    ...rest,
                    amount: total,
                    status: status,

                };

                return requestData
            }) || [];


            setData(updatedtestRequestsData);


            setDataCount(testRequestsCount);

        } catch (error) {
            console.error(`Error fetching  data:`, error);
        } finally {
            setLoading(false);
        }
    }, [user])


    // const handlePagination = () => {
    //     const currentOffset = offsets[activeTab] + 10;
    //     setOffsets((prevOffsets) => ({
    //         ...prevOffsets,
    //         [activeTab]: currentOffset,
    //     }));
    //     fetchData(currentOffset, activeTab);
    // };

    useEffect(() => {
        fetchData(0);
    }, [fetchData]); // Empty dependency array ensures this runs only once
    return (
        <div>
            <FacilityHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <FacilityMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageTitle="requests" showExportRecord={false }  />
                    <div className="px-8 py-4">
                        
                        <div>
                            {loading ? (
                                <TablePreloader />
                            ) 
                                    :(
                                    <NewRequestTable
                                        approveAction={()=>{} }
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                        tableData={data}
                                        searchBoxPosition='justify-end'
                                        showTableHeadDetails={false}
                                        showActions={false} />

                                        
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
