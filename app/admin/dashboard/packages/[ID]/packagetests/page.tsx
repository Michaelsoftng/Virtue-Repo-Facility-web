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
import { CreateTestPackage } from '@/src/graphql/mutations';
import { toast } from 'react-toastify';
import TablePreloader from '@/src/preLoaders/TablePreloader'
import { useRouter } from 'next/navigation';

const PackageTests = ({ params }: { params: { ID: string } }) => {
    const { ID } = params;
    const [pageLoading, setPageLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const offsets = useRef<number >(0);
    const dataCount = useRef<number>(0);
    const testdata = useRef<TableData[]>([]);
    const router = useRouter();
    const [testWithId, setTestWithId] = useState<string | null>(null) // id of test to delete from package
    const [createTestPackage, { loading: createTestPackagetLoading }] = useMutation(CreateTestPackage, {
        client,
    });

    const handleCreateTestPackage = async (test: string) => {
        setPageLoading(true)
        try {
            const { data } = await createTestPackage({
                variables: {
                    package: ID,
                    test

                },
                async onCompleted(data) {
                    console.log(data)
                    if (data.CreateTestPackage.testPackage) {
                        toast.success('you added a test to a test package');
                        router.push(`/admin/dashboard/packages/${ID}`);
                    } else {
                        toast.error(data.CreateTestPackage.error.message);
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

    const [deleteTestFromPackage, { loading: deleteTestPackagetLoading }] = useMutation(CreateTestPackage, {
        client,
    });

    const handleDeleteTestFromPackage = async (test: string) => {
        setPageLoading(true)
        try {
            const { data } = await deleteTestFromPackage({
                variables: {
                    package: ID,
                    test

                },
                async onCompleted(data) {
                    console.log(data)
                    if (data.CreateTestPackage.testPackage) {
                        toast.success('you added a test to a test package');
                        router.push(`/admin/dashboard/packages/${ID}`);
                    } else {
                        toast.error(data.CreateTestPackage.error.message);
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
                return;
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

                    };
                    return newTestData
                }) || [];

                const allTests = [...updateTestsData];
                testdata.current =Array.from(
                        new Map(
                            [...testdata.current, ...allTests].map(item => [item.id, item]) // Use `id` to ensure uniqueness
                        ).values()
                    );
                dataCount.current = data.getAllTest.testCount;
                offsets.current = limit + offsets.current;
            }
        } catch (err) {
            console.log('error fetching tests catch error', err);
        } finally {
            setPageLoading(false)
            console.log("finally")
        }
    }, []);
    
    const handleFetchNextPage = () => {
        offsets.current = 10 + offsets.current ;
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
                                    (

                                        <AdminFacilitiesTable
                                            currentPage={currentPage}
                                            setCurrentPage={setCurrentPage}
                                            approveAction={handleCreateTestPackage} 
                                            deleteAction={() => { }}
                                            setItemToDelete={setTestWithId}
                                            tableHeadText='Tests'
                                            dataCount={dataCount.current}
                                            tableData={testdata.current} 
                                            changePage={handleFetchNextPage}
                                            showActions={true}
                                            showPagination={true}
                                            
                                            testPage='packagetests'
                                            marginTop='mt-4'
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

export default PackageTests
