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

import TablePreloader from '@/src/preLoaders/TablePreloader'
import { useMutation } from '@apollo/client'
import { ApproveAccount, DeleteUser } from '@/src/graphql/mutations'
import client from '@/lib/apolloClient';
import { toast } from 'react-toastify';
import { useAuth } from '@/src/context/AuthContext'
import { decodeJwtEncodedId } from '@/src/utils/decode'


const Doctors = () => {
    const [pageLoadingFromClick, setPageLoadingFromClick] = useState(false)
    const { data, error, loading: staffDataLoading } = useGetUsersByType('doctor')
    const [staffWithId, setStafftWithId] = useState<string | null>(null) // id of staff to delete
    const { user } = useAuth()
    const Id = user?.id
    console.log("logged in user from staff", user?.id)
    const staffCount = data?.getUserByUserType?.usersCount
    const staffData = data?.getUserByUserType?.users as TableData[]

    let name: string
    let status: string
    let verifiedUsers = 0
    let newStaffs = 0
    let unverifedStaffs = 0

    // Check if StaffData is available before mapping
    const updatedStaffData = staffData?.map((singleStaff) => {

        const {
            __typename,
            approvalToken,
            approvedAt,
            facilityAdmin,
            doctor,
            phlebotomist,
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
            deletedAt,
            deletedBy,
            createdAt,
            ...rest
        } = singleStaff;

        if (emailVerifiedAt) {
            verifiedUsers += 1;
        } else {
            unverifedStaffs += 1;
        }
        name = (firstName && lastName) ? `${firstName} ${lastName}` : 'Not Set'
        const active = emailVerifiedAt ? 'verified' : 'unverified'
        const status = approvedAt ? 'approved' : 'pending approval'
        const patientCity = city ? city : 'Not set'
        const patientState = state ? state : 'Not set'
        const activity = deletedAt ? "deleted" : "active"
        const createdDate = new Date(createdAt);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        if (createdDate >= oneWeekAgo) {
            newStaffs += 1;
        }
        const newPatientData = {
            staff: [null, name, singleStaff.email],
            ...rest,
            city: patientCity,
            state: patientState,
            verified: active,
            status: status,
            is_active: activity,
            approved_at: approvedAt ? new Date(approvedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not approved'
        };

        return newPatientData
    }) || [];


    if (error) {
        console.log("error is saying true", error)
    }

    const [approveStaff, { loading: approveStaffLoading }] = useMutation(ApproveAccount, {
        variables: {
            userForApproval: staffWithId,
            approvingAdmin: decodeJwtEncodedId(user?.id as string),

        },
        client,
    });

    const handleApproveStaff = async () => {
        setPageLoadingFromClick(true)
        try {
            const { data } = await approveStaff({
                variables: {
                    userForApproval: staffWithId,
                    approvingAdmin: decodeJwtEncodedId(Id as string), // Pass decoded ID here
                },
                async onCompleted(data) {
                    if (data.ApproveAccount.success) {
                        toast.success(data?.ApproveAccount?.success?.message);
                        window.location.reload();
                    } else {
                        toast.error(data?.ApproveAccount?.errors?.message);
                    }

                },
                onError(e) {
                    toast.error(e.message);

                },
            });

        } catch (err) {
            console.error('Error approving account:', err);
        } finally {
            setPageLoadingFromClick(false)

        }

    }

    const [deleteStaff, { loading: deleteTestLoading }] = useMutation(DeleteUser, {
        variables: {
            id: staffWithId,

        },
        client,
    });

    const handleDeleteTest = async () => {
        console.log(staffWithId)
        setPageLoadingFromClick(true)
        try {
            const { data } = await deleteStaff({
                async onCompleted(data) {
                    console.log(data)
                    if (data.DeleteUser.deleted) {
                        toast.success(data.DeleteUser.deleted);
                        window.location.reload();
                    } else {
                        toast.error(data.DeleteUser.errors.message);
                    }

                },
                onError(e) {
                    toast.error(e.message);

                },
            });

        } catch (err) {
            console.error('Error deleting test:', err);
        } finally {
            setPageLoadingFromClick(false)

        }

    }



    return (
        <div>

            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageWrapper="Dashboard" pageTitle="Doctors" showExportRecord={true} />
                    <div className="px-8 py-4 ">
                        {staffDataLoading

                            ?
                            'loading'
                            :
                            <TotalPatients
                                loading={staffDataLoading}
                                totalusers={staffCount}
                                newUsers={newStaffs}
                                verifiedUsers={verifiedUsers}
                                unverifedPatients={unverifedStaffs}

                            />
                        }
                        {staffDataLoading

                            ?
                            <TablePreloader />
                            :
                            <AdminFacilitiesTable
                                deleteAction={handleDeleteTest}
                                approveAction={handleApproveStaff}
                                setItemToDelete={setStafftWithId}
                                tableHeadText='Requests'
                                tableData={updatedStaffData}
                                searchBoxPosition='justify-start'
                                showTableHeadDetails={true}
                                showPagination={true}
                                showActions={true}
                                testPage='staffs'
                                marginTop='mt-4'
                            />
                        }


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

export default Doctors
