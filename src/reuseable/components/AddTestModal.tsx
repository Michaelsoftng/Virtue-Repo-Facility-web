import { TestModalProps } from '@/src/partials/tables/NewRequesTable';
import React, { useState } from 'react';
interface AddModalProps {
    isOpen: boolean;
    onClose: () => void;
    modalDetails: TestModalProps | null
}

const AddTestModal: React.FC<AddModalProps> = ({ isOpen, onClose, modalDetails }) => {
    const [amount, setAmount] = useState<number>(0);
    const [duration, setDuration] = useState<string>('');
    const [preparation, setPreparation] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log({ amount, duration, preparation });
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
                        <p className="text-[#525c76] text-sm  generalSans mt-2">add test to facility</p>
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
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                Test
                            </label>
                            <input
                                type="hidden"
                                value={modalDetails?.id}
                                required
                                
                            />
                            <input
                                style={{ appearance: 'textfield' }}  // Removes number input spinner
                                type="text"  // Change to text instead of number
                                id="test"
                                className="appearance-none mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={modalDetails?.test}
                                onChange={(e) => setAmount(parseFloat(e.target.value))}  // Handling as string
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
                                id="amount"
                                className="appearance-none mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={amount}
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
                                Add
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddTestModal;
