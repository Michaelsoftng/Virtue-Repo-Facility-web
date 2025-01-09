"use client"
import React, { ChangeEvent, useCallback, useState } from 'react'
import BreadCrump from '@/src/reuseable/components/BreadCrump'
import AdminHeader from '@/src/reuseable/components/AdminHeader'
import AdminMenu from '@/src/reuseable/components/AdminMenu'
import * as Form from '@radix-ui/react-form'
import { FiUpload } from 'react-icons/fi'
import { useMutation } from '@apollo/client'
import { CreatePackageManual, CreatePackageUpload } from '@/src/graphql/mutations'
import client from '@/lib/apolloClient';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Loading from '../../loading'
import { IoIosWarning } from 'react-icons/io'

export interface PackageData  {
    package_name: string;
    description?: string;
    percentage_increase: number;
    minimum_increase: number;
};


const NewTest = () => {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [activeTab, setActiveTab] = useState<string>('manualaddtest')
    const [formData, setFormData] = useState<PackageData | null>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }) as PackageData);
        console.log(formData)
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]); // Save the file to state
        }
    };

    const disableSubmitBtn = useCallback((): boolean => {
        return !formData || 
            !formData.package_name || !formData.percentage_increase || !formData.minimum_increase;
    }, [ formData]);


    const [newPackage, { loading: packageLoading }] = useMutation(CreatePackageManual, {
        variables: {
            ...formData as PackageData,
        },
        client,
    });

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(packageLoading);

        if (disableSubmitBtn()) {
            toast.error("Fill all input boxes in the form");
            return;
        }
        try {
            await newPackage({
                onCompleted(data) {
                    console.log(data)
                    toast.success('You created a new bundle test, you can now add tests to this bundle');
                    router.push('/admin/dashboard/packages');
                },
                onError(error) {
                    toast.error(error.message);
                },
            });
        } catch (err) {
            console.error('Error creating bundle test:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    const binaryString = reader.result as string;

                    try {
                        // Encode the binary string as Base64
                        const base64String = `data:text/csv;base64,${btoa(unescape(encodeURIComponent(binaryString)))}`;
                        resolve(base64String);
                    } catch (error) {
                        reject(new Error("Error encoding the file to Base64"));
                    }
                } else {
                    reject(new Error("FileReader result is null."));
                }
            };

            reader.onerror = (error) => reject(error);
            reader.readAsText(file); // Read as text to capture the CSV file content
        });
    };

    const [newUploadPackage, { loading: testUploadLoading }] = useMutation(CreatePackageUpload, {
        client,
    });

    const handleTestUpload = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!file) {
            alert("Please upload a valid csv file");
            return;
        }

        try {
            // Convert file to Base64
            const base64String = await fileToBase64(file);
            // console.log(base64String)
            await newUploadPackage({
                variables: {
                    file: base64String,
                },
                onCompleted(data) {
                    if (!data?.CreatePackageUpload.packagesCreated && !data?.CreatePackageUpload.packagesCreated) {
                        toast.error('An error occurred! contact technical support');
                    }
                    if (data?.CreatePackageUpload.packagesCreated.length < 1) {
                        toast.success('You uploaded these packages before');
                    } else {
                        toast.success('You uploaded new test packages');
                    }
                    
                    router.push('/admin/dashboard/packages');
                },
                onError(error) {
                    toast.error(error.message);
                },
            });
        } catch (error) {
            // console.error("Error processing file:", error);
            toast("There was an error processing the file.");
        }
    };
    if (testUploadLoading ) {
                return <Loading />;
        }
    return (
        <div>
            <AdminHeader />
            <div className="grid grid-cols-[250px_calc(100%-250px)]">
                <AdminMenu />
                <div className="bg-gray-100">
                    <BreadCrump pageWrapper="Dashboard &nbsp;&nbsp;/&nbsp;&nbsp;Packages" pageTitle="Add Package" showExportRecord={true} />

                    <div className="px-8 py-4  gap-8">
                        
                        <div>
                            <button className="px-4 py-2 bg-[#B2B7C2] w-[200px] mr-2" onClick={() => setActiveTab('manualaddtest')}>manual add package</button>
                            <button className="px-4 py-2 bg-[#b5b5b67c] w-[200px]" onClick={() => setActiveTab('automaticaddtest')}>use csv</button>
                        </div>

                        {
                            activeTab === 'manualaddtest'
                                ? (
                        
                                    <Form.Root method='post' onSubmit={handleFormSubmit}>
                                        <div className="w-full  grid grid-cols-[50%_50%]  gap-x-3 px-4 py-3">

                                            <div className="">
                                                <h3 className="text-black font-bold">Bundle Test information</h3>
                                                <Form.Field name='package_name' className="mt-4">
                                                    <Form.Label><span className="text-sm font-semibold text-[#B2B7C2]">Package name</span></Form.Label>
                                                    <Form.Control
                                                        required={true}
                                                        onChange={handleFormChange}
                                                        type='text'
                                                        className="mt-2 font-bold text-sm block text-[#B2B7C2] bg-[#e2e4e873] border-solid border-2 border-gray-300 rounded w-full px-3 py-3" />
                                                </Form.Field>


                                                <Form.Field name='minimum_increase' className="mt-4">
                                                    <Form.Label><span className="text-sm font-semibold text-[#B2B7C2]">minimum increase amount</span></Form.Label>
                                                    <Form.Control
                                                        required={true}
                                                        onChange={handleFormChange}
                                                        type='number'
                                                        className="mt-2 font-bold text-sm block text-[#B2B7C2] bg-[#e2e4e873] border-solid border-2 border-gray-300 rounded w-full px-3 py-3"
                                                    />
                                                    <Form.Message
                                                        className="text-sm text-red-500 grid grid-cols-[25px_calc(100%-25px)] mt-1 font-semibold"
                                                        match={(error) => error === "typeMismatch" || error === "valueMissing"}
                                                    >
                                                        <IoIosWarning className="text-[19px]" /> <span>Enter a minimum amount for the test price argumenting</span>
                                                    </Form.Message>
                                                </Form.Field>
                                                <Form.Field name='percentage_increase' className="mt-4">
                                                    <Form.Label><span className="text-sm font-semibold text-[#B2B7C2]">percentage increase</span></Form.Label>
                                                    <Form.Control
                                                        required={true}
                                                        onChange={handleFormChange}
                                                        type='number'
                                                        className="mt-2 font-bold text-sm block text-[#B2B7C2] bg-[#e2e4e873] border-solid border-2 border-gray-300 rounded w-full px-3 py-3" />
                                                    <Form.Message
                                                        className="text-sm text-red-500 grid grid-cols-[25px_calc(100%-25px)] mt-1 font-semibold"
                                                        match={(error) => error === "typeMismatch" || error === "valueMissing"}
                                                    >
                                                        <IoIosWarning className="text-[19px]" /> <span>Enter a percentage increase for the test price argumenting</span>
                                                    </Form.Message>
                                                </Form.Field>
                                                
                                                
                                            </div>
                                            <div>
                                                <h3 className="text-black font-bold">More information</h3>
                                                
                                               
                                                <Form.Field name='description' className="mt-4">
                                                    <Form.Label><span className="text-sm font-bold text-[#B2B7C2]">Package description</span></Form.Label>
                                                    <Form.Control asChild className="mt-2 py-1 px-2 text-sm text-black  border-solid block border-2 rounded border-gray-300 w-[100%] mx-auto">
                                                        <textarea name='description' className="Textarea bg-[#e2e4e873] " placeholder='enter test description here' rows={12} onChange={handleFormChange} />
                                                    </Form.Control>
                                                </Form.Field>

                                            
                                            </div>
                                        </div>

                                        <div className="flex justify-start w-full pl-5 pt-5">
                                            <Form.Submit className="border-2 border-[#08AC85] px-10 py-2 text-sm text-[#08AC85] rounded hover:bg-[#08AC85] hover:text-white disabled:bg-[#08ac865b]" disabled={disableSubmitBtn() || isLoading}>Add bundle test</Form.Submit>
                                        </div>

                                    </Form.Root>
                                )
                                :
                                (
                                    <Form.Root onSubmit={handleTestUpload}>
                                        <div className="w-full gap-x-3 px-4 py-3">

                                            <div className="">
                                                <h3 className="text-black font-bold">Upload test CSV</h3>
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
                                                            accept=".csv"
                                                            onChange={handleFileChange}
                                                            className="hidden"
                                                        />
                                                    </div>

                                                </div>
                                                
                                            </div>
                                            
                                        </div>

                                        <div className="flex justify-start w-full pl-5 pt-5">
                                            <Form.Submit className="border-2 border-[#08AC85] px-10 py-1 text-sm text-[#08AC85] rounded hover:bg-slate-800" >Add test</Form.Submit>
                                        </div>

                                    </Form.Root>
                                )
                        
                        }
                    </div>
                   
                </div>
            </div>
        </div>

    )
}

export default NewTest
