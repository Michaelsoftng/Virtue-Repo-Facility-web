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
    const { data, error, loading: patientDataLoading } = useGetUsersByType('patient')
    const patientCount = data?.getUserByUserType?.usersCount
    const patientData = data?.getUserByUserType?.users as TableData[] 
    let name: string
    let status: string
    let verifiedUsers=0
    let newPatients = 0
    let unverifedPatients = 0
    // Check if patientData is available before mapping
    const updatedPatientData = patientData?.map((singlePatient) => {
        
        const {
            __typename,
            approvalToken,
            staff,
            firstName,
            streetAddress,
            streetAddress2,
            lastName,
            email,
            patient,
            country,
            postal,
            city,
            state,
            latitude,
            longitude,
            emailVerifiedAt,
            createdAt,
            ...rest
        } = singlePatient;

        if (emailVerifiedAt) {
            verifiedUsers += 1;
        } else {
            unverifedPatients += 1;
        }
        name = (firstName && lastName) ? `${firstName} ${lastName}` : 'Not Set'
        const status = emailVerifiedAt ? 'verified' : 'unverified'
        const patientCity = city ? city : 'Not set'
        const patientState = state ? state : 'Not set'
        const createdDate = new Date(createdAt);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        if (createdDate >= oneWeekAgo) {
            newPatients += 1;
        }
        const newPatientData = {
            patients: [null, name, singlePatient.email],
            ...rest,
            city: patientCity,
            state: patientState,
            status: status

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
                    <BreadCrump pageWrapper="Dashboard" pageTitle="Facilities" showExportRecord={true} />
                    <div className="px-8 py-4 ">
                        {patientDataLoading

                            ?
                            'loading'
                            :
                            <TotalPatients
                                loading={patientDataLoading}
                                totalusers={patientCount}
                                newUsers={newPatients}
                                verifiedUsers={verifiedUsers}
                                unverifedPatients={unverifedPatients}

                            />
                        }
                        {patientDataLoading

                            ?
                            <TablePreloader />
                            :
                            <AdminFacilitiesTable
                                deleteAction={() => { }}
                                setItemToDelete={() => { }}
                                tableHeadText='Requests'
                                tableData={updatedPatientData}
                                searchBoxPosition='justify-start'
                                showTableHeadDetails={true}
                                showPagination={true}
                                showActions={true}
                                testPage='patients'
                                marginTop='mt-4'
                            />
                        }
                        

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Patients
