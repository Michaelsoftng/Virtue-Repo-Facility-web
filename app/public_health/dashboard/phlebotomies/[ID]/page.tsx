"use client"
import React, {  useState } from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import * as Form from '@radix-ui/react-form'
import Image from 'next/image'
import FemalePhoto from '@/public/assets/images/femalephoto.jpg'
import ConfirmDeactivateModal from '@/src/reuseable/components/DeactivateModal'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import { formatMoney } from '@/src/partials/tables/NewRequesTable'
import { DoughtPieAnalytics } from '@/src/partials/DoughtPieAnalytics'
import Approval from '@/src/reuseable/components/Approval'
import { GetUserById } from '@/src/graphql/queries';
import { useQuery } from '@apollo/client'
import client from '@/lib/apolloClient';
import Loading from '../../loading'

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
    const [phlebotomistLoading, setIsLoading] = useState<boolean>(false);
    const { ID } = params;
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
   
   

    const { data: phlebotomistData, loading: pageLoading } = useQuery(GetUserById, {
            variables: {
                id: ID
            },
            client,
    });
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const phlebotomistId = phlebotomistData?.getUserById?.phlebotomist.id;
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
                    
                    
                    <Form.Root >
                        <div className="px-8 py-4 grid grid-cols-[75%_25%] gap-8">
                            <div>
                                <div className="w-full  grid grid-cols-[50%_50%]  gap-x-3 px-4 py-3">

                                    <div className="">
                                        <h3 className="text-black font-bold">Personal information</h3>
                                        <Form.Field name='referralSource' className="mt-2">
                                            <Form.Label><span className="text-sm font-semibold text-[#B2B7C2]">First name</span></Form.Label>
                                            <Form.Control
                                                required={true}
                                                value={phlebotomistData?.getUserById?.firstName}
                                                type='text'
                                                readOnly
                                                className="mt-2 font-bold text-sm block text-[#B2B7C2] bg-[#e2e4e873] border-solid border-2 border-gray-300 rounded w-full px-3 py-3" />
                                        </Form.Field>

                                        <Form.Field name='referralSource' className="mt-2">
                                            <Form.Label><span className="text-sm font-bold text-[#B2B7C2] capitalize">Last name</span></Form.Label>
                                            <Form.Control
                                                required={true}
                                                readOnly
                                                value={phlebotomistData?.getUserById?.lastName}
                                                type='text'
                                                className="mt-2 font-semibold text-sm block text-[#B2B7C2] bg-[#e2e4e873] border-solid border-2 border-gray-300 rounded w-full px-3 py-3" />
                                        </Form.Field>
                                        <Form.Field name='referralSource' className="mt-2">
                                            <Form.Label><span className="text-sm font-bold text-[#B2B7C2] capitalize">Address</span></Form.Label>
                                            <Form.Control
                                                readOnly
                                                required={true}
                                                placeholder={phlebotomistData?.getUserById?.streetAddress}
                                                type='text'
                                                className="mt-2 font-semibold text-sm block text-[#B2B7C2] bg-[#e2e4e873]  border-solid border-2 border-gray-300 rounded w-full px-3 py-3" />
                                        </Form.Field>
                                        <Form.Field name='referralSource' className="mt-2">
                                            <Form.Label><span className="text-sm font-bold text-[#B2B7C2] capitalize">City</span></Form.Label>
                                            <Form.Control
                                                required={true}
                                                value={phlebotomistData?.getUserById?.city}
                                                type='text'
                                                readOnly
                                                className="mt-2 font-semibold text-sm block text-[#B2B7C2] bg-[#e2e4e873]  border-solid border-2 border-gray-300 rounded w-full px-3 py-3" />
                                        </Form.Field>
                                        <Form.Field name='referralSource' className="mt-2">
                                            <Form.Label><span className="text-sm font-bold text-[#B2B7C2] capitalize">Postal</span></Form.Label>
                                            <Form.Control
                                                required={true}
                                                value={phlebotomistData?.getUserById?.postal}
                                                type='text'
                                                readOnly
                                                className="mt-2 font-semibold text-sm block text-[#B2B7C2] bg-[#e2e4e873]  border-solid border-2 border-gray-300 rounded w-full px-3 py-3" />
                                        </Form.Field>
                                    </div>
                                    <div>
                                        <h3 className="text-black font-bold">Account information</h3>
                                        <Form.Field name='referralSource' className="mt-2">
                                            <Form.Label><span className="text-sm font-bold text-[#B2B7C2] capitalize">Email</span></Form.Label>
                                            <Form.Control
                                                readOnly
                                                required={true}
                                                value={phlebotomistData?.getUserById?.email}
                                                type='email'
                                                className="mt-2 font-semibold text-sm block text-[#B2B7C2] bg-[#e2e4e873] border-solid border-2 border-gray-300 rounded w-full px-3 py-3" />
                                        </Form.Field>

                                        <Form.Field name='referralSource' className="mt-2">
                                            <Form.Label><span className="text-sm font-bold text-[#B2B7C2]">Phone no</span></Form.Label>
                                            <Form.Control
                                                readOnly
                                                required={true}
                                                value={phlebotomistData?.getUserById?.phoneNumber}
                                                type='text'
                                                className="mt-2 font-semibold text-sm block text-[#B2B7C2] bg-[#e2e4e873] border-solid border-2 border-gray-300 rounded w-full px-3 py-3" />
                                        </Form.Field>
                                        
                                        <Form.Field name="password_confirmation" className="relative block mt-3">
                                            <Form.Label className="text-sm font-bold text-[#B2B7C2] block ">Apartment </Form.Label>
                                            <Form.Control
                                               
                                                required
                                                value={phlebotomistData?.getUserById?.streetAddress2}
                                                readOnly
                                                className="mt-2 font-semibold text-sm block text-[#B2B7C2] bg-[#e2e4e873] border-solid border-2 border-gray-300 rounded w-full px-3 py-3"
                                            />

                                        </Form.Field>
                                        <Form.Field name="password_confirmation" className="relative block mt-3">
                                            <Form.Label className="text-[#B2B7C2] block font-bold text-[14px]">State</Form.Label>
                                            <Form.Control
                                                
                                                required
                                                value={phlebotomistData?.getUserById?.state}
                                                readOnly
                                                className="mt-2 font-semibold text-sm block text-[#B2B7C2] bg-[#e2e4e873] border-solid border-2 border-gray-300 rounded w-full px-3 py-3"
                                            />

                                        </Form.Field>
                                        <Form.Field name="password_confirmation" className="relative block mt-2">
                                            <Form.Label className="text-[#B2B7C2] block font-semibold text-[14px]">Country</Form.Label>
                                            <Form.Control
                                               
                                                required
                                                readOnly
                                                value='Nigeria'
                                                className="mt-2 font-semibold text-sm block text-[#B2B7C2] bg-[#e2e4e873] border-solid border-2 border-gray-300 rounded w-full px-3 py-3"
                                            />

                                        </Form.Field>
                                    </div>
                                </div>
                                        
                                <div className="flex justify-start w-full pl-5 pt-5">
                                    <Form.Submit className="border-2 border-[#FF3236] px-10 py-1 text-sm text-[#FF3236] rounded hover:bg-slate-800" onClick={() => setShowDeleteModal(true)}>Deactivate Account</Form.Submit>
                                </div>
                            
                            </div>
                            <div className=" gap-x-3 mt-10 px-4 pt-6">
                                <Image src={FemalePhoto} alt='pprofile image' className="rounded-lg h-[300px] w-[300px]"/>
                                
                            </div>
                        </div>
                    </Form.Root>
                    <div className="px-8 py-4 gap-4 grid grid-cols-[70%_30%] border-t-2 border-t-[#CACDD5] mt-4 pt-8">
                        <div className="mt-10">
                            <AdminFacilitiesTable
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
                        <div>
                            <div className="bg-white shadow-lg rounded px-4 py-4 ">
                                <p className="flex justify-between mt-2"><span className="text-[#525C76] text-lg">Total cash recieved</span> <span className="font-bold text-lg">{formatMoney(450090)}</span></p>
                                <p className="flex justify-between mt-2"><span className="text-[#525C76] text-lg">Total remitted</span><span className="font-bold text-lg">{formatMoney(450090)}</span></p>
                                <p className="flex justify-between mt-2"  ><span className="text-[#525C76] text-lg">Balance to be remitted</span><span className="font-bold text-lg">{formatMoney(450090)}</span></p>
                            </div>
                            <div className="mt-4">
                                <DoughtPieAnalytics />
                            </div>

                            <div className="bg-white shadow-lg rounded px-4 py-4 mt-4" >
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
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmDeactivateModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={() => console.log('confirem')} />

        </div>
        
    )
}

export default Singlefacility
