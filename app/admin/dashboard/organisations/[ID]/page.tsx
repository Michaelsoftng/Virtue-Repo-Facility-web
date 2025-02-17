/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, {useCallback, useEffect, useRef, useState } from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import Image from 'next/image'
import FemalePhoto from '@/public/assets/images/femalephoto.jpg'
import ConfirmDeactivateModal from '@/src/reuseable/components/DeactivateModal'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import { FiType } from "react-icons/fi";
import { FaPhoneSquare } from "react-icons/fa";
import { FaLocationDot, FaPersonShelter } from "react-icons/fa6";
import { TableData } from '@/src/types/TableData.type'
import client from '@/lib/apolloClient';
import { GetUserById } from '@/src/graphql/queries';
import { useMutation, useQuery } from '@apollo/client'
import NumberPreloader from '@/src/preLoaders/NumberPreloader'
import { getRequestByPatient } from '@/src/hooks/getPatientTestRequest'
import { getConsultationsByPatient } from '@/src/hooks/getPatientConsultations'
import TablePreloader from '@/src/preLoaders/TablePreloader'
import { useGetRequestStats } from '@/src/hooks/useGetRequestStat'
import Preloader from '@/src/preLoaders/PreLoader'
import { useGetConsultationStats } from '@/src/hooks/useGetConsultationStats'
import { MdPeopleAlt } from "react-icons/md";
import { ToggleAccountStatus } from '@/src/graphql/mutations'
import { toast } from 'react-toastify';

