/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useEffect, useRef, useState } from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import { useGetAllResultTemplates } from '@/src/hooks/useGetAllResultTemplates'
import TablePreloader from '@/src/preLoaders/TablePreloader'
import ResultTemplate from '@/src/reuseable/components/ResultTemplate'
import Link from 'next/link'
import Loading from '@/app/admin/dashboard/loading'
import FacilityHeader from '@/src/reuseable/components/FacilityHeader'
import FacilityMenu from '@/src/reuseable/components/FacilityMenu'

const Templates = () => {
    const [pageLoading, setPageLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [offset, setOffset] = useState(0)
    const { data, error, loading: templatesDataLoading } = useGetAllResultTemplates(10, offset)
    const templatesCount = data?.getAllResultTemplate.templatesCount
    const templatesData = data?.getAllResultTemplate.templates as TableData[]
    const [deleteRequestWithId, setDeleteRequestWithId] = useState<string | null>(null)
    const cachedTemplatesData = useRef<TableData[]>([])
    
    const updatedTemplatesData = templatesData?.map((request) => {
        const {
            __typename,
            id,
            name,
            templateFields,
            ...rest
        } = request;
        const newTemplatesData = {
            id,
            name,
            templateFields: templateFields,
            ...rest,
        };  

        return newTemplatesData
    }) || [];

    const uniqueTemplatesData = updatedTemplatesData.filter(newRequest =>
        !cachedTemplatesData.current.some(cachedRequest => cachedRequest.id === newRequest.id)
    );

    cachedTemplatesData.current = [...cachedTemplatesData.current, ...uniqueTemplatesData];

    const handleFetchNextPage = () => {
        setOffset(offset + 10)
    }

    if (pageLoading ) {
        return <Loading />;
    }
    return (
        <div>
            <FacilityHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <FacilityMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageTitle="Templates" showExportRecord={false} />
                    <div className="px-8 py-4">
                        <div className=" grid grid-cols-[70%_30%] mb-6">
                            <div className="flex justify-center">
                                <h2 className="max-w-fit font-bold border-b-2  border-black text-xl">Select a template for this result</h2>
                            </div>
                            <div>
                                <input type="search" className="border-1 border-x-green-300 py-1 w-[300px] px-2" placeholder='search templates' />
                                <button className="bg-green-700 text-white px-4 py-1">Go</button>
                            </div>
                            
                        </div>
                    
                        <div className="grid grid-cols-3 gap-x-2 gap-y-4">
                            {
                                cachedTemplatesData.current.map((template, index) => (
                                    <div key={index}>
                                        <div className="text-center font-bold text-sm uppercase">{template.name}</div>
                                        <Link href={`templates/${template.id}`}>
                                            <ResultTemplate
                                                name={template.name}
                                                template={template.templateFields}
                                            />
                                        </Link>
                                    </div>
                                ))
                            }
                            
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
                            templatesDataLoading
                                ?
                                <TablePreloader />

                                :
                                div
    
                                <AdminFacilitiesTable
                                    tableHeadText={`Templates (${templatesCount})`}
                                    dataCount={templatesCount}
                                    tableData={cachedTemplatesData.current}
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
