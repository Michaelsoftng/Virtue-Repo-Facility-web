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
import { useMutation } from '@apollo/client'
import { ApproveAccount, DeleteUser } from '@/src/graphql/mutations'
import client from '@/lib/apolloClient';
import { toast } from 'react-toastify';
import { useAuth } from '@/src/context/AuthContext'
import { decodeJwtEncodedId } from '@/src/utils/decode'



const Phlebotomies = () => {
    const [activeTab, setActiveTab] = useState<string>("phlebotomist")

    const [pageLoadingFromClick, setPageLoadingFromClick] = useState(false)
    const { data, error, loading: staffDataLoading } = useGetUsersByType('phlebotomist')
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
                    <BreadCrump pageWrapper="Dashboard" pageTitle="Phlebotomies" showExportRecord={true} />

                    <div className="px-8 py-4">
                        <div className="mb-4">
                            <button className="px-4 py-2 bg-[#B2B7C2] w-[200px] mr-2 rounded" onClick={() => setActiveTab('phlebotomist')}>Phlebotomist</button>
                            <button className="px-4 py-2 bg-[#b5b5b646] w-[200px] mr-2 rounded" onClick={() => setActiveTab('audit')}>Audit</button>
                            <button className="px-4 py-2 bg-[#b5b5b646] w-[200px] rounded" onClick={() => setActiveTab('assignment')}>assignment</button>

                        </div>
                        <div className="">
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
                                    type="phlebotomies"
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
                                    tableHeadText=''
                                    tableData={updatedStaffData}
                                    searchBoxPosition='justify-start'
                                    showTableHeadDetails={true}
                                    showActions={true}
                                    showPagination={false}
                                    testPage='phlebotomies'
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

export default Phlebotomies
