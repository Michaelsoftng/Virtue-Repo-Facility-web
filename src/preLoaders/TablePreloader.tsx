import React from "react";

const TablePreloader = () => {
  return (
    <div className="w-full space-y-3 mt-5 ">
      {/* Table Header */}
      <div className="flex space-x-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-[45px] w-1/5 bg-gray-200  animate-pulse"
          ></div>
        ))}
      </div>

      {/* Table Body */}
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: 5 }).map((_, cellIndex) => (
            <div
              key={cellIndex}
                  className="px-2 py-2 text-sm font-light h-[45px] w-1/5 bg-gray-200  animate-pulse"
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TablePreloader;
