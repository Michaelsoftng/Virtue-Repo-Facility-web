/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { ChangeEvent, useState } from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import TablePreloader from '@/src/preLoaders/TablePreloader'
import { useMutation, useQuery } from '@apollo/client'
import { UpdateAccount, ChangePassword, UpdateCharges } from '@/src/graphql/mutations'
import client from '@/lib/apolloClient';
import { toast } from 'react-toastify';
import { useAuth } from '@/src/context/AuthContext'
import NumberPreloader from '@/src/preLoaders/NumberPreloader'
import Image from 'next/image'
import userimage from '@/public/images/vegetables.png'
import AddressSearch from '@/src/reuseable/map/AddressSelect'
import { IUpdateAccount, IPasswordData, ICharges } from '@/src/interface'
import { FiUpload } from 'react-icons/fi'
import { GetUserById, GetCharges } from '@/src/graphql/queries'
import { CiLocationOn } from 'react-icons/ci'
import Loading from '../loading'
import { decodeJwtEncodedId } from '@/src/utils/decode'
import { formatMoney } from '@/src/partials/tables/NewRequesTable'

const Settings = () => {
    const [activeTab, setActiveTab] = useState<string>("account")
    const [FormData, setFormData] = useState<IUpdateAccount | null>(null)
    const [chargesFormData, setChargesFormData] = useState<ICharges | null>(null)
    const [address, setAddress] = useState<IUpdateAccount['streetAddress']>('');
    const [location, setLocation] = useState<IUpdateAccount['location']>('');
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
    
    const { data: chargesData, loading: chargesDataLoading } = useQuery(GetCharges, {
        client,
    });  
    
    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const handleFormDataChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
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
        location,
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

    const handleChargesFormDataChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log(name, value)
        setChargesFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }) as ICharges);
    };

    const [updateCharges] = useMutation(UpdateCharges, {
        variables: {
            admin: userData?.getUserById?.staff.id,
            updateData: { ...chargesFormData as ICharges }
        },
        client,
    });

    const handleChargesUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateCharges({
                onCompleted(data) {
                    console.log(data)
                    toast.success('charges update Successful!');
                    // window.location.reload();
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

    if (isLoading) {
        return <Loading />
    }

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
                            <button className={`px-4 py-2 ${activeTab === 'charges' ? "bg-[#B2B7C2]" : "bg-[#b5b5b646] "}  w-[200px] mr-2 rounded`} onClick={() => handleTabClick('charges')}>App Charges</button>

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
                                                        `${userData.getUserById?.firstName} ${userData.getUserById?.lastName}`
                                                }
                                            </div>
                                            <p className="mt-4 text-[14px] font-semibold text-gray-800">Role</p>
                                            <div className="text-md text-[#8C93A3]">
                                                {
                                                    userDataLoading ?
                                                        <NumberPreloader /> :
                                                        userData.getUserById?.staff.role
                                                }
                                            </div>

                                            <div className="flex gap-1 text-[#8C93A3] text-[16px] mt-2">
                                                <CiLocationOn className="text-black" style={{ width: '25px', height: '25px' }} />
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
                                                    setLocation={setLocation}
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
                        {activeTab === 'charges' && (
                            chargesDataLoading ? (
                                <TablePreloader />
                            ) : (
                            <div className="mx-auto space-y-8 ">
                                {/* Password Section */}
                                <div className="w-full grid grid-cols-[70%_30%] lg:grid-cols-[70%_30%] gap-8 pr-4">
                                    <div className="space-y-4 bg-white rounded-lg shadow-lg px-8 py-4">
                                        <h2 className="text-xl font-semibold">Business charges</h2>
                                        <p className="text-sm text-gray-600">
                                            Set up the business charges here for everything paymeny.
                                        </p>
                                        <div className="space-y-6">
                                            <form action="" onSubmit={handleChargesUpdate}>
                                                        
                                                <div className='grid grid-cols-2  gap-4'>
                                                    <div>
                                                        <label htmlFor="referralBonusPercentage" className="block text-sm font-semibold text-gray-700">Referral Bonus</label>
                                                        <input
                                                            name='referralBonusPercentage'
                                                            id="referralBonusPercentage"
                                                            type="number"
                                                            
                                                            onChange={handleChargesFormDataChange}
                                                            className="w-full mt-2 p-3 border border-gray-300 rounded shadow-sm focus:ring-[#09CFA0] focus:border-[#09CFA0]"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="partPayment" className="block text-sm font-semibold text-gray-700">Part Payment Percentage</label>
                                                        <input
                                                            name='partPayment'
                                                            id="partPayment"
                                                            type="number"
                                                            
                                                            onChange={handleChargesFormDataChange}
                                                            className="w-full mt-2 p-3 border border-gray-300 rounded shadow-sm focus:ring-[#09CFA0] focus:border-[#09CFA0]"
                                                        />
                                                    </div>
                                                </div>
                                                <div className='mt-4 grid grid-cols-2  gap-4'>
                                                    <div>
                                                        <label htmlFor="phlebotomistPercentage" className="block text-sm font-semibold text-gray-700">Phlebotomist Percentage</label>
                                                        <input
                                                            name='phlebotomistPercentage'
                                                            id="phlebotomistPercentage"
                                                            type="number"
                                                            
                                                            onChange={handleChargesFormDataChange}
                                                            className="w-full mt-2 p-3 border border-gray-300 rounded shadow-sm focus:ring-[#09CFA0] focus:border-[#09CFA0]"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="doctorsPercentage" className="block text-sm font-semibold text-gray-700">Doctors Percentage</label>
                                                        <input
                                                            name='doctorsPercentage'
                                                            id="doctorsPercentage"
                                                            type="number"
                                                            
                                                            onChange={handleChargesFormDataChange}
                                                            className="w-full mt-2 p-3 border border-gray-300 rounded shadow-sm focus:ring-[#09CFA0] focus:border-[#09CFA0]"
                                                        />
                                                    </div>
                                                </div>
                                                <div className='mt-4 grid grid-cols-2  gap-4'>
                                                    <div>
                                                        <label htmlFor="serviceCharge" className="block text-sm font-semibold text-gray-700">Service Charge</label>
                                                        <input
                                                            name='serviceCharge'
                                                            id="serviceCharge"
                                                            type="number"
                                                            
                                                            onChange={handleChargesFormDataChange}
                                                            className="w-full mt-2 p-3 border border-gray-300 rounded shadow-sm focus:ring-[#09CFA0] focus:border-[#09CFA0]"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="chargePerDistance" className="block text-sm font-semibold text-gray-700">Distance Charge</label>
                                                        <input
                                                            name='chargePerDistance'
                                                            id="chargePerDistance"
                                                            type="number"
                                                            
                                                            onChange={handleChargesFormDataChange}
                                                            className="w-full mt-2 p-3 border border-gray-300 rounded shadow-sm focus:ring-[#09CFA0] focus:border-[#09CFA0]"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <label htmlFor="consultationCharge" className="block text-sm font-semibold text-gray-700">Consultation Charge</label>
                                                    <input
                                                        name='consultationCharge'
                                                        id="consultationCharge"
                                                        type="number"
                                                        
                                                        onChange={handleChargesFormDataChange}
                                                        className="w-full mt-2 p-3 border border-gray-300 rounded shadow-sm focus:ring-[#09CFA0] focus:border-[#09CFA0]"
                                                    />
                                                </div>
                                                <div className="mt-4">
                                                    <label htmlFor="consultationDiscount" className="mt-4 block text-sm font-semibold text-gray-700">Consultation Discount Percentage</label>
                                                    <input
                                                        id="consultationDiscount"
                                                        type="number"
                                                        placeholder=""
                                                        name='consultationDiscount'
                                                        onChange={handleChargesFormDataChange}
                                                        className="w-full mt-2 p-3 border border-gray-300 rounded shadow-sm"
                                                    />
                                                </div>
                                                <div className="mt-4">
                                                    <label htmlFor="budgetPerDistance" className="mt-4 block text-sm font-semibold text-gray-700">Logistic Budget per km</label>
                                                    <input
                                                        id="budgetPerDistance"
                                                        type="number"
                                                        
                                                        name='budgetPerDistance'
                                                        onChange={handleChargesFormDataChange}
                                                        className="w-full mt-2 p-3 border border-gray-300 rounded shadow-sm"
                                                    />
                                                </div>
                                                <button className=" bg-[#08AC85] text-white text-[14px] py-2 rounded px-3 mt-6 hover:bg-green-600 transition-colors">
                                                    Save changes
                                                </button>
                                            </form>

                                        </div>
                                    </div>
                                    <div className="  px-8 py-4 bg-white rounded-lg shadow-md">
                                        <div className="grid  grid-cols-[70%_15%] gap-[15%]">
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-800">Current Charges</h2>
                                                <p className="text-sm text-gray-600">
                                                    {chargesData?.getCharges?.admin.user.firstName} {chargesData?.getCharges?.admin.user.lastName} updated this last
                                                </p>
                                            </div>
                                            

                                        </div>


                                        <div className="mt-6">
                                            <div className="flex justify-between items-center border-t py-4">
                                                <div>
                                                    <h3 className="font-medium text-gray-700">Referral Percentage</h3>
                                                    <p className="text-xs text-gray-500">referral bonus percentage</p>
                                                </div>
                                                <p className="px-6 py-1 text-[#08AC85] border-2 border-[#08AC85] bg-white  rounded hover:bg-green-600 hover:text-white">
                                                    {chargesData?.getCharges?.referralBonusPercentage}%
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-center border-t py-4">
                                                <div>
                                                    <h3 className="font-medium text-gray-700">Service charge</h3>
                                                    <p className="text-xs text-gray-500">General service charge </p>
                                                </div>
                                                <p className="px-6 py-1 text-[#08AC85] border-2 border-[#08AC85] bg-white  rounded hover:bg-green-600 hover:text-white">
                                                    {formatMoney(chargesData?.getCharges?.serviceCharge)}
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-center border-t py-4">
                                                <div>
                                                    <h3 className="font-medium text-gray-700">charge Per Distance</h3>
                                                    <p className="text-xs text-gray-500">Patient charge per km to facility</p>
                                                </div>
                                                <p className="px-6 py-1 text-[#08AC85] border-2 border-[#08AC85] bg-white  rounded hover:bg-green-600 hover:text-white">
                                                    {formatMoney(chargesData?.getCharges?.chargePerDistance)}
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-center border-t py-4">
                                                <div>
                                                    <h3 className="font-medium text-gray-700">Part Payment</h3>
                                                    <p className="text-sm text-gray-500">Percentage of total request</p>
                                                </div>
                                                <p className="px-2 py-1 text-[#08AC85] border-2 border-[#08AC85] bg-white  rounded hover:bg-green-600 hover:text-white">
                                                    {chargesData?.getCharges?.partPayment}%
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-center border-t py-4">
                                                <div>
                                                    <h3 className="font-medium text-gray-700">Consultation charge</h3>
                                                    <p className="text-xs text-gray-500">Consultation charge per 30 min</p>
                                                </div>
                                                <p className="px-6 py-1 text-[#08AC85] border-2 border-[#08AC85] bg-white  rounded hover:bg-green-600 hover:text-white">
                                                    {formatMoney(chargesData?.getCharges?.consultationCharge)}
                                                </p>
                                            </div>       
                                            <div className="flex justify-between items-center border-t py-4">
                                                <div>
                                                    <h3 className="font-medium text-gray-700">Consultation Discount</h3>
                                                    <p className="text-xs text-gray-500">Consultation discount for test users</p>
                                                </div>
                                                <p className="px-6 py-1 text-[#08AC85] border-2 border-[#08AC85] bg-white  rounded hover:bg-green-600 hover:text-white">
                                                    {formatMoney(chargesData?.getCharges?.consultationDiscount)}
                                                </p>
                                            </div> 


                                            <div className="flex justify-between items-center border-t py-4">
                                                <div>
                                                    <h3 className="font-medium text-gray-700">Logistics Budget</h3>
                                                    <p className="text-xs text-gray-500">Logistics budget per km to facility</p>
                                                </div>
                                                <p className="px-2 py-1 text-[#08AC85] border-2 border-[#08AC85] bg-white  rounded hover:bg-green-600 hover:text-white">
                                                    {formatMoney(chargesData?.getCharges?.budgetPerDistance)}
                                                </p>
                                            </div>
                                            
                                            <div className="flex justify-between items-center border-t py-4">
                                                <div>
                                                    <h3 className="font-medium text-gray-700">Phlebotomist percentage</h3>
                                                    <p className="text-sm text-gray-500">Percentage of test total paid to phleb</p>
                                                </div>
                                                <p className="px-2 py-1 text-[#08AC85] border-2 border-[#08AC85] bg-white  rounded hover:bg-green-600 hover:text-white">
                                                    {chargesData?.getCharges?.phlebotomistPercentage}%
                                                </p>
                                            </div>
                                                    
                                            <div className="flex justify-between items-center border-t py-4">
                                                <div>
                                                    <h3 className="font-medium text-gray-700">Doctors percentage</h3>
                                                    <p className="text-sm text-gray-500">Percentage of test total paid to phleb</p>
                                                </div>
                                                <p className="px-2 py-1 text-[#08AC85] border-2 border-[#08AC85] bg-white  rounded hover:bg-green-600 hover:text-white">
                                                    {chargesData?.getCharges?.doctorsPercentage}%
                                                </p>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>

                                {/* Two-factor Authentication Section */}
                                

                            </div>
                                )
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Settings
