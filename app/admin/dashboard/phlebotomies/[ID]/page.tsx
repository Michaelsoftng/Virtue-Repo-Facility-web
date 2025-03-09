/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, {  useCallback, useEffect, useRef, useState } from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import Image from 'next/image'
import FemalePhoto from '@/public/assets/images/femalephoto.jpg'
import ConfirmDeactivateModal from '@/src/reuseable/components/DeactivateModal'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import { formatMoney } from '@/src/partials/tables/NewRequesTable'
import { DoughnutPieAnalytics } from '@/src/partials/DoughtPieAnalytics'
import Approval from '@/src/reuseable/components/Approval'
import { GetUserById } from '@/src/graphql/queries';
import { useMutation, useQuery } from '@apollo/client'
import client from '@/lib/apolloClient';
import Loading from '../../loading'
import NumberPreloader from '@/src/preLoaders/NumberPreloader'
import ToolsRequest from '@/src/reuseable/components/ToolsRequest'
import { AiOutlineClose } from "react-icons/ai";
import * as Form from '@radix-ui/react-form';
import { ToggleAccountStatus } from '@/src/graphql/mutations'
import { toast } from 'react-toastify';
import Link from 'next/link'
import { getRequestByPhlebotomist } from '@/src/hooks/useGetAllRequest'
import TablePreloader from '@/src/preLoaders/TablePreloader'
import { useGetRequestStats } from '@/src/hooks/useGetRequestStat'


