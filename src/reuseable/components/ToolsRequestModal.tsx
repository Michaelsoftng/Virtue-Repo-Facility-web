import React from 'react';

interface ConfirmApproveModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;

}

const ConfirmApproveModal: React.FC<ConfirmApproveModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-[#7f7f7fc2] bg-opacity-50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="bg-white shadow-lg w-fullrounded-md p-6 z-20">
                <div>
                    <h1>Inventory supply</h1>
                    <p>Allocate supply to phlebotomist</p>
                </div>
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-center">Confirm Approval</h3>
                </div>
                <p className="text-center mb-6">Are you sure you want to approve this item?</p>
                <div className="flex justify-around">
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded-md"
                        onClick={onConfirm}
                    >
                        Approve
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmApproveModal;
