/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ChangeEvent, useEffect, useState } from 'react';
import { FacilityTestProps, TestModalProps } from '@/src/partials/tables/NewRequesTable';

export interface ITestModalProps extends TestModalProps{
    id?: string
}

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    test: FacilityTestProps | null
    handleEditTest: (data: FacilityTestProps) => void
}

export interface FacilityTestData {
    id?: string;
    test?: string;
    facilityPrice?: number;
    duration?: number;
    preparation?: string;

} 

const EditFacilityTestModal: React.FC<EditModalProps> = ({ isOpen, onClose, test, handleEditTest }) => {
    const [formData, setFormData] = useState<FacilityTestData | null>(null);
    console.log(test)
    useEffect(() => {
        setFormData({
            id: test?.id,
            test: test?.test ,
            duration: parseInt(test?.duration as string) as number,
            preparation: test?.preparation,
            facilityPrice: parseFloat(test?.amount as string)  as number,

        });
    }, [test]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onClose()
        handleEditTest( formData as TestModalProps);
    };

    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (!name) {
            console.warn("Input is missing a name attribute. Ignoring this change.");
            return;
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }) as FacilityTestData);
        
    };
    

    if (!isOpen) return null; // If the modal is closed, render nothing

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-[#7f7f7fc2] bg-opacity-50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div
                title="Patient Modal Card"
                className="bg-white shadow-lg w-[500px] rounded z-20 h-auto generalSans"
            >
                <div className="mt-4 py-2 flex justify-between items-center px-4">
                    <div>
                        <h3 className="text-black text-xl  font-semibold generalSans">
                            Edit test
                        </h3>
                        <p className="text-[#525c76] text-sm  generalSans mt-2">Edit test information</p>
                    </div>
                    
                    <button
                        onClick={onClose}
                        className="text-[#525c7691] font-thin text-3xl border px-2 py-0 rounded"
                    >
                        &times; {/* Close button icon */}
                    </button>
                </div>
                <div className="p-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name 
                            </label>
                           
                            <input
                                name='name'
                                style={{ appearance: 'textfield' }}  // Removes number input spinner
                                type="text"  // Change to text instead of number
                                id="name"
                                className="appearance-none mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={formData?.test}
                                onChange={handleFormChange} 
                                
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                Amount
                            </label>

                            <input
                                style={{ appearance: 'textfield' }}  // Removes number input spinner
                                type="number"  // Change to text instead of number
                                value={formData?.facilityPrice}
                                name="facilityPrice"
                                className="appearance-none mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                onChange={handleFormChange}// Handling as string
                                
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                                Duration
                            </label>
                            <input
                                type="number"  // Change to text instead of number
                                step='100'
                                value={formData?.duration}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                name="duration"
                                onChange={handleFormChange}

                            />
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Preparation
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                onChange={handleFormChange}
                                rows={3}

                            />
                        </div>
                        

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="border-2 border-[#08AC85] text-[#08AC85] py-1 px-4 rounded hover:bg-[#08AC85] hover:text-white"
                            >
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditFacilityTestModal;
