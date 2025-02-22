/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useEffect, useState } from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import { useGetUnpaidConsultation } from '@/src/hooks/useGetUnpaidConsultation'
import TablePreloader from '@/src/preLoaders/TablePreloader'
import client from '@/lib/apolloClient';
import { toast } from 'react-toastify';
import { useAuth } from '@/src/context/AuthContext'
import { GetPayments, GetPayouts } from '@/src/graphql/queries'


const Payments = () => {
    const [activeTab, setActiveTab] = useState<string>("incoming")
    const [offsets, setOffsets] = useState<{ [key: string]: number }>({
        incoming: 0,
        outgoing: 0,

    });

    const [dataCount, setDataCount] = useState<{ [key: string]: number }>({
        incoming: 0,
        outgoing: 0,
    });

    const [data, setData] = useState<{ [key: string]: TableData[] }>({
        incoming: [],
        outgoing: [],
    });


    const [pageLoadingFromClick, setPageLoadingFromClick] = useState(false)
    const [consultationWithId, setConsultationtWithId] = useState<string | null>(null) // id of consultation to delete
    const { user } = useAuth()
    const Id = user?.id


    const fetchData = async (offset: number, tab: string) => {
        setPageLoadingFromClick(true);
        try {
        
            const query = tab === "incoming" ? GetPayments : GetPayouts;
            
            const { data: newPaymentData, error: fetchError } = await client.query({
                query,
                variables: {
                    limit: 10, // Adjust as needed
                    offset,
                },
                fetchPolicy: 'network-only', // Ensure fresh data is fetched
            }); 
            
            // Dynamically refetch the data with updated variables
            

            if (fetchError) {
                throw fetchError;
            }

            const paymentCount = newPaymentData?.getAllPayment?.paymentsCount
            const payments = newPaymentData?.getAllPayment?.payments || [] as TableData[];

            let patientName: string
            let doctorName: string
            // Check if ConsultationData is available before mapping
            const updatedPaymentData = payments?.map((singlepPayments: TableData) => {

                const {
                    __typename,
                    invoice,
                    description,
                    id,
                    paidby,
                    paidFor,
                    paymentPlan,
                    paymentType,
                    amountPaid,
                    amountCharged,
                    paymentChannel,
                    paymentId,
                    paymentDetails,
                    deletedAt,
                    deletedBy,
                    createdAt,
                    requestSet,
                    ...rest
                } = singlepPayments;


                patientName = (paidby.firstName && paidby.lastName) ? `${paidby.firstName.trim()} ${paidby.lastName.trim()}` : 'Not Set'
                const paid_For = paidFor === 'TESTREQUEST' ? 'tests' : 'consultation'
                const payment_plan = paymentPlan == 'LUMP_SUM' ? 'full payment' :'installment'
                const paymentData = {
                    id: requestSet[0]?.id,
                    patients: [null, patientName, paidby.email],
                    paid_for: paid_For,
                    payment_Plan: payment_plan,
                    payment_type: paymentType.toLowerCase(),
                    amount_paid: amountPaid,
                    amount_charged: amountCharged,
                    date: new Date(createdAt),
                    payment_channel: paymentChannel.toLowerCase(),
                    payment_id: paymentId,
                    ...rest,
                    status: 'verified'
                };

                return paymentData
            }) || [];


            setData((prevData) => {
                return {
                    ...prevData,
                    [tab]: [...(prevData[tab] || []), ...updatedPaymentData],
                };
            });


            setDataCount((prevData) => ({
                ...prevData,
                [tab]: paymentCount,
            }));

        } catch (error) {
            console.error(`Error fetching ${tab} payment data:`, error);
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
        fetchData(currentOffset, activeTab);
    };
    useEffect(() => {
        // Fetch data for the default active tab on initial load
        fetchData(0, "incoming");
    }, []); // Only run on mount

    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageWrapper="Dashboard" pageTitle="payment" showExportRecord={true} />

                    <div className="px-8 py-4">
                        <div className="mb-4">
                            <button className={`px-4 py-2 ${activeTab === 'incoming' ? "bg-[#B2B7C2]" : "bg-[#b5b5b646] "}  w-[200px] mr-2 rounded`} onClick={() => handleTabClick( 'incoming')}>Incoming</button>
                            <button className={`px-4 py-2 ${activeTab === 'outgoing' ? "bg-[#B2B7C2]" : "bg-[#b5b5b646] "}  w-[200px] mr-2 rounded`} onClick={() => handleTabClick('outgoing')}>Outgoing</button>

                        </div>
                        <div className="">
                            {activeTab === 'incoming' && (
                                pageLoadingFromClick ? (
                                    <TablePreloader />
                                ) : (
                                        <AdminFacilitiesTable
                                            handleSearchData={() => { }}
                                        currentPage={1}
                                        setCurrentPage={() => { }}
                                        deleteAction={() => { }}
                                        approveAction={() => { }}
                                        changePage={() => { }}
                                        setItemToDelete={setConsultationtWithId}
                                        tableHeadText={`Incoming Payments (${dataCount.incoming})`}
                                        tableData={data['incoming']}
                                        searchBoxPosition='justify-start'
                                        showTableHeadDetails={true}
                                        showActions={true}
                                        showPagination={false}
                                        testPage='payments'
                                        marginTop='mt-4'
                                    />



                                )
                            )}

                            {/* outgoing payments */}
                            {activeTab === 'outgoing' && (
                                pageLoadingFromClick ? (
                                    <TablePreloader />
                                ) : (
                                    <AdminFacilitiesTable
                                            handleSearchData={() => { }}
                                    currentPage={1}
                                    setCurrentPage = {() => { }}
                                        deleteAction={() => { }}
                                        approveAction={() => { }}
                                        changePage={() => { }}
                                        setItemToDelete={setConsultationtWithId}
                                        tableHeadText="Outgoing Payments (50)"
                                        tableData={data['outgoing']}
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

export default Payments
