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


const Tests = () => {
    const [pageLoading, setPageLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [offsets, setOffsets]  = useState<number>(0);
    const limit = 10;    
    const dataCount = useRef<number>(0);
    
    const testdata = useRef<TableData[]>([]);
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
                testdata.current = Array.from(
                        new Map(
                            [...testdata.current, ...allTests].map(item => [item.id, item]) // Use `id` to ensure uniqueness
                        ).values()
                    );
                dataCount.current = data.getAllTest.testCount;
                setOffsets(offset + limit)
                // offsets = limit + offsets;
            }

        } catch (err) {
            console.log('error fetching tests catch error', err);
        } finally {
            setPageLoading(false)
            // console.log("finally")
        }
    }, []);
    
    const handleFetchNextPage = () => {
        if (testdata.current.length < (limit * (currentPage + 1))) {
            fetchTests(limit, offsets); 
        }
        return; 
    }

    useEffect(() => {
        fetchTests(limit, 0);
    }, [fetchTests, limit]);

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
                                <p className="font-bold text-xl px-4 py-2 mr-2" >{dataCount.current } Available Tests</p>
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
                                    

                                    <AdminFacilitiesTable
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        approveAction={() => { }} 
                                        deleteAction={handleDeleteTest}
                                        setItemToDelete={setDeleteTestWithId}
                                        tableHeadText='Tests'
                                        dataCount={dataCount.current}
                                        tableData={testdata.current} 
                                        changePage={handleFetchNextPage}
                                        showActions={true}
                                        showPagination={true}
                                        
                                        testPage='tests'
                                        marginTop='mt-4'
                                    />
                                        
                                    
                                    
                            }
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tests