const Singlefacility = ({ params }: { params: { ID: string } }) => {
    const limit = 10;  
    const [currentPage, setCurrentPage] = useState<number>(1);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isOpenToolsModal, setIsOpenToolsModal] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [phlebotomistLoading, setIsLoading] = useState<boolean>(false);
    const { ID } = params;
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const { data: phlebotomistData, loading: pageLoading } = useQuery(GetUserById, {
            variables: {
                id: ID
            },
            client,
    });
    const [offsets, setOffsets] = useState<number>(0);
    const dataCount = useRef< number >(0);

    const datas = useRef<TableData[]>([]);
    const { data: requestStatsData, loading: requestStatsDataLoading } = useGetRequestStats(undefined, ID )
    const fetchPhlebotomiesRequests = useCallback(async (limit: number, offset: number) => {
        try {
            setIsLoading(true)
            const { data, error, loading: testsDataLoading } = await getRequestByPhlebotomist(ID, limit, offset);
            if (error) {
                console.log('Error fetching phleb activities from api:', error);
                return;
            }
            if (data && data.getRequestByPhlebotomist?.requests) {
                // Update the ref instead of state
                const phlebotomies = data.getRequestByPhlebotomist?.requests as TableData[]
                const updatedPhlebotomiesData = phlebotomies?.map((singleStaff) => {

                    const {
                        id,
                        __typename,
                        hasPhlebotomistBeenPaid,
                        requestProfitMargin,
                        logisticsEstimate,
                        phlebotomistEarning,
                        distanceCharge,
                        labtracaProfit,
                        requestDate,
                        pickupDistance,
                        dropOffDistance,
                        sampleCollectionDate,
                        samepleDropOffDate,
                        samplePickUpAddress,
                        requestStatus,
                        sampleStatus,
                        createdAt,
                        patient,
                        ...rest
                    } = singleStaff;

                    const name = (patient.user.firstName && patient.user.lastName) ? `${patient.user.firstName.trim()} ${patient.user.lastName.trim()}` : 'Not Set'
                    
                    const newPatientData = {
                        id,
                        patients: [null, name, patient.user.email],
                        request_date: requestDate,
                        logistics_estimate: logisticsEstimate,
                        phlebotomist_earning: phlebotomistEarning,
                        distance_charge: distanceCharge,
                        labtraca_profit: labtracaProfit,
                        pickup_distance: `${pickupDistance}km`,
                        drop_off_distance: `${dropOffDistance}km`,
                        request_status: requestStatus,
                        sample_status: sampleStatus
                    };

                    return newPatientData
                }) || [];

                const allPhlebotomies = [...updatedPhlebotomiesData];

                datas.current = Array.from(
                        new Map(
                            [...datas.current, ...allPhlebotomies].map(item => [item.id, item]) // Use `id` to ensure uniqueness
                        ).values()
                    ),
                
                dataCount.current = data.getRequestByPhlebotomist.requestsCount

                setOffsets (offset + limit);
            }

        } catch (err) {
            console.log('error fetching tests catch error', err);
        } finally {
            setIsLoading(false)
            // console.log("finally")
        }
    }, [ID]);
    const [toggleAccount] = useMutation(ToggleAccountStatus, {
            variables: {
                userForApproval: ID
            },
            client,
        });
        
        const handleAccountStatusChange = async () => {
             try {
                    await toggleAccount({
                        onCompleted(data) {
                            if (data.ToggleAccountStatus.error) {
                                toast.error(data.ToggleAccountStatus.error.message);  
                                window.location.reload();
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
    
    const handleFetchPhlebNextPage = () => {
        
        if (datas.current.length < (limit * (currentPage + 1))) {
            fetchPhlebotomiesRequests(limit, offsets);
        }
        return;
        

    }

    useEffect(() => {
        fetchPhlebotomiesRequests(limit, 0);
    }, [fetchPhlebotomiesRequests, limit]);
    if (pageLoading ) {
            return <Loading />;
    }
    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageWrapper="Dashboard &nbsp;&nbsp;/&nbsp;&nbsp;Phlebotomies" pageTitle="User" showExportRecord={true} />
                    {
                        !phlebotomistData?.getUserById.approvedAt &&
                        <Approval
                            accountId={ID}
                            setLoading={setIsLoading}
                        />
                    }
                    <ToolsRequest
                        setIsOpenToolsModal={setIsOpenToolsModal}
                    />
                    <div className="px-8 py-4 grid grid-cols-[30%_calc(35%-12px)_calc(35%-12px)] gap-6">
                        <div className="">
                            <DoughnutPieAnalytics chartData={requestStatsData.getRequestStatsByUser} className=" h-[420px] rounded-xl border bg-card text-card-foreground shadow"/>
                        </div>
                        <div>
                            <div className="bg-white shadow-lg  px-4 py-4 rounded-lg ">
                                <p className="flex justify-between mt-2"><span className="text-[#525C76] text-lg">Total cash recieved</span> <span className="font-bold text-lg">{formatMoney(450090)}</span></p>
                                <p className="flex justify-between mt-2"><span className="text-[#525C76] text-lg">Total remitted</span><span className="font-bold text-lg">{formatMoney(450090)}</span></p>
                                <p className="flex justify-between mt-2"  ><span className="text-[#525C76] text-lg">Balance to be remitted</span><span className="font-bold text-lg">{formatMoney(450090)}</span></p>
                            </div>
                            
                            <div className="bg-white shadow-lg rounded px-4 py-4 mt-8" >
                                <h2>Cancellation reason</h2>
                                <div>
                                    <div className='flex justify-between '>
                                        <p className="flex space-x-4">
                                            <span className="rounded-full h-4 w-4 bg-blue-600 inline-block mt-1"></span>
                                            <span>You cancelled</span>
                                        </p>

                                        <span>34%</span>

                                    </div>
                                    <div className='flex justify-between mt-4'>
                                        <p className="flex space-x-4">
                                            <span className="rounded-full h-4 w-4 bg-red-600 inline-block mt-1"></span>
                                            <span>You did not confirm</span>
                                        </p>

                                        <span>14%</span>

                                    </div>
                                    <div className='flex justify-between mt-4'>
                                        <p className="flex space-x-4">
                                            <span className="rounded-full h-4 w-4 bg-green-600 inline-block mt-1"></span>
                                            <span>Client cancelled</span>
                                        </p>

                                        <span>34%</span>

                                    </div>
                                    <div className='flex justify-between mt-4'>
                                        <p className="flex space-x-4">
                                            <span className="rounded-full h-4 w-4 bg-yellow-600 inline-block mt-1"></span>
                                            <span>Client did not show</span>
                                        </p>

                                        <span>34%</span>

                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between">

                                <Link href={`${ID}/audit`} className="text-[#07AC85] bg-[#CAE9E2] px-6 py-2 rounded-sm">Go to audit</Link>

                                <button onClick={handleAccountStatusChange} className="bg-red-500 text-white rounded px-2 py-1">
                                    {
                                        phlebotomistData.getUserById.accountStatus == 'ACTIVE' ? 'Deactivate Phlebotomist' : 'Activate Phlebotomist'
                                    }

                                </button>
                            </div>
                        </div>
                        
                        <div className='shadow-xl bg-white px-6 py-4 rounded-lg '>
                            <div className="w-full gap-x-3 flex justify-center">
                                <div className=''>
                                    <div className="flex justify-center mt-4">
                                        <Image src={FemalePhoto} alt='profile image' className="rounded-full h-[70px] w-[70px]" />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[#525252]">
                                            {
                                                pageLoading
                                                    ? <NumberPreloader />
                                                    : `${phlebotomistData.getUserById.firstName} ${phlebotomistData.getUserById.lastName}`

                                            }
                                        </div>
                                        <div className="text-gray-500">
                                            {
                                                pageLoading
                                                    ?
                                                    <div className="mt-[2px] w-[200px]"><NumberPreloader /></div>
                                                    : `${phlebotomistData.getUserById.email}`

                                            }

                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div className="px-3 mt-6">
                                <div className="text-slate-400 text-2xl grid grid-cols-[100px_calc(100%-100px)] border-b-2 pb-1  mt-4 gap-2">
                                    <span className="text-[14px]">DOB</span>
                                    <span className="text-[14px] text-[#737272] whitespace-pre-line break-words text-right">{pageLoading ? <div className="mt-[2px] w-[200px]"><NumberPreloader /></div> : `${phlebotomistData?.getUserById?.phlebotomist.dob || '?'}`}</span>
                                </div>
                                <div className="w-full  text-slate-400 text-2xl grid grid-cols-[100px_calc(100%-100px)] border-b-2 pb-1  mt-4">
                                    <span className="text-[14px]">Gender</span>
                                    <span
                                        title={`${phlebotomistData?.getUserById?.phlebotomist.gender || 'gender'}`}
                                        className="text-[14px] text-[#737272] whitespace-pre-line break-words text-right">
                                        {pageLoading ? <div className="mt-[2px] w-[200px]"><NumberPreloader /></div> : `${phlebotomistData?.getUserById?.phlebotomist.gender || '?'}`}
                                    </span>
                                </div>

                                <div className="text-slate-400 text-2xl grid grid-cols-[100px_calc(100%-100px)] border-b-2 pb-1  mt-4">
                                    <span className="text-[14px]">Phone</span>
                                    <span className="text-[14px] text-[#737272] whitespace-pre-line break-words text-right">{pageLoading ? <div className="mt-[2px] w-[200px]"><NumberPreloader /></div> : `${phlebotomistData?.getUserById?.phoneNumber}`}</span>
                                </div>
                                <div className="text-slate-400 text-2xl grid grid-cols-[100px_calc(100%-100px)] pb-1 mt-4">
                                    <span className="text-[14px]">Address</span>
                                    <span className="text-[14px] text-[#737272] whitespace-pre-line break-words text-right">{pageLoading ? <div className="mt-[2px] w-[200px] "><NumberPreloader /></div> : 'wertyuiopwesdrftgyuhiwerftgyhujkesdfghjklertfyhujikotyuiol'}</span>
                                </div>

                            </div>
                        </div>
                    </div>
                    
                    <div className="px-8 py-4 gap-4 border-t-2 border-t-[#CACDD5] mt-4 pt-8">
                        <div className="mt-10">
                            {phlebotomistLoading

                                ?
                                <TablePreloader />
                                : 
                                
                            <AdminFacilitiesTable
                                handleSearchData={()=>{}}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                deleteAction={() => { }}
                                approveAction={() => { }} 
                                setItemToDelete={() => { }}
                                changePage={handleFetchPhlebNextPage}
                                tableHeadText='Activity information '
                                tableData={datas.current}
                                dataCount={dataCount.current}
                                searchBoxPosition='justify-start'
                                showTableHeadDetails={true}
                                showActions={false}
                                testPage='phlebotomies'
                                marginTop='mt-4'
                                showPagination={true} // used as opposite, pagination wont show when true

                                />
                            }
                        </div>
                        
                    </div>
                </div>
            </div>
            {
                isOpenToolsModal &&  
                <div className="fixed top-0 left-0 w-full h-full bg-[#7f7f7fc2] bg-opacity-50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="bg-white w-[900px] shadow-lg w-fullrounded-md p-6 z-20">
                        <div className="flex justify-between">
                            <div>
                                <h1 className="font-[600] text-[16px]">Inventory supply</h1>
                                <p className="text-[#8C93A3] text-[13px]">Allocate supply to phlebotomist</p>
                            </div>
                            <div>
                                <button
                                    className="px-2 py-2 bg-white text-gray-400 rounded-md border-[1px] border-gray-300"
                                    onClick={() => setIsOpenToolsModal(false)}
                                >
                                    <AiOutlineClose />
                                </button>
                            </div>
                        </div>

                        <Form.Root className="mt-6">
                            <div className="grid grid-cols-4 gap-y-4 gap-x-4 bg-[#EEEFF2] py-2 px-3">
                                <Form.Field name="first_name" className="grid grid-cols-[60%_40%]">
                                    <Form.Label className="text-[13px] text-[#525C76] mt-1">Sample bottle</Form.Label>
                                    <Form.Control
                                        onChange={() => { }}
                                        step={1}
                                        type="number"
                                        min={1}
                                        className="w-12 h-7 border-[1px] border-[#525c764d] focus:outline-none "
                                    />

                                </Form.Field>
                                <Form.Field name="Needle" className="grid grid-cols-[60%_40%]">
                                    <Form.Label className="text-[13px] text-[#525C76] mt-1">Needle</Form.Label>
                                    <Form.Control
                                        onChange={() => { }}
                                        step={1}
                                        type="number"
                                        min={1}
                                        className="w-12 h-7 border-[1px] border-[#525c764d] focus:outline-none "
                                    />

                                </Form.Field>
                                <Form.Field name="first_name" className="grid grid-cols-[60%_40%]">
                                    <Form.Label className="text-[13px] text-[#525C76] mt-1">Hand gloves</Form.Label>
                                    <Form.Control
                                        onChange={() => { }}
                                        step={1}
                                        type="number"
                                        min={1}
                                        className="w-12 h-7 border-[1px] border-[#525c764d] focus:outline-none "
                                    />

                                </Form.Field>
                                <Form.Field name="first_name" className="grid grid-cols-[60%_40%]">
                                    <Form.Label className="text-[13px] text-[#525C76] mt-1">Cotton wool</Form.Label>
                                    <Form.Control
                                        onChange={() => { }}
                                        step={1}
                                        type="number"
                                        min={1}
                                        className="w-12 h-7 border-[1px] border-[#525c764d] focus:outline-none "
                                    />

                                </Form.Field>
                                <Form.Field name="first_name" className="grid grid-cols-[60%_40%]">
                                    <Form.Label className="text-[13px] text-[#525C76] mt-1">Methylated spirit</Form.Label>
                                    <Form.Control
                                        onChange={() => { }}
                                        step={1}
                                        type="number"
                                        min={1}
                                        className="w-12 h-7 border-[1px] border-[#525c764d] focus:outline-none "
                                    />

                                </Form.Field>
                                <Form.Field name="first_name" className="grid grid-cols-[60%_40%]">
                                    <Form.Label className="text-[13px] text-[#525C76] mt-1">Pressure cuff</Form.Label>
                                    <Form.Control
                                        onChange={() => { }}
                                        step={1}
                                        type="number"
                                        min={1}
                                        className="w-12 h-7 border-[1px] border-[#525c764d] focus:outline-none "
                                    />

                                </Form.Field>
                                <Form.Field name="first_name" className="grid grid-cols-[60%_40%]">
                                    <Form.Label className="text-[13px] text-[#525C76] mt-1">Bolt trips</Form.Label>
                                    <Form.Control
                                        onChange={() => { }}
                                        step={1}
                                        type="number"
                                        min={1}
                                        className="w-12 h-7 border-[1px] border-[#525c764d] focus:outline-none "
                                    />

                                </Form.Field>
                                <Form.Field name="first_name" className="grid grid-cols-[60%_40%]">
                                    <Form.Label className="text-[13px] text-[#525C76] mt-1">Bolt trips</Form.Label>
                                    <Form.Control
                                        onChange={() => { }}
                                        step={1}
                                        type="number"
                                        min={1}
                                        className="w-12 h-7 border-[1px] border-[#525c764d] focus:outline-none "
                                    />

                                </Form.Field>
                                <Form.Field name="first_name" className="grid grid-cols-[60%_40%]">
                                    <Form.Label className="text-[13px] text-[#525C76] mt-1">Bolt trips</Form.Label>
                                    <Form.Control
                                        onChange={() => { }}
                                        step={1}
                                        type="number"
                                        min={1}
                                        className="w-12 h-7 border-[1px] border-[#525c764d] focus:outline-none "
                                    />

                                </Form.Field>
                            </div>

                            <Form.Submit
                                className="mt-2 w-[150px] border-2 border-[#08AC85] text-[#08AC85] px-3 py-1 text-lg rounded-sm disabled:bg-[#08ac865b]"
                                disabled={false}
                            >
                                Allocate
                            </Form.Submit>
                        </Form.Root>

                    </div>
                </div>
            }
            
            <ConfirmDeactivateModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={() => console.log('confirem')} />

        </div>
        
    )
}

export default Singlefacility
