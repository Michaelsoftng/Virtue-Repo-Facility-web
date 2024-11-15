/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { ChangeEvent, FormEvent, useState, useCallback } from 'react';
import Logo from '@/src/reuseable/components/Logo'
import * as Form from '@radix-ui/react-form';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ILogin } from '@/src/interface'
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";
import { IoIosWarning } from "react-icons/io";
import { useMutation } from '@apollo/client';
import client from '@/lib/apolloClient';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'
import { LoginAccount } from '@/src/graphql/mutations';
import { useAuth } from '@/src/context/AuthContext';
import FooterNav from '@/src/reuseable/components/FooterNav';
import Cookies from 'js-cookie';

const Signin: React.FC = () => {
    const router = useRouter();
    const [isloading, setIsLoading] = useState<boolean>(false)
    const [formData, setFormData] = useState<ILogin | null>();
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const { login } = useAuth();

    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value } as ILogin)
    }

    const [signin, { loading }] = useMutation(LoginAccount, {
        variables: {
            ...formData as ILogin,
        },
        client,
    });

    const disableSubmitBtn = useCallback((): boolean => {

        return (
            !formData ||
            !formData.password ||
            formData.password === '' ||
            !formData.email ||
            formData.email === ''
        );
    }, [formData]);




    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true)


        try {
            const { data, errors } = await signin({
                async onCompleted(data) {
                    Cookies.remove('user', { path: '/' });
                    Cookies.remove('userId', { path: '/' });
                    Cookies.remove('accessToken', { path: '/' });
                    Cookies.remove('refreshToken', { path: '/' });
                    if (data.TokenAuth.success) {
                        // Access token and user ID if login is successful
                        const token = data.TokenAuth.token;
                        const userId = data.TokenAuth.user.id;
                        const user = {
                            ...data.TokenAuth.user,
                        };
                        
                        
                        // Save the user data in global auth context
                        login(user);
                        // Store in session storage
                        const minutes = 60;
                        const expiresIn = new Date();
                        expiresIn.setTime(expiresIn.getTime() + minutes * 60 * 1000); // 5 minutes in milliseconds

                        // Cookies.set('user', JSON.stringify(user), { expires: 1, path: '/' });
                        Cookies.set('accessToken', data.TokenAuth.token, { expires: expiresIn, path: '/' });
                        Cookies.set('refreshToken', data.TokenAuth.refreshToken, { expires: 7, path: '/', secure: true });
                        // sessionStorage.setItem('accessToken', token);
                        // sessionStorage.setItem('userId', userId);

                        toast.success('Login Successful, redirecting ....');
                        router.push('/facility/dashboard/home');
                    } else {

                        const tokeAuthError = data.TokenAuth.errors
                        let loginError: string
                        let errorCode: string
                        Object.entries(tokeAuthError).forEach(([key, value]) => {
                            if (key == 'user') {
                                const user = value
                                Cookies.set('userId', user as string, { expires: 7, path: '/' });
                            }
                            
                            if (Array.isArray(value)) {
                                loginError = value[0].message
                                errorCode = value[0].code
                            } else if (typeof value === 'object' && value !== null) {
                                const errorObj = (value as { message: [{ message: string, code: string }]  }).message[0]
                                loginError = errorObj.message;
                                errorCode = errorObj.code

                            }
                            if (loginError) {

                                toast.error(loginError);
                            }

                            if (errorCode === 'not_account_verified') {
                                router.push('/facility/auth/verify-account');
                            }
                        });



                    }

                },
                onError(e) {
                    toast.error(e.message);

                },
            });
            console.log('User created:', data.createUser); // Adjust according to your mutation response structure

        } catch (err) {
            console.error('Error logging user in:', err);
        } finally {
            setIsLoading(false)
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
                    <Form.Root className="w-full mx-auto" method='post' onSubmit={handleLogin}>
                        <h3 className="text-black font-bold text-[20px] lg:text-[24px]">Facility Log in</h3>

                        <Form.Field name="email" className="block my-4">
                            <Form.Label className="block font-semibold text-[14px]">Email</Form.Label>
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

                        <Form.Submit className="mt-8 w-full bg-[#08AC85] px-4 py-2 fond-semi-bold text-lg text-white rounded-sm disabled:bg-[#08ac865b]" disabled={disableSubmitBtn() || isloading}>Sign In</Form.Submit>

                        <div className="w-full mt-3">
                            <Link href={'#'} className="text-green-400 text-[12px] font-semibold">Forgot password ?</Link>
                        </div>
                        <div className="w-full text-center mt-1">
                            <p>Or</p>
                        </div>

                        <div className="w-full mt-2">
                            <Link href='registration' className="bg-white inline-flex space-x-2 justify-center py-2 w-full rounded-sm border-2 border-green-400 border-solid text-green-600 "> <span>Sign up</span> </Link>
                            {/* <FcGoogle className="text-[25px]" /> */}
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
