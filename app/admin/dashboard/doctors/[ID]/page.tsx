/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, {  useState } from 'react'
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
import { AiOutlineClose } from "react-icons/ai";
import * as Form from '@radix-ui/react-form';
import { ToggleAccountStatus } from '@/src/graphql/mutations'
import { toast } from 'react-toastify';
import { useGetConsultationStats } from '@/src/hooks/useGetConsultationStats'

const sampleCompletedData: TableData[] = [
    {
        patients: [null, 'John Doe', 'egeregav@gmail.com'],
        test: 'Covid 19',
        amount: 30000,
        facility: 'MRS specialist/GARKI',
        sample_status: 'pending',
        result_status: 'sent',
        
    },
    {
        patients: ['male.jpg', 'Jane Smith', 'janesmith@example.com'],
        test: 'Malaria',
        amount: 20000,
        facility: 'MRS specialist/GARKI',
        sample_status: 'pending',
        result_status: 'pending'
    },
    {
        patients: ['female.jpg', 'Robert Brown', 'robertbrown@example.com'],
        test: 'Typhoid',
        amount: 15000,
        facility: 'MRS specialist/GARKI',
        sample_status: 'received',
        result_status: 'sent'
    },
    {
        patients: ['male.jpg', 'Alice Green', 'alicegreen@example.com'],
        test: 'Blood Test',
        amount: 25000,
        facility: 'MRS specialist/GARKI',
        sample_status: 'completed',
        result_status: 'pending'
    },
    {
        patients: ['female.jpg', 'Mark Johnson', 'markjohnson@example.com'],
        test: 'HIV Test',
        amount: 10000,
        facility: 'MRS specialist/GARKI',
        sample_status: 'pending',
        result_status: 'pending'
    },
    {
        patients: ['female.jpg', 'Robert Brown', 'robertbrown@example.com'],
        test: 'Typhoid',
        amount: 15000,
        facility: 'MRS specialist/GARKI',
        sample_status: 'received',
        result_status: 'sent'
    },
    {
        patients: ['male.jpg', 'Alice Green', 'alicegreen@example.com'],
        test: 'Blood Test',
        amount: 25000,
        facility: 'MRS specialist/GARKI',
        sample_status: 'completed',
        result_status: 'pending'
    },
    {
        patients: ['female.jpg', 'Mark Johnson', 'markjohnson@example.com'],
        test: 'HIV Test',
        amount: 10000,
        facility: 'MRS specialist/GARKI',
        sample_status: 'pending',
        result_status: 'pending'
    },
    {
        patients: ['female.jpg', 'Mark Johnson', 'markjohnson@example.com'],
        test: 'HIV Test',
        amount: 10000,
        facility: 'MRS specialist/GARKI',
        sample_status: 'pending',
        result_status: 'pending'
    },

];
const Singlefacility = ({ params }: { params: { ID: string } }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isOpenToolsModal, setIsOpenToolsModal] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [phlebotomistLoading, setIsLoading] = useState<boolean>(false);
    const { ID } = params;
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const { data: requestStatsData, loading: requestStatsDataLoading } = useGetConsultationStats(undefined, ID )
    const { data: doctordData, loading: pageLoading } = useQuery(GetUserById, {
            variables: {
                id: ID
            },
            client,
    });
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
    if (pageLoading ) {
            return <Loading />;
    }
    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageWrapper="Dashboard &nbsp;&nbsp;/&nbsp;&nbsp;Doctors" pageTitle="User" showExportRecord={true} />
                    {
                        !doctordData?.getUserById.approvedAt &&
                        <Approval
                            accountId={ID}
                            setLoading={setIsLoading}
                        />
                    }
                    <div className="px-8 py-4 grid grid-cols-[30%_calc(35%-12px)_calc(35%-12px)] gap-6">
                        <div className="">
                            <DoughnutPieAnalytics chartData={requestStatsData.getConsultationStatsByUser} className=" h-[420px] rounded-xl border bg-card text-card-foreground shadow"/>
                        </div>
                        <div>
                            <div className="bg-white shadow-lg  px-4 py-4 rounded-lg ">
                                <p className="flex justify-between mt-2"><span className="text-[#525C76] text-lg">Total cash recieved</span> <span className="font-bold text-lg">{formatMoney(450090)}</span></p>
                                <p className="flex justify-between mt-2"><span className="text-[#525C76] text-lg">Total remitted</span><span className="font-bold text-lg">{formatMoney(450090)}</span></p>
                                <p className="flex justify-between mt-2"  ><span className="text-[#525C76] text-lg">Balance to be remitted</span><span className="font-bold text-lg">{formatMoney(450090)}</span></p>
                            </div>
                            
                            <div className="bg-white shadow-lg rounded px-4 py-4 mt-8" >
                                <h2 className="border-b-2  border-b-black">Cancellation reason</h2>
                                <div className='pt-2'>
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
                            <div className="mt-4 flex justify-end">


                                <button onClick={handleAccountStatusChange} className="bg-red-500 text-white rounded px-2 py-1">
                                    {
                                        doctordData.getUserById.accountStatus == 'ACTIVE' ? 'Deactivate Doctor' : 'Activate Doctor'
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
                                                    : `${doctordData.getUserById.firstName} ${doctordData.getUserById.lastName}`

                                            }
                                        </div>
                                        <div className="text-gray-500">
                                            {
                                                pageLoading
                                                    ?
                                                    <div className="mt-[2px] w-[200px]"><NumberPreloader /></div>
                                                    : `${doctordData.getUserById.email}`

                                            }
                                            
                                        </div>
                                        <div className="text-gray-500">
                                            {
                                                pageLoading
                                                    ?
                                                    <div className="mt-[2px] w-[200px]"><NumberPreloader /></div>
                                                    : `${doctordData.getUserById.doctor.consultationHours}`

                                            }
                                            
                                        </div>
                                    </div>
                                </div>


                            </div>
                            <div className="px-3 mt-6">
                                <div className="text-slate-400 text-2xl grid grid-cols-[100px_calc(100%-100px)] border-b-2 pb-1  mt-4 gap-2">
                                    <span className="text-[14px]">Specialization</span>
                                    <span className="text-[14px] text-[#737272] whitespace-pre-line break-words text-right">{pageLoading ? <div className="mt-[2px] w-[200px]"><NumberPreloader /></div> : `${doctordData?.getUserById?.doctor.specialization || '?'}`}</span>
                                </div>
                                <div className="w-full  text-slate-400 text-2xl grid grid-cols-[100px_calc(100%-100px)] border-b-2 pb-1  mt-4">
                                    <span className="text-[14px]">Gender</span>
                                    <span
                                        title={`${doctordData?.getUserById?.doctor.gender || 'gender'}`}
                                        className="text-[14px] text-[#737272] whitespace-pre-line break-words text-right">
                                        {pageLoading ? <div className="mt-[2px] w-[200px]"><NumberPreloader /></div> : `${doctordData?.getUserById?.doctor.gender || '?'}`}
                                    </span>
                                </div>

                                <div className="text-slate-400 text-2xl grid grid-cols-[100px_calc(100%-100px)] border-b-2 pb-1  mt-4">
                                    <span className="text-[14px]">Phone</span>
                                    <span className="text-[14px] text-[#737272] whitespace-pre-line break-words text-right">{pageLoading ? <div className="mt-[2px] w-[200px]"><NumberPreloader /></div> : `${doctordData?.getUserById?.phoneNumber}`}</span>
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
                            <AdminFacilitiesTable
                                handleSearchData={()=>{}}
                                currentPage={1}
                                setCurrentPage={() => { }}
                                deleteAction={() => { }}
                                approveAction={() => { }} 
                                setItemToDelete={() => { }}
                                changePage={() => { }}
                                tableHeadText='Activity information'
                                tableData={sampleCompletedData}
                                searchBoxPosition='justify-start'
                                showTableHeadDetails={true}
                                showActions={false}
                                testPage='phlebotomies'
                                marginTop='mt-4'
                                showPagination={true} // used as opposite, pagination wont show when true

                            />
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
