/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState } from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import TotalPatients from '@/src/reuseable/components/TotalPatients'
import { useGetPhlebotomistByProximity } from '@/src/hooks/useGetPhlebotomistByProximity'
import TablePreloader from '@/src/preLoaders/TablePreloader'
import { useMutation } from '@apollo/client'
import { CreateAssignment, DeleteUser } from '@/src/graphql/mutations'
import client from '@/lib/apolloClient';
import { toast } from 'react-toastify';
import Loading from '../../../loading'

const Phlebotomies = ({ params }: { params: { ID: string } }) => {
    const { ID } = params;
    const [pageLoadingFromClick, setPageLoadingFromClick] = useState(false)
    const { data, error, loading: phlebotomiesDataLoading } = useGetPhlebotomistByProximity(ID)
    const [phlebotomiesWithId, setPhlebotomiesWithId] = useState<string | null>(null)
    const phlebotomiesCount = data?.getPhlebotomistByProximity?.usersCount
    const phlebotomiesData = data?.getPhlebotomistByProximity?.users as TableData[]

    let name: string
    let verifiedUsers = 0
    let newPhlebotomiess = 0
    let unverifedPhlebotomiess = 0

    // Check if PhlebotomiesData is available before mapping
    const updatedPhlebotomiesData = phlebotomiesData?.map((singlePhlebotomies) => {
        const {
            id,
            __typename,
            distance,
            logisticsEstimate,
            user,
            deletedAt,
            deletedBy,
            createdAt,
            ...rest
        } = singlePhlebotomies;
        console.log("the rest data ",{...rest})
        if (user.emailVerifiedAt) {
            verifiedUsers += 1;
        } else {
            unverifedPhlebotomiess += 1;
        }
        name = (user.firstName && user.lastName) ? `${user.firstName} ${user.lastName}` : 'Not Set'
        const active = user.emailVerifiedAt ? 'verified' : 'unverified'
        const status = user.approvedAt ? 'approved' : 'pending approval'
        const patientCity = user.city ? user.city : 'Not set'
        const patientState = user.state ? user.state : 'Not set'
        const activity = deletedAt ? "deleted" : "active"
        const createdDate = new Date(createdAt);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        if (createdDate >= oneWeekAgo) {
            newPhlebotomiess += 1;
        }
        const newPatientData = {
            id: id,
            phlebotomist: [null, name, user.email],
            ...rest,
            address: `${user.streetAddress} ${patientCity} ${patientState}`,
            distance: `${distance}km`,
            logistics_estimate: logisticsEstimate,
            verified: active,
            status: status,
            is_active: activity,
            userTypeId: id,
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
                    if (data.CreateAssignment.errors) {
                        toast.error(data?.CreateAssignment?.errors?.message);
                    } else {
                        toast.success(data?.CreateAssignment?.success?.message);
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
    if (assignPhlebotomiesLoading || phlebotomiesDataLoading) {
        return <Loading />
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
                                currentPage={1}
                                setCurrentPage={() => { }}
                                deleteAction={() => {}}
                                changePage={() => { }}
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
