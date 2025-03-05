'use client'
import React from 'react';
import { TableData } from '@/src/types/TableData.type';
import Link from 'next/link';
import RoundedImage from '../RoundedImage';
import RoundedNoImage from '../RoundedNoImage';
import '@/public/assets/css/custom.css'
export type TableProps = {
    tableData: TableData[];
    
    // children: React.ReactNode,
    // actionLink: string
};
const colorCombination = [
    'bg-red-500 text-white',
    'bg-blue-800 text-yellow-500',
    'bg-yellow-500 text-black',
    'bg-green-500 text-white',
]

function formatMoney(amount: number ) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
    }).format(amount);
}

const RequestTable: React.FC<TableProps> = ({ tableData }) => {
    console.log(tableData)
    const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];
    return (
        <div className="mt-6 container mx-auto rounded-lg  bg-white shadow-md box-shadow: 0 4px 6px -1px rgb(34 0 0 / 0.1), 0 2px 4px -2px rgb(34 0 0 / 0.1);">
         
            {/* Table */}
            <div className="overflow-x-auto  shadow-md w-full pr-4">
                <div className="flex justify-between py-4 pl-6">
                    <h2 className="font-bold text-black text-lg">Recent requests</h2>
                    <Link href='#' className="text-[#08AC85] font-bold">view all</Link>
                </div>
                <table className="w-full">
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                column === 'id' ? null : (
                                    <th
                                        key={column}
                                        className="px-6 py-8 capitalize border-gray-400 text-left text-sm leading-4 text-black  tracking-wider"
                                    >
                                        {column}
                                    </th>
                                )
                            ))}  
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, index) => (

                            <tr key={index} className='border-solid border-2'>

                                {columns.map((column) => {
                                    switch (column) {
                                        case 'patients':
                                            return (
                                                <td key={column} className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm">
                                                    <div className="grid grid-cols-[50px_calc(100%-50px)] gap-2">
                                                        <div>
                                                            {row[column][0] ? (
                                                                <RoundedImage userimage={row[column][0]} classes="rounded-full w-[40px] h-[40px]" width={30} height={30} />
                                                            ) : (
                                                                <RoundedNoImage
                                                                    text={row[column][1]
                                                                        .split(' ')
                                                                            .map((word: string) => word[0].toUpperCase())
                                                                        .join('')
                                                                    }
                                                                    classes={`rounded-full w-[40px] h-[40px] ${colorCombination[Math.floor(Math.random() * 4)]} text-center flex items-center justify-center`}
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="text-[#231935bd]">{row[column][1]}
                                                            <br /> <span className="text-[#727A8B]">{row[column][2]}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            );
                                        case 'amount':
                                            return (
                                                <td key={column} className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm">
                                                    {/* Custom content for phlebotomist */}
                                                    <div>   <span className="text-[#434D64]">{formatMoney(row[column])}</span></div>
                                                </td>
                                            );

                                        case 'phlebotomist':
                                            return (
                                                <td key={column} className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm">
                                                    <div className="grid grid-cols-[50px_calc(100%-50px)] gap-2">
                                                        <div>
                                                            {row[column][0] ? (
                                                                <RoundedImage userimage={row[column][0]} classes="rounded-full w-[40px] h-[40px]" width={30} height={30} />
                                                            ) : (
                                                                <RoundedNoImage
                                                                    text={row[column][1]
                                                                        .split(' ')
                                                                            .map((word: string) => word[0].toUpperCase())
                                                                        .join('')
                                                                    }
                                                                    classes={`rounded-full w-[40px] h-[40px] ${colorCombination[Math.floor(Math.random() * 4)]} text-center flex items-center justify-center`}
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="text-[#231935bd]">{row[column][1]}
                                                            <br /> <span className="text-[#727A8B]">{row[column][2]}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            );

                                        case 'sample_status':
                                            return (
                                                <td key={column} className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm">
                                                    {/* Custom content for status */}
                                                    <span className={`status-indicator ${row[column].toLowerCase()} text-md capitalize px-2 py-2 rounded`}>
                                                        {row[column]}
                                                    </span>
                                                </td>
                                            );

                                        default:
                                            return (
                                                <td key={column} className="px-6 py-4  whitespace-no-wrap border-b border-gray-200 text-sm">
                                                    {/* Default case for other columns */}
                                                    <span className="text-[#434D64] font-bold">{row[column]}</span>
                                                </td>
                                            );
                                    }
                                })}

                         

                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>


        </div>
    );
};

export default RequestTable;
