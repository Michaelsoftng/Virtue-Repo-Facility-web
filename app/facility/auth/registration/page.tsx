/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { ChangeEvent, FormEvent, useState, useCallback } from 'react';
import Logo from '@/src/reuseable/components/Logo'
import * as Form from '@radix-ui/react-form';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IRegister } from '@/src/reuseable/interfaces/register.interface'
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";
import { IoIosWarning } from "react-icons/io";

const Registration: React.FC = () => {
    const [formData, setFormData] = useState<IRegister>();
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
        // switch (name) {
        // 	case 'password':
        // 		passwordValidation(value)
        // 		break;
        // 	case 'password_confirmation':
        // 		passwordConfirmation(value, formData?.password)
        // 		break;
        // 	default:
        // 		break;
        // }
        setFormData({ ...formData, [name]: value })
    }

    const disableSubmitBtn = useCallback((): boolean => {
        return (
            !formValidationErrors.isPasswordMatchRegex &&
            !formValidationErrors.isPasswordConfirmed
        )
    }, [formValidationErrors]);
  return (
    <div className="px-[100px] py-[30px] ">
        <div className="w-full p">
            <div className="w-[200px] ">
                <Logo />
            </div>
        </div>
        <div className="w-full md:w-[400px] mx-auto">
            <div className="">
                <Form.Root className="w-full mx-auto">
                    <h3 className="text-black font-bold text-[20px]">Sign Up</h3>
                    <Form.Field name="facilityname" className="block mb-4 mt-2">
                        <Form.Label className="block font-semibold text-[14px]">Facility Name</Form.Label>
                        <Form.Control onChange={handleFormChange}
                            type="text"
                            required
                            placeholder='Facility name'
                            className="focus:outline focus:outline-offset-0 focus:outline-green-500 px-[15px] py-[10px] text-[14px] font-medium text-black border-solid block border-[1.5px] rounded-sm border-gray-300 w-[100%] mx-auto"
                        />
                        <Form.Message className="text-sm text-red-500 grid grid-cols-[25px_calc(100%-25px)] mt-1 font-semibold" match="valueMissing">
                           
                              <IoIosWarning className="text-[19px]" /> <span>Facility name can not be empty</span>
                        </Form.Message>
                    </Form.Field>

                    <Form.Field name="email" className="block my-4">
                        <Form.Label className="block font-semibold text-[14px]">Facility Email</Form.Label>
                        <Form.Control
                            onChange={handleFormChange}
                            required
                            type="email"
                            placeholder='Email address'
                            className="outline-offset-0 outline-[#a673ef] px-[15px] py-[10px] font-medium text-black border-solid block border-[1.5px] rounded-sm border-gray-300 w-[100%] mx-auto" />
                        <Form.Message 
                            className="text-sm text-red-500 grid grid-cols-[25px_calc(100%-25px)] mt-1 font-semibold"
                              match={(error) => error === "typeMismatch" || error === "valueMissing"}
                        >
                            <IoIosWarning className="text-[19px]"/> <span>Enter a valid email address</span>
                        </Form.Message>
                    </Form.Field>


                    <Form.Field name="password" className="relative block my-4">
                        <Form.Label className="block font-semibold text-[14px]">Password</Form.Label>
                        <Form.Control
                            onChange={handleFormChange}
                            required
                            placeholder='Password'
                            type={passwordVisibility ? "text" : "password"}
                            className="outline-offset-0 outline-[#a673ef] px-[15px] py-[10px] font-medium text-black border-solid block border-[1.5px] rounded-sm border-gray-300 w-[100%] mx-auto" 
                        />
             
                        <span
                            onClick={() => setPasswordVisibility(!passwordVisibility)}
                            data-testid='confirmToggleButton'
                            id='confirmtoggleButton'
                            className='absolute top-[42%] bottom-[55%] right-[20px] color text-gray-500 text-[1rem] transform -translate-y-1/2 cursor-pointer'
                        >
                            {passwordVisibility ? <FaEye /> : <FaEyeSlash />}
                        </span>
                        {/* <Form.Message match={() => formValidationErrors.hasError} className="block text-xs text-red-500">
                            {formValidationErrors.hasError && formValidationErrors.passwordError}
                          </Form.Message> */}
                          
                          <Form.Message
                              className="text-sm text-yellow-400 grid grid-cols-[25px_calc(100%-25px)] mt-1 font-semibold"
                              match={() => formValidationErrors.hasError} 
                            >
                              <IoIosWarning className="text-[19px]" /> <span>{formValidationErrors.hasError && formValidationErrors.passwordError}</span>
                          </Form.Message>
                    </Form.Field>


                    <Form.Field name="password_confirmation" className="relative block my-4">
                        <Form.Label className="block font-semibold text-[14px]">Re-type Password</Form.Label>
                        <Form.Control
                            onChange={handleFormChange}
                            required
                              type={passwordVisibility ? "text" : "password"}
                              placeholder='Re-type Password'
                            className="outline-offset-0 outline-[#a673ef] px-[15px] py-[10px] font-medium text-black border-solid block border-[1.5px] rounded-sm border-gray-300 w-[100%] mx-auto"
                        />
                
                        <span
                            onClick={() => setPasswordVisibility(!passwordVisibility)}
                            data-testid='confirmToggleButton'
                            id='confirmtoggleButton'
                            className='absolute top-[42%] bottom-[55%] right-[20px] color text-gray-500 text-[1rem] transform -translate-y-1/2 cursor-pointer'
                        >
                            {passwordVisibility ? <FaEye /> : <FaEyeSlash />}
                        </span>
                        {/* <Form.Message match={() => formValidationErrors.hasError} className="block text-xs text-red-500">
                            {formValidationErrors.hasError && formValidationErrors.confirmPasswordError}
                        </Form.Message> */}
                        <Form.Message 
                              className="text-sm text-red-500 grid grid-cols-[25px_calc(100%-25px)] mt-1 font-semibold"
                              match={() => formValidationErrors.hasError}
                          >
                              <IoIosWarning className="text-[19px]" /> <span>{formValidationErrors.hasError && formValidationErrors.confirmPasswordError}</span>
                        </Form.Message>
                    </Form.Field>

                    <div className="flex items-center">
                          <Checkbox.Root
                              className="w-6 h-6 rounded-md border-2 border-gray-300 flex items-center 
                              justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              defaultChecked
                              id="c1">
                            <Checkbox.Indicator>
                                <CheckIcon />
                            </Checkbox.Indicator>
                        </Checkbox.Root>
                        <label className="Label" htmlFor="c1">
                            I agree with the terms and conditions
                        </label>
                    </div>
                    
                    <Form.Submit className="mt-4 w-full bg-green-600 px-4 py-2 fond-semi-bold text-lg text-white rounded-sm">Sign up</Form.Submit>

                    <div className="w-full mt-3">
                        <Link href={'#'} className="text-green-400 text-[12px] font-semibold">Forgot password ?</Link>
                    </div>
                    <div className="w-full text-center mt-3">
                        <p>Or</p>
                    </div>
                    
                    <div className="w-full">
                        <Link href={'#'} className="inline-grid w-full rounded-sm border-green-400 border-solid text-green-600 "> <span>Continue with Google</span> <FcGoogle /></Link>
                    </div>

                    {/* disabled={disableSubmitBtn()} */}
                </Form.Root>
            </div>
            <div>

            </div>  
        </div>
        
    </div>
  )
}

export default Registration
