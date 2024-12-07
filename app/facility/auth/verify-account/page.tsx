/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { ChangeEvent, useCallback, useState } from 'react';
import Logo from '@/src/reuseable/components/Logo';
import * as Form from '@radix-ui/react-form';
import { IVerify } from '@/src/interface';
import Link from 'next/link';
// import { FcGoogle } from "react-icons/fc";
import { IoIosWarning } from "react-icons/io";
import FooterNav from '@/src/reuseable/components/FooterNav';
import { VerifyAccount, ResendVerificationCode } from '@/src/graphql/mutations';
import { useMutation } from '@apollo/client';
import client from '@/lib/apolloClient';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie';

const VerifyUserAccount: React.FC = () => {
    const router = useRouter();
    const [isloading, setIsLoading] = useState<boolean>(false)
    const [formData, setFormData] = useState<IVerify>({ digit1: '', digit2: '', digit3: '', digit4: '' });
    const [token, setToken] = useState<number>(0);
    const [buttonMessage, setButtonMessage] = useState<string>('Verify');

    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Check if the input is a digit and has a length of 1
        if (/^\d*$/.test(value) && value.length <= 1) {
            setFormData({ ...formData, [name]: value } as IVerify);
            const newToken = Object.values({ ...formData, [name]: value }).join('');
            setToken(Number(newToken));
            console.log(token)
            // Move focus to the next input field if the current field is filled
            if (value.length === 1) {
                const nextInput = document.querySelector(`input[name="${getNextDigit(name)}"]`);
                if (nextInput) {
                    (nextInput as HTMLInputElement).focus();
                }
            }
        }
    };


    // Helper function to get the next digit field's name
    const getNextDigit = (currentDigit: string) => {
        const digits = ['digit1', 'digit2', 'digit3', 'digit4'];
        const currentIndex = digits.indexOf(currentDigit);
        return currentIndex < digits.length - 1 ? digits[currentIndex + 1] : null;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [verifyAccount, { loading }] = useMutation(VerifyAccount, {
        variables: {
            user: Cookies.get('userId'),
            token: token,
        },
        client,
    });

    const [resendVerificationCode, { loading: ResendVerificationCodeLoading }] = useMutation(ResendVerificationCode, {
        variables: {
            user: Cookies.get('userId'),
            token: token,

        },
        client,
    });

    const handleFormSubmit = async (e: React.FormEvent) => {
        setButtonMessage('Verifying...')
        e.preventDefault();
        const userId = Cookies.get('userId'); // Get userId from cookies

        if (!userId) {
            router.push('/facility/auth/signin');
            return;
        }
        setIsLoading(true)
        try {
            const { data } = await verifyAccount({
                async onCompleted(data) {
                    if (data.VerifyUserAccount.success) {
                        toast.success(data?.VerifyUserAccount?.success?.message);
                        router.push('/facility/auth/signin');
                    } else {
                        toast.success(data?.VerifyUserAccount?.errors?.message);
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

    const handleResendVerification = async (e: React.FormEvent) => {
        setButtonMessage('Resending...')
        e.preventDefault();
        const userId = Cookies.get('userId'); // Get userId from cookies
        console.log('userId', userId)
        if (!userId) {
            router.push('/facility/auth/resend-verification');
            return;
        }
        setIsLoading(true)
        try {
            const { data } = await resendVerificationCode({
                async onCompleted(data) {
                    if (data.ResendVerificationCode.success) {
                        toast.success(data?.ResendVerificationCode?.success?.message);
                        
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

    const disableSubmitBtn = useCallback((): boolean => {

        return (
            !formData ||
            formData.digit1 === '' ||
            formData.digit2 === '' ||
            formData.digit3 === '' ||
            formData.digit4 === '' || isloading
        );
    }, [formData, isloading]);

    return (
        <div className="px-[100px] py-[30px]">
            <div className="w-full p">
                <div className="w-[200px] ">
                    <Logo />
                </div>
            </div>

            <div className="w-full md:w-[350px] lg:w-[400px] mx-auto md:mt-20 lg:mt-24">
                <div className="">
                    <Form.Root className="w-full mx-auto" method='post' onSubmit={handleFormSubmit}>
                        <h3 className="text-black font-bold text-[20px] lg:text-[24px]">Verify Your Account</h3>
                        <div className="flex space-x-2 my-4">
                            {['digit1', 'digit2', 'digit3', 'digit4'].map((digit, index) => (
                                <Form.Field key={index} name={digit} className="flex-1">
                                    <Form.Control
                                        onChange={handleFormChange}
                                        required
                                        type="text" // Use text type for custom validation
                                        maxLength={1} // Limit to 1 digit
                                        placeholder=''
                                        name={digit}
                                        className="focus:outline focus:outline-offset-0 focus:outline-[#09CFA0] px-[10px] py-[10px] font-medium text-black border-solid block border-[1.5px] rounded-sm border-gray-300 w-full mx-auto text-center" />
                                    <Form.Message
                                        className="text-sm text-red-500 mt-1 font-semibold"
                                        match={(error) => error === "valueMissing"}
                                    >
                                        <IoIosWarning className="text-[19px]" /> <span>Please enter a digit</span>
                                    </Form.Message>
                                </Form.Field>
                            ))}
                        </div>
                        <Form.Submit className="mt-8 w-full bg-[#08AC85] px-4 py-2 fond-semi-bold text-lg text-white rounded-sm disabled:bg-[#08ac865b]" disabled={disableSubmitBtn()}>
                            {buttonMessage}
                        </Form.Submit>
                        <div className="w-full mt-3">
                            <button onClick={handleResendVerification} className="text-green-400 text-[12px] font-semibold">Resend verification code?</button>
                        </div>
                        <div className="w-full text-center mt-1">
                            <p>Or</p>
                        </div>
                        <div className="w-full mt-2">
                            <Link href='/faclity/auth/signin' className="bg-white inline-flex space-x-2 justify-center py-2 w-full rounded-sm border-2 border-green-400 border-solid text-green-600 "> <span>Continue to Login</span>
                                {/* <FcGoogle className="text-[25px]" /> */}
                            </Link>
                        </div>
                    </Form.Root>
                </div>
                <div className="md:mt-20 lg:mt-16">
                    <FooterNav />
                </div>
            </div>
        </div>
    );
}

export default VerifyUserAccount;