const Patients = ({ params }: { params: { ID: string } }) => {
    const { ID } = params;
    const [testDataLoading, setTestDataLoading] = useState(true)
    const [consultationDataLoading, setConsultationDataLoading] = useState(true)
    const patientId = ID
    const { data: requestStatsData, loading: requestStatsDataLoading } = useGetRequestStats(patientId)
    const { data: consultationStatsData, loading: consultationStatsDataLoading } = useGetConsultationStats(patientId)
    
    const offsets = useRef<{ [key: string]: number }>({
            test: 0,
            consultation: 0,
        });
    const dataCount= useRef<{ [key: string]: number}>({
        test: 0,
        consultation: 0,
    });

    const [datas, setData] = useState<{ [key: string]: TableData[]  }>({
        test: [],
        consultation: [],
    });

    const { data: patientData, loading: patientDataLoading } = useQuery(GetUserById, {
        variables: {
            id: ID
        },
        client,
    });

    const fetchPatientRequests = useCallback(async (limit: number, offset: number) => {
        setTestDataLoading(true)
        const patientId = ID
        try {
            const { data, error, loading: requestsDataLoading } = await getRequestByPatient(patientId, limit, offset);
            if (error) {
                console.log('Error fetching patient test requests:', error);
                return;
            }
            if (data && data.getRequestByPatient?.requests) {
                // Update the ref instead of state
                const patientsTestsData = data.getRequestByPatient.requests as TableData[] 
                const updateTestData = patientsTestsData.map((singleTest) => {

                    const {
                        __typename, 
                        id,
                        tests,
                        patient,
                        phlebotomist,
                        samplePickUpAddress,
                        payment,
                        testRequest,
                        requestDate,
                        total,
                        isPaid,
                        balance,
                        requestStatus,
                        bonusUsed,
                        totalPaymentSum,
                        ...rest
                    } = singleTest;
                    const phlebotomistAssigned = phlebotomist ? [null, `${phlebotomist.user.firstName} ${phlebotomist.user.lastName}}`, phlebotomist.user.email] : [null, 'Not Set', 'email@labtraca.com']
                    const newTestData = {
                        id,
                        phlebotomist: phlebotomistAssigned,
                        no_of_test: tests.length,
                        // address: samplePickUpAddress,
                        request_date: requestDate,
                        amount: total,
                        paid: totalPaymentSum,
                        bonus: bonusUsed,
                        isPaid,
                        balance,
                        status: requestStatus,
                    };

                    return newTestData
                }) || [];


                const allPatientTests = [...updateTestData];
                setData((prevData) => {
                    const updatedTestData = Array.from(
                        new Map(
                            [...prevData.test, ...allPatientTests].map((item) => [item.id, item]) // Use `id` for uniqueness
                        ).values()
                    );

                    return {
                        ...prevData,
                        test: updatedTestData,
                    };
                });
               
                dataCount.current = {
                    ...dataCount.current,
                    test: data?.getRequestByPatient?.requestsCount,
                };
                offsets.current = {
                    ...dataCount.current,
                    test: limit + offsets.current.test,
                };
            }
        } catch (err) {
            console.log('Error fetching fetching patient test request data:', err);
        } finally {
            setTestDataLoading(false);
        }
    }, [ID]);

    const fetchConsultationsRequests = useCallback(async (limit: number, offset: number) => {
        setConsultationDataLoading(true)
        const patientId = ID
        try {
            const { data, error, loading: consultationDataLoading } = await getConsultationsByPatient(patientId, limit, offset);
            if (error) {
                console.log('Error fetching patient test requests:', error);
                return;
            }
            if (data && data.getConsultationsByPatient?.consultations) {
                // Update the ref instead of state
                const patientsConsultationsData = data.getConsultationsByPatient?.consultations as TableData[]
                const updateConsultationData = patientsConsultationsData.map((singleConsultation) => {

                    const {
                        __typename,
                        id,
                        patient,
                        doctor,
                        payment,
                        consultationTime,
                        total,
                        status,
                        bonusUsed,
                        totalPaymentSum,
                        attachments,
                        requestedDoctorType,
                        requestedDuration,
                        ...rest
                    } = singleConsultation;
                    const doctorAssigned = doctor ? [null, `${doctor.user.firstName} ${doctor.user.lastName}}`, doctor.user.email] : [null, 'Not Set', 'email@labtraca.com']
                    const newConsultationData = {
                        id,
                        doctor: doctorAssigned,
                        consultation_date: consultationTime,
                        amount: total,
                        paid: totalPaymentSum,
                        bonus: bonusUsed,
                        attachments: attachments.length,
                        status: status,
                    };

                    return newConsultationData
                }) || [];


                const allPatientConsultations = [...updateConsultationData];
                setData((prevData) => {
                    const updatedConsultationData = Array.from(
                        new Map(
                            [...prevData.consultation, ...allPatientConsultations].map((item) => [item.id, item]) // Use `id` for uniqueness
                        ).values()
                    );

                    return {
                        ...prevData,
                        consultation: updatedConsultationData,
                    };
                });

                dataCount.current = {
                    ...dataCount.current,
                    consultation: data?.getConsultationsByPatient?.consultationCount,
                };
                offsets.current = {
                    ...dataCount.current,
                    consultation: limit + offsets.current.test,
                };
            }
        } catch (err) {
            console.log('Error fetching fetching patient test request data:', err);
        } finally {
            setConsultationDataLoading(false);
        }
    }, [ID]);

    const handleTestNextPage = () => {
        offsets.current = {
            ...dataCount.current,
            test: 5 + offsets.current.test,
        };
        fetchPatientRequests(10, offsets.current.test);
    }
    const handleConsultationNextPage = () => {
        offsets.current = {
            ...dataCount.current,
            consultation: 5 + offsets.current.consultation,
        };
        fetchConsultationsRequests(10, offsets.current.consultation);
    }

    const [toggleAccount] = useMutation(ToggleAccountStatus, {
        variables: {
            userForApproval: ID
        },
        client,
    });

    const handleAccountStatusChange = async (e: React.FormEvent) => {

        try {
            await toggleAccount({
                onCompleted(data) {
                    if (data.ToggleAccountStatus.error) {
                        toast.error(data.ToggleAccountStatus.error.message);  
                    } else {
                        toast.success(data.ToggleAccountStatus.success.message);
                    }     
                },
                onError(error) {
                    toast.error(error.message);
                },
            });
        } catch (err) {
            console.error('Error creating user:', err);
        } finally {
            // setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchPatientRequests(10, 0);
        fetchConsultationsRequests(10, 0);
    }, [fetchPatientRequests, fetchConsultationsRequests]);
        
    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageWrapper="Dashboard &nbsp;&nbsp;/&nbsp;&nbsp;Patients" pageTitle="User" showExportRecord={true} />
                    <div className='grid grid-cols-[60%_40%] gap-4 pl-2'>
                        <div className="">
                            {
                                testDataLoading 
                                ? <TablePreloader />
                                :
                                <AdminFacilitiesTable
                                    handleSearchData={()=>{}}
                                    currentPage={1}
                                    setCurrentPage={() => { }}
                                    deleteAction={() => { }}
                                    approveAction={() => { }}
                                    setItemToDelete={() => { }}
                                    changePage={() => { }}
                                    tableHeadText={`${dataCount.current.test} Test Requests`}
                                    tableData={datas.test}
                                    searchBoxPosition='justify-start'
                                    showTableHeadDetails={true}
                                    showActions={true}
                                    showPagination={true}
                                    testPage='patientrequests'
                                    marginTop='mt-4'
                                    dataCount={12}
                                />
                            }
                            <div className="mt-4">
{
                                consultationDataLoading
                                ? <TablePreloader />
                                :
                        
                                <AdminFacilitiesTable
                                    handleSearchData={()=>{}}
                                    currentPage={1}
                                    setCurrentPage={() => { }}
                                    deleteAction={() => { }}
                                    approveAction={() => { }}
                                    setItemToDelete={() => { }}
                                    changePage={() => { }}
                                    tableHeadText={`${dataCount.current.consultation} consultations`}
                                    tableData={datas.consultation}
                                    searchBoxPosition='justify-start'
                                    showTableHeadDetails={true}
                                    showActions={true}
                                    showPagination={true}
                                    testPage='consultation'
                                    marginTop='mt-4'
                                    dataCount={12}
                                />
                            }
                            </div>
                            
                        </div>

                        <div>

                            <div className='shadow-xl bg-white px-6 py-6 mt-3 rounded-sm'>
                                <div className="w-full gap-x-3 flex justify-center">
                                    <div className=''>
                                        <div className="flex justify-center">
                                            <Image src={FemalePhoto} alt='pprofile image' className="rounded-lg h-[70px] w-[70px]" />
                                        </div>
                                        <div className="text-center">
                                            <div className="text-gray-700">
                                                {
                                                    patientDataLoading
                                                        ? <NumberPreloader />
                                                        : `${patientData.getUserById.firstName} ${patientData.getUserById.lastName}`

                                                }
                                            </div>
                                            <div className="text-gray-500">
                                                {
                                                    patientDataLoading
                                                        ?
                                                        <div className="mt-[2px] w-[200px]"><NumberPreloader /></div>
                                                        : `${patientData.getUserById.email}`

                                                }

                                            </div>
                                        </div>
                                    </div>


                                </div>
                                <div className="px-5 mt-10">
                                    <div className="text-slate-400 text-2xl grid grid-cols-[100px_calc(100%-100px)] border-b-2 pb-1  mt-4 gap-2">
                                        <span className="flex"><FaPersonShelter /><span className="ml-3 text-[16px]">Name</span></span>
                                        <span className="text-[14px] text-black">{patientDataLoading ? <div className="mt-[2px] w-[200px]"><NumberPreloader /></div> : `${patientData?.getUserById?.patient.organisationName || '?'}`}</span>
                                    </div>
                                    <div className="text-slate-400 text-2xl grid grid-cols-[100px_calc(100%-100px)] border-b-2 pb-1  mt-4 gap-2">
                                        <span className="flex"><FiType /><span className="ml-3 text-[16px]">Type</span></span>
                                        <span className="text-[14px] text-black">{patientDataLoading ? <div className="mt-[2px] w-[200px]"><NumberPreloader /></div> : `${patientData?.getUserById?.patient.organisationType || '?'}`}</span>
                                    </div>
                                    <div className="w-full  text-slate-400 text-2xl grid grid-cols-[120px_calc(100%-120px)] border-b-2 pb-1  mt-4">
                                        <span className="flex"><MdPeopleAlt /><span className="ml-3 text-[16px]">Employees</span></span>
                                        <span
                                            title={`${patientData?.getUserById?.patient.noOfEmployees || 'no of employees'}`}
                                            className=" overflow-hidden text-nowrap text-[14px] text-black">
                                            {patientDataLoading ? <div className="mt-[2px] w-[200px]"><NumberPreloader /></div> : `${patientData?.getUserById?.patient.noOfEmployees || '?'}`}
                                        </span>
                                    </div>

                                    <div className="text-slate-400 text-2xl grid grid-cols-[100px_calc(100%-100px)] border-b-2 pb-1  mt-4">
                                        <span className="flex"><FaPhoneSquare /><span className="ml-3 text-[16px]">Phone</span></span>
                                        <span className="text-[14px] text-black">{patientDataLoading ? <div className="mt-[2px] w-[200px]"><NumberPreloader /></div> : `${patientData?.getUserById?.phoneNumber}`}</span>
                                    </div>
                                    <div className="text-slate-400 text-2xl grid grid-cols-[100px_calc(100%-100px)] border-b-2 pb-1 mt-4">
                                        <span className="flex"><FaLocationDot /><span className="ml-3 text-[16px]">Address</span></span>
                                        <span className="text-[14px] text-black">{patientDataLoading ? <div className="mt-[2px] w-[200px]"><NumberPreloader /></div> : patientData?.getUserById?.streetAddress ? `${patientData?.getUserById?.streetAddress} ${patientData?.getUserById?.city} ${patientData?.getUserById?.state}` : '?'}</span>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                        
                                        <button onClick={handleAccountStatusChange} className="bg-red-500 text-white rounded px-2 py-1">
                                            {
                                                patientData.getUserById.accountStatus == 'ACTIVE' ? 'Deactivate Account': 'Activate Account'
                                            }
                                            
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white shadow-lg rounded px-8 py-4 mt-4" >
                                <h2 className="text-xl font-bold underline">Test Requests Stats</h2>
                                <div className="mt-5 w-[89%]">
                                    <div className='flex justify-between mt-4'>
                                        <p className="flex space-x-4">
                                            <span className="rounded-full h-4 w-4 bg-green-600 inline-block mt-1"></span>
                                            <span>Completed</span>
                                        </p>

                                        <span className="font-bold">
                                            {
                                                requestStatsDataLoading ? <Preloader /> : requestStatsData?.getRequestStatsByUser?.completed
                                            }
                                            
                                        </span>

                                    </div>
                                    <div className='flex justify-between mt-4'>
                                        <p className="flex space-x-4">
                                            <span className="rounded-full h-4 w-4 bg-blue-600 inline-block mt-1"></span>
                                            <span>Ongoing</span>
                                        </p>

                                        <span className="font-bold">
                                            {
                                                requestStatsDataLoading ? <Preloader />
                                                : 
                                                    requestStatsData?.getRequestStatsByUser?.ongoing + requestStatsData?.getRequestStatsByUser?.scheduled

                                            }
                                        </span>

                                    </div>
                                    <div className='flex justify-between mt-4'>
                                        <p className="flex space-x-4">
                                            <span className="rounded-full h-4 w-4 bg-yellow-600 inline-block mt-1"></span>
                                            <span>Pending</span>
                                        </p>

                                        <span className="font-bold">
                                            {
                                                requestStatsDataLoading ? <Preloader />
                                            
                                                    :
                                            requestStatsData?.getRequestStatsByUser?.pending + requestStatsData?.getRequestStatsByUser?.unpaid

                                            }
                                        </span>

                                    </div>
                                    <div className='flex justify-between mt-4'>
                                        <p className="flex space-x-4">
                                            <span className="rounded-full h-4 w-4 bg-red-600 inline-block mt-1"></span>
                                            <span>Cancelled</span>
                                        </p>

                                        <span className="font-bold">
                                            {
                                                requestStatsDataLoading ? <Preloader />

                                                    :
                                                    requestStatsData?.getRequestStatsByUser?.cancelled 

                                            }
                                        </span>

                                    </div>


                                </div>
                            </div>
                            <div className="bg-white shadow-lg rounded px-8 py-4 mt-4" >
                                <h2 className="text-xl font-bold underline">Consultations Stats</h2>
                                <div className="mt-5 w-[89%]">
                                    <div className='flex justify-between mt-4'>
                                        <p className="flex space-x-4">
                                            <span className="rounded-full h-4 w-4 bg-green-600 inline-block mt-1"></span>
                                            <span>Completed</span>
                                        </p>

                                        <span className="font-bold">
                                            {

                                                consultationStatsDataLoading ? <Preloader /> : consultationStatsData?.getConsultationStatsByUser?.completed
                                            }

                                        </span>

                                    </div>
                                    <div className='flex justify-between mt-4'>
                                        <p className="flex space-x-4">
                                            <span className="rounded-full h-4 w-4 bg-blue-600 inline-block mt-1"></span>
                                            <span>Ongoing</span>
                                        </p>

                                        <span className="font-bold">
                                            {
                                                consultationStatsDataLoading ? <Preloader />
                                                    :
                                                    consultationStatsData?.getConsultationStatsByUser?.ongoing + consultationStatsData?.getConsultationStatsByUser?.scheduled

                                            }
                                        </span>

                                    </div>
                                    <div className='flex justify-between mt-4'>
                                        <p className="flex space-x-4">
                                            <span className="rounded-full h-4 w-4 bg-yellow-600 inline-block mt-1"></span>
                                            <span>Pending</span>
                                        </p>

                                        <span className="font-bold">
                                            {
                                                consultationStatsDataLoading ? <Preloader />

                                                    :
                                                    consultationStatsData?.getConsultationStatsByUser?.pending + consultationStatsData?.getConsultationStatsByUser?.unpaid

                                            }
                                        </span>

                                    </div>
                                    <div className='flex justify-between mt-4'>
                                        <p className="flex space-x-4">
                                            <span className="rounded-full h-4 w-4 bg-red-600 inline-block mt-1"></span>
                                            <span>Cancelled</span>
                                        </p>

                                        <span className="font-bold">
                                            {
                                                consultationStatsDataLoading ? <Preloader />

                                                    :
                                                    consultationStatsData?.getConsultationStatsByUser?.cancelled

                                            }
                                        </span>

                                    </div>


                                </div>
                            </div>


                        </div>

                    </div>
                </div>
            </div>
            {/* <ConfirmDeactivateModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={() => console.log('confirem')} /> */}

        </div>

    )
}

export default Patients
