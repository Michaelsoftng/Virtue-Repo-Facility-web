/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { ChangeEvent, useState } from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import * as Form from '@radix-ui/react-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoIosWarning } from "react-icons/io";
import Image from 'next/image'
import FemalePhoto from '@/public/assets/images/femalephoto.jpg'
import ConfirmDeactivateModal from '@/src/reuseable/components/DeactivateModal'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import { PiGenderIntersexFill } from "react-icons/pi";
import { FaPhoneSquare } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import { TableData } from '@/src/types/TableData.type'
type FormData = {
    // Define the structure of your form data here
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
};

const sampleCompletedData: TableData[] = [
    {
        facility: 'MRS specialist',
        location: '15 jumble street, Garki',
        available_test: 300,
        rating: 5,
    },
    {
        facility: 'MRS specialist',
        location: '15 jumble street, Garki',
        available_test: 300,
        rating: 5,
    },
    {

        facility: 'MRS specialist',
        location: '15 jumble street, Garki',
        available_test: 300,
        rating: 5,
    },
    {

        facility: 'MRS specialist',
        location: '15 jumble street, Garki',
        available_test: 300,
        rating: 5,
    },
    {

        facility: 'MRS specialist',
        location: '15 jumble street, Garki',
        available_test: 300,
        rating: 5,
    },


];

