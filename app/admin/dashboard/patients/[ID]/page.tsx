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

type FormData = {
    // Define the structure of your form data here
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
};


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
                    <Form.Root >
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
                    </Form.Root>
                </div>
            </div>
            <ConfirmDeactivateModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={() => console.log('confirem')} />

        </div>
        
    )
}

export default Patients
