/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import TotalPatients from '@/src/reuseable/components/TotalPatients'
import { getUsersByType, useGetUsersByType } from '@/src/hooks/useGetUsersByType'
import { PatientType } from '@/src/interface'
import NumberPreloader from '@/src/preLoaders/NumberPreloader'
import TablePreloader from '@/src/preLoaders/TablePreloader'
// import { PatientType } from '@/src/interface'

const Patients = () => {
    const [pageLoading, setPageLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [offsets, setOffsets]  = useState<number>(0);
    const limit = 10;    
    const dataCount = useRef<number>(0);
    const patientData = useRef<TableData[]>([]);
    const verifiedUsers = useRef<number>(0)
    const newStaffs = useRef<number>(0)
    const unverifedStaffs = useRef<number>(0)
    

    const fetchPatients = useCallback(async (limit: number, offset: number) => {
        try {
            setPageLoading(true)
            const { data, error, loading: testsDataLoading } = await getUsersByType('patient', limit, offset);
            if (error) {
                console.log('Error fetching users from api:', error);
                return;
            }
            if (!patientData.current) {
                console.log("invalid ref for data.current")
            }
            if (data && data.getUserByUserType?.users) {
                // Update the ref instead of state
                const patients = data.getUserByUserType?.users as TableData[]
                const updatedPatientData = patients?.map((singlePatient) => {

                    const {
                        __typename,
                        id,
                        approvalToken,
                        doctor,
                        phlebotomist,
                        approvedAt,
                        facilityAdmin,
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
                        verifiedUsers.current += 1;
                    } else {
                        unverifedStaffs.current += 1;
                    }
                    const name = (firstName && lastName) ? `${firstName.trim()} ${lastName.trim()}` : 'Not Set'
                    const status = emailVerifiedAt ? 'verified' : 'unverified'
                    const patientCity = city ? city : 'Not set'
                    const patientState = state ? state : 'Not set'
                    const createdDate = new Date(createdAt);
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    if (createdDate >= oneWeekAgo) {
                        newStaffs.current += 1;
                    }
                    const newPatientData = {
                        id,
                        patients: [null, name, singlePatient.email],
                        ...rest,
                        dob: patient.date_of_birth,
                        gender: patient.gender ? patient.gender.toLowerCase() : '',
                        city: patientCity,
                        state: patientState,
                        status: status

                    };

                    return newPatientData
                }) || []; // Default to an empty array if patientData is undefined


                const allTests = [...updatedPatientData];
                patientData.current = Array.from(
                    new Map(
                        [...patientData.current, ...allTests].map(item => [item.id, item]) // Use `id` to ensure uniqueness
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
        if (patientData.current.length < (limit * (currentPage + 1))) {
            fetchPatients(limit, offsets); 
        }
        return;
        
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
                            'loading'
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
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                deleteAction={() => { }}
                                approveAction={() => { }} 
                                setItemToDelete={() => { }}
                                dataCount={dataCount.current}
                                tableHeadText={`Patients ${dataCount.current}`}
                                tableData={patientData.current}
                                searchBoxPosition='justify-start'
                                showTableHeadDetails={true}
                                showPagination={true}
                                showActions={true}
                                testPage='patients'
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

export default Patients
