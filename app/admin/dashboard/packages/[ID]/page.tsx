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
import client from '@/lib/apolloClient';
import { GetPackageById } from '@/src/graphql/queries';
import { getFacilityTests, useGetAvailableTestByFacility } from '@/src/hooks/useGetAvailableTestByFacility'
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@apollo/client'
import { useRouter } from 'next/navigation';
import Approval from '@/src/reuseable/components/Approval'
import Loading from '../../loading'
import TablePreloader from '@/src/preLoaders/TablePreloader'
import NumberPreloader from '@/src/preLoaders/NumberPreloader'
import { DeleteTestPackage } from '@/src/graphql/mutations'



const Package = ({ params }: { params: { ID: string } }) => {
    const { ID } = params;
    const [pageRemovingLoading, setPageRemovingLoading] = useState(false)
    const [deleteTestWithId, setDeleteTestWithId] = useState <string | null>(null) // id of test to delete
    const { data: packageData, loading: pageLoading } = useQuery(GetPackageById, {
        variables: {
            id: ID
        },
        client,
    });
    const tests = packageData?.getPackageById?.tests as TableData[]
    const updatedTestData = tests?.map((singleTest) => {

        const {
            __typename,
            id,
            name,
            code,
            description,
            minimumIncrease,
            percentageIncrease,
            createdAt,
            deletedAt,
            ...rest
        } = singleTest;

        const newTestData = {
            id,
            test_name: name,
            code,
            test_description: description,
            ...rest,
            
        };

        return newTestData
    }) || []; // Default to an empty array if patientData is undefined

    const facilities = packageData?.getPackageById?.facilityPackages?.facility as TableData[]
    const updatedFacilityData = facilities?.map((singleFacility) => {

        const {
            __typename,
            id,
            facilityName,
            facilityType,
            user,
            createdAt,
            deletedAt,
            ...rest
        } = singleFacility;


        const facilityCity = user.city ? user.city : ''
        const facilityAddress = user.streetAddress ? `${user.streetAddress} ${facilityCity}` : 'Not set'

        const facilityState = user.state ? user.state : 'Not set'


        const newFacilityData = {
            facility_name: facilityName,
            type: facilityType.toLowerCase(),
            email: user.email,
            ...rest,
            address: facilityAddress,
            state: facilityState,
        };

        return newFacilityData
    }) || []; // Default to an empty array if patientData is undefined

    const [deleteTest, { loading: deleteTestLoading }] = useMutation(DeleteTestPackage, {
        client,
    });

    const handleDeleteTest = async () => {
        setPageRemovingLoading(deleteTestLoading)
        try {
            const { data } = await deleteTest({
                variables: {
                    test: deleteTestWithId,
                    package: ID
                },
                async onCompleted(data) {
                    if (data.DeleteTestPackage.testPackage.deletedStatus) {
                        toast.success(data?.DeleteTestPackage?.testPackage?.message);
                        window.location.reload();
                    } else {
                        toast.error(data?.DeleteTestPackage?.testPackage?.message);
                    }

                },
                onError(e) {
                    toast.error(e.message);

                },
            }); 

        } catch (err) {
            console.error('Error deleting test from package:', err);
        } finally {
            setPageRemovingLoading(false)

        }
       
    }




    if (pageLoading) {
        return <Loading />;
    }
    

    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageWrapper="Dashboard &nbsp;&nbsp;/&nbsp;&nbsp;Packages" pageTitle={packageData.getPackageById.packageName} showExportRecord={false} />
                    <div className="px-8 py-4">
                        <div className="flex justify-between">
                            <div className="shadow-md bg-white px-8 py-4 flex gap-6 rounded-md">
                                <div className="bg-green-100 h-[50px] px-4 py-4 flex items-center justify-center mt-5">
                                    <RequestIcon fill='#08AD85' stroke='#08AD85' />
                                </div>
                                <div className="">
                                    <h2 className="text-[#8C93A3] mt-3">Total Available Facilities </h2>
                                    {
                                        pageLoading ?
                                        <NumberPreloader />
                                        :
                                            <p className="font-bold text-3xl  mt-3">{packageData.getPackageById.facilitesCount}</p>

                                    }
                                </div>
                            </div>
                            <div className="shadow-md bg-white px-8 py-4 flex gap-6 rounded-md">
                                <div className="bg-green-100 h-[50px] px-4 py-4 flex items-center justify-center mt-5">
                                    <RequestIcon fill='#08AD85' stroke='#08AD85' />
                                </div>
                                <div className="">
                                    <h2 className="text-[#8C93A3] mt-3">Total Available Tests</h2>
                                    {
                                        pageLoading ?
                                            <NumberPreloader />
                                            :
                                            <p className="font-bold text-3xl  mt-3">{packageData.getPackageById.testCount}</p>

                                    }
                                </div>
                            </div>

                            <div className="shadow-md bg-white px-4 py-4 gap-14 w-[23rem]  rounded-md">
                                <h2 className="text-[#8C93A3] font-[600] text-lg text-center mt-2">Current Rating</h2>
                                <p className="flex justify-center text-center w-full mt-4 space-x-1"> <span className="text-black font-bold text-[36px] leading-none ">4.5</span> <BiSolidStar className="text-[#F9CB57] text-4xl" /></p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <AdminFacilitiesTable
                                handleSearchData={() => { }}
                                currentPage={1}
                                setCurrentPage={() => { }}
                                approveAction={() => { }}
                                changePage={() => { }}
                                tableHeadText=''
                                tableData={updatedTestData}
                                searchBoxPosition='hidden'
                                showTableHeadDetails={false}
                                showActions={true}
                                deleteAction={handleDeleteTest}
                                setItemToDelete={setDeleteTestWithId}
                                showPagination={false}
                                testPage='testinpackages'
                            >
                                <div className="flex justify-between px-3 py-3">
                                    <div>
                                        <p className="font-bold text-xl ml-2" >{packageData.getPackageById.testCount} Test in this package</p>
                                    </div>

                                    <Link href={`${ID}/packagetests`} className="bg-[#08AC85] text-white py-2 px-3 flex justify-around text-[14px] rounded">
                                        <span className="mt-[2px]"><PlusIcon /></span>
                                        &nbsp;<span >Add Test to package</span>
                                    </Link>
                                </div>
                            </AdminFacilitiesTable>
                            
                        </div>
                        {
                            pageLoading

                                ?
                                <TablePreloader />
                                :
                                <AdminFacilitiesTable
                                    handleSearchData={() => { }}
                                    currentPage={1}
                                    setCurrentPage={() => { }}
                                    marginTop={'mt-6'}
                                    approveAction={() => { }}
                                    changePage={() => { }}
                                    tableHeadText='53 Facilities'
                                    tableData={updatedFacilityData}
                                    searchBoxPosition='justify-start'
                                    showTableHeadDetails={false}
                                    showActions={true}
                                    deleteAction={() => { }}
                                    setItemToDelete={() => { }}
                                    showPagination={false}
                                    testPage='singleFacility'
                                >


                                    <div className="mx-4 mt-6 pt-4 flex justify-between">
                                        <h2 className="text-[#0F1D40] font-bold text-xl">Available Facilities</h2>
                                    </div>
                                </AdminFacilitiesTable>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Package
