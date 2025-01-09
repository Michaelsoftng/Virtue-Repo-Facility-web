
import React, { ChangeEvent, useEffect, useState } from 'react';

export interface IpackageData{
    id?: string
    packageName?: string;
    description?: string | null;
    percentage_increase?: number;
    minimum_increase?: number;
}
interface PackageDataL {
    package_name?: string;
    description?: string | null;
    percentage_increase?: number;
    minimum_increase?: number;
};

interface EditPackageModalProps {
    handleEditPackage: (id: string, data: PackageDataL) => void
    isOpen: boolean;
    onClose: () => void;
    packageData: IpackageData | null;
}

const EditPackageModal: React.FC<EditPackageModalProps> = ({ handleEditPackage, isOpen, onClose, packageData }) => {
    console.log(packageData)
    const [formData, setFormData] = useState<PackageDataL | null>(null);
    useEffect(() => {
        if (packageData ) {
            setFormData({
                package_name: packageData.packageName as string, 
                description: packageData.description,
                percentage_increase: packageData.percentage_increase as number,
                minimum_increase: packageData.minimum_increase as number,

            });
        }
    }, [packageData]);
 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onClose()
        handleEditPackage(packageData!.id as string, formData as PackageDataL);
    };


    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (!name) {
            console.warn("Input is missing a name attribute. Ignoring this change.");
            return;
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: (name === 'percentage_increase' || name === 'minimum_increase') ? parseFloat(value) : value,
        }) as IpackageData);

        
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
                            Edit Package
                        </h3>
                        <p className="text-[#525c76] text-sm  generalSans mt-2">Edit bundle test details</p>
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
                                Package Name
                            </label>
                            
                            <input
                                style={{ appearance: 'textfield' }}  // Removes number input spinner
                                type="text"  // Change to text instead of number
                                id="test"
                                name='package_name'
                                className="appearance-none mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                value={packageData?.packageName}
                                onChange={handleFormChange}  // Handling as string
                                required
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                Percentage increase
                            </label>

                            <input
                                style={{ appearance: 'textfield' }}  // Removes number input spinner
                                type="text"  // Change to text instead of number
                                step='0.1'
                                value={ packageData?.percentage_increase}
                                name="percentage_increase"
                                className="appearance-none mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                onChange={handleFormChange}// Handling as string
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                                Minimum increase
                            </label>
                            <input
                                type="number"  // Change to text instead of number
                                step='100'
                                value={packageData?.minimum_increase}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                name="minimum_increase"
                                onChange={handleFormChange}
                                
                            />
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
                                Update Package
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPackageModal;
