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


const decodeJwtEncodedId = (encodedId: string | undefined): string => {
    if (!encodedId) {
        console.error('Invalid input: encodedId is undefined or null');
        return ''; // Return fallback or handle it appropriately
    }

    try {
        const base64 = encodedId.replace(/-/g, '+').replace(/_/g, '/');
        const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
        const decoded = atob(paddedBase64);
        return decoded.replace(/^UserNode:/, '');
    } catch (error) {
        console.error('Error decoding JWT-encoded ID:', error);
        return '';
    }
};

const Consultations = () => {
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
                    
                    paidby,
                    paidFor,
                    paymentPlan,
                    paymentType,
                    amountPaid,
                    amountCharged,
                    paymentChannel,
                    paymentId,
                    paymentDetails,
                    isDeleted,
                    createdAt,
                    ...rest
                } = singlepPayments;


                patientName = (paidby.firstName && paidby.lastName) ? `${paidby.firstName.trim()} ${paidby.lastName.trim()}` : 'Not Set'
                const paymentData = {
                    patient: [null, patientName, paidby.email],
                    paid_for: paidFor,
                    payment_Plan: paymentPlan,
                    payment_type: paymentType,
                    amount_paid: amountPaid,
                    amount_charged: amountCharged,
                    payment_channel: paymentChannel,
                    payment_id: paymentId,
                    ...rest,
                };

                return paymentData
            }) || [];


            setData((prevData) => {
                // let modifiedPaymentData = [...updatedPaymentData];

                // Perform editing if the tab matches a specific condition
                // if (tab === "pendingpayment") {
                //     modifiedPaymentData = modifiedPaymentData.map((payment) => {
                //         const {
                //             consultationTime,
                //             consultationStartedAt,
                //             ...rest
                //         } = payment
                //             ;
                //         return {
                //             ...rest
                //         };
                //     });
                // } else if (tab === "completed") {
                //     modifiedConsultationData = modifiedConsultationData.map((consultation) => {
                //         const {
                //             consultationTime,
                //             consultationStartedAt,
                //             ...rest
                //         } = consultation
                //             ;
                //         return {
                //             ...rest
                //         };
                //     });
                // }

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
                    <BreadCrump pageWrapper="Dashboard" pageTitle="Consultations" showExportRecord={true} />

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
                                        deleteAction={() => { }}
                                        approveAction={() => { }}
                                        setItemToDelete={setConsultationtWithId}
                                        tableHeadText='Incoming Payments (50)'
                                        tableData={data['incoming']}
                                        searchBoxPosition='justify-start'
                                        showTableHeadDetails={true}
                                        showActions={true}
                                        showPagination={false}
                                        testPage='phlebotomies'
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
                                        deleteAction={() => { }}
                                        approveAction={() => { }}
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

export default Consultations
