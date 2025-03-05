/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import FacilityHeader from '@/src/reuseable/components/FacilityHeader'
import FacilityMenu from '@/src/reuseable/components/FacilityMenu'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import NewRequestTable from '@/src/partials/tables/NewRequesTable'
import { TableData } from '@/src/types/TableData.type'
import { useAuth } from '@/src/context/AuthContext'
import client from '@/lib/apolloClient';
import TablePreloader from '@/src/preLoaders/TablePreloader'
import { decodeJwtEncodedId } from '@/src/utils/decode'
import { CreateNewFacilityPackage  } from '@/src/interface'
import { CreateFacilityPackage,  DeleteFacilityPackage, UpdateFacilityPackage } from '@/src/graphql/mutations'
import { useMutation } from '@apollo/client'
import { toast } from 'react-toastify'
import { getAllPackages, getFacilityPackages, searchAllPackage } from '@/src/hooks/getAllPackages'
import { FacilityPackageData } from '@/src/reuseable/components/EditFacilityPackageModal'

const Requests = () => {
    const [packageWithId, setPackageWithId] = useState<string | null>(null)
    const [pageLoadingFromClick, setPageLoadingFromClick] = useState(false)
    const limit = 10;
    const { user } = useAuth()
    const [currentFacilityTestPage, setFacilityTestCurrentPage] = useState<number>(1);
    const [currentAvailablePage, setAvailableCurrentPage] = useState<number>(1);
    const [activeTab, setActiveTab] = useState<string>('facilityPackage')
    const [loading, setLoading] = useState(true)
    const [offsets, setOffsets] = useState<{ [key: string]: number }>({
        packages: 0,
        facilityPackages: 0,
    });

    const [dataCount, setDataCount] = useState<{ [key: string]: number }>({
        packages: 0,
        facilityPackages: 0
    });

    const data = useRef<{ [key: string]: TableData[] }>({
        packages: [],
        facilityPackages: []
    });

    const fetchFacilityPackages = useCallback(async (limit: number, offset: number) => {
        try {
            setLoading(true)
            const { data: testData, error, loading: testsDataLoading } = await getFacilityPackages(user?.facilityAdmin?.id as string, limit, offset);
            if (error) {
                toast.error('Error fetching tests from api');
                return;
            }
            
            if (testData && testData.getAllPackagesByFacility?.packages) {
                // Update the ref instead of state
                const facilitytests = testData.getAllPackagesByFacility?.packages as TableData[]
                
                const updateFacilityTestsData = facilitytests.map((facilitTest) => {
                    const {
                        id,
                        __typename,
                        package: testPackage,
                        facility,
                        price,
                        facilityPrice,
                        ...rest
                    } = facilitTest;

                    return {
                        id,
                        test_package: testPackage.packageName,
                        amount: facilityPrice,
                        ...rest,
                        status: 'published',
                    };
                }) || [];

                
                const allPackages = [...updateFacilityTestsData];
                if (data.current.facilityPackages.length === 0) {
                    console.log({ allPackages: allPackages })
                    data.current.facilityPackages = allPackages
                } else {
                    console.log({ facilityPackages: [...(data.current.facilityPackages || []), ...allPackages] })
                    data.current = {
                        ...data.current,
                        facilityPackages: Array.from(
                            new Map(
                                [...(data.current.facilityPackages || []), ...allPackages] // Ensure facilityPackages isn't undefined
                                    .map(item => [item.id, item]) // Deduplicate by id
                            ).values()),
                    };  
                }
                
                setDataCount((prevData) => ({
                    ...prevData,
                    facilityPackages: testData.getAllPackagesByFacility.packagesCount,
                }));

                setOffsets((prevOffsets) => ({
                    ...prevOffsets,
                    facilityPackages: offset + limit, // Update the key you want
                }));
            }

        } catch (err) {
            toast.error('A server error occurred! contact technical support')
        } finally {
            setLoading(false)
        }
    }, [user]);
    

    const fetchAvailablePackages = useCallback(async (limit: number, offset: number) => {
        try {
            setLoading(true)
            const { data:packageData, error, loading: testsDataLoading } = await getAllPackages(limit, offset);
            if (error) {
                console.log('Error fetching packages from api:', error);
                return;
            }
            console.log({ current: data.current.packages })
            if (!data.current.packages) {
                console.log("invalid ref for data.current")
            }

            if (packageData && packageData.getAllPackages?.packages) {
                // Update the ref instead of state
                const packages = packageData.getAllPackages?.packages as TableData[]
                const updateTestsData = packages.map((singlepackage) => {
                    const {
                        __typename,
                        id,
                        packageName,
                        percentageIncrease,
                        minimumIncrease,
                        createdAt,
                        ...rest
                    } = singlepackage;

                    const newTestData = {
                        id,
                        package_name: packageName,
                        ...rest,
                        percentage_increase: `${percentageIncrease}%`,
                        minimum_increase: minimumIncrease

                    };
                    return newTestData
                }) || [];

                const allTests = [...updateTestsData];
                
                data.current = {
                    ...data.current,
                    packages: Array.from(
                        new Map(
                            [...data.current.packages, ...allTests].map(item => [item.id, item]) // Use `id` to ensure uniqueness
                        ).values()
                    ),
                };
                setDataCount((prevData) => ({
                    ...prevData,
                    packages: packageData.getAllPackages.packagesCount,
                }));
                setOffsets((prevOffsets) => ({
                    ...prevOffsets,
                    packages: offset + limit, // Update the key you want
                }));
            }

        } catch (err) {
            console.log('error fetching packages catch error', err);
        } finally {
            setLoading(false)
        }
    }, []);


    const handleSearch = useCallback(async (searchTerm: string, limit: number, offset: number) => {
        try {
            setLoading(true)
            const { data, error, loading: testsDataLoading } = await searchAllPackage(searchTerm, limit, offset);
            if (error) {
                console.log('Error fetching tests from api:', error);
                return;
            }
            
            if (data && data.SearchPackages?.packages) {
                // Update the ref instead of state
                const tests = data.SearchPackages?.packages as TableData[]
                const updateTestsData = tests.map((testpackage) => {
                    const {
                        __typename,
                        id,
                        percentageIncrease,
                        minimumIncrease,
                        createdAt,
                        ...rest
                    } = testpackage;

                    const newTestData = {
                        id,
                        ...rest,
                        percentage_increase: `${percentageIncrease}%`,
                        minimum_increase: minimumIncrease

                    };
                    return newTestData
                }) || [];

                const allTests = [...updateTestsData];
                // reset test data to an empty array before filling it with search data
                if (offsets.packages === 0) {
                    data.current = {
                        ...data.current,
                        packages: [],
                    };
                }
                data.current = {
                    ...data.current,
                    packages: Array.from(
                        new Map(
                            [...data.current.packages, ...allTests].map(item => [item.id, item]) // Use `id` to ensure uniqueness
                        ).values()
                    ),
                };
                setDataCount((prevData) => ({
                    ...prevData,
                    packages: data.getAllPackages.packagesCount,
                }));
                setOffsets((prevOffsets) => ({
                    ...prevOffsets,
                    packages: offset + limit, // Update the key you want
                }));
            }

        } catch (err) {
            console.log('error fetching tests catch error', err);
        } finally {
            setLoading(false)
        }
    }, [offsets]);

    // const handleSearchData = (searchTerm: string) => {
    //     offsets.current = 0
    //     setSearchActive(true)
    //     setSearchTerm(searchTerm)
    //     handleSearch(searchTerm, limit, 0);
    // }



    const handleFetchNextPage = () => {
        if (data.current.test.length < (limit * (currentAvailablePage + 1))) {
            fetchAvailablePackages(limit, offsets.packages);
        }
        return;
    }


    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        if (tab === 'availablePackage') {
            if (data.current.packages.length < (limit * (currentAvailablePage))) {
                fetchAvailablePackages(limit, offsets.packages);
            }
            return;

        } else {
            if (data.current.facilityPackages.length < (limit * (currentAvailablePage))) {
                fetchFacilityPackages(limit, offsets.facilityPackages);
            }
            return;
        }

    };

    const handleFetchNextPageFacilityTest = () => {
        if (data.current.facilityPackages.length < (limit * (currentAvailablePage + 1))) {
            fetchFacilityPackages(limit, offsets.facilityPackages);
        }
        return;
    }


    const [addFacilityPackage] = useMutation(CreateFacilityPackage, {
        client,
    });

    const handleAddFacilityPackage = async (formData: CreateNewFacilityPackage) => {
        setPageLoadingFromClick(true);
        const { facility, facilityPrice, ...rest } = formData
        try {
            await addFacilityPackage({
                variables: {
                    ...rest,
                    price: facilityPrice,
                    facility: user?.facilityAdmin?.id as string
                },
                onCompleted(data) {
                    if (data.CreateFacilityPackageManual.error) {
                        toast.error(data.CreateFacilityPackageManual.error.message);
                    } else {
                        toast.success('Package added to facility successfully');
                    }

                },
                onError(error) {
                    toast.error(error.message);
                },
            });
        } catch (err) {
            console.error('Error adding package to facility:', err);
        } finally {
            setPageLoadingFromClick(false);

        }
    };


    const [updateTestData, { loading: updateTestLoading }] = useMutation(UpdateFacilityPackage, {
        client,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleUpdatePackage = async (testdata: FacilityPackageData) => {
        setPageLoadingFromClick(true)
        try {
            const { id, ...rest } = testdata;
            const { data } = await updateTestData({
                variables: {
                    facilityPackageID: testdata.facilityTest,
                    facility_price: testdata.facilityPrice
                },
                async onCompleted(data) {
                    if (data.UpdateFacilityPackage.facilityPackage) {
                        toast.success("you successsfully updated your facility Package");
                        window.location.reload();
                    } else {
                        toast.error(data?.UpdateFacilityPackage?.error?.message);
                    }

                },
                onError(e) {
                    toast.error(e.message);

                },
            });

        } catch (err) {
            console.error('Error editing Facility package:', err);
        } finally {
            setPageLoadingFromClick(false)

        }

    }


    const [deleteFacilityData, { loading: DeleteFacilityPackageLoading }] = useMutation(DeleteFacilityPackage, {
        client,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDeleteFacilityPackage = async () => {
        setPageLoadingFromClick(true)
        try {
            const { data } = await deleteFacilityData({
                variables: {
                    facilityPackage: packageWithId,
                    
                },
                async onCompleted(data) {
                    if (data.DeleteFacilityPackage.package.deletedStatus) {
                        toast.success("you successsfully deleted your facility Package");
                        window.location.reload();
                    } else if (!data.DeleteFacilityPackage.package.deletedStatus) {
                        toast.success(data.DeleteFacilityPackage.package.message);
                    } else {
                        toast.error(data?.DeleteFacilityPackage?.error?.message);
                    }

                },
                onError(e) {
                    toast.error(e.message);

                },
            });

        } catch (err) {
            console.error('Error editing Facility package:', err);
        } finally {
            setPageLoadingFromClick(false)

        }

    }


    useEffect(() => {
        if (user) {
            fetchFacilityPackages(limit, 0);
        }
    }, [fetchFacilityPackages, user]); // Empty dependency array ensures this runs only once

    return (
        <div>
            <FacilityHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <FacilityMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageTitle="Tests" showExportRecord={true} />

                    <div className="px-8 py-4">
                        <div className="mb-4">
                            <button className={`px-4 py-2 ${activeTab === 'facilityPackage' ? "bg-[#B2B7C2]" : "bg-[#b5b5b646] "}  w-[200px] mr-2 rounded`} onClick={() => handleTabClick('facilityPackage')}>Facility Packages</button>
                            <button className={`px-4 py-2 ${activeTab === 'availablePackage' ? "bg-[#B2B7C2]" : "bg-[#b5b5b646] "}  w-[200px] mr-2 rounded`} onClick={() => handleTabClick('availablePackage')}>Available Packages</button>

                        </div>
                        <div>
                            {activeTab === 'facilityPackage' ? (
                                loading ? (
                                    <TablePreloader />
                                ) : (
                                    <NewRequestTable
                                        tableHeadText={`Facility Packages (${dataCount.facilityPackages})`}
                                        approveAction={handleUpdatePackage}
                                        handleSearchData={() => { }}
                                        setItemToDelete={setPackageWithId}
                                        deleteAction={handleDeleteFacilityPackage}
                                        viewMoreAction={() => { }}
                                        pageHeader='Facility Packages '
                                        tableData={data.current.facilityPackages}
                                        searchBoxPosition='justify-start'
                                        showTableHeadDetails={true}
                                        showActions={true}
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                        testPage='facilityPackage'
                                        dataCount={dataCount.facilityPackages}
                                        currentPage={currentFacilityTestPage}
                                        setCurrentPage={setFacilityTestCurrentPage}
                                        changePage={handleFetchNextPageFacilityTest}


                                    />
                                ))

                                :
                                (
                                    loading ? (
                                        <TablePreloader />
                                    ) : (

                                        <NewRequestTable
                                            handleSearchData={() => { }}
                                            setItemToDelete={() => { }}
                                            deleteAction={() => { }}
                                            viewMoreAction={() => { }}
                                            tableHeadText={`Packages (${dataCount.packages})`}
                                            approveAction={handleAddFacilityPackage}
                                            facilityId={decodeJwtEncodedId(user?.id)}
                                            tableData={data.current.packages}
                                            searchBoxPosition='justify-start mt-3'
                                            showTableHeadDetails={true}
                                            showActions={true}
                                            activeTab={activeTab}
                                            setActiveTab={setActiveTab}
                                            testPage='availablePackage'
                                            dataCount={dataCount['packages']}
                                            currentPage={currentAvailablePage}
                                            setCurrentPage={setAvailableCurrentPage}
                                            changePage={handleFetchNextPage}
                                        />
                                    ))
                            }
                        </div>

                    </div>
                </div>
            </div>
            {
                pageLoadingFromClick &&
                <div className="flex items-center justify-center min-h-screen fixed w-full bg-[#ffffff54] top-0 left-0">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-green-500 border-green-200 rounded-full"></div>
                </div>
            }
        </div>
    )
}

export default Requests
