/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState } from 'react'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import { useGetUsersByType } from '@/src/hooks/useGetUsersByType'
import TablePreloader from '@/src/preLoaders/TablePreloader'



const Facilities = () => {
    const { data, error, loading: facilityDataLoading } = useGetUsersByType('facility_admin')
    const facilityCount = data?.getUserByUserType?.usersCount
    const facilityData = data?.getUserByUserType?.users as TableData[] 
    const [activeTab, setActiveTab] = useState<string>('facilityTest')

    // Check if patientData is available before mapping
    const updatedFacilityData = facilityData?.map((singlePatient) => {

        const {
            __typename,
            approvalToken,
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
            ...rest
        } = singlePatient;

        
        const status = emailVerifiedAt ? 'verified' : 'unverified'
        const approval = approvedAt ? 'approved' : 'pending'
        const facilityCity = city ? city : ''
        const facilityAddress = streetAddress ? `${streetAddress} ${facilityCity}` : 'Not set'
        
        const facilityState = state ? state : 'Not set'
        const createdDate = new Date(createdAt);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
       
        const newPatientData = {
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


    if (error) {
        console.log("error is saying true", error)
        // logout()
    }
    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageTitle="Facilities" showExportRecord={true} />
                    <div className="px-8 py-4">
                       
                        
                        {facilityDataLoading

                            ?
                            <TablePreloader />
                            :
                            <AdminFacilitiesTable
                                tableHeadText={`${facilityCount} Facilities`}
                                tableData={updatedFacilityData}
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
