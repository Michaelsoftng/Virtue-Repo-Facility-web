'use client';
import React, { ChangeEvent, useState, useCallback, useEffect } from 'react';
import Logo from '@/src/reuseable/components/Logo';
import * as Form from '@radix-ui/react-form';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IRegister } from '@/src/interface';
import Link from 'next/link';
import { FcGoogle } from "react-icons/fc";
import { IoIosWarning } from "react-icons/io";
import FooterNav from '@/src/reuseable/components/FooterNav';
import { CreateUser } from '@/src/graphql/mutations';
import client from '@/lib/apolloClient';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { UserType, Role } from '@/src/interface';
import Cookies from 'js-cookie';

const Registration: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<IRegister | null>();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [countryCode, setCountryCode] = useState<string>('+234');
    const [formattedPhoneNumber, setFormattedPhoneNumber] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formValidationErrors, setFormValidationErrors] = useState({
        password: '',
        confirmPassword: '',
        hasError: false,
    });
    const [passwordVisibility, setPasswordVisibility] = useState(false);

    const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*,.])[a-zA-Z0-9!@#$%^&*,.]{10,}$/;
    const passwordErrorText = 'Password must be at least 10 characters long and contain at least one number and special character.';
    const confirmPasswordErrorText = 'Passwords do not match';

    const passwordValidation = (passwordValue: string) => {
        const isPasswordValid = passwordPattern.test(passwordValue);
        setFormValidationErrors((prevErrors) => ({
            ...prevErrors,
            password: isPasswordValid ? '' : passwordErrorText,
            hasError: !isPasswordValid || prevErrors.confirmPassword !== '',
        }));
    };

    const passwordConfirmation = (confirmPasswordValue: string, passwordValue: string) => {
        const isConfirmPasswordValid = confirmPasswordValue === passwordValue;
        setFormValidationErrors((prevErrors) => ({
            ...prevErrors,
            confirmPassword: isConfirmPasswordValid ? '' : confirmPasswordErrorText,
            hasError: !isConfirmPasswordValid || prevErrors.password !== '',
        }));
    };

    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'password') {
            passwordValidation(value);
            passwordConfirmation(formData?.password_confirmation as string, value);
        } else if (name === 'password_confirmation') {
            passwordConfirmation(value, formData?.password as string);
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }) as IRegister);
    };

    const disableSubmitBtn = useCallback((): boolean => {
        return formValidationErrors.hasError || !formData || isLoading;
    }, [formValidationErrors, formData, isLoading]);

    useEffect(() => {
        if (formData?.phone_number) {
            setFormattedPhoneNumber(
                formData.phone_number.startsWith(countryCode)
                    ? formData.phone_number
                    : `${countryCode}${formData.phone_number}`
            );
        }
    }, [formData?.phone_number, countryCode]);

    const [register] = useMutation(CreateUser, {
        variables: {
            ...formData as IRegister,
            phone_number: formattedPhoneNumber,
            user_type: UserType.Staff,
            role: Role.Admin,
        },
        client,
    });

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (disableSubmitBtn()) {
            console.log("Form is not valid");
            return;
        }
        Cookies.remove('user');
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        try {
            await register({
                onCompleted(data) {
                    Cookies.remove('userId', { path: '/' });
                    const minutes = 1440;
                    const expiresIn = new Date();
                    expiresIn.setTime(expiresIn.getTime() + minutes * 60 * 1000); // 1440 minutes in milliseconds
                    Cookies.set('userId', data.CreateUser.user.id, { expires: 7, path: '/' });
                    toast.success('Registration Successful! Verify your account with the code sent to your email and phone.');
                    router.push('/admin/auth/verify-account');
                },
                onError(error) {
                    toast.error(error.message);
                },
            });
        } catch (err) {
            console.error('Error creating user:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="px-[100px] py-[30px] ">
            <div className="w-full p">
                <div className="w-[200px] ">
                    <Logo />
                </div>
            </div>
            <div className="w-full md:w-[350px] lg:w-[400px] mx-auto md:mt-3 lg:mt-0">
                <div className="">
                    <Form.Root className="w-full mx-auto" method='post' onSubmit={handleFormSubmit}>
                        <h3 className="text-black font-bold text-[20px] lg:text-[24px]">Staff Registration</h3>


                        <Form.Field name="email" className="block my-4">
                            <Form.Label className="block font-semibold text-[14px]">Staff Email</Form.Label>
                            <Form.Control
                                onChange={handleFormChange}
                                required
                                type="email"
                                placeholder='Email address'
                                className="focus:outline focus:outline-offset-0 focus:outline-[#09CFA0] px-[15px] py-[10px] text-[14px] font-medium text-black border-solid block border-[1.5px] rounded-sm border-gray-300 w-[100%] mx-auto" />
                            <Form.Message
                                className="text-sm text-red-500 grid grid-cols-[25px_calc(100%-25px)] mt-1 font-semibold"
                                match={(error) => error === "typeMismatch" || error === "valueMissing"}
                            >
                                <IoIosWarning className="text-[19px]" /> <span>Enter a valid email address</span>
                            </Form.Message>
                        </Form.Field>

                        <Form.Field name="phone_number" className="block mb-4 mt-2">
                            <Form.Label className="block font-semibold text-[14px]">Phone number</Form.Label>
                            <Form.Control onChange={handleFormChange}
                                type="text"
                                required
                                placeholder='+234803834854'
                                className="focus:outline focus:outline-offset-0 focus:outline-[#09CFA0] px-[15px] py-[10px] text-[14px] font-medium text-black border-solid block border-[1.5px] rounded-sm border-gray-300 w-[100%] mx-auto"
                            />
                            <Form.Message className="text-sm text-red-500 grid grid-cols-[25px_calc(100%-25px)] mt-1 font-semibold" match="valueMissing">

                                <IoIosWarning className="text-[19px]" /> <span>Phone number can not be empty</span>
                            </Form.Message>
                        </Form.Field>
                        <Form.Field name="password" className="relative block my-4">
                            <Form.Label className="block font-semibold text-[14px]">Password</Form.Label>
                            <Form.Control
                                onChange={handleFormChange}
                                required
                                placeholder='Password'
                                type={passwordVisibility ? "text" : "password"}
                                className="focus:outline focus:outline-offset-0 focus:outline-[#09CFA0] px-[15px] py-[10px] text-[14px] font-medium text-black border-solid block border-[1.5px] rounded-sm border-gray-300 w-[100%] mx-auto"
                            />

                            <span
                                onClick={() => setPasswordVisibility(!passwordVisibility)}
                                data-testid='confirmToggleButton'
                                id='confirmtoggleButton'
                                className='absolute top-[54%] bottom-[100%] right-[20px] color text-gray-500 text-[1rem] transform -translate-y-1/2 cursor-pointer'
                            >
                                {passwordVisibility ? <FaEye /> : <FaEyeSlash />}
                            </span>
                            

                            <Form.Message
                                match={() => !!formValidationErrors.password}
                                className="text-sm text-yellow-400 grid grid-cols-[25px_calc(100%-25px)] mt-1 font-semibold"
                            >
                                <IoIosWarning className="text-[19px]" /> <span>{formValidationErrors.password}</span>
                            </Form.Message>
                        </Form.Field>


                        <Form.Field name="password_confirmation" className="relative block my-4">
                            <Form.Label className="block font-semibold text-[14px]">Re-type Password</Form.Label>
                            <Form.Control
                                onChange={handleFormChange}
                                required
                                type={passwordVisibility ? "text" : "password"}
                                placeholder='Re-type Password'
                                className="focus:outline focus:outline-offset-0 focus:outline-[#09CFA0] px-[15px] py-[10px] text-[14px] font-medium text-black border-solid block border-[1.5px] rounded-sm border-gray-300 w-[100%] mx-auto"
                            />

                            <span
                                onClick={() => setPasswordVisibility(!passwordVisibility)}
                                data-testid='confirmToggleButton'
                                id='confirmtoggleButton'
                                className='absolute top-[54%] bottom-[100%] right-[20px] color text-gray-500 text-[1rem] transform -translate-y-1/2 cursor-pointer'
                            >
                                {passwordVisibility ? <FaEye /> : <FaEyeSlash />}
                            </span>
                            {/* <Form.Message match={() => formValidationErrors.hasError} className="block text-xs text-red-500">
                            {formValidationErrors.hasError && formValidationErrors.confirmPasswordError}
                        </Form.Message> */}
                            <Form.Message
                                match={() => !!formValidationErrors.confirmPassword}
                                className="text-sm text-red-500 grid grid-cols-[25px_calc(100%-25px)] mt-1 font-semibold"
                            >
                                <IoIosWarning className="text-[19px]" /> <span>{formValidationErrors.confirmPassword}</span>
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
                                I agree with the terms and conditions
                            </label>
                        </div>

                        <Form.Submit
                            className="mt-8 w-full bg-[#08AC85] px-4 py-2 text-lg text-white rounded-sm disabled:bg-[#08ac865b]"
                            disabled={disableSubmitBtn()}
                        >
                            {isLoading ? "Registering..." : "Sign Up"}
                        </Form.Submit>
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
                <div className="mt-6">
                    <FooterNav />
                </div>
            </div>

        </div>
    )
}

export default Registration;
