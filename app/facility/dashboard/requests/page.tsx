/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
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
    const limit = 10;
    const { user } = useAuth()
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [activeTab, setActiveTab] = useState<string>('newRequest')
    const [loading, setLoading] = useState(true)
    const [offsets, setOffset] = useState<number >(0);
    const cachedRequestData = useRef<TableData[]>([])
    const [dataCount, setDataCount] = useState< number >(0);
    const fetchData = useCallback(async (offset: number) => {
        if (!user) return;
        setLoading(true);
        try {
            // Dynamically refetch the data with updated variables
            const { data: newData, error: fetchError } = await client.query({
                query: getAllTestRequestsByFacility,
                variables: {
                    facilityId: decodeJwtEncodedId(user?.id),
                    limit, // Adjust as needed
                    offset,
                },
                fetchPolicy: 'network-only', // Ensure fresh data is fetched
            });

            if (fetchError) {
                throw fetchError;
            }
            
            const testRequestsCount = newData?.getAllRequestsByFacility?.testRequestCount
            const testRequest = newData?.getAllRequestsByFacility?.testRequests || [] as TableData[];
            
            
            // Check if testRequests is available before mapping
            const updatedtestRequestsData: TableData[] = testRequest?.map((singleTestRequest: TableData) => {

                const {
                    __typename,
                    id,
                    facility,
                    test,
                    request,
                    deletedAt,
                    deletedBy,
                    createdAt,
                    facilityEarning,
                    status,
                    patientName,
                    patientAge,
                    package: testPackage,
                    facilityDistance,
                    testResult,
                    resultDate,

                    ...rest
                } = singleTestRequest;
                const patientname = (request.patient.user.firstName) ? `${request.patient.user.firstName.trim()} ${request.patient.user.lastName.trim()}` : 'Not Set'
                const phlebotomistname = (request.phlebotomist && request.phlebotomist.user.firstName) ? `${request.phlebotomist.user.firstName.trim()} ${request.phlebotomist.user.lastName.trim() }` : 'Not Set'

                    
                const requestData = {
                    id,
                    patient: [null, patientname, request.patient.user.email],
                    // patient_name: patientName,
                    // patient_age: patientAge,
                    phlebotomist: request.phlebotomist ? [null, phlebotomistname, request.phlebotomist.user.email] : [null, phlebotomistname, "info@labtraca.com"],
                    package: testPackage ? testPackage.packageName : "single test",
                    test: test.name,
                    amount: facilityEarning,
                    status: status.toLowerCase(),
                    // ...rest,

                };

                return requestData
            }) || [];
            setOffset(offset + limit)
            setDataCount(testRequestsCount);
            // const uniqueRequestData = updatedtestRequestsData.filter(newRequest =>
            //     !cachedRequestData.current.some(cachedRequest => cachedRequest.id === newRequest.id)
            // );
            console.log("uniqueRequestData", updatedtestRequestsData)
            console.log("cachedRequestData", cachedRequestData.current)
            cachedRequestData.current = [...cachedRequestData.current, ...updatedtestRequestsData];
            console.log("cachedRequestData length", cachedRequestData.current.length)
            console.log("cachedRequestData", cachedRequestData.current)

        } catch (error) {
            console.error(`Error fetching  data:`, error);
        } finally {
            setLoading(false);
        }
    }, [user])

    
    const handleFetchNextPage = () => {
        
        const totalNeededData = limit * (currentPage + 1);
        const totalCachedData = cachedRequestData.current.length;
        if (totalCachedData >= totalNeededData) {
            return;
        }
        console.log("offsets", offsets)
        fetchData(offsets);
        // check if cachedRequestData.current has the data before making an api call
    }

    useEffect(() => {
        if (user) {
            fetchData(10);
        }
    }, [user, fetchData]); // Empty dependency array ensures this runs only once

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
                                        handleSearchData={() => { }}
                                        setItemToDelete={() => { }}
                                        deleteAction={() => { }}
                                        viewMoreAction={() => { }}
                                        tableHeadText={`Requests (${dataCount})` }
                                        approveAction={()=>{} }
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                        dataCount={dataCount}
                                        tableData={cachedRequestData.current} 
                                        searchBoxPosition='justify-end'
                                        showTableHeadDetails={false}
                                        showActions={true} 
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        changePage={handleFetchNextPage}
                                        testPage='requests'
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
