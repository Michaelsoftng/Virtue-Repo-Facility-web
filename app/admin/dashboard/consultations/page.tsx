/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import TablePreloader from '@/src/preLoaders/TablePreloader'

import client from '@/lib/apolloClient';
import { toast } from 'react-toastify';
import { useAuth } from '@/src/context/AuthContext'
import { GetMinimalFilteredConsultations } from '@/src/graphql/queries'

const Consultations = () => {
    const limit = 10;
    const [activeTab, setActiveTab] = useState<string>("completed")
    const [currentAssignmentPage, setAssignmentCurrentPage] = useState<number>(1);
    const [currentCompletedPage, setCompletedCurrentPage] = useState<number>(1);
    const [currentPendingpaymentPage, setPendingpaymentCurrentPage] = useState<number>(1);
    const [offsets, setOffsets] = useState<{ [key: string]: number }>({
        completed: 0,
        pendingassignment: 0,
        pendingpayment: 0,
    });

    const [dataCount, setDataCount] = useState<{ [key: string]: number}>({
        completed: 0,
        pendingassignment: 0,
        pendingpayment: 0,
    });

    const data = useRef<{ [key: string]: TableData[]  }>({
        completed: [],
        pendingassignment: [],
        pendingpayment: [],
    });


    const [pageLoadingFromClick, setPageLoadingFromClick] = useState(false)
    const [consultationWithId, setConsultationtWithId] = useState<string | null>(null) // id of consultation to delete
    const { user } = useAuth()
    const Id = user?.id


    const fetchCompletedData = useCallback( async (filterStatus: string, offset: number, tab: string) => {
        setPageLoadingFromClick(true);
        try {
            // Dynamically refetch the data with updated variables
            const { data: newData, error: fetchError } = await client.query({
                query: GetMinimalFilteredConsultations,
                variables: {
                    filterStatus,
                    limit: limit, // Adjust as needed
                    offset: offsets.completed,
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
                    patients: [null, patientName, patient.user.email],
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

            data.current = {
                ...data.current,
                
                completed: Array.from(
                    new Map(
                        [...data.current.completed, ...updatedConsultationData].map(item => [item.id, item]) // Use `id` to ensure uniqueness
                    ).values()
                ),
            };
            setOffsets((prevOffsets) => ({
                ...prevOffsets,
                [activeTab]: offset + limit,
            }));
            setDataCount((prevData) => ({
                ...prevData,
                [tab]: completedConsultationCount,
            }));

        } catch (error) {
            console.error(`Error fetching ${filterStatus} data:`, error);
        } finally {
            setPageLoadingFromClick(false);
        }
    }, [activeTab, offsets.completed]);

    const fetchPendingAssgnData = async (filterStatus: string, offset: number, tab: string) => {
        setPageLoadingFromClick(true);
        try {
            // Dynamically refetch the data with updated variables
            const { data: newData, error: fetchError } = await client.query({
                query: GetMinimalFilteredConsultations,
                variables: {
                    filterStatus: "pending",
                    limit: limit, // Adjust as needed
                    offset: offsets.pendingassignment,
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
                    id,
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
                    id,
                    patients: [null, patientName, patient.user.email],
                    doctor: [null, 'Not Set', 'example@example.com'],
                    // ...rest,
                    requested_doctor: requestedDoctorType,
                    request_date: createdAt,
                    consutation_duration: requestedDuration,
                    amount: total,
                    status: status,

                };

                return consultationData
            }) || [];
            console.log("pending data", consultations)
            data.current = {
                ...data.current,
            pendingassignment: Array.from(
                    new Map(
                        [...data.current.pendingassignment, ...updatedConsultationData].map(item => [item.id, item]) // Use `id` to ensure uniqueness
                    ).values()
                ),
            };
            setOffsets((prevOffsets) => ({
                ...prevOffsets,
                pendingassignment: offset + limit,
            }));
            setDataCount((prevData) => ({
                ...prevData,
                [tab]: completedConsultationCount,
            }));

        } catch (error) {
            console.error(`Error fetching ${filterStatus} data:`, error);
        } finally {
            setPageLoadingFromClick(false);
        }
    };

    const fetchPendingPaymentData = async (filterStatus: string, offset: number, tab: string) => {
        setPageLoadingFromClick(true);
        try {
            // Dynamically refetch the data with updated variables
            const { data: newData, error: fetchError } = await client.query({
                query: GetMinimalFilteredConsultations,
                variables: {
                    filterStatus,
                    limit: limit, // Adjust as needed
                    offset: offsets.pendingpayment,
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
                    id,
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
                    id,
                    patients: [null, patientName, patient.user.email],
                    doctor: [null, 'Not Set', 'example@example.com'],
                    requested_doctor: requestedDoctorType,
                    request_date: createdAt,
                    consutation_duration: requestedDuration,
                    amount: total,
                    status: status,
                };

                return consultationData
            }) || [];

            data.current = {
                ...data.current,

                pendingpayment: Array.from(
                    new Map(
                        [...data.current.pendingpayment, ...updatedConsultationData].map(item => [item.id, item]) // Use `id` to ensure uniqueness
                    ).values()
                ),
            };
            setOffsets((prevOffsets) => ({
                ...prevOffsets,
                pendingpayment: offset + limit,
            }));
            setDataCount((prevData) => ({
                ...prevData,
                [tab]: completedConsultationCount,
            }));

        } catch (error) {
            console.error(`Error fetching ${filterStatus} data:`, error);
        } finally {
            setPageLoadingFromClick(false);
        }
    };

    const handleTabClick = (tab: string, filterStatus: string) => {
        setActiveTab(tab);
        if (tab === 'pendingpayment') {
            if (data.current.pendingpayment.length < (limit * (currentPendingpaymentPage + 1))) {
                fetchPendingPaymentData('unpaid', offsets.pendingpayment, 'pendingpayment');
            }
            return;
        } else if (tab === 'pendingassignment') {
            if (data.current.pendingassignment.length < (limit * (currentAssignmentPage + 1))) {
                fetchPendingAssgnData('pending', offsets.pendingassignment, 'pendingassignment');
            }
            return;
        } else if (tab === 'completed') {
            if (data.current.completed.length < (limit * (currentCompletedPage + 1))) {
                fetchCompletedData('complete', offsets.completed, 'completed');
            }
            return;
        }     
    };

    const handlePagination = () => {
        if (activeTab === 'pendingpayment') {
            if (data.current.pendingpayment.length < (limit * (currentPendingpaymentPage + 1))) {
                fetchPendingPaymentData('unpaid', offsets.pendingpayment, 'pendingpayment');
            }
            return;
        } else if (activeTab === 'pendingassignment') {
            console.log("offset", offsets.pendingassignment)
            if (data.current.pendingassignment.length < (limit * (currentAssignmentPage + 1))) {
                fetchPendingAssgnData('pending', offsets.pendingassignment, 'pendingassignment');
            }
            return;
        } else {
            if (data.current.completed.length < (limit * (currentCompletedPage + 1))) {
                fetchCompletedData('complete', offsets.completed, 'completed');
            }
            return;
        }  

    };

    useEffect(() => {
        fetchCompletedData('complete', 0, 'completed');
    }, [fetchCompletedData,]);

    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageWrapper="Dashboard" pageTitle="Consultations" showExportRecord={true} />

                    <div className="px-8 py-4">
                        <div className="mb-4">
                            <button className={`px-4 py-2 ${activeTab === 'completed' ? "bg-[#B2B7C2]" : "bg-[#b5b5b646] "}  w-[200px] mr-2 rounded`} onClick={() => handleTabClick('completed', 'complete')}>Completed</button>
                            <button className={`px-4 py-2 ${activeTab === 'pendingassignment' ? "bg-[#B2B7C2]" : "bg-[#b5b5b646] "}  w-[200px] mr-2 rounded`} onClick={() => handleTabClick('pendingassignment', 'pending')}>Pending Assignment</button>
                            <button className={`px-4 py-2 ${activeTab === 'pendingpayment' ? "bg-[#B2B7C2]" : "bg-[#b5b5b646] "}  w-[200px] mr-2 rounded`} onClick={() => handleTabClick('pendingpayment', 'unpaid')}>Pending Payment</button>

                        </div>

                        <div className="">
                            {activeTab === 'completed' && (
                                pageLoadingFromClick ? (
                                    <TablePreloader />
                                ) : (
                                        <AdminFacilitiesTable
                                            handleSearchData={() => { }}
                                    currentPage={currentCompletedPage}
                                    setCurrentPage={setCompletedCurrentPage}
                                    deleteAction={() => {}}
                                    changePage={handlePagination}
                                    approveAction={() => { }}
                                    setItemToDelete={setConsultationtWithId}
                                    tableHeadText='Completed consultaions (50)'
                                    tableData={data.current.completed}
                                    dataCount={dataCount.completed}
                                    searchBoxPosition='justify-start'
                                    showTableHeadDetails={true}
                                    showActions={true}
                                    showPagination={true}
                                    testPage='consultations'
                                    marginTop='mt-4'
                            />
                            
                            
                           
                                    )
                            )}

                            {/* ppending assignment */}
                            {activeTab === 'pendingassignment' && (
                                pageLoadingFromClick ? (
                                    <TablePreloader />
                                ) : (
                                        <AdminFacilitiesTable
                                            handleSearchData={() => { }}
                                            currentPage={currentAssignmentPage}
                                            setCurrentPage={setAssignmentCurrentPage}
                                            deleteAction={() => { }}
                                            approveAction={() => { }}
                                            changePage={handlePagination}
                                            setItemToDelete={setConsultationtWithId}
                                            tableHeadText={`Consultaions pending doctor (${dataCount.pendingassignment})`}
                                            dataCount={dataCount.pendingassignment}
                                            tableData={data.current.pendingassignment}
                                            searchBoxPosition="justify-start"
                                            showTableHeadDetails={true}
                                            showActions={true}
                                            showPagination={true}
                                            testPage="phlebotomies"
                                            marginTop="mt-4"
                                    />
                                )
                            )}

                            {/* consulutations pending payment */}
                            {activeTab === 'pendingpayment' && (
                                pageLoadingFromClick ? (
                                    <TablePreloader />
                                ) : (
                                        <AdminFacilitiesTable
                                            handleSearchData={() => { }}
                                    currentPage={currentPendingpaymentPage}
                                    setCurrentPage = {setPendingpaymentCurrentPage}
                                    deleteAction={() => {}}
                                    approveAction={() => {}}
                                    changePage={handlePagination}
                                    setItemToDelete={setConsultationtWithId}
                                    tableHeadText={`Consultaions pending payment (${dataCount.pendingpayment})`}
                                    tableData={data.current.pendingpayment}
                                    dataCount={dataCount.pendingpayment}
                                    searchBoxPosition='justify-start'
                                    showTableHeadDetails={true}
                                    showActions={true}
                                    showPagination={true}
                                    testPage='phlebotomies'
                                    marginTop='mt-4'
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

export default Consultations
