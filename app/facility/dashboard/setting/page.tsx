/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { ChangeEvent, useState } from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import FacilityHeader from '@/src/reuseable/components/FacilityHeader'
import FacilityMenu from '@/src/reuseable/components/FacilityMenu'
import { useMutation, useQuery } from '@apollo/client'
import { UpdateAccount, ChangePassword } from '@/src/graphql/mutations'
import client from '@/lib/apolloClient';
import { toast } from 'react-toastify';
import { useAuth } from '@/src/context/AuthContext'
import NumberPreloader from '@/src/preLoaders/NumberPreloader'
import Image from 'next/image'
import userimage from '@/public/images/vegetables.png'
import AddressSearch from '@/src/reuseable/map/AddressSelect'
import { IUpdateAccount, IPasswordData } from '@/src/interface'
import { FiUpload } from 'react-icons/fi'
import { GetUserById } from '@/src/graphql/queries'
import { GiPositionMarker } from "react-icons/gi";
import { RiAdminFill } from "react-icons/ri";
import Loading from '@/app/admin/dashboard/loading'
import { decodeJwtEncodedId } from '@/src/utils/decode'
import { FaHospitalUser } from "react-icons/fa";
const Settings = () => {
    const [activeTab, setActiveTab] = useState<string>("account")
    const [FormData, setFormData] = useState<IUpdateAccount | null>(null)
    const [address, setAddress] = useState<IUpdateAccount['streetAddress']>('');
    const [building, setBuilding] = useState<IUpdateAccount['streetAddress2']>('');
    const [postalCode, setPostalCode] = useState<IUpdateAccount['postal']>('');
    const [state, setState] = useState<IUpdateAccount['state']>('');
    const [country, setCountry] = useState<IUpdateAccount['country']>('');
    const [city, setCity] = useState<IUpdateAccount['city']>('');
    const [longitude, setLongitude] = useState<IUpdateAccount['longitude']>(0);
    const [latitude, setLatitude] = useState<IUpdateAccount['latitude']>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [passwordFormData, setPasswordFormData] = useState<IPasswordData | null>(null)
    const { user } = useAuth()

    const { data: userData, loading: userDataLoading } = useQuery(GetUserById, {
        variables: {
            id: decodeJwtEncodedId(user?.id as string),

        },
        client,
    });

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const handleFormDataChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(name, value)
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }) as IUpdateAccount);
    };

    const handlePasswordFormDataChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(name, value)
        setPasswordFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }) as IPasswordData);
    };

    const completeData = {
        ...FormData,
        streetAddress: address,
        streetAddress2: building,
        postal: postalCode,
        state,
        country,
        city,
        latitude,
        longitude,
    }

    const [updateAccount] = useMutation(UpdateAccount, {
        variables: {
            userId: decodeJwtEncodedId(user?.id as string),
            updateData: { ...completeData as IUpdateAccount }
        },
        client,
    });

    const handleFormSubmit = async (e: React.FormEvent) => {
        console.log(completeData, FormData)
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateAccount({
                onCompleted(data) {
                    toast.success('Account update Successful!');
                    window.location.reload();
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

    const [changeAccountPassword] = useMutation(ChangePassword, {
        variables: {
            ...passwordFormData
        },
        client,
    });

    const handlepasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await changeAccountPassword({
                onCompleted(data) {
                    console.log(data)
                    if (data.ChangeUserPassword.errors) {
                        const errors = data.ChangeUserPassword.errors;

                        for (const field in errors) {
                            const fieldErrors = errors[field];
                            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                                // Display the first error for each field
                                toast.error(`${fieldErrors[0].message}`);
                            }
                        }
                    }

                    toast.success('Account password changed Successful!');
                    // window.location.reload();
                },
                onError(error) {
                    toast.error(error.message);
                },
            });
        } catch (err) {
            console.error('Error changing user password:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Loading />
    }

    return (
        <div>
            <FacilityHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <FacilityMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageWrapper="Dashboard&nbsp;&nbsp;/&nbsp;&nbsp;settings" pageTitle="account" showExportRecord={true} />

                    <div className="px-8 py-4">
                        <div className="mb-4">
                            <button className={`px-4 py-2 ${activeTab === 'account' ? "bg-[#B2B7C2]" : "bg-[#b5b5b646] "}  w-[200px] mr-2 rounded`} onClick={() => handleTabClick('account')}>Account</button>
                            <button className={`px-4 py-2 ${activeTab === 'security' ? "bg-[#B2B7C2]" : "bg-[#b5b5b646] "}  w-[200px] mr-2 rounded`} onClick={() => handleTabClick('security')}>Security</button>
                            {/* <button className={`px-4 py-2 ${activeTab === 'pendingpayment' ? "bg-[#B2B7C2]" : "bg-[#b5b5b646] "}  w-[200px] mr-2 rounded`} onClick={() => handleTabClick('pendingpayment', 'unpaid')}>Pending Payment</button> */}

                        </div>
                        {activeTab === 'account' && (

                            <div className="mx-auto pt-4">
                                {/* Profile Header */}
                                <div className="px-5 py-5 grid grid-cols-[90%_10%] bg-white flex-col shadow-xl sm:flex-row items-center sm:items-start justify-between space-y-4 sm:space-y-0">
                                    <div className="grid grid-cols-[15%_80%] gap-x-3" >
                                        <div className="relative flex-shrink-0">
                                            <Image

                                                src={userimage}
                                                alt="User"
                                                className="w-[10rem] h-[10rem] rounded-lgobject-cover"
                                            />
                                            <button className="mt-5 w-[10rem] font-semibold bg-gray-300 text-sm text-[#a4a8b1] px-5 py-2 rounded-[2px] shadow-md">
                                                Profile photo
                                            </button>
                                        </div>
                                        <div className="text-center sm:text-left sm:ml-6 mt-5">
                                            <div className="text-xl font-semibold text-gray-800">
                                                {
                                                    userDataLoading ?
                                                        <NumberPreloader /> :
                                                        userData.getUserById?.facilityAdmin.facilityName
                                                }
                                            </div>


                                            <div className="flex gap-[6px] text-[#8C93A3] text-[16px] mt-2">
                                                <FaHospitalUser className="text-black" style={{ width: '25px', height: '25px' }} />
                                                <span>
                                                    {
                                                        userDataLoading ?
                                                            <NumberPreloader /> :
                                                            `${userData.getUserById?.firstName} ${userData.getUserById?.lastName}`
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex gap-[6px] text-[#8C93A3] text-[16px] mt-2">
                                                <RiAdminFill className="text-black" style={{ width: '25px', height: '25px' }} />
                                                <span>
                                                    {
                                                        userDataLoading ?
                                                            <NumberPreloader /> :
                                                            userData.getUserById?.facilityAdmin.role
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex gap-[6px] text-[#8C93A3] text-[16px] mt-2">
                                                <GiPositionMarker className="text-black" style={{ width: '25px', height: '25px' }} />
                                                <span>
                                                    {
                                                        userDataLoading ?
                                                            <NumberPreloader /> :
                                                            userData.getUserById.city ? `${userData.getUserById.streetAddress2} ${userData.getUserById.streetAddress} ${userData.getUserById.city}, ${userData.getUserById.state}` : 'you have not set your address'
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="text-teal-500 text-sm sm:text-base border font-semibold border-teal-500 px-6 py-1 rounded-[2px] hover:bg-teal-50 focus:outline-none">
                                        Edit role
                                    </button>
                                </div>

                                {/* Profile Information Section */}
                                <div className="mt-10 bg-white shadow-xl px-5 py-5 rounded">
                                    <h3 className="text-xl font-semibold text-gray-800">Profile Information</h3>
                                    <div>
                                        <form method="post" onSubmit={handleFormSubmit}>
                                            <div className="mt-6 space-y-6">
                                                {/* Form Fields */}
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                                    <div className="flex flex-col">
                                                        <label htmlFor="first-name" className="text-sm font-medium text-gray-600">First name</label>
                                                        <input
                                                            id="first-name"
                                                            onChange={handleFormDataChange}
                                                            name='firstName'
                                                            type="text"
                                                            placeholder={
                                                                userDataLoading ? 'enter your first name' :
                                                                    userData.getUserById?.firstName
                                                            }

                                                            className="mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <label htmlFor="last-name" className="text-sm font-medium text-gray-600">Last name</label>
                                                        <input
                                                            onChange={handleFormDataChange}
                                                            name='lastName'
                                                            id="last-name"
                                                            type="text"
                                                            placeholder={
                                                                userDataLoading ? 'enter your last name' :
                                                                    userData.getUserById?.lastName
                                                            }
                                                            className="mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <label htmlFor="phone_number" className="text-sm font-medium text-gray-600">Phone number</label>
                                                        <input
                                                            onChange={handleFormDataChange}
                                                            id="phoneNumber"
                                                            type="text"
                                                            placeholder={
                                                                userDataLoading ? 'enter your phone number' :
                                                                    userData.getUserById?.phoneNumber
                                                            }
                                                            className="mt-1 p-3 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                        />
                                                    </div>
                                                </div>
                                                <AddressSearch
                                                    setAddress={setAddress}
                                                    setBuilding={setBuilding}
                                                    setPostalCode={setPostalCode}
                                                    setState={setState}
                                                    setCountry={setCountry}
                                                    setCity={setCity}
                                                    setLongitude={setLongitude}
                                                    setLatitude={setLatitude}

                                                />
                                                <div className={`mt-6 border-2 border-dashed bg-[#08ac8611] rounded-lg p-8  border-gray-300 `}>
                                                    <div className="w-full flex justify-center">
                                                        <p className="text-[#08AC85] w-[250px] text-sm font-medium mb-4 text-center">
                                                            Click or Drag and drop your file or photo here to start uploading
                                                        </p>
                                                    </div>
                                                    <div className="w-full flex justify-center">
                                                        <label
                                                            htmlFor="file-upload"
                                                            className="cursor-pointer inline-flex gap-2 items-center bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 rounded-md shadow-sm hover:bg-gray-100"
                                                        >
                                                            <FiUpload />
                                                            <span>Browse Files</span>

                                                        </label>
                                                        <input
                                                            id="file-upload"
                                                            type="file"

                                                            className="hidden"
                                                        />
                                                    </div>

                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="mt-8 flex flex-col sm:flex-row sm:space-x-6">
                                                <button className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                                                    Save changes
                                                </button>
                                                <button className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                                                    Deactivate account
                                                </button>
                                            </div>
                                        </form>
                                    </div>


                                </div>
                            </div>
                        )}
                        {activeTab === 'security' && (
                            <div className="mx-auto space-y-8 ">
                                {/* Password Section */}
                                <div className="w-2/3 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg px-8 py-4">
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-semibold">Password</h2>
                                        <p className="text-sm text-gray-600">
                                            Reset your password Viverra lacus orci nisl, dis amet non ultricies senectus vulputate.
                                        </p>
                                        <div className="space-y-6">
                                            <form action="" onSubmit={handlepasswordChange}>
                                                <div>
                                                    <label htmlFor="oldPassword" className="block text-sm font-semibold text-gray-700">Old password</label>
                                                    <input
                                                        name='old_password'
                                                        id="oldPassword"
                                                        type="password"
                                                        placeholder="old password"
                                                        onChange={handlePasswordFormDataChange}
                                                        className="w-full mt-2 p-3 border border-gray-300 rounded shadow-sm focus:ring-[#09CFA0] focus:border-[#09CFA0]"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="newPassword" className="mt-4 block text-sm font-semibold text-gray-700">New password</label>
                                                    <input
                                                        id="new_password1"
                                                        type="password"
                                                        placeholder="new password"
                                                        name='new_password1'
                                                        onChange={handlePasswordFormDataChange}
                                                        className="w-full mt-2 p-3 border border-gray-300 rounded shadow-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="confirmPassword" className="mt-4 block text-sm font-semibold text-gray-700">Confirm password</label>
                                                    <input
                                                        id="confirmPassword"
                                                        type="password"
                                                        placeholder="confirm password"
                                                        name='new_password2'
                                                        onChange={handlePasswordFormDataChange}
                                                        className="w-full mt-2 p-3 border border-gray-300 rounded shadow-sm"
                                                    />
                                                </div>
                                                <button className=" bg-[#08AC85] text-white text-[14px] py-2 rounded px-3 mt-6 hover:bg-green-600 transition-colors">
                                                    Save changes
                                                </button>
                                            </form>

                                        </div>
                                    </div>

                                </div>

                                {/* Two-factor Authentication Section */}
                                <div className="w-2/3  px-8 py-4 bg-white rounded-lg shadow-md">
                                    <div className="grid  grid-cols-[70%_15%] gap-[15%]">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-800">Two-factor Authentication</h2>
                                            <p className="text-gray-600 mt-2">
                                                Viverra lacus orci nisl, dis amet non ultricies senectus vulputate. Gravida auctor
                                                elementum auctor sed congue pretium donec vel.
                                            </p>
                                        </div>
                                        <div>
                                            <button className="mt-4 px-6 py-1 bg-[#08AC85] text-white rounded hover:bg-green-600">
                                                Enable
                                            </button>
                                        </div>

                                    </div>


                                    <div className="mt-6">
                                        <div className="flex justify-between items-center border-t py-4">
                                            <div>
                                                <h3 className="font-medium text-gray-700">Authentication app</h3>
                                                <p className="text-sm text-gray-500">Google authentication app</p>
                                            </div>
                                            <button className="px-6 py-1 text-[#08AC85] border-2 border-[#08AC85] bg-white  rounded hover:bg-green-600 hover:text-white">
                                                Setup
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-center border-t py-4">
                                            <div>
                                                <h3 className="font-medium text-gray-700">Email setup</h3>
                                                <p className="text-sm text-gray-500">Setup another email for verification</p>
                                            </div>
                                            <button className="px-6 py-1 text-[#08AC85] border-2 border-[#08AC85] bg-white  rounded hover:bg-green-600 hover:text-white">
                                                Setup
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-center border-t py-4">
                                            <div>
                                                <h3 className="font-medium text-gray-700">SMS recovery</h3>
                                                <p className="text-sm text-gray-500">Setup another phone no. for recovery</p>
                                            </div>
                                            <button className="px-6 py-1 text-[#08AC85] border-2 border-[#08AC85] bg-white  rounded hover:bg-green-600 hover:text-white">
                                                Setup
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Settings
