/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { TestModalProps } from '@/src/partials/tables/NewRequesTable';

export interface ITestModalProps extends TestModalProps{
    id?: string
}
interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    test: TestModalProps | null
    handleEditPackage: (id: string, data: TestModalProps) => void
}
const EditTestModal: React.FC<EditModalProps> = ({ isOpen, onClose, test, handleEditPackage }) => {
    const [amount, setAmount] = useState<number>(0);
    const [formData, setFormData] = useState<TestModalProps | null>(null);
    const [duration, setDuration] = useState<string>('');
    const [preparation, setPreparation] = useState<string>('');
    useEffect(() => {
        if (test ) {
                setFormData({
                    name: test?.name as string, 
                    description: test?.description,
                    percentage_increase: test?.percentage_increase as number,
                    minimum_increase: test?.minimum_increase as number,
    
                });
            }
    }, [test]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onClose()
        handleEditPackage(test!.id as string, formData as TestModalProps);
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
                        <p className="text-[#525c76] text-sm  generalSans mt-2">Edit facility test information</p>
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
                            <label htmlFor="string" className="block text-sm font-medium text-gray-700">
                                Name 
                            </label>
                           
                            <input
                                style={{ appearance: 'textfield' }}  // Removes number input spinner
                                type="text"  // Change to text instead of number
                                id="amount"
                                className="appearance-none mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={test?.name}
                                onChange={(e) => setAmount(parseFloat(e.target.value))}  // Handling as string
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
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="preparation" className="block text-sm font-medium text-gray-700">
                                Preparation
                            </label>
                            <textarea
                                id="preparation"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={preparation}
                                onChange={(e) => setPreparation(e.target.value)}
                                rows={3}
                                required
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
