/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import TotalPatients from '@/src/reuseable/components/TotalPatients'
import { getUsersByType, SearchUsersByType, } from '@/src/hooks/useGetUsersByType'
import TablePreloader from '@/src/preLoaders/TablePreloader'
// import { PatientType } from '@/src/interface'

const Organisation = () => {
    const [pageLoading, setPageLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [offsets, setOffsets]  = useState<number>(0);
    const limit = 10;    
    const [searchActive, setSearchActive] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const dataCount = useRef<number>(0);
    const organisatonData = useRef<TableData[]>([]);
    const verifiedUsers = useRef<number>(0)
    const newStaffs = useRef<number>(0)
    const unverifedStaffs = useRef<number>(0)
    

    const fetchPatients = useCallback(async (limit: number, offset: number) => {
        try {
            setPageLoading(true)
            const { data, error, loading: testsDataLoading } = await getUsersByType('organisation', limit, offset);
            if (error) {
                console.log('Error fetching users from api:', error);
                return;
            }
            if (!organisatonData.current) {
                console.log("invalid ref for data.current")
            }
            if (data && data.getUserByUserType?.users) {
                
                const organisaton = data.getUserByUserType?.users as TableData[]
                const updatedOrganisatonData = organisaton?.map((singleOrganisation) => {

                    const {
                        __typename,
                        approvalToken,
                        doctor,
                        phlebotomist,
                        approvedAt,
                        facilityAdmin,
                        staff,
                        firstName,
                        phoneNumber,
                        streetAddress,
                        streetAddress2,
                        lastName,
                        email,
                        organisation,
                        country,
                        postal,
                        city,
                        state,
                        latitude,
                        longitude,
                        emailVerifiedAt,
                        createdAt,

                        id,
                        ...rest
                    } = singleOrganisation;

                    if (emailVerifiedAt) {
                        verifiedUsers.current += 1;
                    } else {
                        unverifedStaffs.current += 1;
                    }
                    const name = (firstName && lastName) ? `${firstName.trim()} ${lastName.trim()}` : 'Not Set'
                    const status = emailVerifiedAt ? 'verified' : 'unverified'
                    const organisationCity = city ? city : 'Not set'
                    const organisationState = state ? state : 'Not set'
                    const createdDate = new Date(createdAt);
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    if (createdDate >= oneWeekAgo) {
                        newStaffs.current += 1;
                    }

                    const newOrganisatonData = {
                        organisations: [null, name, singleOrganisation.email],
                        id,
                        // ...rest,
                        phoneNumber: phoneNumber,
                        name: organisation ? organisation.organisationName : 'Not Set',
                        city: organisationCity,
                        state: organisationState,
                        status: status

                    };

                    return newOrganisatonData
                }) || []; 

                const allTests = [...updatedOrganisatonData];
                organisatonData.current = Array.from(
                    new Map(
                        [...organisatonData.current, ...allTests].map(item => [item.id, item]) // Use `id` to ensure uniqueness
                    ).values()
                );
                dataCount.current = data.getUserByUserType.usersCount;
                setOffsets(offset + limit)
                
            }

        } catch (err) {
            console.log('error fetching tests catch error', err);
        } finally {
            setPageLoading(false)
            // console.log("finally")
        }
    }, []);

    const handleSearch = useCallback(async (searchTerm: string,  limit: number, offset: number) => {
            try {
                setPageLoading(true)
                const { data, error, loading: testsDataLoading } = await SearchUsersByType(searchTerm, 'organisation', limit, offset);
                
                if (error) {
                    console.log('Error fetching tests from api:', error);
                    return;
                }
                
                if (data && data.searchUsers?.users) {
                    // Update the ref instead of state
                    
                    const organisaton = data.searchUsers?.users as TableData[]
                    const updatedOrganisatonData = organisaton?.map((singleOrganisation) => {

                        const {
                            __typename,
                            approvalToken,
                            doctor,
                            phlebotomist,
                            approvedAt,
                            facilityAdmin,
                            staff,
                            firstName,
                            phoneNumber,
                            streetAddress,
                            streetAddress2,
                            lastName,
                            email,
                            organisation,
                            country,
                            postal,
                            city,
                            state,
                            latitude,
                            longitude,
                            emailVerifiedAt,
                            createdAt,

                            id,
                            ...rest
                        } = singleOrganisation;

                        if (emailVerifiedAt) {
                            verifiedUsers.current += 1;
                        } else {
                            unverifedStaffs.current += 1;
                        }
                        const name = (firstName && lastName) ? `${firstName.trim()} ${lastName.trim()}` : 'Not Set'
                        const status = emailVerifiedAt ? 'verified' : 'unverified'
                        const organisationCity = city ? city : 'Not set'
                        const organisationState = state ? state : 'Not set'
                        const createdDate = new Date(createdAt);
                        const oneWeekAgo = new Date();
                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                        if (createdDate >= oneWeekAgo) {
                            newStaffs.current += 1;
                        }

                        const newOrganisatonData = {
                            organisations: [null, name, singleOrganisation.email],
                            id,
                            // ...rest,
                            phoneNumber: phoneNumber,
                            name: organisation ? organisation.organisationName : 'Not Set',
                            city: organisationCity,
                            state: organisationState,
                            status: status

                        };

                        return newOrganisatonData
                    }) || []; // Default to an empty array if organisatonData is undefined


                    const allPatients = [...updatedOrganisatonData];
                    console.log(allPatients)
                    // reset test data to an empty array before filling it with search data
                    if (offset === 0) {
                        organisatonData.current=[]  
                    }
                    organisatonData.current = Array.from(
                        new Map(
                            [...organisatonData.current, ...allPatients].map(item => [item.id, item]) // Use `id` to ensure uniqueness
                        ).values()
                    );
                    dataCount.current = data.searchUsers.usersCount;
                    setOffsets(offset + limit)
                    // offsets = limit + offsets;
                }
    
            } catch (err) {
                console.log('error fetching tests catch error', err);
            } finally {
                setPageLoading(false)
            }
    }, []);
        
    const handleSearchData = (searchTerm: string) => {
        setOffsets(0)
        setSearchActive(true)
        setSearchTerm(searchTerm)
        handleSearch(searchTerm, limit, 0);
    }
    
    const handleFetchNextPage = () => {
        if (searchActive) {
            if (organisatonData.current.length < (limit * (currentPage + 1))) {
                handleSearch(searchTerm, limit, offsets);
            } 
        } else {
            if (organisatonData.current.length < (limit * (currentPage + 1))) {
                fetchPatients(limit, offsets);
            }
            return;
        }
    }
        
    useEffect(() => {
        fetchPatients(limit, 0);
    }, [fetchPatients, limit]);

    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageWrapper="Dashboard" pageTitle="Patients" showExportRecord={true} />
                    <div className="px-8 py-4 ">
                        {pageLoading

                            ?
                            'loading...'
                            :
                            <TotalPatients
                                loading={pageLoading}
                                totalusers={dataCount.current}
                                newUsers={newStaffs.current}
                                verifiedUsers={verifiedUsers.current}
                                unverifedPatients={unverifedStaffs.current}

                            />
                        }
                        {pageLoading

                            ?
                            <TablePreloader />
                            :
                            <AdminFacilitiesTable
                                handleSearchData={handleSearchData}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                deleteAction={() => { }}
                                approveAction={() => { }} 
                                setItemToDelete={() => { }}
                                tableHeadText={`Organisations ${dataCount.current}`}
                                tableData={organisatonData.current}
                                dataCount={dataCount.current}
                                searchBoxPosition='justify-start'
                                showTableHeadDetails={true}
                                showPagination={true}
                                showActions={true}
                                testPage='organisations'
                                marginTop='mt-4'
                                changePage={handleFetchNextPage}
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Organisation
