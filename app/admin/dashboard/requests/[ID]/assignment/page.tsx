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
import { CreateAssignment, DeleteUser } from '@/src/graphql/mutations'
import client from '@/lib/apolloClient';
import { toast } from 'react-toastify';
import { useAuth } from '@/src/context/AuthContext'


const Phlebotomies = ({ params }: { params: { ID: string } }) => {
    const [activeTab, setActiveTab] = useState<string>("phlebotomist")
    const { ID } = params;
    const [pageLoadingFromClick, setPageLoadingFromClick] = useState(false)
    const { data, error, loading: phlebotomiesDataLoading } = useGetUsersByType('phlebotomist')
    const [phlebotomiesWithId, setPhlebotomiesWithId] = useState<string | null>(null) // id of phlebotomies to delete
    const phlebotomiesCount = data?.getUserByUserType?.usersCount
    const phlebotomiesData = data?.getUserByUserType?.users as TableData[]

    let name: string
    let status: string
    let verifiedUsers = 0
    let newPhlebotomiess = 0
    let unverifedPhlebotomiess = 0

    // Check if PhlebotomiesData is available before mapping
    const updatedPhlebotomiesData = phlebotomiesData?.map((singlePhlebotomies) => {

        const {
            __typename,
            approvalToken,
            approvedAt,
            facilityAdmin,
            doctor,
            staff,
            phlebotomist,
            phlebotomies,
            firstName,
            streetAddress,
            streetAddress2,
            lastName,
            email,
            patient,
            country,
            postal,
            city,
            referralBonus,
            referralCode,
            state,
            latitude,
            longitude,
            emailVerifiedAt,
            deletedAt,
            deletedBy,
            createdAt,
            ...rest
        } = singlePhlebotomies;
        console.log("the rest data ",{...rest})
        if (emailVerifiedAt) {
            verifiedUsers += 1;
        } else {
            unverifedPhlebotomiess += 1;
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
            newPhlebotomiess += 1;
        }
        const newPatientData = {
            phlebotomist: [null, name, singlePhlebotomies.email],
            ...rest,
            address: `${streetAddress} ${patientCity} ${patientState}`,
            verified: active,
            status: status,
            is_active: activity,
        };

        return newPatientData
    }) || [];


    if (error) {
        console.log("error is saying true", error)
    }

    const [assignPhlebotomies, { loading: assignPhlebotomiesLoading }] = useMutation(CreateAssignment, {
        client,
    });

    const handleAssignPhlebotomies = async () => {
        setPageLoadingFromClick(true)
        try {
            const { data } = await assignPhlebotomies({
                variables: {
                    assigned: phlebotomiesWithId,
                    assignmentDate: new Date().toISOString(),
                    taskType: 'REQUEST',
                    task: ID

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

    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageWrapper="Dashboard&nbsp;&nbsp;/&nbsp;&nbsp;Requests" pageTitle="Assign Phlebotomies" showExportRecord={true} />

                    <div className="px-8 py-4">
                        
                            {phlebotomiesDataLoading

                                ?
                                'loading'
                                :
                                <TotalPatients
                                    loading={phlebotomiesDataLoading}
                                    totalusers={phlebotomiesCount}
                                    newUsers={newPhlebotomiess}
                                    verifiedUsers={verifiedUsers}
                                    unverifedPatients={unverifedPhlebotomiess}
                                    type="phlebotomies"
                                />
                            }

                            {phlebotomiesDataLoading

                                ?
                                <TablePreloader />
                                :
                                <AdminFacilitiesTable
                                    deleteAction={() => {}}
                                    approveAction={handleAssignPhlebotomies}
                                    setItemToDelete={setPhlebotomiesWithId}
                                    tableHeadText=''
                                    tableData={updatedPhlebotomiesData}
                                    searchBoxPosition='justify-start'
                                    showTableHeadDetails={true}
                                    showActions={true}
                                    showPagination={false}
                                    testPage='assignPhlebotomist'
                                    marginTop='mt-4'
                            >
                                <div className="mx-4 mt-6 flex justify-between">
                                    <h2 className="text-[#0F1D40] font-bold text-xl">Phlebotomies { }</h2>

                                        {/* <Link href='tests/new' className="bg-[#08AC85] text-white py-2 px-3 flex justify-around text-[14px] rounded">
                                            <PlusIcon />
                                            <span >Add Test</span>
                                        </Link> */}
                                </div>
                            </AdminFacilitiesTable>
                            }
                      
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Phlebotomies
