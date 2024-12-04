/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { ChangeEvent, useState } from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import { TableData } from '@/src/types/TableData.type'
import AdminFacilitiesTable from '@/src/partials/tables/AdminFacilitiesTable'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import { useGetUnpaidConsultation } from '@/src/hooks/useGetUnpaidConsultation'
import TablePreloader from '@/src/preLoaders/TablePreloader'
import { useMutation, useQuery } from '@apollo/client'
import { ApproveAccount, DeleteUser } from '@/src/graphql/mutations'
import client from '@/lib/apolloClient';
import { toast } from 'react-toastify';
import { useAuth } from '@/src/context/AuthContext'
import { GetMinimalFilteredConsultations } from '@/src/graphql/queries'
import Image from 'next/image'
import userimage from '@/public/images/vegetables.png'
import GoogleMapComponent from '@/src/reuseable/map/googlemap'
import AddressSearch from '@/src/reuseable/map/AddressSelect'
import { IUpdateAccount } from '@/src/interface'
import { FiUpload } from 'react-icons/fi'

const decodeJwtEncodedId = (encodedId: string | undefined): string => {
    if (!encodedId) {
        console.error('Invalid input: encodedId is undefined or null');
        return ''; // Return fallback or handle it appropriately
    }

    try {
        const base64 = encodedId.replace(/-/g, '+').replace(/_/g, '/');
        const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
        const decoded = atob(paddedBase64);
        return decoded.replace(/^UserNode:/, '');
    } catch (error) {
        console.error('Error decoding JWT-encoded ID:', error);
        return '';
    }
};

const Settings = () => {
    const [activeTab, setActiveTab] = useState<string>("account")
    const [FormData, setFormData] = useState<IUpdateAccount | null >(null)
    const [address, setAddress] = useState<IUpdateAccount['street_address']>('');
    const [building, setBuilding] = useState<IUpdateAccount['street_address_2']>('');
    const [postalCode, setPostalCode] = useState<IUpdateAccount['postal']>('');
    const [state, setState] = useState<IUpdateAccount['state']>('');
    const [country, setCountry] = useState<IUpdateAccount['country']>('');
    const [city, setCity] = useState<IUpdateAccount['city']>('');
    const [longitude, setLongitude] = useState<IUpdateAccount['longitude']>(0);
    const [latitude, setLatitude] = useState<IUpdateAccount['latitude']>(0);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        console.log(activeTab)
        // fetchData(filterStatus, offsets[tab], tab);

    };
    const handleAddressChange = () => { console.log("hey") }
    
    const handleFormDataChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;


        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }) as IUpdateAccount);
    };
    const completeData = {
        ...FormData,
        street_address: address,
        street_address_2: building,
        postal: postalCode,
        state,
        country,
        city,
        latitude,
        longitude,
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        console.log(completeData)
        e.preventDefault();
        // setIsLoading(true);

        // if (disableSubmitBtn()) {
        //     console.log("Form is not valid");
        //     return;
        // }
        // Cookies.remove('user', { path: '/' });
        // Cookies.remove('accessToken', { path: '/' });
        // Cookies.remove('refreshToken', { path: '/' });
        // try {
        //     await register({
        //         onCompleted(data) {
        //             Cookies.remove('userId', { path: '/' });
        //             const minutes = 1440;
        //             const expiresIn = new Date();
        //             expiresIn.setTime(expiresIn.getTime() + minutes * 60 * 1000); // 1440 minutes in milliseconds
        //             Cookies.set('userId', data.CreateUser.user.id, { expires: 7, path: '/' });
        //             toast.success('Registration Successful! Verify your account with the code sent to your email and phone.');
        //             router.push('/admin/auth/verify-account');
        //         },
        //         onError(error) {
        //             toast.error(error.message);
        //         },
        //     });
        // } catch (err) {
        //     console.error('Error creating user:', err);
        // } finally {
        //     setIsLoading(false);
        // }
    };

    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
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
                                                Upload photo
                                            </button>
                                        </div>
                                        <div className="text-center sm:text-left sm:ml-6 mt-5">
                                            <h2 className="text-xl font-semibold text-gray-800">John doe</h2>
                                            <p className="mt-4 text-[14px] font-semibold text-gray-800">Role</p>
                                            <p className="text-md text-[#8C93A3]">Super admin</p>
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
                                                            name='first_name'
                                                            type="text"
                                                            value="James hadish"
                                                            className="mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <label htmlFor="last-name" className="text-sm font-medium text-gray-600">Last name</label>
                                                        <input
                                                            onChange={handleFormDataChange}
                                                            name='last_name'
                                                            id="last-name"
                                                            type="text"
                                                            value="James hadish"
                                                            className="mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <label htmlFor="phone_number" className="text-sm font-medium text-gray-600">Phone number</label>
                                                        <input
                                                            onChange={handleFormDataChange}
                                                            id="phone_number"
                                                            type="text"
                                                            value="James hadish"
                                                            className="mt-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                        />
                                                    </div>
                                                </div>
                                                <AddressSearch
                                                    setAddress={setAddress}
                                                    setBuilding={setBuilding }
                                                    setPostalCode={setPostalCode }
                                                    setState={setState }
                                                    setCountry={setCountry}
                                                    setCity={setCity}
                                                    setLongitude={setLongitude}
                                                    setLatitude={setLatitude}

                                                />
                                                <div className={`mt-6 border-2 border-dashed bg-[#08ac8611] rounded-lg p-8  border-gray-300 `}

                                                >
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
                                            <form action="">
                                                <div>
                                                    <label htmlFor="oldPassword" className="block text-sm font-semibold text-gray-700">Old password</label>
                                                    <input
                                                        id="oldPassword"
                                                        type="password"
                                                        placeholder="James hadish"
                                                        className="w-full mt-2 p-3 border border-gray-300 rounded shadow-sm focus:ring-[#09CFA0] focus:border-[#09CFA0]"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="newPassword" className="mt-4 block text-sm font-semibold text-gray-700">New password</label>
                                                    <input
                                                        id="newPassword"
                                                        type="password"
                                                        placeholder="James hadish"
                                                        className="w-full mt-2 p-3 border border-gray-300 rounded shadow-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="confirmPassword" className="mt-4 block text-sm font-semibold text-gray-700">Confirm password</label>
                                                    <input
                                                        id="confirmPassword"
                                                        type="password"
                                                        placeholder="Rodyshoe@gmail.com"
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
