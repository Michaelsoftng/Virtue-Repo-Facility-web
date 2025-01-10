/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ChangeEvent, useEffect, useState } from 'react';
import { TestModalProps } from '@/src/partials/tables/NewRequesTable';

export interface ITestModalProps extends TestModalProps{
    id?: string
}
interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    test: TestModalProps | null
    handleEditTest: (id: string, data: TestModalProps) => void
}
const EditTestModal: React.FC<EditModalProps> = ({ isOpen, onClose, test, handleEditTest }) => {
    const [formData, setFormData] = useState<TestModalProps | null>(null);
    useEffect(() => {
        if (test) {
            const numericString = test?.percentage_increase as string
            const numericValue = parseFloat(numericString.replace('%', ''));
            test.percentage_increase = numericValue;  
        }
    }, [test]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onClose()
        handleEditTest(test!.id as string, formData as TestModalProps);
    };
    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (!name) {
            console.warn("Input is missing a name attribute. Ignoring this change.");
            return;
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]:
                name === 'percentage_increase' || name === 'minimum_increase'
                    ? (isNaN(parseFloat(value)) ? '' : parseFloat(value))
                    : value,
        }) as TestModalProps);
        
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
                                value={test?.name}
                                onChange={handleFormChange} 
                                
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                Percentage increase
                            </label>

                            <input
                                style={{ appearance: 'textfield' }}  // Removes number input spinner
                                type="number"  // Change to text instead of number
                                value={test?.percentage_increase}
                                name="percentage_increase"
                                className="appearance-none mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                onChange={handleFormChange}// Handling as string
                                
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                                Minimum increase
                            </label>
                            <input
                                type="number"  // Change to text instead of number
                                step='100'
                                value={test?.minimum_increase}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                name="minimum_increase"
                                onChange={handleFormChange}

                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                                Test Type (Hours)
                            </label>
                            <select
                                onChange={handleFormChange}
                                name="test_type"
                                id="group"
                                required
                                className="mt-2 font-semibold text-sm block text-[#B2B7C2] bg-[#e2e4e873]  border-solid border-2 border-gray-300 rounded w-full px-3 py-[14px]"
                            >
                                <option defaultValue="facility">Select a Test Type</option>
                                <option value="Laboratory">Laboratory Tests</option>
                                <option value="Radiology">Radiology Tests</option>
                                <option value="others">Others</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="preparation" className="block text-sm font-medium text-gray-700">
                                Group
                            </label>
                            <select
                                onChange={handleFormChange}
                                name="group"
                                id="group"
                                required
                                className="mt-2 font-semibold text-sm block text-[#B2B7C2] bg-[#e2e4e873]  border-solid border-2 border-gray-300 rounded w-full px-3 py-[14px]"
                            >
                                <option defaultValue="facility">Select a Test group</option>
                                <option value="chemistry">Chemistry Tests</option>
                                <option value="genetic">Genetic Tests</option>
                                <option value="imaging">Imaging Tests</option>
                                <option value="molecular">Molecular Tests</option>
                                <option value="microbiological">Microbiological Tests</option>
                                <option value="hematology">Hematology Tests</option>
                                <option value="immunology">Immunology and Serology Tests</option>
                                <option value="endoscopic">Endoscopic Tests</option>
                                <option value="electrodiagnostic">Electrodiagnostic Tests</option>
                                <option value="biopsy">Biopsy and Histopathology Tests</option>
                                <option value="urine-stool">Urine and Stool Tests</option>
                                <option value="pulmonary">Pulmonary Function Tests</option>
                                <option value="others">Others</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
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

export default EditTestModal;
