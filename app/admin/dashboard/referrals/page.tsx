/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState } from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import { useGetUnpaidConsultation } from '@/src/hooks/useGetUnpaidConsultation'
import TablePreloader from '@/src/preLoaders/TablePreloader'
import { useMutation, useQuery } from '@apollo/client'
import { ApproveAccount, DeleteUser } from '@/src/graphql/mutations'
import client from '@/lib/apolloClient';
import { toast } from 'react-toastify';
import { useAuth } from '@/src/context/AuthContext'
import { GetMinimalFilteredConsultations } from '@/src/graphql/queries'

const Referrals = () => {
    const [activeTab, setActiveTab] = useState<string>("completed")
    const [offsets, setOffsets] = useState<{ [key: string]: number }>({
        completed: 0,
        pending: 0,
    });

    const [dataCount, setDataCount] = useState<{ [key: string]: number }>({
        completed: 0,
        pending: 0,

    });

    const [data, setData] = useState<{ [key: string]: TableData[] }>({
        completed: [],
        pending: [],

    });


    const [pageLoadingFromClick, setPageLoadingFromClick] = useState(false)
    const [consultationWithId, setConsultationtWithId] = useState<string | null>(null) // id of consultation to delete
    const { user } = useAuth()
    const Id = user?.id


    const fetchData = async (offset: number, tab: string) => {
        setPageLoadingFromClick(true);
        try {
            // Dynamically refetch the data with updated variables
            const { data: newData, error: fetchError } = await client.query({
                query: GetMinimalFilteredConsultations,
                variables: {
                    tab,
                    limit: 10, // Adjust as needed
                    offset,
                },
                fetchPolicy: 'network-only', // Ensure fresh data is fetched
            });

            if (fetchError) {
                throw fetchError;
            }

            const completedConsultationCount = newData.getFilteredConsultations?.consultationCount
            const consultations = newData?.getFilteredConsultations?.consultations || [] as TableData[];

            let patientName: string
            let doctorName: string
            // Check if ConsultationData is available before mapping
            const updatedConsultationData = consultations?.map((singleConsultation: TableData) => {

                const {
                    __typename,
                    requestedDoctorType,
                    patient,
                    doctor,
                    status,
                    attachments,
                    requestedDuration,
                    consultationStartedAt,
                    deletedAt,
                    deletedBy,
                    createdAt,
                    total,
                    ...rest
                } = singleConsultation;


                patientName = (patient.user.firstName && patient.user.lastName) ? `${patient.user.firstName} ${patient.user.lastName}` : 'Not Set'
                doctorName = (doctor && doctor.user.firstName && doctor.user.lastName) ? `${doctor.user.firstName} ${doctor.user.lastName}` : 'Not Set'
                const consultationData = {
                    patient: [null, patientName, patient.user.email],
                    doctor: doctor ? [null, doctorName, doctor.user.email] : [null, 'Not Set', 'example@example.com'],
                    ...rest,
                    requested_doctor: requestedDoctorType,
                    request_date: createdAt,
                    consutation_duration: requestedDuration,
                    consultation_date: consultationStartedAt,
                    amount: total,
                    status: status,

                };

                return consultationData
            }) || [];


            setData((prevData) => {
                let modifiedConsultationData = [...updatedConsultationData];

                // Perform editing if the tab matches a specific condition
                if (tab === "pendingpayment") {
                    modifiedConsultationData = modifiedConsultationData.map((consultation) => {
                        const {
                            consultationTime,
                            consultationStartedAt,
                            ...rest
                        } = consultation
                            ;
                        return {
                            ...rest
                        };
                    });
                } else if (tab === "completed") {
                    modifiedConsultationData = modifiedConsultationData.map((consultation) => {
                        const {
                            consultationTime,
                            consultationStartedAt,
                            ...rest
                        } = consultation
                            ;
                        return {
                            ...rest
                        };
                    });
                }

                return {
                    ...prevData,
                    [tab]: [...(prevData[tab] || []), ...modifiedConsultationData],
                };
            });


            setDataCount((prevData) => ({
                ...prevData,
                [tab]: completedConsultationCount,
            }));

        } catch (error) {
            console.error(`Error fetching ${tab} data:`, error);
        } finally {
            setPageLoadingFromClick(false);
        }
    };


    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        fetchData(offsets[tab], tab);

    };

    const handlePagination = () => {
        const currentOffset = offsets[activeTab] + 10;
        setOffsets((prevOffsets) => ({
            ...prevOffsets,
            [activeTab]: currentOffset,
        }));
        let filterStatus: string
        if (activeTab == '') {
            filterStatus = ''
        } else if (activeTab == '') {
            filterStatus = ''
        } else if (activeTab == '') {
            filterStatus = ''
        } else {
            filterStatus = ''
        }
        fetchData( currentOffset, activeTab);
    };


    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageWrapper="Dashboard" pageTitle="Consultations" showExportRecord={true} />

                    <div className="px-8 py-4">
                        <div className="mb-4">
                            <button className={`px-4 py-2 ${activeTab === 'completed' ? "bg-[#B2B7C2]" : "bg-[#b5b5b646] "}  w-[200px] mr-2 rounded`} onClick={() => handleTabClick( 'completed')}>Completed</button>
                            <button className={`px-4 py-2 ${activeTab === 'pending' ? "bg-[#B2B7C2]" : "bg-[#b5b5b646] "}  w-[200px] mr-2 rounded`} onClick={() => handleTabClick('pending')}>Pending</button>

                        </div>
                        <div className="">
                            {activeTab === 'completed' && (
                                pageLoadingFromClick ? (
                                    <TablePreloader />
                                ) : (
                                        <AdminFacilitiesTable
                                            currentPage={1}
                                            setCurrentPage={() => { }}
                                        deleteAction={() => { }}
                                        approveAction={() => { }}
                                        changePage={() => { }}
                                        setItemToDelete={setConsultationtWithId}
                                        tableHeadText={`Completed referrals (${dataCount['completed']})`}
                                        tableData={data['completed']}
                                        searchBoxPosition='justify-start'
                                        showTableHeadDetails={true}
                                        showActions={true}
                                        showPagination={false}
                                        testPage='phlebotomies'
                                        marginTop='mt-4'
                                    />



                                )
                            )}

                            {/* ppending assignment */}
                            {activeTab === 'pending' && (
                                pageLoadingFromClick ? (
                                    <TablePreloader />
                                ) : (
                                        <AdminFacilitiesTable
                                            currentPage={1}
                                            setCurrentPage={() => { }}
                                        deleteAction={() => { }}
                                        approveAction={() => { }}
                                        changePage={() => { }}
                                        setItemToDelete={setConsultationtWithId}
                                        tableHeadText={`Pending referrals (${dataCount['pending']})`}
                                        tableData={data['pending']}
                                        searchBoxPosition="justify-start"
                                        showTableHeadDetails={true}
                                        showActions={true}
                                        showPagination={false}
                                        testPage="phlebotomies"
                                        marginTop="mt-4"
                                    />
                                )
                            )}

                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default Referrals
