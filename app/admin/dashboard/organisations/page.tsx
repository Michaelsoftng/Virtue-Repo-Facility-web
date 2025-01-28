/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState } from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import TotalPatients from '@/src/reuseable/components/TotalPatients'
import { useGetUsersByType } from '@/src/hooks/useGetUsersByType'
import { PatientType } from '@/src/interface'
import NumberPreloader from '@/src/preLoaders/NumberPreloader'
import TablePreloader from '@/src/preLoaders/TablePreloader'
// import { PatientType } from '@/src/interface'

const Patients = () => {
    const { data, error, loading: organisatonDataLoading } = useGetUsersByType('organisation')
    const patientCount = data?.getUserByUserType?.usersCount
    const organisatonData = data?.getUserByUserType?.users as TableData[] 
    let name: string
    let status: string
    let verifiedUsers=0
    let newPatients = 0
    let unverifedPatients = 0
    // Check if organisatonData is available before mapping
    const updatedOrganisatonData = organisatonData?.map((singlePatient) => {
        
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
        } = singlePatient;

        if (emailVerifiedAt) {
            verifiedUsers += 1;
        } else {
            unverifedPatients += 1;
        }
        name = (firstName && lastName) ? `${firstName.trim()} ${lastName.trim()}` : 'Not Set'
        const status = emailVerifiedAt ? 'verified' : 'unverified'
        const organisationCity = city ? city : 'Not set'
        const organisationState = state ? state : 'Not set'
        const createdDate = new Date(createdAt);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        if (createdDate >= oneWeekAgo) {
            newPatients += 1;
        }
        	 
        const newOrganisatonData = {
            organisations: [null, name, singlePatient.email],
            id,
            // ...rest,
            phoneNumber: phoneNumber,
            name: organisation? organisation.organisationName : 'Not Set',	
            city: organisationCity,
            state: organisationState,
            status: status

        };
        
        return newOrganisatonData
    }) || []; // Default to an empty array if organisatonData is undefined
    

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
                    <BreadCrump pageWrapper="Dashboard" pageTitle="Patients" showExportRecord={true} />
                    <div className="px-8 py-4 ">
                        {organisatonDataLoading

                            ?
                            'loading'
                            :
                            <TotalPatients
                                loading={organisatonDataLoading}
                                totalusers={patientCount}
                                newUsers={newPatients}
                                verifiedUsers={verifiedUsers}
                                unverifedPatients={unverifedPatients}

                            />
                        }
                        {organisatonDataLoading

                            ?
                            <TablePreloader />
                            :
                            <AdminFacilitiesTable
                                currentPage={1}
                                setCurrentPage={() => { }}
                                deleteAction={() => { }}
                                approveAction={() => { }} 
                                setItemToDelete={() => { }}
                                tableHeadText='Organisations'
                                tableData={updatedOrganisatonData}
                                searchBoxPosition='justify-start'
                                showTableHeadDetails={true}
                                showPagination={true}
                                showActions={true}
                                testPage='organisations'
                                marginTop='mt-4'
                                changePage={() => { }}
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Patients
