import React from 'react';

const Preloader = () => {
    return (
        <div className="items-center justify-center bg-transparent text-white z-50">
            <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce delay-200"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-400"></div>
            </div>
        </div>
    );
};

export default Preloader;
