/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { ChangeEvent, FormEvent, useState, useCallback } from 'react';
import Logo from '@/src/reuseable/components/Logo'
import * as Form from '@radix-ui/react-form';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IResendVerification } from '@/src/interface'
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";
import { IoIosWarning } from "react-icons/io";
import FooterNav from '@/src/reuseable/components/FooterNav';
import { useMutation } from '@apollo/client';
import { ResendVerificationCode } from '@/src/graphql/mutations';
import client from '@/lib/apolloClient';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';

const ResendVerification: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<IResendVerification>({ email: '' });
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [isloading, setIsLoading] = useState<boolean>(false)
    const [buttonMessage, setButtonMessage] = useState<string>('Resend Code');

    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value } as IResendVerification)
    }

    const [resendVerificationCode, { loading }] = useMutation(ResendVerificationCode, {
        variables: {
            user: formData!.email,
        },
        client,
    });

    const disableSubmitBtn = useCallback((): boolean => {

        return (
            !formData ||
            !formData.email ||
            formData.email === '' || isloading
        );
    }, [formData, isloading]);

    const handleResendVerification = async (e: React.FormEvent) => {
        setButtonMessage('Resending...')
        e.preventDefault();
        setIsLoading(true)
        try {
            const { data } = await resendVerificationCode({
                async onCompleted(data) {
                    if (data.ResendVerificationCode.success) {
                        toast.success(data?.ResendVerificationCode?.success?.message);
                        router.push('/admin/auth/verify-account');
                    } else {
                        toast.success(data?.ResendVerificationCode?.errors?.message);
                    }

                },
                onError(e) {
                    toast.error(e.message);

                },
            }); // Execute the mutation

        } catch (err) {
            console.error('Error creating user:', err);
        } finally {
            setIsLoading(false)
            setButtonMessage('Verify')
        }
    };
    return (
        <div className="px-[100px] py-[30px] ">
            <div className="w-full p">
                <div className="w-[200px] ">
                    <Logo />
                </div>
            </div>
            <div className="w-full md:w-[350px] lg:w-[400px] mx-auto md:mt-20 lg:mt-24">
                <div className="">
                    <Form.Root className="w-full mx-auto" method='post' onSubmit={handleResendVerification}>
                        <h3 className="text-black font-bold text-[20px] lg:text-[24px]">Resend Verification code</h3>

                        <Form.Field name="email" className="block my-4">
                            <Form.Label className="block font-semibold text-[14px]">Enter your registered Email or phone number</Form.Label>
                            <Form.Control
                                onChange={handleFormChange}
                                required
                                type="text"
                                placeholder='Email address'
                                className="focus:outline focus:outline-offset-0 focus:outline-[#09CFA0]  px-[15px] py-[10px] font-medium text-black border-solid block border-[1.5px] rounded-sm border-gray-300 w-[100%] mx-auto" />
                            <Form.Message
                                className="text-sm text-red-500 grid grid-cols-[25px_calc(100%-25px)] mt-1 font-semibold"
                                match={(error) => error === "typeMismatch" || error === "valueMissing"}
                            >
                                <IoIosWarning className="text-[19px]" /> <span>Enter your registered email address or phone number</span>
                            </Form.Message>
                        </Form.Field>

                        <Form.Submit className="mt-8 w-full bg-[#08AC85] px-4 py-2 fond-semi-bold text-lg text-white rounded-sm disabled:bg-[#08ac865b]" disabled={disableSubmitBtn()}>
                            {buttonMessage}
                        </Form.Submit>

                        <div className="w-full mt-3">
                            <Link href='/admin/auth/verify-account' className="text-green-400 text-[12px] font-semibold">Back to verification ?</Link>
                        </div>
                        <div className="w-full text-center mt-1">
                            <p>Or</p>
                        </div>

                        <div className="w-full mt-2">
                            <Link href={'#'} className="bg-white inline-flex space-x-2 justify-center py-2 w-full rounded-sm border-2 border-green-400 border-solid text-green-600 ">
                                <span>Change Email or phone number</span>
                                {/* <FcGoogle className="text-[25px]" /> */}
                            </Link>
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

export default ResendVerification

