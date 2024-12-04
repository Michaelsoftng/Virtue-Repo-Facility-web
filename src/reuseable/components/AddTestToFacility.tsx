
import { IFacilityTest } from '@/src/interface';
import { TestModalProps } from '@/src/partials/tables/NewRequesTable';

import React, { ChangeEvent, useEffect, useState } from 'react';



interface AddModalProps {
    handleSubmitFacilityTest: (data: IFacilityTest) => void
    isOpen: boolean;
    onClose: () => void;
    test: TestModalProps | null;
    facilityId: string;

}

const AddTestToFacility: React.FC<AddModalProps> = ({ handleSubmitFacilityTest, isOpen, onClose, test, facilityId }) => {
    const [formData, setFormData] = useState<IFacilityTest | null>(null);
    useEffect(() => {
        if (test && facilityId) {
            setFormData({
                test: test.id as string,
                facility: facilityId
            });
        }
    }, [test, facilityId]);
    console.log(formData)

    
    
    const handleSubmit = async (e: React.FormEvent) => {
       e.preventDefault();
        // // Handle form submission here
        console.log(formData)
        handleSubmitFacilityTest(formData as IFacilityTest);
    };


    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (!name) {
            console.warn("Input is missing a name attribute. Ignoring this change.");
            return;
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'price' ? parseFloat(value) : value,
        }) as IFacilityTest);

        
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
                            Add test
                        </h3>
                        <p className="text-[#525c76] text-sm  generalSans mt-2">Add test to facility</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-[#525c7691] font-thin text-3xl border px-2 py-0 rounded"
                    >
                        &times; {/* Close button icon */}
                    </button>
                </div>
                <div className="p-4">
                    <form onSubmit={handleSubmit} method='post'>
                        <div className="mb-4">
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                Test
                            </label>
                            <input
                                type="hidden"
                                value={test?.id}
                                required
                                name='test'
                                onChange={handleFormChange}
                            />
                            <input
                                type="hidden"
                                value={facilityId}
                                required
                                name='facility'
                                onChange={handleFormChange}
                            />
                            <input
                                style={{ appearance: 'textfield' }}  // Removes number input spinner
                                type="text"  // Change to text instead of number
                                id="test"
                                className="appearance-none mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={test?.name}
                                onChange={handleFormChange}  // Handling as string
                                required
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                Amount
                            </label>

                            <input
                                style={{ appearance: 'textfield' }}  // Removes number input spinner
                                type="text"  // Change to text instead of number
                                name="price"
                                className="appearance-none mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                onChange={handleFormChange}// Handling as string
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                                Duration (Hours)
                            </label>
                            <input
                                type="text"
                                id="duration"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                name="duration"
                                onChange={handleFormChange}
                                
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="preparation" className="block text-sm font-medium text-gray-700">
                                Preparation
                            </label>
                            <textarea
                                name="preparation"
                                id="preparation"
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
                                Add
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTestToFacility;