const Patients = () => {
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>();
    const [formValidationErrors, setFormValidationErrors] = useState({
        isPasswordMatchRegex: false,
        passwordError: 'Password is not strong enough, must be 10 characters long, contain at least one number and special character!',
        isPasswordConfirmed: false,
        confirmPasswordError: 'Passwords do not match',
        hasError: false
    });
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const passwordValidation = (passwordValue: string) => {
        const pattern = new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*,.])[a-zA-Z0-9!@#$%^&*,.]{10,}$', 'gmi');
        const isMatch = pattern.test(passwordValue);
        if (isMatch) {
            setFormValidationErrors({
                ...formValidationErrors,
                isPasswordMatchRegex: isMatch,
                passwordError: ''
            });
        } else {
            setFormValidationErrors({
                ...formValidationErrors,
                hasError: true
            });

        }

    }

    const passwordConfirmation = (confirmPassword: string, password?: string) => {
        if (confirmPassword === password) {
            setFormValidationErrors({
                ...formValidationErrors,
                isPasswordConfirmed: true,
                confirmPasswordError: ''
            });
        }
    }
    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case 'password':
                passwordValidation(value)
                break;
            case 'password_confirmation':
                passwordConfirmation(value, formData?.password)
                break;
            default:
                break;
        }
        setFormData({ ...formData, [name]: value })
    }

    // const disableSubmitBtn = useCallback((): boolean => {
    //     return (
    //         !formValidationErrors.isPasswordMatchRegex &&
    //         !formValidationErrors.isPasswordConfirmed
    //     )
    // }, [formValidationErrors]);
    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageWrapper="Dashboard &nbsp;&nbsp;/&nbsp;&nbsp;Patients" pageTitle="User" showExportRecord={true} />
                    <div className='grid grid-cols-[60%_40%] gap-4 pl-2'>
                        <div className="">
                            <AdminFacilitiesTable
                                currentPage={1}
                                setCurrentPage={() => { }}
                                deleteAction={() => { }}
                                approveAction={() => { }}
                                setItemToDelete={() => { }}
                                changePage={() => { }}
                                tableHeadText='5 Test Requests'
                                tableData={sampleCompletedData}
                                searchBoxPosition='justify-start'
                                showTableHeadDetails={true}
                                showActions={true}
                                showPagination={true}
                                testPage='phlebotomies'
                                marginTop='mt-4'
                                dataCount={12}
                            // currentPage={currentPage}
                            // setCurrentPage={setCurrentPage}
                            // changePage={handleFetchNextPage}
                            />

                            <AdminFacilitiesTable
                                currentPage={1}
                                setCurrentPage={() => { }}
                                deleteAction={() => { }}
                                approveAction={() => { }}
                                setItemToDelete={() => { }}
                                changePage={() => { }}
                                tableHeadText={`5 consultations`}
                                tableData={sampleCompletedData}
                                searchBoxPosition='justify-start'
                                showTableHeadDetails={true}
                                showActions={true}
                                showPagination={true}
                                testPage='phlebotomies'
                                marginTop='mt-4'

                                dataCount={12}
                            // currentPage={currentPage}
                            // setCurrentPage={setCurrentPage}
                            // changePage={handleFetchNextPage}
                            />
                        </div>
                        
                        <div>
                            
                            <div className='shadow-xl bg-white px-6 py-6 mt-3 rounded-sm'>
                                <div className="w-full gap-x-3 flex justify-center">
                                    <div className=''>
                                        <div className="flex justify-center">
                                            <Image src={FemalePhoto} alt='pprofile image' className="rounded-lg h-[70px] w-[70px]" />
                                        </div>
                                        <div className="text-center">
                                            <p>Egerega Virtue</p>
                                            <p>egeregav@gmail.com</p>
                                        </div>
                                    </div>


                                </div>
                                <div className="px-5 mt-10">
                                    <p className="text-slate-400 text-2xl flex border-b-2 pb-1  mt-4"><span className=""><BsFillCalendar2DateFill /></span><span className="ml-3 text-[16px]">DOB</span> <span></span></p>
                                    <p className="text-slate-400 text-2xl flex border-b-2 pb-1  mt-4"><span className=""><PiGenderIntersexFill /></span><span className="ml-3 text-[16px]">Gender</span> <span></span></p>

                                    <p className="text-slate-400 text-2xl flex border-b-2 pb-1  mt-4"><span className=""><FaPhoneSquare /></span><span className="ml-3 text-[16px]">Phone</span> <span></span></p>
                                    <p className="text-slate-400 text-2xl flex border-b-2 pb-1 mt-4"><span className=""><FaLocationDot /></span><span className="ml-3 text-[16px]">Address</span> <span></span></p>

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

                                        <span className="font-bold">4</span>

                                    </div>
                                    <div className='flex justify-between mt-4'>
                                        <p className="flex space-x-4">
                                            <span className="rounded-full h-4 w-4 bg-blue-600 inline-block mt-1"></span>
                                            <span>Ongoing</span>
                                        </p>

                                        <span className="font-bold">34</span>

                                    </div>
                                    <div className='flex justify-between mt-4'>
                                        <p className="flex space-x-4">
                                            <span className="rounded-full h-4 w-4 bg-yellow-600 inline-block mt-1"></span>
                                            <span>Pending</span>
                                        </p>

                                        <span className="font-bold">34</span>

                                    </div>
                                    <div className='flex justify-between mt-4'>
                                        <p className="flex space-x-4">
                                            <span className="rounded-full h-4 w-4 bg-red-600 inline-block mt-1"></span>
                                            <span>Cancelled</span>
                                        </p>

                                        <span className="font-bold">14</span>

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

                                        <span className="font-bold">4</span>

                                    </div>
                                    <div className='flex justify-between mt-4'>
                                        <p className="flex space-x-4">
                                            <span className="rounded-full h-4 w-4 bg-blue-600 inline-block mt-1"></span>
                                            <span>Ongoing</span>
                                        </p>

                                        <span className="font-bold">34</span>

                                    </div>
                                    <div className='flex justify-between mt-4'>
                                        <p className="flex space-x-4">
                                            <span className="rounded-full h-4 w-4 bg-yellow-600 inline-block mt-1"></span>
                                            <span>Pending</span>
                                        </p>

                                        <span className="font-bold">34</span>

                                    </div>
                                    <div className='flex justify-between mt-4'>
                                        <p className="flex space-x-4">
                                            <span className="rounded-full h-4 w-4 bg-red-600 inline-block mt-1"></span>
                                            <span>Cancelled</span>
                                        </p>

                                        <span className="font-bold">14</span>

                                    </div>
                                    
                                    
                                </div>
                            </div>
                           
                            
                        </div>
                        
                    </div>
                    
                    {/* <Form.Root >
                        <div className="px-8 py-4 grid grid-cols-[75%_25%] gap-8">
                            <div>
                                <div className="w-full  grid grid-cols-[50%_50%]  gap-x-3 px-4 py-3">

                                    <div className="">
                                        <h3 className="text-black font-bold">Personal information</h3>
                                        <Form.Field name='referralSource' className="mt-4">
                                            <Form.Label><span className="text-sm font-semibold text-[#B2B7C2]">First name</span></Form.Label>
                                            <Form.Control
                                                required={true}
                                                
                                                type='text'
                                                className="mt-2 font-bold text-sm block text-[#B2B7C2] bg-[#e2e4e873] border-solid border-2 border-gray-300 rounded w-full px-3 py-3" />
                                        </Form.Field>

                                        <Form.Field name='referralSource' className="mt-4">
                                            <Form.Label><span className="text-sm font-bold text-[#B2B7C2] capitalize">Last name</span></Form.Label>
                                            <Form.Control
                                                required={true}
                                                
                                                type='text'
                                                className="mt-2 font-semibold text-sm block text-[#B2B7C2] bg-[#e2e4e873] border-solid border-2 border-gray-300 rounded w-full px-3 py-3" />
                                        </Form.Field>
                                        <Form.Field name='referralSource' className="mt-4">
                                            <Form.Label><span className="text-sm font-bold text-[#B2B7C2] capitalize">Address</span></Form.Label>
                                            <Form.Control
                                                required={true}
                                                
                                                type='text'
                                                className="mt-2 font-semibold text-sm block text-[#B2B7C2] bg-[#e2e4e873]  border-solid border-2 border-gray-300 rounded w-full px-3 py-3" />
                                        </Form.Field>
                                        <Form.Field name='referralSource' className="mt-4">
                                            <Form.Label><span className="text-sm font-bold text-[#B2B7C2] capitalize">DOB</span></Form.Label>
                                            <Form.Control
                                                required={true}
                                                
                                                type='date'
                                                className="mt-2 font-semibold text-sm block text-[#B2B7C2] bg-[#e2e4e873]  border-solid border-2 border-gray-300 rounded w-full px-3 py-3" />
                                        </Form.Field>
                                        <Form.Field name='referralSource' className="mt-4">
                                            <Form.Label><span className="text-sm font-bold text-[#B2B7C2] capitalize">Gender</span></Form.Label>
                                            <Form.Control
                                                required={true}
                                                
                                                type='text'
                                                className="mt-2 font-semibold text-sm block text-[#B2B7C2] bg-[#e2e4e873]  border-solid border-2 border-gray-300 rounded w-full px-3 py-3" />
                                        </Form.Field>
                                    </div>
                                    <div>
                                        <h3 className="text-black font-bold">Account information</h3>
                                        <Form.Field name='referralSource' className="mt-4">
                                            <Form.Label><span className="text-sm font-bold text-[#B2B7C2] capitalize">Email</span></Form.Label>
                                            <Form.Control
                                                required={true}
                                                
                                                type='email'
                                                className="mt-2 font-semibold text-sm block text-[#B2B7C2] bg-[#e2e4e873] border-solid border-2 border-gray-300 rounded w-full px-3 py-3" />
                                        </Form.Field>

                                        <Form.Field name='referralSource' className="mt-4">
                                            <Form.Label><span className="text-sm font-bold text-[#B2B7C2]">Phone no</span></Form.Label>
                                            <Form.Control
                                                required={true}
                                                
                                                type='text'
                                                className="mt-2 font-semibold text-sm block text-[#B2B7C2] bg-[#e2e4e873] border-solid border-2 border-gray-300 rounded w-full px-3 py-3" />
                                        </Form.Field>
                                        
                                        <Form.Field name="password_confirmation" className="relative block mt-5">
                                            <Form.Label className="text-sm font-bold text-[#B2B7C2] block ">Current password</Form.Label>
                                            <Form.Control
                                                onChange={handleFormChange}
                                                required
                                                type={passwordVisibility ? "text" : "password"}
                                                placeholder='Re-type Password'
                                                className="mt-2 font-semibold text-sm block text-[#B2B7C2] bg-[#e2e4e873] border-solid border-2 border-gray-300 rounded w-full px-3 py-3"
                                            />

                                            <span
                                                onClick={() => setPasswordVisibility(!passwordVisibility)}
                                                data-testid='confirmToggleButton'
                                                id='confirmtoggleButton'
                                                className='absolute top-[52%] bottom-[55%] right-[20px] color text-gray-500 text-[1rem] transform -translate-y-1/2 cursor-pointer'
                                            >
                                                {passwordVisibility ? <FaEye /> : <FaEyeSlash />}
                                            </span>
                                            <Form.Message
                                                className="text-sm text-red-500 grid grid-cols-[25px_calc(100%-25px)] mt-1 font-semibold"
                                                match={() => formValidationErrors.hasError}
                                            >
                                                <IoIosWarning className="text-[19px]" /> <span>{formValidationErrors.hasError && formValidationErrors.confirmPasswordError}</span>
                                            </Form.Message>
                                        </Form.Field>
                                        <Form.Field name="password_confirmation" className="relative block mt-4">
                                            <Form.Label className="text-[#B2B7C2] block font-bold text-[14px]">New password</Form.Label>
                                            <Form.Control
                                                onChange={handleFormChange}
                                                required
                                                type={passwordVisibility ? "text" : "password"}
                                                placeholder='Re-type Password'
                                                className="mt-[10px] font-semibold text-sm block text-[#B2B7C2] bg-[#e2e4e873] border-solid border-2 border-gray-300 rounded w-full px-3 py-3"
                                            />

                                            <span
                                                onClick={() => setPasswordVisibility(!passwordVisibility)}
                                                data-testid='confirmToggleButton'
                                                id='confirmtoggleButton'
                                                className='absolute top-[52%] bottom-[55%] right-[20px] color text-gray-500 text-[1rem] transform -translate-y-1/2 cursor-pointer'
                                            >
                                                {passwordVisibility ? <FaEye /> : <FaEyeSlash />}
                                            </span>
                                            <Form.Message
                                                className="text-sm text-red-500 grid grid-cols-[25px_calc(100%-25px)] mt-1 font-semibold"
                                                match={() => formValidationErrors.hasError}
                                            >
                                                <IoIosWarning className="text-[19px]" /> <span>{formValidationErrors.hasError && formValidationErrors.confirmPasswordError}</span>
                                            </Form.Message>
                                        </Form.Field>
                                        <Form.Field name="password_confirmation" className="relative block mt-5">
                                            <Form.Label className="text-[#B2B7C2] block font-semibold text-[14px]">Confirm password</Form.Label>
                                            <Form.Control
                                                onChange={handleFormChange}
                                                required
                                                type={passwordVisibility ? "text" : "password"}
                                                placeholder='Re-type Password'
                                                className="mt-[10px] font-semibold text-sm block text-[#B2B7C2] bg-[#e2e4e873] border-solid border-2 border-gray-300 rounded w-full px-3 py-3"
                                            />

                                            <span
                                                onClick={() => setPasswordVisibility(!passwordVisibility)}
                                                data-testid='confirmToggleButton'
                                                id='confirmtoggleButton'
                                                className='absolute top-[52%] bottom-[55%] right-[20px] color text-gray-500 text-[1rem] transform -translate-y-1/2 cursor-pointer'
                                            >
                                                {passwordVisibility ? <FaEye /> : <FaEyeSlash />}
                                            </span>
                                            <Form.Message
                                                className="text-sm text-red-500 grid grid-cols-[25px_calc(100%-25px)] mt-1 font-semibold"
                                                match={() => formValidationErrors.hasError}
                                            >
                                                <IoIosWarning className="text-[19px]" /> <span>{formValidationErrors.hasError && formValidationErrors.confirmPasswordError}</span>
                                            </Form.Message>
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
                    </Form.Root> */}
                </div>
            </div>
            <ConfirmDeactivateModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={() => console.log('confirem')} />

        </div>
        
    )
}

export default Patients
