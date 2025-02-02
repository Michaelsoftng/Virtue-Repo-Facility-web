/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import { getUsersByType, useGetUsersByType } from '@/src/hooks/useGetUsersByType'
import TablePreloader from '@/src/preLoaders/TablePreloader'
import { useAuth } from '@/src/context/AuthContext'



const Facilities = () => {

    const [pageLoading, setPageLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [offsets, setOffsets]  = useState<number>(0);
    const limit = 10;    
    const dataCount = useRef<number>(0);
    const facilityData = useRef<TableData[]>([]);
    let verifiedUsers=0
    let newStaffs = 0
    let unverifedStaffs = 0
    

    const fetchFacilities = useCallback(async (limit: number, offset: number) => {
        try {
            setPageLoading(true)
            const { data, error, loading: staffsDataLoading } = await getUsersByType('facility_admin', limit, offset);
            if (error) {
                console.log('Error fetching users from api:', error);
                return;
            }
            if (data && data.getUserByUserType?.users) {
                // Update the ref instead of state
                const facilities = data.getUserByUserType?.users as TableData[]
                // Check if StaffData is available before mapping
                const updatedFacilityData = facilities?.map((singleFacility) => {

                    const {
                        id,
                        __typename,
                        approvalToken,
                        doctor,
                        phlebotomist,
                        approvedAt,
                        referralCode,
                        referralBonus,
                        staff,
                        patient,
                        firstName,
                        streetAddress,
                        streetAddress2,
                        lastName,
                        email,
                        country,
                        postal,
                        city,
                        state,
                        latitude,
                        longitude,
                        facilityAdmin,
                        emailVerifiedAt,
                        createdAt,
                        deletedAt,
                        deletedBy,
                        ...rest
                    } = singleFacility;


                    const status = emailVerifiedAt ? 'verified' : 'unverified'
                    const approval = approvedAt ? 'approved' : 'pending'
                    const facilityCity = city ? city : ''
                    const facilityAddress = streetAddress ? `${streetAddress} ${facilityCity}` : 'Not set'

                    const facilityState = state ? state : 'Not set'
                    const createdDate = new Date(createdAt);
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                    const newPatientData = {
                        id,
                        facility: facilityAdmin.facilityName,
                        type: facilityAdmin.facilityType.toLowerCase(),
                        email,
                        ...rest,
                        address: facilityAddress,
                        state: facilityState,
                        status: status,
                        approval: approval,
                    };

                    return newPatientData
                }) || []; // Default to an empty array if patientData is undefined




                const allFacilities = [...updatedFacilityData];
                facilityData.current = Array.from(
                    new Map(
                        [...facilityData.current, ...allFacilities].map(item => [item.id, item]) // Use `id` to ensure uniqueness
                    ).values()
                );
                dataCount.current = data.getUserByUserType.usersCount;
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
        if (facilityData.current.length < (limit * (currentPage + 1))) {
            fetchFacilities(limit, offsets); 
        }
        return;
        
    }

    useEffect(() => {
        fetchFacilities(limit, 0);
    }, [fetchFacilities, limit]);
    

    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageTitle="Facilities" showExportRecord={true} />
                    <div className="px-8 py-4">
                       
                        
                        {pageLoading

                            ?
                            <TablePreloader />
                            :
                            <AdminFacilitiesTable
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                tableHeadText={`${dataCount.current} Facilities`}
                                tableData={facilityData.current}
                                dataCount={dataCount.current}
                                changePage={handleFetchNextPage}
                                searchBoxPosition='justify-start'
                                showTableHeadDetails={true}
                                showActions={true}
                                deleteAction={() => { }}
                                approveAction={() => { }} 
                                setItemToDelete={() => { }}
                                showPagination={true}
                                // setActiveTab={setActiveTab}
                                testPage='facility'
                            />
                        }        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Facilities
