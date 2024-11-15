'use client'
import React, { useState } from 'react';
import { TableData } from '@/src/types/TableData.type';
import Link from 'next/link';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { BsThreeDots } from "react-icons/bs";
import RoundedImage from '@/src/partials/RoundedImage';


export type TableProps = {
    tableData: TableData[];
    // children: React.ReactNode,
    // actionLink: string
};

const RequestTable: React.FC<TableProps> = ({ tableData }) => {

    // const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const rowsPerPage = 10; // Number of rows per page

    // const handleDropdownToggle = (index: number) => {
    //     setDropdownOpen(dropdownOpen === index ? null : index);
    // };





    const paginatedData = tableData
    const totalPages = Math.ceil(paginatedData.length / rowsPerPage);
    // const currentData = paginatedData.slice(
    //     (currentPage - 1) * rowsPerPage,
    //     currentPage * rowsPerPage
    // );
    const handlePageChange = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
        // setCurrentPage(pageNumber);
    };

    const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

    const filteredData = paginatedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    return (
        <div className="container mx-auto ">
         
            {/* Table */}
            <div className="overflow-x-auto xl:h-[63vh] shadow-md w-full pr-4">
                <table className="w-full ">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                column === 'id' ? null : (
                                    <th
                                        key={column}
                                        className="px-6 py-3 border-b-2 border-gray-400 bg-[#1b6d9c] text-left text-sm leading-4 text-white uppercase tracking-wider"
                                    >
                                        {column}
                                    </th>
                                )
                            ))}  
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((row, index) => (

                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                                {columns.map((column) => (
                                    column === 'patients' ? 
                                        (
                                            <td key={column} className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm">
                                                {row[column][0] ? (
                                                    <RoundedImage userimage={row[column][0]} classes='rounded w-10' width={30} height={30} />
                                                ) : (
                                                    <span>No</span>
                                                )}

                                                {row[column][1]} <br /> {row[column][2]}
                                            </td>
                                        )
                                        : (
                                        <td key={column} className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm">
                                            {row[column]}
                                        </td>
                                    )
                                ))}

                                {columns.map((column) => (
                                    column === 'id' ? (

                                        <td key={column} className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 relative">

                                            <div key={column} className="flex justify-between gap-4">
                                                <button className="text-green-500">
                                                    <FaEdit />
                                                </button>
                                                <button className="text-red-500">
                                                    <RiDeleteBin5Fill />
                                                </button>
                                                <Link href={`staffs/${row[column]}`} className="w-[100px] text-[#1b6d9c] py-1 px-3 text-sm">
                                                    <BsThreeDots />
                                                </Link>
                                            </div>

                                        </td>
                                    ) : null
                                ))}


                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex justify-end mt-4">
                    {/* <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded-lg bg-[#1b6d9c] text-white"
                    >
                        First Page
                    </button> */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded-lg text-[#1b6d9c]"
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`mx-1 px-3 py-1 border rounded-lg ${currentPage === index + 1 ? 'bg-[#1b6d9c] text-white' : 'bg-white text-[#1b6d9c]'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded-lg bg-[#1b6d9c] text-white"
                    >
                        Next
                    </button>
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded-lg  text-[#1b6d9c]"
                    >
                        Last Page
                    </button>
                </div>

            </div>


        </div>
    );
};

export default RequestTable;
