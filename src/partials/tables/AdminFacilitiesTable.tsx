/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { ChangeEvent, useState } from 'react';
import { TableData } from '@/src/types/TableData.type';
import RoundedImage from '../RoundedImage';
import RoundedNoImage from '../RoundedNoImage';
import '@/public/assets/css/custom.css';
import EditTestModal from '@/src/reuseable/components/EditTestModal';
import AddTestModal from '@/src/reuseable/components/AddTestModal';
import ConfirmDeleteModal from '@/src/reuseable/components/DeleteTestModal';
import Link from 'next/link';
import ConfirmApproveModal from '@/src/reuseable/components/ApproveModal';
import TestRequestModal from '@/src/reuseable/components/TestRequestModal';

export interface TestModalProps {
    id?: string
    test?: string
    code?: string
    description?: string | null
}

export type AdminFacilitiesTableProps = {
    deleteAction: () => void
    approveAction: () => void,
    viewMoreAction?: () => void,
    setItemToDelete: (id: string) => void
    tableData: TableData[];
    dataCount?: number,
    tableHeadText: string,
    showActions: boolean
    testPage?: string
    marginTop?: string
    showPagination: boolean
    searchBoxPosition?: string,
    showTableHeadDetails?: boolean,
    children?: React.ReactNode
};

export const colorCombination = [
    'bg-red-500 text-white',
    'bg-blue-800 text-yellow-500',
    'bg-yellow-500 text-black',
    'bg-green-500 text-white',
];

function formatMoney(amount: number) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
    }).format(amount);
}

export function formatDateTime(dateString: string): string {
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString('en-GB'); // 12/10/1990 format (dd/mm/yyyy)

    const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };
    const formattedTime = date.toLocaleTimeString('en-US', options); // 09:45 am format

    return `${formattedDate} ${formattedTime}`;
}

function formatWord(word: string) {
    return word.replace(/_/g, " ");
}



// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AdminFacilitiesTable: React.FC<AdminFacilitiesTableProps> = ({ tableData, dataCount,
    marginTop, showPagination, showActions, 
    deleteAction, setItemToDelete, searchBoxPosition, approveAction, viewMoreAction,
    showTableHeadDetails, children,
    testPage, tableHeadText
}) => {
    
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const rowsPerPage = 10;
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showApproveModal, setShowApproveModal] = useState<boolean>(false);
    const [showTestRequestModal, setShowTestRequestModal] = useState<boolean>(false);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [activeData, setActiveData] = useState<TestModalProps | null>(null)

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to page 1 on search
    };
    // Filter the data based on the search term
    const filteredData = tableData.filter((row) => {
        return Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const totalPages = Math.ceil(dataCount as number / rowsPerPage);
    const currentData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handlePageChange = (direction: 'prev' | 'next') => {
        if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (direction === 'next' && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];


    const showModalFunc = (dataIndex: number, modalType: string, id?:string) => {
        const dataToDisplay = tableData[dataIndex]
        
        switch (modalType) {
            case 'edit':
                setShowEditModal(true)
                break;
            case 'remove':
                setItemToDelete(id as string)
                setShowDeleteModal(true)
                break;
            case 'approve':
                setItemToDelete(id as string)
                setShowApproveModal(true)
                break;
            case 'addTest':
                setActiveData(dataToDisplay)
                setShowAddModal(true)
                break;
            case 'viewTestRequest':
                setShowTestRequestModal(true)
                break;

            default:
                break;
        }
    }

    const handleDelete = () => {
        setShowDeleteModal(false)
        deleteAction()
        
    }

    const handleApprovaal = () => {
        setShowApproveModal(false)
        approveAction()
    }

    console.log('tableData', tableData)
    return (
        <div className={`${marginTop ? marginTop : "mt-[-20px]"} container mx-auto `}>

            
            <div className="flex justify-between my-4">
                {showTableHeadDetails && 
                    <div>
                        <h2 className="text-lg font-bold">{tableHeadText }</h2>
                    </div>
                }
                <div className={`flex  ${searchBoxPosition ? searchBoxPosition : "justify-end" } `}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-inset focus:ring-[#1b6d9c]"
                    />

                </div>

            </div>

            {tableData.length == 0
                ?
                <div className="w-full text-center flex justify-center  text-black font-semibold text-2xl  shadow-md h-[300px] pr-4 rounded-lg bg-white"> <p className="mt-[130px]">No data to show</p></div>
                 :
                
                (<div className="overflow-x-auto shadow-md w-full pr-4 rounded-lg bg-white">
                
                    {children && children}

                    <table className="w-full">
                        <thead>
                            <tr>
                                {columns.map((column) =>
                                    column === 'id' ? null : (
                                        <th
                                            key={column}
                                            className="first:pl-4 px-2 py-6 capitalize border-gray-100 text-left text-sm leading-4 text-black tracking-wider"
                                        >
                                            {formatWord(column)}
                                        </th>
                                    )
                                )}
                                {showActions && (
                                    <th
                                        key="actions"
                                        className="px-2 py-6 capitalize border-gray-400 text-left text-sm leading-4 text-black tracking-wider"
                                    >
                                        Action
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((row, index) => (
                                <tr key={index} className="border-solid border-2 border-gray-100">
                                    {columns.map((column) => {
                                        
                                        switch (column) {
                                            
                                            
                                            case 'patients':
                                                
                                                return (
                                                    <td key={column} className=" px-2 py-2 whitespace-no-wrap border-b border-gray-100 text-sm font-light">
                                                        <div className="grid grid-cols-[50px_calc(100%-50px)] gap-2">
                                                            <div>
                                                                {row[column][0] ? (
                                                                    <RoundedImage userimage={row[column][0]} classes="rounded-full w-[40px] h-[40px]" width={30} height={30} />
                                                                ) : (
                                                                    <RoundedNoImage
                                                                        text={row[column][1]
                                                                            .split(' ')
                                                                            .map((word: string) => word[0].toUpperCase())
                                                                            .join('')}
                                                                        classes={`rounded-full w-[40px] h-[40px] ${colorCombination[Math.floor(Math.random() * 4)]} text-center flex items-center justify-center`}
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="text-[#231935bd]">
                                                                {row[column][1]}
                                                                <br /> <span className="text-[#727A8B]">{row[column][2]}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                );
                                            case 'staff':

                                                return (
                                                    <td key={column} className=" px-2 py-2 whitespace-no-wrap border-b border-gray-100 text-sm font-light">
                                                        <div className="grid grid-cols-[50px_calc(100%-50px)] gap-2">
                                                            <div>
                                                                {row[column][0] ? (
                                                                    <RoundedImage userimage={row[column][0]} classes="rounded-full w-[40px] h-[40px]" width={30} height={30} />
                                                                ) : (
                                                                    <RoundedNoImage
                                                                        text={row[column][1]
                                                                            .split(' ')
                                                                            .map((word: string) => word[0].toUpperCase())
                                                                            .join('')}
                                                                        classes={`rounded-full w-[40px] h-[40px] ${colorCombination[Math.floor(Math.random() * 4)]} text-center flex items-center justify-center`}
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="text-[#231935bd]">
                                                                {row[column][1]}
                                                                <br /> <span className="text-[#727A8B]">{row[column][2]}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                );
                                            case 'amount':
                                                return (
                                                    <td key={column} className="first:pl-4 px-2 py-2 whitespace-no-wrap border-b border-gray-200 text-sm font-thin">
                                                        <div>
                                                            <span className="text-[#434D64]">{formatMoney(row[column])}</span>
                                                        </div>
                                                    </td>
                                                );
                                            case 'balance':
                                                return (
                                                    <td key={column} className="first:pl-4 px-2 py-2 whitespace-no-wrap border-b border-gray-200 text-sm font-thin">
                                                        <div>
                                                            <span className="text-[#434D64]">{formatMoney(row[column])}</span>
                                                        </div>
                                                    </td>
                                                );
                                            case 'paid':
                                                return (
                                                    <td key={column} className="first:pl-4 px-2 py-2 whitespace-no-wrap border-b border-gray-200 text-sm font-thin">
                                                        <div>
                                                            <span className="text-[#434D64]">{formatMoney(row[column])}</span>
                                                        </div>
                                                    </td>
                                                );

                                            case 'referralBonus':
                                                return (
                                                    <td key={column} className="first:pl-4 px-2 py-2 whitespace-no-wrap border-b border-gray-200 text-sm font-thin">
                                                        <div>
                                                            <span className="text-[#434D64]">{formatMoney(row[column])}</span>
                                                        </div>
                                                    </td>
                                                );
                                            case 'phlebotomist':
                                                return (
                                                    <td key={column} className="px-2 py-2 whitespace-no-wrap border-b border-gray-200 text-sm ">
                                                        <div className="grid grid-cols-[50px_calc(100%-50px)] gap-2">
                                                            <div>
                                                                {row[column][0] ? (
                                                                    <RoundedImage userimage={row[column][0]} classes="rounded-full w-[40px] h-[40px]" width={30} height={30} />
                                                                ) : (
                                                                    <RoundedNoImage
                                                                        text={row[column][1]
                                                                            .split(' ')
                                                                            .map((word: string) => word[0].toUpperCase())
                                                                            .join('')}
                                                                        classes={`rounded-full w-[40px] h-[40px] ${colorCombination[Math.floor(Math.random() * 4)]} text-center flex items-center justify-center`}
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="text-[#231935bd]">
                                                                {row[column][1]}
                                                                <br /> <span className="text-[#727A8B]">{row[column][2]}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                );
                                                
                                            case 'request_date':
                                                return (
                                                    <td key={column} className="px-2 py-2 whitespace-no-wrap border-b border-gray-200 text-sm font-thin">
                                                        <span className="text-center text-md capitalize px-2 py-2 rounded font-thin">
                                                            {formatDateTime(row[column])}
                                                        </span>
                                                    </td>
                                                );    
                                            case 'date' :
                                                return (
                                                    <td key={column} className="px-2 py-2 whitespace-no-wrap border-b border-gray-200 text-sm font-thin">
                                                        <span className="text-center text-md capitalize px-2 py-2 rounded font-thin">
                                                            {formatDateTime(row[column])}
                                                        </span>
                                                    </td>
                                                );
                                            case 'requestDate':
                                                return (
                                                    <td key={column} className="px-2 py-2 whitespace-no-wrap border-b border-gray-200 text-sm font-thin">
                                                        <span className="text-center text-md capitalize px-2 py-2 rounded font-thin">
                                                            {formatDateTime(row[column])}
                                                        </span>
                                                    </td>
                                                );
                                            
                                                
                                                
                                            case 'sample_status':
                                            case 'result_status':
                                                return (
                                                    <td key={column} className="px-2 py-2 whitespace-no-wrap border-b border-gray-200 text-sm font-thin">
                                                        <span className={`status-indicator ${row[column].toLowerCase()} text-md capitalize px-2 py-2 rounded`}>
                                                            {row[column]}
                                                        </span>
                                                    </td>
                                                );
                                                
                                            case 'verified':
                                                return (
                                                    <td key={column} className="px-2 py-2 whitespace-no-wrap border-b border-gray-200 text-sm font-thin">
                                                        <span className={`status-indicator ${row[column].toLowerCase()} text-md capitalize px-2 py-2 rounded`}>
                                                            {row[column].toLowerCase()}
                                                        </span>
                                                    </td>
                                                );
                                            case 'status':
                                                return (
                                                    <td key={column} className="px-2 py-2 whitespace-no-wrap border-b border-gray-200 text-sm font-thin">
                                                        <span className={`status-indicator ${row[column].toLowerCase()} text-md capitalize px-2 py-2 rounded`}>
                                                            {row[column].toLowerCase()}
                                                        </span>
                                                    </td>
                                                );
                                            case 'is_active':
                                                return (
                                                    <td key={column} className="px-2 py-2 whitespace-no-wrap border-b border-gray-200 text-sm font-thin">
                                                        <span className={`status-indicator ${row[column].toLowerCase()} text-md capitalize px-2 py-2 rounded`}>
                                                            {row[column].toLowerCase()}
                                                        </span>
                                                    </td>
                                                );
                                                
                                            case 'approval':
                                                return (
                                                    <td key={column} className="px-2 py-2 whitespace-no-wrap border-b border-gray-200 text-sm font-thin">
                                                        <span className={`status-indicator ${row[column].toLowerCase()} text-md capitalize px-2 py-2 rounded`}>
                                                            {row[column].toLowerCase()}
                                                        </span>
                                                    </td>
                                                );
                                            
                                                
                                            case 'id':
                                                break;
                                            default:
                                                return (
                                                    <td key={column} className="first:pl-4 px-2 py-2 whitespace-no-wrap border-b border-gray-200 text-sm font-thin">
                                                        <span className="text-[#434D64]">{row[column]}</span>
                                                    </td>
                                                );
                                        }
                                    })}
                                    {showActions && (

                                        <td key="actions" className="px-1 py-4 whitespace-no-wrap border-b border-gray-200 text-sm">
                                            {testPage === 'facilityTest' || testPage === 'tests' &&
                                                
                                                <div className="flex justify-between gap-2 w-[150px]">
                                                    <button className="px-4 py-1 border-2 border-[#B2B7C2] rounded text-[#0F1D40]" onClick={() => showModalFunc(index, 'edit')}>Edit</button>
                                                    <button className="px-4 py-1 border-2 border-[#B2B7C2] rounded text-[#B71938]" onClick={() => showModalFunc(index, 'remove', row.id)}>Remove</button>
                                                </div>
                                                
                                                // <div className="flex justify-between gap-2 w-[150px]">
                                                //     <button className="px-4 py-1 border-2 border-[#08AC85] rounded text-[#08AC85]" onClick={() => showModalFunc(index, 'addTest')}>Add test to facility</button>
                                                // </div>
                                            }

                                            {testPage === 'staffs' &&

                                                <div className="flex justify-between gap-2 w-[150px]">
                                                    {row["status"] !== "approved" &&
                                                        < button className="px-4 py-1 border-2 border-[#B2B7C2] rounded text-[#0F1D40]" onClick={() => showModalFunc(index, 'approve', row.id)}>Approve</button>
                                                    }
                                                    
                                                    <button className="px-4 py-1 border-2 border-[#B2B7C2] rounded text-[#B71938]" onClick={() => showModalFunc(index, 'remove', row.id)}>Remove</button>
                                                </div>

                                                // <div className="flex justify-between gap-2 w-[150px]">
                                                //     <button className="px-4 py-1 border-2 border-[#08AC85] rounded text-[#08AC85]" onClick={() => showModalFunc(index, 'addTest')}>Add test to facility</button>
                                                // </div>
                                            }
                                            {testPage === 'patients' &&
                                                
                                                <div className="flex justify-between gap-2 w-[150px]">
                                                    <Link href={`patients/${row.id}`} className="px-4 py-1 border-2 border-[#B2B7C2] rounded text-[#0F1D40]">View</Link>
                                                </div>
                                            }

                                            {testPage === 'requests' &&

                                                <div className="flex justify-between gap-2 w-[150px]">
                                                    <Link href={`requests/${row.id}`} className="px-4 py-1 border-2 border-[#B2B7C2] rounded text-[#0F1D40]">View</Link>
                                                </div>
                                            }

                                            {testPage === 'phlebotomies' &&

                                                <div className="flex justify-between gap-2 w-[150px]">
                                                    <Link href={`phlebotomies/${row.id}`} className="px-4 py-1 border-2 border-[#B2B7C2] rounded text-[#0F1D40]">View</Link>
                                                </div>
                                            }

                                            {testPage === 'facility' &&

                                                <div className="flex justify-between gap-2 w-[150px]">
                                                    <Link href={`facilities/${row.id}`} className="px-4 py-1 border-2 border-[#B2B7C2] rounded text-[#0F1D40]">View</Link>
                                                </div>
                                            }


                                            {testPage === 'assignPhlebotomist' &&

                                                <div className="flex justify-between gap-2 w-[150px]">
                                                    <button className="px-4 py-1 border-2 border-blue-500 rounded text-blue-500" onClick={() => showModalFunc(index, 'remove', row.id)}>Assign</button>
                                                </div>
                                            }
                                            
                                            {testPage === 'singleFacility' &&

                                                <div className="flex justify-between gap-2 w-[150px]">
                                                    <button className="px-4 py-1 border-2 border-[#B2B7C2] rounded text-[#B71938]" onClick={() => showModalFunc(index, 'remove', row.id)}>Remove</button>
                                                </div>
                                            }
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>)
                }
            {/* Pagination Controls */}
            {
                showPagination && tableData.length > 0

                    ?
                    (<div className="flex justify-between mt-4 w-full">
                        <button
                            onClick={() => handlePageChange('prev')}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-[#b5b5b6] text-[#b5b5b6]"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange('next')}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded-lg border-[#6b6a6a] text-[#6b6a6a]"
                        >
                            Next
                        </button>
                    </div>)
                    :
                    ""

                    
            }
            
            <EditTestModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} modalDetails={activeData} />
            <AddTestModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} modalDetails={activeData} />
            <ConfirmDeleteModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDelete} />
            <ConfirmApproveModal isOpen={showApproveModal} onClose={() => setShowApproveModal(false)} onConfirm={handleApprovaal} />
            
            <TestRequestModal
                isOpen={showTestRequestModal}
                onClose={() => setShowTestRequestModal(false)}
                data={{
                    patientImage: "male.jpg",
                    firstName: "John",
                    lastName: "Doe",
                    email: "john.doe@example.com",
                    request: "Blood test for diabetes and cholesterol",
                    address: "123 Test Street, Sample City, Country",
                    tests: [
                        {
                            test: "Complete Blood Count",
                            patientName: "John Doe",
                            patientAge: 35,
                            resultStatus: "Completed",
                            resultFile: "/results/cbc.pdf"
                        },
                        {
                            test: "Lipid Profile",
                            patientName: "John Doe",
                            patientAge: 35,
                            resultStatus: "Pending",
                            resultFile: "/results/lipid.pdf"
                        },
                        // Add more tests as needed
                    ],
                    phlebotomistName: "Jane Smith",
                    facilityName: "Sample Health Lab",
                }}
            />
        </div>
    );
};

export default AdminFacilitiesTable;



