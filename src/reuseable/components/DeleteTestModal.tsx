import React from 'react';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;

}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-[#7f7f7fc2] bg-opacity-50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="bg-white shadow-lg w-[400px] rounded-md p-6 z-20">
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-center">Confirm Delete</h3>
                </div>
                <p className="text-center mb-6">Are you sure you want to delete this item?</p>
                <div className="flex justify-around">
                    <button
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded-md"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
