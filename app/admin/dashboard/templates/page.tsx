/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useEffect, useRef, useState } from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import { useGetAllRequest } from '@/src/hooks/useGetAllRequest'
import TablePreloader from '@/src/preLoaders/TablePreloader'
import ResultTemplate from '@/src/reuseable/components/ResultTemplate'
import Link from 'next/link'

const Templates = () => {
    const [pageLoading, setPageLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [offset, setOffset] = useState(0)
    const { data, error, loading: requestDataLoading } = useGetAllRequest(10, offset)
    const requestCount = data?.getAllRequests.requestsCount
    const requestData = data?.getAllRequests.requests as TableData[]
    const [deleteRequestWithId, setDeleteRequestWithId] = useState<string | null>(null)
    const cachedRequestData = useRef<TableData[]>([])

    const updatedRequestData = requestData?.map((request) => {
        const {
            __typename,
            requestDate,
            patient,
            phlebotomist,
            tests,
            payment,
            testRequest,
            facility,
            package: packageData,
            samplePickUpAddress,
            requestStatus,
            sampleStatus,
            isPaid,
            balance,
            total,
            sampleCollectionDate,
            samepleDropOffDate,
            createdAt,
            id,
            ...rest
        } = request;
        const patientname = (patient.user.firstName) ? `${patient.user.firstName} ${patient.user.lastName}` : 'Not Set'
        const phlebotomistname = (phlebotomist && phlebotomist.user.firstName) ? `${phlebotomist.user.firstName} ${phlebotomist.user.lastName}` : 'Not Set'
        const newRequestData = {
            patients: [null, patientname, patient.user.email],
            address: `${patient.user.city} ${patient.user.state}`,
            // test: `${tests.length} tests`,
            amount: total,
            paid: total - balance,
            balance: balance ? balance : 0,
            phlebotomist: phlebotomist ? [null, phlebotomistname, phlebotomist.user.email] : [null, phlebotomistname, "info@labtraca.com"],
            // address: samplePickUpAddress,
            requestDate: requestDate,
            sample_status: sampleStatus,
            status: requestStatus,
            id,
            ...rest,

        };

        return newRequestData
    }) || [];

    const uniqueRequestData = updatedRequestData.filter(newRequest =>
        !cachedRequestData.current.some(cachedRequest => cachedRequest.id === newRequest.id)
    );

    cachedRequestData.current = [...cachedRequestData.current, ...uniqueRequestData];

    const handleFetchNextPage = () => {
        setOffset(offset + 10)
    }


    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageTitle="Templates" showExportRecord={false} />
                    <div className="px-8 py-4">
                        <div className="flex justify-end mb-4">
                            <div className="bg-green-700 text-white px-4 py-2 rounded"><Link href='templates/new'>Create Template</Link></div>
                        </div>
                    
                        <div className="grid grid-cols-3 gap-x-2 gap-y-4">
                            <div>
                                <div className="text-center font-bold text-sm">CHEMICAL PATHOLOGY</div>
                                <Link href='templates/2335467890'><ResultTemplate /></Link>
                            </div>
                            
                            <div>
                                <div className="text-center font-bold text-sm">CHEMICAL PATHOLOGY</div>
                                <Link href='2335467890'><ResultTemplate /></Link>
                            </div>
                            <div>
                                <div className="text-center font-bold text-sm">CHEMICAL PATHOLOGY</div>
                                <Link href='2335467890'><ResultTemplate /></Link>
                            </div>
                           
                        </div>
                        <div className="flex justify-between mt-4 w-full">
                            <button
                                onClick={() => {}}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-[#b5b5b6] text-[#b5b5b6]"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => { }}
                                disabled={currentPage === 5}
                                className="px-5 py-1 border border-[#6b6a6a] text-[#6b6a6a]"
                            >
                                Next
                            </button>
                        </div>
                        {/* {
                            requestDataLoading
                                ?
                                <TablePreloader />

                                :
                                div
    
                                <AdminFacilitiesTable
                                    tableHeadText={`Templates (${requestCount})`}
                                    dataCount={requestCount}
                                    tableData={cachedRequestData.current}
                                    searchBoxPosition='justify-start'
                                    showTableHeadDetails={true}
                                    showActions={true}
                                    deleteAction={() => { }}
                                    approveAction={() => { }}
                                    setItemToDelete={() => { }}
                                    showPagination={true}
                                    testPage='requests'
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    changePage={handleFetchNextPage}
                                />
                        } */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Templates
