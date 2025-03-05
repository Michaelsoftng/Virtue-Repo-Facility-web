
import { CreateNewFacilityPackage } from '@/src/interface';
import { PackageModalProps } from '@/src/partials/tables/NewRequesTable';
import React, { ChangeEvent, useEffect, useState } from 'react';



interface AddModalProps {
    handleSubmitFacilityTest: (data: CreateNewFacilityPackage) => void
    isOpen: boolean;
    onClose: () => void;
    packages: PackageModalProps | null;
    facilityId: string;

}

const AddPackageToFacility: React.FC<AddModalProps> = ({ handleSubmitFacilityTest, isOpen, onClose, packages, facilityId }) => {
    const [formData, setFormData] = useState<CreateNewFacilityPackage | null>(null);
    useEffect(() => {
        if (packages && facilityId) {
            setFormData({
                package: packages.id as string,
                facility: packages.package_name as string,
                facilityPrice: 0.0,
            });
        }
    }, [packages, facilityId]);
 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onClose()
        handleSubmitFacilityTest(formData as CreateNewFacilityPackage);
    };


    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (!name) {
            console.warn("Input is missing a name attribute. Ignoring this change.");
            return;
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'facilityPrice' ? parseFloat(value) : value,
        }) as CreateNewFacilityPackage);

        
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
                            Add Package
                        </h3>
                        <p className="text-[#525c76] text-sm  generalSans mt-2">Add Package to facility</p>
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
                                Package
                            </label>
                            
                            <input
                                style={{ appearance: 'textfield' }}  // Removes number input spinner
                                type="text"  // Change to text instead of number
                                id="test"
                                className="appearance-none mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={packages?.package_name}
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
                                name="facilityPrice"
                                className="appearance-none mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                onChange={handleFormChange}// Handling as string
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

export default AddPackageToFacility;
