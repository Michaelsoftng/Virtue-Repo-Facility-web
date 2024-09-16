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
import FooterNav from '@/src/reuseable/components/FooterNav';
const Signin: React.FC = () => {
    const [formData, setFormData] = useState<IRegister>();
    const [passwordVisibility, setPasswordVisibility] = useState(false);


    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    return (
        <div className="px-[100px] py-[30px] ">
            <div className="w-full p">
                <div className="w-[200px] ">
                    <Logo />
                </div>
            </div>
            <div className="w-full md:w-[350px] lg:w-[400px] mx-auto md:mt-20 lg:mt-24">
                <div className="">
                    <Form.Root className="w-full mx-auto">
                        <h3 className="text-black font-bold text-[20px] lg:text-[24px]">Log in</h3>

                        <Form.Field name="email" className="block my-4">
                            <Form.Label className="block font-semibold text-[14px]">Facility Email</Form.Label>
                            <Form.Control
                                onChange={handleFormChange}
                                required
                                type="email"
                                placeholder='Email address'
                                className="focus:outline focus:outline-offset-0 focus:outline-[#09CFA0]  px-[15px] py-[10px] font-medium text-black border-solid block border-[1.5px] rounded-sm border-gray-300 w-[100%] mx-auto" />
                            <Form.Message
                                className="text-sm text-red-500 grid grid-cols-[25px_calc(100%-25px)] mt-1 font-semibold"
                                match={(error) => error === "typeMismatch" || error === "valueMissing"}
                            >
                                <IoIosWarning className="text-[19px]" /> <span>Enter a valid email address</span>
                            </Form.Message>
                        </Form.Field>


                        <Form.Field name="password" className="relative block my-4">
                            <Form.Label className="block font-semibold text-[14px]">Password</Form.Label>
                            <Form.Control
                                onChange={handleFormChange}
                                required
                                placeholder='Password'
                                type={passwordVisibility ? "text" : "password"}
                                className="focus:outline focus:outline-offset-0 focus:outline-[#09CFA0]  px-[15px] py-[10px] font-medium text-black border-solid block border-[1.5px] rounded-sm border-gray-300 w-[100%] mx-auto"
                            />

                            <span
                                onClick={() => setPasswordVisibility(!passwordVisibility)}
                                data-testid='confirmToggleButton'
                                id='confirmtoggleButton'
                                className='absolute top-[42%] bottom-[55%] right-[20px] color text-gray-500 text-[1rem] transform -translate-y-1/2 cursor-pointer'
                            >
                                {passwordVisibility ? <FaEye /> : <FaEyeSlash />}
                            </span>
                            <Form.Message
                                className="text-sm text-yellow-400 grid grid-cols-[25px_calc(100%-25px)] mt-1 font-semibold"
                                match="valueMissing"
                            >
                                <IoIosWarning className="text-[19px]" /> <span>Paassword can not be empty</span>
                            </Form.Message>
                        </Form.Field>


                        <div className="grid grid-cols-[35px_calc(100%-35px)]">
                            <Checkbox.Root
                                className="w-5 h-5 rounded-xs border-2 border-[#09CFA0] flex items-center 
                              justify-center appearance-none
                               checked:bg-[#09CFA0] focus:outline-none focus:ring-0
                               focus:ring-[#09CFA0] focus:border-[#09CFA0]"
                                defaultChecked
                                id="c1">
                                <Checkbox.Indicator className="text-[#09CFA0]">
                                    <CheckIcon />
                                </Checkbox.Indicator>
                            </Checkbox.Root>
                            <label className="Label text-[14px]" htmlFor="c1">
                                Keep me logged in
                            </label>
                        </div>

                        <Form.Submit className="mt-8 w-full bg-[#08AC85] px-4 py-2 fond-semi-bold text-lg text-white rounded-sm">Sign up</Form.Submit>

                        <div className="w-full mt-3">
                            <Link href={'#'} className="text-green-400 text-[12px] font-semibold">Forgot password ?</Link>
                        </div>
                        <div className="w-full text-center mt-1">
                            <p>Or</p>
                        </div>

                        <div className="w-full mt-2">
                            <Link href={'#'} className="bg-white inline-flex space-x-2 justify-center py-2 w-full rounded-sm border-2 border-green-400 border-solid text-green-600 "> <span>Continue with Google</span> <FcGoogle className="text-[25px]" /></Link>
                        </div>

                        {/* disabled={disableSubmitBtn()} */}
                    </Form.Root>
                </div>
                <div className="md:mt-20 lg:mt-16">
                    <FooterNav />
                </div>
            </div>

        </div>
    )
}

export default Signin
