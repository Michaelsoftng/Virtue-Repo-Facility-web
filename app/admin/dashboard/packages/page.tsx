/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import { PlusIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { getAllPackages } from '@/src/hooks/getAllPackages'
import { useMutation } from '@apollo/client'
import client from '@/lib/apolloClient';
import { DeletePackage } from '@/src/graphql/mutations';
import { toast } from 'react-toastify';
import TablePreloader from '@/src/preLoaders/TablePreloader'
import { useRouter } from 'next/navigation';
import NumberPreloader from '@/src/preLoaders/NumberPreloader'

const Packages = () => {
    const router = useRouter();
    const [pageLoading, setPageLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const offsets = useRef< number >(0);
    const dataCount = useRef<number>(0);
    const [packagedata, setPackageData] = useState<TableData[]>([]);
    const [deletePackageWithId, setDeletePackagetWithId] = useState<string | null>(null) // id of test to delete
    const [deletePackage, { loading: deletePackageLoading }] = useMutation(DeletePackage, {
        variables: {
            id: deletePackageWithId,
        },
        client,
    });
    const handleDeletePackage = async () => {
        setPageLoading(true)
        try {
            const { data } = await deletePackage({
                async onCompleted(data) {
                    if (data.DeletePackage.package.deletedStatus) {
                        toast.success(data?.DeletePackage?.package?.message);
                        window.location.reload();
                    } else {
                        toast.error(data?.DeletePackage?.package?.message);
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
            const { data, error, loading: testsDataLoading } = await getAllPackages(limit, offset);
            if (error) {
                console.log('Error fetching tests from api:', error);
                return;
            }
            if (!packagedata) {
                console.log("invalid ref for data.current")
            }
            if (data && data.getAllPackages?.packages) {
                // Update the ref instead of state
                const tests = data.getAllPackages?.packages as TableData[]
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
                setPackageData((prevData) => {
                    const newMap = new Map([...prevData, ...updateTestsData].map(item => [item.id, item]));
                    const updatedData = Array.from(newMap.values()); // Convert Map to array

                    return updatedData;
                });
                
                dataCount.current = data.getAllPackages.packagesCount,
                
                offsets.current = limit + offsets.current
            }

            console.log(packagedata)
        } catch (err) {
            console.log('error fetching tests catch error', err);
        } finally {
            setPageLoading(false)
            console.log("finally")
        }
    }, [packagedata]);

    const handleTabChange = (tab: string) => {
        fetchTests(10, offsets.current)
    }

    const handleFetchNextPage = () => {
        offsets.current = 10 + offsets.current
        // fetchTests(10, offsets.current); // Add this line to trigger the fetch
    }

    useEffect(() => {
        if (packagedata.length == 0) {
            fetchTests(10, 0);
        }
        console.log('packaged data', packagedata )
    }, [fetchTests, packagedata]);

    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageTitle="Tests" showExportRecord={false} />
                    <div className="px-8 py-4">
                        <div className="flex justify-between">
                            <div>
                                <p className="px-4 py-2 bg-[#B2B7C2] w-full mr-2" onClick={() => handleTabChange('tests')}>Tests Bundles {pageLoading ? <NumberPreloader /> : <>({dataCount.current})</>}</p>
                            </div>

                            <Link href='packages/new' className="bg-[#08AC85] text-white py-2 px-3 flex justify-around text-[14px] rounded">
                                <PlusIcon />
                                <span >Add Bundle Test</span>
                            </Link>
                        </div>

                        <div>
                            {
                                pageLoading
                                ?
                                <TablePreloader />
                                :
                                    <AdminFacilitiesTable
                                        handleSearchData={() => { }}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    approveAction={() => { }}
                                    deleteAction={handleDeletePackage}
                                    setItemToDelete={setDeletePackagetWithId}
                                    tableHeadText='Packages'
                                    dataCount={dataCount.current}
                                    tableData={packagedata}
                                    changePage={handleFetchNextPage}
                                    showActions={true}
                                    showPagination={true}
                                    testPage='packages'
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

export default memo(Packages)
