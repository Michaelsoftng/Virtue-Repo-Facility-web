'use client'
import React, { useState } from 'react';
import { TableData } from '@/src/types/TableData.type';
import '@/public/assets/css/custom.css'
import Image from 'next/image';
import PDFImage from '@/public/assets/images/utilities/pdf.png'
import ConfirmDeleteModal from '@/src/reuseable/components/DeleteTestModal';

export type TableProps = {
    tableData: TableData[];
    // children: React.ReactNode,
    // actionLink: string
};
function formatDateTime(dateString: string): string {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString('en-GB'); // 12/10/1990 format (dd/mm/yyyy)

    const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };
    const formattedTime = date.toLocaleTimeString('en-US', options);

    return `${formattedDate} ${formattedTime}`;
}

const FileTable: React.FC<TableProps> = ({ tableData }) => {
    const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const showModalFunc = (dataIndex: number, modalType: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const dataToDisplay = tableData[dataIndex]
        switch (modalType) {
            
            case 'remove':
                setShowDeleteModal(true)
                break;
            
            default:
                break;
        }
    }
    return (
        <div className="mt-6 container mx-auto rounded-lg  bg-white shadow-md box-shadow: 0 4px 6px -1px rgb(34 0 0 / 0.1), 0 2px 4px -2px rgb(34 0 0 / 0.1);">

            {/* Table */}
            <div className="overflow-x-auto  shadow-md w-full pr-4">
                <table className="w-full">
                    <thead>
                        <tr>
                            {columns.map((column) => {
                                switch (column) {
                                    case 'file':
                                        return (
                                            <th
                                                key={column}
                                                className="px-6 py-8 capitalize border-gray-400 text-left text-sm leading-4 text-black  tracking-wider"
                                            >
                                                File name
                                            </th>
                                        );
                                    default:
                                        return (
                                            <th
                                                key={column}
                                                className="px-6 py-8 capitalize border-gray-400 text-left text-sm leading-4 text-black  tracking-wider"
                                            >
                                                {column}
                                            </th>
                                        );
                                }  
                            })}
                            <th
                                key="actions"
                                className="px-6 py-8 capitalize border-gray-400 text-left text-sm leading-4 text-black tracking-wider"
                            >
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, index) => (

                            <tr key={index} className='border-solid border-2'>

                                {columns.map((column) => {
                                    switch (column) {
                                       
                                        case 'file':
                                            return (
                                                <td
                                                    key={column}
                                                    className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm"
                                                >
                                                    <div className="flex gap-4">
                                                        {/* Assuming row['file'][1] is always the PDF */}
                                                        <Image src={PDFImage} alt="" width={35} />
                                                        <p className="mt-1 text-[#08AC85] font-medium">
                                                            {row[column][1]} {/* Displaying 'document.pdf' */}
                                                        </p>
                                                    </div>
                                                </td>
                                            );

                                        case 'date':
                                            return (
                                                <td key={column} className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm font-thin">
                                                    <span className="text-center text-[#525C76]  text-md capitalize px-2 py-2 rounded font-thin">
                                                        {formatDateTime(row[column])}
                                                    </span>
                                                </td>
                                            );

                                        default:
                                            return (
                                                <td key={column} className="px-6 py-4  whitespace-no-wrap border-b border-gray-200 text-sm">
                                                    {/* Default case for other columns */}
                                                    <span className="text-[#525C76] ">{row[column]}</span>
                                                </td>
                                            );
                                    }
                                })}
                                <td key="actions" className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm">
                                   
                                    <div className="flex justify-between gap-2 w-[150px]">
                                        <button className="px-4 py-1 border-2 border-[#B2B7C2] rounded text-[#B71938]" onClick={() => showModalFunc(index, 'remove')}>Remove</button>
                                    </div>
                                
                                     


                                </td>


                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

        <ConfirmDeleteModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={() => console.log('cllosed')} />

        </div>
    );
};

export default FileTable;
